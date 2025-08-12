#!/usr/bin/env node

// AUTOMATIC POST-BUILD FIXER
// This script automatically runs after any build to fix deployment structure

import { existsSync, mkdirSync, writeFileSync, renameSync } from 'fs';
import { execSync } from 'child_process';

console.log('🔧 Post-build deployment fix starting...');

try {
    // Only run if we're in the wrong state
    if (existsSync('dist/index.js') && !existsSync('dist/server/index.js')) {
        console.log('📁 Fixing deployment file structure...');
        
        // Create server directory
        mkdirSync('dist/server', { recursive: true });
        
        // Move server file
        renameSync('dist/index.js', 'dist/server/index.js');
        console.log('✅ Moved dist/index.js → dist/server/index.js');
        
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
        console.log('✅ Created production package.json');
        
        // Create uploads directory
        mkdirSync('dist/uploads', { recursive: true });
        console.log('✅ Created uploads directory');
        
        console.log('🎉 Deployment structure fixed automatically!');
    } else if (existsSync('dist/server/index.js')) {
        console.log('✅ Deployment structure already correct');
    } else {
        console.log('❌ No build output found to fix');
        process.exit(1);
    }
    
} catch (error) {
    console.error('❌ Auto-fix failed:', error.message);
    process.exit(1);
}