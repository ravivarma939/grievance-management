import api from './api';

export const userService = {
  register: async (userData) => {
    const response = await api.post('/users/register', userData);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/users/profile', {
      headers: {
        'X-Username': localStorage.getItem('username')
      }
    });
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData, {
      headers: {
        'X-Username': localStorage.getItem('username')
      }
    });
    return response.data;
  }
};
