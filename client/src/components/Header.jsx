import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaShoppingCart, FaUser, FaBars, FaTimes, FaSearch, FaPhone, FaEnvelope } from 'react-icons/fa';

function Header({ cartItemCount = 0 }) {
  const { isAuthenticated, logout, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Don't render the header on admin pages
  if (isAdminPage) return null;

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-top">
        <div className="header-top-content">
          <div className="contact-info">
            <span><FaPhone className="icon-small" /> +1-123-456-7890</span>
            <span><FaEnvelope className="icon-small" /> info@jaykirana.com</span>
          </div>
          {isAuthenticated ? (
            <div className="user-info">
              <span>Welcome, {user?.name || 'User'}</span>
              {isAdmin && <span className="admin-badge">Admin</span>}
            </div>
          ) : (
            <Link to="/login" className="top-login-link">Sign In / Register</Link>
          )}
        </div>
      </div>

      <nav className="navbar">
        <div className="nav-content">
          <Link to="/" className="logo">
            <span className="logo-text">Jay Kirana</span>
            <span className="logo-fresh">Fresh</span>
          </Link>

          <div className="search-bar">
            <input type="text" placeholder="Search products..." />
            <button className="search-btn">
              <FaSearch />
            </button>
          </div>

          <div className="mobile-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </div>

          <div className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/products" className="nav-link">Products</Link>
            <Link to="/categories" className="nav-link">Categories</Link>
            {isAuthenticated && isAdmin && (
              <Link to="/admin" className="nav-link admin-link">
                Admin Dashboard
                <span className="admin-indicator"></span>
              </Link>
            )}
            
            <div className="nav-icons">
              {isAuthenticated && (
                <>
                  <div className="icon-wrapper" onClick={() => navigate('/cart')}>
                    <FaShoppingCart className="icon" />
                    <span className="icon-tooltip">Cart</span>
                    {cartItemCount > 0 && (
                      <span className="cart-count">{cartItemCount}</span>
                    )}
                  </div>
                  <div className="icon-wrapper">
                    <FaUser className="icon" onClick={() => navigate('/profile')} />
                    <span className="icon-tooltip">Profile</span>
                  </div>
                  <button onClick={handleLogout} className="logout-btn">Logout</button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <style jsx>{`
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: white;
          transition: all 0.3s ease;
        }

        .header-top {
          background: linear-gradient(to right, #1a237e, #283593);
          color: white;
          padding: 8px 0;
          font-size: 0.9rem;
        }

        .header-top-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .contact-info {
          display: flex;
          gap: 20px;
        }

        .icon-small {
          margin-right: 5px;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .admin-badge {
          background: #1976d2;
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .top-login-link {
          color: white;
          text-decoration: none;
          transition: opacity 0.3s ease;
        }

        .top-login-link:hover {
          opacity: 0.8;
        }

        .navbar {
          padding: 15px 0;
          border-bottom: 1px solid #eee;
          background: white;
        }

        .nav-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 30px;
        }

        .logo {
          text-decoration: none;
          font-size: 1.5rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .logo-text {
          color: #1a237e;
        }

        .logo-fresh {
          color: #4CAF50;
        }

        .search-bar {
          display: flex;
          max-width: 500px;
          width: 100%;
        }

        .search-bar input {
          flex: 1;
          padding: 10px 15px;
          border: 1px solid #e0e0e0;
          border-radius: 25px 0 0 25px;
          font-size: 0.9rem;
        }

        .search-btn {
          padding: 10px 20px;
          background: #1a237e;
          color: white;
          border: none;
          border-radius: 0 25px 25px 0;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .search-btn:hover {
          background: #283593;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .nav-link {
          color: #1a237e;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .nav-link:hover {
          color: #283593;
        }

        .admin-link {
          color: #1976d2;
          font-weight: 600;
          position: relative;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .admin-indicator {
          width: 8px;
          height: 8px;
          background: #1976d2;
          border-radius: 50%;
          display: inline-block;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.7);
          }
          
          70% {
            transform: scale(1);
            box-shadow: 0 0 0 6px rgba(25, 118, 210, 0);
          }
          
          100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(25, 118, 210, 0);
          }
        }

        .admin-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 2px;
          background: #1976d2;
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .admin-link:hover::after {
          transform: scaleX(1);
        }

        .nav-icons {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .icon-wrapper {
          position: relative;
          cursor: pointer;
          padding: 5px;
        }

        .icon {
          font-size: 1.2rem;
          color: #1a237e;
          transition: all 0.3s ease;
        }

        .icon-wrapper:hover .icon {
          transform: translateY(-2px);
        }

        .cart-count {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #1a237e;
          color: white;
          font-size: 0.7rem;
          padding: 2px 6px;
          border-radius: 50%;
          min-width: 18px;
          text-align: center;
        }

        .icon-tooltip {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(10px);
          background: #1a237e;
          color: white;
          padding: 5px 10px;
          border-radius: 4px;
          font-size: 0.8rem;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .icon-wrapper:hover .icon-tooltip {
          opacity: 1;
          visibility: visible;
          transform: translateX(-50%) translateY(5px);
        }

        .logout-btn {
          background: #1a237e;
          color: white;
          border: none;
          padding: 8px 20px;
          border-radius: 25px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .logout-btn:hover {
          background: #283593;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(26, 35, 126, 0.3);
        }

        .mobile-toggle {
          display: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #1a237e;
        }

        @media (max-width: 1024px) {
          .nav-content {
            grid-template-columns: auto 1fr auto;
          }

          .search-bar {
            max-width: 300px;
          }
        }

        @media (max-width: 768px) {
          .header-top {
            display: none;
          }

          .nav-content {
            grid-template-columns: auto auto;
          }

          .search-bar {
            display: none;
          }

          .mobile-toggle {
            display: block;
            order: 1;
          }

          .nav-links {
            position: fixed;
            top: 80px;
            left: 0;
            right: 0;
            background: white;
            flex-direction: column;
            padding: 20px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            transform: translateY(-100%);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
          }

          .nav-links.active {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
          }

          .nav-icons {
            width: 100%;
            justify-content: center;
            padding-top: 15px;
            border-top: 1px solid #eee;
          }

          .admin-badge {
            display: inline-block;
            margin-left: 5px;
          }
        }
      `}</style>
    </header>
  );
}

export default Header;