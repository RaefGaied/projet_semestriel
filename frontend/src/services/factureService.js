import apiClient from './apiClient';

export const factureService = {
  generate: async (data) => {
    const response = await apiClient.post('/factures', data);
    return response.data;
  },

  getByReservation: async (resId) => {
    const response = await apiClient.get(`/factures/${resId}`);
    return response.data;
  },
};
