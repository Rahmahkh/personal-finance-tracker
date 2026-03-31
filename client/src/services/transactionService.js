import api from './api';

export const transactionService = {
  getAll: async (params = {}) => {
    const res = await api.get('/transactions', { params });
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/transactions/${id}`);
    return res.data.data;
  },

  create: async (data) => {
    const res = await api.post('/transactions', data);
    return res.data.data;
  },

  update: async (id, data) => {
    const res = await api.put(`/transactions/${id}`, data);
    return res.data.data;
  },

  delete: async (id) => {
    const res = await api.delete(`/transactions/${id}`);
    return res.data;
  },
};
