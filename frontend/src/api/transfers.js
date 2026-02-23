import api from './apiClient'

export const createTransfer = (payload) => api.post('/transfers', payload).then((r) => r.data)
