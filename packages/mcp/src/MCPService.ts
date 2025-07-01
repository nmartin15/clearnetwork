import Koa from 'koa';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import pino from 'pino';
import { MCPRequest, MCPResponse, AgentHandler, MCPConfig } from './types';

export class MCPService {
  private app: Koa;
  private router: Router;
  private logger: pino.Logger;
  private agents: Map<string, AgentHandler> = new Map();
  private config: MCPConfig;

  constructor(config: MCPConfig) {
    this.config = config;
    this.app = new Koa();
    this.router = new Router();
    this.logger = pino({
      name: 'mcp-service',
      level: config.logLevel || 'info',
    });

    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware() {
    this.app.use(bodyParser());
    this.app.use(async (ctx, next) => {
      try {
        await next();
      } catch (err: any) {
        this.logger.error({ err, url: ctx.url }, 'Request failed');
        ctx.status = err.status || 500;
        ctx.body = {
          success: false,
          error: err.message || 'Internal server error',
          timestamp: new Date().toISOString(),
        };
      }
    });

    this.app.use(async (ctx, next) => {
      const start = Date.now();
      await next();
      const duration = Date.now() - start;
      this.logger.info({
        method: ctx.method,
        url: ctx.url,
        status: ctx.status,
        duration,
      }, 'Request completed');
    });
  }

  private setupRoutes() {
    this.router.get('/health', (ctx) => {
      ctx.body = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        agents: Array.from(this.agents.keys()),
      };
    });

    this.router.post('/agents/:agentAction', async (ctx) => {
      const { agentAction } = ctx.params;
      const requestId = uuidv4();

      const validation = z.object({
        action: z.string(),
        data: z.record(z.any()),
        user_id: z.string(),
        context: z.record(z.any()).optional(),
      }).safeParse(ctx.request.body);

      if (!validation.success) {
        ctx.status = 400;
        ctx.body = {
          id: requestId,
          success: false,
          error: 'Invalid request format',
          details: validation.error.errors,
          timestamp: new Date().toISOString(),
        };
        return;
      }

      const requestData: MCPRequest = {
        id: requestId,
        ...validation.data,
      };

      const handler = this.agents.get(agentAction);
      if (!handler) {
        ctx.status = 404;
        ctx.body = {
          id: requestId,
          success: false,
          error: Agent action '' not found,
          timestamp: new Date().toISOString(),
        };
        return;
      }

      try {
        const response = await handler(requestData);
        ctx.body = response;
      } catch (error: any) {
        this.logger.error({ error, agentAction, requestId }, 'Agent execution failed');
        ctx.status = 500;
        ctx.body = {
          id: requestId,
          success: false,
          error: error.message || 'Agent execution failed',
          timestamp: new Date().toISOString(),
        };
      }
    });

    this.app.use(this.router.routes());
    this.app.use(this.router.allowedMethods());
  }

  public registerAgent(name: string, handler: AgentHandler): void {
    this.agents.set(name, handler);
    this.logger.info({ agentName: name }, 'Agent registered');
  }

  public unregisterAgent(name: string): boolean {
    const deleted = this.agents.delete(name);
    if (deleted) {
      this.logger.info({ agentName: name }, 'Agent unregistered');
    }
    return deleted;
  }

  public use(middleware: any): void {
    this.app.use(middleware);
  }

  public async start(): Promise<void> {
    return new Promise((resolve) => {
      const server = this.app.listen(this.config.port, this.config.host, () => {
        this.logger.info({
          host: this.config.host,
          port: this.config.port,
        }, 'MCP Service started');
        resolve();
      });

      process.on('SIGTERM', () => {
        this.logger.info('Received SIGTERM, shutting down gracefully');
        server.close(() => {
          this.logger.info('Server closed');
          process.exit(0);
        });
      });
    });
  }

  public async stop(): Promise<void> {
    this.logger.info('Stopping MCP Service');
  }
}
