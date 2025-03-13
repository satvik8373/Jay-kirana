require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');
const path = require('path');
const mongoose = require('mongoose');

const app = express();

// Enhanced error handling for uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Keep the process running but log the error
  console.log('Server continuing after uncaught exception');
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  // Keep the process running but log the error
  console.log('Server continuing after unhandled rejection');
});

// Connect to MongoDB with retry logic
const initializeDB = async () => {
  let retries = 5;
  while (retries > 0) {
    try {
      await connectDB();
      console.log('MongoDB connection successful');
      break;
    } catch (err) {
      console.error(`MongoDB connection attempt failed. Retries left: ${retries - 1}`);
      retries -= 1;
      if (retries === 0) {
        console.error('Failed to connect to MongoDB after all retries');
        // Don't exit, let the server run without DB connection
      }
      // Wait for 5 seconds before retrying
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

initializeDB();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://jay-kirana.onrender.com'
    : ['http://localhost:5200', 'http://localhost:3000'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  res.json({
    status: 'ok',
    timestamp: new Date(),
    dbState: dbState,
    dbConnected: dbState === 1
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method
  });
  
  res.status(err.status || 500).json({ 
    error: process.env.NODE_ENV === 'production' ? 'Server error' : err.message,
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Environment:', process.env.NODE_ENV);
  console.log('MongoDB URI:', process.env.MONGODB_URI ? '(set)' : '(not set)');
});

// Handle server shutdown gracefully
process.on('SIGTERM', () => {
  console.log('Received SIGTERM signal. Starting graceful shutdown...');
  server.close(() => {
    console.log('Server closed. Process terminating...');
    process.exit(0);
  });
}); 