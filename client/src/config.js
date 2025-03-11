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
axios.defaults.withCredentials = true; // Important for CORS with credentials
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Add request interceptor to handle API paths
axios.interceptors.request.use(
  (config) => {
    // Log the request for debugging
    console.log('API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      data: config.data,
      headers: config.headers
    });

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
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
axios.interceptors.response.use(
  (response) => {
    // Log the response for debugging
    console.log('API Response:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  (error) => {
    // Log the error for debugging
    console.error('Response Error:', {
      message: error.message,
      response: error.response,
      status: error.response?.status
    });
    return Promise.reject(error);
  }
);

export default config; 