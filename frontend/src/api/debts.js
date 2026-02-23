import api from './apiClient'

export const fetchDebts = () => api.get('/debts').then((r) => r.data)
export const createDebt = (payload) => api.post('/debts', payload).then((r) => r.data)
export const updateDebt = (id, payload) => api.put(`/debts/${id}`, payload).then((r) => r.data)
