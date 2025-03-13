import React from 'react';
import { Routes, Route, NavLink, useNavigate, Navigate } from 'react-router-dom';
import { FaBox, FaShoppingBag, FaUsers, FaSignOutAlt } from 'react-icons/fa';
import AddProduct from './AddProduct';
import ManageProducts from './ManageProducts';
import Orders from './Orders';
import Users from './Users';
import { useAuth } from '../../contexts/AuthContext';

function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-dashboard">
      <nav className="admin-nav">
        <div className="nav-links">
          <NavLink to="add-product" className={({ isActive }) => isActive ? 'active' : ''}>
            <FaBox /> Add Product
          </NavLink>
          <NavLink to="manage-products" className={({ isActive }) => isActive ? 'active' : ''}>
            <FaBox /> Manage Products
          </NavLink>
          <NavLink to="orders" className={({ isActive }) => isActive ? 'active' : ''}>
            <FaShoppingBag /> Orders
          </NavLink>
          <NavLink to="users" className={({ isActive }) => isActive ? 'active' : ''}>
            <FaUsers /> Users
          </NavLink>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          <FaSignOutAlt /> Logout
        </button>
      </nav>

      <div className="admin-content">
        <Routes>
          <Route path="/" element={<Navigate to="orders" replace />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="manage-products" element={<ManageProducts />} />
          <Route path="orders" element={<Orders />} />
          <Route path="users" element={<Users />} />
          <Route path="*" element={<Navigate to="orders" replace />} />
        </Routes>
      </div>

      <style jsx>{`
        .admin-dashboard {
          display: flex;
          min-height: 100vh;
          padding-top: 60px;
        }

        .admin-nav {
          width: 250px;
          background: white;
          padding: 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: fixed;
          top: 60px;
          bottom: 0;
          box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
        }

        .nav-links {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .admin-nav a {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 15px;
          color: #666;
          text-decoration: none;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .admin-nav a:hover {
          background: #f0f0f0;
          color: #1a237e;
        }

        .admin-nav a.active {
          background: #1a237e;
          color: white;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 15px;
          background: none;
          border: none;
          color: #dc2626;
          cursor: pointer;
          font-size: 1rem;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .logout-btn:hover {
          background: #fee2e2;
        }

        .admin-content {
          flex: 1;
          margin-left: 250px;
          padding: 20px;
          background: #f5f5f5;
        }

        @media (max-width: 768px) {
          .admin-dashboard {
            flex-direction: column;
          }

          .admin-nav {
            width: 100%;
            position: relative;
            top: 0;
            padding: 10px;
          }

          .nav-links {
            flex-direction: row;
            overflow-x: auto;
            padding-bottom: 10px;
          }

          .admin-nav a {
            white-space: nowrap;
          }

          .admin-content {
            margin-left: 0;
            padding: 10px;
          }

          .logout-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: white;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }
        }
      `}</style>
    </div>
  );
}

export default AdminDashboard;