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
  const [isSearchVisible, setIsSearchVisible] = useState(false);

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
              {isAdmin && (
                <>
                  <span className="admin-badge">Admin</span>
                  <Link to="/admin" className="admin-link-top">Dashboard</Link>
                </>
              )}
              <button onClick={handleLogout} className="logout-btn">Logout</button>
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

          <div className="nav-links">
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
                  <div className="icon-wrapper" onClick={() => navigate('/profile')}>
                    <FaUser className="icon" />
                    <span className="icon-tooltip">Profile</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <style jsx>{`
        .header {
          display: none;
        }

        @media (min-width: 1024px) {
          .header {
            display: block;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            background: white;
            transition: all 0.3s ease;
          }

          .header.scrolled {
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }

          .header-top {
            background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
            color: white;
            padding: 8px 0;
            font-size: 0.9rem;
          }

          .header-top-content {
            max-width: var(--container-xl);
            margin: 0 auto;
            padding: 0 var(--spacing-md);
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .contact-info {
            display: flex;
            gap: var(--spacing-md);
          }

          .icon-small {
            margin-right: var(--spacing-xs);
          }

          .user-info {
            display: flex;
            align-items: center;
            gap: 1rem;
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
            padding: var(--spacing-md) 0;
            background: white;
            border-bottom: 1px solid #eee;
          }

          .nav-content {
            max-width: var(--container-xl);
            margin: 0 auto;
            padding: 0 var(--spacing-md);
            display: flex;
            justify-content: flex-start;
            align-items: center;
            height: 70px;
            gap: var(--spacing-xl);
          }

          .logo {
            text-decoration: none;
            font-size: 1.5rem;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: var(--spacing-xs);
            white-space: nowrap;
            flex-shrink: 0;
            min-width: 160px;
            margin-right: var(--spacing-xl);
          }

          .logo-text {
            color: var(--primary-color);
            line-height: 1;
            font-size: 1.5rem;
          }

          .logo-fresh {
            color: var(--accent-color);
            line-height: 1;
            font-size: 1.3rem;
          }

          .search-bar {
            display: flex;
            max-width: 500px;
            width: 100%;
            height: 44px;
            margin: 0;
            flex-grow: 1;
          }

          .search-bar input {
            flex: 1;
            height: 100%;
            padding: 0 20px;
            border: 1px solid #e0e0e0;
            border-right: none;
            border-radius: 25px 0 0 25px;
            font-size: 0.95rem;
            outline: none;
            transition: border-color 0.3s ease;
            background: var(--light-bg);
          }

          .search-bar input:focus {
            border-color: var(--primary-color);
            background: white;
          }

          .search-btn {
            height: 100%;
            padding: 0 25px;
            background: var(--primary-color);
            color: white;
            border: none;
            border-radius: 0 25px 25px 0;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 60px;
          }

          .search-btn:hover {
            background: var(--secondary-color);
            transform: translateX(2px);
          }

          .nav-links {
            display: flex;
            align-items: center;
            gap: var(--spacing-lg);
            height: 100%;
            margin-left: var(--spacing-xl);
            flex-shrink: 0;
          }

          .nav-link {
            color: var(--primary-color);
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s ease;
            padding: 0 var(--spacing-sm);
            height: 100%;
            display: flex;
            align-items: center;
            position: relative;
            white-space: nowrap;
            font-size: 0.95rem;
          }

          .nav-link:hover {
            color: var(--secondary-color);
          }

          .nav-link::after {
            content: '';
            position: absolute;
            bottom: -1px;
            left: 0;
            width: 100%;
            height: 2px;
            background: var(--primary-color);
            transform: scaleX(0);
            transition: transform 0.3s ease;
          }

          .nav-link:hover::after {
            transform: scaleX(1);
          }

          .nav-icons {
            display: flex;
            align-items: center;
            gap: var(--spacing-md);
            height: 100%;
            margin-left: var(--spacing-lg);
            padding-left: var(--spacing-lg);
            border-left: 1px solid #eee;
          }

          .icon-wrapper {
            position: relative;
            cursor: pointer;
            padding: var(--spacing-xs);
            border-radius: 50%;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 40px;
            width: 40px;
            background: var(--light-bg);
          }

          .icon-wrapper:hover {
            background: var(--primary-color);
          }

          .icon-wrapper:hover .icon {
            color: white;
          }

          .icon {
            font-size: 1.2rem;
            color: var(--primary-color);
            transition: all 0.3s ease;
          }

          .cart-count {
            position: absolute;
            top: -5px;
            right: -5px;
            background: var(--accent-color);
            color: white;
            font-size: 0.7rem;
            padding: 2px 6px;
            border-radius: 50%;
            min-width: 18px;
            text-align: center;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          }

          .icon-tooltip {
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%) translateY(10px);
            background: var(--primary-color);
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

          .admin-link-top {
            color: white;
            text-decoration: none;
            margin-left: 1rem;
            padding: 4px 8px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            transition: all 0.3s ease;
          }

          .admin-link-top:hover {
            background: rgba(255, 255, 255, 0.2);
          }

          .logout-btn {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 4px 8px;
            border-radius: 4px;
            transition: all 0.3s ease;
          }

          .logout-btn:hover {
            background: rgba(255, 255, 255, 0.1);
          }

          .admin-link {
            color: #1976d2;
            font-weight: 600;
            position: relative;
            display: flex;
            align-items: center;
            gap: var(--spacing-xs);
            white-space: nowrap;
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
        }
      `}</style>
    </header>
  );
}

export default Header;