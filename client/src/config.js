const config = {
  apiUrl: process.env.NODE_ENV === 'production' 
    ? 'https://jay-kirana-api.onrender.com/api'
    : window.location.hostname === 'localhost' 
      ? 'http://localhost:5200/api'
      : 'https://jay-kirana-api.onrender.com/api',
  uploadUrl: process.env.NODE_ENV === 'production'
    ? 'https://jay-kirana-api.onrender.com/uploads'
    : window.location.hostname === 'localhost'
      ? 'http://localhost:5200/uploads'
      : 'https://jay-kirana-api.onrender.com/uploads'
};

export default config; 