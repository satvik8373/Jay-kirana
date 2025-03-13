import React, { useState } from 'react';
import AddProduct from '../components/admin/AddProduct';
import ManageProducts from '../components/admin/ManageProducts';
import Orders from '../components/admin/Orders';
import Users from '../components/admin/Users';
import { useAuth } from '../contexts/AuthContext';
import { FaBox, FaShoppingBag, FaUsers, FaSignOutAlt } from 'react-icons/fa';

function Admin() {
  const [activeSection, setActiveSection] = useState('orders');
  const { logout } = useAuth();

  const renderSection = () => {
    switch (activeSection) {
      case 'orders':
        return <Orders />;
      case 'add-product':
        return <AddProduct />;
      case 'manage-products':
        return <ManageProducts />;
      case 'users':
        return <Users />;
      default:
        return <Orders />;
    }
  };

  return (
    <div className="admin">
      <div className="sidebar">
        <div className="nav-links">
          <button
            className={`nav-link ${activeSection === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveSection('orders')}
          >
            <FaShoppingBag /> Orders
          </button>
          <button
            className={`nav-link ${activeSection === 'add-product' ? 'active' : ''}`}
            onClick={() => setActiveSection('add-product')}
          >
            <FaBox /> Add Product
          </button>
          <button
            className={`nav-link ${activeSection === 'manage-products' ? 'active' : ''}`}
            onClick={() => setActiveSection('manage-products')}
          >
            <FaBox /> Manage Products
          </button>
          <button
            className={`nav-link ${activeSection === 'users' ? 'active' : ''}`}
            onClick={() => setActiveSection('users')}
          >
            <FaUsers /> Users
          </button>
        </div>
      </div>
      <div className="admin-content">
        {renderSection()}
      </div>

      <style jsx>{`
        .admin {
          display: flex;
          min-height: 100vh;
          padding-top: 60px;
          background-color: #f5f5f5;
        }

        .sidebar {
          width: 250px;
          background: white;
          padding: 20px;
          position: fixed;
          top: 60px;
          bottom: 0;
          left: 0;
          box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
        }

        .nav-links {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 15px;
          background: none;
          border: none;
          color: #666;
          cursor: pointer;
          font-size: 1rem;
          border-radius: 8px;
          transition: all 0.3s ease;
          width: 100%;
          text-align: left;
        }

        .nav-link:hover {
          background: #f0f0f0;
          color: #1a237e;
        }

        .nav-link.active {
          background: #1a237e;
          color: white;
        }

        .admin-content {
          flex: 1;
          margin-left: 250px;
          padding: 20px;
          min-height: 100vh;
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 100%;
            position: fixed;
            top: auto;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 10px;
            z-index: 100;
          }

          .nav-links {
            flex-direction: row;
            justify-content: space-around;
            overflow-x: auto;
          }

          .nav-link {
            flex-direction: column;
            padding: 8px;
            font-size: 0.8rem;
            gap: 5px;
            white-space: nowrap;
          }

          .admin-content {
            margin-left: 0;
            margin-bottom: 70px;
            padding: 10px;
          }
        }
      `}</style>
    </div>
  );
}

export default Admin;