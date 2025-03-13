const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');
const path = require('path');
const config = require('./config/config');

const app = express();

// Apply CORS middleware with config
app.use(cors(config.cors));

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount API routes
app.use(config.apiBaseUrl, apiRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'Server is running',
    environment: config.env,
    apiBaseUrl: config.apiBaseUrl
  });
});

// Initialize server
const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();
    
    // Start server only after successful DB connection
    app.listen(config.port, () => {
      console.log(`Server running in ${config.env} mode on port ${config.port}`);
      console.log(`API URL: ${config.getApiUrl()}`);
      console.log(`Client URL: ${config.clientUrl}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer(); 