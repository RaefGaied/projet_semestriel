import apiClient from './apiClient';

export const hotelService = {
  getAll: async () => {
    const response = await apiClient.get('/hotels');
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/hotels/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post('/hotels', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/hotels/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/hotels/${id}`);
    return response.data;
  },
};
