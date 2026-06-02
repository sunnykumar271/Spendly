// src/pages/ReportsPage.jsx
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { fetchExpenses }   from '../features/expenses/expenseSlice'
import { fetchBudgetReport } from '../features/budgets/budgetSlice'
import { fetchCategories }   from '../features/categories/categorySlice'
import CategoryPieChart    from '../components/charts/CategoryPieChart'
import BudgetProgressList  from '../components/charts/BudgetProgressList'
import { formatCurrency, formatMonth } from '../utils'
import { format, parseISO, subMonths } from 'date-fns'

const ReportsPage = () => {
  const dispatch = useDispatch()
  const { items: expenses }     = useSelector((s) => s.expenses)
  const { report, loading }     = useSelector((s) => s.budgets)
  const [month, setMonth]       = useState(formatMonth())

  useEffect(() => {
    dispatch(fetchExpenses())
    dispatch(fetchBudgetReport(month))
    dispatch(fetchCategories())
  }, [dispatch, month])

  // Build a 7-day trend from expenses
  const trendData = (() => {
    const days = {}
    expenses.forEach((e) => {
      try {
        const d = format(parseISO(e.date), 'MMM dd')
        days[d] = (days[d] || 0) + e.amount
      } catch {}
    })
    return Object.entries(days).slice(-14).map(([date, amount]) => ({ date, amount: Math.round(amount) }))
  })()

  const totalSpent  = report.reduce((s, r) => s + r.spent, 0)
  const totalBudget = report.filter(r => r.budget > 0).reduce((s, r) => s + r.budget, 0)
  const formatYAxisValue = (value) => {
  if (value >= 1e15) {
    return value.toExponential(1)
  }

  if (value >= 1e9) {
    return `${(value / 1e9).toFixed(1)}B`
  }

  if (value >= 1e6) {
    return `${(value / 1e6).toFixed(1)}M`
  }

  if (value >= 1e3) {
    return `${(value / 1e3).toFixed(1)}K`
  }

  return value
}
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-title">Reports & Analytics</h1>
          <p className="page-subtitle">Detailed view of your spending patterns</p>
        </div>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="input w-auto"
        />
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Spent', value: formatCurrency(totalSpent), color: 'text-red-500' },
          { label: 'Total Budgeted', value: formatCurrency(totalBudget), color: 'text-primary-600 dark:text-primary-400' },
          { label: 'Remaining', value: formatCurrency(Math.max(0, totalBudget - totalSpent)), color: 'text-emerald-500' },
        ].map((s) => (
          <div key={s.label} className="card p-5">
            <p className="text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wide mb-1">{s.label}</p>
            <p className={`text-2xl font-display font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>
       
      {/* Trend line chart */}
      <div className="card p-5">
        <h3 className="font-display font-semibold text-surface-800 dark:text-white mb-4">Daily Spending Trend</h3>
        {trendData.length ? (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trendData} margin={{ top: 10, right: 20, left: 30, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.1)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} width={60}
                tickFormatter={formatYAxisValue} />
              <Tooltip 
              contentStyle={{ borderRadius: '12px', borderColor: '#E2E8F0', backgroundColor: '#fff' }}
              formatter={(value) => [formatCurrency(value), 'Spent']} />
              <Line type="monotone" dataKey="amount" stroke="#2563EB" strokeWidth={4} dot={{ r: 5, fill: '#2563EB', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 8,fill: '#2563EB' }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-sm text-surface-400 py-10">No data for this period</p>
        )}
      </div>

      {/* Pie + Budget side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="font-display font-semibold text-surface-800 dark:text-white mb-4">Category Breakdown</h3>
          <CategoryPieChart report={report} />
        </div>
        <div className="card p-5">
          <h3 className="font-display font-semibold text-surface-800 dark:text-white mb-4">Budget vs Spent</h3>
          <BudgetProgressList report={report} loading={loading} />
        </div>
      </div>
    </div>
  )
}

export default ReportsPage
