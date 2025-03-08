import React from 'react';

function Header() {
  return (
    <header className="admin-header">
      <div className="header-content">
        <div className="header-left">
          <h1>Jay Kirana Admin</h1>
        </div>
        <div className="header-right">
          <button className="header-button">
            <i className="fas fa-user"></i>
            Admin
          </button>
          <button className="header-button logout">
            <i className="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </div>
      </div>

      <style jsx>{`
        .admin-header {
          background-color: #1a252f;
          color: white;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 60px;
          z-index: 1000;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 100%;
          padding: 0 20px 0 270px; /* Added padding-left to account for sidebar */
        }

        .header-left h1 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0;
        }

        .header-right {
          display: flex;
          gap: 15px;
          align-items: center;
        }

        .header-button {
          background: none;
          border: none;
          color: white;
          padding: 8px 15px;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          transition: background-color 0.3s ease;
        }

        .header-button:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .header-button.logout {
          background-color: #e74c3c;
        }

        .header-button.logout:hover {
          background-color: #c0392b;
        }

        .header-button i {
          font-size: 1rem;
        }

        @media (max-width: 768px) {
          .header-content {
            padding: 0 15px;
          }

          .header-left h1 {
            font-size: 1.2rem;
          }

          .header-button {
            padding: 6px 10px;
            font-size: 0.8rem;
          }
        }
      `}</style>
    </header>
  );
}

export default Header; 