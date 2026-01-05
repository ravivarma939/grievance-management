import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (storedToken && storedUsername) {
      setToken(storedToken);
      setUsername(storedUsername);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (username, password) => {
    try {
      const response = await authService.login(username, password);
      if (response.token) {
        setToken(response.token);
        setUsername(username);
        setIsAuthenticated(true);
        localStorage.setItem('token', response.token);
        localStorage.setItem('username', username);
        return { success: true };
      } else {
        return { success: false, error: 'No token received from server' };
      }
    } catch (error) {
      return { success: false, error: error.message || 'Login failed. Please try again.' };
    }
  };

  const logout = () => {
    setToken('');
    setUsername('');
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

