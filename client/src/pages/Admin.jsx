import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AddProduct from '../components/admin/AddProduct';
import ManageProducts from '../components/admin/ManageProducts';
import Orders from '../components/admin/Orders';
import Sidebar from '../components/admin/Sidebar';
import EmailMarketing from '../components/EmailMarketing';

function Admin() {
  const [activeSection, setActiveSection] = useState('orders');
  const { isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!isAdmin) {
      navigate('/');
      return;
    }
  }, [isAdmin, isAuthenticated, navigate]);

  const renderSection = () => {
    switch (activeSection) {
      case 'orders':
        return <Orders />;
      case 'add-product':
        return <AddProduct />;
      case 'manage-products':
        return <ManageProducts />;
      case 'email-marketing':
        return <EmailMarketing />;
      default:
        return <Orders />;
    }
  };

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

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
          padding-top: 60px;
        }

        .admin-content {
          margin-left: 250px;
          padding: 20px;
          min-height: calc(100vh - 60px);
        }

        @media (max-width: 768px) {
          .admin-content {
            margin-left: 0;
            padding: 10px;
            margin-bottom: 70px;
          }
        }
      `}</style>
    </div>
  );
}

export default Admin;