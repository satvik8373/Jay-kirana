import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function Sidebar({ activeSection, setActiveSection }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { id: 'orders', label: 'All Orders', icon: '📋' },
    { id: 'add-product', label: 'Add Product', icon: '➕' },
    { id: 'manage-products', label: 'Manage Products', icon: '📦' },

  ];

  return (
    <div className="admin-sidebar">
      <div className="sidebar-content">
        <div className="logo-section">
          <div className="logo-container">
            <i className="fas fa-store"></i>
          </div>
          <h2>Jay Kirana</h2>
        </div>
        <nav>
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`nav-button ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => setActiveSection(item.id)}
            >
              <div className="button-content">
                <span className="icon">{item.icon}</span>
                <span className="nav-text">{item.label}</span>
              </div>
              <div className="hover-indicator"></div>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button className="logout-button" onClick={handleLogout}>
            <i className="fas fa-power-off"></i>
            <span>Logout</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        :root {
          --primary-color: #1a237e;
          --secondary-color: #283593;
          --accent-color: #90caf9;
          --highlight-color: #1976d2;
          --text-color: #ffffff;
          --text-muted: #e3f2fd;
          --hover-color: rgba(25, 118, 210, 0.1);
          --transition-speed: 0.3s;
        }

        .admin-sidebar {
          width: 250px;
          background: linear-gradient(180deg, var(--primary-color) 0%, var(--secondary-color) 100%);
          color: var(--text-color);
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          height: 100vh;
          overflow-y: auto;
          z-index: 100;
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 4px 0 15px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
        }

        .sidebar-content {
          padding: 20px;
          display: flex;
          flex-direction: column;
          height: 100%;
          gap: 30px;
          min-height: min-content;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 10px 0;
        }

        .logo-container {
          width: 40px;
          height: 40px;
          background: var(--accent-color);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: var(--primary-color);
          transform: rotate(-10deg);
          transition: transform var(--transition-speed);
          box-shadow: 0 0 20px rgba(144, 202, 249, 0.3);
        }

        .logo-section:hover .logo-container {
          transform: rotate(0deg);
        }

        .logo-section h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0;
          color: var(--text-color);
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
        }

        .admin-sidebar nav {
          display: flex;
          flex-direction: column;
          gap: 10px;
          flex-grow: 1;
        }

        .nav-button {
          position: relative;
          background: none;
          border: none;
          width: 100%;
          padding: 12px 15px;
          text-align: left;
          font-size: 1rem;
          cursor: pointer;
          border-radius: 12px;
          overflow: hidden;
          transition: all var(--transition-speed);
        }

        .button-content {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .nav-text {
          color: var(--text-muted);
          font-weight: 500;
          letter-spacing: 0.5px;
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
        }

        .hover-indicator {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: var(--hover-color);
          transform: translateX(-100%);
          transition: transform var(--transition-speed);
        }

        .nav-button:hover .hover-indicator {
          transform: translateX(0);
        }

        .nav-button .icon {
          width: 20px;
          text-align: center;
          font-size: 1.2rem;
          transition: transform var(--transition-speed);
          color: var(--accent-color);
        }

        .nav-button:hover .icon {
          transform: scale(1.2);
          color: var(--highlight-color);
        }

        .nav-button:hover .nav-text {
          color: var(--accent-color);
        }

        .nav-button.active {
          background: var(--hover-color);
        }

        .nav-button.active .nav-text {
          color: var(--accent-color);
          font-weight: 600;
          text-shadow: 0 0 10px rgba(144, 202, 249, 0.3);
        }

        .nav-button.active .icon {
          transform: scale(1.2);
          color: var(--highlight-color);
        }

        .sidebar-footer {
          margin-top: auto;
          padding: 20px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          position: sticky;
          bottom: 0;
          background: inherit;
          width: 100%;
        }

        .logout-button {
          width: 100%;
          background: rgba(244, 67, 54, 0.1);
          color: #ff3b30;
          border: none;
          padding: 12px;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 1rem;
          transition: all var(--transition-speed);
          position: relative;
          overflow: hidden;
          font-weight: 600;
        }

        .logout-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, rgba(244, 67, 54, 0.1), rgba(244, 67, 54, 0.2));
          transform: translateX(-100%);
          transition: transform var(--transition-speed);
        }

        .logout-button:hover {
          color: #ff3b30;
          text-shadow: 0 0 10px rgba(244, 67, 54, 0.3);
        }

        .logout-button:hover::before {
          transform: translateX(0);
        }

        .logout-button i, .logout-button span {
          position: relative;
          z-index: 1;
        }

        @media (max-width: 768px) {
          .admin-sidebar {
            position: fixed;
            top: 0;
            width: 100%;
            height: auto;
            max-height: 100vh;
            overflow-y: auto;
          }

          .sidebar-content {
            height: auto;
            min-height: auto;
          }

          .logo-section {
            display: none;
          }

          .admin-sidebar nav {
            flex-direction: row;
            overflow-x: auto;
            padding-bottom: 10px;
            -webkit-overflow-scrolling: touch;
            gap: 15px;
          }

          .nav-button {
            padding: 8px 15px;
            white-space: nowrap;
            border-radius: 8px;
          }

          .nav-button.active {
            transform: none;
          }

          .sidebar-footer {
            display: none;
          }
        }

        .admin-sidebar::-webkit-scrollbar {
          display: none;
        }

        .admin-sidebar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

export default Sidebar; 