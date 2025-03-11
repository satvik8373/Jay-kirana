const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      console.log('Missing Authorization header');
      return res.status(401).json({ error: 'No authorization header provided' });
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      console.log('No token found in Authorization header');
      return res.status(401).json({ error: 'No token provided' });
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not configured');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    try {
      console.log('Attempting to verify token:', token.substring(0, 10) + '...');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if (!decoded || !decoded.id) {
        console.log('Invalid token format:', decoded);
        return res.status(401).json({ error: 'Invalid token format' });
      }

      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        console.log('User not found for token:', decoded.id);
        return res.status(401).json({ error: 'User not found' });
      }

      // Check if token is expired
      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < currentTimestamp) {
        console.log('Token expired:', {
          expiry: new Date(decoded.exp * 1000),
          current: new Date(currentTimestamp * 1000)
        });
        return res.status(401).json({ error: 'Token has expired' });
      }

      console.log('Token verified successfully for user:', user.email);
      req.user = user;
      req.token = token;
      next();
    } catch (jwtError) {
      console.error('JWT verification error:', {
        error: jwtError.message,
        name: jwtError.name,
        token: token.substring(0, 10) + '...'
      });
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Server error during authentication' });
  }
};

module.exports = { auth }; 