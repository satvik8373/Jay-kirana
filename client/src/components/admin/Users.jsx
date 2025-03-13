import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCity } from 'react-icons/fa';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone?.includes(searchTerm) ||
    user.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-section">
      <div className="users-header">
        <h2>Users Management</h2>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
                <FaUser className="user-icon" />
                <h3>{user.name || 'No Name'}</h3>
              </div>
              
              <div className="user-info">
                <div className="info-item">
                  <FaEnvelope />
                  <span>{user.email}</span>
                </div>
                
                {user.phone && (
                  <div className="info-item">
                    <FaPhone />
                    <span>{user.phone}</span>
                  </div>
                )}
                
                {user.address && (
                  <div className="info-item">
                    <FaMapMarkerAlt />
                    <span>{user.address}</span>
                  </div>
                )}
                
                {user.city && (
                  <div className="info-item">
                    <FaCity />
                    <span>{user.city}</span>
                  </div>
                )}

                {user.pincode && (
                  <div className="info-item">
                    <span className="pincode-label">PIN:</span>
                    <span>{user.pincode}</span>
                  </div>
                )}
              </div>

              <div className="user-footer">
                <span className="user-role">{user.role || 'customer'}</span>
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
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 2px solid #f0f0f0;
        }

        h2 {
          color: #1a237e;
          font-size: 1.8rem;
          margin: 0;
        }

        .search-bar input {
          padding: 10px 15px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          width: 300px;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .search-bar input:focus {
          border-color: #1a237e;
          outline: none;
          box-shadow: 0 0 0 2px rgba(26, 35, 126, 0.1);
        }

        .users-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .user-card {
          background: #f8f9fa;
          border-radius: 10px;
          padding: 20px;
          border: 1px solid #e9ecef;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .user-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .user-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 1px solid #e9ecef;
        }

        .user-icon {
          font-size: 1.5rem;
          color: #1a237e;
        }

        .user-header h3 {
          margin: 0;
          color: #1a237e;
          font-size: 1.2rem;
        }

        .user-info {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #4a5568;
        }

        .info-item svg {
          color: #1a237e;
          font-size: 1.1rem;
        }

        .pincode-label {
          font-weight: 600;
          color: #1a237e;
          min-width: 40px;
        }

        .user-footer {
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #e9ecef;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .user-role {
          background: #e8eaf6;
          color: #1a237e;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.9rem;
          font-weight: 500;
          text-transform: capitalize;
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
          .users-header {
            flex-direction: column;
            gap: 15px;
          }

          .search-bar input {
            width: 100%;
          }

          .users-grid {
            grid-template-columns: 1fr;
          }

          h2 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Users; 