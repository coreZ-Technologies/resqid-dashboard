export default function StatusBadge({ status }) {
  const variants = {
    active:   'bg-emerald-50 text-emerald-700 border border-emerald-200',
    inactive: 'bg-gray-100 text-gray-500 border border-gray-200',
    suspended:'bg-red-50 text-red-600 border border-red-200',
    pending:  'bg-amber-50 text-amber-600 border border-amber-200',
  }

  const labels = {
    active: 'Active',
    inactive: 'Inactive',
    suspended: 'Suspended',
    pending: 'Pending',
  }

  const key = status?.toLowerCase() || 'inactive'

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${variants[key] || variants.inactive}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${key === 'active' ? 'bg-emerald-500' : key === 'suspended' ? 'bg-red-500' : key === 'pending' ? 'bg-amber-500' : 'bg-gray-400'}`} />
      {labels[key] || status}
    </span>
  )
}