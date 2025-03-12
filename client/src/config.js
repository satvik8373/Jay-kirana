const config = {
  apiUrl: process.env.NODE_ENV === 'production'
    ? '/api'  // In production, use relative path
    : 'http://localhost:5000/api', // In development, use full URL
  uploadUrl: process.env.NODE_ENV === 'production'
    ? '/uploads'  // In production, use relative path
    : 'http://localhost:5000/uploads' // In development, use full URL
};

// Log the configuration
console.log('App configuration:', {
  environment: process.env.NODE_ENV,
  apiUrl: config.apiUrl,
  uploadUrl: config.uploadUrl
});

export default config; 