import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, 
  FaCheck, FaTimes, FaCity, FaMapPin, FaCamera, FaSignOutAlt
} from 'react-icons/fa';
import axios from 'axios';
import config from '../config';
import { useNavigate } from 'react-router-dom';

const LoadingScreen = ({ message }) => (
  <div className="loading-screen">
    {message || 'Loading...'}
    <style jsx>{`
      .loading-screen {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        font-size: 1.2rem;
        color: #1a237e;
      }
    `}</style>
  </div>
);

function Profile() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const successTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    bio: ''
  });

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          navigate('/login');
          return;
        }

        const response = await axios.get(`${config.apiUrl}/user/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          signal: controller.signal
        });

        if (!isMounted) return;

        const userData = response.data;
        if (!userData) {
          throw new Error('No user data received');
        }

        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          address: userData.address || '',
          city: userData.city || '',
          pincode: userData.pincode || '',
          bio: userData.bio || ''
        });

        if (userData.avatar) {
          const avatarPath = userData.avatar.startsWith('http') 
            ? userData.avatar 
            : `${config.apiUrl}/user/avatar/${userData.avatar.split('/').pop()}`;
          setAvatarPreview(avatarPath);
        }

        // Only update login state if we have new data
        if (JSON.stringify(userData) !== JSON.stringify(user)) {
          await login({ token, user: userData });
        }
      } catch (err) {
        if (!isMounted) return;
        if (axios.isCancel(err)) {
          console.log('Request cancelled');
          return;
        }

        console.error('Failed to load user data:', err);
        const errorMessage = err.response?.data?.error || err.message || 'Failed to load profile data';
        
        if (err.response?.status === 401) {
          console.error('Authentication error:', errorMessage);
          navigate('/login');
        } else if (err.response?.status === 404) {
          setError('User profile not found');
        } else if (err.response?.status === 500) {
          setError('Server error. Please try again later.');
        } else {
          setError(errorMessage);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadUserData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [navigate, login, user]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        pincode: user.pincode || '',
        bio: user.bio || ''
      });

      if (user.avatar) {
        const avatarPath = user.avatar.startsWith('http') 
          ? user.avatar 
          : `${config.apiUrl}/user/avatar/${user.avatar.split('/').pop()}`;
        setAvatarPreview(avatarPath);
      } else {
        setAvatarPreview(null);
      }
    }
  }, [user]);

  // Clear success/error messages when component unmounts
  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, []);

  const showSuccessMessage = (message) => {
    setSuccess(message);
    // Clear any existing timeout
    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current);
    }
    // Set new timeout to clear message after 5 seconds
    successTimeoutRef.current = setTimeout(() => {
      setSuccess('');
    }, 5000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPEG, PNG)');
      return;
    }

    if (file.size > maxSize) {
      setError('Image size should be less than 5MB');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const formData = new FormData();
      formData.append('avatar', file);

      // Get the token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      console.log('Uploading avatar...', {
        file: file.name,
        size: file.size,
        type: file.type
      });

      // Create a local preview immediately
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);

      const response = await axios.post(
        `${config.apiUrl}/user/avatar`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          },
          withCredentials: true,
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log('Upload progress:', percentCompleted + '%');
          }
        }
      );

      console.log('Upload response:', response.data);

      if (response.data && response.data.avatar) {
        // Update the user context with the new data
        const updatedUser = { ...user, avatar: response.data.avatar };
        await login({ token: token, user: updatedUser });
        showSuccessMessage('Profile picture updated successfully!');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Avatar upload error:', err);
      setError(
        err.response?.data?.message || 
        err.response?.data?.error || 
        err.message || 
        'Failed to update profile picture'
      );
      // Reset preview if upload fails
      if (user?.avatar) {
        setAvatarPreview(`${config.apiUrl}/user/avatar/${user.avatar.split('/').pop()}`);
      } else {
        setAvatarPreview(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.put(
        `${config.apiUrl}/user/profile`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      await login({ token, user: response.data });
      showSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      console.error('Update error:', err);
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError(err.response?.data?.error || 'Failed to update profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      city: user?.city || '',
      pincode: user?.pincode || '',
      bio: user?.bio || ''
    });
    setIsEditing(false);
    setError('');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Add a function to handle avatar load errors
  const handleAvatarError = () => {
    setAvatarPreview(null);
    // Don't show error message for missing avatar
    // setError('Failed to load profile picture');
  };

  if (loading) {
    return <LoadingScreen message="Updating profile..." />;
  }

  return (
    <div className="profile-container">
      <div className="profile-header-bg">
        <div className="profile-avatar" onClick={handleAvatarClick}>
          {avatarPreview ? (
            <img 
              src={avatarPreview} 
              alt="Profile" 
              className="avatar-image"
              onError={handleAvatarError}
            />
          ) : (
            <div className="default-avatar">
              <FaUser />
            </div>
          )}
          <div className="avatar-overlay">
            <FaCamera className="camera-icon" />
            {loading && <div className="loading-overlay">Uploading...</div>}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            accept="image/jpeg,image/png,image/jpg"
            style={{ display: 'none' }}
          />
        </div>
      </div>

      <div className="profile-card">
        <div className="profile-header">
          <div className="header-content">
            <h2>Profile Information</h2>
            <p className="subtitle">Manage your personal information</p>
          </div>
          {!isEditing && (
            <button className="edit-button" onClick={() => setIsEditing(true)}>
              <FaEdit /> Edit Profile
            </button>
          )}
        </div>

        {error && (
          <div className="error-message" onClick={() => setError('')}>
            <span>{error}</span>
            <button className="dismiss-button" onClick={(e) => { e.stopPropagation(); setError(''); }}>
              <FaTimes />
            </button>
          </div>
        )}
        
        {success && (
          <div className="success-message" onClick={() => setSuccess('')}>
            <span>{success}</span>
            <button className="dismiss-button" onClick={(e) => { e.stopPropagation(); setSuccess(''); }}>
              <FaTimes />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>
                <FaUser className="icon" />
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                required
                placeholder="Enter your name"
              />
            </div>

            <div className="form-group">
              <label>
                <FaEnvelope className="icon" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                required
                className="email-input"
              />
            </div>

            <div className="form-group">
              <label>
                <FaPhone className="icon" />
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                pattern="[0-9]{10}"
                title="Please enter a valid 10-digit phone number"
                placeholder="Enter your phone number"
              />
            </div>

            <div className="form-group full-width">
              <label>
                <FaUser className="icon" />
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                disabled={!isEditing}
                rows="3"
                placeholder="Tell us about yourself"
              />
            </div>

            <div className="form-group full-width">
              <label>
                <FaMapMarkerAlt className="icon" />
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={!isEditing}
                rows="3"
                placeholder="Enter your full address"
              />
            </div>

            <div className="form-group">
              <label>
                <FaCity className="icon" />
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Enter your city"
              />
            </div>

            <div className="form-group">
              <label>
                <FaMapPin className="icon" />
                PIN Code
              </label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                disabled={!isEditing}
                pattern="[0-9]{6}"
                title="Please enter a valid 6-digit PIN code"
                placeholder="Enter PIN code"
              />
            </div>
          </div>

          {isEditing && (
            <div className="button-group">
              <button type="submit" className="save-button" disabled={loading}>
                <FaCheck /> {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button type="button" className="cancel-button" onClick={handleCancel}>
                <FaTimes /> Cancel
              </button>
            </div>
          )}
        </form>

        <div className="logout-section">
          <button className="logout-button" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      <style jsx>{`
        .profile-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 0 20px;
          position: relative;
        }

        .profile-header-bg {
          background: linear-gradient(135deg, #1a237e 0%, #283593 100%);
          height: 200px;
          width: 100%;
          position: relative;
          border-radius: 0 0 30px 30px;
          margin-bottom: 60px;
        }

        .profile-avatar {
          width: 120px;
          height: 120px;
          background: white;
          border-radius: 50%;
          position: absolute;
          bottom: -60px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          border: 4px solid white;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .profile-avatar:hover .avatar-overlay {
          opacity: 1;
        }

        .avatar-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }

        .avatar-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .camera-icon {
          color: white;
          font-size: 24px;
        }

        .profile-avatar svg {
          font-size: 40px;
          color: #1a237e;
        }

        .profile-card {
          background: white;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          margin-bottom: 40px;
        }

        .profile-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 40px;
        }

        .header-content h2 {
          color: #1a237e;
          margin: 0;
          font-size: 2rem;
          font-weight: 600;
        }

        .subtitle {
          color: #666;
          margin: 8px 0 0;
          font-size: 1rem;
        }

        .edit-button {
          background: #1976d2;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1rem;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .edit-button:hover {
          background: #1565c0;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }

        .form-group {
          margin-bottom: 0;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-group label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #1a237e;
          margin-bottom: 8px;
          font-weight: 500;
          font-size: 0.95rem;
        }

        .icon {
          color: #1976d2;
          font-size: 1.1rem;
        }

        input, textarea {
          width: 100%;
          padding: 12px;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: white;
        }

        input::placeholder, textarea::placeholder {
          color: #bbb;
        }

        input:disabled, textarea:disabled {
          background: #f8f9fa;
          cursor: not-allowed;
          border-color: #e9ecef;
        }

        input:focus, textarea:focus {
          border-color: #1976d2;
          outline: none;
          box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
        }

        .email-input {
          background: #f8f9fa;
          border-color: #e9ecef;
          color: #666;
        }

        .button-group {
          display: flex;
          gap: 16px;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #eee;
        }

        .save-button, .cancel-button {
          padding: 12px 32px;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1rem;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .save-button {
          background: #4caf50;
          color: white;
          border: none;
          flex: 1;
        }

        .save-button:hover {
          background: #43a047;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
        }

        .cancel-button {
          background: #f44336;
          color: white;
          border: none;
          flex: 1;
        }

        .cancel-button:hover {
          background: #e53935;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
        }

        .error-message,
        .success-message {
          position: relative;
          padding-right: 40px; /* Space for dismiss button */
          cursor: pointer;
        }

        .dismiss-button {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: inherit;
          cursor: pointer;
          padding: 4px;
          opacity: 0.7;
          transition: opacity 0.2s;
        }

        .dismiss-button:hover {
          opacity: 1;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideOut {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(-10px);
          }
        }

        @media (max-width: 768px) {
          .profile-card {
            padding: 24px;
          }

          .form-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .button-group {
            flex-direction: column;
          }

          .profile-header {
            flex-direction: column;
            gap: 20px;
          }

          .edit-button {
            width: 100%;
            justify-content: center;
          }

          .profile-header-bg {
            height: 160px;
          }
        }

        .loading-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }

        .logout-section {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          display: flex;
          justify-content: center;
        }

        .logout-button {
          background: #f44336;
          color: white;
          border: none;
          padding: 12px 32px;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1rem;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .logout-button:hover {
          background: #d32f2f;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
        }

        @media (max-width: 768px) {
          .logout-button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}

export default Profile; 