import { execSync } from 'child_process';
import { join } from 'path';

// First, install ts-node if not already installed
try {
  execSync('pnpm list ts-node', { stdio: 'ignore' });
} catch {
  console.log('Installing ts-node...');
  execSync('pnpm add -D ts-node typescript @types/node', { stdio: 'inherit' });
}

// Run the install-deps.ts script
console.log('Running dependency installation...');
const cwd = join(__dirname, '../');
execSync('npx ts-node install-deps.ts', { 
  stdio: 'inherit',
  cwd: join(__dirname, '.')
});
