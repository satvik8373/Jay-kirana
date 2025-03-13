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

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          // Set token in axios defaults
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          
          // First try to get the profile
          const response = await axios.get(`${config.apiUrl}/user/profile`);
          const userData = response.data;
          
          // Update state with user data
          setUser(userData);
          setToken(storedToken);
          
          // Check admin status
          const isAdminUser = userData.role === 'admin' || userData.email === process.env.ADMIN_EMAIL;
          setIsAdmin(isAdminUser);
          
          console.log('Auth initialized:', { 
            user: userData,
            isAdmin: isAdminUser,
            token: 'present'
          });
        } catch (error) {
          console.error('Auth initialization error:', error);
          // Clear everything on error
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
          setToken(null);
          setUser(null);
          setIsAdmin(false);
        }
      } else {
        console.log('No stored token found');
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

    // Store token and update axios defaults
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // Update state
    setToken(token);
    setUser(user);
    
    // Check admin status
    const isAdminUser = user.role === 'admin' || user.email === process.env.ADMIN_EMAIL;
    setIsAdmin(isAdminUser);

    console.log('Login successful:', {
      user,
      isAdmin: isAdminUser,
      token: 'present'
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
    setIsAdmin(false);
  };

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token,
    isAdmin,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}