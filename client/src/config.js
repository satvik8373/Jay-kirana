const getApiUrl = () => {
  // First priority: Environment variable
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Second priority: Production URL
  if (window.location.hostname !== 'localhost') {
    // For Vercel deployment
    return `${window.location.origin}/api`;
  }

  // Default: Local development
  return 'http://localhost:5000/api';
};

const config = {
  apiUrl: getApiUrl()
};

export default config; 