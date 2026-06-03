// src/components/forms/CategoryForm.jsx
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { createCategory, updateCategory } from '../../features/categories/categorySlice'
import Spinner from '../common/Spinner'
import toast from 'react-hot-toast'

const ICONS = ['🍔','🚗','🏠','🏥','🎮','📚','✈️','👗','💊','☕','🛒','🎬','💪','📱','🎁','🌊']
const COLORS = ['#2563EB','#10B981','#F59E0B','#EF4444','#8B5CF6','#EC4899','#06B6D4','#84CC16']

const CategoryForm = ({ initial, onSuccess }) => {
  const dispatch = useDispatch()
  const isEdit   = !!initial

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      name:   initial?.name   || '',
      icon:   initial?.icon   || '📁',
      color:  initial?.color  || '#2563EB',
      budget: initial?.budget || 0,
    },
  })
  const selectedIcon  = watch('icon')
  const selectedColor = watch('color')

  const onSubmit = async (data) => {
    const payload = { ...data, budget: parseFloat(data.budget) || 0 }
    const action  = isEdit
      ? dispatch(updateCategory({ id: initial._id, data: payload }))
      : dispatch(createCategory(payload))
    const result  = await action

    if ((isEdit ? updateCategory : createCategory).fulfilled.match(result)) {
      toast.success(isEdit ? 'Category updated!' : 'Category created!')
      onSuccess()
    } else {
      toast.error(result.payload || 'Failed')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="label">Category Name</label>
        <input className={`input ${errors.name ? 'input-error' : ''}`} placeholder="e.g. Food & Dining"
          {...register('name', { required: 'Name is required' })} />
        {errors.name && <p className="error-text">{errors.name.message}</p>}
      </div>

      <div>
        <label className="label">Icon</label>
        <div className="flex flex-wrap gap-2">
          {ICONS.map((ic) => (
            <button key={ic} type="button"
              onClick={() => setValue('icon', ic)}
              className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all
                ${selectedIcon === ic ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/30 scale-110' : 'bg-surface-100 dark:bg-surface-700 hover:scale-105'}`}>
              {ic}
            </button>
          ))}
        </div>
        <input type="hidden" {...register('icon')} />
      </div>

      <div>
        <label className="label">Colour</label>
        <div className="flex gap-2 flex-wrap">
          {COLORS.map((col) => (
            <button key={col} type="button"
              onClick={() => setValue('color', col)}
              className={`w-8 h-8 rounded-full transition-transform ${selectedColor === col ? 'scale-125 ring-2 ring-offset-2 ring-surface-400' : 'hover:scale-110'}`}
              style={{ backgroundColor: col }} />
          ))}
        </div>
        <input type="hidden" {...register('color')} />
      </div>

      <div>
        <label className="label">Monthly Budget (₹) <span className="text-surface-400 font-normal">(optional)</span></label>
        <input type="number" 
        min="0" 
        max="999999999"
        step="100"
        placeholder="0"
          className="input" {...register('budget',
            { min: { value: 0, message: 'Must be positive' },
              max: { value: 999999999, message: 'Amount is too large(max ₹99Cr)' },
              validate: (v) => !v || String(v).length <= 15 || 'Amount is too large',
            })} />
        {errors.budget && <p className="error-text">{errors.budget.message}</p>}
      </div>

      <div className="flex justify-end pt-1">
        <button type="submit" disabled={isSubmitting} className="btn-primary btn">
          {isSubmitting ? <Spinner size="sm" /> : isEdit ? 'Update' : 'Create Category'}
        </button>
      </div>
    </form>
  )
}

export default CategoryForm
