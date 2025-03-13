const isDevelopment = process.env.NODE_ENV === 'development';

const config = {
  apiUrl: isDevelopment 
    ? 'http://localhost:5000'
    : 'https://jay-kirana-api.onrender.com',
  clientUrl: isDevelopment
    ? 'http://localhost:5200'
    : 'https://jay-kirana.onrender.com',
  serverUploadUrl: isDevelopment
    ? 'http://localhost:5000/uploads'
    : 'https://jay-kirana-api.onrender.com/uploads'
};c

console.log('Environment:', isDevelopment ? 'Development' : 'Production');
console.log('Using API URL:', config.apiUrl);
console.log('Using Client URL:', config.clientUrl);
console.log('Using Upload URL:', config.serverUploadUrl);

export default config;