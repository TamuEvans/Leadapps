#!/bin/bash

# DEPLOYMENT BUILD SCRIPT
# This script fixes the npm run build output to match deployment expectations

echo "🚀 Starting deployment build process..."

# Clean existing build
rm -rf dist/

# Run the standard build
echo "📦 Running npm run build..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ npm run build failed"
    exit 1
fi

# Check what was actually built
if [ ! -f "dist/index.js" ]; then
    echo "❌ Build did not create dist/index.js"
    exit 1
fi

echo "✅ npm run build completed successfully"

# Fix the structure for deployment
echo "🔧 Fixing deployment structure..."

# Create server directory and move server file
mkdir -p dist/server
mv dist/index.js dist/server/index.js

# Create production package.json in dist/
cat > dist/package.json << 'EOF'
{
  "name": "rest-express-production",
  "version": "1.0.0",
  "type": "module",
  "main": "server/index.js",
  "scripts": {
    "start": "node server/index.js",
    "health": "curl -f http://localhost:5000/health || exit 1"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
EOF

# Create uploads directory
mkdir -p dist/uploads

# Verify the final build
echo "🔍 Verifying deployment structure..."

REQUIRED_FILES=(
    "dist/server/index.js"
    "dist/package.json"
    "dist/public/index.html"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file - MISSING"
        exit 1
    fi
done

# Test server syntax
node --check dist/server/index.js
if [ $? -eq 0 ]; then
    echo "✅ Server syntax validation passed"
else
    echo "❌ Server syntax validation failed"
    exit 1
fi

echo "🎉 Deployment build completed successfully!"
echo ""
echo "📊 Build Summary:"
echo "   📁 dist/server/index.js - $(du -h dist/server/index.js | cut -f1) server bundle"
echo "   📁 dist/package.json - Production configuration"
echo "   📁 dist/public/ - Frontend assets ($(ls -1 dist/public/assets/ | wc -l) files)"
echo "   📁 dist/uploads/ - Upload directory"
echo ""
echo "🚀 Ready for deployment!"