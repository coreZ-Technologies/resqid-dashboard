import { Building2, Users, UserCheck, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import StatusBadge from '@/components/shared/StatusBadge'

const planColors = {
  basic:        'bg-gray-100 text-gray-600',
  standard:     'bg-blue-50 text-blue-700',
  professional: 'bg-purple-50 text-purple-700',
  enterprise:   'bg-amber-50 text-amber-700',
}

export default function SchoolCard({ school }) {
  const plan = school.plan?.toLowerCase() || 'basic'

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <Building2 size={18} className="text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm leading-tight">{school.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">{school.location || 'No location'}</p>
          </div>
        </div>
        <StatusBadge status={school.status} />
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <Users size={13} className="text-gray-400" />
          {school.studentCount ?? 0} students
        </span>
        <span className="flex items-center gap-1.5">
          <UserCheck size={13} className="text-gray-400" />
          {school.teacherCount ?? 0} teachers
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-gray-50">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${planColors[plan]}`}>
          {school.plan || 'Basic'}
        </span>
        <Link
          href={`/superadmin/schools/${school.id}`}
          className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          View <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  )
}