import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import config from '../config';

const AuthContext = createContext();

const ADMIN_EMAIL = 'satvikpatel8373@gmail.com';

// Initialize axios defaults
axios.defaults.withCredentials = true;

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('token');
  });
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('user'); // Clear invalid data
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser).email === ADMIN_EMAIL : false;
    } catch (error) {
      console.error('Error parsing user data for admin check:', error);
      return false;
    }
  });

  // Set up axios interceptor for token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    return () => {
      delete axios.defaults.headers.common['Authorization'];
    };
  }, []);

  // Initialize auth state from localStorage and verify with server
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await axios.get(`${config.apiUrl}/api/user/me`);
        const userData = response.data;
        
        setUser(userData);
        setIsAuthenticated(true);
        setIsAdmin(userData.email === ADMIN_EMAIL);
        
        // Update localStorage with fresh data
        localStorage.setItem('user', JSON.stringify(userData));
      } catch (error) {
        console.error('Error verifying token:', error);
        if (error.response?.status === 401) {
          handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const handleLogin = async (userData) => {
    try {
      console.log('Handling login with data:', userData);
      
      if (!userData || typeof userData !== 'object') {
        throw new Error('Invalid login data: data is missing or not an object');
      }

      const { token, user } = userData;
      
      if (!token || typeof token !== 'string') {
        throw new Error('Invalid login data: token is missing or invalid');
      }
      
      if (!user || typeof user !== 'object') {
        throw new Error('Invalid login data: user data is missing or invalid');
      }

      if (!user._id || !user.email) {
        throw new Error('Invalid login data: user data is incomplete');
      }
      
      // Set authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Store data in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Update state
      setIsAuthenticated(true);
      setUser(user);
      setIsAdmin(user.email === ADMIN_EMAIL);

      console.log('Login successful:', {
        isAuthenticated: true,
        isAdmin: user.email === ADMIN_EMAIL,
        user: user
      });
    } catch (error) {
      console.error('Login error:', error);
      handleLogout();
      throw error;
    }
  };

  const handleLogout = () => {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    setIsAuthenticated(false);
    setUser(null);
    setIsAdmin(false);
  };

  const contextValue = {
    isAuthenticated, 
    user, 
    isAdmin, 
    loading,
    login: handleLogin,
    logout: handleLogout
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}