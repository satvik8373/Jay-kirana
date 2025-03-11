const config = {
  apiUrl: process.env.NODE_ENV === 'production' 
    ? 'https://jay-kirana-api.onrender.com/api'
    : 'http://localhost:5200/api',
  uploadUrl: process.env.NODE_ENV === 'production'
    ? 'https://jay-kirana-api.onrender.com/uploads'
    : 'http://localhost:5200/uploads'
};

export default config; 