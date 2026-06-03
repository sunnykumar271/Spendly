// src/components/ui/StatCard.jsx — dashboard metric card
const StatCard = ({ label, value, sub, icon, color = 'blue', trend }) => {
  const colors = {
    blue:   'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400',
    green:  'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
    red:    'bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400',
    amber:  'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
  }
  return (
    <div className="card-hover p-5 flex items-start gap-4">
      {icon && (
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${colors[color]}`}>
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wide mb-1">{label}</p>
        <p
         className="text-xl font-display font-semibold text-surface-800 dark:text-white truncate"
         title={String(value)}>
          {value}
        </p>
        {sub && <p className="text-xs text-surface-400 dark:text-surface-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

export default StatCard
