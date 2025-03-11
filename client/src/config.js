const config = {
  apiUrl: import.meta.env.VITE_API_URL || 
    (import.meta.env.PROD ? 'https://jay-kirana-api.onrender.com' : 'http://localhost:5000'),
  uploadUrl: import.meta.env.VITE_UPLOAD_URL || 
    (import.meta.env.PROD ? 'https://jay-kirana-api.onrender.com/uploads' : 'http://localhost:5000/uploads')
};

export default config; 