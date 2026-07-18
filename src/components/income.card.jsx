import { useState, useEffect } from 'react'
import { useAuth } from '../common/use.auth.jsx'
import { getExpenses, getIncome } from '../firebase/firestore.service.js'

export const IncomeCard = () => {
  const { user } = useAuth()
  const [balance, setBalance] = useState(0)
  const [currency, setCurrency] = useState('PKR')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    calculateBalance()
  }, [user])

  useEffect(() => {
    const handleExpenseAdded = () => {
      calculateBalance()
    }
    const handleIncomeAdded = () => {
      calculateBalance()
    }
    window.addEventListener('expenseAdded', handleExpenseAdded)
    window.addEventListener('incomeAdded', handleIncomeAdded)
    return () => {
      window.removeEventListener('expenseAdded', handleExpenseAdded)
      window.removeEventListener('incomeAdded', handleIncomeAdded)
    }
  }, [])

  const calculateBalance = async () => {
    if (!user) {
      setBalance(0)
      setLoading(false)
      return
    }

    setLoading(true)

    try {
      const [expensesResult, incomeResult] = await Promise.all([
        getExpenses(user.id),
        getIncome(user.id),
      ])

      let totalIncome = 0
      let totalExpenses = 0
      let userCurrency = 'PKR'

      if (incomeResult.success) {
        totalIncome = incomeResult.data.reduce((sum, item) => {
          return sum + (parseFloat(item.amount) || 0)
        }, 0)
        if (incomeResult.data.length > 0) {
          userCurrency = incomeResult.data[0].currency || 'PKR'
        }
      }

      if (expensesResult.success) {
        totalExpenses = expensesResult.data.reduce((sum, item) => {
          return sum + (parseFloat(item.amount) || 0)
        }, 0)
        if (expensesResult.data.length > 0) {
          userCurrency = expensesResult.data[0].currency || 'PKR'
        }
      }

      setBalance(totalIncome - totalExpenses)
      setCurrency(userCurrency)
    } catch (error) {
      console.error('Error calculating balance:', error)
    }

    setLoading(false)
  }

  const formatBalance = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <div className="bg-[#1D79A8] shadow-lg rounded-xl p-5 flex flex-col w-full h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-gray-700 font-medium">
          Available Balance
        </span>

        <div className="flex items-center gap-2">
          <span className="text-gray-600 text-sm">Active</span>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              defaultChecked
            />

            <div className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-blue-500 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:bg-white after:rounded-full after:transition-transform peer-checked:after:translate-x-5"></div>
          </label>
        </div>
      </div>

      {/* Balance */}
      <div className="text-3xl md:text-4xl font-bold mb-6">
        {loading ? 'Loading...' : formatBalance(balance)}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-auto">
        <span className="text-gray-700 font-medium">
          Balance
        </span>

        <img
          src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png"
          alt="Mastercard"
          className="w-12"
        />
      </div>
    </div>
  );
}