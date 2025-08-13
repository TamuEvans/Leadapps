#!/bin/bash

# DEPLOYMENT WRAPPER SCRIPT
# This script ensures correct deployment structure for Replit
# It wraps npm run build to fix the structure issues

echo "🚀 Deployment Script - Ensuring correct structure"

# Run the deployment fix instead of regular npm build
node deployment-fix-production.js

if [ $? -eq 0 ]; then
    echo "✅ Deployment build completed successfully!"
    echo "Structure is ready for npm start"
    exit 0
else
    echo "❌ Deployment build failed"
    exit 1
fi