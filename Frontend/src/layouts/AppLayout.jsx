// src/layouts/AppLayout.jsx
// The shell that wraps all protected pages: Sidebar + Topbar + page content
import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import Topbar  from '../components/layout/Topbar'

// Map routes to page titles for the topbar
const PAGE_TITLES = {
  '/dashboard':  'Dashboard',
  '/expenses':   'Expenses',
  '/categories': 'Categories',
  '/budget':     'Budget',
  '/reports':    'Reports',
  '/profile':    'Profile',
}

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const title = PAGE_TITLES[location.pathname] || ''

  return (
    <div className="flex h-screen overflow-hidden bg-surface-50 dark:bg-surface-900">
      {/* Sidebar (fixed left on desktop, slide-over on mobile) */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar
          onMenuClick={() => setSidebarOpen(true)}
          title={title}
        />
        {/* Page content with scroll */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout
