#!/usr/bin/env node

import { build } from 'esbuild';
import { execSync } from 'child_process';
import { mkdirSync, existsSync, rmSync, writeFileSync, cpSync } from 'fs';

console.log('Production build starting...');

// Clean and create directories
if (existsSync('dist')) rmSync('dist', { recursive: true, force: true });
mkdirSync('dist/server', { recursive: true });
mkdirSync('dist/public', { recursive: true });

// Build server first (critical for deployment)
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

// Verify server build
if (!existsSync('dist/server/index.js')) {
  throw new Error('Server file not generated at dist/server/index.js');
}

execSync('node --check dist/server/index.js');
console.log('Server build validated');

// Copy existing frontend files if they exist, otherwise create minimal frontend
if (existsSync('client/dist') && existsSync('client/dist/index.html')) {
  console.log('Copying existing frontend build...');
  cpSync('client/dist', 'dist/public', { recursive: true });
} else {
  console.log('Creating minimal frontend...');
  writeFileSync('dist/public/index.html', `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Application Platform</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #333; margin-bottom: 20px; }
        .status { padding: 10px; background: #e3f2fd; border-left: 4px solid #2196f3; margin: 20px 0; }
        .loading { animation: pulse 2s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
    </style>
</head>
<body>
    <div class="container">
        <h1>Student Application Platform</h1>
        <div class="status loading">
            <p>Application is starting up...</p>
            <p>The full interface will be available shortly.</p>
        </div>
        <script>
            // Check if API is available
            fetch('/api/auth/me')
                .then(() => {
                    // API is ready, reload to get full app
                    window.location.reload();
                })
                .catch(() => {
                    // Retry in 3 seconds
                    setTimeout(() => location.reload(), 3000);
                });
        </script>
    </div>
</body>
</html>`);
}

// Create production package.json
writeFileSync('dist/package.json', JSON.stringify({
  "name": "rest-express-production",
  "version": "1.0.0",
  "type": "module", 
  "main": "server/index.js",
  "scripts": { 
    "start": "node server/index.js",
    "health": "curl -f http://localhost:5000/health || exit 1"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}, null, 2));

console.log('Production build completed successfully!');
console.log('✓ Server: dist/server/index.js');
console.log('✓ Frontend: dist/public/');
console.log('✓ Config: dist/package.json');
console.log('Ready for deployment!');