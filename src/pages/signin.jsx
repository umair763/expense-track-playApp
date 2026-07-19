import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../common'

export const Signin = () => {
  const navigate = useNavigate()
  const { signin, signInWithGoogle, loading } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Email and password are required')
      return
    }
    setError('')
    setSubmitting(true)

    const result = await signin(form)

    if (result.success) {
      navigate('/dashboard', { replace: true })
    } else {
      setError(result.error || 'Failed to sign in')
    }

    setSubmitting(false)
  }

  const handleGoogleSignIn = async () => {
    setError('')
    setSubmitting(true)

    const result = await signInWithGoogle()

    if (result.success) {
      navigate('/dashboard', { replace: true })
    } else {
      setError(result.error || 'Failed to sign in with Google')
    }

    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b bg-cover bg-center px-4 py-6">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative px-4"
      style={{ backgroundImage: "url('/images/loginBG-2.jpg')" }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />

      {/* Login Card */}
      <div className="relative w-full max-w-md rounded-3xl bg-white/15 backdrop-blur-xl border border-white/20 shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8"
              fill="#4F30A9"
              viewBox="0 0 24 24"
            >
              <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5z" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-white mt-5">Welcome Back</h1>

          <p className="text-white/70 mt-2">Sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange('email')}
              className="w-full rounded-xl border border-white/30 bg-white px-4 py-3 text-gray-800 placeholder-gray-500 outline-none transition focus:border-[#4F30A9] focus:ring-4 focus:ring-[#4F30A9]/20"
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={form.password}
              onChange={handleChange('password')}
              className="w-full rounded-xl border border-white/30 bg-white px-4 py-3 pr-12 text-gray-800 placeholder-gray-500 outline-none transition-all duration-300 focus:border-[#4F30A9] focus:ring-4 focus:ring-[#4F30A9]/20"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 cursor-pointer right-4 flex items-center text-gray-500 transition-colors duration-300 hover:text-[#4F30A9]"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>

          {error && (
            <div className="rounded-xl bg-red-500/20 border border-red-400/30 px-4 py-3 text-sm text-red-100">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-[#4F30A9] cursor-pointer py-3 font-semibold text-white shadow-lg transition hover:bg-[#3d01d2] disabled:opacity-60"
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="h-px flex-1 bg-white/20"></div>

          <span className="px-4 text-sm text-white/80">OR CONTINUE WITH</span>

          <div className="h-px flex-1 bg-white/20"></div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={submitting}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-white py-3 font-semibold text-[#4F30A9] shadow-lg transition hover:bg-gray-100 disabled:opacity-60"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>

          {submitting ? 'Signing in...' : 'Sign in with Google'}
        </button>

        <p className="mt-8 text-center text-white/80">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="font-semibold text-white underline decoration-[#4F30A9] underline-offset-4 hover:text-[#d8ccff]"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}
