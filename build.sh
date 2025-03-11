#!/bin/bash

# Install root dependencies
npm install

# Install and build client
cd client
npm install
npm run build
cd ..

# Create functions directory if it doesn't exist
mkdir -p netlify/functions

# Copy server files to functions
cp -r server/* netlify/functions/ 