import { Logger as PinoLogger } from 'pino';

export interface Logger {
  info: (message: string, meta?: Record<string, any>) => void;
  error: (message: string, meta?: Record<string, any>) => void;
  warn: (message: string, meta?: Record<string, any>) => void;
  debug: (message: string, meta?: Record<string, any>) => void;
}

export interface AuthConfig {
  secret: string;
  issuer?: string;
  audience?: string;
  algorithms?: string[];
}

export interface MCPServiceOptions {
  port?: number;
  host?: string;
  auth: AuthConfig;
  logger?: Logger | PinoLogger;
  enableMetrics?: boolean;
  prefix?: string;
}

export interface AgentRoute {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  handler: (ctx: any) => Promise<void>;
  middleware?: any[];
}

export interface ActionResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface WebSocketMessage<T = any> {
  type: string;
  requestId: string;
  agent?: string;
  action?: string;
  payload?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface WebSocketContext<T = any> {
  type: string;
  payload: T;
  clientId: string;
  requestId: string;
}

export interface WebSocketResponse<T = any> {
  type: string;
  requestId: string;
  payload?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface AgentConfig {
  name: string;
  version: string;
  description?: string;
  actions?: Record<string, (params: any) => Promise<any>>;
  events?: string[];
  middleware?: any[];
}

export interface AgentState {
  [key: string]: any;
}

export interface AgentContext {
  logger: Logger;
  state: AgentState;
  send: (message: WebSocketMessage) => Promise<void>;
  broadcast: (message: Omit<WebSocketMessage, 'requestId' | 'clientId'>) => Promise<void>;
}
