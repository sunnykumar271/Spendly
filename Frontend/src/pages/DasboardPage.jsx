// src/pages/DashboardPage.jsx
import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { PlusCircle, TrendingDown, TrendingUp, Wallet, Target } from 'lucide-react'
import { fetchExpenses }     from '../features/expenses/expenseSlice'
import { fetchBudgetReport } from '../features/budgets/budgetSlice'
import { fetchCategories }   from '../features/categories/categorySlice'
import StatCard              from '../components/ui/StatCard'
import { SkeletonCard }      from '../components/ui/SkeletonCard'
import ExpenseBarChart       from '../components/charts/ExpenseBarChart'
import CategoryPieChart      from '../components/charts/CategoryPieChart'
import BudgetProgressList    from '../components/charts/BudgetProgressList'
import RecentExpenses        from '../components/dashboard/RecentExpenses'
import { formatCurrency, getCurrentMonthRange, formatMonth } from '../utils'

const DashboardPage = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((s) => s.auth)
  const { items: expenses, totalAmount, loading: expLoading } = useSelector((s) => s.expenses)
  const { report, loading: budgetLoading } = useSelector((s) => s.budgets)

  useEffect(() => {
    const range = getCurrentMonthRange()
    dispatch(fetchExpenses(range))
    dispatch(fetchBudgetReport(formatMonth()))
    dispatch(fetchCategories())
  }, [dispatch])

  // Total budgeted across all categories that have a budget
  const totalBudget = useMemo(
    () => report.filter(r => r.budget > 0).reduce((s, r) => s + r.budget, 0),
    [report]
  )
  const remaining = totalBudget - totalAmount

  const stats = [
    { label: 'This Month Spent', value: formatCurrency(totalAmount), icon: '💸', color: 'red' },
    { label: 'Total Budget',     value: formatCurrency(totalBudget), icon: '🎯', color: 'blue' },
    { label: 'Remaining',        value: formatCurrency(Math.max(0, remaining)), icon: '💰', color: 'green' },
    { label: 'Transactions',     value: expenses.length, icon: '📋', color: 'amber', sub: 'this month' },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Good day, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="page-subtitle">Here's your financial overview for this month.</p>
        </div>
        <Link to="/expenses" className="btn-primary btn hidden sm:inline-flex">
          <PlusCircle size={16} /> Add Expense
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {expLoading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : stats.map((s) => <StatCard key={s.label} {...s} />)
        }
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bar chart — takes 2 cols */}
        <div className="lg:col-span-2 card p-5">
          <h3 className="font-display font-semibold text-surface-800 dark:text-white mb-4">
            Monthly Spending Trend
          </h3>
          <ExpenseBarChart expenses={expenses} />
        </div>
        {/* Pie chart */}
        <div className="card p-5">
          <h3 className="font-display font-semibold text-surface-800 dark:text-white mb-4">
            By Category
          </h3>
          <CategoryPieChart report={report} />
        </div>
      </div>

      {/* Budget + Recent transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-surface-800 dark:text-white">Budget Status</h3>
            <Link to="/budget" className="text-xs text-primary-600 hover:underline">Manage →</Link>
          </div>
          <BudgetProgressList report={report} loading={budgetLoading} />
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-surface-800 dark:text-white">Recent Transactions</h3>
            <Link to="/expenses" className="text-xs text-primary-600 hover:underline">View all →</Link>
          </div>
          <RecentExpenses expenses={expenses.slice(0, 6)} loading={expLoading} />
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
