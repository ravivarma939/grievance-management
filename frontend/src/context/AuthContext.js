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
  const [isGuest, setIsGuest] = useState(false);
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    const storedGuest = localStorage.getItem('isGuest');
    
    if (storedGuest === 'true') {
      setIsGuest(true);
      setIsAuthenticated(true);
      setUsername('Guest');
    } else if (storedToken && storedUsername) {
      setToken(storedToken);
      setUsername(storedUsername);
      setIsAuthenticated(true);
      setIsGuest(false);
    }
  }, []);

  const login = async (username, password) => {
    try {
      const response = await authService.login(username, password);
      if (response.token) {
        setToken(response.token);
        setUsername(username);
        setIsAuthenticated(true);
        setIsGuest(false);
        localStorage.setItem('token', response.token);
        localStorage.setItem('username', username);
        localStorage.removeItem('isGuest');
        return { success: true };
      } else {
        return { success: false, error: 'No token received from server' };
      }
    } catch (error) {
      return { success: false, error: error.message || 'Login failed. Please try again.' };
    }
  };

  const loginAsGuest = () => {
    setIsGuest(true);
    setIsAuthenticated(true);
    setUsername('Guest');
    setToken('');
    localStorage.setItem('isGuest', 'true');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    return { success: true };
  };

  const logout = () => {
    setToken('');
    setUsername('');
    setIsAuthenticated(false);
    setIsGuest(false);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('isGuest');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isGuest, username, token, login, loginAsGuest, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

