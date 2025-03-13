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
  const [lastLocation, setLastLocation] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedLocation = sessionStorage.getItem('lastLocation');
      
      if (storedLocation) {
        setLastLocation(storedLocation);
      }
      
      if (storedToken) {
        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          
          const response = await axios.get(`${config.apiUrl}/user/profile`);
          const userData = response.data;
          
          setUser(userData);
          setToken(storedToken);
          setIsAdmin(userData.role === 'admin');
          
          console.log('Auth initialized:', { 
            user: userData,
            isAdmin: userData.role === 'admin',
            lastLocation: storedLocation
          });
        } catch (error) {
          console.error('Auth initialization error:', error);
          localStorage.removeItem('token');
          sessionStorage.removeItem('lastLocation');
          delete axios.defaults.headers.common['Authorization'];
          setToken(null);
          setUser(null);
          setIsAdmin(false);
          setLastLocation(null);
        }
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

    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    setToken(token);
    setUser(user);
    setIsAdmin(user.role === 'admin');

    // Restore last location if available
    const storedLocation = sessionStorage.getItem('lastLocation');
    if (storedLocation) {
      setLastLocation(storedLocation);
    }

    console.log('Login successful:', {
      user,
      isAdmin: user.role === 'admin',
      lastLocation: storedLocation
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('lastLocation');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
    setIsAdmin(false);
    setLastLocation(null);
  };

  const saveLocation = (location) => {
    if (location && location !== '/login') {
      sessionStorage.setItem('lastLocation', location);
      setLastLocation(location);
    }
  };

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token,
    isAdmin,
    lastLocation,
    saveLocation
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}