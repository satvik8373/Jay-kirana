const config = {
  apiUrl: import.meta.env.VITE_API_URL,
  serverUrl: import.meta.env.VITE_SERVER_URL,
  clientUrl: import.meta.env.VITE_CLIENT_URL,
  uploadUrl: import.meta.env.VITE_UPLOAD_URL,

  // Helper function to get full API endpoint URL
  getApiEndpoint: (endpoint) => {
    return `${import.meta.env.VITE_API_URL}${endpoint}`;
  },

  // Debug information
  debug: {
    isProduction: import.meta.env.PROD,
    isDevelopment: import.meta.env.DEV,
    mode: import.meta.env.MODE,
  }
};

// Log configuration in development
if (import.meta.env.DEV) {
  console.log('App Configuration:', {
    apiUrl: config.apiUrl,
    serverUrl: config.serverUrl,
    clientUrl: config.clientUrl,
    uploadUrl: config.uploadUrl,
    debug: config.debug
  });
}

export default config; 