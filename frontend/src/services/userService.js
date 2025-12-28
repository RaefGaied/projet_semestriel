import apiClient from './apiClient';

export const userService = {
  register: async (data) => {
    const response = await apiClient.post('/users/register', data);
    return response.data;
  },

  login: async (email, password) => {
    const response = await apiClient.post('/users/login', { email, password });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};
