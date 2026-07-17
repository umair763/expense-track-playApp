import { Search, RefreshCw, Pencil, Trash2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '../common/use.auth.jsx'
import { getExpenses, deleteExpense } from '../firebase/firestore.service.js'

export const ExpensesTable = () => {
  const { user } = useAuth()
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchExpenses()
  }, [user])

  useEffect(() => {
    const handleExpenseAdded = () => {
      fetchExpenses()
    }
    window.addEventListener('expenseAdded', handleExpenseAdded)
    return () => window.removeEventListener('expenseAdded', handleExpenseAdded)
  }, [])

  const fetchExpenses = async () => {
    if (!user) {
      setExpenses([])
      setLoading(false)
      return
    }

    setLoading(true)
    const result = await getExpenses(user.id)
    
    if (result.success) {
      setExpenses(result.data)
    } else {
      console.error('Failed to fetch expenses:', result.error)
    }
    
    setLoading(false)
  }

  const handleDelete = async (expenseId) => {
    if (!confirm('Are you sure you want to delete this expense?')) return
    
    const result = await deleteExpense(expenseId)
    if (result.success) {
      fetchExpenses()
    } else {
      alert('Failed to delete expense: ' + result.error)
    }
  }

  const filteredExpenses = expenses.filter(expense =>
    expense.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    expense.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    expense.category?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="w-full p-5 bg-white text-gray-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-500 to-blue-600 bg-clip-text text-transparent">
            Expense Records
          </h1>

          <p className="text-gray-600 text-sm mt-1">
            {loading ? 'Loading...' : `${filteredExpenses.length} records found`}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-grow sm:w-64">
            <input
              type="text"
              placeholder="Search expenses..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>
        </div>
      </div>

      {/* Expenses Table */}

      <div className="overflow-hidden rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs uppercase text-gray-500">
                  Item
                </th>

                <th className="px-6 py-4 text-left text-xs uppercase text-gray-500">
                  Category
                </th>

                <th className="px-6 py-4 text-left text-xs uppercase text-gray-500">
                  Amount
                </th>

                <th className="px-6 py-4 text-left text-xs uppercase text-gray-500">
                  Date
                </th>

                <th className="px-6 py-4 text-right text-xs uppercase text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    Loading expenses...
                  </td>
                </tr>
              ) : filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No expenses found
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((expense) => (
                  <tr
                    key={expense.id}
                    className="hover:bg-blue-50 transition"
                  >
                    <td className="px-6 py-4 text-sm font-medium">
                      {expense.title}
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                        {expense.category?.name || 'Other'}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-semibold">
                      {expense.currency || 'PKR'} {expense.amount?.toFixed(2) || '0.00'}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500">
                      {expense.expenseDate ? new Date(expense.expenseDate.seconds ? expense.expenseDate.seconds * 1000 : expense.expenseDate).toLocaleDateString() : 'N/A'}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                          <Pencil size={18} />
                        </button>

                        <button 
                          className="p-2 rounded-lg bg-red-50 text-red-600"
                          onClick={() => handleDelete(expense.id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination UI */}

      <div className="mt-6 flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Showing {filteredExpenses.length > 0 ? 1 : 0} to {filteredExpenses.length} of {filteredExpenses.length} entries
        </p>

        <div className="flex gap-2">
          <button className="px-3 py-2 rounded bg-white border border-gray-300">
            Previous
          </button>

          <button className="px-4 py-2 rounded bg-blue-600 text-white">
            1
          </button>

          <button className="px-3 py-2 rounded bg-white border border-gray-300">
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
