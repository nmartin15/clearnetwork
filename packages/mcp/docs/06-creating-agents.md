# Creating Custom Agents

This guide explains how to create and register custom agents with the MCP server.

## Basic Agent Structure

Create a class that extends `BaseAgentMCP`:

```typescript
import { BaseAgentMCP, AgentAction, AgentMetadata } from '@clearnet/mcp';

export class MyAgent extends BaseAgentMCP {
  // Define agent metadata
  getMetadata(): AgentMetadata {
    return {
      name: 'my-agent',
      version: '1.0.0',
      description: 'My custom agent',
    };
  }

  // Define agent actions
  getActions(): Record<string, AgentAction> {
    return {
      'my-action': {
        handler: this.myAction.bind(this),
        schema: {
          input: z.object({
            // Define input schema using Zod
            name: z.string(),
            count: z.number().int().positive().optional(),
          }),
          output: z.object({
            // Define output schema
            success: z.boolean(),
            message: z.string(),
          }),
        },
      },
    };
  }

  // Action handler
  private async myAction(input: any) {
    // Your action logic here
    return {
      success: true,
      message: `Hello, ${input.name}!`,
    };
  }
}
```

## Registering the Agent

```typescript
const myAgent = new MyAgent();
const mcpService = new MCPService(/* options */);

// Register the agent with a unique name
mcpService.registerAgent('my-agent', myAgent);

// Start the server
await mcpService.start();
```

## Agent Lifecycle

1. **Initialization**: Agent is instantiated
2. **Registration**: `registerAgent()` is called
3. **Startup**: `start()` is called on the MCP service
4. **Request Handling**: Actions are executed as requests come in
5. **Shutdown**: `stop()` is called on the MCP service

## Best Practices

- Keep actions small and focused
- Validate all inputs using Zod schemas
- Use dependency injection for services
- Implement proper error handling
- Add logging for important operations
- Write tests for your agent

## Example: Database Agent

```typescript
import { SupabaseClient } from '@supabase/supabase-js';

export class DatabaseAgent extends BaseAgentMCP {
  constructor(private supabase: SupabaseClient) {
    super();
  }

  getMetadata() {
    return {
      name: 'database',
      version: '1.0.0',
      description: 'Database operations agent',
    };
  }

  getActions() {
    return {
      'query': {
        handler: this.query.bind(this),
        schema: {
          input: z.object({
            table: z.string(),
            select: z.string().optional(),
            where: z.record(z.any()).optional(),
          }),
        },
      },
    };
  }

  private async query({ table, select = '*', where = {} }) {
    let query = this.supabase.from(table).select(select);
    
    // Apply where conditions
    Object.entries(where).forEach(([key, value]) => {
      query = query.eq(key, value);
    });

    const { data, error } = await query;
    
    if (error) throw error;
    return { data };
  }
}
```
