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
      id: 'add-product',
      label: 'Add Product',
      icon: FaPlus
    },
    {
      id: 'manage-products',
      label: 'Manage Products',
      icon: FaBox
    },
    {
      id: 'users',
      label: 'Users',
      icon: FaUsers
    },
    {
      id: 'email-marketing',
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
          position: fixed;
          top: 0;
          left: 0;
          width: 250px;
          height: 100vh;
          background-color: #1a237e;
          color: white;
          padding: 20px;
          box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
          z-index: 1000;
        }

        .logo {
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .logo h2 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
        }

        nav {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 20px;
          border: none;
          background: none;
          color: white;
          font-size: 1rem;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.3s ease;
          width: 100%;
          text-align: left;
        }

        .nav-item:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .nav-item.active {
          background-color: rgba(255, 255, 255, 0.2);
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .sidebar {
            top: auto;
            bottom: 0;
            width: 100%;
            height: auto;
            padding: 10px;
          }

          .logo {
            display: none;
          }

          nav {
            flex-direction: row;
            justify-content: space-around;
          }

          .nav-item {
            flex-direction: column;
            padding: 8px;
            font-size: 0.8rem;
            gap: 5px;
            text-align: center;
          }

          .nav-item svg {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Sidebar; 