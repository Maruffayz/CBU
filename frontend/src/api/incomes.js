import api from './apiClient'

export const fetchIncomes = () => api.get('/incomes').then((r) => r.data)
export const createIncome = (payload) => api.post('/incomes', payload).then((r) => r.data)
