#!/bin/bash
echo "🚀 SIMPLIFIED BUILD PROCESS"
echo "========================="

# Use npm run build directly (faster, less complex)
npm run build

# Quick structure fix
if [ -f "dist/index.js" ]; then
    mkdir -p dist/server
    mv dist/index.js dist/server/index.js
    
    if [ -d "dist/public" ]; then
        cp -r dist/public dist/server/
    fi
fi

# Minimal package.json
echo '{
  "name": "leadapps-production",
  "version": "1.0.0",
  "type": "module",
  "main": "server/index.js",
  "engines": {"node": ">=18.0.0"},
  "scripts": {"start": "node server/index.js"}
}' > dist/package.json

echo "✅ Simple build complete!"