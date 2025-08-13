#!/bin/bash

echo "=== COMPREHENSIVE DEPLOYMENT DEBUG ==="
echo

echo "1. TESTING ORIGINAL BUILD COMMAND (PROBLEMATIC):"
echo "Running: npm run build"
npm run build > build_output.log 2>&1

echo "Build command completed. Checking output structure:"
echo

echo "2. ANALYZING BUILD OUTPUT:"
if [ -f "dist/index.js" ]; then
    echo "❌ PROBLEM: dist/index.js exists (WRONG location)"
    ls -la dist/index.js
else
    echo "✅ Good: No dist/index.js found"
fi

if [ -f "dist/server/index.js" ]; then
    echo "✅ Good: dist/server/index.js exists (CORRECT location)"
    ls -la dist/server/index.js
else
    echo "❌ PROBLEM: dist/server/index.js missing (NEEDED for npm start)"
fi

if [ -f "dist/package.json" ]; then
    echo "✅ Good: dist/package.json exists"
    echo "Configuration:"
    cat dist/package.json | grep -E "(main|start)"
else
    echo "❌ PROBLEM: dist/package.json missing (NEEDED for npm start)"
fi

echo

echo "3. TESTING FIX SCRIPTS:"
echo "Available deployment fixes:"
ls -la *fix*.js *build*.js *deploy*.js *build*.sh 2>/dev/null | head -5

echo

echo "4. SIMULATING REPLIT DEPLOYMENT:"
echo "Current .replit deployment configuration:"
grep -A3 -B1 "build.*npm" .replit
echo

echo "5. DEPLOYMENT PROBLEM SUMMARY:"
if [ -f "dist/index.js" ] && [ ! -f "dist/server/index.js" ]; then
    echo "❌ DEPLOYMENT WILL FAIL:"
    echo "   - npm run build creates: dist/index.js"
    echo "   - npm start expects: dist/server/index.js"
    echo "   - Result: 'Cannot find module' error"
elif [ -f "dist/server/index.js" ]; then
    echo "✅ DEPLOYMENT STRUCTURE CORRECT"
else
    echo "⚠️  UNKNOWN STATE - Need to investigate"
fi

echo
echo "6. RECOMMENDED SOLUTIONS:"
echo "Use one of these instead of 'npm run build':"
echo "   - node scripts/ultimate-deployment-fix.js"
echo "   - node npm-build-wrapper.js"  
echo "   - ./build.sh"
echo "   - node fix-deployment-structure.js"