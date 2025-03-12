import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          // Set token in axios defaults
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          
          const response = await axios.get(`${config.apiUrl}/user/profile`);
          const userData = response.data;
          
          setUser(userData);
          setToken(storedToken);
          setIsAdmin(userData.role === 'admin');
          setError(null);
          
          console.log('Auth initialized:', { 
            user: userData,
            isAdmin: userData.role === 'admin'
          });
        } catch (error) {
          console.error('Auth initialization error:', error);
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
          setToken(null);
          setUser(null);
          setIsAdmin(false);
          setError('Authentication failed. Please log in again.');
        }
      } else {
        setToken(null);
        setUser(null);
        setIsAdmin(false);
        setError(null);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (data) => {
    if (!data) {
      throw new Error('No login data received');
    }

    const { token, user } = data;
    if (!token || !user) {
      throw new Error('Invalid login response format');
    }

    try {
      // Store token and update axios defaults
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Update state
      setToken(token);
      setUser(user);
      setIsAdmin(user.role === 'admin');
      setError(null);

      console.log('Login successful:', {
        user,
        isAdmin: user.role === 'admin'
      });
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to complete login. Please try again.');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
    setIsAdmin(false);
    setError(null);
  };

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token,
    isAdmin,
    loading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}