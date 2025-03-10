const mongoose = require('mongoose');
const dns = require('dns');
require('dotenv').config();

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }

    console.log('Attempting to connect to MongoDB...');
    
    // Extract hostname from URI for DNS check
    const mongoURL = new URL(uri);
    const hostname = mongoURL.hostname;
    
    console.log('Checking DNS resolution for MongoDB host...');
    try {
      await dns.promises.lookup(hostname);
      console.log('DNS resolution successful');
    } catch (dnsError) {
      console.error('DNS resolution failed:', dnsError);
      throw new Error(`DNS resolution failed for ${hostname}`);
    }

    console.log('Connection string format check:', uri.startsWith('mongodb+srv://') ? 'Valid prefix' : 'Invalid prefix');
    
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000, // Timeout after 10s
      socketTimeoutMS: 45000, // Close sockets after 45s
      family: 4 // Force IPv4
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
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
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

    return conn;
  } catch (error) {
    console.error('MongoDB Connection Error Details:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      uri: uri ? uri.replace(/:[^:/@]+@/, ':****@') : 'undefined' // Hide password in logs
    });

    if (error.name === 'MongoParseError') {
      console.error('Invalid MongoDB connection string format');
    } else if (error.name === 'MongoNetworkError') {
      console.error('MongoDB network error - check if the connection string is correct and the database is accessible');
    } else if (error.name === 'MongoServerSelectionError') {
      console.error('Could not connect to any MongoDB server - check if the cluster is running and accessible');
    }

    process.exit(1);
  }
};

module.exports = connectDB; 