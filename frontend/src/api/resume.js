import apiClient from './client';

export const resumeAPI = {
  analyze: (formData) =>
    apiClient.post('/api/resume/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getHistory: () => apiClient.get('/api/resume/history'),
};
