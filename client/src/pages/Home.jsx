import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductList from '../components/ProductList';
import { FaLeaf, FaShieldAlt, FaTruck, FaClock } from 'react-icons/fa';
import config from '../config';

function Home({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Fetching products from:', `${config.apiUrl}/products`);
      const response = await axios.get(`${config.apiUrl}/products`);
      setProducts(response.data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <FaLeaf className="feature-icon" />,
      title: "Fresh & Organic",
      description: "100% fresh and organic products sourced directly from farmers"
    },
    {
      icon: <FaTruck className="feature-icon" />,
      title: "Free Delivery",
      description: "Free delivery on orders above ₹500"
    },
    {
      icon: <FaShieldAlt className="feature-icon" />,
      title: "Quality Assured",
      description: "All products pass through strict quality checks"
    },
    {
      icon: <FaClock className="feature-icon" />,
      title: "24/7 Support",
      description: "Round the clock customer support"
    }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Jay Kirana</h1>
          <p>Your one-stop shop for fresh groceries and daily essentials</p>
        </div>
      </div>

      {/* Products Section */}
      <section className="products-section">
        <h2>Our Products</h2>
        <ProductList products={products} addToCart={addToCart} />
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              {feature.icon}
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <style jsx>{`
        .home {
          padding: 120px 0 40px;
          min-height: 100vh;
          background: #f5f5f5;
        }

        .hero-section {
          background: linear-gradient(rgba(26, 35, 126, 0.9), rgba(26, 35, 126, 0.9)),
                      url('https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2000&auto=format');
          background-size: cover;
          background-position: center;
          color: white;
          padding: 80px 20px;
          text-align: center;
          margin-bottom: 40px;
        }

        .hero-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .hero-content h1 {
          font-size: 2.5rem;
          margin-bottom: 20px;
          font-weight: 700;
        }

        .hero-content p {
          font-size: 1.2rem;
          opacity: 0.9;
        }

        .products-section {
          padding: 40px 20px;
          max-width: 1200px;
          margin: 0 auto;
          background: white;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          margin-bottom: 40px;
        }

        .products-section h2 {
          text-align: center;
          color: #1a237e;
          font-size: 2rem;
          margin-bottom: 30px;
        }

        .features-section {
          padding: 40px 20px;
          background: white;
        }

        .features-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 30px;
        }

        .feature-card {
          padding: 30px;
          text-align: center;
          border-radius: 10px;
          background: white;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-5px);
        }

        .feature-icon {
          font-size: 2rem;
          color: #1a237e;
          margin-bottom: 15px;
        }

        .feature-card h3 {
          color: #1a237e;
          margin-bottom: 10px;
          font-size: 1.2rem;
        }

        .feature-card p {
          color: #666;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .hero-section {
            padding: 60px 20px;
          }

          .hero-content h1 {
            font-size: 2rem;
          }

          .hero-content p {
            font-size: 1rem;
          }

          .products-section {
            padding: 20px;
            margin: 20px;
          }

          .products-section h2 {
            font-size: 1.5rem;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .feature-card {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}

export default Home;