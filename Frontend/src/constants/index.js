// src/constants/index.js

// API base URL — reads from .env file (VITE_ prefix required by Vite)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

// localStorage key for JWT token
export const TOKEN_KEY = 'expense_tracker_token'

// localStorage key for theme
export const THEME_KEY = 'expense_tracker_theme'

// Payment methods (matches backend enum)
export const PAYMENT_METHODS = [
  { value: 'cash',       label: 'Cash',        icon: '💵' },
  { value: 'card',       label: 'Card',         icon: '💳' },
  { value: 'upi',        label: 'UPI',          icon: '📱' },
  { value: 'netbanking', label: 'Net Banking',  icon: '🏦' },
  { value: 'other',      label: 'Other',        icon: '🔄' },
]

// Budget status colors (matches backend logic)
export const BUDGET_STATUS = {
  on_track:   { label: 'On Track',    color: 'green' },
  near_limit: { label: 'Near Limit',  color: 'amber' },
  over_budget:{ label: 'Over Budget', color: 'red'   },
  no_budget:  { label: 'No Budget',   color: 'blue'  },
}

// Default chart colors
export const CHART_COLORS = [
  '#2563EB', '#10B981', '#F59E0B', '#EF4444',
  '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16',
]

// Items per page for pagination
export const PAGE_SIZE = 10
