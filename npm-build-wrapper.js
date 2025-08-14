#!/usr/bin/env node

/**
 * NPM BUILD WRAPPER
 * This script intercepts npm run build and fixes the deployment structure
 * 
 * DEPLOYMENT FIX: This replaces the broken npm run build
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';

console.log('🚀 NPM Build Wrapper - Fixing deployment structure...\n');

// Check if our fix script exists
if (existsSync('deployment-fix-production.js')) {
  console.log('Using deployment-fix-production.js for proper build structure...');
  try {
    execSync('node deployment-fix-production.js', { stdio: 'inherit' });
    process.exit(0);
  } catch (error) {
    console.error('Build failed:', error.message);
    process.exit(1);
  }
} else {
  // Fallback to regular build (will fail deployment but at least builds)
  console.log('Warning: deployment-fix-production.js not found, using standard build');
  console.log('THIS WILL CREATE WRONG STRUCTURE FOR DEPLOYMENT!');
  try {
    execSync('vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { stdio: 'inherit' });
  } catch (error) {
    console.error('Build failed:', error.message);
    process.exit(1);
  }
}