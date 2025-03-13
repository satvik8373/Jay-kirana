import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';
import Orders from '../components/admin/Orders';
import AddProduct from '../components/admin/AddProduct';
import ManageProducts from '../components/admin/ManageProducts';
import Users from '../components/admin/Users';
import EmailMarketing from '../components/admin/EmailMarketing';
import { useAuth } from '../contexts/AuthContext';

function Admin() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [activeSection, setActiveSection] = useState(() => {
    // Get section from URL or default to manage-products
    const path = location.pathname.split('/').pop();
    return ['orders', 'add-product', 'manage-products', 'users', 'email-marketing'].includes(path)
      ? path
      : 'manage-products';
  });

  useEffect(() => {
    // Update URL when section changes
    navigate(`/admin/${activeSection}`, { replace: true });
  }, [activeSection, navigate]);

  useEffect(() => {
    // Ensure user is admin
    if (!isAdmin) {
      navigate('/', { replace: true });
    }
  }, [isAdmin, navigate]);

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
      case 'email-marketing':
        return <EmailMarketing />;
      default:
        return <ManageProducts />;
    }
  };

  if (!isAdmin) {
    return null;
  }

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