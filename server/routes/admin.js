const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');

// Admin authentication middleware
const isAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
  }
  next();
};

// Admin dashboard route
router.get('/', [auth, isAdmin], (req, res) => {
  res.json({
    message: 'Admin Dashboard',
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: 'admin'
    }
  });
});

// Get all users route
router.get('/users', [auth, isAdmin], async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error fetching users' });
  }
});

// Admin analytics route
router.get('/analytics', [auth, isAdmin], async (req, res) => {
  try {
    const analytics = {
      totalUsers: await User.countDocuments(),
      totalOrders: await Order.countDocuments(),
      totalProducts: await Product.countDocuments(),
      recentOrders: await Order.find().sort({ createdAt: -1 }).limit(5),
      lowStockProducts: await Product.find({ stock: { $lt: 10 } })
    };
    res.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Error fetching analytics' });
  }
});

// Update user role route
router.put('/users/:id/role', [auth, isAdmin], async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'Error updating user role' });
  }
});

module.exports = router; 