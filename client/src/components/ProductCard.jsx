import React from 'react';
import { FaShoppingCart, FaLeaf, FaFireAlt, FaCookie, FaWineBottle } from 'react-icons/fa';
import { GiMedicines } from 'react-icons/gi';

function ProductCard({ product = {}, addToCart }) {
  // Default category images and colors
  const categoryConfig = {
    groceries: {
      icon: FaLeaf,
      color: '#4CAF50',
      gradient: 'linear-gradient(135deg, #4CAF50 0%, #81C784 100%)',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400&auto=format'
    },
    spices: {
      icon: FaFireAlt,
      color: '#FF5722',
      gradient: 'linear-gradient(135deg, #FF5722 0%, #FF8A65 100%)',
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=400&auto=format'
    },
    snacks: {
      icon: FaCookie,
      color: '#FFC107',
      gradient: 'linear-gradient(135deg, #FFC107 0%, #FFD54F 100%)',
      image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?q=80&w=400&auto=format'
    },
    beverages: {
      icon: FaWineBottle,
      color: '#2196F3',
      gradient: 'linear-gradient(135deg, #2196F3 0%, #64B5F6 100%)',
      image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?q=80&w=400&auto=format'
    },
    medicines: {
      icon: GiMedicines,
      color: '#E91E63',
      gradient: 'linear-gradient(135deg, #E91E63 0%, #F06292 100%)',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400&auto=format'
    }
  };

  const defaultConfig = {
    icon: FaLeaf,
    color: '#1a237e',
    gradient: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400&auto=format'
  };

  const category = (product.category || '').toLowerCase();
  const config = categoryConfig[category] || defaultConfig;
  const Icon = config.icon;

  const handleAddToCart = (e) => {
    if (!product || !addToCart) return;

    const productCard = e.currentTarget.closest('.product-card');
    const productImage = productCard.querySelector('.product-image');
    const cartIcon = document.querySelector('.nav-icons .icon-wrapper:first-child');

    if (productImage && cartIcon) {
      // Create flying image element
      const flyingImage = productImage.cloneNode(true);
      const rect = productImage.getBoundingClientRect();
      const cartRect = cartIcon.getBoundingClientRect();

      // Set initial styles for the flying image
      flyingImage.style.cssText = `
        position: fixed;
        z-index: 1000;
        left: ${rect.left}px;
        top: ${rect.top}px;
        width: ${rect.width}px;
        height: ${rect.height}px;
        border-radius: 8px;
        transition: all 0.8s cubic-bezier(0.19, 1, 0.22, 1);
        pointer-events: none;
      `;

      document.body.appendChild(flyingImage);

      // Trigger animation
      setTimeout(() => {
        flyingImage.style.cssText = `
          position: fixed;
          z-index: 1000;
          left: ${cartRect.left}px;
          top: ${cartRect.top}px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          transition: all 0.8s cubic-bezier(0.19, 1, 0.22, 1);
          pointer-events: none;
          opacity: 0;
          transform: scale(0.3);
        `;

        // Add pulse effect to cart icon
        cartIcon.classList.add('cart-pulse');

        // Remove flying image and pulse effect after animation
        setTimeout(() => {
          document.body.removeChild(flyingImage);
          cartIcon.classList.remove('cart-pulse');
        }, 800);
      }, 50);
    }

    // Call the original addToCart function
    addToCart(product);
  };

  if (!product) {
    return null;
  }

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img 
          src={product.image || config.image}
          alt={product.name || 'Product Image'}
          className="product-image"
          onError={(e) => {
            e.target.src = config.image;
          }}
        />
        <div className="category-badge" style={{ background: config.gradient }}>
          <Icon className="category-icon" />
          <span>{product.category || 'Uncategorized'}</span>
        </div>
      </div>
      
      <div className="product-info">
        <h3>{product.name || 'Unnamed Product'}</h3>
        <div className="price-stock">
          <span className="price">₹{product.price || 0}</span>
          <span className={`stock ${(product.stock || 0) > 0 ? 'in-stock' : 'out-of-stock'}`}>
            {(product.stock || 0) > 0 ? `${product.stock} in stock` : 'Out of Stock'}
          </span>
        </div>
        
        {(product.stock || 0) > 0 ? (
          <button 
            onClick={handleAddToCart}
            className="add-to-cart-btn"
            style={{ background: config.gradient }}
          >
            <FaShoppingCart className="cart-icon" />
            Add to Cart
          </button>
        ) : (
          <button className="out-of-stock-btn" disabled>
            Out of Stock
          </button>
        )}
      </div>

      <style jsx>{`
        .product-card {
          background: white;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          position: relative;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .product-image-container {
          position: relative;
          width: 100%;
          padding-top: 75%; /* 4:3 Aspect Ratio */
          overflow: hidden;
        }

        .product-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .product-card:hover .product-image {
          transform: scale(1.05);
        }

        .category-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          padding: 8px 12px;
          border-radius: 25px;
          color: white;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 5px;
          backdrop-filter: blur(5px);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          z-index: 1;
        }

        .category-icon {
          font-size: 1rem;
        }

        .product-info {
          padding: var(--spacing-md);
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          gap: var(--spacing-sm);
        }

        h3 {
          color: var(--primary-color);
          font-size: 1.1rem;
          margin: 0;
          font-weight: 600;
          height: 2.4em;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .price-stock {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: var(--spacing-sm) 0;
        }

        .price {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--primary-color);
        }

        .stock {
          font-size: 0.9rem;
          padding: 4px 8px;
          border-radius: 12px;
        }

        .in-stock {
          background: rgba(76, 175, 80, 0.1);
          color: #4CAF50;
        }

        .out-of-stock {
          background: rgba(244, 67, 54, 0.1);
          color: #F44336;
        }

        .add-to-cart-btn {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 25px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s ease;
          margin-top: auto;
        }

        .add-to-cart-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .cart-icon {
          font-size: 1.1rem;
        }

        .out-of-stock-btn {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 25px;
          background: #f5f5f5;
          color: #999;
          font-weight: 600;
          cursor: not-allowed;
          margin-top: auto;
        }

        @media (max-width: 1024px) {
          .product-info {
            padding: var(--spacing-sm);
          }

          h3 {
            font-size: 1rem;
          }

          .price {
            font-size: 1.1rem;
          }

          .stock {
            font-size: 0.8rem;
          }

          .add-to-cart-btn,
          .out-of-stock-btn {
            padding: 10px;
          }
        }

        @media (max-width: 768px) {
          .product-image-container {
            padding-top: 66.67%; /* 3:2 Aspect Ratio */
          }

          .category-badge {
            padding: 6px 10px;
            font-size: 0.75rem;
          }

          .category-icon {
            font-size: 0.9rem;
          }

          h3 {
            font-size: 0.95rem;
            height: 2.6em;
          }

          .price {
            font-size: 1rem;
          }

          .stock {
            font-size: 0.75rem;
            padding: 3px 6px;
          }

          .cart-icon {
            font-size: 1rem;
          }
        }

        @media (max-width: 480px) {
          .product-image-container {
            padding-top: 60%; /* 5:3 Aspect Ratio */
          }

          .product-info {
            padding: var(--spacing-xs);
          }

          h3 {
            font-size: 0.9rem;
          }

          .price {
            font-size: 0.95rem;
          }

          .stock {
            font-size: 0.7rem;
          }

          .add-to-cart-btn,
          .out-of-stock-btn {
            padding: 8px;
            font-size: 0.9rem;
          }

          .cart-icon {
            font-size: 0.9rem;
          }
        }

        @keyframes cartPulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.3);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}

export default ProductCard;