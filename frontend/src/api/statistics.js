import api from './apiClient'

export const fetchSummaryStats = () => api.get('/statistics/summary').then((r) => r.data)
