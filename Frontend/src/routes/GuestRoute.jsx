// src/routes/GuestRoute.jsx
// If user IS logged in and tries to visit /login, redirect to dashboard
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const GuestRoute = () => {
  const { token } = useSelector((s) => s.auth)
  if (token) return <Navigate to="/dashboard" replace />
  return <Outlet />
}

export default GuestRoute
