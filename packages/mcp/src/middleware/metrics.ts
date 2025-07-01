import { Context, Next } from 'koa';
import { Counter, Histogram, Registry } from 'prom-client';

export interface MetricsConfig {
  register: Registry;
  prefix?: string;
  includePath?: boolean;
  includeMethod?: boolean;
  includeStatusCode?: boolean;
  httpDurationBuckets?: number[];
}

export function createMetricsMiddleware(config: MetricsConfig) {
  const {
    register,
    prefix = 'http_',
    includePath = true,
    includeMethod = true,
    includeStatusCode = true,
    httpDurationBuckets = [0.1, 0.5, 1, 2, 5, 10],
  } = config;

  // Create metrics if they don't exist
  const requestCounter = new Counter({
    name: `${prefix}requests_total`,
    help: 'Total number of HTTP requests',
    labelNames: [
      ...(includeMethod ? ['method'] : []),
      ...(includePath ? ['path'] : []),
      ...(includeStatusCode ? ['status_code'] : []),
    ],
    registers: [register],
  });

  const requestDuration = new Histogram({
    name: `${prefix}request_duration_seconds`,
    help: 'HTTP request duration in seconds',
    labelNames: [
      ...(includeMethod ? ['method'] : []),
      ...(includePath ? ['path'] : []),
      ...(includeStatusCode ? ['status_code'] : []),
    ],
    buckets: httpDurationBuckets,
    registers: [register],
  });

  const requestSize = new Histogram({
    name: `${prefix}request_size_bytes`,
    help: 'HTTP request size in bytes',
    labelNames: [
      ...(includeMethod ? ['method'] : []),
      ...(includePath ? ['path'] : []),
    ],
    buckets: [100, 1000, 5000, 10000, 50000],
    registers: [register],
  });

  const responseSize = new Histogram({
    name: `${prefix}response_size_bytes`,
    help: 'HTTP response size in bytes',
    labelNames: [
      ...(includeMethod ? ['method'] : []),
      ...(includePath ? ['path'] : []),
      ...(includeStatusCode ? ['status_code'] : []),
    ],
    buckets: [100, 1000, 10000, 50000, 100000],
    registers: [register],
  });

  return async (ctx: Context, next: Next) => {
    const start = Date.now();
    const path = ctx.path;
    const method = ctx.method;

    // Measure request size if possible
    const contentLength = ctx.request.length;
    if (contentLength) {
      const labels = {
        method: includeMethod ? method : undefined,
        path: includePath ? path : undefined,
      };
      requestSize.observe(labels, contentLength);
    }

    try {
      await next();
    } finally {
      const duration = (Date.now() - start) / 1000; // Convert to seconds
      const statusCode = ctx.status;

      // Prepare labels for metrics
      const labels = {
        method: includeMethod ? method : undefined,
        path: includePath ? path : undefined,
        status_code: includeStatusCode ? statusCode.toString() : undefined,
      };

      // Record metrics
      requestCounter.inc(labels, 1);
      requestDuration.observe(labels, duration);

      // Measure response size if available
      const responseLength = ctx.response.length;
      if (responseLength) {
        responseSize.observe(labels, responseLength);
      }
    }
  };
}

// Create a default metrics registry
export const defaultRegister = new Registry();

// Add default metrics collection
import { collectDefaultMetrics } from 'prom-client';

collectDefaultMetrics({
  register: defaultRegister,
  prefix: 'mcp_',
});
