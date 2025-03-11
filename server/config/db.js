const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }

    // Remove any surrounding quotes and trim whitespace
    const cleanUri = uri.replace(/^["'](.+(?=["']$))["']$/, '$1').trim();
    
    console.log('Checking MongoDB URI format...');
    
    // Validate MongoDB URI format
    if (!cleanUri.startsWith('mongodb://') && !cleanUri.startsWith('mongodb+srv://')) {
      console.error('Raw URI:', uri);
      console.error('Cleaned URI:', cleanUri);
      throw new Error('Invalid MongoDB URI format. Must start with mongodb:// or mongodb+srv://');
    }

    // Parse and validate the URI
    try {
      // Create a URL object to validate the URI format
      const mongoURL = new URL(cleanUri);
      
      // Log connection attempt (without exposing credentials)
      console.log('Attempting to connect to MongoDB at:', 
        `${mongoURL.protocol}//${mongoURL.host}${mongoURL.pathname}`);
      
    } catch (urlError) {
      console.error('URL parsing error:', urlError);
      throw new Error(`Invalid MongoDB URI format: ${urlError.message}`);
    }

    // Configure connection options
    const options = {
      serverSelectionTimeoutMS: 60000, // Increase timeout to 60 seconds
      socketTimeoutMS: 45000, // Close sockets after 45s
      family: 4, // Use IPv4, skip trying IPv6
      retryWrites: true,
      w: 'majority',
      connectTimeoutMS: 30000,
      maxPoolSize: 10,
      minPoolSize: 0,
      maxIdleTimeMS: 10000,
      useNewUrlParser: true,
      useUnifiedTopology: true
    };

    console.log('Connecting to MongoDB...');
    const conn = await mongoose.connect(cleanUri, options);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Add connection error handler
    mongoose.connection.on('error', (err) => {
      console.error(`MongoDB connection error: ${err}`);
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
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Add more detailed error logging
    if (error.message.includes('ENOTFOUND')) {
      console.error('Could not resolve MongoDB host. Please check your connection string and network connectivity.');
    } else if (error.message.includes('Authentication failed')) {
      console.error('MongoDB authentication failed. Please check your username and password.');
    } else if (error.message.includes('Invalid MongoDB URI format')) {
      console.error('Please check your MongoDB connection string format.');
    } else if (error.message.includes('Server selection timed out')) {
      console.error('MongoDB server selection timed out. This might be due to network issues or firewall settings.');
    }
    throw error;
  }
};

module.exports = connectDB; 