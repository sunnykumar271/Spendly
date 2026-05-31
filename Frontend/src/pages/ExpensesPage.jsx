// src/pages/ExpensesPage.jsx
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PlusCircle, Search, Filter, Pencil, Trash2 } from 'lucide-react'
import { fetchExpenses, deleteExpense } from '../features/expenses/expenseSlice'
import { fetchCategories }             from '../features/categories/categorySlice'
import Modal                           from '../components/common/Modal'
import ConfirmDialog                   from '../components/common/ConfirmDialog'
import EmptyState                      from '../components/common/EmptyState'
import { SkeletonTable }               from '../components/ui/SkeletonCard'
import ExpenseForm                     from '../components/forms/ExpenseForm'
import { formatCurrency, formatDate }  from '../utils'
import { PAYMENT_METHODS }             from '../constants'
import toast from 'react-hot-toast'

const ExpensesPage = () => {
  const dispatch = useDispatch()
  const { items: expenses, loading } = useSelector((s) => s.expenses)
  const { items: categories }        = useSelector((s) => s.categories)

  const [showForm, setShowForm]       = useState(false)
  const [editItem, setEditItem]       = useState(null)
  const [deleteId, setDeleteId]       = useState(null)
  const [deleting, setDeleting]       = useState(false)
  const [search, setSearch]           = useState('')
  const [filterCat, setFilterCat]     = useState('')

  useEffect(() => {
    dispatch(fetchExpenses())
    dispatch(fetchCategories())
  }, [dispatch])

  const handleDelete = async () => {
    setDeleting(true)
    const res = await dispatch(deleteExpense(deleteId))
    setDeleting(false)
    if (deleteExpense.fulfilled.match(res)) {
      toast.success('Expense deleted')
      setDeleteId(null)
    } else {
      toast.error(res.payload || 'Delete failed')
    }
  }

  const openEdit = (expense) => { setEditItem(expense); setShowForm(true) }
  const closeForm = () => { setShowForm(false); setEditItem(null) }

  // Client-side filter
  const filtered = expenses.filter((e) => {
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase())
    const matchCat    = filterCat ? e.category?._id === filterCat : true
    return matchSearch && matchCat
  })

  const pmLabel = (val) => PAYMENT_METHODS.find(p => p.value === val)?.label || val

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Expenses</h1>
          <p className="page-subtitle">{expenses.length} total transactions</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary btn">
          <PlusCircle size={16} /> Add Expense
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            type="text"
            placeholder="Search expenses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-9"
          />
        </div>
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="input sm:w-48"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>{c.icon} {c.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-5"><SkeletonTable rows={6} /></div>
        ) : !filtered.length ? (
          <EmptyState icon="🧾" title="No expenses found" description="Try adjusting your search or add a new expense." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-100 dark:border-surface-700 bg-surface-50 dark:bg-surface-700/50">
                  {['Title', 'Category', 'Amount', 'Date', 'Payment', ''].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100 dark:divide-surface-700">
                {filtered.map((e) => (
                  <tr key={e._id} className="hover:bg-surface-50 dark:hover:bg-surface-700/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-surface-800 dark:text-surface-200">{e.title}</td>
                    <td className="px-4 py-3">
                      <span className="badge-blue badge">{e.category?.icon} {e.category?.name}</span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-red-500">{formatCurrency(e.amount)}</td>
                    <td className="px-4 py-3 text-surface-500">{formatDate(e.date)}</td>
                    <td className="px-4 py-3 text-surface-500">{pmLabel(e.paymentMethod)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(e)} className="btn-ghost btn btn-sm p-1.5">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => setDeleteId(e._id)} className="btn-ghost btn btn-sm p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit modal */}
      <Modal isOpen={showForm} onClose={closeForm} title={editItem ? 'Edit Expense' : 'Add Expense'}>
        <ExpenseForm
          initial={editItem}
          categories={categories}
          onSuccess={closeForm}
        />
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Expense"
        message="Are you sure you want to delete this expense? This action cannot be undone."
      />
    </div>
  )
}

export default ExpensesPage
