#!/bin/bash

# Print Node.js and npm versions
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Navigate to client directory
cd client

# Clean install dependencies
echo "Installing client dependencies..."
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Build the client
echo "Building client..."
npm run build

# Check build status
if [ $? -eq 0 ]; then
    echo "Client build successful!"
else
    echo "Client build failed!"
    exit 1
fi

# Navigate back to root
cd ..

# Navigate to server directory
cd server

# Clean install dependencies
echo "Installing server dependencies..."
rm -rf node_modules package-lock.json
npm install

# Check server dependencies installation
if [ $? -eq 0 ]; then
    echo "Server dependencies installed successfully!"
else
    echo "Server dependencies installation failed!"
    exit 1
fi

echo "Build process completed successfully!" 