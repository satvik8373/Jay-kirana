import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  FaShoppingCart, 
  FaUser, 
  FaBars, 
  FaTimes, 
  FaSearch, 
  FaPhone, 
  FaEnvelope,
  FaHome,
  FaList,
  FaTags
} from 'react-icons/fa';

function MobileHeader({ cartItemCount = 0 }) {
  const { isAuthenticated, logout, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="mobile-header">
      <div className="top-bar">
        <button 
          className="menu-toggle" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <Link to="/" className="logo">
          <span className="logo-text">Jay Kirana</span>
          <span className="logo-fresh">Fresh</span>
        </Link>

        <div className="top-icons">
          <button 
            className="search-toggle"
            onClick={() => setIsSearchVisible(!isSearchVisible)}
            aria-label="Toggle search"
          >
            <FaSearch />
          </button>
          {isAuthenticated && (
            <Link to="/cart" className="cart-icon">
              <FaShoppingCart />
              {cartItemCount > 0 && (
                <span className="cart-badge">{cartItemCount}</span>
              )}
            </Link>
          )}
        </div>
      </div>

      {isSearchVisible && (
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search products..."
            aria-label="Search products"
          />
          <button className="search-btn">
            <FaSearch />
          </button>
        </div>
      )}

      <nav className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
        {isAuthenticated && (
          <div className="user-info">
            <FaUser className="user-icon" />
            <div className="user-details">
              <span className="user-name">{user?.name || 'User'}</span>
              {isAdmin && (
                <>
                  <span className="admin-badge">Admin</span>
                  <Link to="/admin" className="admin-link">
                    Admin Dashboard
                    <span className="admin-indicator"></span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}

        <div className="nav-links">
          <Link to="/" className="nav-link">
            <FaHome /> Home
          </Link>
          <Link to="/products" className="nav-link">
            <FaList /> Products
          </Link>
          <Link to="/categories" className="nav-link">
            <FaTags /> Categories
          </Link>
          {isAuthenticated && (
            <>
              <Link to="/profile" className="nav-link">
                <FaUser /> Profile
              </Link>
              {isAdmin && (
                <Link to="/admin" className="nav-link admin-link">
                  <span className="admin-text">Admin Dashboard</span>
                  <span className="admin-indicator"></span>
                </Link>
              )}
            </>
          )}
        </div>

        <div className="contact-info">
          <a href="tel:+1-123-456-7890" className="contact-link">
            <FaPhone /> +1-123-456-7890
          </a>
          <a href="mailto:info@jaykirana.com" className="contact-link">
            <FaEnvelope /> info@jaykirana.com
          </a>
        </div>

        {isAuthenticated ? (
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        ) : (
          <Link to="/login" className="login-btn">
            Sign In / Register
          </Link>
        )}
      </nav>

      <style jsx>{`
        .mobile-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.8rem;
          background: var(--primary-color);
          color: white;
        }

        .menu-toggle, .search-toggle {
          background: none;
          border: none;
          color: white;
          font-size: 1.2rem;
          padding: 0.5rem;
          cursor: pointer;
        }

        .logo {
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .logo-text {
          color: white;
          font-size: 1.2rem;
          font-weight: 700;
        }

        .logo-fresh {
          color: var(--accent-color);
          font-size: 1rem;
        }

        .top-icons {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .cart-icon {
          color: white;
          font-size: 1.2rem;
          position: relative;
        }

        .cart-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: var(--accent-color);
          color: white;
          font-size: 0.7rem;
          padding: 2px 6px;
          border-radius: 50%;
          min-width: 18px;
          text-align: center;
        }

        .search-bar {
          padding: 0.8rem;
          background: white;
          display: flex;
          gap: 0.5rem;
          border-bottom: 1px solid #eee;
        }

        .search-bar input {
          flex: 1;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 0.9rem;
        }

        .search-btn {
          background: var(--primary-color);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
        }

        .mobile-nav {
          position: fixed;
          top: 56px;
          left: 0;
          right: 0;
          bottom: 0;
          background: white;
          padding: 1rem;
          transform: translateX(-100%);
          transition: transform 0.3s ease;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .mobile-nav.open {
          transform: translateX(0);
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: var(--light-bg);
          border-radius: 8px;
        }

        .user-icon {
          font-size: 1.5rem;
          color: var(--primary-color);
        }

        .user-details {
          display: flex;
          flex-direction: column;
        }

        .user-name {
          font-weight: 600;
          color: var(--primary-color);
        }

        .admin-badge {
          background: var(--secondary-color);
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
          display: inline-block;
          margin-top: 4px;
        }

        .nav-links {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          padding: 0.8rem;
          color: var(--text-color);
          text-decoration: none;
          border-radius: 8px;
          transition: background 0.3s ease;
        }

        .nav-link:hover {
          background: var(--light-bg);
        }

        .admin-link {
          color: var(--secondary-color);
          font-weight: 600;
        }

        .admin-indicator {
          width: 8px;
          height: 8px;
          background: var(--secondary-color);
          border-radius: 50%;
          display: inline-block;
          margin-left: auto;
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          padding: 1rem;
          background: var(--light-bg);
          border-radius: 8px;
        }

        .contact-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-color);
          text-decoration: none;
          font-size: 0.9rem;
        }

        .logout-btn, .login-btn {
          width: 100%;
          padding: 0.8rem;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          text-align: center;
          text-decoration: none;
        }

        .logout-btn {
          background: var(--error-color);
          color: white;
        }

        .login-btn {
          background: var(--primary-color);
          color: white;
        }

        @media (min-width: 768px) {
          .top-bar {
            padding: 1rem;
          }

          .logo-text {
            font-size: 1.4rem;
          }

          .logo-fresh {
            font-size: 1.1rem;
          }

          .mobile-nav {
            top: 64px;
          }
        }
      `}</style>
    </header>
  );
}

export default MobileHeader; 