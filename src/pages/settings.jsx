import { useState, useEffect, useRef } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from '../common/use.auth.jsx'
import { ShieldCheck, Moon, Bell, Download, Camera } from 'lucide-react'

export const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile')

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'options', label: 'Options' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage your account preferences and settings
        </p>
      </div>

      <div className="border-b border-gray-200">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative pb-3 text-sm font-semibold transition-colors cursor-pointer
                ${
                  activeTab === tab.id
                    ? 'text-[#4F30A9]'
                    : 'text-gray-500 hover:text-gray-900'
                }
              `}
            >
              {tab.label}

              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-[#4F30A9]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'profile' ? <ProfileSection /> : <OptionsSection />}
    </div>
  )
}

const ProfileSection = () => {
  const { user, updateProfile } = useAuth()
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    phoneNumber: '',
    country: '',
    currency: '',
    timezone: '',
    language: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const fileInputRef = useRef(null)

  const formatDate = (dateValue) => {
    if (!dateValue) return ''
    try {
      const date = dateValue.toDate ? dateValue.toDate() : new Date(dateValue)
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    } catch (error) {
      console.error('Error formatting date:', error)
      return ''
    }
  }

  useEffect(() => {
    if (user) {
      setFormData({
        userName: user.userName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        country: user.country || '',
        currency: user.currency || 'PKR',
        timezone:
          user.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: user.language || 'en',
      })
      setImagePreview(user?.photoURL || '')
    }
  }, [user])

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file')
        return
      }
      // Validate file size (max 2MB for base64)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size must be less than 2MB')
        return
      }

      // Convert to base64
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result
        setImageFile(base64String)
        setImagePreview(base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    // Validation
    const newErrors = {}

    if (!formData.userName.trim()) {
      newErrors.userName = 'Full name is required'
    } else if (formData.userName.length < 2) {
      newErrors.userName = 'Full name must be at least 2 characters'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (
      formData.phoneNumber &&
      !/^\+?[\d\s-]{10,}$/.test(formData.phoneNumber)
    ) {
      newErrors.phoneNumber = 'Invalid phone number format'
    }

    if (!formData.country.trim()) {
      newErrors.country = 'Country is required'
    }

    if (!formData.currency.trim()) {
      newErrors.currency = 'Currency is required'
    } else if (formData.currency.length !== 3) {
      newErrors.currency = 'Currency must be 3 characters (e.g., PKR, USD)'
    }

    if (!formData.timezone.trim()) {
      newErrors.timezone = 'Timezone is required'
    }

    if (!formData.language.trim()) {
      newErrors.language = 'Language is required'
    } else if (formData.language.length !== 2) {
      newErrors.language = 'Language must be 2 characters (e.g., en, ur)'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      toast.error('Please fix the validation errors')
      return
    }

    setErrors({})
    setLoading(true)
    let photoURL = user?.photoURL || ''

    // Use base64 image if a new one was selected
    if (imageFile) {
      photoURL = imageFile
    }

    const result = await updateProfile({
      ...formData,
      photoURL,
    })
    setLoading(false)

    if (result.success) {
      toast.success('Profile updated successfully!')
      setImageFile(null)
    } else {
      toast.error('Failed to update profile: ' + result.error)
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-5">
        <div className="relative">
          <img
            src={
              imagePreview ||
              user?.photoURL ||
              'https://i.pravatar.cc/150?img=12'
            }
            alt="User"
            className="h-24 w-24 rounded-full object-cover ring-4 ring-purple-100 cursor-pointer"
            onClick={handleImageClick}
          />

          <button
            type="button"
            onClick={handleImageClick}
            className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#4F30A9] text-white shadow cursor-pointer"
          >
            <Camera size={15} />
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {user?.userName || 'User'}
          </h2>

          <p className="text-sm text-gray-500">
            {user?.createdAt
              ? `Joined ${formatDate(user.createdAt)}`
              : 'Active User'}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <InputField
          label="Full Name"
          value={formData.userName}
          onChange={(e) =>
            setFormData({ ...formData, userName: e.target.value })
          }
          error={errors.userName}
        />

        <InputField
          label="Email Address"
          value={formData.email}
          disabled
          error={errors.email}
        />

        <InputField
          label="Phone"
          value={formData.phoneNumber}
          onChange={(e) =>
            setFormData({ ...formData, phoneNumber: e.target.value })
          }
          error={errors.phoneNumber}
        />

        <InputField
          label="Country"
          value={formData.country}
          onChange={(e) =>
            setFormData({ ...formData, country: e.target.value })
          }
          error={errors.country}
        />

        <InputField
          label="Currency"
          value={formData.currency}
          onChange={(e) =>
            setFormData({ ...formData, currency: e.target.value })
          }
          error={errors.currency}
        />

        <InputField
          label="Timezone"
          value={formData.timezone}
          onChange={(e) =>
            setFormData({ ...formData, timezone: e.target.value })
          }
          error={errors.timezone}
        />

        <InputField
          label="Language"
          value={formData.language}
          onChange={(e) =>
            setFormData({ ...formData, language: e.target.value })
          }
          error={errors.language}
        />
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={loading}
        className="
          mt-6 rounded-lg bg-[#4F30A9] cursor-pointer
          px-5 py-2.5
          text-sm font-semibold text-white
          transition hover:bg-[#3F02D4]
          disabled:opacity-70 disabled:cursor-not-allowed
        "
      >
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  )
}

const OptionsSection = () => {
  const options = [
    {
      icon: ShieldCheck,
      title: 'Two Factor Authentication',
      description: 'Add extra security to your account',
    },
    {
      icon: Moon,
      title: 'Dark Theme',
      description: 'Switch between light and dark mode',
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Manage your notification preferences',
    },
    {
      icon: Download,
      title: 'Data Export',
      description: 'Download your account data',
    },
  ]

  return (
    <div className="space-y-4">
      {options.map(({ icon: Icon, title, description }) => (
        <div
          key={title}
          className="
              flex items-center justify-between
              rounded-xl border border-gray-200
              bg-white p-5 shadow-sm
              transition hover:border-purple-200
            "
        >
          <div className="flex items-center gap-4">
            <div
              className="
                  flex h-10 w-10 items-center justify-center
                  rounded-lg bg-purple-50 text-[#4F30A9]
                "
            >
              <Icon size={20} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900">{title}</h3>

              <p className="text-sm text-gray-500">{description}</p>
            </div>
          </div>

          <button
            type="button"
            className="
                rounded-lg border border-gray-300
                px-4 py-2
                text-sm font-medium text-gray-700
                transition hover:bg-gray-50
              "
          >
            Manage
          </button>
        </div>
      ))}
    </div>
  )
}

const InputField = ({ label, value, onChange, disabled = false, error }) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`
          w-full rounded-lg border px-3 py-2.5 text-sm
          outline-none transition
          focus:border-[#4F30A9]
          focus:ring-2 focus:ring-[#4F30A9]/20
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300'}
        `}
      />

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}
