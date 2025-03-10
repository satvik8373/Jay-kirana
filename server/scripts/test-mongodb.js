require('dotenv').config();
const mongoose = require('mongoose');
const dns = require('dns');

async function testMongoDBConnection() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }

    console.log('Testing MongoDB connection...');
    console.log('Connection string format:', uri.startsWith('mongodb+srv://') ? 'Valid' : 'Invalid');

    // Test DNS resolution
    const mongoURL = new URL(uri);
    const hostname = mongoURL.hostname;
    console.log('MongoDB hostname:', hostname);

    try {
      const addresses = await dns.promises.lookup(hostname);
      console.log('DNS resolution successful:', addresses);
    } catch (dnsError) {
      console.error('DNS resolution failed:', dnsError);
      process.exit(1);
    }

    // Test MongoDB connection
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4
    });

    console.log('MongoDB connection successful!');
    console.log('Connected to:', conn.connection.host);
    console.log('Database name:', conn.connection.name);

    await mongoose.connection.close();
    console.log('Connection closed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Connection test failed:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    process.exit(1);
  }
}

testMongoDBConnection(); 