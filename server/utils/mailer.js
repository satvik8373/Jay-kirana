const nodemailer = require('nodemailer');

// Create a transporter object using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Configure default email options
const defaultMailOptions = {
  from: '"JAY KIRANA STORE" <' + process.env.EMAIL_USER + '>',
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
  sendResetEmail
}; 