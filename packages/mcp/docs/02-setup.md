# Setup Guide

## Prerequisites

- Node.js 16+
- pnpm 7+
- ClearNet project setup

## Installation

1. Add the MCP package to your project:

```bash
# From the project root
pnpm add @clearnet/mcp -w
```

2. Install peer dependencies:

```bash
pnpm add @supabase/supabase-js -w
```

## Configuration

Create a `.env` file in your project root:

```env
# Required
JWT_SECRET=your-secure-jwt-secret
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-key

# Optional
MCP_PORT=3000
MCP_HOST=0.0.0.0
NODE_ENV=development
```
