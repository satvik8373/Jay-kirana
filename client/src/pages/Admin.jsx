import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AddProduct from '../components/admin/AddProduct';
import ManageProducts from '../components/admin/ManageProducts';
import Orders from '../components/admin/Orders';
import Sidebar from '../components/admin/Sidebar';
import EmailMarketing from '../components/EmailMarketing';

function Admin() {
  const [error, setError] = useState(null);
  const { isAdmin, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAccess = () => {
      if (!loading) {
        if (!isAuthenticated) {
          navigate('/login', { 
            state: { 
              from: location.pathname,
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
  }, [isAdmin, isAuthenticated, loading, navigate, location]);

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/')}>Return to Home</button>
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

  return (
    <div className="admin">
      <Sidebar />
      <div className="admin-content">
        <Routes>
          <Route index element={<Navigate to="orders" replace />} />
          <Route path="orders" element={<Orders />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="manage-products" element={<ManageProducts />} />
          <Route path="email-marketing" element={<EmailMarketing />} />
          <Route path="*" element={<Navigate to="orders" replace />} />
        </Routes>
      </div>

      <style jsx>{`
        .admin {
          min-height: 100vh;
          background-color: #f5f5f5;
          padding-top: 60px;
          display: flex;
        }

        .admin-content {
          flex: 1;
          margin-left: 250px;
          padding: 20px;
          min-height: calc(100vh - 60px);
        }

        .error-container {
          padding: 20px;
          background-color: #ffebee;
          border-radius: 8px;
          margin: 20px;
          text-align: center;
        }

        .error-container h2 {
          color: #c62828;
          margin-bottom: 10px;
        }

        .error-container button {
          margin-top: 15px;
          padding: 10px 20px;
          background: #1a237e;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
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