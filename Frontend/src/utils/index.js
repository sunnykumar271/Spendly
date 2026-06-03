// src/utils/index.js — helper functions used across the app

import { format, parseISO, startOfMonth, endOfMonth } from 'date-fns'

// Format a number as Indian Rupee currency
// e.g. formatCurrency(1500) → "₹1,500.00"
export const formatCurrency = (amount) => {
  const value = Number(amount) || 0;

  // Crores: 1Cr = 10,000,000
  if (Math.abs(value) >= 10_000_000) {
    const cr = value / 10_000_000
    return `₹${cr % 1 === 0 ? cr : cr.toFixed(1)}Cr`
  }

  // Lakhs: 1L = 100,000
  if (Math.abs(value) >= 100_000) {
    const lakh = value / 100_000
    return `₹${lakh % 1 === 0 ? lakh : lakh.toFixed(1)}L`
  }

  // Thousands: 1K = 1,000
  if (Math.abs(value) >= 1_000) {
    const k = value / 1_000
    return `₹${k % 1 === 0 ? k : k.toFixed(1)}K`
  }

  // Small values — show full amount
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)
}
   
// ─────────────────────────────────────────────
// FORMAT COMPACT NUMBER — without currency symbol
// e.g. 10000000000 → "10B"
// Used in charts where ₹ symbol is shown separately
// ─────────────────────────────────────────────
export const formatCompact = (value) => {
  const num = Number(value) || 0

  if (Math.abs(num) >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}B`
  if (Math.abs(num) >= 10_000_000)    return `${(num / 10_000_000).toFixed(1).replace(/\.0$/, '')}Cr`
  if (Math.abs(num) >= 100_000)       return `${(num / 100_000).toFixed(1).replace(/\.0$/, '')}L`
  if (Math.abs(num) >= 1_000)         return `${(num / 1_000).toFixed(1).replace(/\.0$/, '')}K`
  return String(num)
}
// ─────────────────────────────────────────────
// VALIDATE AMOUNT — prevents absurd values
// Max allowed: 999,999,999 (99Cr)
// Returns error message string or null if valid
// ─────────────────────────────────────────────
export const MAX_AMOUNT = 999_999_999

export const validateAmount = (value) => {
  const num = Number(value)
  if (isNaN(num) || num <= 0)       return 'Amount must be a positive number'
  if (num > MAX_AMOUNT)             return 'Amount is too large (max ₹99Cr)'
  if (String(value).length > 15)    return 'Amount is too large'
  return null // valid
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

