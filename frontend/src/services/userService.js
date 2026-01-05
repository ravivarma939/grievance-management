import api from './api';

export const userService = {
  register: async (userData) => {
    const response = await api.post('/users/register', userData);
    return response.data;
  }
};

