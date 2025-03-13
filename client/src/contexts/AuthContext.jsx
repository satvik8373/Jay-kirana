import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Auth initialized:', { token: !!token });
      
      if (token) {
        // Set default authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Fetch user data
        const response = await axios.get(`${config.apiUrl}/user/profile`);
        const userData = response.data;
        
        // Check if user is admin
        const isAdmin = userData.role === 'admin' || userData.isAdmin;
        
        setUser({ ...userData, isAdmin });
        console.log('User data loaded:', { ...userData, isAdmin });
      }
    } catch (err) {
      console.error('Auth initialization error:', err);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('Attempting login with:', { email });
      console.log('API URL:', config.apiUrl);

      const response = await axios.post(`${config.apiUrl}/auth/login`, {
        email,
        password
      });

      const { token, user: userData } = response.data;
      console.log('Login response:', { token: !!token, userData });

      // Check if user is admin
      const isAdmin = userData.role === 'admin' || userData.isAdmin;
      
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser({ ...userData, isAdmin });
      console.log('Login successful:', { ...userData, isAdmin });
      
      return { ...userData, isAdmin };
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}