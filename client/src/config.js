const isDevelopment = process.env.NODE_ENV === 'development';

const config = {
  apiUrl: isDevelopment 
    ? 'http://localhost:5000'
    : 'https://jay-kirana.onrender.com',
  clientUrl: isDevelopment
    ? 'http://localhost:5200'
    : 'https://jay-kirana.onrender.com',
  serverUploadUrl: isDevelopment
    ? 'http://localhost:5000/uploads'
    : 'https://jay-kirana.onrender.com/uploads'
};

// Log configuration for debugging
console.log('Environment:', process.env.NODE_ENV);
console.log('Is Development:', isDevelopment);
console.log('Using API URL:', config.apiUrl);
console.log('Using Client URL:', config.clientUrl);
console.log('Using Upload URL:', config.serverUploadUrl);

export default config;