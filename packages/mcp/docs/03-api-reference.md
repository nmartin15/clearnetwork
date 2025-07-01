# API Reference

## MCPService

The main service class for the MCP server.

### Constructor

```typescript
new MCPService(options: MCPServiceOptions)
```

#### Options

- `port` (number, optional): Port to run the server on (default: 3000)
- `host` (string, optional): Host to bind to (default: '0.0.0.0')
- `auth` (object, optional): Authentication configuration
  - `secret` (string): JWT secret for signing tokens
  - `issuer` (string, optional): Token issuer (default: 'clearnet')
  - `audience` (string, optional): Token audience (default: 'clearnet-agents')
- `logger` (object, optional): Logger instance (default: console)
- `enableMetrics` (boolean, optional): Enable metrics collection (default: true)

### Methods

#### registerAgent

Register an agent with the MCP server.

```typescript
registerAgent(name: string, agent: BaseAgentMCP): void
```

#### start

Start the MCP server.

```typescript
start(): Promise<void>
```

#### stop

Stop the MCP server.

```typescript
stop(): Promise<void>
```

#### getRouter

Get the Koa router instance for custom routes.

```typescript
getRouter(): Router
```
