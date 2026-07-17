import { PieChart, Pie, Cell } from 'recharts'
import { useState, useEffect } from 'react'
import { useAuth } from '../common/use.auth.jsx'
import { getExpenses } from '../firebase/firestore.service.js'

const COLORS = ['#ff6b6b', '#845ec2', '#ff9612', '#00c9a7', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9', '#6c5ce7']

export const ExpensePieChart = () => {
  const { user } = useAuth()
  const [categoryData, setCategoryData] = useState([])
  const [transactionData, setTransactionData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchExpenseData()
  }, [user])

  useEffect(() => {
    const handleExpenseAdded = () => {
      fetchExpenseData()
    }
    window.addEventListener('expenseAdded', handleExpenseAdded)
    return () => window.removeEventListener('expenseAdded', handleExpenseAdded)
  }, [])

  const fetchExpenseData = async () => {
    if (!user) {
      setCategoryData([])
      setTransactionData([])
      setLoading(false)
      return
    }

    setLoading(true)
    const result = await getExpenses(user.id)

    if (result.success) {
      const expenses = result.data

      // Calculate category totals
      const categoryTotals = {}
      const categoryCounts = {}

      expenses.forEach((expense) => {
        const categoryName = expense.category?.name || 'Other'
        const amount = parseFloat(expense.amount) || 0

        if (!categoryTotals[categoryName]) {
          categoryTotals[categoryName] = 0
          categoryCounts[categoryName] = 0
        }

        categoryTotals[categoryName] += amount
        categoryCounts[categoryName] += 1
      })

      // Convert to array format for chart
      const chartData = Object.keys(categoryTotals).map((name, index) => ({
        name,
        value: categoryTotals[name],
        color: COLORS[index % COLORS.length],
      }))

      // Convert to transaction data format
      const transactionList = Object.keys(categoryTotals).map((name, index) => ({
        label: name,
        value: `-${categoryTotals[name].toFixed(2)} ${expenses[0]?.currency || 'PKR'}`,
        count: `${categoryCounts[name]} transactions`,
        color: COLORS[index % COLORS.length],
      }))

      setCategoryData(chartData)
      setTransactionData(transactionList)
    }

    setLoading(false)
  }

  if (loading) {
    return (
      <div className="bg-white text-gray-900 p-3 sm:p-4 rounded-lg shadow-md w-full border border-gray-200">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-900">
          Categories
        </h2>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  if (categoryData.length === 0) {
    return (
      <div className="bg-white text-gray-900 p-3 sm:p-4 rounded-lg shadow-md w-full border border-gray-200">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-900">
          Categories
        </h2>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">No expense data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white text-gray-900 p-3 sm:p-4 rounded-lg shadow-md w-full border border-gray-200">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-900">
        Categories
      </h2>

      {/* Donut Chart */}
      <div className="flex justify-center mb-6">
        <PieChart
          width={200}
          height={200}
          className="sm:w-[200px] sm:h-[200px] w-full h-full"
        >
          <Pie
            data={categoryData}
            dataKey="value"
            nameKey="name"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={5}
          >
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </div>

      {/* Transaction List */}
      <div className="space-y-3 sm:space-y-4">
        {transactionData.map((transaction, index) => (
          <div key={index} className="flex justify-between items-center">
            <div className="flex items-center">
              <div
                className="w-3 h-3 sm:w-4 sm:h-4 rounded-full mr-2 sm:mr-3"
                style={{
                  backgroundColor: transaction.color,
                }}
              ></div>

              <div>
                <p className="text-xs sm:text-sm md:text-md text-gray-900">
                  {transaction.label}
                </p>

                <p className="text-xs sm:text-sm md:text-md text-gray-500">
                  {transaction.count}
                </p>
              </div>
            </div>

            <p className="text-red-500 text-xs sm:text-sm font-bold">
              {transaction.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
