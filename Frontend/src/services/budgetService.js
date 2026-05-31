// src/services/budgetService.js
import api from './api'

const budgetService = {
  // GET /api/budget/report?month=YYYY-MM
  getReport: (month) => api.get('/budget/report', { params: month ? { month } : {} }),

  // PUT /api/budget/:categoryId  { budget }
  setBudget: (categoryId, budget) => api.put(`/budget/${categoryId}`, { budget }),
}

export default budgetService
