require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET,
  mongoUri: process.env.MONGODB_URI,
  
  // URLs
  serverUrl: process.env.SERVER_URL || 'http://localhost:5000',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5200',
  apiBaseUrl: process.env.API_BASE_URL || '/api',
  
  // Email
  email: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    adminEmail: process.env.ADMIN_EMAIL
  },
  
  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5200',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  },

  // Get full API URL
  getApiUrl: function() {
    return `${this.serverUrl}${this.apiBaseUrl}`;
  },

  // Get full URL for a specific endpoint
  getEndpointUrl: function(endpoint) {
    return `${this.serverUrl}${this.apiBaseUrl}${endpoint}`;
  }
};

module.exports = config; 