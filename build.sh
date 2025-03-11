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

# Create necessary directories in functions
mkdir -p netlify/functions/utils
mkdir -p netlify/functions/models
mkdir -p netlify/functions/middleware
mkdir -p netlify/functions/routes

# Copy server files to functions with proper structure
cp server/utils/* netlify/functions/utils/
cp server/models/* netlify/functions/models/
cp server/middleware/* netlify/functions/middleware/
cp server/routes/* netlify/functions/routes/

# Copy main server file
cp server/index.js netlify/functions/api.js

# Create a package.json for functions
cat > netlify/functions/package.json << EOL
{
  "name": "jay-kirana-functions",
  "version": "1.0.0",
  "dependencies": {
    "express": "^4.18.2",
    "serverless-http": "^3.1.1",
    "mongoose": "^7.0.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "multer": "^1.4.5-lts.1",
    "nodemailer": "^6.9.1"
  }
}
EOL

# Install dependencies in functions directory
cd netlify/functions
npm install
cd ../.. 