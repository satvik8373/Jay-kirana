import axios from 'axios';
import config from '../config';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Ensure URL starts with /api
    if (config.url && !config.url.startsWith('/api')) {
      config.url = `/api${config.url}`;
    }

    // Log outgoing request in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Outgoing request:', {
        method: config.method,
        url: config.url,
        baseURL: config.baseURL,
        fullURL: `${config.baseURL}${config.url}`,
        data: config.data
      });
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => {
    // Log successful response in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Response received:', {
        status: response.status,
        data: response.data,
        url: response.config.url
      });
    }
    return response;
  },
  async (error) => {
    // Log error response
    console.error('Response error:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url
    });

    if (error.response) {
      // Handle specific error cases
      switch (error.response.status) {
        case 401:
          // Handle unauthorized error
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 404:
          console.error('Resource not found:', error.config.url);
          break;
        case 500:
          console.error('Server error:', error.response.data);
          break;
      }
    } else if (error.request) {
      // Network error
      console.error('Network error:', error.message);
    }
    return Promise.reject(error);
  }
);

// API methods
export const apiService = {
  // Auth
  login: (data) => api.post(config.endpoints.login, data),
  register: (data) => api.post(config.endpoints.register, data),
  forgotPassword: (data) => api.post(config.endpoints.forgotPassword, data),
  resetPassword: (data) => api.post(config.endpoints.resetPassword, data),

  // Products
  getProducts: () => api.get(config.endpoints.products),
  addProduct: (data) => api.post(config.endpoints.products, data),
  updateProduct: (id, data) => api.put(`${config.endpoints.products}/${id}`, data),
  deleteProduct: (id) => api.delete(`${config.endpoints.products}/${id}`),

  // Categories
  getCategories: () => api.get(config.endpoints.categories),
  addCategory: (data) => api.post(config.endpoints.categories, data),
  updateCategory: (id, data) => api.put(`${config.endpoints.categories}/${id}`, data),
  deleteCategory: (id) => api.delete(`${config.endpoints.categories}/${id}`),

  // Orders
  getOrders: () => api.get(config.endpoints.orders),
  createOrder: (data) => api.post(config.endpoints.orders, data),
  updateOrderStatus: (id, status) => api.put(`${config.endpoints.orders}/${id}/status`, { status }),

  // User Profile
  getProfile: () => api.get(config.endpoints.profile),
  updateProfile: (data) => api.put(config.endpoints.profile, data),
  uploadAvatar: (formData) => api.post(config.endpoints.avatar, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),

  // Admin
  getAllUsers: () => api.get(config.endpoints.users)
};

export default api; 