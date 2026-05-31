// src/services/expenseService.js
import api from './api'

const expenseService = {
  // GET /api/expenses  (supports ?category=&startDate=&endDate=&paymentMethod=)
  getAll: (params) => api.get('/expenses', { params }),

  // GET /api/expenses/:id
  getById: (id) => api.get(`/expenses/${id}`),

  // POST /api/expenses
  create: (data) => api.post('/expenses', data),

  // PUT /api/expenses/:id
  update: (id, data) => api.put(`/expenses/${id}`, data),

  // DELETE /api/expenses/:id
  remove: (id) => api.delete(`/expenses/${id}`),
}

export default expenseService
