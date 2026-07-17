import { Search, RefreshCw, Pencil, Trash2, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '../common/use.auth.jsx'
import { getIncome, deleteIncome } from '../firebase/firestore.service.js'

export const IncomeTable = () => {
  const { user } = useAuth()
  const [incomes, setIncomes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchIncome()
  }, [user])

  useEffect(() => {
    const handleIncomeAdded = () => {
      fetchIncome()
    }
    window.addEventListener('incomeAdded', handleIncomeAdded)
    return () => window.removeEventListener('incomeAdded', handleIncomeAdded)
  }, [])

  const fetchIncome = async () => {
    if (!user) {
      setIncomes([])
      setLoading(false)
      return
    }

    setLoading(true)
    console.log('Fetching income for user ID:', user.id)
    const result = await getIncome(user.id)

    console.log('Fetch result:', result)

    if (result.success) {
      console.log('Income data fetched:', result.data)
      setIncomes(result.data)
    } else {
      console.error('Failed to fetch income:', result.error)
    }

    setLoading(false)
  }

  const handleDelete = async (incomeId) => {
    if (!confirm('Are you sure you want to delete this income?')) return

    const result = await deleteIncome(incomeId)
    if (result.success) {
      fetchIncome()
    } else {
      alert('Failed to delete income: ' + result.error)
    }
  }

  const filteredIncomes = incomes.filter(
    (income) =>
      income.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      income.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      income.source?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="w-full min-h-screen p-5 bg-white text-gray-900">

      {/* Header */}

      <div
        className="
            flex
            flex-col
            sm:flex-row
            justify-between
            gap-4
            mb-6
         "
      >
        <div>
          <h1
            className="
                  text-3xl
                  font-bold
                  bg-gradient-to-r
                  from-green-500
                  to-teal-600
                  bg-clip-text
                  text-transparent
               "
          >
            Income Records
          </h1>

          <p
            className="
                  text-gray-500
                  mt-1
               "
          >
            {loading ? 'Loading...' : `${filteredIncomes.length} records found`}
          </p>
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-grow sm:w-64">
            <input
              placeholder="Search income..."
              className="
                        w-64
                        pl-10
                        pr-4
                        py-2
                        rounded-lg
                        border
                        border-gray-300
                        bg-white
                        outline-none
                        focus:ring-2
                        focus:ring-green-500
                     "
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <Search
              size={18}
              className="
                        absolute
                        left-3
                        top-3
                        text-gray-400
                     "
            />
          </div>
        </div>
      </div>

      {/* Table */}

      <div
        className="
            rounded-xl
            overflow-hidden
            border
            border-gray-200
            bg-white/50
         "
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead
              className="
                     bg-gray-50
                  "
            >
              <tr>
                <th className="px-6 py-4 text-left text-xs uppercase text-gray-500">
                  Description
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

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Loading income records...
                  </td>
                </tr>
              ) : filteredIncomes.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No income records found
                  </td>
                </tr>
              ) : (
                filteredIncomes.map((income) => (
                  <tr
                    key={income.id}
                    className="
                              border-t
                              border-gray-200
                              hover:bg-green-50
                           "
                  >
                    <td
                      className="
                              px-6
                              py-4
                              font-medium
                              text-gray-900
                           "
                    >
                      {income.title}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className="
                                 px-3
                                 py-1
                                 rounded-full
                                 text-xs
                                 bg-green-100
                                 text-green-700
                              "
                      >
                        {income.source?.name || 'Other'}
                      </span>
                    </td>

                    <td
                      className="
                              px-6
                              py-4
                              font-semibold
                              text-green-600
                           "
                    >
                      {income.currency || 'PKR'}{' '}
                      {income.amount?.toFixed(2) || '0.00'}
                    </td>

                    <td
                      className="
                              px-6
                              py-4
                              text-sm
                              text-gray-600
                           "
                    >
                      {income.incomeDate
                        ? new Date(
                            income.incomeDate.seconds
                              ? income.incomeDate.seconds * 1000
                              : income.incomeDate
                          ).toLocaleDateString()
                        : 'N/A'}
                      <br />
                      {income.incomeDate
                        ? new Date(
                            income.incomeDate.seconds
                              ? income.incomeDate.seconds * 1000
                              : income.incomeDate
                          ).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : ''}
                    </td>

                    <td className="px-6 py-4">
                      <div
                        className="
                                 flex
                                 justify-end
                                 gap-2
                              "
                      >
                        <button
                          className="
                                    p-2
                                    rounded-lg
                                    bg-green-100
                                    text-green-600
                                 "
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          className="
                                    p-2
                                    rounded-lg
                                    bg-red-100
                                    text-red-600
                                 "
                          onClick={() => handleDelete(income.id)}
                        >
                          <Trash2 size={17} />
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

      {/* Pagination */}

      <div
        className="
            mt-6
            flex
            justify-between
            items-center
         "
      >
        <p
          className="
               text-sm
               text-gray-500
            "
        >
          Showing {filteredIncomes.length > 0 ? 1 : 0} to{' '}
          {filteredIncomes.length} of {filteredIncomes.length} entries
        </p>

        <div className="flex gap-2">
          <button
            className="
                  px-4
                  py-2
                  rounded-lg
                  bg-green-600
                  text-white
               "
          >
            1
          </button>

          <button
            className="
                  px-4
                  py-2
                  rounded-lg
                  bg-white
                  border border-gray-300
                  text-gray-900
               "
          >
            2
          </button>
        </div>
      </div>
    </div>
  )
}
