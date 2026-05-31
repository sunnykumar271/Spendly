// src/routes/ProtectedRoute.jsx
// ─────────────────────────────────────────────────────
// Wraps private pages. If the user is not logged in
// (no token in Redux), it redirects to /login.
// ─────────────────────────────────────────────────────
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const ProtectedRoute = () => {
  const { token } = useSelector((s) => s.auth)

  // If no token → redirect to login, preserving the intended path
  if (!token) return <Navigate to="/login" replace />

  // Token exists → render the child route (Outlet)
  return <Outlet />
}

export default ProtectedRoute
