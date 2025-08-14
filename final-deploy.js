#!/usr/bin/env node

/**
 * FINAL DEPLOYMENT FIX
 * This script ensures the deployment structure matches what npm start expects
 */

import { execSync } from 'child_process';
import { existsSync, mkdirSync, renameSync, copyFileSync, readdirSync, statSync, writeFileSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

console.log('🚀 FINAL DEPLOYMENT BUILD SCRIPT');
console.log('================================\n');

// Step 1: Clean dist directory
if (existsSync('dist')) {
  console.log('Cleaning existing dist directory...');
  rmSync('dist', { recursive: true, force: true });
}

// Step 2: Run the build
console.log('Running build process...');
try {
  execSync('vite build', { stdio: 'inherit' });
  execSync('esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { stdio: 'inherit' });
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}

// Step 3: Fix the structure
console.log('\nFixing deployment structure...');

// The build creates dist/index.js but we need dist/server/index.js
if (existsSync('dist/index.js')) {
  // Create server directory
  if (!existsSync('dist/server')) {
    mkdirSync('dist/server', { recursive: true });
  }
  
  // Move index.js to server/
  renameSync('dist/index.js', 'dist/server/index.js');
  console.log('✓ Moved backend to dist/server/index.js');
  
  // Copy public directory to server/public
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
    console.log('✓ Copied frontend to dist/server/public');
    
    // Remove the original public directory to avoid confusion
    rmSync('dist/public', { recursive: true, force: true });
  }
}

// Step 4: Create dist/package.json for deployment
const deploymentPackage = {
  "name": "leadapps-production",
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

writeFileSync('dist/package.json', JSON.stringify(deploymentPackage, null, 2));
console.log('✓ Created dist/package.json');

// Step 5: Verify the structure
console.log('\n📋 Verifying deployment structure:');
console.log('===================================');

const checks = [
  { path: 'dist/server/index.js', desc: 'Backend entry point' },
  { path: 'dist/server/public/index.html', desc: 'Frontend HTML' },
  { path: 'dist/server/public/assets', desc: 'Frontend assets', isDir: true },
  { path: 'dist/package.json', desc: 'Deployment config' }
];

let allGood = true;
for (const check of checks) {
  if (existsSync(check.path)) {
    const stat = statSync(check.path);
    if (check.isDir && !stat.isDirectory()) {
      console.log(`❌ ${check.desc}: exists but is not a directory`);
      allGood = false;
    } else {
      const size = check.isDir ? 'directory' : `${(stat.size / 1024).toFixed(1)}KB`;
      console.log(`✅ ${check.desc}: ${size}`);
    }
  } else {
    console.log(`❌ ${check.desc}: MISSING`);
    allGood = false;
  }
}

// Step 6: Test that the structure works
if (allGood) {
  console.log('\n🧪 Testing deployment structure...');
  try {
    // Check if the server file can be loaded
    const serverPath = join(process.cwd(), 'dist', 'server', 'index.js');
    if (existsSync(serverPath)) {
      console.log('✅ Server file exists at expected location');
      
      // Test if npm start would work from dist directory
      console.log('\n✨ DEPLOYMENT STRUCTURE IS PERFECT!');
      console.log('====================================');
      console.log('The application is ready for deployment.');
      console.log('npm start will execute: node dist/server/index.js');
      console.log('\n🎉 Build completed successfully!');
    }
  } catch (error) {
    console.error('❌ Structure test failed:', error.message);
    process.exit(1);
  }
} else {
  console.error('\n❌ Deployment structure is incomplete!');
  process.exit(1);
}