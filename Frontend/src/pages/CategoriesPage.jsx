// src/pages/CategoriesPage.jsx
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PlusCircle, Pencil, Trash2 } from 'lucide-react'
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../features/categories/categorySlice'
import Modal         from '../components/common/Modal'
import ConfirmDialog from '../components/common/ConfirmDialog'
import EmptyState    from '../components/common/EmptyState'
import { SkeletonCard } from '../components/ui/SkeletonCard'
import CategoryForm  from '../components/forms/CategoryForm'
import toast from 'react-hot-toast'

const CategoriesPage = () => {
  const dispatch = useDispatch()
  const { items: categories, loading } = useSelector((s) => s.categories)
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => { dispatch(fetchCategories()) }, [dispatch])

  const handleDelete = async () => {
    setDeleting(true)
    const res = await dispatch(deleteCategory(deleteId))
    setDeleting(false)
    if (deleteCategory.fulfilled.match(res)) {
      toast.success('Category deleted')
      setDeleteId(null)
    } else {
      toast.error(res.payload || 'Delete failed')
    }
  }

  const openEdit = (cat) => { setEditItem(cat); setShowForm(true) }
  const closeForm = () => { setShowForm(false); setEditItem(null) }

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Categories</h1>
          <p className="page-subtitle">Organise your expenses by type</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary btn">
          <PlusCircle size={16} /> New Category
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : !categories.length ? (
        <EmptyState icon="🏷️" title="No categories yet" description="Create a category to start tracking expenses." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((c) => (
            <div key={c._id} className="card-hover p-5 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ backgroundColor: c.color + '20' }}>
                {c.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-semibold text-surface-800 dark:text-white truncate">{c.name}</h3>
                {c.budget > 0 && (
                  <p className="text-xs text-surface-400 mt-0.5">Budget: ₹{c.budget.toLocaleString('en-IN')}</p>
                )}
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={() => openEdit(c)} className="btn-ghost btn btn-sm p-1.5"><Pencil size={14} /></button>
                <button onClick={() => setDeleteId(c._id)} className="btn-ghost btn btn-sm p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showForm} onClose={closeForm} title={editItem ? 'Edit Category' : 'New Category'} size="sm">
        <CategoryForm initial={editItem} onSuccess={closeForm} />
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Category"
        message="This will permanently delete this category. Expenses using it must be reassigned first."
      />
    </div>
  )
}

export default CategoriesPage
