const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');
require('dotenv').config();

const app = express();

// Enable CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? 'https://jay-kirana.onrender.com'
    : ['http://localhost:5200', 'http://localhost:3000'],
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/dist')));

// Mount API routes
app.use('/api', apiRoutes);
app.use('/api', authRoutes);

// Serve uploads
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

module.exports = app; 