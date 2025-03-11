require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  try {
    let uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }

    console.log('\nStep 1: Parsing connection string...');
    const [prefix, rest] = uri.split('://');
    const [credentials, hostAndPath] = rest.split('@');
    const [username, password] = credentials.split(':');
    
    // Encode components
    const encodedUsername = encodeURIComponent(username);
    const encodedPassword = encodeURIComponent(password);
    
    // Reconstruct URI
    uri = `${prefix}://${encodedUsername}:${encodedPassword}@${hostAndPath}`;
    
    // Log sanitized version
    console.log('Connection string format:', uri.replace(/:[^:@]+@/, ':****@'));
    console.log('Protocol:', prefix);
    console.log('Username:', username);
    console.log('Host:', hostAndPath.split('/')[0]);
    console.log('Database:', hostAndPath.split('/')[1]?.split('?')[0] || 'default');

    console.log('\nStep 2: Testing connection...');
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log('\nConnection successful! ✓');
    console.log('Connected to:', conn.connection.host);
    console.log('Database:', conn.connection.name);
    console.log('MongoDB version:', mongoose.version);

    await mongoose.connection.close();
    console.log('\nConnection closed successfully');
    process.exit(0);
  } catch (error) {
    console.error('\nConnection test failed:', {
      name: error.name,
      message: error.message,
      code: error.code
    });
    process.exit(1);
  }
}

console.log('MongoDB Connection Test');
console.log('=====================');
testConnection(); 