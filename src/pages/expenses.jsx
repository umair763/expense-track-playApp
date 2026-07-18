import { useState } from 'react'
import { ExpenseAddForm, ExpensesTable, ExpensePieChart } from '../components'

export const Expenses = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const handleAddSuccess = () => {
    window.dispatchEvent(new CustomEvent('expenseAdded'))
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold">Expenses</h1>
      <ExpensePieChart />
      <button
        type="button"
        onClick={() => setIsAddModalOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#3B82F6] hover:bg-[rgba(59,130,246,0.88)] text-white font-semibold shadow transition"
      >
        Add Expense
      </button>
      <ExpensesTable />
      <ExpenseAddForm
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />
    </div>
  )
}
