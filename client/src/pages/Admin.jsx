import React, { useState } from 'react';
import Sidebar from '../components/admin/Sidebar';
import Orders from '../components/admin/Orders';
import AddProduct from '../components/admin/AddProduct';
import ManageProducts from '../components/admin/ManageProducts';
import Users from '../components/admin/Users';

function Admin() {
  const [activeSection, setActiveSection] = useState('manage-products');

  const renderContent = () => {
    switch (activeSection) {
      case 'orders':
        return <Orders />;
      case 'add-product':
        return <AddProduct />;
      case 'manage-products':
        return <ManageProducts />;
      case 'users':
        return <Users />;
      default:
        return <ManageProducts />;
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="admin-content">
        {renderContent()}
      </div>

      <style jsx>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
          background-color: #f5f5f5;
        }

        .admin-content {
          flex: 1;
          padding: 20px;
          margin-left: 250px;
        }

        @media (max-width: 768px) {
          .admin-content {
            margin-left: 0;
            margin-bottom: 60px;
            padding: 15px;
          }
        }
      `}</style>
    </div>
  );
}

export default Admin;