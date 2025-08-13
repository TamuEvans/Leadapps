#!/usr/bin/env node

/**
 * Quick fix script to ensure proper build structure after npm build
 * This script can be run as a postbuild step to fix any structure issues
 */

import { existsSync, mkdirSync, copyFileSync, writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';

console.log('🔧 Fixing build structure...');

try {
  // Check if dist/index.js exists (incorrect location from original build)
  if (existsSync('dist/index.js')) {
    console.log('📁 Found dist/index.js - moving to correct location...');
    
    // Ensure server directory exists
    if (!existsSync('dist/server')) {
      mkdirSync('dist/server', { recursive: true });
    }
    
    // Move the file to correct location
    copyFileSync('dist/index.js', 'dist/server/index.js');
    unlinkSync('dist/index.js');
    console.log('✅ Moved backend file to dist/server/index.js');
  }

  // Ensure production package.json exists with correct configuration
  const prodPackageContent = {
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
    }
  };

  writeFileSync('dist/package.json', JSON.stringify(prodPackageContent, null, 2));
  console.log('✅ Updated dist/package.json with correct configuration');

  // Verify final structure
  const requiredFiles = [
    'dist/server/index.js',
    'dist/package.json'
  ];

  const missingFiles = requiredFiles.filter(file => !existsSync(file));
  
  if (missingFiles.length > 0) {
    console.error('❌ Still missing required files:');
    missingFiles.forEach(file => console.error(`   - ${file}`));
    process.exit(1);
  }

  console.log('✅ Build structure fixed successfully!');

} catch (error) {
  console.error('❌ Failed to fix build structure:', error.message);
  process.exit(1);
}