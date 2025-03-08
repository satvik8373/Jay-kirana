// Environment Variables
const ENV = {
  PRODUCTION: import.meta.env.PROD,
  DEVELOPMENT: import.meta.env.DEV,
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
};

// Authentication configuration
export const AUTH_CONFIG = {
  ADMIN_EMAIL: 'satvikpatel8373@gmail.com',
};

// API configuration
export const API_CONFIG = {
  BASE_URL: ENV.PRODUCTION 
    ? 'https://jay-kirana-api.vercel.app'  // Replace with your Vercel API URL
    : 'http://localhost:5000',
  ENDPOINTS: {
    LOGIN: '/api/login',
    REGISTER: '/api/register',
    FORGOT_PASSWORD: '/api/forgot-password',
    RESET_PASSWORD: '/api/reset-password',
    USER: '/api/user',
  }
};

// App configuration
export const APP_CONFIG = {
  NAME: 'Jay Kirana',
  DESCRIPTION: 'Your trusted partner for fresh groceries and daily essentials',
  CONTACT: {
    PHONE: '+1-123-456-7890',
    EMAIL: 'info@jaykirana.com',
    ADDRESS: '123 Fresh Market Street'
  }
}; 