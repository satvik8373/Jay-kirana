require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');
const path = require('path');
const fs = require('fs');

const app = express();

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5200',
      'http://127.0.0.1:5173',
      'https://jay-kirana.onrender.com',
      'https://jay-kirana-api.onrender.com'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      console.log('CORS blocked for origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400 // 24 hours
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

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Determine the client build directory
const clientBuildDir = process.env.NODE_ENV === 'production'
  ? path.resolve(process.env.RENDER_PROJECT_DIR || __dirname, 'client/dist')
  : path.join(__dirname, '../client/dist');

// Log environment information
console.log('Environment:', {
  NODE_ENV: process.env.NODE_ENV,
  RENDER_PROJECT_DIR: process.env.RENDER_PROJECT_DIR,
  __dirname: __dirname,
  clientBuildDir: clientBuildDir
});

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  console.log('Production mode: Setting up static file serving...');
  
  // Ensure the client build directory exists
  if (!fs.existsSync(clientBuildDir)) {
    console.warn(`Warning: Client build directory not found at ${clientBuildDir}`);
    // Try to create the directory structure
    try {
      fs.mkdirSync(clientBuildDir, { recursive: true });
      console.log('Created client build directory structure');
    } catch (err) {
      console.error('Failed to create client build directory:', err);
    }
  }

  // Serve static files
  app.use(express.static(clientBuildDir));
  
  // Serve uploaded files
  const uploadsDir = path.join(__dirname, 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Created uploads directory at:', uploadsDir);
  }
  app.use('/uploads', express.static(uploadsDir));
  
  // Handle React routing in production
  app.get('*', (req, res, next) => {
    if (req.url.startsWith('/api')) {
      return next();
    }
    
    const indexPath = path.join(clientBuildDir, 'index.html');
    console.log('Attempting to serve index.html from:', indexPath);
    
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      console.error('Error: index.html not found at', indexPath);
      // List directory contents to help debug
      try {
        const parentDir = path.dirname(clientBuildDir);
        console.log('Contents of parent directory:', fs.readdirSync(parentDir));
        if (fs.existsSync(clientBuildDir)) {
          console.log('Contents of build directory:', fs.readdirSync(clientBuildDir));
        }
      } catch (err) {
        console.error('Error listing directory contents:', err);
      }
      res.status(404).send('Application not found');
    }
  });
} else {
  console.log('Development mode: Static file serving disabled');
}

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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
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