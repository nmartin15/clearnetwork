import { AgentAction, AgentRoute, AgentMetadata } from './types';
import { WebSocketMessage, WebSocketContext, WebSocketResponse } from './types/websocket';
import { z } from 'zod';
import { Logger } from 'pino';

type WebSocketHandler = (context: WebSocketContext) => Promise<WebSocketResponse>;

export abstract class BaseAgentMCP {
  protected logger: Logger;
  protected webSocketHandlers: Map<string, WebSocketHandler> = new Map();

  constructor(logger?: Logger) {
    this.logger = logger || console as unknown as Logger;
    this.registerDefaultWebSocketHandlers();
  }

  /**
   * Get the agent's metadata
   */
  public abstract getMetadata(): AgentMetadata;

  /**
   * Get the agent's actions
   */
  public abstract getActions(): Record<string, AgentAction>;

  /**
   * Register default WebSocket message handlers
   */
  protected registerDefaultWebSocketHandlers() {
    this.registerWebSocketHandler('ping', async (context) => ({
      type: 'pong',
      requestId: context.requestId,
      payload: {
        timestamp: Date.now(),
      },
    }));
  }

  /**
   * Register a WebSocket message handler
   */
  protected registerWebSocketHandler(type: string, handler: WebSocketHandler) {
    this.webSocketHandlers.set(type, handler);
  }

  /**
   * Handle WebSocket message
   */
  public async handleWebSocketMessage(context: WebSocketContext): Promise<WebSocketResponse> {
    const { type, payload, requestId } = context;
    const handler = this.webSocketHandlers.get(type);

    if (!handler) {
      return {
        type: 'error',
        requestId,
        error: {
          code: 'UNSUPPORTED_MESSAGE_TYPE',
          message: `Unsupported message type: ${type}`,
        },
      };
    }

    try {
      const response = await handler(context);
      return {
        ...response,
        requestId,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error handling WebSocket message ${type}:`, errorMessage);
      
      return {
        type: 'error',
        requestId,
        error: {
          code: 'HANDLER_ERROR',
          message: errorMessage,
          ...(process.env.NODE_ENV === 'development' && {
            stack: error instanceof Error ? error.stack : undefined,
          }),
        },
      };
    }
  }

  /**
   * Get routes for the agent
   */
  public getRoutes(): AgentRoute[] {
    const actions = this.getActions();
    const routes: AgentRoute[] = [];

    // Add a health check endpoint
    routes.push({
      method: 'get',
      path: '/health',
      handler: async (ctx) => {
        ctx.body = {
          status: 'ok',
          agent: this.getMetadata().name,
          timestamp: new Date().toISOString(),
        };
      },
    });

    // Add action endpoints
    for (const [actionName, action] of Object.entries(actions)) {
      routes.push({
        method: 'post',
        path: `/actions/${actionName}`,
        handler: async (ctx) => {
          try {
            const input = ctx.request.body?.input || {};
            
            // Validate input if schema is provided
            if (action.schema) {
              const result = action.schema.safeParse(input);
              if (!result.success) {
                ctx.status = 400;
                ctx.body = {
                  success: false,
                  error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Invalid input',
                    details: result.error.format(),
                  },
                };
                return;
              }
            }

            // Execute the action
            const startTime = Date.now();
            const data = await action.handler(input, ctx);
            const duration = Date.now() - startTime;

            ctx.body = {
              success: true,
              data,
              metadata: {
                duration,
                timestamp: new Date().toISOString(),
              },
            };
          } catch (error) {
            ctx.status = 500;
            ctx.body = {
              success: false,
              error: {
                code: 'INTERNAL_ERROR',
                message: error instanceof Error ? error.message : 'An unknown error occurred',
                ...(process.env.NODE_ENV === 'development' && {
                  stack: error instanceof Error ? error.stack : undefined,
                }),
              },
            };
          }
        },
      });
    }

    return routes;
  }

  /**
   * Lifecycle hook: Called when the agent is registered
   */
  public async onRegister(): Promise<void> {
    // Can be overridden by subclasses
  }

  /**
   * Lifecycle hook: Called when the agent starts
   */
  public async onStart(): Promise<void> {
    // Can be overridden by subclasses
  }

  /**
   * Lifecycle hook: Called when the agent stops
   */
  public async onStop(): Promise<void> {
    // Can be overridden by subclasses
  }

  /**
   * Helper to create a basic action
   */
  protected createAction<TInput = any, TOutput = any>(
    handler: (input: TInput, ctx: any) => Promise<TOutput>,
    options: {
      schema?: z.ZodType<TInput>;
      authenticated?: boolean;
      roles?: string[];
    } = {}
  ): AgentAction {
    return {
      handler: handler as any,
      schema: options.schema,
      authenticated: options.authenticated ?? false,
      roles: options.roles,
    };
  }
}
