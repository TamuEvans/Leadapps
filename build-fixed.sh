
#!/bin/bash
echo "🚀 CORRECTED BUILD PROCESS"
echo "========================="

# Run original build
vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

# Fix structure immediately
if [ -f "dist/index.js" ]; then
    echo "Fixing deployment structure..."
    mkdir -p dist/server
    mv dist/index.js dist/server/index.js
    echo "✓ Moved backend to correct location"
    
    if [ -d "dist/public" ]; then
        cp -r dist/public dist/server/
        echo "✓ Copied frontend to correct location"
    fi
fi

# Create deployment package.json
cat > dist/package.json << 'EOF'
{
  "name": "leadapps-production",
  "version": "1.0.0",
  "type": "module",
  "main": "server/index.js",
  "engines": {
    "node": ">=18.0.0"
  },
  "scripts": {
    "start": "node server/index.js"
  }
}
EOF

echo "✅ Build complete with correct structure!"
