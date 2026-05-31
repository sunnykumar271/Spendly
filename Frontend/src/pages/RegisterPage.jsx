// src/pages/RegisterPage.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, UserPlus } from 'lucide-react'
import { registerUser } from '../features/auth/authSlice'
import Spinner from '../components/common/Spinner'
import toast from 'react-hot-toast'

const RegisterPage = () => {
  const dispatch    = useDispatch()
  const navigate    = useNavigate()
  const { loading } = useSelector((s) => s.auth)
  const [showPwd, setShowPwd] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const pwd = watch('password')

  const onSubmit = async (data) => {
    const { confirmPassword, ...rest } = data
    const result = await dispatch(registerUser(rest))
    if (registerUser.fulfilled.match(result)) {
      toast.success('Account created! Welcome 🎉')
      navigate('/dashboard')
    } else {
      console.error('Registration failed:', result)         // <--- add this
      toast.error(result.payload || 'Registration failed')
    }
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-surface-800 dark:text-white mb-1">
        Create account
      </h2>
      <p className="text-sm text-surface-500 dark:text-surface-400 mb-8">
        Start tracking your expenses today
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="label">Full name</label>
          <input
            type="text"
            placeholder="Raj Patel"
            className={`input ${errors.name ? 'input-error' : ''}`}
            {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Too short' } })}
          />
          {errors.name && <p className="error-text">{errors.name.message}</p>}
        </div>

        {/* Email */}
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

        {/* Password */}
        <div>
          <label className="label">Password</label>
          <div className="relative">
            <input
              type={showPwd ? 'text' : 'password'}
              placeholder="Min 6 characters"
              className={`input pr-10 ${errors.password ? 'input-error' : ''}`}
              {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
            />
            <button type="button" onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600">
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="error-text">{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="label">Confirm password</label>
          <input
            type="password"
            placeholder="••••••••"
            className={`input ${errors.confirmPassword ? 'input-error' : ''}`}
            {...register('confirmPassword', {
              required: 'Please confirm password',
              validate: (val) => val === pwd || 'Passwords do not match',
            })}
          />
          {errors.confirmPassword && <p className="error-text">{errors.confirmPassword.message}</p>}
        </div>

        <button type="submit" disabled={loading} className="btn-primary btn w-full btn-lg mt-2">
          {loading ? <Spinner size="sm" /> : <><UserPlus size={17} /> Create Account</>}
        </button>
      </form>

      <p className="text-center text-sm text-surface-500 dark:text-surface-400 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-primary-600 font-medium hover:text-primary-700">Sign in</Link>
      </p>
    </div>
  )
}

export default RegisterPage
