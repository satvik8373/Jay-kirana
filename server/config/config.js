require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET,
  mongoUri: process.env.MONGODB_URI,
  
  // URLs
  serverUrl: process.env.NODE_ENV === 'production'
    ? 'https://jay-kirana-api.onrender.com'
    : 'http://localhost:5000',
  clientUrl: process.env.NODE_ENV === 'production'
    ? 'https://jay-kirana.onrender.com'
    : 'http://localhost:5200',
  serverUploadUrl: process.env.NODE_ENV === 'production'
    ? 'https://jay-kirana-api.onrender.com/uploads'
    : 'http://localhost:5000/uploads',
  apiBaseUrl: process.env.API_BASE_URL || '',
  
  // Email
  email: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    adminEmail: process.env.ADMIN_EMAIL
  },
  
  // CORS
  cors: {
    origin: process.env.NODE_ENV === 'production'
      ? 'https://jay-kirana.onrender.com'
      : ['http://localhost:5200', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  },

  // Get full API URL
  getApiUrl: function() {
    return this.serverUrl;
  },

  // Get full URL for a specific endpoint
  getEndpointUrl: function(endpoint) {
    return `${this.serverUrl}${endpoint}`;
  }
};

module.exports = config; 