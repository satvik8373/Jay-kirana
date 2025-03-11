const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }

    console.log('Attempting to connect to MongoDB...');
    console.log('Connection string format:', uri.split('@')[1]); // Log only the host part, not credentials
    
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      family: 4,
      maxPoolSize: 10,
      minPoolSize: 0,
      maxIdleTimeMS: 10000,
      directConnection: true
    });

    console.log(`MongoDB Connected successfully to: ${conn.connection.host}`);
    
    // Add connection event listeners
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected from MongoDB');
    });

    return conn;
  } catch (error) {
    console.error('MongoDB Connection Error Details:');
    console.error(`Error Type: ${error.name}`);
    console.error(`Error Message: ${error.message}`);
    if (error.reason) {
      console.error('Topology Description:', JSON.stringify(error.reason, null, 2));
    }
    throw error;
  }
};

module.exports = connectDB; 