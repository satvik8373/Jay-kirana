const config = {
  apiUrl: import.meta.env.VITE_API_URL || 
    (window.location.hostname === 'localhost' 
      ? 'http://localhost:5000/api'
      : `${window.location.origin}/api`)
};

export default config; 