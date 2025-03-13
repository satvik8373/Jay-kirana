import React from 'react';
import { FaBox, FaPlus, FaShoppingCart, FaEnvelope, FaUsers } from 'react-icons/fa';

function Sidebar({ activeSection, setActiveSection }) {
  const menuItems = [
    {
      id: 'orders',
      label: 'Orders',
      icon: FaShoppingCart
    },
    {
      id: 'add_product',
      label: 'Add Product',
      icon: FaPlus
    },
    {
      id: 'manage_products',
      label: 'Manage Products',
      icon: FaBox
    },
    {
      id: 'users',
      label: 'Users',
      icon: FaUsers
    },
    {
      id: 'email_marketing',
      label: 'Email Marketing',
      icon: FaEnvelope
    }
  ];

  return (
    <div className="sidebar">
      <div className="logo">
        <h2>Admin Panel</h2>
      </div>
      <nav>
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => setActiveSection(item.id)}
          >
            {item.icon && <item.icon />} {item.label}
          </button>
        ))}
      </nav>

      <style jsx>{`
        .sidebar {
          width: 250px;
          height: 100vh;
          background: white;
          position: fixed;
          left: 0;
          top: 0;
          padding: 20px 0;
          box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          display: flex;
          flex-direction: column;
        }

        .logo {
          padding: 0 20px 20px;
          border-bottom: 1px solid #eee;
          margin-bottom: 20px;
        }

        .logo h2 {
          margin: 0;
          color: #1976d2;
          font-size: 1.5rem;
        }

        nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 5px;
          padding: 0 10px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 20px;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          font-size: 1rem;
          color: #666;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .nav-item:hover {
          background: #f5f5f5;
          color: #1976d2;
        }

        .nav-item.active {
          background: #1976d2;
          color: white;
        }

        .nav-item svg {
          font-size: 1.2rem;
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 100%;
            height: 60px;
            padding: 10px;
            bottom: 0;
            top: auto;
            box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
          }

          .logo {
            display: none;
          }

          nav {
            flex-direction: row;
            justify-content: space-around;
            padding: 0;
          }

          .nav-item {
            flex-direction: column;
            padding: 5px;
            font-size: 0.8rem;
            gap: 5px;
          }

          .nav-item svg {
            font-size: 1.4rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Sidebar; 