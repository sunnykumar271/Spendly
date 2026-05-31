// src/store/index.js
// ─────────────────────────────────────────────────────
// The central Redux store — combines all slices.
// This is what <Provider store={store}> wraps around the app.
// ─────────────────────────────────────────────────────

import { configureStore } from '@reduxjs/toolkit'
import authReducer      from '../features/auth/authSlice'
import expenseReducer   from '../features/expenses/expenseSlice'
import categoryReducer  from '../features/categories/categorySlice'
import budgetReducer    from '../features/budgets/budgetSlice'
import themeReducer     from '../features/theme/themeSlice'

export const store = configureStore({
  reducer: {
    auth:       authReducer,
    expenses:   expenseReducer,
    categories: categoryReducer,
    budgets:    budgetReducer,
    theme:      themeReducer,
  },
})

// TypeHelper: useful for reading state in components
// Usage: const user = useSelector((state) => state.auth.user)
export default store
