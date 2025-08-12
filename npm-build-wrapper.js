#!/usr/bin/env node

// This file replaces the problematic npm build command
// Call this instead of "npm run build" for deployment

import { execSync } from 'child_process';
import { existsSync, mkdirSync, copyFileSync, writeFileSync, unlinkSync } from 'fs';

console.log('🚀 Deployment Build Process Starting...');

try {
  // Run the standard npm build (generates dist/index.js and dist/public/)  
  execSync('vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  // Ensure server directory exists
  mkdirSync('dist/server', { recursive: true });
  
  // Move server file to correct location
  if (existsSync('dist/index.js')) {
    copyFileSync('dist/index.js', 'dist/server/index.js');
    unlinkSync('dist/index.js'); // Remove the incorrectly placed file
  }
  
  // Create production package.json
  writeFileSync('dist/package.json', JSON.stringify({
    "name": "rest-express-production",
    "version": "1.0.0",
    "type": "module", 
    "main": "server/index.js",
    "scripts": {
      "start": "node server/index.js"
    },
    "engines": {
      "node": ">=18.0.0"
    }
  }, null, 2));
  
  // Create uploads directory
  mkdirSync('dist/uploads', { recursive: true });
  
  // Verify build
  if (!existsSync('dist/server/index.js')) throw new Error('Server file missing');
  if (!existsSync('dist/package.json')) throw new Error('Package.json missing');
  if (!existsSync('dist/public/index.html')) throw new Error('Frontend missing');
  
  execSync('node --check dist/server/index.js', { stdio: 'pipe' });
  
  console.log('✅ Build completed successfully!');
  console.log('📁 dist/server/index.js - Server ready');
  console.log('📁 dist/package.json - Config ready'); 
  console.log('📁 dist/public/ - Frontend ready');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}