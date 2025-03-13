import React, { useEffect } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { FaBox, FaShoppingBag, FaUsers, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';
import AddProduct from './AddProduct';
import ManageProducts from './ManageProducts';
import Orders from './Orders';
import Users from './Users';
import { useAuth } from '../../contexts/AuthContext';

function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin
    const token = localStorage.getItem('token');
    if (!token || !user || !user.isAdmin) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-dashboard">
      <div className="sidebar">
        <div className="sidebar-header">
          <FaTachometerAlt />
          <h2>Admin Panel</h2>
        </div>
        
        <div className="sidebar-menu">
          <NavLink to="/admin" end className={({ isActive }) => isActive ? 'menu-item active' : 'menu-item'}>
            <FaShoppingBag />
            <span>Orders</span>
          </NavLink>
          
          <NavLink to="/admin/add-product" className={({ isActive }) => isActive ? 'menu-item active' : 'menu-item'}>
            <FaBox />
            <span>Add Product</span>
          </NavLink>
          
          <NavLink to="/admin/manage-products" className={({ isActive }) => isActive ? 'menu-item active' : 'menu-item'}>
            <FaBox />
            <span>Manage Products</span>
          </NavLink>
          
          <NavLink to="/admin/users" className={({ isActive }) => isActive ? 'menu-item active' : 'menu-item'}>
            <FaUsers />
            <span>Users</span>
          </NavLink>
        </div>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="main-content">
        <Routes>
          <Route path="add-product" element={<AddProduct />} />
          <Route path="manage-products" element={<ManageProducts />} />
          <Route path="orders" element={<Orders />} />
          <Route path="users" element={<Users />} />
          <Route index element={<Orders />} />
        </Routes>
      </div>

      <style jsx>{`
        .admin-dashboard {
          display: flex;
          min-height: 100vh;
        }

        .sidebar {
          width: 280px;
          background: #1a237e;
          color: white;
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          z-index: 1000;
          transition: all 0.3s ease;
        }

        .sidebar-header {
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 15px;
          background: rgba(255, 255, 255, 0.1);
        }

        .sidebar-header h2 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .sidebar-menu {
          padding: 20px 0;
          flex: 1;
        }

        .menu-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px 20px;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          transition: all 0.3s ease;
          border-left: 4px solid transparent;
        }

        .menu-item:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border-left-color: #4CAF50;
        }

        .menu-item.active {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border-left-color: #4CAF50;
        }

        .menu-item svg {
          font-size: 1.2rem;
        }

        .sidebar-footer {
          padding: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 12px;
          background: rgba(220, 38, 38, 0.1);
          color: #ff4444;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .logout-btn:hover {
          background: rgba(220, 38, 38, 0.2);
        }

        .main-content {
          flex: 1;
          margin-left: 280px;
          padding: 20px;
          background: #f5f5f5;
          min-height: 100vh;
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 70px;
          }

          .sidebar-header h2,
          .menu-item span,
          .logout-btn span {
            display: none;
          }

          .menu-item {
            justify-content: center;
            padding: 15px;
          }

          .main-content {
            margin-left: 70px;
          }

          .sidebar-header {
            justify-content: center;
          }

          .logout-btn {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}

export default AdminDashboard;