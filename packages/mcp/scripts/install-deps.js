const { execSync } = require('child_process');
const path = require('path');

const dependencies = [
  // Core
  'zod',
  'uuid',
  'pino',
  'pino-pretty',
  'koa',
  '@koa/router',
  'koa-bodyparser',
  'jsonwebtoken',
  'prom-client',
  // Development
  '@types/uuid',
  '@types/jsonwebtoken',
  '@types/koa',
  '@types/koa__router',
  '@types/koa-bodyparser',
  '@types/node',
  'typescript',
  'ts-node',
  'tsx',
  'eslint',
  '@typescript-eslint/parser',
  '@typescript-eslint/eslint-plugin',
  'prettier',
];

console.log('Installing MCP package dependencies...');

try {
  // Install production dependencies
  execSync(`pnpm add ${dependencies.slice(0, 12).join(' ')}`, {
    stdio: 'inherit',
    cwd: path.join(__dirname, '../'),
  });

  // Install dev dependencies
  execSync(`pnpm add -D ${dependencies.slice(12).join(' ')}`, {
    stdio: 'inherit',
    cwd: path.join(__dirname, '../'),
  });

  console.log('\n✅ Dependencies installed successfully!');
} catch (error) {
  console.error('\n❌ Failed to install dependencies:', error.message);
  process.exit(1);
}
