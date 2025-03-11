require('dotenv').config();
const mongoose = require('mongoose');

async function testMongoConnection() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }

    console.log('Testing MongoDB connection...');
    const sanitizedUri = uri.replace(/:([^:@]+)@/, ':****@');
    console.log('Connection string format:', sanitizedUri);

    // Parse the connection string to validate format
    const url = new URL(uri);
    console.log('Protocol:', url.protocol);
    console.log('Hostname:', url.hostname);
    console.log('Database:', url.pathname.substr(1) || 'default');

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    console.log('\nConnection test results:');
    console.log('Status: Connected successfully');
    console.log('Host:', conn.connection.host);
    console.log('Database:', conn.connection.name);
    console.log('Port:', conn.connection.port || 'default');

    await mongoose.connection.close();
    console.log('\nConnection closed successfully');
    process.exit(0);
  } catch (error) {
    console.error('\nConnection test failed:', {
      name: error.name,
      message: error.message,
      code: error.code
    });

    if (error.code === 'ENOTFOUND') {
      console.error('\nCould not resolve MongoDB host. Please check:');
      console.error('1. Your connection string format');
      console.error('2. Network connectivity');
      console.error('3. MongoDB Atlas status');
    }

    process.exit(1);
  }
}

testMongoConnection(); 