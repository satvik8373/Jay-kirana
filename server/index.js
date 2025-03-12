require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');
const path = require('path');
const fs = require('fs');

const app = express();

// Environment setup
const isProduction = process.env.NODE_ENV === 'production';
console.log('Environment:', {
  NODE_ENV: process.env.NODE_ENV,
  RENDER_PROJECT_DIR: process.env.RENDER_PROJECT_DIR,
  __dirname: __dirname,
  clientBuildDir: path.join(__dirname, '../client/dist')
});

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    const allowedOrigins = [
      'http://localhost:5200',
      'http://127.0.0.1:5173',
      'https://jay-kirana.onrender.com'
    ];
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Security middleware
app.use((req, res, next) => {
  // Allow requests from any origin in development
  const origin = req.headers.origin;
  if (process.env.NODE_ENV === 'development') {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  } else if (origin) {
    const allowedOrigins = ['http://localhost:5200', 'http://localhost:3000', 'http://localhost:5173'];
    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Debug middleware (only in development)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, {
      body: req.body,
      query: req.query,
      params: req.params
    });
    next();
  });
}

// Routes
app.use('/api', apiRoutes);

// Production static file serving
if (isProduction) {
  console.log('Production mode: Setting up static file serving...');
  
  // Define client build directory
  const clientBuildDir = path.join(__dirname, '../client/dist');
  
  // Create client build directory if it doesn't exist
  if (!fs.existsSync(clientBuildDir)) {
    console.log('Warning: Client build directory not found at', clientBuildDir);
    fs.mkdirSync(clientBuildDir, { recursive: true });
    console.log('Created client build directory structure');
  }

  // Serve static files from the React app
  app.use(express.static(clientBuildDir));

  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    const indexPath = path.join(clientBuildDir, 'index.html');
    console.log('Attempting to serve index.html from:', indexPath);
    
    // Log directory contents for debugging
    const parentDir = path.dirname(clientBuildDir);
    const buildDir = clientBuildDir;
    console.log('Contents of parent directory:', fs.readdirSync(parentDir));
    console.log('Contents of build directory:', fs.readdirSync(buildDir));

    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      console.error('Error: index.html not found at', indexPath);
      res.status(404).send('Application not found');
    }
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ 
    error: 'Server error',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('MongoDB Connected:', process.env.MONGODB_URI?.split('@')[1]);
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 