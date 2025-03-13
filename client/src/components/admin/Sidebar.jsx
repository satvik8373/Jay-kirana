import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBox, FaClipboardList, FaUsers, FaPlus } from 'react-icons/fa';

function Sidebar() {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="admin-sidebar">
      <nav>
        <Link to="/admin" className={`nav-item ${isActive('/admin') ? 'active' : ''}`}>
          <FaBox />
          <span>Manage Products</span>
        </Link>
        
        <Link to="/admin/add-product" className={`nav-item ${isActive('/admin/add-product') ? 'active' : ''}`}>
          <FaPlus />
          <span>Add Product</span>
        </Link>
        
        <Link to="/admin/orders" className={`nav-item ${isActive('/admin/orders') ? 'active' : ''}`}>
          <FaClipboardList />
          <span>Orders</span>
        </Link>

        <Link to="/admin/users" className={`nav-item ${isActive('/admin/users') ? 'active' : ''}`}>
          <FaUsers />
          <span>Users</span>
        </Link>
      </nav>

      <style jsx>{`
        .admin-sidebar {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          height: fit-content;
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
          color: #1a237e;
          text-decoration: none;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .nav-item:hover {
          background: #e8eaf6;
        }

        .nav-item.active {
          background: #1a237e;
          color: white;
        }

        .nav-item svg {
          font-size: 1.2rem;
        }

        @media (max-width: 768px) {
          .admin-sidebar {
            padding: 15px;
          }

          .nav-item {
            padding: 10px;
          }

          .nav-item span {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Sidebar; 