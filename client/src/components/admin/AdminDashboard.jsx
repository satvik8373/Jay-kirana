import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Orders from './Orders';

function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('orders');

  const renderSection = () => {
    switch(activeSection) {
      case 'orders':
        return <Orders />;
      case 'add-product':
        return <div>Add Product</div>;
      case 'manage-products':
        return <div>Manage Products</div>;
      default:
        return <Orders />;
    }
  };

  return (
    <div className="admin-dashboard">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="dashboard-content">
        {renderSection()}
      </main>

      <style jsx>{`
        .admin-dashboard {
          display: flex;
          min-height: 100vh;
          background-color: #f8f9fa;
        }

        .dashboard-content {
          flex: 1;
          margin-left: 250px; /* Should match sidebar width */
          padding: 20px;
          overflow-y: auto;
          background-color: #f8f9fa;
        }

        @media (max-width: 768px) {
          .dashboard-content {
            margin-left: 0;
            margin-top: 60px;
            padding: 10px;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

export default AdminDashboard;