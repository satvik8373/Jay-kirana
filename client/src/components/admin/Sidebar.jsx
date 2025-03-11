import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBox, FaPlus, FaShoppingBag, FaEnvelope } from 'react-icons/fa';

function Sidebar({ activeSection, setActiveSection }) {
  const location = useLocation();
  const currentPath = location.pathname.split('/')[2] || 'orders';

  const menuItems = [
    { id: 'orders', icon: FaShoppingBag, label: 'Orders', path: '/admin/orders' },
    { id: 'add-product', icon: FaPlus, label: 'Add Product', path: '/admin/add-product' },
    { id: 'manage-products', icon: FaBox, label: 'Manage Products', path: '/admin/manage-products' },
    { id: 'email-marketing', icon: FaEnvelope, label: 'Email Marketing', path: '/admin/email-marketing' }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Admin Panel</h2>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map(item => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`nav-item ${currentPath === item.id ? 'active' : ''}`}
              onClick={() => setActiveSection(item.id)}
            >
              <Icon className="nav-icon" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <style jsx>{`
        .sidebar {
          width: 250px;
          height: 100vh;
          background: white;
          position: fixed;
          left: 0;
          top: 0;
          padding-top: 60px;
          box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
          z-index: 100;
        }

        .sidebar-header {
          padding: 20px;
          border-bottom: 1px solid #eee;
        }

        .sidebar-header h2 {
          color: #1a237e;
          margin: 0;
          font-size: 1.5rem;
        }

        .sidebar-nav {
          padding: 20px 0;
        }

        .nav-item {
          display: flex;
          align-items: center;
          padding: 15px 20px;
          color: #666;
          text-decoration: none;
          transition: all 0.3s ease;
          border-left: 4px solid transparent;
        }

        .nav-item:hover {
          background: #f5f5f5;
          color: #1a237e;
          border-left-color: #1a237e;
        }

        .nav-item.active {
          background: #e8eaf6;
          color: #1a237e;
          border-left-color: #1a237e;
        }

        .nav-icon {
          margin-right: 10px;
          font-size: 1.2rem;
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 100%;
            height: auto;
            position: fixed;
            bottom: 0;
            top: auto;
            padding-top: 0;
          }

          .sidebar-header {
            display: none;
          }

          .sidebar-nav {
            padding: 0;
            display: flex;
            justify-content: space-around;
          }

          .nav-item {
            flex-direction: column;
            align-items: center;
            padding: 10px;
            border-left: none;
            border-top: 3px solid transparent;
            font-size: 0.8rem;
          }

          .nav-item.active {
            border-left: none;
            border-top-color: #1a237e;
          }

          .nav-icon {
            margin-right: 0;
            margin-bottom: 5px;
          }

          span {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

export default Sidebar; 