const config = {
  apiUrl: process.env.NODE_ENV === 'production'
    ? 'https://jay-kirana-api.onrender.com'
    : 'http://localhost:5000',
  uploadUrl: process.env.NODE_ENV === 'production'
    ? 'https://jay-kirana-api.onrender.com/uploads'
    : 'http://localhost:5000/uploads',
  apiPath: '/api'
};

// Add axios default configuration
import axios from 'axios';

// Configure axios defaults
axios.defaults.baseURL = config.apiUrl;

// Add request interceptor to handle API paths
axios.interceptors.request.use(
  (config) => {
    // Don't modify if it's an absolute URL
    if (!/^https?:\/\//i.test(config.url)) {
      // Only add /api if it's not already there
      if (!config.url.startsWith('/api')) {
        config.url = `/api${config.url}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default config; 