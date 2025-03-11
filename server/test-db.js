require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }

    console.log('Testing MongoDB connection...');
    console.log('URI Format:', uri.replace(/:[^:@]+@/, ':****@')); // Hide password in logs

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log('Connection successful!');
    console.log('Connected to database:', conn.connection.name);
    console.log('Host:', conn.connection.host);
    console.log('Port:', conn.connection.port);

    await mongoose.connection.close();
    console.log('Connection closed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Connection test failed:', {
      name: error.name,
      message: error.message,
      code: error.code
    });
    process.exit(1);
  }
}

testConnection(); 