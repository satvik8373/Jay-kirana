const config = {
  apiUrl: import.meta.env.MODE === 'production'
    ? 'https://jay-kirana-api.onrender.com/api'
    : 'http://localhost:5000/api',
  uploadUrl: import.meta.env.MODE === 'production'
    ? 'https://jay-kirana-api.onrender.com/uploads'
    : 'http://localhost:5000/uploads',
  clientUrl: import.meta.env.MODE === 'production'
    ? 'https://jay-kirana.onrender.com'
    : 'http://localhost:5200'
};

// Log the current configuration
console.log('Current Environment:', import.meta.env.MODE);
console.log('API URL:', config.apiUrl);
console.log('Upload URL:', config.uploadUrl);
console.log('Client URL:', config.clientUrl);

export default config; 