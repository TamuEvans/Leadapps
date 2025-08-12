#!/usr/bin/env node
// Wrapper to fix npm build structure for deployment
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Running deployment-compatible build...');

try {
  // Clean previous build
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
    console.log('🧹 Cleaned previous build');
  }

  // Run vite build
  console.log('📦 Building frontend...');
  execSync('npx vite build', { stdio: 'inherit' });

  // Build server with correct output path
  console.log('📦 Building backend...');
  execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/server/index.js', { stdio: 'inherit' });

  // Create production package.json
  console.log('📦 Creating production config...');
  const prodPackage = {
    name: 'leadapps-production',
    version: '1.0.0',
    type: 'module',
    scripts: {
      start: 'node server/index.js'
    }
  };
  
  fs.writeFileSync('dist/package.json', JSON.stringify(prodPackage, null, 2));

  // Create uploads directory
  if (!fs.existsSync('dist/uploads')) {
    fs.mkdirSync('dist/uploads', { recursive: true });
  }

  // Verify structure
  const serverFile = 'dist/server/index.js';
  const packageFile = 'dist/package.json';
  
  if (fs.existsSync(serverFile) && fs.existsSync(packageFile)) {
    console.log('✅ Build successful!');
    console.log(`📁 ${serverFile} (${Math.round(fs.statSync(serverFile).size / 1024)}K)`);
    console.log(`📁 ${packageFile}`);
    console.log('🎉 Ready for deployment!');
  } else {
    throw new Error('Build verification failed - missing required files');
  }

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}