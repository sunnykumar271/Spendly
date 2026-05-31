// src/features/theme/themeSlice.js
import { createSlice } from '@reduxjs/toolkit'
import { THEME_KEY } from '../../constants'

// Read saved theme from localStorage (default: light)
const savedTheme = localStorage.getItem(THEME_KEY) || 'light'

// Apply the theme class to <html> immediately
if (savedTheme === 'dark') {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
}

const themeSlice = createSlice({
  name: 'theme',
  initialState: { mode: savedTheme },
  reducers: {
    toggleTheme(state) {
      state.mode = state.mode === 'light' ? 'dark' : 'light'
      // Persist to localStorage
      localStorage.setItem(THEME_KEY, state.mode)
      // Toggle 'dark' class on <html> element
      if (state.mode === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },
    setTheme(state, action) {
      state.mode = action.payload
      localStorage.setItem(THEME_KEY, state.mode)
      document.documentElement.classList.toggle('dark', state.mode === 'dark')
    },
  },
})

export const { toggleTheme, setTheme } = themeSlice.actions
export default themeSlice.reducer
