// src/layouts/AuthLayout.jsx — wrapper for login/register pages
import { Outlet } from 'react-router-dom'
import { TrendingUp } from 'lucide-react'

const AuthLayout = () => (
  <div className="min-h-screen flex bg-surface-50 dark:bg-surface-900">
    {/* Left panel — decorative (hidden on mobile) */}
    <div className="hidden lg:flex lg:w-1/2 bg-primary-600 items-center justify-center p-12 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/5" />
      <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-white/5" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-white/3" />

      <div className="relative z-10 text-center">
        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <TrendingUp size={32} className="text-white" />
        </div>
        <h1 className="font-display text-4xl font-bold text-white mb-4">Spendly</h1>
        <p className="text-primary-100 text-lg max-w-xs leading-relaxed">
          Track your expenses, set budgets, and take control of your finances.
        </p>
        <div className="mt-10 grid grid-cols-3 gap-6 text-center">
          {[['₹0', 'Hidden fees'], ['100%', 'Private'], ['Free', 'Forever']].map(([val, lbl]) => (
            <div key={lbl}>
              <p className="text-white font-display font-bold text-xl">{val}</p>
              <p className="text-primary-200 text-xs mt-0.5">{lbl}</p>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Right panel — form */}
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-slide-up">
        {/* Mobile logo */}
        <div className="flex items-center gap-2 mb-8 lg:hidden">
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
            <TrendingUp size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-xl text-surface-800 dark:text-white">Spendly</span>
        </div>

        <Outlet />
      </div>
    </div>
  </div>
)

export default AuthLayout
