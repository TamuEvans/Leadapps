#!/usr/bin/env node

// Fix the npm build process to generate files in the correct locations
import { execSync } from 'child_process';
import { existsSync, mkdirSync, copyFileSync, writeFileSync } from 'fs';

console.log('🔧 Fixing npm build output structure...');

try {
  // Run the existing npm build command
  console.log('📦 Running npm build...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Check what was actually built
  if (!existsSync('dist/index.js')) {
    throw new Error('npm build did not generate dist/index.js');
  }
  
  console.log('✅ npm build completed successfully');
  
  // Create the server directory if it doesn't exist
  if (!existsSync('dist/server')) {
    mkdirSync('dist/server', { recursive: true });
    console.log('📁 Created dist/server directory');
  }
  
  // Move the server file to the correct location
  console.log('🔄 Moving server file to correct location...');
  copyFileSync('dist/index.js', 'dist/server/index.js');
  console.log('✅ Moved dist/index.js → dist/server/index.js');
  
  // Create the proper package.json for production
  const productionPkg = {
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
  
  writeFileSync('dist/package.json', JSON.stringify(productionPkg, null, 2));
  console.log('✅ Created proper package.json');
  
  // Create uploads directory
  if (!existsSync('dist/uploads')) {
    mkdirSync('dist/uploads', { recursive: true });
    console.log('📁 Created uploads directory');
  }
  
  // Verify the final structure
  const requiredFiles = [
    'dist/server/index.js',
    'dist/package.json',
    'dist/public/index.html'
  ];
  
  console.log('🔍 Verifying final structure...');
  let allFilesExist = true;
  
  for (const file of requiredFiles) {
    if (existsSync(file)) {
      console.log(`✅ ${file}`);
    } else {
      console.error(`❌ ${file} - MISSING`);
      allFilesExist = false;
    }
  }
  
  if (!allFilesExist) {
    throw new Error('Build verification failed - missing required files');
  }
  
  // Test server syntax
  execSync('node --check dist/server/index.js', { stdio: 'pipe' });
  console.log('✅ Server syntax validation passed');
  
  console.log('🎉 Build structure fixed successfully!');
  console.log('📊 Final structure:');
  console.log('   dist/server/index.js - Server application');
  console.log('   dist/package.json - Production config');
  console.log('   dist/public/ - Frontend assets');
  console.log('   dist/uploads/ - Upload directory');
  
} catch (error) {
  console.error('❌ Build fix failed:', error.message);
  process.exit(1);
}