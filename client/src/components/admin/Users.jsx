import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from './config';
import { 
  FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCity, 
  FaMapPin, FaCrown, FaSearch, FaFilter, FaDownload 
} from 'react-icons/fa';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, admin, customer
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      const response = await axios.get(`${config.apiUrl}/users/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
      setTotalUsers(response.data.length);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const exportUserData = () => {
    const csvData = filteredUsers.map(user => ({
      Name: user.name || 'N/A',
      Email: user.email || 'N/A',
      Phone: user.phone || 'N/A',
      Address: user.address || 'N/A',
      City: user.city || 'N/A',
      Pincode: user.pincode || 'N/A',
      Role: user.role || 'customer',
      'Join Date': new Date(user.createdAt).toLocaleDateString()
    }));

    const csvContent = "data:text/csv;charset=utf-8," 
      + Object.keys(csvData[0]).join(",") + "\\n"
      + csvData.map(row => Object.values(row).join(",")).join("\\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "user_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = (
      (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (user.phone || '').includes(searchTerm) ||
      (user.city?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (user.pincode || '').includes(searchTerm)
    );

    if (filter === 'all') return matchesSearch;
    return matchesSearch && user.role === filter;
  });

  return (
    <div className="admin-section">
      <div className="users-header">
        <div className="header-top">
          <h2>Users Management</h2>
          <div className="user-stats">
            <div className="stat-item">
              <span className="stat-label">Total Users:</span>
              <span className="stat-value">{totalUsers}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Admins:</span>
              <span className="stat-value">{users.filter(u => u.role === 'admin').length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Customers:</span>
              <span className="stat-value">{users.filter(u => u.role !== 'admin').length}</span>
            </div>
          </div>
        </div>
        
        <div className="search-filter-section">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search users by name, email, phone, city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filter-section">
            <FaFilter className="filter-icon" />
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Users</option>
              <option value="admin">Admins Only</option>
              <option value="customer">Customers Only</option>
            </select>
          </div>

          <button className="export-btn" onClick={exportUserData}>
            <FaDownload /> Export Users
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading users...</div>
      ) : (
        <div className="users-grid">
          {filteredUsers.map(user => (
            <div key={user._id} className="user-card">
              <div className="user-header">
                <div className="user-icon-container">
                  {user.role === 'admin' ? (
                    <FaCrown className="admin-icon" title="Admin User" />
                  ) : (
                    <FaUser className="user-icon" title="Customer" />
                  )}
                </div>
                <div className="user-title">
                  <h3>{user.name || 'No Name'}</h3>
                  <span className={`user-role ${user.role === 'admin' ? 'admin-role' : ''}`}>
                    {user.role || 'customer'}
                  </span>
                </div>
              </div>
              
              <div className="user-info">
                <div className="info-item">
                  <FaEnvelope title="Email" />
                  <div className="info-content">
                    <span className="info-label">Email</span>
                    <span className="info-value">{user.email}</span>
                  </div>
                </div>
                
                {user.phone && (
                  <div className="info-item">
                    <FaPhone title="Phone" />
                    <div className="info-content">
                      <span className="info-label">Phone</span>
                      <span className="info-value">{user.phone}</span>
                    </div>
                  </div>
                )}
                
                {user.address && (
                  <div className="info-item">
                    <FaMapMarkerAlt title="Address" />
                    <div className="info-content">
                      <span className="info-label">Address</span>
                      <span className="info-value">{user.address}</span>
                    </div>
                  </div>
                )}
                
                {user.city && (
                  <div className="info-item">
                    <FaCity title="City" />
                    <div className="info-content">
                      <span className="info-label">City</span>
                      <span className="info-value">{user.city}</span>
                    </div>
                  </div>
                )}

                {user.pincode && (
                  <div className="info-item">
                    <FaMapPin title="PIN Code" />
                    <div className="info-content">
                      <span className="info-label">PIN Code</span>
                      <span className="info-value">{user.pincode}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="user-footer">
                <span className="join-date">
                  Joined: {new Date(user.createdAt).toLocaleDateString()}
                </span>
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

        .users-header {
          margin-bottom: 20px;
        }

        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .user-stats {
          display: flex;
          gap: 20px;
        }

        .stat-item {
          background: #f8f9fa;
          padding: 10px 20px;
          border-radius: 8px;
          border: 1px solid #e9ecef;
        }

        .stat-label {
          color: #666;
          margin-right: 8px;
        }

        .stat-value {
          color: #1a237e;
          font-weight: 600;
        }

        .search-filter-section {
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
        }

        .search-bar {
          flex: 1;
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #666;
        }

        .search-bar input {
          width: 100%;
          padding: 12px 20px 12px 40px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .filter-section {
          position: relative;
          min-width: 150px;
        }

        .filter-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #666;
        }

        .filter-select {
          width: 100%;
          padding: 12px 20px 12px 40px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          font-size: 1rem;
          appearance: none;
          background: white;
          cursor: pointer;
        }

        .export-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: #1a237e;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .export-btn:hover {
          background: #283593;
        }

        .users-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
        }

        .user-card {
          background: #f8f9fa;
          border-radius: 10px;
          padding: 20px;
          border: 1px solid #e9ecef;
          transition: all 0.3s ease;
        }

        .user-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .user-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid #e9ecef;
        }

        .user-icon-container {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #e8eaf6;
          border-radius: 50%;
        }

        .user-icon {
          font-size: 1.5rem;
          color: #1a237e;
        }

        .admin-icon {
          font-size: 1.5rem;
          color: #ffc107;
        }

        .user-title {
          flex: 1;
        }

        .user-title h3 {
          margin: 0;
          color: #1a237e;
          font-size: 1.2rem;
        }

        .user-role {
          display: inline-block;
          margin-top: 5px;
          padding: 4px 8px;
          background: #e8eaf6;
          color: #1a237e;
          border-radius: 4px;
          font-size: 0.85rem;
          text-transform: capitalize;
        }

        .admin-role {
          background: #fff3e0;
          color: #f57c00;
        }

        .user-info {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .info-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 10px;
          background: white;
          border-radius: 8px;
          border: 1px solid #e9ecef;
        }

        .info-item svg {
          color: #1a237e;
          font-size: 1.1rem;
          min-width: 20px;
          margin-top: 3px;
        }

        .info-content {
          flex: 1;
        }

        .info-label {
          display: block;
          font-size: 0.85rem;
          color: #666;
          margin-bottom: 2px;
        }

        .info-value {
          display: block;
          color: #1a237e;
          word-break: break-word;
        }

        .user-footer {
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #e9ecef;
          text-align: right;
        }

        .join-date {
          color: #666;
          font-size: 0.9rem;
        }

        .loading {
          text-align: center;
          padding: 40px;
          color: #666;
          font-size: 1.1rem;
        }

        .error-message {
          background: #fee2e2;
          color: #dc2626;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        @media (max-width: 768px) {
          .header-top {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }

          .user-stats {
            width: 100%;
            flex-wrap: wrap;
          }

          .search-filter-section {
            flex-direction: column;
          }

          .filter-section {
            width: 100%;
          }

          .export-btn {
            width: 100%;
            justify-content: center;
          }

          .users-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default Users; 