require('dotenv').config();

function validateMongoURI() {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('Error: MONGODB_URI environment variable is not defined');
    process.exit(1);
  }

  console.log('Validating MongoDB URI...');
  
  // Hide sensitive information in logs
  const sanitizedUri = uri.replace(/:[^:@]+@/, ':****@');
  console.log('URI Format:', sanitizedUri);

  // Check basic format
  if (!uri.startsWith('mongodb+srv://')) {
    console.error('Error: URI must start with mongodb+srv://');
    process.exit(1);
  }

  // Parse URI components
  try {
    const [protocol, rest] = uri.split('://');
    const [credentials, hostPath] = rest.split('@');
    const [username, password] = credentials.split(':');
    const [host, dbAndParams] = hostPath.split('/');

    console.log('URI Components validation:');
    console.log('- Protocol:', protocol === 'mongodb+srv' ? '✓ Valid' : '✗ Invalid');
    console.log('- Username:', username ? '✓ Present' : '✗ Missing');
    console.log('- Password:', password ? '✓ Present' : '✗ Missing');
    console.log('- Host:', host ? '✓ Present' : '✗ Missing');
    console.log('- Database:', dbAndParams ? '✓ Present' : '✗ Missing');

    // Validate host format
    if (!host.includes('.mongodb.net')) {
      console.error('Error: Invalid host format. Must be a MongoDB Atlas domain');
      process.exit(1);
    }

    console.log('\nURI validation successful! ✓');
    process.exit(0);
  } catch (error) {
    console.error('Error: Invalid URI format:', error.message);
    process.exit(1);
  }
}

validateMongoURI(); 