import api from './apiClient'

export const fetchBudgets = () => api.get('/budgets').then((r) => r.data)
export const fetchBudgetsForMonth = (year, month) =>
  api.get('/budgets/month', { params: { year, month } }).then((r) => r.data)
export const createBudget = (payload) => api.post('/budgets', payload).then((r) => r.data)
