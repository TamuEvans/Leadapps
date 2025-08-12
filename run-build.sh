#!/bin/bash

# Deployment build script for Replit
echo "Starting Replit deployment build..."

# Run our working build script
node deploy-fix.js

# Verify the build completed successfully
if [ -f "dist/server/index.js" ] && [ -f "dist/package.json" ]; then
    echo "✅ Build completed successfully!"
    echo "✅ Server file exists: dist/server/index.js"
    echo "✅ Package file exists: dist/package.json"
    echo "Ready for deployment"
    exit 0
else
    echo "❌ Build failed - missing required files"
    exit 1
fi