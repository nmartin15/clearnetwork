# Logging & Metrics

## Logging

The MCP server uses Pino for structured logging. By default, logs are written to stdout in a structured JSON format.

### Log Levels

- `fatal`: System is unusable
- `error`: Error conditions
- `warn`: Warning conditions
- `info`: Informational messages
- `debug`: Debug-level messages
- `trace`: Trace-level messages

### Custom Logger

You can provide a custom logger instance:

```typescript
import pino from 'pino';

const logger = pino({
  level: 'debug',
  prettyPrint: process.env.NODE_ENV !== 'production',
});

const mcpService = new MCPService({
  logger,
  // ... other options
});
```

## Metrics

The MCP server collects Prometheus-compatible metrics by default.

### Available Metrics

- `http_requests_total`: Total HTTP requests
- `http_request_duration_seconds`: HTTP request duration in seconds
- `http_request_size_bytes`: HTTP request size in bytes
- `http_response_size_bytes`: HTTP response size in bytes
- `mcp_agent_actions_total`: Total agent actions executed
- `mcp_agent_action_duration_seconds`: Agent action duration in seconds

### Accessing Metrics

Metrics are exposed at the `/metrics` endpoint:

```
GET /metrics
```

### Disabling Metrics

To disable metrics collection:

```typescript
const mcpService = new MCPService({
  enableMetrics: false,
  // ... other options
});
```

### Custom Metrics

You can add custom metrics using the Prometheus client:

```typescript
import { register } from 'prom-client';

const customCounter = new register.Counter({
  name: 'my_custom_metric',
  help: 'Description of my custom metric',
  labelNames: ['label1', 'label2'],
});

// Increment the counter
customCounter.inc({ label1: 'value1', label2: 'value2' });
```
