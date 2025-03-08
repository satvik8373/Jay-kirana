import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';

function Cart({ cart, removeFromCart, updateQuantity }) {
  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h2>Your Shopping Cart</h2>
        
        {cart.length === 0 ? (
          <div className="empty-cart">
            <FaShoppingCart className="empty-cart-icon" />
            <p>Your cart is empty</p>
            <button onClick={() => navigate('/')} className="continue-shopping">
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map(item => (
                <div key={item._id} className="cart-item">
                  <div className="item-image">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150';
                      }}
                    />
                  </div>
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p className="item-category">{item.category}</p>
                    <p className="item-price">₹{item.price}</p>
                    <div className="quantity-controls">
                      <button 
                        onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                        className="quantity-btn"
                      >
                        -
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="quantity-btn"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="item-actions">
                    <p className="item-total">₹{(item.price * item.quantity).toFixed(2)}</p>
                    <button 
                      onClick={() => removeFromCart(item._id)}
                      className="remove-btn"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="cart-summary">
              <div className="summary-details">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>GST (18%):</span>
                  <span>₹{(total * 0.18).toFixed(2)}</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>₹{(total * 1.18).toFixed(2)}</span>
                </div>
              </div>
              <button onClick={handleCheckout} className="checkout-btn">
                Proceed to Checkout
              </button>
              <button onClick={() => navigate('/')} className="continue-shopping">
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .cart-page {
          padding: 120px 20px 40px;
          min-height: 100vh;
          background: #f5f5f5;
        }

        .cart-container {
          max-width: 1200px;
          margin: 0 auto;
          background: white;
          border-radius: 15px;
          padding: 30px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        h2 {
          color: #1a237e;
          margin-bottom: 30px;
          font-size: 1.8rem;
        }

        .empty-cart {
          text-align: center;
          padding: 40px;
          color: #666;
        }

        .empty-cart-icon {
          font-size: 4rem;
          color: #1a237e;
          opacity: 0.3;
          margin-bottom: 20px;
        }

        .empty-cart p {
          color: #666;
          margin-bottom: 20px;
          font-size: 1.1rem;
        }

        .cart-items {
          margin-bottom: 30px;
        }

        .cart-item {
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 20px;
          padding: 20px;
          border-bottom: 1px solid #eee;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .cart-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
        }

        .item-image {
          width: 120px;
          height: 120px;
        }

        .item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 10px;
        }

        .item-details h3 {
          color: #1a237e;
          margin: 0 0 10px;
          font-size: 1.2rem;
        }

        .item-category {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 10px;
        }

        .item-price {
          color: #1a237e;
          font-weight: 600;
          font-size: 1.1rem;
          margin-bottom: 10px;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .quantity-btn {
          background: #f0f0f0;
          border: none;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .quantity-btn:hover {
          background: #e0e0e0;
        }

        .quantity {
          font-size: 1.1rem;
          min-width: 30px;
          text-align: center;
        }

        .item-actions {
          text-align: right;
        }

        .item-total {
          color: #1a237e;
          font-weight: 700;
          font-size: 1.2rem;
          margin-bottom: 10px;
        }

        .remove-btn {
          background: none;
          border: none;
          color: #f44336;
          cursor: pointer;
          font-size: 0.9rem;
          padding: 5px 10px;
          border-radius: 15px;
          transition: all 0.3s ease;
        }

        .remove-btn:hover {
          background: #fee;
        }

        .cart-summary {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 10px;
          margin-top: 30px;
        }

        .summary-details {
          margin-bottom: 20px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          color: #666;
        }

        .summary-row.total {
          border-top: 2px solid #eee;
          margin-top: 10px;
          padding-top: 20px;
          font-size: 1.2rem;
          font-weight: 700;
          color: #1a237e;
        }

        .checkout-btn {
          width: 100%;
          padding: 15px;
          background: #1a237e;
          color: white;
          border: none;
          border-radius: 25px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          margin-bottom: 10px;
          transition: all 0.3s ease;
        }

        .checkout-btn:hover {
          background: #283593;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(26, 35, 126, 0.3);
        }

        .continue-shopping {
          width: 100%;
          padding: 15px;
          background: white;
          color: #1a237e;
          border: 1px solid #1a237e;
          border-radius: 25px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .continue-shopping:hover {
          background: #f5f5f5;
        }

        @media (max-width: 768px) {
          .cart-page {
            padding: 100px 15px 30px;
          }

          .cart-container {
            padding: 20px;
          }

          .cart-item {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .item-image {
            width: 100px;
            height: 100px;
            margin: 0 auto;
          }

          .item-actions {
            text-align: center;
          }

          .quantity-controls {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}

export default Cart;