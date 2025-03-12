const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Get token from header and validate format
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Invalid authorization header format');
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      throw new Error('No authentication token provided');
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.userId) {
      throw new Error('Invalid token format');
    }

    // Find user
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      throw new Error('User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    res.status(401).json({ error: 'Please authenticate' });
  }
};

module.exports = { auth }; 