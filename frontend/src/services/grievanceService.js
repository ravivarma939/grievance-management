import api from './api';

export const grievanceService = {
  getAll: async () => {
    const response = await api.get('/grievance');
    return response.data;
  },

  create: async (grievanceData) => {
    const response = await api.post('/grievance', grievanceData);
    return response.data;
  },

  filter: async (propertyName, value) => {
    const response = await api.get('/grievance/filter', {
      params: { propertyName, value }
    });
    return response.data;
  },

  filterByCompany: async (company) => {
    const response = await api.get('/grievance/filter', {
      params: { company }
    });
    return response.data;
  },

  filterByProduct: async (product) => {
    const response = await api.get('/grievance/filter', {
      params: { product }
    });
    return response.data;
  },

  filterByState: async (state) => {
    const response = await api.get('/grievance/filter', {
      params: { state }
    });
    return response.data;
  },

  getStatistics: async () => {
    const response = await api.get('/grievance/statistics');
    return response.data;
  },

  getTimelyResponseCount: async () => {
    const response = await api.get('/grievance/timely-response-count');
    return response.data;
  }
};
