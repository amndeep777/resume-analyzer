import apiClient from './client';

export const adminAPI = {
  getStats: () => apiClient.get('/api/admin/stats'),
  getUsers: () => apiClient.get('/api/admin/users'),
};
