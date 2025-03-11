const config = {
  apiUrl: import.meta.env.MODE === 'production'
    ? 'https://jay-kirana-api.onrender.com'
    : 'http://localhost:5000',
  uploadUrl: import.meta.env.MODE === 'production'
    ? 'https://jay-kirana-api.onrender.com/uploads'
    : 'http://localhost:5000/uploads',
  clientUrl: import.meta.env.MODE === 'production'
    ? 'https://jay-kirana.onrender.com'
    : 'http://localhost:5200',
  authUrl: import.meta.env.MODE === 'production'
    ? 'https://jay-kirana-api.onrender.com'
    : 'http://localhost:5000'
};

// Log the current configuration
console.log('Current Environment:', import.meta.env.MODE);
console.log('API URL:', config.apiUrl);
console.log('Upload URL:', config.uploadUrl);
console.log('Client URL:', config.clientUrl);
console.log('Auth URL:', config.authUrl);

export default config; 