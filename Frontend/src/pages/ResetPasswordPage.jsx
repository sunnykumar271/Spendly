// src/pages/ResetPasswordPage.jsx
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { KeyRound, Eye, EyeOff } from 'lucide-react'
import { resetPassword } from '../features/auth/authSlice'
import Spinner from '../components/common/Spinner'
import toast from 'react-hot-toast'

const ResetPasswordPage = () => {
  const dispatch    = useDispatch()
  const navigate    = useNavigate()
  const { loading } = useSelector((s) => s.auth)
  const location    = useLocation()
  const email       = location.state?.email || ''
  const [showPwd, setShowPwd] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const pwd = watch('newPassword')

  const onSubmit = async ({ newPassword }) => {
    const result = await dispatch(resetPassword({ email, newPassword }))
    if (resetPassword.fulfilled.match(result)) {
      toast.success('Password reset! Please log in.')
      navigate('/login')
    } else {
      toast.error(result.payload || 'Reset failed')
    }
  }

  return (
    <div>
      <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mb-5">
        <KeyRound size={22} className="text-primary-600 dark:text-primary-400" />
      </div>
      <h2 className="font-display text-2xl font-bold text-surface-800 dark:text-white mb-1">
        Reset password
      </h2>
      <p className="text-sm text-surface-500 dark:text-surface-400 mb-8">
        Choose a new password for your account.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="label">New password</label>
          <div className="relative">
            <input
              type={showPwd ? 'text' : 'password'}
              placeholder="Min 6 characters"
              className={`input pr-10 ${errors.newPassword ? 'input-error' : ''}`}
              {...register('newPassword', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
            />
            <button type="button" onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400">
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.newPassword && <p className="error-text">{errors.newPassword.message}</p>}
        </div>
        <div>
          <label className="label">Confirm new password</label>
          <input
            type="password"
            placeholder="••••••••"
            className={`input ${errors.confirm ? 'input-error' : ''}`}
            {...register('confirm', {
              required: 'Please confirm',
              validate: (v) => v === pwd || 'Passwords do not match',
            })}
          />
          {errors.confirm && <p className="error-text">{errors.confirm.message}</p>}
        </div>
        <button type="submit" disabled={loading} className="btn-primary btn w-full btn-lg">
          {loading ? <Spinner size="sm" /> : 'Reset Password'}
        </button>
      </form>
    </div>
  )
}

export default ResetPasswordPage
