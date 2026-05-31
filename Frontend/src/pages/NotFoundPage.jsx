// src/pages/NotFoundPage.jsx
import { Link } from 'react-router-dom'

const NotFoundPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-surface-50 dark:bg-surface-900 text-center p-6">
    <p className="text-8xl mb-4">🧭</p>
    <h1 className="font-display text-5xl font-bold text-surface-800 dark:text-white mb-2">404</h1>
    <p className="text-surface-500 dark:text-surface-400 mb-6 max-w-xs">
      Looks like this page doesn't exist. You may have followed a broken link.
    </p>
    <Link to="/dashboard" className="btn-primary btn btn-lg">
      Back to Dashboard
    </Link>
  </div>
)

export default NotFoundPage
