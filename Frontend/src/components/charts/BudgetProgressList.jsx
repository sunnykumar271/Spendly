// src/components/charts/BudgetProgressList.jsx
import { calcPercent, formatCurrency, getBudgetBarColor, getBudgetStatusColor } from '../../utils'
import { SkeletonRow } from '../ui/SkeletonCard'
import EmptyState from '../common/EmptyState'

const BudgetProgressList = ({ report = [], loading }) => {
  if (loading) return <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)}</div>

  const withBudget = report.filter(r => r.budget > 0)
  if (!withBudget.length) return <EmptyState icon="🎯" title="No budgets set" description="Go to Budget page to set spending limits." />

  return (
    <div className="space-y-4">
      {withBudget.map((r) => {
        const pct = calcPercent(r.spent, r.budget)
        const barColor = getBudgetBarColor(r.status)
        return (
          <div key={r.category.id}>
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="font-medium text-surface-700 dark:text-surface-300 flex items-center gap-1.5">
                <span>{r.category.icon}</span> {r.category.name}
              </span>
              <span className={`text-xs font-semibold ${getBudgetStatusColor(r.status)}`}>
                {formatCurrency(r.spent)} / {formatCurrency(r.budget)}
              </span>
            </div>
            {/* Progress bar */}
            <div className="h-2 bg-surface-100 dark:bg-surface-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-xs text-surface-400 mt-0.5 text-right">{pct}% used</p>
          </div>
        )
      })}
    </div>
  )
}

export default BudgetProgressList
