require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { sendResetEmail } = require('./mailer'); // Adjust the path as necessary

const app = express();

// Connect to MongoDB
connectDB().catch(err => {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1);
});

// Middleware
app.use(cors());  // Allow all origins during development
app.use(express.json());

// Routes
app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;

  // Check if the email exists in your database
  const user = await User.findOne({ email });
  if (!user) return res.status(404).send({ error: 'User not found' });

  // Generate a reset link (you might want to save this in your database with an expiration)
  const resetLink = `http://localhost:5000/reset-password?token=your_generated_token`; // Adjust the link as needed

  try {
    await sendResetEmail(email, resetLink);
    res.send({ message: 'Reset email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send({ error: 'Failed to send reset email' });
  }
});

app.post('/api/test-email', async (req, res) => {
  const { email } = req.body;
  const resetLink = 'http://localhost:5000/reset-password?token=test_token'; // Example link

  try {
    await sendResetEmail(email, resetLink);
    res.send({ message: 'Test email sent successfully' });
  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).send({ error: 'Failed to send test email' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ 
    error: 'Server error', 
    details: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('MongoDB URI:', process.env.MONGODB_URI);
}); 