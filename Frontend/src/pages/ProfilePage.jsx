// src/pages/ProfilePage.jsx
import { useSelector } from 'react-redux'
import { getInitials, formatDate } from '../utils'
import { User, Mail, Calendar } from 'lucide-react'

const ProfilePage = () => {
  const { user } = useSelector((s) => s.auth)

  return (
    <div className="space-y-5 animate-fade-in max-w-xl">
      <div>
        <h1 className="page-title">Profile</h1>
        <p className="page-subtitle">Your account information</p>
      </div>

      <div className="card p-6">
        {/* Avatar */}
        <div className="flex items-center gap-5 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-2xl font-bold text-primary-700 dark:text-primary-300 font-display">
            {getInitials(user?.name)}
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-surface-800 dark:text-white">{user?.name}</h2>
            <p className="text-sm text-surface-500">{user?.email}</p>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4 border-t border-surface-100 dark:border-surface-700 pt-5">
          {[
            { icon: User,     label: 'Full Name',     value: user?.name },
            { icon: Mail,     label: 'Email Address', value: user?.email },
            { icon: Calendar, label: 'Member Since',  value: formatDate(user?.createdAt) },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-xl bg-surface-100 dark:bg-surface-700 flex items-center justify-center">
                <Icon size={16} className="text-surface-500 dark:text-surface-400" />
              </div>
              <div>
                <p className="text-xs text-surface-400">{label}</p>
                <p className="text-sm font-medium text-surface-800 dark:text-surface-200">{value || '—'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-5 border-l-4 border-l-amber-400">
        <p className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-0.5">Password</p>
        <p className="text-xs text-surface-500">To change your password, use Forgot Password from the login page.</p>
      </div>
    </div>
  )
}

export default ProfilePage
