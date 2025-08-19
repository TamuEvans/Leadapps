#!/usr/bin/env node

/**
 * PACKAGE BUILD FIXER
 * This script modifies package.json to use a build command that creates the correct structure
 * Since we can't edit package.json directly, this creates a temporary build solution
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';

console.log('🔧 FIXING PACKAGE.JSON BUILD COMMAND');
console.log('=====================================');

// Read current package.json
const packagePath = 'package.json';
if (!existsSync(packagePath)) {
  console.error('❌ package.json not found');
  process.exit(1);
}

const packageContent = readFileSync(packagePath, 'utf-8');
const packageData = JSON.parse(packageContent);

console.log('Original build command:', packageData.scripts.build);

// Create a temporary build wrapper
const buildWrapper = `
#!/bin/bash
echo "🚀 CORRECTED BUILD PROCESS"
echo "========================="

# Run original build
vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

# Fix structure immediately
if [ -f "dist/index.js" ]; then
    echo "Fixing deployment structure..."
    mkdir -p dist/server
    mv dist/index.js dist/server/index.js
    echo "✓ Moved backend to correct location"
    
    if [ -d "dist/public" ]; then
        cp -r dist/public dist/server/
        echo "✓ Copied frontend to correct location"
    fi
fi

# Create deployment package.json
cat > dist/package.json << 'EOF'
{
  "name": "leadapps-production",
  "version": "1.0.0",
  "type": "module",
  "main": "server/index.js",
  "scripts": {
    "start": "node server/index.js"
  }
}
EOF

echo "✅ Build complete with correct structure!"
`;

writeFileSync('build-fixed.sh', buildWrapper);
console.log('✓ Created build-fixed.sh');

// The ideal would be to modify package.json, but since we can't:
console.log('\n⚠️  DEPLOYMENT INSTRUCTIONS:');
console.log('1. Run: chmod +x build-fixed.sh');
console.log('2. Run: ./build-fixed.sh');
console.log('3. Then deploy manually');
console.log('\nAlternatively, tell Replit to use ./build-fixed.sh as build command');