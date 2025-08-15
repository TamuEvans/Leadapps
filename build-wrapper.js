#!/usr/bin/env node

/**
 * NPM BUILD FIX
 * This script is called by npm run build and ensures correct deployment structure
 */

import { execSync } from 'child_process';
import { existsSync, mkdirSync, renameSync, copyFileSync, readdirSync, statSync, writeFileSync, rmSync } from 'fs';
import { join } from 'path';

console.log('🔧 NPM BUILD FIX - Ensuring correct deployment structure');
console.log('========================================================\n');

// First, run the original build commands
console.log('Running Vite build...');
try {
  execSync('vite build', { stdio: 'inherit' });
} catch (error) {
  console.error('Vite build failed:', error.message);
  process.exit(1);
}

console.log('\nRunning ESBuild...');
try {
  execSync('esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { stdio: 'inherit' });
} catch (error) {
  console.error('ESBuild failed:', error.message);
  process.exit(1);
}

// Now fix the structure
console.log('\n📦 Fixing deployment structure...');

if (existsSync('dist/index.js') && !existsSync('dist/server/index.js')) {
  // Create server directory
  if (!existsSync('dist/server')) {
    mkdirSync('dist/server', { recursive: true });
  }
  
  // Move index.js to server/
  renameSync('dist/index.js', 'dist/server/index.js');
  console.log('✓ Moved dist/index.js → dist/server/index.js');
  
  // Copy public to server/public
  if (existsSync('dist/public') && !existsSync('dist/server/public')) {
    const copyRecursive = (src, dest) => {
      if (!existsSync(dest)) mkdirSync(dest, { recursive: true });
      readdirSync(src).forEach(item => {
        const srcPath = join(src, item);
        const destPath = join(dest, item);
        if (statSync(srcPath).isDirectory()) {
          copyRecursive(srcPath, destPath);
        } else {
          copyFileSync(srcPath, destPath);
        }
      });
    };
    
    copyRecursive('dist/public', 'dist/server/public');
    console.log('✓ Copied dist/public → dist/server/public');
  }
}

// Create deployment package.json
if (!existsSync('dist/package.json')) {
  const pkg = {
    "name": "leadapps-production",
    "version": "1.0.0",
    "type": "module",
    "main": "server/index.js",
    "scripts": {
      "start": "node server/index.js"
    }
  };
  writeFileSync('dist/package.json', JSON.stringify(pkg, null, 2));
  console.log('✓ Created dist/package.json');
}

console.log('\n✅ Build complete with correct structure!');
console.log('npm start will now work correctly.');