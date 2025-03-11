import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';
import Header from '../components/admin/Header';
import AdminDashboard from '../components/admin/AdminDashboard';

const Admin = () => {
  return (
    <div className="admin">
      <Header />
      <div className="admin-layout">
        <Sidebar />
        <main className="admin-content">
          <Outlet />
          {/* Show dashboard when no sub-route is selected */}
          {window.location.pathname === '/admin' && <AdminDashboard />}
        </main>
      </div>

      <style jsx>{`
        .admin {
          min-height: 100vh;
          background-color: #f5f5f5;
        }

        .admin-layout {
          display: flex;
          min-height: calc(100vh - 64px); /* Subtract header height */
        }

        .admin-content {
          flex: 1;
          padding: 20px;
          margin-left: 250px; /* Sidebar width */
          background-color: white;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        @media (max-width: 768px) {
          .admin-content {
            margin-left: 0;
            padding: 10px;
            margin-bottom: 70px; /* Space for mobile sidebar */
          }
        }
      `}</style>
    </div>
  );
};

export default Admin;