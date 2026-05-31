// src/features/expenses/expenseSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import expenseService from '../../services/expenseService'
import { getErrorMessage } from '../../utils'

export const fetchExpenses = createAsyncThunk(
  'expenses/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const res = await expenseService.getAll(params)
      return res.data
    } catch (err) {
      return rejectWithValue(getErrorMessage(err))
    }
  }
)

export const createExpense = createAsyncThunk(
  'expenses/create',
  async (data, { rejectWithValue }) => {
    try {
      const res = await expenseService.create(data)
      return res.data
    } catch (err) {
      return rejectWithValue(getErrorMessage(err))
    }
  }
)

export const updateExpense = createAsyncThunk(
  'expenses/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await expenseService.update(id, data)
      return res.data
    } catch (err) {
      return rejectWithValue(getErrorMessage(err))
    }
  }
)

export const deleteExpense = createAsyncThunk(
  'expenses/delete',
  async (id, { rejectWithValue }) => {
    try {
      await expenseService.remove(id)
      return id // return id so we can remove it from state
    } catch (err) {
      return rejectWithValue(getErrorMessage(err))
    }
  }
)

const expenseSlice = createSlice({
  name: 'expenses',
  initialState: {
    items:       [],
    totalAmount: 0,
    loading:     false,
    error:       null,
  },
  reducers: {
    clearExpenseError(state) { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending,  (state) => { state.loading = true; state.error = null })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading     = false
        state.items       = action.payload.expenses
        state.totalAmount = parseFloat(action.payload.totalAmount) || 0
      })
      .addCase(fetchExpenses.rejected,  (state, action) => { state.loading = false; state.error = action.payload })

      .addCase(createExpense.fulfilled, (state, action) => {
        state.items.unshift(action.payload.expense) // add to top of list
      })

      .addCase(updateExpense.fulfilled, (state, action) => {
        const idx = state.items.findIndex(e => e._id === action.payload.expense._id)
        if (idx !== -1) state.items[idx] = action.payload.expense
      })

      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.items = state.items.filter(e => e._id !== action.payload)
      })
  },
})

export const { clearExpenseError } = expenseSlice.actions
export default expenseSlice.reducer
