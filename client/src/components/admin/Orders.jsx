import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PrintOrder from './PrintOrder';
import config from '../../config';

// Create axios instance with default config
const api = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Log the full request configuration
    console.log('Outgoing request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      data: config.data,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging
api.interceptors.response.use(
  (response) => {
    // Log the full response
    console.log('Response received:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      headers: response.headers,
      config: {
        method: response.config.method?.toUpperCase(),
        url: response.config.url,
        baseURL: response.config.baseURL
      }
    });
    return response;
  },
  (error) => {
    // Enhanced error logging
    console.error('Response error:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: error.config ? {
        method: error.config.method?.toUpperCase(),
        url: error.config.url,
        baseURL: error.config.baseURL,
        data: error.config.data
      } : 'No config available'
    });
    return Promise.reject(error);
  }
);

function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'pending', 'completed', 'cancelled'
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await api.get('/orders');
      
      if (!response.data) {
        throw new Error('No data received from server');
      }

      const ordersData = Array.isArray(response.data) ? response.data : [];
      const sortedOrders = ordersData.sort((a, b) => 
        new Date(b.orderDate) - new Date(a.orderDate)
      );

      setOrders(sortedOrders);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.response?.data?.error || 'Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Auto-refresh orders every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setError(null);
      setUpdatingStatus(orderId);

      // Enhanced logging for debugging
      console.log('Starting order status update:', { 
        orderId, 
        newStatus,
        orderIdType: typeof orderId,
        orderIdLength: orderId.length,
        currentOrders: orders.map(o => ({ id: o._id, status: o.status }))
      });

      // Validate order ID
      if (!orderId || typeof orderId !== 'string' || orderId.length !== 24) {
        const error = `Invalid order ID format: ${orderId}`;
        console.error(error);
        throw new Error(error);
      }

      // Check if order exists in current state
      const order = orders.find(o => o._id === orderId);
      if (!order) {
        console.error('Order not found in current state:', {
          searchedId: orderId,
          availableIds: orders.map(o => o._id)
        });
        throw new Error('Order not found in current state');
      }

      // Prevent updating to same status
      if (order.status === newStatus) {
        throw new Error(`Order is already ${newStatus}`);
      }

      // Prepare request data
      const requestData = { status: newStatus };
      const requestUrl = `/orders/${orderId}/status`;

      console.log('Sending update request:', {
        url: requestUrl,
        data: requestData,
        method: 'PUT'
      });

      // Make the API call
      const response = await api.put(requestUrl, requestData);
      
      // Log the full response for debugging
      console.log('Update response received:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        headers: response.headers
      });

      // Handle different response scenarios
      if (!response.data) {
        throw new Error('No response data received from server');
      }

      if (response.status === 404) {
        throw new Error('Order not found on server');
      }

      if (response.status === 400) {
        const errorMessage = response.data.error || 'Invalid request';
        if (response.data.details) {
          throw new Error(`${errorMessage}: ${JSON.stringify(response.data.details)}`);
        }
        throw new Error(errorMessage);
      }

      if (!response.data.order) {
        throw new Error('Invalid response format: missing order data');
      }

      // Update local state with the server response data
      const updatedOrder = response.data.order;
      setOrders(prevOrders => 
        prevOrders.map(o => o._id === orderId ? updatedOrder : o)
      );

      // Show success message
      const statusMessage = document.createElement('div');
      statusMessage.className = 'status-message success';
      statusMessage.textContent = `Order status updated to ${newStatus}`;
      document.body.appendChild(statusMessage);
      setTimeout(() => statusMessage.remove(), 3000);

      // Refresh orders to ensure we have the latest data
      await fetchOrders();

    } catch (err) {
      console.error('Error updating order status:', {
        error: err,
        response: err.response,
        status: err.response?.status,
        data: err.response?.data,
        orderId,
        newStatus
      });
      
      let errorMessage;
      if (err.response?.status === 404) {
        errorMessage = 'Order not found on server';
      } else if (err.response?.status === 400) {
        errorMessage = err.response?.data?.error || 'Invalid request';
        if (err.response?.data?.details) {
          errorMessage += `: ${JSON.stringify(err.response.data.details)}`;
        }
      } else if (err.message.includes('already')) {
        errorMessage = err.message;
      } else {
        errorMessage = err.response?.data?.error || 
                      err.response?.data?.message || 
                      err.message || 
                      'Failed to update order status';
      }
      
      setError(errorMessage);

      // Show error message
      const statusMessage = document.createElement('div');
      statusMessage.className = 'status-message error';
      statusMessage.textContent = errorMessage;
      document.body.appendChild(statusMessage);
      setTimeout(() => statusMessage.remove(), 3000);

    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#4CAF50';
      case 'cancelled':
        return '#f44336';
      case 'pending':
      default:
        return '#ff9800';
    }
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    return order.status === activeTab;
  });

  return (
    <div className="admin-section">
      <div className="orders-header">
        <h2>Orders ({orders.length})</h2>
        <div className="order-tabs">
          <button 
            className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Orders
          </button>
          <button 
            className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending
          </button>
          <button 
            className={`tab-button ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            Completed
          </button>
          <button 
            className={`tab-button ${activeTab === 'cancelled' ? 'active' : ''}`}
            onClick={() => setActiveTab('cancelled')}
          >
            Cancelled
          </button>
        </div>
        <button 
          onClick={fetchOrders} 
          className="refresh-button"
          disabled={isLoading}
        >
          {isLoading ? 'Refreshing...' : 'Refresh Orders'}
        </button>
      </div>

      {error && (
        <div className="error-message">{error}</div>
      )}

      {isLoading ? (
        <div className="loading-message">Loading orders...</div>
      ) : filteredOrders.length === 0 ? (
        <p className="no-orders">No {activeTab !== 'all' ? activeTab : ''} orders found</p>
      ) : (
        <div className="orders-list">
          {filteredOrders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <h3>Order #{order._id}</h3>
                <div className="order-actions">
                  <div className="status-actions">
                    {order.status === 'pending' && (
                      <div className="status-dropdown">
                        <select
                          value={order.status}
                          onChange={(e) => {
                            const newStatus = e.target.value;
                            if (newStatus !== order.status) {
                              updateOrderStatus(order._id, newStatus);
                            }
                          }}
                          disabled={updatingStatus === order._id}
                          className="status-select"
                        >
                          <option value="pending">Pending</option>
                          <option value="completed">Complete</option>
                          <option value="cancelled">Cancel</option>
                        </select>
                        {updatingStatus === order._id && (
                          <span className="updating-spinner">⌛</span>
                        )}
                      </div>
                    )}
                    <span 
                      className="order-status"
                      style={{ backgroundColor: getStatusColor(order.status) }}
                    >
                      {order.status || 'pending'}
                    </span>
                  </div>
                  <PrintOrder order={order} />
                </div>
              </div>
              <div className="order-details">
                <div className="customer-info">
                  <h4>Customer Information</h4>
                  <p><strong>Name:</strong> {order.name}</p>
                  <p><strong>Address:</strong> {order.address}</p>
                  <p><strong>Phone:</strong> {order.phone}</p>
                </div>
                <div className="order-summary">
                  <h4>Order Summary</h4>
                  <p><strong>Total Amount:</strong> ₹{order.total?.toFixed(2) || '0.00'}</p>
                  <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
                  {order.completedDate && order.status === 'completed' && (
                    <p><strong>Completed Date:</strong> {new Date(order.completedDate).toLocaleString()}</p>
                  )}
                  {order.cancelledDate && order.status === 'cancelled' && (
                    <p><strong>Cancelled Date:</strong> {new Date(order.cancelledDate).toLocaleString()}</p>
                  )}
                </div>
              </div>
              <div className="order-items">
                <h4>Ordered Items:</h4>
                <ul>
                  {order.products?.map((item, index) => (
                    <li key={index}>
                      {item.name} - Quantity: {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .admin-section {
          padding: 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .orders-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 2px solid #f0f0f0;
        }

        .orders-header h2 {
          font-size: 1.8rem;
          color: #2d3250;
          margin: 0;
        }

        .refresh-button {
          background: #3498db;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
          transition: background-color 0.3s ease;
        }

        .refresh-button:hover {
          background: #2980b9;
        }

        .refresh-button:disabled {
          background: #95a5a6;
          cursor: not-allowed;
        }

        .loading-message, .no-orders {
          text-align: center;
          padding: 20px;
          font-size: 1.1rem;
          color: #7f8c8d;
        }

        .orders-list {
          display: grid;
          gap: 20px;
          margin-top: 20px;
        }

        .order-card {
          background: #f8f9fa;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          border: 1px solid #e9ecef;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .order-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 1px solid #e9ecef;
        }

        .order-header h3 {
          color: #2d3250;
          font-size: 1.2rem;
          margin: 0;
        }

        .order-status {
          padding: 6px 12px;
          border-radius: 20px;
          color: white;
          font-size: 0.9rem;
          font-weight: 500;
          text-transform: capitalize;
        }

        .order-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
        }

        .customer-info, .order-summary {
          background: white;
          padding: 15px;
          border-radius: 8px;
          border: 1px solid #e9ecef;
        }

        .customer-info h4, .order-summary h4, .order-items h4 {
          color: #2d3250;
          margin: 0 0 15px 0;
          font-size: 1.1rem;
          padding-bottom: 8px;
          border-bottom: 2px solid #e9ecef;
        }

        .customer-info p, .order-summary p {
          margin: 8px 0;
          color: #4a5568;
          font-size: 0.95rem;
        }

        .customer-info strong, .order-summary strong {
          color: #2d3250;
          font-weight: 600;
        }

        .order-items {
          background: white;
          padding: 15px;
          border-radius: 8px;
          border: 1px solid #e9ecef;
        }

        .order-items ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .order-items li {
          padding: 8px 0;
          border-bottom: 1px solid #e9ecef;
          color: #4a5568;
          font-size: 0.95rem;
        }

        .order-items li:last-child {
          border-bottom: none;
        }

        .error-message {
          background: #fee2e2;
          color: #dc2626;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
          border: 1px solid #fecaca;
        }

        .order-actions {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .order-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 15px;
        }

        .tab-button {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          background: #f0f0f0;
          color: #666;
          transition: all 0.3s ease;
        }

        .tab-button.active {
          background: #3498db;
          color: white;
        }

        .status-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .status-dropdown {
          position: relative;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .status-select {
          padding: 6px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 120px;
        }

        .status-select:disabled {
          background: #f5f5f5;
          cursor: not-allowed;
        }

        .updating-spinner {
          animation: spin 1s linear infinite;
          display: inline-block;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .status-message {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 12px 24px;
          border-radius: 4px;
          color: white;
          font-weight: 500;
          z-index: 1000;
          animation: slideIn 0.3s ease-out;
        }

        .status-message.success {
          background-color: #4caf50;
        }

        .status-message.error {
          background-color: #f44336;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @media (max-width: 768px) {
          .admin-section {
            padding: 15px;
          }

          .orders-header {
            flex-direction: column;
            gap: 15px;
            align-items: flex-start;
          }

          .orders-header h2 {
            font-size: 1.5rem;
          }

          .refresh-button {
            width: 100%;
          }

          .order-details {
            grid-template-columns: 1fr;
          }

          .order-card {
            padding: 15px;
          }

          .order-tabs {
            flex-wrap: wrap;
          }

          .tab-button {
            flex: 1;
            min-width: 45%;
            text-align: center;
            padding: 6px 10px;
            font-size: 0.9rem;
          }

          .status-actions {
            flex-wrap: wrap;
          }

          .status-button {
            padding: 4px 8px;
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Orders;