#!/usr/bin/env node

/**
 * PRODUCTION DEPLOYMENT FIX
 * Resolves all deployment issues for Replit
 * 
 * PROBLEMS:
 * 1. npm run build creates dist/index.js (wrong location)
 * 2. npm start expects dist/server/index.js 
 * 3. No dist/package.json file created
 * 
 * SOLUTION: This script creates the correct structure
 */

import { execSync } from 'child_process';
import { writeFileSync, existsSync, mkdirSync, rmSync, renameSync, copyFileSync } from 'fs';
import { join } from 'path';

console.log('🚀 PRODUCTION DEPLOYMENT FIX');
console.log('Fixing deployment structure issues...\n');

try {
  // Step 1: Run the original build command
  console.log('Step 1: Running npm build...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Step 2: Check what was created
  console.log('\nStep 2: Analyzing build output...');
  const wrongFile = 'dist/index.js';
  const correctDir = 'dist/server';
  const correctFile = 'dist/server/index.js';
  
  if (!existsSync(wrongFile)) {
    throw new Error('Build did not create dist/index.js - unexpected state');
  }
  
  console.log('✓ Found dist/index.js (wrong location)');
  
  // Step 3: Create correct directory structure
  console.log('\nStep 3: Creating correct structure...');
  if (!existsSync(correctDir)) {
    mkdirSync(correctDir, { recursive: true });
    console.log('✓ Created dist/server directory');
  }
  
  // Step 4: Move backend file to correct location
  console.log('\nStep 4: Moving backend to correct location...');
  if (existsSync(wrongFile)) {
    if (existsSync(correctFile)) {
      rmSync(correctFile);
    }
    renameSync(wrongFile, correctFile);
    console.log('✓ Moved dist/index.js → dist/server/index.js');
  }
  
  // Step 5: Create production package.json
  console.log('\nStep 5: Creating production package.json...');
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
  console.log('✓ Created dist/package.json with correct configuration');
  
  // Step 6: Verify final structure
  console.log('\nStep 6: Verifying deployment structure...');
  const required = [
    'dist/server/index.js',
    'dist/package.json',
    'dist/public/index.html'
  ];
  
  let allGood = true;
  for (const file of required) {
    if (existsSync(file)) {
      console.log(`✓ ${file}`);
    } else {
      console.log(`✗ Missing: ${file}`);
      allGood = false;
    }
  }
  
  if (!allGood) {
    throw new Error('Some required files are missing');
  }
  
  // Step 7: Test syntax
  console.log('\nStep 7: Testing entry point...');
  execSync('node --check dist/server/index.js', { stdio: 'pipe' });
  console.log('✓ Entry point syntax is valid');
  
  console.log('\n✅ DEPLOYMENT STRUCTURE FIXED!');
  console.log('\nFinal structure:');
  console.log('  dist/');
  console.log('  ├── server/');
  console.log('  │   └── index.js     ← Backend (correct location)');
  console.log('  ├── public/          ← Frontend assets');
  console.log('  └── package.json     ← Production config');
  console.log('\nDeployment is now ready!');
  
} catch (error) {
  console.error('\n❌ Deployment fix failed:', error.message);
  process.exit(1);
}