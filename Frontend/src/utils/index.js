// src/utils/index.js — helper functions used across the app

import { format, parseISO, startOfMonth, endOfMonth } from 'date-fns'

// Format a number as Indian Rupee currency
// e.g. formatCurrency(1500) → "₹1,500.00"
export const formatCurrency = (amount) => {
  const value = Number(amount) || 0;

  // use scientific notation for very large/small numbers
  if (Math.abs(value) >= 1e15 || Math.abs(value) <= 1e-6) {
    return `${value.toPrecision(2)}`
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(value)
}

// Format a date string to readable format
// e.g. formatDate('2024-01-15') → "Jan 15, 2024"
export const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  try {
    return format(parseISO(dateStr), 'MMM dd, yyyy')
  } catch {
    return dateStr
  }
}

// Format date to YYYY-MM for API month param
export const formatMonth = (date = new Date()) => {
  return format(date, 'yyyy-MM')
}

// Get current month's start and end as ISO strings
export const getCurrentMonthRange = () => {
  const now = new Date()
  return {
    startDate: startOfMonth(now).toISOString().split('T')[0],
    endDate: endOfMonth(now).toISOString().split('T')[0],
  }
}

// Truncate long text with ellipsis
export const truncate = (str, n = 30) =>
  str?.length > n ? str.slice(0, n) + '...' : str

// Get initials from a name — "Raj Patel" → "RP"
export const getInitials = (name = '') =>
  name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)

// Extract error message from axios error
export const getErrorMessage = (error) =>
  error?.response?.data?.message || error?.message || 'Something went wrong'

// Calculate percentage safely (avoid divide by zero)
export const calcPercent = (value, total) =>
  total > 0 ? Math.min(100, Math.round((value / total) * 100)) : 0

// Return Tailwind color class based on budget status
export const getBudgetStatusColor = (status) => {
  const map = {
    on_track:    'text-emerald-500',
    near_limit:  'text-amber-500',
    over_budget: 'text-red-500',
    no_budget:   'text-surface-400',
  }
  return map[status] || 'text-surface-400'
}

export const getBudgetBarColor = (status) => {
  const map = {
    on_track:    'bg-emerald-500',
    near_limit:  'bg-amber-500',
    over_budget: 'bg-red-500',
    no_budget:   'bg-surface-300',
  }
  return map[status] || 'bg-surface-300'
}

