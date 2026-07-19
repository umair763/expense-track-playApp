import { useState } from 'react'
import { ExpenseAddForm, ExpensesTable, ExpensePieChart } from '../components'

export const Expenses = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const handleAddSuccess = () => {
    window.dispatchEvent(new CustomEvent('expenseAdded'))
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl text-[#4F30A9] sm:text-3xl font-bold">
        Expenses
      </h1>
      <ExpensePieChart />
      <button
        type="button"
        onClick={() => setIsAddModalOpen(true)}
        className="inline-flex items-center cursor-pointer gap-2 px-4 py-2 rounded-lg bg-[#4F30A9] hover:bg-[#4F30A9]/80 text-white font-semibold shadow transition"
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
