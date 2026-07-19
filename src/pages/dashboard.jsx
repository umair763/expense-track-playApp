import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../common'
import { IncomeCard, ExpensePieChart, UiStates } from '../components'
import { getExpenses, getIncome } from '../firebase/firestore.service.js'
import { TrendingUp, TrendingDown } from 'lucide-react'

export const Dashboard = () => {
  const { user } = useAuth()
  const fullName = user?.userName || 'there'
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalExpenses, setTotalExpenses] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchFinancialData = useCallback(async () => {
    if (!user) {
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const [expensesResult, incomeResult] = await Promise.all([
        getExpenses(user.id),
        getIncome(user.id),
      ])

      if (incomeResult.success) {
        const incomeTotal = incomeResult.data.reduce((sum, item) => {
          return sum + (parseFloat(item.amount) || 0)
        }, 0)
        setTotalIncome(incomeTotal)
      }

      if (expensesResult.success) {
        const expenseTotal = expensesResult.data.reduce((sum, item) => {
          return sum + (parseFloat(item.amount) || 0)
        }, 0)
        setTotalExpenses(expenseTotal)
      }
    } catch (error) {
      console.error('Error fetching financial data:', error)
    }

    setLoading(false)
  }, [user])

  useEffect(() => {
    queueMicrotask(() => {
      void fetchFinancialData()
    })
  }, [fetchFinancialData])

  useEffect(() => {
    const handleExpenseAdded = () => {
      fetchFinancialData()
    }
    const handleIncomeAdded = () => {
      fetchFinancialData()
    }
    window.addEventListener('expenseAdded', handleExpenseAdded)
    window.addEventListener('incomeAdded', handleIncomeAdded)
    return () => {
      window.removeEventListener('expenseAdded', handleExpenseAdded)
      window.removeEventListener('incomeAdded', handleIncomeAdded)
    }
  }, [fetchFinancialData])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: user?.currency || 'PKR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#4F30A9]">
          Welcome back, {fullName}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Here's a quick overview of your finances.
        </p>
      </div>

      <IncomeCard />

      <div className="m-auto mb-6">
        <ExpensePieChart />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <UiStates
          title="Total Income"
          value={loading ? 'Loading...' : formatCurrency(totalIncome)}
          icon={TrendingUp}
          trend="up"
          iconColor="text-green-600"
        />
        <UiStates
          title="Total Expenses"
          value={loading ? 'Loading...' : formatCurrency(totalExpenses)}
          icon={TrendingDown}
          trend="down"
          iconColor="text-red-600"
        />
      </div>
    </div>
  )
}
