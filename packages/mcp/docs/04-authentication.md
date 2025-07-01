# Authentication

The MCP server uses JWT (JSON Web Tokens) for authentication. All API requests must include a valid JWT in the `Authorization` header.

## Obtaining a Token

1. **Local Development**: Use the test token endpoint (only in development)
   ```
   POST /auth/test-token
   ```
   
   Response:
   ```json
   {
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   }
   ```

2. **Production**: Use your authentication service to generate tokens

## Using the Token

Include the token in the `Authorization` header:

```
Authorization: Bearer <your-token>
```

## Token Payload

```typescript
interface TokenPayload {
  sub: string;      // User ID
  name: string;     // User name
  role: string;     // User role
  iat: number;      // Issued at
  exp: number;      // Expiration time
  iss: string;      // Issuer (default: 'clearnet')
  aud: string;      // Audience (default: 'clearnet-agents')
}
```

## Securing Endpoints

Endpoints can be secured by applying the `@authenticated` decorator:

```typescript
import { authenticated } from '@clearnet/mcp/middleware/auth';

class MyAgent extends BaseAgentMCP {
  @authenticated()
  async protectedAction(ctx: Context) {
    // This action requires authentication
  }
}
```

## Role-Based Access Control

You can restrict access by roles:

```typescript
@authenticated({ roles: ['admin', 'agent'] })
async adminAction(ctx: Context) {
  // Only users with 'admin' or 'agent' role can access this
}
```
