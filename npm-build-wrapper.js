#!/usr/bin/env node

/**
 * NPM BUILD WRAPPER - Critical Deployment Fix
 * 
 * This script REPLACES the problematic npm run build command
 * ROOT ISSUE: package.json build command creates wrong directory structure
 * SOLUTION: This wrapper creates the correct structure that Replit deployment expects
 */

import { execSync } from 'child_process';
import { writeFileSync, existsSync, mkdirSync, rmSync } from 'fs';

console.log('🔧 NPM Build Wrapper - Creating correct deployment structure...');

try {
  // Step 1: Clean previous build
  if (existsSync('dist')) {
    rmSync('dist', { recursive: true, force: true });
  }

  // Step 2: Build frontend (creates dist/public/)
  console.log('📦 Building frontend...');
  execSync('vite build', { stdio: 'inherit' });

  // Step 3: Create server directory
  mkdirSync('dist/server', { recursive: true });

  // Step 4: Build backend to CORRECT location (not dist/index.js!)
  console.log('⚙️ Building backend to correct location...');
  execSync(
    'esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/server/index.js',
    { stdio: 'inherit' }
  );

  // Step 5: Create production package.json
  const productionPackage = {
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
  };

  writeFileSync('dist/package.json', JSON.stringify(productionPackage, null, 2));

  console.log('✅ Build completed with correct structure:');
  console.log('   dist/server/index.js ← Backend (CORRECT location)');
  console.log('   dist/package.json    ← Production config');
  console.log('   dist/public/         ← Frontend assets');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}