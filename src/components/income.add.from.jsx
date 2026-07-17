import { X } from 'lucide-react'

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

export const IncomeAddForm = () => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 dark:text-white rounded-lg shadow-lg p-6 w-11/12 sm:w-3/4 lg:w-1/2 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add Income</h2>

          <button className="text-gray-500 hover:text-gray-800 dark:hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Form */}

        <form className="space-y-4">
          {/* Category */}

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>

            <select className="w-full border dark:bg-slate-700 rounded-lg p-2 focus:ring-2 focus:ring-green-600 focus:outline-none">
              <option>Select Category</option>

              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Amount */}

          <div>
            <label className="block text-sm font-medium mb-1">Amount</label>

            <input
              type="number"
              placeholder="Enter amount"
              className="w-full dark:bg-slate-700 border rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          {/* Description */}

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>

            <textarea
              placeholder="Enter description"
              className="w-full dark:bg-slate-700 border rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          {/* Date and Time */}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>

              <input
                type="date"
                className="w-full dark:bg-slate-700 border rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Time</label>

              <input
                type="time"
                className="w-full dark:bg-slate-700 border rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>
          </div>

          {/* ID */}

          <div>
            <label className="block text-sm font-medium mb-1">ID</label>

            <input
              type="text"
              value="INC-123456"
              readOnly
              className="w-full border rounded-lg p-2 bg-gray-100 dark:bg-slate-600"
            />

            <p className="text-xs text-gray-500 mt-1">Auto-generated ID</p>
          </div>

          {/* Buttons */}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
            >
              Cancel
            </button>

            <button
              type="button"
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
