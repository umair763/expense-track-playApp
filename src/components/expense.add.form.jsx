import { useState, useEffect } from 'react'
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
  Work: [
    'Mobile Data Plan',
    'Internet for Work',
    'Software Subscriptions',
    'Cloud Services',
    'Domain and Hosting',
    'Developer Tools',
    'AI Tools',
    'Online Courses',
    'Books and Learning Materials',
    'Certifications',
    'Technical Communities',
    'Professional Memberships',
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

export const ExpenseAddForm = ({ open, onClose, onSuccess }) => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    category: '',
    item: '',
    amount: '',
    description: '',
    expenseDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash',
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setFormData({
        category: '',
        item: '',
        amount: '',
        description: '',
        expenseDate: new Date().toISOString().split('T')[0],
        paymentMethod: 'cash',
      })
      setErrors({})
    }
  }, [open])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      setErrors({ general: 'You must be logged in to add expenses' })
      return
    }

    const newErrors = {}
    if (!formData.category) newErrors.category = 'Category is required'
    if (!formData.item) newErrors.item = 'Item is required'
    if (!formData.amount) newErrors.amount = 'Amount is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    setErrors({})

    const expenseData = {
      title: formData.item,
      description:
        formData.description || `${formData.category} - ${formData.item}`,
      amount: Number(formData.amount),
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
      toast.success('Expense added successfully!')
    } else {
      setErrors({ general: result.error || 'Failed to create expense' })
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-[1050] p-4">
      <div className="bg-white rounded-xl overflow-hidden flex flex-col w-full max-w-[800px] max-h-[90vh] font-sans">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#4F30A9] rounded-t-xl flex-shrink-0">
          <h2 className="text-[15px] font-semibold text-white leading-[1.4] m-0">
            Add Expense
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center w-7 h-7 p-0 border-none bg-transparent text-white/85 cursor-pointer rounded-lg transition-all hover:bg-white/15 hover:text-white focus-visible:outline-2 focus-visible:outline-white/70 focus-visible:outline-offset-2"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              width="14"
              height="14"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 pb-2 overflow-y-auto flex-1">
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {errors.general && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
                {errors.general}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[13.5px] font-medium text-[#09090B] leading-none">
                  Category
                </label>
                <div className="w-full">
                  <select
                    className="w-full min-h-[44px] px-[14px] text-sm font-sans text-[#2A3547] bg-white border border-[#E4E7EC] rounded-lg outline-none cursor-pointer transition-all focus:border-[#3B82F6] appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20width%3D%2716%27%20height%3D%2716%27%20viewBox%3D%270%200%2024%2024%27%20fill%3D%27none%27%20stroke%3D%27%236B7280%27%20stroke-width%3D%272%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%3E%3Cpolyline%20points%3D%276%209%2012%2015%2018%209%27/%3E%3C/svg%3E')] bg-no-repeat bg-[right_12px_center] pr-9"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value,
                        item: '',
                      })
                    }
                  >
                    <option value="">Select Category</option>
                    {Object.keys(categories).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.category && (
                  <span className="text-xs text-red-500 mt-[-4px]">
                    {errors.category}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[13.5px] font-medium text-[#09090B] leading-none">
                  Item
                </label>
                <div className="w-full">
                  <select
                    className={`w-full min-h-[44px] px-[14px] text-sm font-sans text-[#2A3547] bg-white border rounded-lg outline-none cursor-pointer transition-all appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20width%3D%2716%27%20height%3D%2716%27%20viewBox%3D%270%200%2024%2024%27%20fill%3D%27none%27%20stroke%3D%27%236B7280%27%20stroke-width%3D%272%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%3E%3Cpolyline%20points%3D%276%209%2012%2015%2018%209%27/%3E%3C/svg%3E')] bg-no-repeat bg-[right_12px_center] pr-9 ${errors.item ? 'border-red-500' : 'border-[#E4E7EC] focus:border-[#3B82F6]'}`}
                    value={formData.item}
                    onChange={(e) =>
                      setFormData({ ...formData, item: e.target.value })
                    }
                    disabled={!formData.category}
                  >
                    <option value="">Select Item</option>
                    {formData.category &&
                      categories[formData.category]?.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                  </select>
                </div>
                {errors.item && (
                  <span className="text-xs text-red-500 mt-[-4px]">
                    {errors.item}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[13.5px] font-medium text-[#09090B] leading-none">
                Amount
              </label>
              <input
                type="number"
                placeholder="Enter amount"
                className={`w-full border rounded-lg px-[14px] py-[10px] text-sm font-sans text-[#2A3547] bg-white outline-none transition-all focus:border-[#3B82F6] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] ${errors.amount ? 'border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]' : 'border-[#e2e8f0]'}`}
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
              />
              {errors.amount && (
                <span className="text-xs text-red-500 mt-[-4px]">
                  {errors.amount}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[13.5px] font-medium text-[#09090B] leading-none">
                Description
              </label>
              <textarea
                placeholder="Enter description (optional)"
                rows="2"
                className="w-full border border-[#e2e8f0] rounded-lg px-[14px] py-[10px] text-sm font-sans text-[#2A3547] bg-white outline-none transition-all focus:border-[#3B82F6] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] resize-vertical min-h-[64px]"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[13.5px] font-medium text-[#09090B] leading-none">
                  Recorded Date
                </label>
                <input
                  type="date"
                  className="w-full border border-[#e2e8f0] rounded-lg px-[14px] py-[10px] text-sm font-sans text-[#2A3547] bg-white outline-none transition-all focus:border-[#3B82F6] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
                  value={formData.expenseDate}
                  onChange={(e) =>
                    setFormData({ ...formData, expenseDate: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[13.5px] font-medium text-[#09090B] leading-none">
                  Payment Method
                </label>
                <div className="w-full">
                  <select
                    className="w-full min-h-[44px] px-[14px] text-sm font-sans text-[#2A3547] bg-white border border-[#E4E7EC] rounded-lg outline-none cursor-pointer transition-all focus:border-[#3B82F6] appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20width%3D%2716%27%20height%3D%2716%27%20viewBox%3D%270%200%2024%2024%27%20fill%3D%27none%27%20stroke%3D%27%236B7280%27%20stroke-width%3D%272%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%3E%3Cpolyline%20points%3D%276%209%2012%2015%2018%209%27/%3E%3C/svg%3E')] bg-no-repeat bg-[right_12px_center] pr-9"
                    value={formData.paymentMethod}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paymentMethod: e.target.value,
                      })
                    }
                  >
                    <option value="cash">Cash</option>
                    <option value="online">Online</option>
                    <option value="bank">Bank Transfer</option>
                    <option value="card">Credit/Debit Card</option>
                  </select>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#E4E7EC] mx-6 flex-shrink-0"></div>

        {/* Footer */}
        <div className="px-6 py-4 flex justify-end gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center h-10 min-w-[90px] px-5 rounded-lg font-sans text-sm font-medium text-[#344054] border border-[#D0D5DD] bg-white cursor-pointer transition-all hover:bg-[#F9FAFB]"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="inline-flex items-center justify-center h-10 min-w-[90px] px-5 rounded-lg font-sans text-sm font-medium text-white border-none bg-[#4F30A9] cursor-pointer transition-all hover:bg-[#4F30A9]/90 disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  )
}
