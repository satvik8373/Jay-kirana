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
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      // Handle specific error cases
      switch (error.response.status) {
        case 401:
          // Handle unauthorized error (e.g., clear token and redirect to login)
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
  })
};

export default api; 