const config = {
  apiUrl: process.env.NODE_ENV === 'production'
    ? 'https://jay-kirana-api.onrender.com'
    : 'http://localhost:5000',
  uploadUrl: process.env.NODE_ENV === 'production'
    ? 'https://jay-kirana-api.onrender.com/uploads'
    : 'http://localhost:5000/uploads',
  // Add API endpoints
  endpoints: {
    products: '/api/products',
    categories: '/api/categories',
    orders: '/api/orders',
    login: '/api/login',
    register: '/api/register',
    profile: '/api/user/profile',
    forgotPassword: '/api/forgot-password',
    resetPassword: '/api/reset-password',
    avatar: '/api/user/avatar'
  },
  // Add request configuration
  requestConfig: {
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true
  }
};

// Helper function to build full API URL
config.getApiUrl = (endpoint) => `${config.apiUrl}${endpoint}`;

// Helper function to build full upload URL
config.getUploadUrl = (path) => `${config.uploadUrl}/${path}`;

export default config; 