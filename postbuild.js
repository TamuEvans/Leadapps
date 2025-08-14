#!/usr/bin/env node

// This fixes the structure after npm run build
import { existsSync, mkdirSync, renameSync, copyFileSync, readdirSync, statSync, writeFileSync } from 'fs';
import { join } from 'path';

console.log('📦 Post-build: Fixing deployment structure...');

try {
  // Only run if we detect the wrong structure
  if (existsSync('dist/index.js') && !existsSync('dist/server/index.js')) {
    console.log('Detected wrong structure from npm run build, fixing...');
    
    // Create server directory
    if (!existsSync('dist/server')) {
      mkdirSync('dist/server', { recursive: true });
    }
    
    // Move index.js
    renameSync('dist/index.js', 'dist/server/index.js');
    console.log('✓ Moved index.js to server/');
    
    // Copy public directory
    if (existsSync('dist/public') && !existsSync('dist/server/public')) {
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
      console.log('✓ Copied public to server/public');
    }
    
    // Create package.json
    if (!existsSync('dist/package.json')) {
      const pkg = {
        "name": "leadapps-production",
        "version": "1.0.0",
        "type": "module",
        "main": "server/index.js",
        "scripts": { "start": "node server/index.js" }
      };
      writeFileSync('dist/package.json', JSON.stringify(pkg, null, 2));
      console.log('✓ Created package.json');
    }
    
    console.log('✅ Structure fixed!');
  } else if (existsSync('dist/server/index.js')) {
    console.log('✓ Structure already correct');
  }
} catch (error) {
  console.error('Post-build fix failed:', error.message);
  process.exit(1);
}
