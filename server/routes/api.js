const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const Category = require('../models/Category');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Enable CORS for all routes with specific configuration
router.use(cors({
  origin: 'http://localhost:5200', // Allow requests from the client
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Load environment variables
require('dotenv').config();

// Get JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('JWT_SECRET is not configured in environment variables');
  process.exit(1);
}

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify email configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Email configuration error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Check MongoDB connection status
const checkMongoConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    console.error('MongoDB connection is not established. Current state:', mongoose.connection.readyState);
    return res.status(500).json({ error: 'Database connection error' });
  }
  next();
};

// Apply MongoDB connection check to all routes
router.use(checkMongoConnection);

// Middleware to verify JWT token
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password'); // Exclude password
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Get current user (requires authentication)
router.get('/user/me', verifyToken, async (req, res) => {
  try {
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// User Registration (public)
router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });
    const user = new User({ email, password, name });
    await user.save();
    res.json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// User Login (public)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    try {
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '24h' });
      const userData = {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email
        }
      };
      res.json(userData);
    } catch (tokenError) {
      console.error('Error generating token:', tokenError);
      res.status(500).json({ error: 'Error generating authentication token' });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all products (public)
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all products with debug info
router.get('/products/debug', async (req, res) => {
  try {
    const products = await Product.find();
    console.log('Available products:', products);
    res.json({
      count: products.length,
      products: products
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a product (public for now)
router.post('/products', async (req, res) => {
  const { name, category, price, stock, image } = req.body;
  
  console.log('Received product data:', req.body);

  // Validate required fields
  if (!name || !category || price === undefined || stock === undefined) {
    return res.status(400).json({ 
      error: 'Missing required fields',
      details: {
        name: !name ? 'Product name is required' : null,
        category: !category ? 'Category is required' : null,
        price: price === undefined ? 'Price is required' : null,
        stock: stock === undefined ? 'Stock is required' : null
      }
    });
  }

  // Validate data types and values
  if (typeof price !== 'number' || price < 0) {
    return res.status(400).json({ error: 'Price must be a non-negative number' });
  }

  if (typeof stock !== 'number' || stock < 0) {
    return res.status(400).json({ error: 'Stock must be a non-negative number' });
  }

  try {
    const product = new Product({
      name,
      category,
      price,
      stock,
      image: image || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
    });

    console.log('Creating product:', product);
    
    const savedProduct = await product.save();
    console.log('Product saved successfully:', savedProduct);
    
    res.json(savedProduct);
  } catch (err) {
    console.error('Error creating product:', {
      error: err,
      message: err.message,
      name: err.name,
      code: err.code
    });

    if (err.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation error',
        details: Object.values(err.errors).map(e => e.message)
      });
    }

    res.status(500).json({ 
      error: 'Failed to create product',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Add a test product (public for now)
router.post('/products/test', async (req, res) => {
  try {
    const testProduct = new Product({
      name: 'Test Product',
      category: 'Test Category',
      price: 100,
      stock: 10,
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
    });
    
    const savedProduct = await testProduct.save();
    console.log('Test product created:', savedProduct);
    
    res.json({
      message: 'Test product created successfully',
      product: savedProduct
    });
  } catch (err) {
    console.error('Error creating test product:', err);
    res.status(500).json({ error: 'Failed to create test product' });
  }
});

// Submit order (public)
router.post('/orders', async (req, res) => {
  const { products, total, address, phone, name } = req.body;

  console.log('Received order request:', {
    products,
    total,
    address,
    phone,
    name
  });

  // Validate required fields
  if (!products || !Array.isArray(products) || products.length === 0) {
    console.error('Invalid products data:', products);
    return res.status(400).json({ error: 'Invalid products data' });
  }

  if (!total || total <= 0) {
    console.error('Invalid total amount:', total);
    return res.status(400).json({ error: 'Invalid total amount' });
  }

  if (!name || !address || !phone) {
    console.error('Missing customer information:', { name, address, phone });
    return res.status(400).json({ error: 'Missing required customer information' });
  }

  try {
    // First, verify all products exist and have sufficient stock
    for (const product of products) {
      console.log('Checking product:', product);
      
      if (!mongoose.Types.ObjectId.isValid(product.productId)) {
        console.error('Invalid product ID:', product.productId);
        return res.status(400).json({ 
          error: `Invalid product ID format for ${product.name}` 
        });
      }

      const dbProduct = await Product.findById(product.productId);
      console.log('Found product in DB:', dbProduct);

      if (!dbProduct) {
        console.error('Product not found:', product.productId);
        return res.status(400).json({ 
          error: `Product ${product.name} not found` 
        });
      }
      if (dbProduct.stock < product.quantity) {
        console.error('Insufficient stock:', {
          product: product.name,
          requested: product.quantity,
          available: dbProduct.stock
        });
        return res.status(400).json({ 
          error: `Insufficient stock for ${product.name}. Available: ${dbProduct.stock}` 
        });
      }
    }

    // Create order
    const orderData = {
      products: products.map(product => ({
        productId: product.productId,
        quantity: product.quantity,
        name: product.name
      })),
      total,
      address,
      phone,
      name,
      orderDate: new Date()
    };

    console.log('Creating order with data:', orderData);

    const order = new Order(orderData);
    const savedOrder = await order.save();
    console.log('Order saved successfully:', savedOrder);

    // Update product stock
    try {
      const stockUpdates = await Promise.all(products.map(async product => {
        const updated = await Product.findByIdAndUpdate(
          product.productId,
          { $inc: { stock: -product.quantity } },
          { new: true }
        );
        console.log(`Stock updated for product ${product.name}:`, updated);
        return updated;
      }));
      console.log('All stock updates completed:', stockUpdates);
    } catch (stockError) {
      console.error('Error updating stock:', {
        error: stockError,
        message: stockError.message,
        stack: stockError.stack
      });
      // Don't fail the order if stock update fails
    }

    res.json({
      message: 'Order placed successfully',
      orderId: savedOrder._id,
      status: savedOrder.status
    });
  } catch (err) {
    console.error('Detailed order error:', {
      error: err,
      message: err.message,
      stack: err.stack,
      name: err.name,
      code: err.code
    });
    
    // Send appropriate error message based on the error type
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Invalid order data',
        details: Object.values(err.errors).map(e => e.message)
      });
    }
    
    if (err.name === 'MongoError' || err.name === 'MongoServerError') {
      return res.status(500).json({
        error: 'Database error occurred',
        details: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
      });
    }

    res.status(500).json({
      error: 'Failed to place order',
      details: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
});

// Get all orders (public)
router.get('/orders', async (req, res) => {
  console.log('Received request to fetch orders');
  try {
    // First check if we have any orders
    const count = await Order.countDocuments();
    console.log(`Total orders in database: ${count}`);

    // Get all orders with full details
    const orders = await Order.find()
      .select('-__v')  // Exclude version key
      .lean()  // Convert to plain JavaScript object
      .sort({ orderDate: -1 });  // Sort by newest first
    
    console.log(`Successfully retrieved ${orders.length} orders`);
    
    if (orders.length === 0) {
      console.log('No orders found in the database');
    } else {
      console.log('First order example:', JSON.stringify(orders[0], null, 2));
    }
    
    // Send the response
    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', {
      error: err,
      message: err.message,
      stack: err.stack
    });
    res.status(500).json({ 
      error: 'Failed to fetch orders',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Update order status
router.put('/orders/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    console.log('Updating order status:', { orderId, newStatus: status });

    // Validate orderId format
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      console.error('Invalid order ID format:', orderId);
      return res.status(400).json({ error: 'Invalid order ID format' });
    }

    // Validate status
    const validStatuses = ['pending', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      console.error('Invalid status value:', status);
      return res.status(400).json({ 
        error: 'Invalid status',
        validStatuses
      });
    }

    // Find and update the order
    const order = await Order.findById(orderId);
    
    if (!order) {
      console.error('Order not found:', orderId);
      return res.status(404).json({ error: 'Order not found' });
    }

    // Prevent updating to same status
    if (order.status === status) {
      return res.status(400).json({ 
        error: 'Order is already in this status'
      });
    }

    // Update status and relevant dates
    order.status = status;
    if (status === 'completed') {
      order.completedDate = new Date();
    } else if (status === 'cancelled') {
      order.cancelledDate = new Date();
    }

    // Save the updated order
    const updatedOrder = await order.save();
    console.log('Order status updated successfully:', {
      orderId,
      oldStatus: order.status,
      newStatus: status,
      order: updatedOrder
    });

    res.json({ 
      message: 'Order status updated successfully',
      order: updatedOrder
    });

  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ 
      error: 'Failed to update order status',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    console.log('GET /categories - Fetching all categories');
    const dbState = mongoose.connection.readyState;
    console.log('MongoDB connection state:', dbState);

    if (dbState !== 1) {
      throw new Error('MongoDB not connected. Current state: ' + dbState);
    }

    const categories = await Category.find().sort({ name: 1 });
    console.log('Categories fetched successfully:', categories);
    res.json(categories);
  } catch (err) {
    console.error('Error in GET /categories:', {
      error: err,
      message: err.message,
      stack: err.stack
    });
    res.status(500).json({ 
      error: 'Failed to fetch categories',
      details: err.message
    });
  }
});

// Add a new category
router.post('/categories', async (req, res) => {
  try {
    console.log('POST /categories - Adding new category:', req.body);
    const dbState = mongoose.connection.readyState;
    console.log('MongoDB connection state:', dbState);

    if (dbState !== 1) {
      throw new Error('MongoDB not connected. Current state: ' + dbState);
    }

    const { name } = req.body;
    
    if (!name || !name.trim()) {
      console.log('Invalid category name provided:', name);
      return res.status(400).json({ error: 'Category name is required' });
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ name: name.trim() });
    if (existingCategory) {
      console.log('Category already exists:', existingCategory);
      return res.status(400).json({ error: 'Category already exists' });
    }

    const category = new Category({ name: name.trim() });
    console.log('Attempting to save category:', category);
    
    const savedCategory = await category.save();
    console.log('Category saved successfully:', savedCategory);
    
    res.status(201).json(savedCategory);
  } catch (err) {
    console.error('Error in POST /categories:', {
      error: err,
      message: err.message,
      stack: err.stack,
      code: err.code
    });
    
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Category already exists' });
    }
    
    res.status(500).json({ 
      error: 'Failed to add category',
      details: err.message
    });
  }
});

// Update a category
router.put('/categories/:id', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name: name.trim() },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(category);
  } catch (err) {
    console.error('Error updating category:', err);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// Delete a category
router.delete('/categories/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    console.error('Error deleting category:', err);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// Test route for MongoDB and Category model
router.get('/test/categories', async (req, res) => {
  try {
    // Test MongoDB connection
    const dbState = mongoose.connection.readyState;
    console.log('MongoDB connection state:', dbState);
    
    // Test Category model
    const testCategory = new Category({
      name: `Test Category ${Date.now()}`
    });
    
    // Try to save
    const savedCategory = await testCategory.save();
    console.log('Test category saved:', savedCategory);
    
    // Clean up
    await Category.findByIdAndDelete(savedCategory._id);
    
    res.json({
      dbState,
      mongoConnected: dbState === 1,
      categoryModelWorking: true,
      testCategory: savedCategory
    });
  } catch (err) {
    console.error('Test route error:', {
      error: err,
      message: err.message,
      stack: err.stack
    });
    res.status(500).json({
      error: 'Test failed',
      details: err.message,
      dbState: mongoose.connection.readyState
    });
  }
});

// Delete a product
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Forgot Password Route
router.post('/forgot-password', async (req, res) => {
  console.log('Received forgot password request:', req.body);
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    console.log('Looking for user with email:', email);
    const user = await User.findOne({ email });
    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      console.log('User not found for email:', email);
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // Token valid for 1 hour
    console.log('Generated reset token:', resetToken);

    // Save reset token to user
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();
    console.log('Reset token saved to user');

    // Create reset password URL
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    console.log('Reset URL:', resetUrl);

    // Test email configuration
    console.log('Email configuration:', {
      from: process.env.EMAIL_USER,
      to: email,
      emailPass: process.env.EMAIL_PASS ? 'Set' : 'Not set',
      clientUrl: process.env.CLIENT_URL
    });

    try {
      // Send email
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset Request',
        html: `
          <h1>Password Reset Request</h1>
          <p>You requested a password reset. Click the link below to reset your password:</p>
          <a href="${resetUrl}">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
        `
      };

      console.log('Attempting to send email...');
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
      
      res.json({ message: 'Password reset instructions sent to your email' });
    } catch (emailError) {
      console.error('Email sending error:', {
        error: emailError.message,
        code: emailError.code,
        command: emailError.command,
        response: emailError.response
      });
      
      // Cleanup the reset token since email failed
      user.resetToken = undefined;
      user.resetTokenExpiry = undefined;
      await user.save();
      
      throw new Error('Failed to send password reset email');
    }
  } catch (error) {
    console.error('Detailed forgot password error:', {
      error: error.message,
      stack: error.stack,
      code: error.code,
      name: error.name
    });
    
    if (error.message === 'Failed to send password reset email') {
      return res.status(500).json({ 
        error: 'Failed to send password reset email. Please try again later.',
        details: 'Email service error'
      });
    }
    
    res.status(500).json({ 
      error: 'Error processing your request', 
      details: error.message 
    });
  }
});

// Reset Password Route
router.post('/reset-password', async (req, res) => {
  console.log('Received reset password request:', req.body);
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      console.log('Missing required fields:', { token: !!token, newPassword: !!newPassword });
      return res.status(400).json({ error: 'Token and new password are required' });
    }

    // Find user with valid reset token
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      console.log('Invalid or expired reset token');
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Update password
    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    try {
      await user.save();
      console.log('Password reset successful for user:', user.email);
      res.json({ message: 'Password reset successful' });
    } catch (saveError) {
      console.error('Error saving new password:', saveError);
      res.status(500).json({ error: 'Failed to save new password' });
    }
  } catch (error) {
    console.error('Reset password error:', {
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

module.exports = router;