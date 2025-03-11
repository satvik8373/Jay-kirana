const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }

    // Log connection attempt (hiding sensitive info)
    console.log('Attempting to connect to MongoDB...');
    const sanitizedUri = uri.replace(/:([^:@]+)@/, ':****@');
    console.log('Using connection string:', sanitizedUri);

    // Validate connection string format
    if (!uri.startsWith('mongodb+srv://') && !uri.startsWith('mongodb://')) {
      throw new Error('Invalid MongoDB connection string format');
    }

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000, // Timeout after 10s
      socketTimeoutMS: 45000, // Close sockets after 45s
      retryWrites: true,
      w: 'majority'
    });

    console.log(`MongoDB Connected successfully to: ${conn.connection.host}`);
    console.log(`Database name: ${conn.connection.name}`);
    
    // Add connection error handler
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', {
        name: err.name,
        message: err.message,
        stack: err.stack
      });
    });

    // Add disconnection handler
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    // Handle process termination
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
      } catch (err) {
        console.error('Error during MongoDB connection closure:', err);
        process.exit(1);
      }
    });

    return conn;
  } catch (error) {
    console.error('Detailed MongoDB connection error:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      code: error.code
    });

    // Provide more specific error messages
    if (error.code === 'ENOTFOUND') {
      console.error('Could not resolve MongoDB host. Please check your connection string and network connectivity.');
    } else if (error.name === 'MongoServerError') {
      console.error('MongoDB server error. Please check your credentials and database access settings.');
    }

    throw error;
  }
};

module.exports = connectDB; 