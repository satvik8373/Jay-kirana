import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCity, FaSearch } from 'react-icons/fa';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('email');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${config.apiUrl}/user/all`);
      console.log('Users data:', response.data);
      setUsers(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortUsers = (usersToSort) => {
    return [...usersToSort].sort((a, b) => {
      let aValue = a[sortField] || '';
      let bValue = b[sortField] || '';
      
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const filterUsers = () => {
    const filtered = users.filter(user => {
      const searchLower = searchTerm.toLowerCase();
      return (
        (user.email?.toLowerCase().includes(searchLower)) ||
        (user.name?.toLowerCase().includes(searchLower)) ||
        (user.phone?.toLowerCase().includes(searchLower)) ||
        (user.city?.toLowerCase().includes(searchLower))
      );
    });
    return sortUsers(filtered);
  };

  return (
    <div className="users-dashboard">
      <div className="dashboard-header">
        <h2>User Management</h2>
        <div className="search-bar">
          <FaSearch className="search-icon" />
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
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('email')}>
                  <FaEnvelope /> Email
                  {sortField === 'email' && (
                    <span className="sort-indicator">{sortDirection === 'asc' ? ' ↑' : ' ↓'}</span>
                  )}
                </th>
                <th onClick={() => handleSort('name')}>
                  <FaUser /> Name
                  {sortField === 'name' && (
                    <span className="sort-indicator">{sortDirection === 'asc' ? ' ↑' : ' ↓'}</span>
                  )}
                </th>
                <th onClick={() => handleSort('phone')}>
                  <FaPhone /> Phone
                  {sortField === 'phone' && (
                    <span className="sort-indicator">{sortDirection === 'asc' ? ' ↑' : ' ↓'}</span>
                  )}
                </th>
                <th onClick={() => handleSort('address')}>
                  <FaMapMarkerAlt /> Address
                  {sortField === 'address' && (
                    <span className="sort-indicator">{sortDirection === 'asc' ? ' ↑' : ' ↓'}</span>
                  )}
                </th>
                <th onClick={() => handleSort('city')}>
                  <FaCity /> City
                  {sortField === 'city' && (
                    <span className="sort-indicator">{sortDirection === 'asc' ? ' ↑' : ' ↓'}</span>
                  )}
                </th>
                <th>Pincode</th>
              </tr>
            </thead>
            <tbody>
              {filterUsers().map((user) => (
                <tr key={user._id}>
                  <td>{user.email}</td>
                  <td>{user.name || '-'}</td>
                  <td>{user.phone || '-'}</td>
                  <td>{user.address || '-'}</td>
                  <td>{user.city || '-'}</td>
                  <td>{user.pincode || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style jsx>{`
        .users-dashboard {
          padding: 20px;
          background: white;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 2px solid #f0f0f0;
        }

        h2 {
          color: #1a237e;
          margin: 0;
          font-size: 1.8rem;
        }

        .search-bar {
          position: relative;
          width: 300px;
        }

        .search-icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #666;
        }

        input {
          width: 100%;
          padding: 10px 10px 10px 35px;
          border: 1px solid #ddd;
          border-radius: 25px;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }

        input:focus {
          outline: none;
          border-color: #1a237e;
          box-shadow: 0 0 0 2px rgba(26, 35, 126, 0.1);
        }

        .users-table-container {
          overflow-x: auto;
        }

        .users-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }

        .users-table th,
        .users-table td {
          padding: 12px 15px;
          text-align: left;
          border-bottom: 1px solid #eee;
        }

        .users-table th {
          background: #f8f9fa;
          color: #1a237e;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s ease;
          white-space: nowrap;
        }

        .users-table th:hover {
          background: #e8eaf6;
        }

        .users-table tbody tr:hover {
          background: #f5f5f5;
        }

        .sort-indicator {
          color: #1a237e;
          margin-left: 5px;
        }

        .error-message {
          background: #fee2e2;
          color: #dc2626;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .loading {
          text-align: center;
          padding: 20px;
          color: #666;
        }

        @media (max-width: 768px) {
          .dashboard-header {
            flex-direction: column;
            gap: 15px;
          }

          .search-bar {
            width: 100%;
          }

          .users-table th,
          .users-table td {
            padding: 8px 10px;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Users; 