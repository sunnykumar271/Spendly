// src/features/budgets/budgetSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import budgetService from '../../services/budgetService'
import { getErrorMessage } from '../../utils'

export const fetchBudgetReport = createAsyncThunk(
  'budgets/fetchReport',
  async (month, { rejectWithValue }) => {
    try {
      const res = await budgetService.getReport(month)
      return res.data
    } catch (err) {
      return rejectWithValue(getErrorMessage(err))
    }
  }
)

export const setBudget = createAsyncThunk(
  'budgets/set',
  async ({ categoryId, budget }, { rejectWithValue }) => {
    try {
      const res = await budgetService.setBudget(categoryId, budget)
      return res.data
    } catch (err) {
      return rejectWithValue(getErrorMessage(err))
    }
  }
)

const budgetSlice = createSlice({
  name: 'budgets',
  initialState: { report: [], period: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBudgetReport.pending,   (state) => { state.loading = true; state.error = null })
      .addCase(fetchBudgetReport.fulfilled,  (state, action) => {
        state.loading = false
        state.report  = action.payload.report
        state.period  = action.payload.period
      })
      .addCase(fetchBudgetReport.rejected,   (state, action) => { state.loading = false; state.error = action.payload })
  },
})

export default budgetSlice.reducer
