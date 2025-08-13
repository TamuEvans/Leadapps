#!/usr/bin/env node

/**
 * Complete production build script that ensures deployment readiness
 * This script replaces the default npm build to create the correct structure
 */

import { execSync } from 'child_process';
import { writeFileSync, existsSync, mkdirSync, copyFileSync, unlinkSync } from 'fs';

console.log('🚀 Starting production build for deployment...');

try {
  // Clean previous build
  console.log('🧹 Cleaning previous build...');
  if (existsSync('dist')) {
    execSync('rm -rf dist', { stdio: 'pipe' });
  }

  // Step 1: Build frontend with Vite
  console.log('📦 Building frontend assets...');
  execSync('vite build', { stdio: 'inherit' });

  // Step 2: Ensure server directory exists
  console.log('📁 Creating server directory...');
  const serverDir = 'dist/server';
  if (!existsSync(serverDir)) {
    mkdirSync(serverDir, { recursive: true });
  }

  // Step 3: Build backend to correct location
  console.log('⚙️  Building backend bundle...');
  execSync(
    'esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/server/index.js',
    { stdio: 'inherit' }
  );

  // Step 4: Handle any misplaced files (fallback)
  if (existsSync('dist/index.js')) {
    console.log('🔧 Moving misplaced backend file...');
    copyFileSync('dist/index.js', 'dist/server/index.js');
    unlinkSync('dist/index.js');
  }

  // Step 5: Create production package.json
  console.log('📄 Creating production configuration...');
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
    }
  };

  writeFileSync('dist/package.json', JSON.stringify(productionPackage, null, 2));

  // Step 6: Verify build
  console.log('🔍 Verifying build structure...');
  const requiredFiles = [
    'dist/server/index.js',
    'dist/package.json',
    'dist/public/index.html'
  ];

  const missingFiles = requiredFiles.filter(file => !existsSync(file));
  
  if (missingFiles.length > 0) {
    console.error('❌ Build verification failed. Missing files:');
    missingFiles.forEach(file => console.error(`   - ${file}`));
    process.exit(1);
  }

  // Step 7: Test production start script (syntax check)
  console.log('🧪 Testing production entry point...');
  try {
    execSync('node --check dist/server/index.js', { stdio: 'pipe' });
    console.log('✅ Production entry point syntax is valid');
  } catch (error) {
    console.error('❌ Production entry point has syntax errors');
    throw error;
  }

  console.log('\n✅ Production build completed successfully!');
  console.log('📁 Build output structure:');
  console.log('   dist/');
  console.log('   ├── server/');
  console.log('   │   └── index.js      ← Backend entry point');
  console.log('   ├── public/');
  console.log('   │   ├── index.html    ← Frontend entry point');
  console.log('   │   └── assets/       ← Frontend static assets');
  console.log('   └── package.json      ← Production configuration');
  console.log('');
  console.log('🎯 Ready for Replit deployment!');
  console.log('   • npm start will run: node server/index.js');
  console.log('   • Entry point matches production package.json');
  console.log('   • All required files are in place');

} catch (error) {
  console.error('\n❌ Production build failed:', error.message);
  console.error('\n🔧 Troubleshooting:');
  console.error('   1. Ensure all dependencies are installed');
  console.error('   2. Check for TypeScript compilation errors');
  console.error('   3. Verify server/index.ts exists and is valid');
  process.exit(1);
}