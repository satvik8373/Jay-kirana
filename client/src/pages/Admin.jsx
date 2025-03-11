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
  const [error, setError] = useState(null);
  const { isAdmin, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAccess = () => {
      if (!loading) {
        if (!isAuthenticated) {
          navigate('/login', { 
            state: { 
              from: '/admin',
              message: 'Please log in to access the admin panel' 
            } 
          });
          return;
        }
        
        if (!isAdmin) {
          setError('Access denied. Admin privileges required.');
          navigate('/', { 
            state: { 
              error: 'Access denied. Admin privileges required.' 
            } 
          });
          return;
        }
      }
    };

    checkAccess();
  }, [isAdmin, isAuthenticated, loading, navigate]);

  const renderSection = () => {
    if (error) {
      return (
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      );
    }

    if (loading) {
      return (
        <div className="loading-container">
          <p>Loading...</p>
        </div>
      );
    }

    if (!isAuthenticated || !isAdmin) {
      return null;
    }

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

  return (
    <div className="admin">
      {(isAuthenticated && isAdmin) && (
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      )}
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
          margin-left: ${isAuthenticated && isAdmin ? '250px' : '0'};
          padding: 20px;
          min-height: calc(100vh - 60px);
        }

        .error-container {
          padding: 20px;
          background-color: #ffebee;
          border-radius: 8px;
          margin: 20px;
        }

        .error-container h2 {
          color: #c62828;
          margin-bottom: 10px;
        }

        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 200px;
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