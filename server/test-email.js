require('dotenv').config();
const { sendTestEmail } = require('./utils/mailer');

console.log('Starting email test...');
console.log('Environment variables:', {
  NODE_ENV: process.env.NODE_ENV,
  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PORT: process.env.EMAIL_PORT,
  EMAIL_USER: process.env.EMAIL_USER ? 'Set' : 'Not set',
  EMAIL_PASS: process.env.EMAIL_PASS ? 'Set' : 'Not set'
});

sendTestEmail()
  .then(info => {
    console.log('Test email sent successfully!');
    console.log('Email info:', info);
    process.exit(0);
  })
  .catch(error => {
    console.error('Failed to send test email:', error);
    process.exit(1);
  }); 