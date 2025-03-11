const config = {
  apiUrl: import.meta.env.VITE_API_URL || 
    (import.meta.env.PROD ? '/.netlify/functions/api' : 'http://localhost:5000/api'),
  serverUrl: import.meta.env.VITE_SERVER_URL || 
    (import.meta.env.PROD ? window.location.origin : 'http://localhost:5000'),
  uploadUrl: import.meta.env.VITE_UPLOAD_URL || 
    (import.meta.env.PROD ? '/.netlify/functions/api/uploads' : 'http://localhost:5000/uploads')
};

export default config; 