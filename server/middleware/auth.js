const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Get token from header and validate format
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Invalid auth header:', authHeader);
      return res.status(401).json({ error: 'Invalid authorization header format' });
    }

    const token = authHeader.replace('Bearer ', '').trim();
    if (!token) {
      console.log('Empty token received');
      return res.status(401).json({ error: 'No authentication token provided' });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError.message);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    if (!decoded || !decoded.id) {
      console.log('Invalid token payload:', decoded);
      return res.status(401).json({ error: 'Invalid token format' });
    }

    // Find user
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      console.log('User not found for token:', decoded.id);
      return res.status(401).json({ error: 'User not found' });
    }

    // Add user and token to request
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    res.status(401).json({ error: 'Please authenticate' });
  }
};

module.exports = { auth }; 