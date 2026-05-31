// src/components/layout/Sidebar.jsx
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  LayoutDashboard, Receipt, Tag, Wallet,
  BarChart2, User, LogOut, X, TrendingUp
} from 'lucide-react'
import { logout } from '../../features/auth/authSlice'
import { getInitials } from '../../utils'
import toast from 'react-hot-toast'

const NAV = [
  { to: '/dashboard',   label: 'Dashboard',   icon: LayoutDashboard },
  { to: '/expenses',    label: 'Expenses',     icon: Receipt },
  { to: '/categories',  label: 'Categories',   icon: Tag },
  { to: '/budget',      label: 'Budget',       icon: Wallet },
  { to: '/reports',     label: 'Reports',      icon: BarChart2 },
  { to: '/profile',     label: 'Profile',      icon: User },
]

const Sidebar = ({ open, onClose }) => {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const { user }  = useSelector((s) => s.auth)

  const handleLogout = () => {
    dispatch(logout())
    toast.success('Logged out successfully')
    navigate('/login')
  }

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside className={`
        fixed top-0 left-0 z-40 h-full w-64 flex flex-col
        bg-white dark:bg-surface-800 border-r border-surface-100 dark:border-surface-700
        transform transition-transform duration-200 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>

        {/* Logo + close button (mobile) */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-surface-100 dark:border-surface-700">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
              <TrendingUp size={16} className="text-white" />
            </div>
            <span className="font-display font-semibold text-surface-800 dark:text-white text-lg">
              Spendly
            </span>
          </div>
          <button onClick={onClose} className="lg:hidden btn-ghost btn p-1.5 rounded-lg">
            <X size={16} />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900/25 text-primary-600 dark:text-primary-400'
                    : 'text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-700/60 hover:text-surface-800 dark:hover:text-surface-200'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User info + logout */}
        <div className="px-3 py-4 border-t border-surface-100 dark:border-surface-700">
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-xs font-semibold text-primary-700 dark:text-primary-300 flex-shrink-0">
              {getInitials(user?.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-surface-800 dark:text-white truncate">{user?.name}</p>
              <p className="text-xs text-surface-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-surface-600 dark:text-surface-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors"
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
