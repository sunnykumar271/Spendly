// src/components/dashboard/RecentExpenses.jsx
import { formatCurrency, formatDate } from '../../utils'
import { SkeletonTable } from '../ui/SkeletonCard'
import EmptyState from '../common/EmptyState'

const RecentExpenses = ({ expenses = [], loading }) => {
  if (loading) return <SkeletonTable rows={5} />
  if (!expenses.length) return <EmptyState icon="🧾" title="No expenses yet" description="Add your first expense to see it here." />

  return (
    <div className="space-y-0 divide-y divide-surface-100 dark:divide-surface-700">
      {expenses.map((e) => (
        <div key={e._id} className="flex items-center gap-3 py-3">
          {/* Category icon */}
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
            style={{ background: e.category?.color + '20' || '#2563EB20' }}>
            {e.category?.icon || '📁'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-surface-800 dark:text-surface-200 truncate">{e.title}</p>
            <p className="text-xs text-surface-400">{e.category?.name} · {formatDate(e.date)}</p>
          </div>
          <p className="text-sm font-semibold text-red-500 flex-shrink-0">
            -{formatCurrency(e.amount)}
          </p>
        </div>
      ))}
    </div>
  )
}

export default RecentExpenses
