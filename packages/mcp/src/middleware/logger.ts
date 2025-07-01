import { Context, Next } from 'koa';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from 'pino';

export interface RequestLoggerOptions {
  logger: Logger;
  logBody?: boolean;
  logHeaders?: boolean;
  excludePaths?: string[];
}

export function createRequestLogger(options: RequestLoggerOptions) {
  const { logger, logBody = false, logHeaders = false, excludePaths = [] } = options;

  return async (ctx: Context, next: Next) => {
    // Skip excluded paths (e.g., health checks)
    if (excludePaths.some(path => ctx.path.startsWith(path))) {
      return next();
    }

    const start = Date.now();
    const requestId = uuidv4();
    
    // Store request ID in context
    ctx.state.requestId = requestId;

    // Log request
    const logData: Record<string, any> = {
      requestId,
      method: ctx.method,
      path: ctx.path,
      ip: ctx.ip,
      userAgent: ctx.headers['user-agent'],
    };

    if (logHeaders) {
      logData.headers = { ...ctx.headers };
      // Remove sensitive headers
      delete logData.headers.authorization;
      delete logData.headers.cookie;
    }

    if (logBody && ctx.request.body) {
      logData.requestBody = ctx.request.body;
    }

    logger.info(logData, 'Incoming request');

    // Add response time header
    ctx.set('X-Request-ID', requestId);

    try {
      await next();
    } catch (error) {
      logger.error({
        requestId,
        error: {
          name: error.name,
          message: error.message,
          stack: process.env.NODE_ENV === 'production' ? undefined : error.stack,
        },
      }, 'Request error');
      throw error;
    }

    const responseTime = Date.now() - start;
    
    // Log response
    const responseLog: Record<string, any> = {
      requestId,
      status: ctx.status,
      responseTime: `${responseTime}ms`,
    };

    if (logBody && ctx.body) {
      responseLog.responseBody = ctx.body;
    }

    // Use appropriate log level based on status code
    if (ctx.status >= 500) {
      logger.error(responseLog, 'Request completed with error');
    } else if (ctx.status >= 400) {
      logger.warn(responseLog, 'Request completed with client error');
    } else {
      logger.info(responseLog, 'Request completed');
    }

    // Add response time header
    ctx.set('X-Response-Time', `${responseTime}ms`);
  };
}
