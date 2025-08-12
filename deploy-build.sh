#!/bin/bash

# Deployment build script that works with Replit deployment
echo "Starting deployment build..."

node npm-build-wrapper.js

if [ $? -eq 0 ]; then
    echo "Deployment build successful!"
    exit 0
else
    echo "Deployment build failed!"
    exit 1
fi