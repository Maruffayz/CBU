import api from './apiClient'

export const fetchExpenses = () => api.get('/expenses').then((r) => r.data)
export const createExpense = (payload) => api.post('/expenses', payload).then((r) => r.data)
export const updateExpense = (id, payload) => api.put(`/expenses/${id}`, payload).then((r) => r.data)
export const deleteExpense = (id) => api.delete(`/expenses/${id}`)
