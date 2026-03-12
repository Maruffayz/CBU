import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;

// Auth
export const authApi = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
};

// Accounts
export const accountApi = {
  getAll: () => api.get('/accounts'),
  create: (data: any) => api.post('/accounts', data),
  update: (id: string, data: any) => api.put(`/accounts/${id}`, data),
  delete: (id: string) => api.delete(`/accounts/${id}`),
};

// Transactions
export const transactionApi = {
  getAll: () => api.get('/transactions'),
  addIncome: (data: any) => api.post('/transactions/income', data),
  addExpense: (data: any) => api.post('/transactions/expense', data),
  update: (id: string, data: any) => api.put(`/transactions/${id}`, data),
  delete: (id: string) => api.delete(`/transactions/${id}`),
};

// Transfers
export const transferApi = {
  getAll: () => api.get('/transfers'),
  create: (data: any) => api.post('/transfers', data),
};

// Debts
export const debtApi = {
  getAll: () => api.get('/debts'),
  create: (data: any) => api.post('/debts', data),
  update: (id: string, data: any) => api.put(`/debts/${id}`, data),
  close: (id: string) => api.patch(`/debts/${id}/close`),
  delete: (id: string) => api.delete(`/debts/${id}`),
};

// Budgets
export const budgetApi = {
  get: (month?: number, year?: number) => api.get('/budgets', { params: { month, year } }),
  create: (data: any) => api.post('/budgets', data),
};

// Analytics
export const analyticsApi = {
  dashboard: () => api.get('/analytics/dashboard'),
  monthlyTrend: (year?: number) => api.get('/analytics/monthly-trend', { params: { year } }),
  calendar: (month?: number, year?: number) => api.get('/analytics/calendar', { params: { month, year } }),
};

// Categories
export const categoryApi = {
  getAll: () => api.get('/categories'),
};
