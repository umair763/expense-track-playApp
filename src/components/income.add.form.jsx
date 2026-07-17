import { useState } from 'react'
import { X, Plus } from 'lucide-react'
import { useAuth } from '../common/use.auth.jsx'
import { createIncome } from '../firebase/firestore.service.js'
import { toast } from 'react-toastify'

const categories = [
  'Salary',
  'Freelance',
  'Business',
  'Investments',
  'Dividends',
  'Rental',
  'YouTube',
  'Trading',
  'Interest',
  'Royalties',
  'Commission',
  'Consulting',
  'Gifts',
  'Others',
]

const IncomeFormModal = ({ onClose, onSuccess }) => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    description: '',
    incomeDate: new Date().toISOString().split('T')[0],
    incomeTime: new Date().toTimeString().slice(0, 5),
    paymentMethod: 'bank',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      setError('You must be logged in to add income')
      return
    }

    if (!formData.category || !formData.amount) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)
    setError('')

    const incomeData = {
      title: formData.category,
      description: formData.description || formData.category,
      amount: formData.amount,
      currency: user.currency || 'PKR',
      source: {
        id: formData.category.toLowerCase().replace(/\s+/g, '_'),
        name: formData.category,
      },
      paymentMethod: formData.paymentMethod,
      incomeDate: new Date(`${formData.incomeDate}T${formData.incomeTime}`),
    }

    const result = await createIncome(user.id, incomeData)

    setLoading(false)

    if (result.success) {
      onSuccess()
      onClose()
    } else {
      setError(result.error || 'Failed to create income')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white text-gray-900 rounded-lg shadow-lg p-6 w-11/12 sm:w-3/4 lg:w-1/2 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add Income</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select 
              className="w-full border border-gray-300 bg-white rounded-lg p-2 focus:ring-2 focus:ring-green-600 focus:outline-none"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Amount</label>
            <input
              type="number"
              placeholder="Enter amount"
              className="w-full border border-gray-300 bg-white rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              placeholder="Enter description"
              className="w-full border border-gray-300 bg-white rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                className="w-full border border-gray-300 bg-white rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                value={formData.incomeDate}
                onChange={(e) => setFormData({ ...formData, incomeDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Time</label>
              <input
                type="time"
                className="w-full border border-gray-300 bg-white rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                value={formData.incomeTime}
                onChange={(e) => setFormData({ ...formData, incomeTime: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Payment Method</label>
            <select 
              className="w-full border border-gray-300 bg-white rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
            >
              <option value="bank">Bank Transfer</option>
              <option value="cash">Cash</option>
              <option value="card">Credit/Debit Card</option>
            </select>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export const IncomeAddForm = () => {
  const [isOpen, setIsOpen] = useState(false)

  const handleSuccess = () => {
    toast.success('Income added successfully!')
    // Trigger a custom event to refresh the table
    window.dispatchEvent(new CustomEvent('incomeAdded'))
  }

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold shadow transition"
      >
        <Plus size={18} />
        Add Income
      </button>

      {isOpen && <IncomeFormModal onClose={() => setIsOpen(false)} onSuccess={handleSuccess} />}
    </div>
  )
}
