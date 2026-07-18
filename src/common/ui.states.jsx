import { ArrowDownRight, ArrowUpRight } from 'lucide-react'

export const UiStates = ({
  title,
  value,
  icon: Icon,
  trend = 'up',
  trendValue,
  iconColor = 'text-blue-600',
}) => {
  const isUp = trend === 'up'

  return (
    <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="flex items-center gap-4">
        <div
          className={'flex h-12 w-12 items-center justify-center rounded-xl'}
        >
          <Icon size={24} className={iconColor} />
        </div>

        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
            {value}
          </h2>
        </div>
      </div>

      <div
        className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold ${
          isUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
        }`}
      >
        {isUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}

        {trendValue}
      </div>
    </div>
  )
}
