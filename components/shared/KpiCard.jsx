import { TrendingUp, TrendingDown } from 'lucide-react'

export default function KpiCard({ title, value, icon: Icon, iconBg = 'bg-blue-50', iconColor = 'text-blue-600', trend, trendValue }) {
  const isPositive = trend === 'up'
  const isNegative = trend === 'down'

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center`}>
          {Icon && <Icon size={20} className={iconColor} />}
        </div>
        {trendValue && (
          <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${isPositive ? 'text-emerald-600 bg-emerald-50' : isNegative ? 'text-red-500 bg-red-50' : 'text-gray-500 bg-gray-100'}`}>
            {isPositive ? <TrendingUp size={12} /> : isNegative ? <TrendingDown size={12} /> : null}
            {trendValue}
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500 mt-0.5">{title}</p>
      </div>
    </div>
  )
}