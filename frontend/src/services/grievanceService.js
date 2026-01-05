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

  update: async (grievanceId, grievanceData) => {
    const response = await api.put(`/grievance/${grievanceId}`, grievanceData);
    return response.data;
  },

  delete: async (grievanceId) => {
    const response = await api.delete(`/grievance/${grievanceId}`);
    return response.data;
  },

  filter: async (issueType, company) => {
    const response = await api.get('/grievance/filter', {
      params: { issueType, company }
    });
    return response.data;
  }
};

