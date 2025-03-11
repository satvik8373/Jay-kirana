require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');
const path = require('path');

const app = express();

// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5000',
      'http://localhost:5200',
      'http://127.0.0.1:5000',
      'http://127.0.0.1:5200',
      'https://jay-kirana.onrender.com',
      'https://jay-kirana-api.onrender.com'
    ];
    
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
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

// Mount API routes
app.use('/api', apiRoutes);

// Root route for health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Handle 404 errors
app.use((req, res) => {
  console.log('404 Not Found:', req.method, req.url);
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ 
    error: 'Server error',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5200;

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