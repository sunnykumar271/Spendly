// src/features/categories/categorySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import categoryService from '../../services/categoryService'
import { getErrorMessage } from '../../utils'

export const fetchCategories = createAsyncThunk(
  'categories/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await categoryService.getAll()
      return res.data
    } catch (err) {
      return rejectWithValue(getErrorMessage(err))
    }
  }
)

export const createCategory = createAsyncThunk(
  'categories/create',
  async (data, { rejectWithValue }) => {
    try {
      const res = await categoryService.create(data)
      return res.data
    } catch (err) {
      return rejectWithValue(getErrorMessage(err))
    }
  }
)

export const updateCategory = createAsyncThunk(
  'categories/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await categoryService.update(id, data)
      return res.data
    } catch (err) {
      return rejectWithValue(getErrorMessage(err))
    }
  }
)

export const deleteCategory = createAsyncThunk(
  'categories/delete',
  async (id, { rejectWithValue }) => {
    try {
      await categoryService.remove(id)
      return id
    } catch (err) {
      return rejectWithValue(getErrorMessage(err))
    }
  }
)

const categorySlice = createSlice({
  name: 'categories',
  initialState: { items: [], loading: false, error: null },
  reducers: {
    clearCategoryError(state) { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending,  (state) => { state.loading = true })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false
        state.items   = action.payload.categories
      })
      .addCase(fetchCategories.rejected,  (state, action) => { state.loading = false; state.error = action.payload })

      .addCase(createCategory.fulfilled,  (state, action) => { state.items.unshift(action.payload.category) })
      .addCase(updateCategory.fulfilled,  (state, action) => {
        const idx = state.items.findIndex(c => c._id === action.payload.category._id)
        if (idx !== -1) state.items[idx] = action.payload.category
      })
      .addCase(deleteCategory.fulfilled,  (state, action) => {
        state.items = state.items.filter(c => c._id !== action.payload)
      })
  },
})

export const { clearCategoryError } = categorySlice.actions
export default categorySlice.reducer
