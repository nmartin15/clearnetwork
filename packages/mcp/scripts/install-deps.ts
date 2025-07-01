import { execSync } from 'child_process';
import { join } from 'path';

const dependencies = [
  // Runtime dependencies
  'koa',
  '@koa/router',
  'koa-bodyparser',
  'ws',
  'uuid',
  'jsonwebtoken',
  'pino',
  'prom-client',
  'zod',
  
  // TypeScript type definitions
  '@types/koa',
  '@types/koa__router',
  '@types/koa-bodyparser',
  '@types/ws',
  '@types/uuid',
  '@types/jsonwebtoken',
  '@types/node',
];

function installDependencies() {
  const cwd = join(__dirname, '../');
  
  try {
    console.log('Installing dependencies...');
    execSync(`pnpm add ${dependencies.join(' ')}`, { 
      stdio: 'inherit',
      cwd,
    });
    
    console.log('Dependencies installed successfully!');
  } catch (error) {
    console.error('Failed to install dependencies:', error);
    process.exit(1);
  }
}

installDependencies();
