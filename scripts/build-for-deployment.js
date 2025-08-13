#!/usr/bin/env node

/**
 * Production build script for deployment
 * Creates the correct directory structure and package.json for Replit deployment
 */

import { execSync } from 'child_process';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

console.log('🏗️  Starting production build...');

try {
  // Step 1: Run vite build for frontend
  console.log('📦 Building frontend with Vite...');
  execSync('vite build', { stdio: 'inherit' });

  // Step 2: Ensure server directory exists
  const serverDir = 'dist/server';
  if (!existsSync(serverDir)) {
    mkdirSync(serverDir, { recursive: true });
    console.log('📁 Created dist/server directory');
  }

  // Step 3: Build backend with esbuild to correct location
  console.log('⚙️  Building backend with esbuild...');
  execSync('esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/server/index.js', { stdio: 'inherit' });

  // Step 4: Create production package.json
  console.log('📄 Creating production package.json...');
  const productionPackage = {
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
    },
    "dependencies": {}
  };

  writeFileSync('dist/package.json', JSON.stringify(productionPackage, null, 2));
  console.log('✅ Created dist/package.json');

  // Step 5: Verify build structure
  console.log('🔍 Verifying build structure...');
  
  const requiredFiles = [
    'dist/server/index.js',
    'dist/package.json',
    'dist/public/index.html'
  ];

  const missingFiles = requiredFiles.filter(file => !existsSync(file));
  
  if (missingFiles.length > 0) {
    console.error('❌ Missing required files:');
    missingFiles.forEach(file => console.error(`   - ${file}`));
    process.exit(1);
  }

  console.log('✅ Build verification passed!');
  console.log('📁 Build structure:');
  console.log('   dist/');
  console.log('   ├── server/');
  console.log('   │   └── index.js      (backend entry point)');
  console.log('   ├── public/');
  console.log('   │   └── index.html    (frontend build)');
  console.log('   └── package.json      (production config)');
  console.log('');
  console.log('🚀 Ready for deployment!');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}