import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@clearnet/types';
import { config } from '../config';
import { Logger } from '../utils/logger';

export type MCPRequest = {
  user_id: string;
  action: string;
  data?: any;
  metadata?: Record<string, any>;
};

export type MCPResponse = {
  success: boolean;
  data?: any;
  error?: string;
  explanation?: string;
  metadata?: Record<string, any>;
};

type AgentHandler = (request: MCPRequest) => Promise<MCPResponse>;

export class MCPService {
  private logger: Logger;
  private supabase: SupabaseClient<Database>;
  private handlers: Map<string, AgentHandler> = new Map();
  private middleware: Array<
    (req: MCPRequest, res: MCPResponse, next: () => void) => Promise<void>
  > = [];

  constructor() {
    this.logger = new Logger('MCPService');
    this.supabase = createClient<Database>(
      config.supabase.url,
      config.supabase.anonKey
    );
  }

  /**
   * Register a new agent handler
   */
  registerAgent(agentName: string, handler: AgentHandler): void {
    this.handlers.set(agentName, handler);
    this.logger.info(`Registered agent handler: ${agentName}`);
  }

  /**
   * Add middleware function
   */
  use(
    middleware: (req: MCPRequest, res: MCPResponse, next: () => void) => Promise<void>
  ): void {
    this.middleware.push(middleware);
  }

  /**
   * Process an incoming request
   */
  async handleRequest(request: MCPRequest): Promise<MCPResponse> {
    const startTime = Date.now();
    const { action } = request;
    const response: MCPResponse = { success: false };

    try {
      // Find the handler
      const handler = this.handlers.get(action);
      if (!handler) {
        throw new Error(`No handler found for action: ${action}`);
      }

      // Execute middleware
      await this.executeMiddleware(request, response);
      
      // If middleware hasn't sent a response, execute the handler
      if (!response.success && !response.error) {
        const handlerResponse = await handler(request);
        Object.assign(response, handlerResponse);
      }

      // Log the successful action
      await this.logAgentAction({
        agent_name: action,
        action_type: 'mcp_request',
        input_data: request.data || {},
        output_data: response.data || {},
        explanation: response.explanation || 'Request processed successfully',
        confidence_score: 1.0,
        user_id: request.user_id,
      });

      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error processing request: ${errorMessage}`, { error });
      
      return {
        success: false,
        error: errorMessage,
        explanation: 'An error occurred while processing your request',
      };
    } finally {
      const duration = Date.now() - startTime;
      this.logger.debug(`Request processed in ${duration}ms`, {
        action,
        duration,
        success: response.success,
      });
    }
  }

  /**
   * Execute all middleware functions
   */
  private async executeMiddleware(
    req: MCPRequest,
    res: MCPResponse
  ): Promise<void> {
    let index = 0;
    const next = async () => {
      if (index < this.middleware.length) {
        const middleware = this.middleware[index++];
        await middleware(req, res, next);
      }
    };
    
    await next();
  }

  /**
   * Log agent actions to the database
   */
  private async logAgentAction(action: Omit<Database['public']['Tables']['agent_actions']['Insert'], 'id'>) {
    try {
      const { error } = await this.supabase
        .from('agent_actions')
        .insert({
          ...action,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      
      if (error) {
        this.logger.error('Failed to log agent action', { error });
      }
    } catch (error) {
      this.logger.error('Error logging agent action', { error });
    }
  }
}
