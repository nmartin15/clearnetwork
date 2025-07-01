export interface MCPRequest {
  id: string;
  action: string;
  data: Record<string, any>;
  user_id: string;
  context?: Record<string, any>;
}

export interface MCPResponse {
  id: string;
  success: boolean;
  data?: Record<string, any>;
  error?: string;
  explanation?: string;
  timestamp: string;
}

export type AgentHandler = (request: MCPRequest) => Promise<MCPResponse>;

export interface MCPConfig {
  port: number;
  host: string;
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
}

export interface BaseAgent {
  execute(request: MCPRequest): Promise<MCPResponse>;
}
