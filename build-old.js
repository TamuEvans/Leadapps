#!/usr/bin/env node

/**
 * BUILD SCRIPT FOR REPLIT DEPLOYMENT
 * This script ensures the correct file structure for deployment
 */

import { execSync } from 'child_process';
import { existsSync, mkdirSync, renameSync, writeFileSync, rmSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

console.log('🔨 Building for deployment...\n');

try {
  // Clean previous build
  if (existsSync('dist')) {
    console.log('Cleaning previous build...');
    rmSync('dist', { recursive: true, force: true });
  }

  // Run the standard build
  console.log('Running standard build...');
  execSync('npx vite build', { stdio: 'inherit' });
  execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { stdio: 'inherit' });

  // Fix the structure
  console.log('\nFixing deployment structure...');
  
  // Create server directory
  if (!existsSync('dist/server')) {
    mkdirSync('dist/server', { recursive: true });
  }
  
  // Move index.js to server/index.js
  if (existsSync('dist/index.js')) {
    if (existsSync('dist/server/index.js')) {
      rmSync('dist/server/index.js');
    }
    renameSync('dist/index.js', 'dist/server/index.js');
    console.log('✓ Moved dist/index.js → dist/server/index.js');
  } else {
    throw new Error('Build did not create dist/index.js');
  }
  
  // Copy public directory to server/public (where the server expects it)
  if (existsSync('dist/public')) {
    const { readdirSync, statSync, copyFileSync } = await import('fs');
    const { join } = await import('path');
    
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
    console.log('✓ Copied public directory to dist/server/public');
  }
  
  // Create package.json in dist
  const packageJson = {
    "name": "leadapps-production",
    "version": "1.0.0",
    "type": "module",
    "main": "server/index.js",
    "scripts": {
      "start": "node server/index.js"
    }
  };
  
  writeFileSync('dist/package.json', JSON.stringify(packageJson, null, 2));
  console.log('✓ Created dist/package.json');
  
  // Verify structure
  const required = [
    'dist/server/index.js',
    'dist/package.json',
    'dist/public/index.html'
  ];
  
  console.log('\nVerifying structure:');
  for (const file of required) {
    if (existsSync(file)) {
      console.log(`✓ ${file}`);
    } else {
      throw new Error(`Missing required file: ${file}`);
    }
  }
  
  console.log('\n✅ Build completed successfully!');
  console.log('The application is ready for deployment.');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}