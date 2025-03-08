const config = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  
  // Authentication Configuration
  ADMIN_EMAIL: import.meta.env.VITE_ADMIN_EMAIL || 'satvikpatel8373@gmail.com',
  TOKEN_KEY: 'jay-kirana-token',
  
  // App Configuration
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Jay Kirana',
  CONTACT_EMAIL: import.meta.env.VITE_CONTACT_EMAIL || 'info@jaykirana.com',
  CONTACT_PHONE: import.meta.env.VITE_CONTACT_PHONE || '+1-123-456-7890',
  
  // Social Media Links
  SOCIAL_LINKS: {
    facebook: '#',
    twitter: '#',
    instagram: '#',
    linkedin: '#'
  }
};

export default config; 