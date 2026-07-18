import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../common'

const ProfileImageUploader = ({ preview, onChange }) => {
  return (
    <div className="flex flex-col items-center justify-center mb-4">
      <div className="relative">
        <img
          src={preview || '/images/profile1.webp'}
          alt="Default Profile"
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-yellow-400"
        />

        <label
          htmlFor="file-input"
          className="absolute bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full border-yellow-400 flex items-center justify-center shadow-lg cursor-pointer hover:bg-gray-600 overflow-hidden"
        >
          <img
            src="/images/camera1.jpeg"
            alt="Upload Icon"
            className="w-full h-full object-cover rounded-full"
          />
        </label>

        <input
          type="file"
          id="file-input"
          accept="image/*"
          onChange={onChange}
          className="hidden"
        />
      </div>
    </div>
  )
}

export const Signup = () => {
  const navigate = useNavigate()
  const { signup, signInWithGoogle, loading } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleImage = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) {
      setError('All fields are required')
      return
    }
    setError('')
    setSubmitting(true)

    const result = await signup(form)
    
    if (result.success) {
      navigate('/dashboard', { replace: true })
    } else {
      setError(result.error || 'Failed to create account')
    }
    
    setSubmitting(false)
  }

  const handleGoogleSignUp = async () => {
    setError('')
    setSubmitting(true)

    const result = await signInWithGoogle()
    
    if (result.success) {
      navigate('/dashboard', { replace: true })
    } else {
      setError(result.error || 'Failed to sign up with Google')
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
      className="flex items-center justify-center min-h-screen bg-gradient-to-b bg-cover bg-center px-4 py-6"
      style={{ backgroundImage: 'url(/images/loginBG-3.jpg)' }}
    >
      <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-6 sm:p-8 w-full max-w-md">
        <h2 className="text-white text-xl sm:text-2xl font-bold text-center mb-4">
          Registration
        </h2>

        <ProfileImageUploader preview={preview} onChange={handleImage} />

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={handleChange('name')}
            className="w-full py-2 px-4 bg-white/20 text-white placeholder-gray-300 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange('email')}
            className="w-full py-2 px-4 bg-white/20 text-white placeholder-gray-300 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange('password')}
            className="w-full py-2 px-4 bg-white/20 text-white placeholder-gray-300 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          {error && (
            <p className="text-sm text-red-300 bg-red-500/20 rounded px-2 py-1">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-300 transition-colors disabled:opacity-50"
            disabled={submitting}
          >
            {submitting ? 'Creating account...' : 'REGISTER'}
          </button>
        </form>

        <div className="w-full bg-white mt-6" style={{ height: '1px' }}></div>

        <div className="mt-2 mb-4 text-center text-white">Register As</div>

        <button
          onClick={handleGoogleSignUp}
          className="w-full py-2 bg-white hover:bg-gray-100 text-gray-800 font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-300 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          disabled={submitting}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
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
          {submitting ? 'Creating account...' : 'Sign up with Google'}
        </button>

        <p className="text-center text-gray-300 mt-6">
          Already have an account?{' '}
          <Link
            to="/signin"
            className="text-purple-400 hover:underline font-medium"
          >
            LOGIN
          </Link>
        </p>
      </div>
    </div>
  )
}
