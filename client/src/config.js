const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  serverUrl: import.meta.env.VITE_SERVER_URL || 'http://localhost:5000',
  uploadUrl: import.meta.env.VITE_UPLOAD_URL || 'http://localhost:5000/uploads'
};

export default config; 