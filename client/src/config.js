const config = {
  apiUrl: process.env.NODE_ENV === 'production' 
    ? process.env.VITE_API_URL || 'https://your-production-api.com/api'
    : 'http://localhost:5000/api',
  uploadUrl: process.env.NODE_ENV === 'production'
    ? process.env.VITE_UPLOAD_URL || 'https://your-production-api.com/uploads'
    : 'http://localhost:5000/uploads'
};

export default config; 