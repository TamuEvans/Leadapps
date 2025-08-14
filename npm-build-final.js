#!/usr/bin/env node

/**
 * FINAL NPM BUILD SCRIPT FOR DEPLOYMENT
 * This replaces the standard npm build to ensure correct deployment structure
 */

import { execSync } from 'child_process';
import { writeFileSync, existsSync, mkdirSync, renameSync, rmSync } from 'fs';

console.log('🚀 PRODUCTION BUILD SCRIPT');
console.log('Building for Replit deployment...\n');

try {
  // Step 1: Clean previous build
  if (existsSync('dist')) {
    console.log('Cleaning previous build...');
    rmSync('dist', { recursive: true, force: true });
  }

  // Step 2: Build frontend with Vite
  console.log('Building frontend with Vite...');
  execSync('npx vite build', { stdio: 'inherit' });
  
  // Step 3: Build backend with esbuild
  console.log('\nBuilding backend with esbuild...');
  execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { stdio: 'inherit' });
  
  // Step 4: Fix structure - Move dist/index.js to dist/server/index.js
  console.log('\nFixing deployment structure...');
  
  if (!existsSync('dist/server')) {
    mkdirSync('dist/server', { recursive: true });
  }
  
  if (existsSync('dist/index.js')) {
    renameSync('dist/index.js', 'dist/server/index.js');
    console.log('✓ Moved backend to dist/server/index.js');
  }
  
  // Step 5: Create production package.json in dist
  const prodPackage = {
    "name": "leadapps-production",
    "version": "1.0.0",
    "type": "module",
    "main": "server/index.js",
    "scripts": {
      "start": "NODE_ENV=production node server/index.js"
    },
    "engines": {
      "node": ">=18.0.0"
    }
  };
  
  writeFileSync('dist/package.json', JSON.stringify(prodPackage, null, 2));
  console.log('✓ Created dist/package.json');
  
  // Step 6: Verify structure
  const requiredFiles = [
    'dist/server/index.js',
    'dist/package.json',
    'dist/public/index.html'
  ];
  
  console.log('\nVerifying build output:');
  let success = true;
  for (const file of requiredFiles) {
    if (existsSync(file)) {
      console.log(`✓ ${file}`);
    } else {
      console.log(`✗ Missing: ${file}`);
      success = false;
    }
  }
  
  if (!success) {
    throw new Error('Build verification failed - missing required files');
  }
  
  console.log('\n✅ BUILD SUCCESSFUL!');
  console.log('Deployment structure is ready.');
  
} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  process.exit(1);
}