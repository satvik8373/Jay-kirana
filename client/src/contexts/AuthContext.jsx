import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import config from '../config';

const AuthContext = createContext();

const ADMIN_EMAIL = 'satvikpatel8373@gmail.com';

// Initialize axios defaults
axios.defaults.withCredentials = true;

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Set up axios interceptor for token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          handleLogout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
      delete axios.defaults.headers.common['Authorization'];
    };
  }, []);

  // Initialize auth state from localStorage and verify with server
  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (!token || !savedUser) {
        handleLogout();
        setLoading(false);
        return;
      }

      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        setIsAdmin(parsedUser.email === ADMIN_EMAIL);

        // Verify token with server
        const response = await axios.get(`${config.apiUrl}/user/me`);
        const updatedUser = response.data;
        
        setUser(updatedUser);
        setIsAdmin(updatedUser.email === ADMIN_EMAIL);
        localStorage.setItem('user', JSON.stringify(updatedUser));
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
      
      if (!token || !user) {
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
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}