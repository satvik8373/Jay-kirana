const config = {
  apiUrl: process.env.NODE_ENV === 'production' 
    ? 'https://jay-kirana-api.onrender.com/api'
    : 'http://localhost:5000/api',
  
  serverUrl: process.env.NODE_ENV === 'production'
    ? 'https://jay-kirana-api.onrender.com'
    : 'http://localhost:5000',
  
  clientUrl: process.env.NODE_ENV === 'production'
    ? 'https://jay-kirana.onrender.com'
    : 'http://localhost:5200',
  
  uploadUrl: process.env.NODE_ENV === 'production'
    ? 'https://jay-kirana-api.onrender.com/uploads'
    : 'http://localhost:5000/uploads',

  // Helper function to get full API endpoint URL
  getApiEndpoint: (endpoint) => {
    const base = process.env.NODE_ENV === 'production' 
      ? 'https://jay-kirana-api.onrender.com/api'
      : 'http://localhost:5000/api';
    return `${base}${endpoint}`;
  }
};

export default config; 