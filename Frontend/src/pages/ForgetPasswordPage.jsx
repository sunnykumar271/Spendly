// src/pages/ForgotPasswordPage.jsx
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { Mail, ArrowLeft } from 'lucide-react'
import { forgotPassword } from '../features/auth/authSlice'
import Spinner from '../components/common/Spinner'
import toast from 'react-hot-toast'

const ForgotPasswordPage = () => {
  const dispatch    = useDispatch()
  const navigate    = useNavigate()
  const { loading } = useSelector((s) => s.auth)

  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async ({ email }) => {
    const result = await dispatch(forgotPassword(email))
    if (forgotPassword.fulfilled.match(result)) {
      toast.success('OTP sent! Check your inbox.')
      // Pass email to verify-otp page via state
      navigate('/verify-otp', { state: { email } })
    } else {
      toast.error(result.payload || 'Failed to send OTP or server error occurred. Please try again.')
    }
  }

  return (
    <div>
      <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 mb-6">
        <ArrowLeft size={15} /> Back to login
      </Link>

      <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mb-5">
        <Mail size={22} className="text-primary-600 dark:text-primary-400" />
      </div>

      <h2 className="font-display text-2xl font-bold text-surface-800 dark:text-white mb-1">
        Forgot password?
      </h2>
      <p className="text-sm text-surface-500 dark:text-surface-400 mb-8">
        Enter your email and we'll send a 6-digit OTP to reset your password.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="label">Email address</label>
          <input
            type="email"
            placeholder="you@example.com"
            className={`input ${errors.email ? 'input-error' : ''}`}
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' },
            })}
          />
          {errors.email && <p className="error-text">{errors.email.message}</p>}
        </div>
        <button type="submit" disabled={loading} className="btn-primary btn w-full btn-lg">
          {loading ? <Spinner size="sm" /> : 'Send OTP'}
        </button>
      </form>
    </div>
  )
}

export default ForgotPasswordPage
