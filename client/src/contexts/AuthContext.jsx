import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import config from '../config';

const AuthContext = createContext();

const ADMIN_EMAIL = 'satvikpatel8373@gmail.com';

// Safe JSON parse function with default value
const safeJSONParse = (str, defaultValue = null) => {
  try {
    return str ? JSON.parse(str) : defaultValue;
  } catch (error) {
    console.error('JSON Parse error:', error);
    return defaultValue;
  }
};

// Initialize axios defaults
axios.defaults.withCredentials = true;

export function AuthProvider({ children }) {
  // Initialize states with safe JSON parsing
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('token');
    return !!token;
  });

  const [user, setUser] = useState(() => {
    return safeJSONParse(localStorage.getItem('user'), null);
  });

  const [loading, setLoading] = useState(true);

  const [isAdmin, setIsAdmin] = useState(() => {
    const savedUser = safeJSONParse(localStorage.getItem('user'), null);
    return savedUser?.email === ADMIN_EMAIL;
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

  const handleLogout = () => {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    setIsAuthenticated(false);
    setUser(null);
    setIsAdmin(false);
  };

  // Initialize auth state from localStorage and verify with server
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Verifying auth token:', token ? 'Found' : 'Not found');

        if (!token) {
          console.log('No token found, logging out');
          handleLogout();
          setLoading(false);
          return;
        }

        // Get saved user data
        const savedUser = safeJSONParse(localStorage.getItem('user'), null);
        console.log('Saved user data:', savedUser ? 'Found' : 'Not found');

        if (!savedUser || !savedUser.email) {
          console.log('Invalid saved user data');
          handleLogout();
          setLoading(false);
          return;
        }

        // Set authorization header
        const cleanToken = token.trim();
        axios.defaults.headers.common['Authorization'] = `Bearer ${cleanToken}`;
        
        // Verify token with server
        console.log('Verifying token with server...');
        const response = await axios.get('/api/user/me');
        
        if (!response.data || !response.data.email) {
          throw new Error('Invalid user data received from server');
        }

        console.log('Token verification successful');
        setUser(response.data);
        setIsAuthenticated(true);
        setIsAdmin(response.data.email === ADMIN_EMAIL);
        localStorage.setItem('user', JSON.stringify(response.data));
      } catch (error) {
        console.error('Token verification failed:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const handleLogin = async (userData) => {
    try {
      console.log('Processing login data:', {
        hasToken: !!userData.token,
        hasUser: !!userData.user,
        userEmail: userData.user?.email
      });

      if (!userData || !userData.token || !userData.user) {
        throw new Error('Missing required login data');
      }

      if (!userData.user.email) {
        throw new Error('Invalid user data: missing email');
      }

      // Clean the token string
      const token = userData.token.trim();
      if (!token) {
        throw new Error('Invalid token: empty after trimming');
      }

      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Store data in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData.user));
      
      // Update state
      setIsAuthenticated(true);
      setUser(userData.user);
      setIsAdmin(userData.user.email === ADMIN_EMAIL);

      console.log('Login successful:', {
        isAuthenticated: true,
        isAdmin: userData.user.email === ADMIN_EMAIL,
        email: userData.user.email
      });
    } catch (error) {
      console.error('Login error:', {
        message: error.message,
        stack: error.stack
      });
      handleLogout();
      throw error;
    }
  };

  const contextValue = {
    isAuthenticated, 
    user, 
    isAdmin, 
    loading,
    login: handleLogin,
    logout: handleLogout
  };

  // Show loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}