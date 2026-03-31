import api from './api';

export const userService = {
  getProfile: async () => {
    const res = await api.get('/users/profile');
    return res.data.data;
  },

  updateProfile: async (data) => {
    const res = await api.put('/users/profile', data);
    return res.data.data;
  },

  changePassword: async (data) => {
    const res = await api.put('/users/password', data);
    return res.data;
  },

  deleteAccount: async () => {
    const res = await api.delete('/users/account');
    return res.data;
  },
};
