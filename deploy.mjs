#!/usr/bin/env node

import { build } from 'esbuild';
import { execSync } from 'child_process';
import { mkdirSync, existsSync, rmSync, writeFileSync } from 'fs';

console.log('Building for deployment...');

// Clean and create directories
if (existsSync('dist')) rmSync('dist', { recursive: true, force: true });
mkdirSync('dist/server', { recursive: true });
mkdirSync('dist/public', { recursive: true });

// Build frontend
console.log('Building frontend...');
execSync('vite build', { stdio: 'inherit' });
console.log('Frontend build completed');

// Build server
console.log('Building server...');
await build({
  entryPoints: ['server/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  format: 'esm',
  outfile: 'dist/server/index.js',
  packages: 'external',
  sourcemap: false,
  minify: false,
  keepNames: true,
  banner: {
    js: `import { createRequire } from 'module';
import { fileURLToPath } from 'url';
const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = require('path').dirname(__filename);`
  },
  define: {
    'process.env.NODE_ENV': '"production"'
  },
  external: [
    'pg-native', 'sqlite3', 'mysql2', 'mysql', 'mssql', 'better-sqlite3',
    'oracledb', 'bufferutil', 'utf-8-validate', 'encoding', 'fsevents'
  ]
});

// Verify builds
if (!existsSync('dist/server/index.js')) {
  throw new Error('Server file not generated at dist/server/index.js');
}

execSync('node --check dist/server/index.js');
console.log('Server build validated');

// Create production package.json
writeFileSync('dist/package.json', JSON.stringify({
  "name": "rest-express-production",
  "version": "1.0.0",
  "type": "module", 
  "main": "server/index.js",
  "scripts": { "start": "node server/index.js" }
}, null, 2));

console.log('Deployment build complete!');
console.log('Server: dist/server/index.js');
console.log('Frontend: dist/public/');
console.log('Config: dist/package.json');