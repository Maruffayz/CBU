import api from './apiClient'

export const fetchAccounts = () => api.get('/accounts').then((r) => r.data)
export const createAccount = (payload) => api.post('/accounts', payload).then((r) => r.data)
export const updateAccount = (id, payload) => api.put(`/accounts/${id}`, payload).then((r) => r.data)
