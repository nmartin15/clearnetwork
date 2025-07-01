# ClearNet MCP Server

The ClearNet MCP (Model Context Protocol) Server is a powerful backend service that manages agent interactions, handles authentication, and provides a unified API for agent operations.

## Features

- 🚀 Fast and scalable Express.js server
- 🔒 Built-in authentication and authorization
- 📊 Request logging and monitoring
- 📝 Structured logging with Winston
- 🛡️ CORS and security headers
- 🧪 Health check endpoint
- 🔄 Database migrations

## Prerequisites

- Node.js 18+
- pnpm
- Supabase account and project

## Setup

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Configure environment variables**
   Copy `.env.example` to `.env` and update the values:
   ```bash
   cp .env.example .env
   ```

3. **Run database migrations**
   ```bash
   pnpm migrate
   ```

## Development

Start the development server with hot-reload:

```bash
pnpm dev
```

The server will be available at `http://localhost:3001` by default.

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm migrate` - Run database migrations

## API Endpoints

### Health Check

```http
GET /health
```

### Agent Endpoints

#### Create Profile

```http
POST /agents/builder.createProfile
Content-Type: application/json

{
  "user_id": "user-123",
  "data": {
    "name": "John Doe",
    "bio": "Software Developer"
  }
}
```

#### Update Profile

```http
POST /agents/builder.updateProfile
Content-Type: application/json

{
  "user_id": "user-123",
  "data": {
    "bio": "Senior Software Developer"
  }
}
```

#### Get Profile

```http
POST /agents/builder.getProfile
Content-Type: application/json

{
  "user_id": "user-123"
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Node environment | `development` |
| `PORT` | Server port | `3001` |
| `HOST` | Server host | `0.0.0.0` |
| `SUPABASE_URL` | Supabase project URL | - |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | - |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | - |
| `LOG_LEVEL` | Logging level | `info` |

## Project Structure

```
apps/agents/
├── src/
│   ├── agents/               # Agent implementations
│   │   ├── builder.types.ts  # Type definitions
│   │   ├── example-builder.agent.ts  # Example agent
│   │   └── builder-agent.mcp.ts      # MCP protocol implementation
│   ├── services/            # Core services
│   │   └── mcp.service.ts   # MCP service
│   ├── utils/               # Utility functions
│   │   └── logger.ts        # Logging utility
│   ├── config.ts            # Configuration
│   └── mcp-server.ts        # Server entry point
├── migrations/              # Database migrations
└── scripts/                 # Utility scripts
    └── migrate.ts           # Migration runner
```

## License

MIT
