const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }

    console.log('Attempting to connect to MongoDB Atlas...');
    
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true,
      w: 'majority',
      serverSelectionTimeoutMS: 60000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 60000
    });

    console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
    
    // Monitor the connection
    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });

    return conn;
  } catch (error) {
    console.error('MongoDB Connection Error:');
    console.error(`Error Type: ${error.name}`);
    console.error(`Error Message: ${error.message}`);
    
    // Log connection details (without credentials)
    try {
      const sanitizedUri = uri.replace(/\/\/[^@]+@/, '//****:****@');
      console.error('Connection URI format:', sanitizedUri);
    } catch (e) {
      console.error('Could not log sanitized URI');
    }
    
    throw error;
  }
};

module.exports = connectDB; 