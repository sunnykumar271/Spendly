// src/services/authService.js
// All authentication API calls — matches backend authRoutes.js exactly

import api from './api'

const authService = {
  // POST /api/auth/register
  register: (data) => api.post('/auth/register', data),

  // POST /api/auth/login
  login: (data) => api.post('/auth/login', data),

  // GET /api/auth/me
  getMe: () => api.get('/auth/me'),

  // POST /api/auth/forgot-password
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),

  // POST /api/auth/verify-otp
  verifyOTP: (data) => api.post('/auth/verify-otp', data),

  // POST /api/auth/reset-password
  resetPassword: (data) => api.post('/auth/reset-password', data),
}

export default authService
