// src/features/auth/authSlice.js
// ─────────────────────────────────────────────────────
// Redux slice for authentication state.
// A "slice" = state + reducers + actions in one place.
// "Async thunks" handle API calls.
// ─────────────────────────────────────────────────────

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from '../../services/authService'
import { TOKEN_KEY } from '../../constants'
import { getErrorMessage } from '../../utils'

// ── Async Thunks (API calls) ──────────────────────────

export const registerUser = createAsyncThunk(
  'auth/register',
  async (data, { rejectWithValue }) => {
    try {
      const res = await authService.register(data)
      // Save token to localStorage on success
      localStorage.setItem(TOKEN_KEY, res.data.token)
      return res.data
    } catch (err) {
      return rejectWithValue(getErrorMessage(err))
    }
  }
)

export const loginUser = createAsyncThunk(
  'auth/login',
  async (data, { rejectWithValue }) => {
    try {
      const res = await authService.login(data)
      localStorage.setItem(TOKEN_KEY, res.data.token)
      return res.data
    } catch (err) {
      return rejectWithValue(getErrorMessage(err))
    }
  }
)

export const fetchMe = createAsyncThunk(
  'auth/fetchMe',
  async (_, { rejectWithValue }) => {
    try {
      const res = await authService.getMe()
      return res.data
    } catch (err) {
      return rejectWithValue(getErrorMessage(err))
    }
  }
)

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const res = await authService.forgotPassword(email)
      return res.data
    } catch (err) {
      return rejectWithValue(getErrorMessage(err))
    }
  }
)

export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async (data, { rejectWithValue }) => {
    try {
      const res = await authService.verifyOTP(data)
      return res.data
    } catch (err) {
      return rejectWithValue(getErrorMessage(err))
    }
  }
)

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (data, { rejectWithValue }) => {
    try {
      const res = await authService.resetPassword(data)
      return res.data
    } catch (err) {
      return rejectWithValue(getErrorMessage(err))
    }
  }
)

// ── Initial State ─────────────────────────────────────
const initialState = {
  user:    null,
  token:   localStorage.getItem(TOKEN_KEY) || null,
  loading: false,
  error:   null,
}

// ── Slice ─────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Synchronous logout — clears everything
    logout(state) {
      state.user  = null
      state.token = null
      state.error = null
      localStorage.removeItem(TOKEN_KEY)
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Helper to set loading state
    const pending  = (state) => { state.loading = true;  state.error = null }
    const rejected = (state, action) => { state.loading = false; state.error = action.payload }

    builder
      // Register
      .addCase(registerUser.pending,  pending)
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.token   = action.payload.token
        state.user    = action.payload.user
      })
      .addCase(registerUser.rejected, rejected)

      // Login
      .addCase(loginUser.pending,  pending)
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.token   = action.payload.token
        state.user    = action.payload.user
      })
      .addCase(loginUser.rejected, rejected)

      // Fetch profile
      .addCase(fetchMe.pending,  pending)
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading = false
        state.user    = action.payload.user
      })
      .addCase(fetchMe.rejected, (state) => {
        // If /me fails, token is invalid — clear everything
        state.loading = false
        state.token   = null
        state.user    = null
        localStorage.removeItem(TOKEN_KEY)
      })

      // Forgot / verify / reset — just track loading
      .addCase(forgotPassword.pending,  pending)
      .addCase(forgotPassword.fulfilled, (state) => { state.loading = false })
      .addCase(forgotPassword.rejected,  rejected)
      .addCase(verifyOTP.pending,  pending)
      .addCase(verifyOTP.fulfilled, (state) => { state.loading = false })
      .addCase(verifyOTP.rejected,  rejected)
      .addCase(resetPassword.pending,  pending)
      .addCase(resetPassword.fulfilled, (state) => { state.loading = false })
      .addCase(resetPassword.rejected,  rejected)
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
