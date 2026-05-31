// src/pages/LoginPage.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import { loginUser } from '../features/auth/authSlice'
import Spinner from '../components/common/Spinner'
import toast from 'react-hot-toast'

const LoginPage = () => {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const { loading } = useSelector((s) => s.auth)
  const [showPwd, setShowPwd] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    const result = await dispatch(loginUser(data))
    if (loginUser.fulfilled.match(result)) {
      toast.success('Welcome back! 👋')
      navigate('/dashboard')
    } else {
      toast.error(result.payload || 'Login failed')
    }
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-surface-800 dark:text-white mb-1">
        Welcome back
      </h2>
      <p className="text-sm text-surface-500 dark:text-surface-400 mb-8">
        Sign in to your Spendly account
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              placeholder="••••••••"
              className={`input pr-10 ${errors.password ? 'input-error' : ''}`}
              {...register('password', { required: 'Password is required' })}
            />
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
            >
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="error-text">{errors.password.message}</p>}
        </div>

        {/* Forgot password link */}
        <div className="text-right">
          <Link to="/forgot-password" className="text-xs text-primary-600 hover:text-primary-700 font-medium">
            Forgot password?
          </Link>
        </div>

        {/* Submit */}
        <button type="submit" disabled={loading} className="btn-primary btn w-full btn-lg">
          {loading ? <Spinner size="sm" /> : <><LogIn size={17} /> Sign In</>}
        </button>
      </form>

      <p className="text-center text-sm text-surface-500 dark:text-surface-400 mt-6">
        Don't have an account?{' '}
        <Link to="/register" className="text-primary-600 font-medium hover:text-primary-700">
          Sign up
        </Link>
      </p>
    </div>
  )
}

export default LoginPage
