#!/usr/bin/env node

/**
 * THIS IS THE REAL BUILD SCRIPT THAT FIXES DEPLOYMENT
 * Named build.mjs to be picked up by build systems
 */

import { execSync } from 'child_process';
import { existsSync, mkdirSync, renameSync, writeFileSync, rmSync, readdirSync, statSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

console.log('🚀 Fixed Build Script Running...\n');

try {
  // Clean
  if (existsSync('dist')) {
    rmSync('dist', { recursive: true, force: true });
  }

  // Build frontend
  console.log('Building frontend...');
  execSync('npx vite build', { stdio: 'inherit' });
  
  // Build backend
  console.log('Building backend...');
  execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { stdio: 'inherit' });

  // Fix structure
  console.log('Fixing structure for deployment...');
  
  if (!existsSync('dist/server')) {
    mkdirSync('dist/server', { recursive: true });
  }
  
  // Move backend
  if (existsSync('dist/index.js')) {
    renameSync('dist/index.js', 'dist/server/index.js');
    console.log('✓ Backend moved to correct location');
  }
  
  // Copy public
  if (existsSync('dist/public')) {
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
    console.log('✓ Frontend copied to correct location');
  }
  
  // Create package.json
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
  console.log('✓ Package.json created');
  
  console.log('\n✅ BUILD COMPLETE - READY FOR DEPLOYMENT');
  process.exit(0);
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}