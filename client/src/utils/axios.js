import axios from 'axios';
import config from '../config';

// Create axios instance with default config
const api = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log the request in development
    if (import.meta.env.MODE === 'development') {
      console.log('Outgoing request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        fullURL: `${config.baseURL}${config.url}`,
        data: config.data,
        headers: config.headers
      });
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => {
    // Log the response in development
    if (import.meta.env.MODE === 'development') {
      console.log('Response received:', {
        status: response.status,
        data: response.data,
        config: {
          method: response.config.method?.toUpperCase(),
          url: response.config.url
        }
      });
    }
    return response;
  },
  (error) => {
    // Handle 401 (Unauthorized) errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    // Log the error
    console.error('Response error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });

    return Promise.reject(error);
  }
);

export default api; 