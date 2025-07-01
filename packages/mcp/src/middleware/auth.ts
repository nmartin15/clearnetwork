import { Context, Next } from 'koa';
import { verify } from 'jsonwebtoken';
import { z } from 'zod';

const AuthConfigSchema = z.object({
  secret: z.string().min(32, 'JWT secret must be at least 32 characters'),
  issuer: z.string().optional(),
  audience: z.string().optional(),
});

export type AuthConfig = z.infer<typeof AuthConfigSchema>;

export class AuthError extends Error {
  constructor(message: string, public status: number = 401) {
    super(message);
    this.name = 'AuthError';
  }
}

export function createAuthMiddleware(config: AuthConfig) {
  const { secret, issuer, audience } = AuthConfigSchema.parse(config);

  return async (ctx: Context, next: Next) => {
    try {
      const authHeader = ctx.headers.authorization;
      
      if (!authHeader) {
        throw new AuthError('Authorization header is required');
      }

      const [scheme, token] = authHeader.trim().split(' ');
      
      if (scheme.toLowerCase() !== 'bearer' || !token) {
        throw new AuthError('Invalid authorization scheme. Use: Bearer <token>');
      }

      // Verify and decode the token
      const payload = verify(token, secret, { 
        issuer,
        audience,
        algorithms: ['HS256']
      });

      // Attach the decoded payload to the context
      ctx.state.user = payload;
      
      await next();
    } catch (error) {
      if (error instanceof AuthError) {
        ctx.status = error.status;
        ctx.body = { error: error.message };
      } else if (error.name === 'JsonWebTokenError') {
        ctx.status = 401;
        ctx.body = { error: 'Invalid token' };
      } else if (error.name === 'TokenExpiredError') {
        ctx.status = 401;
        ctx.body = { error: 'Token has expired' };
      } else {
        ctx.status = 500;
        ctx.body = { error: 'Internal server error' };
        console.error('Auth middleware error:', error);
      }
    }
  };
}
