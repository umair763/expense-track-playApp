import { useState } from 'react'
import { X, Plus } from 'lucide-react'
import { useAuth } from '../common/use.auth.jsx'
import { createExpense } from '../firebase/firestore.service.js'
import { toast } from 'react-toastify'

const categories = {
  Housing: [
    'Rent or Mortgage',
    'Property Taxes',
    'Homeowners Insurance',
    'Renters Insurance',
    'Utilities',
    'Home Maintenance and Repairs',
  ],
  Transportation: [
    'Vehicle Payments',
    'Fuel',
    'Vehicle Insurance',
    'Public Transportation',
    'Vehicle Maintenance and Repairs',
    'Parking Fees',
  ],
  Food: ['Groceries', 'Dining Out'],
  Healthcare: [
    'Health Insurance Premiums',
    'Doctor Visits and Medical Tests',
    'Prescription Medications',
    'Dental Care',
    'Vision Care',
  ],
  PersonalCare: [
    'Haircuts and Styling',
    'Personal Care Products',
    'Clothing and Footwear',
  ],
  Entertainment: [
    'Streaming Services',
    'Cable or Satellite TV',
    'Hobbies and Interests',
    'Movies and Theater',
  ],
  Education: ['Tuition Fees', 'Books and Supplies', 'Student Loans'],
  FinancialObligations: [
    'Credit Card Payments',
    'Loans',
    'Savings',
    'Retirement Savings',
  ],
  Taxes: ['Income Taxes', 'Property Taxes', 'Sales Tax'],
}

const ExpenseFormModal = ({ onClose, onSuccess }) => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    category: '',
    item: '',
    amount: '',
    expenseDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      setError('You must be logged in to add expenses')
      return
    }

    if (!formData.category || !formData.item || !formData.amount) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)
    setError('')

    const expenseData = {
      title: formData.item,
      description: `${formData.category} - ${formData.item}`,
      amount: formData.amount,
      currency: user.currency || 'PKR',
      category: {
        id: formData.category.toLowerCase().replace(/\s+/g, '_'),
        name: formData.category,
      },
      paymentMethod: formData.paymentMethod,
      expenseDate: new Date(formData.expenseDate),
    }

    const result = await createExpense(user.id, expenseData)

    setLoading(false)

    if (result.success) {
      onSuccess()
      onClose()
    } else {
      setError(result.error || 'Failed to create expense')
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999]">
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
      />

      <div
        className="relative w-11/12 max-w-md p-8 rounded-2xl shadow-2xl
        bg-white/90
        border border-gray-200
        text-gray-800 backdrop-blur-md"
      >
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>

        <div className="relative">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
              Add Expense
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
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

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="block text-sm font-medium">Category</label>
              <select 
                className="w-full border border-gray-300 bg-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value, item: '' })}
              >
                <option value="">Select Category</option>
                {Object.keys(categories).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium">Item</label>
              <select 
                className="w-full border border-gray-300 bg-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.item}
                onChange={(e) => setFormData({ ...formData, item: e.target.value })}
                disabled={!formData.category}
              >
                <option value="">Select Item</option>
                {formData.category && categories[formData.category]?.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium">Amount</label>
              <input
                type="number"
                placeholder="Enter amount"
                className="w-full border border-gray-300 bg-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium">Payment Method</label>
              <select 
                className="w-full border border-gray-300 bg-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              >
                <option value="cash">Cash</option>
                <option value="bank">Bank Transfer</option>
                <option value="card">Credit/Debit Card</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium">Recorded Date</label>
              <input
                type="date"
                className="w-full border border-gray-300 bg-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.expenseDate}
                onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg transition disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export const ExpenseAddForm = () => {
  const [isOpen, setIsOpen] = useState(false)

  const handleSuccess = () => {
    toast.success('Expense added successfully!')
    // Trigger a custom event to refresh the table
    window.dispatchEvent(new CustomEvent('expenseAdded'))
  }

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow hover:shadow-lg transition"
      >
        <Plus size={18} />
        Add Expense
      </button>

      {isOpen && <ExpenseFormModal onClose={() => setIsOpen(false)} onSuccess={handleSuccess} />}
    </div>
  )
}
