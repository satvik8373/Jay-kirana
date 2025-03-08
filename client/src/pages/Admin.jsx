import React, { useState } from 'react';
import AddProduct from '../components/admin/AddProduct';
import ManageProducts from '../components/admin/ManageProducts';
import Orders from '../components/admin/Orders';
import Sidebar from '../components/admin/Sidebar';

function Admin() {
  const [activeSection, setActiveSection] = useState('orders');

  const renderSection = () => {
    switch (activeSection) {
      case 'orders':
        return <Orders />;
      case 'add-product':
        return <AddProduct />;
      case 'manage-products':
        return <ManageProducts />;
      default:
        return <Orders />;
    }
  };

  return (
    <div className="admin">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="admin-content">
        {renderSection()}
      </div>

      <style jsx>{`
        .admin {
          min-height: 100vh;
          background-color: #f5f5f5;
        }

        .admin-content {
          margin-left: 250px;
          padding: 20px;
          min-height: 100vh;
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
}

export default Admin;