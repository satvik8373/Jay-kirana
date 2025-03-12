const config = {
  development: {
    apiUrl: 'http://localhost:5000',
    clientUrl: 'http://localhost:5200'
  },
  production: {
    apiUrl: 'https://jay-kirana-api.onrender.com',
    clientUrl: 'https://jay-kirana.onrender.com'
  }
};

const environment = process.env.NODE_ENV || 'development';
const currentConfig = config[environment];

if (!currentConfig) {
  throw new Error(`No configuration found for environment: ${environment}`);
}

console.log('Current environment:', environment);
console.log('Using API URL:', currentConfig.apiUrl);

export default currentConfig; 