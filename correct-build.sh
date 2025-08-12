#!/bin/bash

# CORRECT BUILD SCRIPT
# This is the exact build command that deployment needs to use

echo "🚀 Running corrected build process..."

# Clean dist
rm -rf dist/

# Run frontend build
echo "📦 Building frontend..."
vite build

if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed"
    exit 1
fi

# Run backend build with CORRECT output path
echo "📦 Building backend..."
esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/server/index.js

if [ $? -ne 0 ]; then
    echo "❌ Backend build failed"
    exit 1
fi

# Create production package.json and uploads directory
echo "📦 Creating production configuration..."
node create-dist-package.js

if [ $? -ne 0 ]; then
    echo "❌ Production config failed"
    exit 1
fi

echo "✅ Build completed with correct structure!"
echo "📁 dist/server/index.js - $(du -h dist/server/index.js | cut -f1)"
echo "📁 dist/package.json - Production config"
echo "📁 dist/public/ - Frontend assets"
echo "📁 dist/uploads/ - Uploads directory"
echo ""
echo "🎉 DEPLOYMENT READY!"