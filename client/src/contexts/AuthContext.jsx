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
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Set authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Get saved user data
        const savedUser = safeJSONParse(localStorage.getItem('user'), null);
        if (!savedUser) {
          throw new Error('No valid user data found');
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
      const { token, user } = userData;
      
      if (!token || !user || !user.email) {
        throw new Error('Invalid login data');
      }
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setIsAuthenticated(true);
      setUser(user);
      setIsAdmin(user.email === ADMIN_EMAIL);
    } catch (error) {
      console.error('Login error:', error);
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