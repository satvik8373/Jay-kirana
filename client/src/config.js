const config = {
  apiUrl: process.env.NODE_ENV === 'production' 
    ? 'https://jay-kirana-api.onrender.com/api'
    : 'http://localhost:5000/api',
  uploadUrl: process.env.NODE_ENV === 'production'
    ? 'https://jay-kirana-api.onrender.com/uploads'
    : 'http://localhost:5000/uploads'
};

export default config; 