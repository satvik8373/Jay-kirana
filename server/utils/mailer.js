import nodemailer from 'nodemailer';

// Create a transporter object using Ethereal SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: "maddison53@ethereal.email", // Your Ethereal email
    pass: "jn7jnAPss4f63QBp6D", // Your Ethereal password
  },
});

// Function to send reset email
export const sendResetEmail = async (to, resetLink) => {
  const mailOptions = {
    from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // Sender address
    to, // List of recipients
    subject: 'Password Reset Request', // Subject line
    text: `You requested a password reset. Click the link to reset your password: ${resetLink}`, // Plain text body
    html: `<p>You requested a password reset. Click the link to reset your password: <a href="${resetLink}">${resetLink}</a></p>`, // HTML body
  };

  return transporter.sendMail(mailOptions);
}; 