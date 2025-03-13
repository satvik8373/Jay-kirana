const nodemailer = require('nodemailer');
require('dotenv').config();

// Log email configuration
console.log('Email Configuration:', {
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  user: process.env.EMAIL_USER ? 'Set' : 'Not set',
  pass: process.env.EMAIL_PASS ? 'Set' : 'Not set'
});

// Create transporter with detailed logging
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  debug: true, // Enable debug logging
  logger: true  // Enable built-in logger
});

// Default mail options
const defaultMailOptions = {
  from: `"Jay Kirana" <${process.env.EMAIL_USER}>`,
};

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Email verification error:', {
      error: error.message,
      code: error.code,
      command: error.command,
      response: error.response
    });
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Test email function
const sendTestEmail = async () => {
  try {
    const info = await transporter.sendMail({
      ...defaultMailOptions,
      to: process.env.EMAIL_USER, // Send to self
      subject: 'Test Email',
      text: 'This is a test email to verify the email configuration.',
      html: '<h1>Test Email</h1><p>This is a test email to verify the email configuration.</p>'
    });
    console.log('Test email sent:', info);
    return info;
  } catch (error) {
    console.error('Test email error:', {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response
    });
    throw error;
  }
};

// Function to send reset email
const sendResetEmail = async (to, resetLink) => {
  const mailOptions = {
    ...defaultMailOptions,
    to,
    subject: 'Password Reset Request',
    text: `You requested a password reset. Click the link to reset your password: ${resetLink}`,
    html: `<p>You requested a password reset. Click the link to reset your password: <a href="${resetLink}">${resetLink}</a></p>`,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  transporter,
  defaultMailOptions,
  sendTestEmail,
  sendResetEmail
}; 