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
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser).email === ADMIN_EMAIL : false;
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
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Set authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Get saved user data
        const savedUser = localStorage.getItem('user');
        let userObj = null;
        
        try {
          userObj = savedUser ? JSON.parse(savedUser) : null;
        } catch (parseError) {
          console.error('Error parsing saved user:', parseError);
          handleLogout();
          setLoading(false);
          return;
        }

        // Verify token with server
        const response = await axios.get(`${config.apiUrl}/user/me`);
        const userData = response.data;
        
        if (!userData || !userData.email) {
          throw new Error('Invalid user data received');
        }

        setUser(userData);
        setIsAuthenticated(true);
        setIsAdmin(userData.email === ADMIN_EMAIL);
        localStorage.setItem('user', JSON.stringify(userData));
      } catch (error) {
        console.error('Error verifying token:', error);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const handleLogin = async (userData) => {
    try {
      if (!userData) {
        throw new Error('No login data received');
      }

      console.log('Received login data:', userData);

      const { token, user } = userData;
      
      if (!token) {
        throw new Error('No token received in login data');
      }
      
      if (!user || typeof user !== 'object') {
        throw new Error('Invalid user data structure');
      }

      if (!user.email || !user._id || !user.name) {
        throw new Error('Missing required user fields');
      }
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Store in localStorage
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
      console.error('Login error:', error.message);
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