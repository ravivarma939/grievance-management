import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const isGuest = localStorage.getItem('isGuest') === 'true';
    // Only add token if not a guest and token exists
    if (token && !isGuest) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect if it's not a login request and not a guest
      const isLoginRequest = error.config?.url?.includes('/auth/login');
      const isGuest = localStorage.getItem('isGuest') === 'true';
      if (!isLoginRequest && !isGuest) {
        // Token expired or invalid for protected routes
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('isGuest');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

