import { ExpenseAddForm, ExpensesTable, ExpensePieChart } from '../components'

export const Expenses = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold">Expenses</h1>
      <ExpensePieChart />
      <ExpenseAddForm />
      <ExpensesTable />
    </div>
  )
}
