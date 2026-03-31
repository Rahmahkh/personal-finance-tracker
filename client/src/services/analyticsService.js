import api from './api';

export const analyticsService = {
  getSummary: async () => {
    const res = await api.get('/analytics/summary');
    return res.data.data;
  },

  getMonthly: async (year) => {
    const res = await api.get('/analytics/monthly', { params: { year } });
    return res.data.data;
  },

  getCategoryBreakdown: async (type = 'expense', startDate, endDate) => {
    const res = await api.get('/analytics/categories', { params: { type, startDate, endDate } });
    return res.data.data;
  },
};
