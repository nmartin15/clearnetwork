import Koa from 'koa';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import http from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { MCPServiceOptions, Logger, AgentRoute, ActionResponse, WebSocketMessage } from './types';
import { BaseAgentMCP } from './BaseAgentMCP';
import { createAuthMiddleware } from './middleware/auth';
import { createRequestLogger } from './middleware/logger';
import { createMetricsMiddleware, defaultRegister as metricsRegister } from './middleware/metrics';

declare module 'koa' {
  interface DefaultState {
    requestId: string;
    user?: any;
  }
}

type WebSocketWithId = WebSocket & { id: string };

export class MCPService {
  private app: Koa;
  private router: Router;
  private server?: http.Server;
  private wss?: WebSocketServer<typeof WebSocket>;
  private agents: Map<string, BaseAgentMCP> = new Map();
  private logger: Logger;
  private options: Required<MCPServiceOptions>;
  private isRunning: boolean = false;

  constructor(options: MCPServiceOptions) {
    this.options = {
      port: options.port || 3000,
      host: options.host || '0.0.0.0',
      auth: options.auth,
      logger: options.logger || console,
      enableMetrics: options.enableMetrics ?? true,
      prefix: options.prefix || '/api/v1',
    };

    this.logger = this.options.logger;
    this.app = new Koa();
    this.router = new Router();

    // Setup middleware
    this.setupMiddleware();
    
    // Setup routes
    this.setupRoutes();
  }

  private setupMiddleware() {
    // Request ID
    this.app.use(async (ctx: Koa.Context, next: Koa.Next) => {
      ctx.state.requestId = uuidv4();
      await next();
    });

    // Error handling
    this.app.use(async (ctx: Koa.Context, next: Koa.Next) => {
      try {
        await next();
      } catch (error: unknown) {
        const err = error as Error & { status?: number; code?: string };
        this.logger.error('Request error', { 
          error: err.message || 'Unknown error',
          stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
          requestId: ctx.state.requestId,
        });

        ctx.status = err.status || 500;
        ctx.body = {
          success: false,
          error: {
            code: err.code || 'INTERNAL_ERROR',
            message: err.message || 'Internal Server Error',
            ...(process.env.NODE_ENV === 'development' && {
              stack: err.stack,
            }),
          },
        };
      }
    });

    // Body parser
    this.app.use(bodyParser({
      enableTypes: ['json'],
      jsonLimit: '10mb',
    }));

    // Authentication
    this.app.use(createAuthMiddleware(this.options.auth));

    // Logging
    if (this.logger) {
      this.app.use(createRequestLogger({
        logger: this.logger,
        logBody: process.env.NODE_ENV === 'development',
        logHeaders: false,
        excludePaths: ['/health', '/metrics'],
      }));
    }

    // Metrics
    if (this.options.enableMetrics) {
      this.app.use(createMetricsMiddleware({
        register: metricsRegister,
      }));
    }
  }

  private setupRoutes() {
    // Health check
    this.router.get('/health', async (ctx: Koa.Context) => {
      ctx.body = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        agents: Array.from(this.agents.keys()),
      };
    });

    // Metrics endpoint
    if (this.options.enableMetrics) {
      this.router.get('/metrics', async (ctx) => {
        ctx.set('Content-Type', metricsRegister.contentType);
        ctx.body = await metricsRegister.metrics();
      });
    }

    // Apply router
    this.app.use(this.router.routes());
    this.app.use(this.router.allowedMethods());
  }

  public registerAgent(name: string, agent: BaseAgentMCP) {
    if (this.agents.has(name)) {
      throw new Error(`Agent with name '${name}' is already registered`);
    }

    const agentRouter = new Router({
      prefix: `${this.options.prefix}/agents/${name}`,
    });

    // Register agent routes
    const routes = agent.getRoutes();
    for (const route of routes) {
      const method = route.method.toLowerCase() as keyof Router;
      if (typeof agentRouter[method] === 'function') {
        (agentRouter[method] as any)(route.path, route.handler);
      } else {
        this.logger.warn(`Unsupported HTTP method: ${route.method} for route ${route.path}`);
      }
    }

    // Register agent router
    this.app.use(agentRouter.routes());
    this.app.use(agentRouter.allowedMethods());

    // Store agent
    this.agents.set(name, agent);
    this.logger.info(`Registered agent: ${name}`);

    // Initialize agent
    agent.onRegister().catch((error: Error) => {
      this.logger.error(`Error initializing agent '${name}':`, error);
    });
  }

  public async start(): Promise<void> {
    if (this.isRunning) {
      throw new Error('Server is already running');
    }

    return new Promise<void>((resolve, reject) => {
      try {
        this.server = http.createServer(this.app.callback());
        this.wss = new WebSocketServer({ 
          server: this.server,
          path: `${this.options.prefix}/ws`,
        });

        // Setup WebSocket server
        this.setupWebSocketServer();

        this.server.listen(this.options.port, this.options.host, () => {
          this.isRunning = true;
          this.logger.info(`MCP Server running on http://${this.options.host}:${this.options.port}`);
          
          // Start all agents
          const agentPromises = Array.from(this.agents.values()).map(agent => 
            agent.onStart().catch(error => {
              this.logger.error(`Agent failed to start: ${error.message}`, {
                error: error.stack,
              });
              // Don't reject the entire startup if an agent fails to start
            })
          );
          
          Promise.all(agentPromises)
            .then(() => resolve())
            .catch(reject);
        });

        this.server.on('error', (error: Error) => {
          this.logger.error('Server error:', error);
          reject(error);
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        this.logger.error('Failed to start server:', errorMessage);
        reject(error);
      }
    });
  }

  public async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    this.logger.info('Stopping MCP Server...');

    try {
      // Stop all agents
      const stopPromises = Array.from(this.agents.values()).map(agent => 
        agent.onStop().catch(error => {
          this.logger.error(`Error stopping agent: ${error.message}`, {
            error: error.stack,
          });
          // Continue stopping other agents even if one fails
        })
      );
      
      await Promise.all(stopPromises);

      // Close WebSocket server
      if (this.wss) {
        // Close all active WebSocket connections
        this.wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.close(1001, 'Server shutting down');
          }
        });
        
        await new Promise<void>((resolve, reject) => {
          this.wss!.close(error => {
            if (error) {
              this.logger.error('Error closing WebSocket server:', error);
              reject(error);
            } else {
              resolve();
            }
          });
        });
        this.wss = undefined;
      }

      // Close HTTP server
      if (this.server) {
        await new Promise<void>((resolve, reject) => {
          this.server!.close((error?: Error) => {
            if (error) {
              this.logger.error('Error closing HTTP server:', error);
              reject(error);
            } else {
              resolve();
            }
          });
        });
        this.server = undefined;
      }

      this.isRunning = false;
      this.logger.info('MCP Server stopped');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error('Error during server shutdown:', errorMessage);
      throw error;
    }
  }

  private setupWebSocketServer() {
    if (!this.wss) return;

    this.wss.on('connection', (ws: WebSocket, req: http.IncomingMessage) => {
      const clientId = uuidv4();
      (ws as WebSocketWithId).id = clientId;
      
      this.logger.debug(`WebSocket client connected: ${clientId}`);

      ws.on('message', (message: WebSocket.RawData) => {
        try {
          const data = JSON.parse(message.toString()) as WebSocketMessage;
          this.handleWebSocketMessage(ws as WebSocketWithId, clientId, data);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          this.logger.error('Error processing WebSocket message:', errorMessage);
          ws.send(JSON.stringify({
            type: 'error',
            error: 'Invalid message format',
            details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
          }));
        }
      });

      ws.on('close', () => {
        this.logger.debug(`WebSocket client disconnected: ${clientId}`);
      });

      ws.on('error', (error: Error) => {
        this.logger.error(`WebSocket error for client ${clientId}:`, error);
      });
    });
  }

  private async handleWebSocketMessage(ws: WebSocketWithId, clientId: string, message: WebSocketMessage) {
    this.logger.debug(`Received WebSocket message from ${clientId}:`, message);
    
    try {
      // Route message to the appropriate agent if specified
      if (message.agent && this.agents.has(message.agent)) {
        const agent = this.agents.get(message.agent)!;
        agent.handleWebSocketMessage({
          type: message.type,
          payload: message.payload,
          clientId,
          requestId: message.requestId,
        })
          .then((response: any) => {
            ws.send(JSON.stringify({
              type: 'response',
              requestId: message.requestId,
              payload: response,
            }));
          })
          .catch((error: Error) => {
            this.logger.error(`Error handling WebSocket message: ${error.message}`, {
              clientId,
              requestId: message.requestId,
              error: error.stack,
            });
            
            ws.send(JSON.stringify({
              type: 'error',
              requestId: message.requestId,
              error: {
                message: error.message,
                code: 'INTERNAL_ERROR',
              },
            }));
          });
      } else {
        // Default echo behavior if no agent is specified
        ws.send(JSON.stringify({
          type: 'response',
          requestId: message.requestId,
          payload: message.payload,
        }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error processing WebSocket message: ${errorMessage}`, {
        clientId,
        requestId: message.requestId,
        error: error instanceof Error ? error.stack : undefined,
      });
      
      ws.send(JSON.stringify({
        type: 'error',
        requestId: message.requestId,
        error: {
          message: 'Failed to process message',
          code: 'PROCESSING_ERROR',
          details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
        },
      }));
    }
  }

  public getRouter(): Router {
    return this.router;
  }

  public getApp(): Koa {
    return this.app;
  }
}
