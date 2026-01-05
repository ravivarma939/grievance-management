import api from './api';

export const authService = {
  login: async (username, password) => {
    try {
      const response = await api.post('/auth/login', {
        username,
        password
      });
      return response.data;
    } catch (error) {
      // Handle different error scenarios
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const errorData = error.response.data;
        
        if (status === 401) {
          throw new Error(errorData.error || 'Invalid username or password');
        } else if (status === 400) {
          throw new Error(errorData.error || 'Bad request. Please check your input.');
        } else {
          throw new Error(errorData.error || `Server error (${status})`);
        }
      } else if (error.request) {
        // Request was made but no response received
        throw new Error('Unable to connect to server. Please ensure the backend is running.');
      } else {
        // Something else happened
        throw new Error(error.message || 'An unexpected error occurred');
      }
    }
  }
};

