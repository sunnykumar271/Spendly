// src/App.jsx
// ─────────────────────────────────────────────────────
// Central routing configuration.
// Uses nested routes:
//   GuestRoute   → only for logged-OUT users  (login, register)
//   ProtectedRoute → only for logged-IN users (dashboard, expenses…)
// ─────────────────────────────────────────────────────

import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMe } from './features/auth/authSlice'

// Layouts
import AppLayout  from './layouts/AppLayout'
import AuthLayout from './layouts/AuthLayout'

// Route guards
import ProtectedRoute from './routes/ProtectedRoute'
import GuestRoute     from './routes/GuestRoute'

// Pages — Auth
import LoginPage          from './pages/LoginPage'
import RegisterPage       from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgetPasswordPage'
import VerifyOTPPage      from './pages/VerifyOTPPage'
import ResetPasswordPage  from './pages/ResetPasswordPage'

// Pages — App
import DashboardPage  from './pages/DasboardPage'
import ExpensesPage   from './pages/ExpensesPage'
import CategoriesPage from './pages/CategoriesPage'
import BudgetPage     from './pages/BudgetPage'
import ReportsPage    from './pages/ReportsPage'
import ProfilePage    from './pages/ProfilePage'
import NotFoundPage   from './pages/NotFoundPage'

import { PageLoader } from './components/common/Spinner'

const App = () => {
  const dispatch = useDispatch()
  const { token, user, loading } = useSelector((s) => s.auth)

  // On app load — if we have a token but no user, fetch the profile
  // This handles page refresh (token is in localStorage but user is null)
  useEffect(() => {
    if (token && !user) {
      dispatch(fetchMe())
    }
  }, [token, user, dispatch])

  // Show spinner while verifying token on first load
  if (token && !user && loading) return <PageLoader />

  return (
    <Routes>
      {/* ── Guest-only routes (redirect to /dashboard if logged in) ── */}
      <Route element={<GuestRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login"          element={<LoginPage />} />
          <Route path="/register"       element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-otp"     element={<VerifyOTPPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>
      </Route>

      {/* ── Protected routes (redirect to /login if not logged in) ── */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard"  element={<DashboardPage />} />
          <Route path="/expenses"   element={<ExpensesPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/budget"     element={<BudgetPage />} />
          <Route path="/reports"    element={<ReportsPage />} />
          <Route path="/profile"    element={<ProfilePage />} />
        </Route>
      </Route>

      {/* ── Default redirect ── */}
      <Route path="/"   element={<Navigate to="/dashboard" replace />} />
      <Route path="*"   element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
