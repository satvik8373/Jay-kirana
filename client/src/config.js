const isDevelopment = process.env.NODE_ENV === 'development';

// Force production mode if running on Render
const isOnRender = window.location.hostname.includes('render.com');
const forceProduction = isOnRender || process.env.NODE_ENV === 'production';

const config = {
  apiUrl: forceProduction
    ? 'https://jay-kirana.onrender.com/api'
    : 'http://localhost:5000',
  clientUrl: forceProduction
    ? 'https://jay-kirana.onrender.com'
    : 'http://localhost:5200',
  serverUploadUrl: forceProduction
    ? 'https://jay-kirana.onrender.com/api/uploads'
    : 'http://localhost:5000/uploads'
};

console.log('Environment:', forceProduction ? 'Production' : 'Development');
console.log('Using API URL:', config.apiUrl);
console.log('Using Client URL:', config.clientUrl);
console.log('Using Upload URL:', config.serverUploadUrl);

export default config;