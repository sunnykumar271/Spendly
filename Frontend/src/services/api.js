// src/services/api.js
// ─────────────────────────────────────────────────────
// Central Axios instance — all API calls go through here.
// Handles: base URL, JWT token injection, error handling.
// ─────────────────────────────────────────────────────

import axios from 'axios'
import { API_BASE_URL, TOKEN_KEY } from '../constants'

// Create a custom axios instance with our base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000, // 15 seconds
})

// ── REQUEST interceptor ──────────────────────────────
// Runs before EVERY request. Injects the JWT token
// from localStorage into the Authorization header.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── RESPONSE interceptor ─────────────────────────────
// Runs after EVERY response. If we get a 401 (Unauthorized),
// it means the token expired — clear it and redirect to login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
     console.error('API error:', error.response?.data || error.message) // <--- add this
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
