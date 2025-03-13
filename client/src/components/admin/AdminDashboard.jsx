import React, { useEffect } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { FaBox, FaShoppingBag, FaSignOutAlt } from 'react-icons/fa';
import AddProduct from './AddProduct';
import ManageProducts from './ManageProducts';
import Orders from './Orders';
import { useAuth } from '../../contexts/AuthContext';

function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin, if not redirect to home
    if (!user?.isAdmin) {
      console.log('Non-admin access attempt:', { user });
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // If user is not admin, don't render the dashboard
  if (!user?.isAdmin) {
    return null;
  }

  return (
    <div className="admin-dashboard">
      <nav className="admin-nav">
        <div className="nav-links">
          <NavLink to="/admin/add-product" className={({ isActive }) => isActive ? 'active' : ''}>
            <FaBox /> Add Product
          </NavLink>
          <NavLink to="/admin/manage-products" className={({ isActive }) => isActive ? 'active' : ''}>
            <FaBox /> Manage Products
          </NavLink>
          <NavLink to="/admin/orders" className={({ isActive }) => isActive ? 'active' : ''}>
            <FaShoppingBag /> Orders
          </NavLink>
        </div>
        <div className="admin-info">
          <div className="admin-email">{user.email}</div>
          <button onClick={handleLogout} className="logout-btn">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </nav>

      <div className="admin-content">
        <Routes>
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/manage-products" element={<ManageProducts />} />
          <Route path="/orders" element={<Orders />} />
          <Route index element={<Orders />} />
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

        .admin-info {
          padding: 15px;
          border-top: 1px solid #eee;
          margin-top: 20px;
        }

        .admin-email {
          color: #1a237e;
          font-size: 0.9rem;
          margin-bottom: 10px;
          text-align: center;
          word-break: break-all;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 12px 15px;
          width: 100%;
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

          .admin-info {
            position: fixed;
            bottom: 0;
            right: 0;
            left: 0;
            background: white;
            padding: 10px;
            box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
            margin-top: 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .admin-email {
            margin-bottom: 0;
            margin-right: 10px;
          }

          .logout-btn {
            width: auto;
          }
        }
      `}</style>
    </div>
  );
}

export default AdminDashboard;