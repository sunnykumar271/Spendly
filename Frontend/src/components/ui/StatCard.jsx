// src/components/ui/StatCard.jsx
const StatCard = ({ label, value, sub, icon, color = 'blue' }) => {
  const colors = {
    blue:  'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400',
    green: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
    red:   'bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400',
    amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
  }

  return (
    <div className="card-hover p-4 sm:p-5 flex items-start gap-3 sm:gap-4">
      {icon && (
        <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-lg sm:text-xl flex-shrink-0 ${colors[color]}`}>
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        {/* Label */}
        <p className="text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wide mb-1 break-words">
          {label}
        </p>

        {/* Value — shrinks on mobile, never truncates */}
        <p
          className="font-display font-semibold text-surface-800 dark:text-white leading-tight
                     text-base sm:text-lg lg:text-xl break-all"
          title={String(value)}
        >
          {value}
        </p>

        {/* Sub text */}
        {sub && (
          <p className="text-xs text-surface-400 dark:text-surface-500 mt-0.5">{sub}</p>
        )}
      </div>
    </div>
  )
}

export default StatCard
