#!/bin/bash

# DEPLOYMENT BUILD SCRIPT
# This ensures the correct structure for deployment

echo "🚀 Starting deployment build..."
echo "================================"

# Step 1: Clean dist directory
echo "Cleaning dist directory..."
rm -rf dist

# Step 2: Run builds
echo "Running Vite build..."
npx vite build

echo "Running ESBuild..."
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

# Step 3: Fix structure
echo "Fixing deployment structure..."

# Move backend to correct location
if [ -f "dist/index.js" ]; then
    mkdir -p dist/server
    mv dist/index.js dist/server/index.js
    echo "✓ Moved backend to dist/server/index.js"
fi

# Copy frontend to correct location
if [ -d "dist/public" ]; then
    cp -r dist/public dist/server/
    echo "✓ Copied frontend to dist/server/public"
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
echo "✓ Created dist/package.json"

# Verify structure
echo ""
echo "📋 Verifying structure:"
if [ -f "dist/server/index.js" ]; then
    echo "✅ Backend: dist/server/index.js"
else
    echo "❌ Backend missing!"
    exit 1
fi

if [ -f "dist/server/public/index.html" ]; then
    echo "✅ Frontend: dist/server/public/"
else
    echo "❌ Frontend missing!"
    exit 1
fi

if [ -f "dist/package.json" ]; then
    echo "✅ Config: dist/package.json"
else
    echo "❌ Config missing!"
    exit 1
fi

echo ""
echo "✨ Deployment build complete!"
echo "The application is ready for deployment."