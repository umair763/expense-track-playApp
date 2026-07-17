import { useAuth } from '../common'
import { IncomeCard, ExpensePieChart } from '../components'

export const Dashboard = () => {
  const { user } = useAuth()
  const firstName = user?.name?.split(' ')[0] || 'there'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">
          Welcome back, {firstName}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Here's a quick overview of your finances.
        </p>
      </div>

      <IncomeCard />

      <div className="m-auto mb-6">
        <ExpensePieChart />
        <div className="flex flex-wrap items-start gap-4"></div>
      </div>
    </div>
  )
}
