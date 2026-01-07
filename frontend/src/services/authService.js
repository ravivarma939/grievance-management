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
          const errorMsg = errorData.error || 'Invalid username or password';
          // Provide helpful message
          if (errorMsg.includes('Invalid') || errorMsg.includes('credentials')) {
            throw new Error('Invalid username or password. If you just registered, please wait a few seconds for the account to be activated, then try again.');
          }
          throw new Error(errorMsg);
        } else if (status === 400) {
          throw new Error(errorData.error || 'Bad request. Please check your input.');
        } else if (status === 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error(errorData.error || `Server error (${status})`);
        }
      } else if (error.request) {
        // Request was made but no response received
        throw new Error('Unable to connect to server. Please ensure all backend services are running (API Gateway, Auth Service, Eureka, Kafka).');
      } else {
        // Something else happened
        throw new Error(error.message || 'An unexpected error occurred');
      }
    }
  }
};

