import api from './api';

export const bookmarkService = {
  addBookmark: async (bookmarkData) => {
    const response = await api.post('/bookmarks', bookmarkData);
    return response.data;
  },

  getBookmarks: async (username) => {
    const response = await api.get(`/bookmarks/user/${username}`);
    return response.data;
  },

  deleteBookmark: async (id) => {
    const response = await api.delete(`/bookmarks/${id}`);
    return response.data;
  }
};


