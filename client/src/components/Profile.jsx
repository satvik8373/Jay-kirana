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
          let avatarPath;
          if (userData.avatar.startsWith('http')) {
            avatarPath = userData.avatar;
          } else if (userData.avatar.startsWith('/')) {
            avatarPath = `${config.apiUrl}${userData.avatar}`;
          } else if (userData.avatar.includes('uploads/')) {
            avatarPath = `${config.apiUrl}/${userData.avatar}`;
          } else {
            avatarPath = `${config.apiUrl}/uploads/avatars/${userData.avatar}`;
          }
          console.log('Setting avatar path:', avatarPath);
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

      // Update avatar URL handling
      if (user.avatar) {
        let avatarPath;
        if (user.avatar.startsWith('http')) {
          avatarPath = user.avatar;
        } else if (user.avatar.startsWith('/')) {
          avatarPath = `${config.apiUrl}${user.avatar}`;
        } else if (user.avatar.includes('uploads/')) {
          avatarPath = `${config.apiUrl}/${user.avatar}`;
        } else {
          avatarPath = `${config.apiUrl}/uploads/avatars/${user.avatar}`;
        }
        console.log('Setting avatar path:', avatarPath);
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
          }
        }
      );

      console.log('Upload response:', response.data);

      if (response.data && response.data.avatar) {
        let avatarPath;
        if (response.data.avatar.startsWith('http')) {
          avatarPath = response.data.avatar;
        } else if (response.data.avatar.startsWith('/')) {
          avatarPath = `${config.apiUrl}${response.data.avatar}`;
        } else if (response.data.avatar.includes('uploads/')) {
          avatarPath = `${config.apiUrl}/${response.data.avatar}`;
        } else {
          avatarPath = `${config.apiUrl}/uploads/avatars/${response.data.avatar}`;
        }
        
        const updatedUser = { ...user, avatar: response.data.avatar };
        await login({ token, user: updatedUser });
        showSuccessMessage('Profile picture updated successfully!');
        setAvatarPreview(avatarPath);
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
      if (user?.avatar) {
        let avatarPath;
        if (user.avatar.startsWith('http')) {
          avatarPath = user.avatar;
        } else if (user.avatar.startsWith('/')) {
          avatarPath = `${config.apiUrl}${user.avatar}`;
        } else if (user.avatar.includes('uploads/')) {
          avatarPath = `${config.apiUrl}/${user.avatar}`;
        } else {
          avatarPath = `${config.apiUrl}/uploads/avatars/${user.avatar}`;
        }
        setAvatarPreview(avatarPath);
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
      <div className="profile-header">
        <div className="profile-avatar-section">
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
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            accept="image/jpeg,image/png,image/jpg"
            style={{ display: 'none' }}
          />
          <h2 className="profile-name">{formData.name || 'Your Name'}</h2>
          <p className="profile-email">{formData.email}</p>
        </div>
      </div>

      <div className="profile-content">
        {error && (
          <div className="error-message" onClick={() => setError('')}>
            <span>{error}</span>
            <FaTimes className="close-icon" onClick={(e) => { e.stopPropagation(); setError(''); }} />
          </div>
        )}
        
        {success && (
          <div className="success-message" onClick={() => setSuccess('')}>
            <span>{success}</span>
            <FaTimes className="close-icon" onClick={(e) => { e.stopPropagation(); setSuccess(''); }} />
          </div>
        )}

        <div className="profile-actions">
          {!isEditing ? (
            <button className="edit-button" onClick={() => setIsEditing(true)}>
              <FaEdit /> Edit Profile
            </button>
          ) : null}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-sections">
            <div className="form-section">
              <h3>Personal Information</h3>
              <div className="form-fields">
                <div className="form-field">
                  <label>
                    <FaUser className="field-icon" />
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Enter your name"
                  />
                </div>

                <div className="form-field">
                  <label>
                    <FaEnvelope className="field-icon" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="email-input"
                  />
                </div>

                <div className="form-field">
                  <label>
                    <FaPhone className="field-icon" />
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    pattern="[0-9]{10}"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>About Me</h3>
              <div className="form-fields">
                <div className="form-field full-width">
                  <label>
                    <FaUser className="field-icon" />
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
              </div>
            </div>

            <div className="form-section">
              <h3>Address Information</h3>
              <div className="form-fields">
                <div className="form-field full-width">
                  <label>
                    <FaMapMarkerAlt className="field-icon" />
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

                <div className="form-field">
                  <label>
                    <FaCity className="field-icon" />
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

                <div className="form-field">
                  <label>
                    <FaMapPin className="field-icon" />
                    PIN Code
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    disabled={!isEditing}
                    pattern="[0-9]{6}"
                    placeholder="Enter PIN code"
                  />
                </div>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="form-actions">
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
          max-width: 100%;
          min-height: 100vh;
          background: #f5f7fa;
          padding-bottom: 20px;
        }

        .profile-header {
          background: linear-gradient(135deg, #1a237e 0%, #283593 100%);
          padding: 30px 20px;
          color: white;
          text-align: center;
        }

        .profile-avatar-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
        }

        .profile-avatar {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          border: 3px solid white;
          overflow: hidden;
          position: relative;
          margin: 0 auto;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .avatar-image, .default-avatar {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .default-avatar {
          background: #e0e0e0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .default-avatar svg {
          font-size: 40px;
          color: #9e9e9e;
        }

        .profile-name {
          font-size: 1.5rem;
          margin: 0;
          font-weight: 600;
        }

        .profile-email {
          font-size: 0.9rem;
          margin: 0;
          opacity: 0.9;
        }

        .profile-content {
          padding: 20px;
        }

        .profile-actions {
          margin-bottom: 20px;
        }

        .edit-button {
          width: 100%;
          padding: 12px;
          border-radius: 8px;
          background: #1976d2;
          color: white;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 0.9rem;
          box-shadow: 0 2px 8px rgba(25, 118, 210, 0.2);
        }

        .form-sections {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }

        .form-section {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .form-section h3 {
          margin: 0 0 15px 0;
          font-size: 1.1rem;
          color: #1a237e;
        }

        .form-fields {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .form-field {
          position: relative;
        }

        .form-field label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 8px;
        }

        .field-icon {
          color: #1976d2;
          font-size: 1rem;
        }

        input, textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          font-size: 0.95rem;
          background: ${isEditing ? 'white' : '#f5f7fa'};
        }

        input:disabled, textarea:disabled {
          color: #666;
          cursor: not-allowed;
        }

        .form-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 25px;
        }

        .save-button, .cancel-button {
          width: 100%;
          padding: 12px;
          border-radius: 8px;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 0.9rem;
        }

        .save-button {
          background: #4caf50;
          color: white;
        }

        .cancel-button {
          background: #f44336;
          color: white;
        }

        .logout-section {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e0e0e0;
        }

        .logout-button {
          width: 100%;
          padding: 12px;
          border-radius: 8px;
          background: #f44336;
          color: white;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 0.9rem;
        }

        .error-message, .success-message {
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.9rem;
        }

        .error-message {
          background: #ffebee;
          color: #c62828;
        }

        .success-message {
          background: #e8f5e9;
          color: #2e7d32;
        }

        .close-icon {
          cursor: pointer;
          font-size: 1.1rem;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .profile-container {
          animation: fadeIn 0.3s ease;
        }

        @media (max-width: 360px) {
          .profile-header {
            padding: 25px 15px;
          }

          .profile-avatar {
            width: 90px;
            height: 90px;
          }

          .profile-name {
            font-size: 1.3rem;
          }

          .profile-content {
            padding: 15px;
          }

          .form-section {
            padding: 15px;
          }

          input, textarea {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Profile; 