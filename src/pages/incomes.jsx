import { useState } from 'react'
import { IncomeAddForm, IncomeTable, IncomeCard } from '../components'

export const Incomes = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const handleAddSuccess = () => {
    window.dispatchEvent(new CustomEvent('incomeAdded'))
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl text-[#4A02F9] sm:text-3xl font-bold">Incomes</h1>
      <IncomeCard />
      <button
        type="button"
        onClick={() => setIsAddModalOpen(true)}
        className="inline-flex items-center cursor-pointer gap-2 px-4 py-2 rounded-lg bg-[#4A02F9] hover:bg-[#4A02F9]/80 text-white font-semibold shadow transition"
      >
        Add Income
      </button>
      <IncomeTable />
      <IncomeAddForm
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />
    </div>
  )
}
