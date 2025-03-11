require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');
const path = require('path');
const mongoose = require('mongoose');

const app = express();

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5200',
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:5200',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
      'https://jay-kirana.netlify.app',
      'https://jay-kirana-api.onrender.com',
      'https://jay-kirana.onrender.com'  // Add the Render client URL
    ];
    
    // Add your Netlify URL to allowed origins in production
    if (process.env.NODE_ENV === 'production' && process.env.CLIENT_URL) {
      allowedOrigins.push(process.env.CLIENT_URL);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      console.warn('Blocked by CORS:', origin);
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
    const allowedOrigins = [
      'https://jay-kirana.netlify.app',
      'https://jay-kirana-api.onrender.com',
      'https://jay-kirana.onrender.com'  // Add the Render client URL
    ];
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
  
  // Handle preflight requests
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

// Root route for health check
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Get port from environment and store in Express
const PORT = process.env.PORT || 10000;
app.set('port', PORT);

const startServer = async () => {
  let retries = 0;
  const maxRetries = 3;

  const tryConnect = async () => {
    try {
      // Connect to MongoDB
      await connectDB();
      
      // Create HTTP server
      const server = app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`Server URL: http://0.0.0.0:${PORT}`);
        console.log('Environment:', process.env.NODE_ENV);
      });

      // Handle server errors
      server.on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
          console.error(`Port ${PORT} is already in use`);
          process.exit(1);
        } else {
          console.error('Server error:', error);
        }
      });

    } catch (error) {
      console.error(`Failed to start server (attempt ${retries + 1}/${maxRetries}):`, error.message);
      
      if (retries < maxRetries) {
        retries++;
        console.log(`Retrying in 5 seconds... (${retries}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, 5000));
        return tryConnect();
      } else {
        console.error('Max retries reached. Exiting...');
        process.exit(1);
      }
    }
  };

  await tryConnect();
};

// Start the server
startServer(); 