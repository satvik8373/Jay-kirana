import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaBox, FaShoppingBag, FaUsers, FaSignOutAlt, FaPlus } from 'react-icons/fa';

function Sidebar({ activeSection, setActiveSection }) {
  const menuItems = [
    {
      title: 'Add Product',
      icon: <FaPlus />,
      path: 'add-product'
    },
    {
      title: 'Manage Products',
      icon: <FaBox />,
      path: 'manage-products'
    },
    {
      title: 'Orders',
      icon: <FaShoppingBag />,
      path: 'orders'
    },
    {
      title: 'Users',
      icon: <FaUsers />,
      path: 'users'
    }
  ];

  return (
    <div className="sidebar">
      <div className="logo">
        <h2>Admin Panel</h2>
      </div>
      <nav>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
          >
            {item.icon}
            <span>{item.title}</span>
          </NavLink>
        ))}
      </nav>

      <style jsx>{`
        .sidebar {
          width: 250px;
          background: white;
          padding: 20px;
          height: 100%;
          position: fixed;
          left: 0;
          top: 60px;
          box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
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
          padding: 12px 15px;
          color: #666;
          text-decoration: none;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .nav-item:hover {
          background: #f0f0f0;
          color: #1a237e;
        }

        .nav-item.active {
          background: #1a237e;
          color: white;
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 100%;
            height: auto;
            position: relative;
            top: 0;
            padding: 10px;
          }

          .logo {
            display: none;
          }

          nav {
            flex-direction: row;
            overflow-x: auto;
            padding-bottom: 10px;
          }

          .nav-item {
            white-space: nowrap;
          }
        }
      `}</style>
    </div>
  );
}

export default Sidebar; 