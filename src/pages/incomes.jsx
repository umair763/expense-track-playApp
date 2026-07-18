import { useState } from 'react'
import { IncomeAddForm, IncomeTable, IncomeCard } from '../components'

export const Incomes = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const handleAddSuccess = () => {
    window.dispatchEvent(new CustomEvent('incomeAdded'))
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold">Incomes</h1>
      <IncomeCard />
      <button
        type="button"
        onClick={() => setIsAddModalOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#22C55E] hover:bg-[rgba(34,197,94,0.88)] text-white font-semibold shadow transition"
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
