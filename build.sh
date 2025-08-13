#!/bin/bash

# Build wrapper script that fixes the deployment structure issue
# This script ensures the correct build output for Replit deployment

echo "🔧 Build wrapper - fixing deployment structure..."

# Use the npm build wrapper to create correct structure
node npm-build-wrapper.js

if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully with correct structure!"
    echo "   Files ready for: npm start"
else
    echo "❌ Build failed"
    exit 1
fi