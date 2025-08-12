#!/usr/bin/env node

// POST-BUILD FIX SCRIPT
// This runs after npm run build to fix the deployment structure

import { execSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync, renameSync } from 'fs';
import { dirname } from 'path';

console.log('🔧 Post-build deployment fix...');

try {
    // Check if build created the wrong structure
    if (!existsSync('dist/index.js')) {
        console.log('❌ dist/index.js not found - build may have failed');
        process.exit(1);
    }

    // Create server directory
    if (!existsSync('dist/server')) {
        mkdirSync('dist/server', { recursive: true });
    }

    // Move server file to correct location
    if (existsSync('dist/index.js') && !existsSync('dist/server/index.js')) {
        renameSync('dist/index.js', 'dist/server/index.js');
        console.log('✅ Moved dist/index.js → dist/server/index.js');
    }

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

    // Create uploads directory
    if (!existsSync('dist/uploads')) {
        mkdirSync('dist/uploads');
        console.log('✅ Created uploads directory');
    }

    console.log('🎉 Deployment structure fixed!');

} catch (error) {
    console.error('❌ Fix failed:', error.message);
    process.exit(1);
}