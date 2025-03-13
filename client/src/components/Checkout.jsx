import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { FaShoppingBag, FaTruck, FaCreditCard, FaArrowLeft } from 'react-icons/fa';
import config from '../config';

function Checkout({ cart, onCheckout }) {
  const [form, setForm] = useState({ name: '', address: '', phone: '' });
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const gst = total * 0.18;
  const deliveryCharge = total > 500 ? 0 : 50;
  const finalTotal = total + gst + deliveryCharge;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      setError('Please enter your full name');
      return false;
    }
    if (!form.address.trim()) {
      setError('Please enter your delivery address');
      return false;
    }
    if (!form.phone.trim()) {
      setError('Please enter your phone number');
      return false;
    }
    if (!/^\d{10}$/.test(form.phone.trim())) {
      setError('Please enter a valid 10-digit phone number');
      return false;
    }
    if (cart.length === 0) {
      setError('Your cart is empty');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const formattedProducts = cart.map(item => ({
        productId: item._id,
        quantity: parseInt(item.quantity),
        name: item.name
      }));

      const orderData = {
        products: formattedProducts,
        total: parseFloat(finalTotal.toFixed(2)),
        name: form.name.trim(),
        address: form.address.trim(),
        phone: form.phone.trim()
      };

      console.log('Submitting order:', orderData);
      const response = await axios.post(`${config.apiUrl}/orders`, orderData);
      console.log('Order response:', response.data);
      
      if (response.data) {
        onCheckout();
        alert(`Order placed successfully! Your order ID is: ${response.data.orderId || response.data._id}`);
        navigate('/');
      }
    } catch (err) {
      console.error('Error placing order:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setError(err.response?.data?.error || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <button onClick={() => navigate('/cart')} className="back-button">
            <FaArrowLeft /> Back to Cart
          </button>
          <h2>Checkout</h2>
        </div>

        <div className="checkout-content">
          <div className="order-details">
            <div className="section-title">
              <FaShoppingBag />
              <h3>Order Summary</h3>
            </div>
            <div className="order-items">
              {cart.map(item => (
                <div key={item._id} className="order-item">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/50';
                    }}
                  />
                  <div className="item-info">
                    <h4>{item.name}</h4>
                    <p className="item-category">{item.category}</p>
                  </div>
                  <div className="item-price">
                    <p className="quantity">x{item.quantity}</p>
                    <p className="price">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="price-breakdown">
              <div className="price-row">
                <span>Subtotal</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div className="price-row">
                <span>GST (18%)</span>
                <span>₹{gst.toFixed(2)}</span>
              </div>
              <div className="price-row">
                <span>Delivery {deliveryCharge === 0 && '(Free)'}</span>
                <span>₹{deliveryCharge.toFixed(2)}</span>
              </div>
              <div className="price-row total">
                <span>Total</span>
                <span>₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="delivery-details">
            <div className="section-title">
              <FaTruck />
              <h3>Delivery Details</h3>
            </div>
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="checkout-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="address">Delivery Address</label>
                <textarea
                  id="address"
                  name="address"
                  placeholder="Enter your complete delivery address"
                  value={form.address}
                  onChange={handleChange}
                  required
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Enter your 10-digit phone number"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{10}"
                />
              </div>
              <div className="payment-section">
                <div className="section-title">
                  <FaCreditCard />
                  <h3>Payment Method</h3>
                </div>
                <p className="cod-notice">Cash on Delivery Only</p>
              </div>
              <button 
                type="submit" 
                className="place-order-btn"
                disabled={isSubmitting || cart.length === 0}
              >
                {isSubmitting ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        .checkout-page {
          padding: 120px 20px 40px;
          min-height: 100vh;
          background: #f5f5f5;
        }

        .checkout-container {
          max-width: 1200px;
          margin: 0 auto;
          background: white;
          border-radius: 15px;
          padding: 30px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .checkout-header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 30px;
        }

        .back-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          color: #1a237e;
          cursor: pointer;
          font-size: 1rem;
          padding: 8px 12px;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .back-button:hover {
          background: #f0f0f0;
        }

        h2 {
          color: #1a237e;
          font-size: 1.8rem;
          margin: 0;
        }

        .checkout-content {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 30px;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 2px solid #f0f0f0;
        }

        .section-title svg {
          color: #1a237e;
          font-size: 1.2rem;
        }

        .section-title h3 {
          color: #1a237e;
          font-size: 1.3rem;
          margin: 0;
        }

        .order-details {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 10px;
        }

        .order-items {
          margin-bottom: 20px;
        }

        .order-item {
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 15px;
          padding: 15px 0;
          border-bottom: 1px solid #eee;
        }

        .order-item img {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: 8px;
        }

        .item-info h4 {
          margin: 0 0 5px;
          color: #1a237e;
          font-size: 1rem;
        }

        .item-category {
          color: #666;
          font-size: 0.9rem;
          margin: 0;
        }

        .item-price {
          text-align: right;
        }

        .quantity {
          color: #666;
          margin: 0 0 5px;
        }

        .price {
          color: #1a237e;
          font-weight: 600;
          margin: 0;
        }

        .price-breakdown {
          margin-top: 20px;
        }

        .price-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          color: #666;
        }

        .price-row.total {
          border-top: 2px solid #eee;
          margin-top: 10px;
          padding-top: 15px;
          color: #1a237e;
          font-weight: 700;
          font-size: 1.1rem;
        }

        .delivery-details {
          padding: 20px;
          background: white;
          border-radius: 10px;
          border: 1px solid #eee;
        }

        .error-message {
          background: #fee;
          color: #f44336;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 0.9rem;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          color: #1a237e;
          font-weight: 500;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          border-color: #1a237e;
          outline: none;
          box-shadow: 0 0 0 2px rgba(26, 35, 126, 0.1);
        }

        .payment-section {
          margin: 30px 0;
        }

        .cod-notice {
          background: #e8eaf6;
          color: #1a237e;
          padding: 15px;
          border-radius: 8px;
          text-align: center;
          font-weight: 500;
        }

        .place-order-btn {
          width: 100%;
          padding: 15px;
          background: #1a237e;
          color: white;
          border: none;
          border-radius: 25px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .place-order-btn:hover:not(:disabled) {
          background: #283593;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(26, 35, 126, 0.3);
        }

        .place-order-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        @media (max-width: 968px) {
          .checkout-content {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .checkout-page {
            padding: 100px 15px 30px;
          }

          .checkout-container {
            padding: 20px;
          }

          h2 {
            font-size: 1.5rem;
          }

          .section-title h3 {
            font-size: 1.2rem;
          }

          .order-item {
            grid-template-columns: auto 1fr;
          }

          .item-price {
            grid-column: 1 / -1;
            text-align: left;
            margin-top: 10px;
          }
        }
      `}</style>
    </div>
  );
}

export default Checkout;