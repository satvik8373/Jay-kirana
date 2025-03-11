const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }

    console.log('Attempting to connect to MongoDB...');
    
    // Log the IP address being used to connect
    const https = require('https');
    https.get('https://api.ipify.org?format=json', (resp) => {
      let data = '';
      resp.on('data', (chunk) => { data += chunk; });
      resp.on('end', () => {
        try {
          const ip = JSON.parse(data).ip;
          console.log(`Connecting from IP address: ${ip}`);
          console.log('If connection fails, please whitelist this IP in MongoDB Atlas');
        } catch (e) {
          console.log('Could not determine IP address');
        }
      });
    }).on('error', (err) => {
      console.log('Error determining IP address');
    });

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4,
      retryWrites: true,
      w: 'majority'
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    if (error.name === 'MongooseServerSelectionError') {
      console.error('\nMongoDB Connection Error:');
      console.error('Error Type:', error.name);
      console.error('Error Message:', error.message);
      console.error('\nTroubleshooting steps:');
      console.error('1. Check if your MongoDB Atlas IP whitelist includes 0.0.0.0/0');
      console.error('2. Verify your MongoDB connection string is correct');
      console.error('3. Ensure your MongoDB Atlas cluster is running');
      console.error('4. Check if your MongoDB Atlas user credentials are correct\n');
    } else {
      console.error(`Error connecting to MongoDB: ${error.message}`);
    }
    throw error;
  }
};

module.exports = connectDB; 