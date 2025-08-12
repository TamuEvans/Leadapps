#!/usr/bin/env node

// PACKAGE.JSON BUILD FIXER
// This script modifies the package.json build command to create the correct structure

import { readFileSync, writeFileSync } from 'fs';

console.log('🔧 Fixing package.json build command...');

try {
    const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
    
    // Fix the build command to put server file in correct location
    const originalBuild = packageJson.scripts.build;
    const fixedBuild = originalBuild.replace(
        'esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist',
        'esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/server/index.js'
    );
    
    // Also add postbuild step
    packageJson.scripts.build = fixedBuild + ' && node create-dist-package.js';
    
    writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
    
    console.log('✅ Fixed build command to output dist/server/index.js');
    console.log('Original:', originalBuild);
    console.log('Fixed:', packageJson.scripts.build);
    
} catch (error) {
    console.error('❌ Failed to fix package.json:', error.message);
    process.exit(1);
}