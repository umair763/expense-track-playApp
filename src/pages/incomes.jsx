import { IncomeAddForm, IncomeTable, IncomeCard } from '../components'

export const Incomes = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold">Incomes</h1>
      <IncomeCard />
      <IncomeAddForm />
      <IncomeTable />
    </div>
  )
}
