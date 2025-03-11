const config = {
  apiUrl: process.env.NODE_ENV === 'production'
    ? 'https://jay-kirana-api.onrender.com/api'
    : 'http://localhost:5000/api',
  uploadUrl: process.env.NODE_ENV === 'production'
    ? 'https://jay-kirana-api.onrender.com/uploads'
    : 'http://localhost:5000/uploads',
  isProduction: process.env.NODE_ENV === 'production'
};

// Add axios default configuration
import axios from 'axios';

// Configure axios defaults
axios.defaults.baseURL = config.apiUrl;
axios.defaults.withCredentials = true;

// Add request interceptor for debugging
axios.interceptors.request.use(
  (config) => {
    console.log('API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      data: config.data,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
axios.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  (error) => {
    console.error('Response Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    return Promise.reject(error);
  }
);

export default config; 