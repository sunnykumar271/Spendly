// src/components/forms/ExpenseForm.jsx
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { createExpense, updateExpense } from '../../features/expenses/expenseSlice'
import Spinner from '../common/Spinner'
import { PAYMENT_METHODS } from '../../constants'
import toast from 'react-hot-toast'

const ExpenseForm = ({ initial, categories = [], onSuccess }) => {
  const dispatch = useDispatch()
  const isEdit   = !!initial

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      title:         initial?.title         || '',
      amount:        initial?.amount        || '',
      description:   initial?.description   || '',
      date:          initial?.date?.split('T')[0] || new Date().toISOString().split('T')[0],
      category:      initial?.category?._id || '',
      paymentMethod: initial?.paymentMethod || 'cash',
    },
  })

  const onSubmit = async (data) => {
    const payload = { ...data, amount: parseFloat(data.amount) }
    const action  = isEdit
      ? dispatch(updateExpense({ id: initial._id, data: payload }))
      : dispatch(createExpense(payload))
    const result  = await action

    if ((isEdit ? updateExpense : createExpense).fulfilled.match(result)) {
      toast.success(isEdit ? 'Expense updated!' : 'Expense added!')
      onSuccess()
    } else {
      toast.error(result.payload || 'Failed to save expense')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="label">Title</label>
          <input className={`input ${errors.title ? 'input-error' : ''}`} placeholder="e.g. Lunch at Café"
            {...register('title', { required: 'Title is required' })} />
          {errors.title && <p className="error-text">{errors.title.message}</p>}
        </div>

        <div>
          <label className="label">Amount (₹)</label>
          <input type="number" step="0.01" min="0.01" placeholder="150.00"
            className={`input ${errors.amount ? 'input-error' : ''}`}
            {...register('amount', { required: 'Amount is required',
             min: { value: 0.01, message: 'Must be positive' },
             max: {value: 999999999, message: 'Amount is too large(max ₹99Cr)' },
             validate: (v) => String(v).length <= 15 || 'Amount is too large',
              })} />
          {errors.amount && <p className="error-text">{errors.amount.message}</p>}
        </div>

        <div>
          <label className="label">Date</label>
          <input type="date" className={`input ${errors.date ? 'input-error' : ''}`}
            {...register('date', { required: 'Date is required' })} />
          {errors.date && <p className="error-text">{errors.date.message}</p>}
        </div>

        <div>
          <label className="label">Category</label>
          <select className={`input ${errors.category ? 'input-error' : ''}`}
            {...register('category', { required: 'Category is required' })}>
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.icon} {c.name}</option>
            ))}
          </select>
          {errors.category && <p className="error-text">{errors.category.message}</p>}
        </div>

        <div>
          <label className="label">Payment Method</label>
          <select className="input" {...register('paymentMethod')}>
            {PAYMENT_METHODS.map((p) => (
              <option key={p.value} value={p.value}>{p.icon} {p.label}</option>
            ))}
          </select>
        </div>

        <div className="col-span-2">
          <label className="label">Description <span className="text-surface-400">(optional)</span></label>
          <textarea rows={2} placeholder="Add a note..."
            className="input resize-none"
            {...register('description')} />
        </div>
      </div>

      <div className="flex gap-3 justify-end pt-1">
        <button type="submit" disabled={isSubmitting} className="btn-primary btn">
          {isSubmitting ? <Spinner size="sm" /> : isEdit ? 'Update Expense' : 'Add Expense'}
        </button>
      </div>
    </form>
  )
}

export default ExpenseForm
