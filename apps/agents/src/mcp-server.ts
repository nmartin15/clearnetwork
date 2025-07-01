import express, { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@clearnet/types';
import { BuilderAgentMCP } from './agents/builder-agent.mcp';
import { ExampleBuilderAgent } from './agents/example-builder.agent';
import { config } from './config';
import { logger } from './utils/logger';

class ClearNetMCPServer {
  private app: express.Application;
  private mcpService: MCPService;
  private server: any;
  private supabase = createClient<Database>(
    config.supabase.url,
    config.supabase.anonKey
  );

  constructor() {
    this.app = express();
    this.mcpService = new MCPService();
    this.configureMiddleware();
    this.configureRoutes();
  }

  // ... rest of the class implementation ...
}

// Start the server
const server = new ClearNetMCPServer();
server.start().catch((error) => {
  logger.error('Fatal error:', error);
  process.exit(1);
});
