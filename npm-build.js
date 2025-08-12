#!/usr/bin/env node

// Build wrapper that can be called by npm run build
// This ensures compatibility with Replit's deployment system

import { execSync } from 'child_process';
import { existsSync } from 'fs';

console.log('🚀 Starting deployment build...');

try {
  
  // Run the working build script
  console.log('📦 Running optimized build...');
  execSync('node deploy-fix.js', { stdio: 'inherit' });
  
  // Verify critical files exist
  const requiredFiles = [
    'dist/server/index.js',
    'dist/package.json',
    'dist/public/index.html'
  ];
  
  console.log('🔍 Verifying build output...');
  let allFilesExist = true;
  
  for (const file of requiredFiles) {
    if (existsSync(file)) {
      console.log(`✅ ${file} - OK`);
    } else {
      console.error(`❌ ${file} - MISSING`);
      allFilesExist = false;
    }
  }
  
  if (!allFilesExist) {
    console.error('❌ Build verification failed - missing required files');
    process.exit(1);
  }
  
  // Test the built server
  console.log('🧪 Testing server build...');
  try {
    execSync('node --check dist/server/index.js', { stdio: 'pipe' });
    console.log('✅ Server syntax validation passed');
  } catch (error) {
    console.error('❌ Server syntax validation failed');
    console.error(error.message);
    process.exit(1);
  }
  
  console.log('🎉 Build completed successfully!');
  console.log('📁 Output directory: dist/');
  console.log('🚀 Ready for deployment');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}