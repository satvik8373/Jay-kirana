import React from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { FaBox, FaShoppingBag, FaUsers, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';
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
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/admin" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <FaTachometerAlt />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/admin/add-product" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <FaBox />
            <span>Add Product</span>
          </NavLink>
          <NavLink to="/admin/manage-products" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <FaBox />
            <span>Manage Products</span>
          </NavLink>
          <NavLink to="/admin/orders" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <FaShoppingBag />
            <span>Orders</span>
          </NavLink>
          <NavLink to="/admin/users" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <FaUsers />
            <span>Users</span>
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Routes>
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/manage-products" element={<ManageProducts />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/users" element={<Users />} />
          <Route index element={<Orders />} />
        </Routes>
      </main>

      <style jsx>{`
        .admin-dashboard {
          display: flex;
          min-height: 100vh;
          padding-top: 60px;
          background: #f8f9fa;
        }

        .sidebar {
          width: 280px;
          background: #1a237e;
          color: white;
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 60px;
          bottom: 0;
          left: 0;
          z-index: 1000;
          transition: all 0.3s ease;
        }

        .sidebar-header {
          padding: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .sidebar-header h2 {
          margin: 0;
          font-size: 1.5rem;
          color: white;
          font-weight: 500;
        }

        .sidebar-nav {
          padding: 20px 0;
          flex: 1;
        }

        .nav-link {
          display: flex;
          align-items: center;
          padding: 12px 20px;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          transition: all 0.3s ease;
          border-left: 3px solid transparent;
        }

        .nav-link svg {
          width: 20px;
          height: 20px;
          margin-right: 10px;
        }

        .nav-link span {
          font-size: 0.95rem;
        }

        .nav-link:hover {
          color: white;
          background: rgba(255, 255, 255, 0.1);
          border-left-color: #4CAF50;
        }

        .nav-link.active {
          color: white;
          background: rgba(255, 255, 255, 0.1);
          border-left-color: #4CAF50;
        }

        .sidebar-footer {
          padding: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .logout-btn {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 12px;
          background: rgba(220, 38, 38, 0.1);
          color: #ff4444;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .logout-btn svg {
          width: 20px;
          height: 20px;
          margin-right: 10px;
        }

        .logout-btn:hover {
          background: rgba(220, 38, 38, 0.2);
        }

        .main-content {
          flex: 1;
          margin-left: 280px;
          padding: 20px;
          background: #f8f9fa;
          min-height: calc(100vh - 60px);
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 70px;
          }

          .sidebar-header h2,
          .nav-link span,
          .logout-btn span {
            display: none;
          }

          .nav-link,
          .logout-btn {
            justify-content: center;
            padding: 15px;
          }

          .nav-link svg,
          .logout-btn svg {
            margin: 0;
          }

          .main-content {
            margin-left: 70px;
          }
        }
      `}</style>
    </div>
  );
}

export default AdminDashboard;