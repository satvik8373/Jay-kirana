const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: false // Optional for guest checkout
  },
  products: [{
    productId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product',
      required: true
    },
    quantity: { 
      type: Number, 
      required: true,
      min: [1, 'Quantity must be at least 1']
    },
    name: { 
      type: String, 
      required: true 
    }
  }],
  total: { 
    type: Number, 
    required: true,
    min: [0, 'Total amount cannot be negative']
  },
  name: { 
    type: String, 
    required: [true, 'Customer name is required'],
    trim: true
  },
  address: { 
    type: String, 
    required: [true, 'Delivery address is required'],
    trim: true
  },
  phone: { 
    type: String, 
    required: [true, 'Phone number is required'],
    trim: true
  },
  orderDate: { 
    type: Date, 
    default: Date.now 
  },
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  },
  completedDate: {
    type: Date,
    default: null
  },
  cancelledDate: {
    type: Date,
    default: null
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Add index for better query performance
orderSchema.index({ userId: 1, orderDate: -1 });

module.exports = mongoose.model('Order', orderSchema);