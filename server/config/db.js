const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }

    console.log('Attempting to connect to MongoDB...');
    
    // Extract hostname from URI for logging
    const sanitizedUri = uri.replace(/:[^:@]+@/, ':****@');
    console.log('Using connection string:', sanitizedUri);

    const conn = await mongoose.connect(uri, {
      maxPoolSize: 10,
      minPoolSize: 2,
      maxIdleTimeMS: 30000,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4,
      retryWrites: true,
      writeConcern: {
        w: 'majority'
      }
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log('Database Name:', conn.connection.name);
    console.log('MongoDB Driver Version:', mongoose.version);
    
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

    // Add reconnection handler
    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
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
    throw error;
  }
};

module.exports = connectDB; 