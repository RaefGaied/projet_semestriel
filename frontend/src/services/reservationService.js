import apiClient from './apiClient';

export const reservationService = {
  create: async (data) => {
    const response = await apiClient.post('/reservations', data);
    return response.data;
  },

  getMesReservations: async () => {
    const response = await apiClient.get('/reservations/me');
    return response.data;
  },

  cancel: async (id) => {
    const response = await apiClient.put(`/reservations/annuler/${id}`);
    return response.data;
  },

  finish: async (id) => {
    const response = await apiClient.put(`/reservations/terminer/${id}`);
    return response.data;
  },
};
