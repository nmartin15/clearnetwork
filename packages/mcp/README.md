# @clearnet/mcp

[![npm version](https://img.shields.io/npm/v/@clearnet/mcp.svg)](https://www.npmjs.com/package/@clearnet/mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Model Context Protocol (MCP) implementation for ClearNet agents, providing a standardized way for AI agents to communicate and coordinate.

## Features

- **Agent Communication**: Standardized protocol for agent-to-agent and agent-to-service communication
- **Authentication**: JWT-based authentication and role-based access control
- **Monitoring**: Built-in metrics and logging
- **Extensible**: Easy to create and register custom agents
- **Type Safe**: Full TypeScript support

## Documentation

1. [Overview](./docs/01-overview.md) - Introduction and core concepts
2. [Setup Guide](./docs/02-setup.md) - Installation and configuration
3. [API Reference](./docs/03-api-reference.md) - Detailed API documentation
4. [Authentication](./docs/04-authentication.md) - Authentication and authorization
5. [Logging & Metrics](./docs/05-logging-metrics.md) - Monitoring and observability
6. [Creating Agents](./docs/06-creating-agents.md) - Guide to building custom agents
7. [API Endpoints](./docs/07-api-endpoints.md) - Complete API reference

## Quick Start

```bash
# Install the package
pnpm add @clearnet/mcp

# Create a simple agent server
```typescript
import { MCPService } from '@clearnet/mcp';

const mcpService = new MCPService({
  port: 3000,
  auth: {
    secret: 'your-secure-jwt-secret'
  }
});

await mcpService.start();
console.log('MCP Server running on port 3000');
```

## Development

```bash
# Install dependencies
pnpm install

# Build the package
pnpm build

# Run tests
pnpm test

# Start in development mode
pnpm dev
```

## Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) before submitting pull requests.

## License

[MIT](LICENSE) ClearNet.

## Overview

This package provides a standardized way to expose AI agents through the Model Context Protocol (MCP), enabling seamless integration with various AI systems and tools.

## Installation

```bash
# Using pnpm (recommended)
pnpm add @clearnet/mcp

# Using npm
npm install @clearnet/mcp

# Using yarn
yarn add @clearnet/mcp
```

## Usage

### Creating an MCP Server

```typescript
import { MCPService } from '@clearnet/mcp';
import { BuilderAgentMCP, ExampleBuilderAgent } from '@clearnet/mcp';

// Initialize your agent
const builderAgent = new ExampleBuilderAgent(supabaseClient);

// Create MCP wrapper for the agent
const builderMCP = new BuilderAgentMCP({
  agent: builderAgent,
  name: 'builder',
});

// Create and start MCP service
const mcpService = new MCPService({
  port: 3000,
  host: '0.0.0.0',
});

// Register agent handlers
const handlers = builderMCP.getHandlers();
for (const [action, handler] of Object.entries(handlers)) {
  mcpService.registerAgent(`builder.${action}`, handler);
}

// Start the server
await mcpService.start();
```

### Making Requests to the MCP Server

```bash
# Create a profile
curl -X POST http://localhost:3000/agents/builder.createProfile \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123",
    "profileData": {
      "fullName": "John Doe",
      "bio": "Software Engineer",
      "avatarUrl": "https://example.com/avatar.jpg"
    }
  }'

# Get a profile
curl -X POST http://localhost:3000/agents/builder.getProfile \
  -H "Content-Type: application/json" \
  -d '{"userId": "user-123"}'
```

## API Reference

### `MCPService`

Main service class for the MCP server.

#### Constructor

```typescript
new MCPService(options: MCPServiceOptions)
```

**Options:**
- `port`: Port number to listen on (default: 3000)
- `host`: Host address to bind to (default: '0.0.0.0')

#### Methods

- `registerAgent(name: string, handler: AgentHandler)`: Register a new agent handler
- `start()`: Start the MCP server
- `stop()`: Stop the MCP server

### `BuilderAgentMCP`

MCP wrapper for the BuilderAgent.

#### Constructor

```typescript
new BuilderAgentMCP(options: BuilderAgentMCPOptions)
```

**Options:**
- `agent`: Instance of a class implementing `BuilderAgentInterface`
- `name`: Agent name (default: 'builder')

#### Methods

- `getHandlers()`: Returns a map of available handler functions

## Development

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Build the package: `pnpm build`
4. Start the development server: `pnpm dev`

## License

MIT
