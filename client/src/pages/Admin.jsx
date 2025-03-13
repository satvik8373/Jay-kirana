import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';
import Orders from '../components/admin/Orders';
import AddProduct from '../components/admin/AddProduct';
import ManageProducts from '../components/admin/ManageProducts';
import Users from '../components/admin/Users';
import EmailMarketing from '../components/admin/EmailMarketing';

function Admin() {
  // Get the current section from localStorage or default to 'manage-products'
  const [activeSection, setActiveSection] = useState(() => {
    const savedSection = localStorage.getItem('adminActiveSection');
    return savedSection || 'manage-products';
  });
  
  const location = useLocation();
  const navigate = useNavigate();

  // Update localStorage when section changes
  useEffect(() => {
    localStorage.setItem('adminActiveSection', activeSection);
  }, [activeSection]);

  // Handle direct navigation to admin routes
  useEffect(() => {
    const path = location.pathname.split('/');
    if (path[2]) {
      const section = path[2].replace('-', '_');
      setActiveSection(section);
    }
  }, [location]);

  const handleSectionChange = (section) => {
    setActiveSection(section);
    navigate(`/admin/${section.replace('_', '-')}`);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'orders':
        return <Orders />;
      case 'add_product':
        return <AddProduct />;
      case 'manage_products':
        return <ManageProducts />;
      case 'users':
        return <Users />;
      case 'email_marketing':
        return <EmailMarketing />;
      default:
        return <ManageProducts />;
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar activeSection={activeSection} setActiveSection={handleSectionChange} />
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
          overflow-y: auto;
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