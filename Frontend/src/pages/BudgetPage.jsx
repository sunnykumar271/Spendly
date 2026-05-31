// src/pages/BudgetPage.jsx
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBudgetReport, setBudget } from '../features/budgets/budgetSlice'
import { fetchCategories }              from '../features/categories/categorySlice'
import { SkeletonCard }                 from '../components/ui/SkeletonCard'
import EmptyState                       from '../components/common/EmptyState'
import Modal                            from '../components/common/Modal'
import { calcPercent, formatCurrency, getBudgetBarColor, getBudgetStatusColor } from '../utils'
import { formatMonth } from '../utils'
import { AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'
import Spinner from '../components/common/Spinner'

const BudgetPage = () => {
  const dispatch = useDispatch()
  const { report, loading } = useSelector((s) => s.budgets)
  const { items: categories } = useSelector((s) => s.categories)
  const [editItem, setEditItem] = useState(null) // { categoryId, current }
  const [budgetVal, setBudgetVal] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    dispatch(fetchBudgetReport(formatMonth()))
    dispatch(fetchCategories())
  }, [dispatch])

  const openEdit = (r) => {
    setEditItem({ categoryId: r.category.id, name: r.category.name, icon: r.category.icon })
    setBudgetVal(r.budget || '')
  }

  const handleSave = async () => {
    setSaving(true)
    const res = await dispatch(setBudget({ categoryId: editItem.categoryId, budget: parseFloat(budgetVal) || 0 }))
    setSaving(false)
    if (setBudget.fulfilled.match(res)) {
      toast.success('Budget updated!')
      dispatch(fetchBudgetReport(formatMonth()))
      setEditItem(null)
    } else {
      toast.error(res.payload || 'Failed to update budget')
    }
  }

  const statusIcon = (s) => s === 'over_budget' ? '🔴' : s === 'near_limit' ? '🟡' : s === 'on_track' ? '🟢' : '⚪'

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="page-title">Budget</h1>
        <p className="page-subtitle">Set and track monthly spending limits per category</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : !report.length ? (
        <EmptyState icon="🎯" title="No categories found" description="Create a category first, then set a budget for it." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {report.map((r) => {
            const pct = calcPercent(r.spent, r.budget)
            return (
              <div key={r.category.id} className="card-hover p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{r.category.icon}</span>
                    <div>
                      <h3 className="font-display font-semibold text-surface-800 dark:text-white text-sm">
                        {r.category.name}
                      </h3>
                      <span className="text-xs">{statusIcon(r.status)} {r.percentageUsed}</span>
                    </div>
                  </div>
                  <button onClick={() => openEdit(r)}
                    className="text-xs text-primary-600 hover:underline font-medium">
                    Edit
                  </button>
                </div>

                {/* Progress bar */}
                <div className="h-2 bg-surface-100 dark:bg-surface-700 rounded-full overflow-hidden mb-2">
                  <div className={`h-full rounded-full transition-all duration-500 ${getBudgetBarColor(r.status)}`}
                    style={{ width: `${pct}%` }} />
                </div>

                <div className="flex justify-between text-xs">
                  <span className="text-surface-500">Spent: <span className={`font-semibold ${getBudgetStatusColor(r.status)}`}>{formatCurrency(r.spent)}</span></span>
                  <span className="text-surface-400">
                    {r.budget > 0 ? `of ${formatCurrency(r.budget)}` : 'No budget set'}
                  </span>
                </div>

                {r.status === 'over_budget' && (
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-2.5 py-1.5">
                    <AlertTriangle size={12} /> Over by {formatCurrency(Math.abs(r.remaining))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Edit budget modal */}
      <Modal isOpen={!!editItem} onClose={() => setEditItem(null)} title={`Set Budget — ${editItem?.icon} ${editItem?.name}`} size="sm">
        <div className="space-y-4">
          <div>
            <label className="label">Monthly Budget (₹)</label>
            <input type="number" min="0" step="100" placeholder="e.g. 5000"
              className="input" value={budgetVal}
              onChange={(e) => setBudgetVal(e.target.value)} />
            <p className="text-xs text-surface-400 mt-1">Set to 0 to remove budget limit</p>
          </div>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setEditItem(null)} className="btn-secondary btn">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary btn">
              {saving ? <Spinner size="sm" /> : 'Save Budget'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default BudgetPage
