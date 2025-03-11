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
    avatar: '/api/user/avatar',
    users: '/api/users/all'
  },
  // Add request configuration
  requestConfig: {
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true
  },
  // Add client URLs
  clientUrls: {
    local: 'http://localhost:5173',
    production: 'https://jay-kirana.onrender.com'
  }
};

// Helper function to build full API URL
config.getApiUrl = (endpoint) => {
  // Make sure endpoint starts with /api
  const path = endpoint.startsWith('/api') ? endpoint : `/api${endpoint}`;
  return `${config.apiUrl}${path}`;
};

// Helper function to build full upload URL
config.getUploadUrl = (path) => `${config.uploadUrl}/${path}`;

// Helper function to get current client URL
config.getCurrentClientUrl = () => 
  process.env.NODE_ENV === 'production' 
    ? config.clientUrls.production 
    : config.clientUrls.local;

export default config; 