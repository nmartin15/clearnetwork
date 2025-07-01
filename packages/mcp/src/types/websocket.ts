import { Logger } from './';

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
  logger: Logger;
  send: (message: WebSocketMessage) => Promise<void>;
  broadcast: (message: Omit<WebSocketMessage, 'requestId' | 'clientId'>) => Promise<void>;
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
