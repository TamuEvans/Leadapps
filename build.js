#!/usr/bin/env node

/**
 * BUILD.JS - THE DEPLOYMENT FIX
 * This intercepts and fixes the broken npm run build
 */

import { execSync } from 'child_process';
import { existsSync, mkdirSync, renameSync, writeFileSync, rmSync, readdirSync, statSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

console.log('🚀 BUILD.JS - Fixing deployment structure...\n');

try {
  // Clean
  if (existsSync('dist')) {
    rmSync('dist', { recursive: true, force: true });
  }

  // Build frontend
  console.log('Step 1: Building frontend with Vite...');
  execSync('npx vite build', { stdio: 'inherit' });
  
  // Build backend  
  console.log('\nStep 2: Building backend with esbuild...');
  execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { stdio: 'inherit' });

  // THE FIX: Move files to correct locations
  console.log('\nStep 3: Fixing file structure for deployment...');
  
  // Create server directory
  if (!existsSync('dist/server')) {
    mkdirSync('dist/server', { recursive: true });
  }
  
  // Move backend to correct location
  if (existsSync('dist/index.js')) {
    renameSync('dist/index.js', 'dist/server/index.js');
    console.log('✓ Moved dist/index.js → dist/server/index.js');
  } else {
    throw new Error('Backend build failed - dist/index.js not found');
  }
  
  // Copy public to where server expects it
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
    console.log('✓ Copied dist/public → dist/server/public');
  } else {
    throw new Error('Frontend build failed - dist/public not found');
  }
  
  // Create production package.json
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
  
  // Verify everything is in place
  console.log('\nStep 4: Verifying deployment structure...');
  const required = [
    { path: 'dist/server/index.js', desc: 'Backend entry point' },
    { path: 'dist/server/public', desc: 'Frontend assets' },
    { path: 'dist/server/public/index.html', desc: 'Frontend HTML' },
    { path: 'dist/package.json', desc: 'Production config' }
  ];
  
  let allGood = true;
  for (const item of required) {
    if (existsSync(item.path)) {
      console.log(`✓ ${item.desc}: ${item.path}`);
    } else {
      console.log(`❌ MISSING: ${item.path}`);
      allGood = false;
    }
  }
  
  if (!allGood) {
    throw new Error('Some required files are missing');
  }
  
  console.log('\n═══════════════════════════════════════════════════');
  console.log('✅ BUILD SUCCESSFUL - DEPLOYMENT STRUCTURE FIXED!');
  console.log('═══════════════════════════════════════════════════');
  console.log('The app is now ready for deployment.');
  console.log('npm start will work correctly.');
  console.log('═══════════════════════════════════════════════════');
  
  process.exit(0);
  
} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  process.exit(1);
}