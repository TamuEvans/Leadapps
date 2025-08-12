#!/bin/bash
set -e

echo "🚀 Running deployment-ready build..."

# Clean previous build
rm -rf dist/

# Run standard build
npm run build

# Fix file structure for deployment
echo "📦 Fixing deployment file structure..."

# Move dist/index.js to dist/server/index.js (where deployment expects it)
if [ -f "dist/index.js" ]; then
  mkdir -p dist/server
  mv dist/index.js dist/server/index.js
  echo "✅ Moved dist/index.js → dist/server/index.js"
else
  echo "❌ Error: dist/index.js not found after build"
  exit 1
fi

# Create dist/package.json for deployment
cat > dist/package.json << 'EOF'
{
  "name": "leadapps-production",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node server/index.js"
  },
  "dependencies": {}
}
EOF

echo "✅ Created dist/package.json"

# Create uploads directory
mkdir -p dist/uploads
echo "✅ Created uploads directory"

# Verify final structure
echo "📁 Final deployment structure:"
ls -la dist/server/index.js dist/package.json dist/public/ dist/uploads/ 2>/dev/null || echo "Some files missing"

echo "🎉 Build ready for deployment!"
echo "Next step: Click Deploy button in Replit"