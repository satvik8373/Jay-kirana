import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';
import Sidebar from './Sidebar';
import Orders from './Orders';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    recentOrders: [],
    lowStockProducts: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('orders');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [ordersRes, productsRes, usersRes] = await Promise.all([
          axios.get(`${config.apiUrl}/orders`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${config.apiUrl}/products`),
          axios.get(`${config.apiUrl}/users/all`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        const lowStock = productsRes.data.filter(product => product.stock < 10);
        const recentOrders = ordersRes.data.slice(0, 5);

        setStats({
          totalOrders: ordersRes.data.length,
          totalProducts: productsRes.data.length,
          totalUsers: usersRes.data.length,
          recentOrders,
          lowStockProducts: lowStock
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.response?.data?.error || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error: {error}</div>;

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
};

export default AdminDashboard;