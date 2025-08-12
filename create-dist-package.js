#!/usr/bin/env node

// CREATE DIST PACKAGE.JSON
// This creates the production package.json in the dist directory

import { writeFileSync, mkdirSync } from 'fs';

console.log('📦 Creating dist/package.json...');

try {
    // Ensure uploads directory exists
    mkdirSync('dist/uploads', { recursive: true });
    
    // Create production package.json
    const prodPackage = {
        name: "rest-express-production",
        version: "1.0.0",
        type: "module",
        main: "server/index.js",
        scripts: {
            start: "node server/index.js"
        },
        engines: {
            node: ">=18.0.0"
        }
    };
    
    writeFileSync('dist/package.json', JSON.stringify(prodPackage, null, 2));
    console.log('✅ Created dist/package.json');
    
} catch (error) {
    console.error('❌ Failed to create dist package:', error.message);
    process.exit(1);
}