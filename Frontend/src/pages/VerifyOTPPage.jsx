// src/pages/VerifyOTPPage.jsx
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { ShieldCheck, ArrowLeft } from 'lucide-react'
import { verifyOTP } from '../features/auth/authSlice'
import Spinner from '../components/common/Spinner'
import toast from 'react-hot-toast'

const VerifyOTPPage = () => {
  const dispatch    = useDispatch()
  const navigate    = useNavigate()
  const { loading } = useSelector((s) => s.auth)
  const location    = useLocation()
  // Email was passed from ForgotPasswordPage via router state
  const email       = location.state?.email || ''

  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async ({ otp }) => {
    const result = await dispatch(verifyOTP({ email, otp }))
    if (verifyOTP.fulfilled.match(result)) {
      toast.success('OTP verified!')
      navigate('/reset-password', { state: { email } })
    } else {
      toast.error(result.payload || 'Invalid OTP')
    }
  }

  // If no email in state (user navigated here directly), redirect back
  if (!email) {
    return (
      <div className="text-center">
        <p className="text-surface-600 dark:text-surface-400 mb-4">No email found. Please start again.</p>
        <Link to="/forgot-password" className="btn-primary btn">Go back</Link>
      </div>
    )
  }

  return (
    <div>
      <Link to="/forgot-password" className="inline-flex items-center gap-1.5 text-sm text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 mb-6">
        <ArrowLeft size={15} /> Back
      </Link>

      <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mb-5">
        <ShieldCheck size={22} className="text-emerald-500" />
      </div>

      <h2 className="font-display text-2xl font-bold text-surface-800 dark:text-white mb-1">
        Enter OTP
      </h2>
      <p className="text-sm text-surface-500 dark:text-surface-400 mb-2">
        We sent a 6-digit code to
      </p>
      <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 mb-8">{email}</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="label">6-digit OTP</label>
          <input
            type="text"
            placeholder="482910"
            maxLength={6}
            className={`input text-center text-xl tracking-[0.4em] font-mono ${errors.otp ? 'input-error' : ''}`}
            {...register('otp', {
              required: 'OTP is required',
              minLength: { value: 6, message: 'OTP must be 6 digits' },
              maxLength: { value: 6, message: 'OTP must be 6 digits' },
              pattern:   { value: /^\d{6}$/, message: 'OTP must be numeric' },
            })}
          />
          {errors.otp && <p className="error-text">{errors.otp.message}</p>}
          <p className="text-xs text-surface-400 mt-2">OTP is valid for 10 minutes</p>
        </div>
        <button type="submit" disabled={loading} className="btn-primary btn w-full btn-lg">
          {loading ? <Spinner size="sm" /> : 'Verify OTP'}
        </button>
      </form>
    </div>
  )
}

export default VerifyOTPPage
