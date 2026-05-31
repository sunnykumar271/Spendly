// src/services/categoryService.js
import api from './api'

const categoryService = {
  // GET /api/categories
  getAll: () => api.get('/categories'),

  // POST /api/categories
  create: (data) => api.post('/categories', data),

  // PUT /api/categories/:id
  update: (id, data) => api.put(`/categories/${id}`, data),

  // DELETE /api/categories/:id
  remove: (id) => api.delete(`/categories/${id}`),
}

export default categoryService
