declare module '@modelcontextprotocol/server' {
  import { EventEmitter } from 'events';
  import { Server } from 'http';
  import { Socket } from 'net';
  import { Server as WebSocketServer } from 'ws';

  export interface MCPServerOptions {
    port?: number;
    host?: string;
    path?: string;
    server?: Server;
    wss?: WebSocketServer;
    pingInterval?: number;
    pingTimeout?: number;
    maxPayload?: number;
    allowRequest?: (
      info: { origin: string; secure: boolean; req: any },
      callback: (res: boolean, code?: number, message?: string) => void,
    ) => void;
  }

  export interface MCPMessage {
    type: string;
    id?: string | number;
    [key: string]: any;
  }

  export interface MCPConnection extends EventEmitter {
    id: string;
    socket: Socket;
    send(message: MCPMessage): void;
    close(code?: number, reason?: string): void;
  }

  export class MCPServer extends EventEmitter {
    constructor(options?: MCPServerOptions);
    
    start(): Promise<void>;
    stop(): Promise<void>;
    broadcast(message: MCPMessage, filter?: (connection: MCPConnection) => boolean): void;
    
    // Event emitter overrides
    on(event: 'connection', listener: (connection: MCPConnection) => void): this;
    on(event: 'close', listener: () => void): this;
    on(event: 'error', listener: (error: Error) => void): this;
    on(event: 'listening', listener: () => void): this;
    on(event: string, listener: (...args: any[]) => void): this;
  }

  export function createServer(options?: MCPServerOptions): MCPServer;
}
