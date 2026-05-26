'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Building2, ArrowLeft, Users, UserCheck, Mail, Phone,
  MapPin, CreditCard, Calendar, Edit, Trash2, AlertCircle,
  CheckCircle, Activity
} from 'lucide-react'
import Link from 'next/link'
import StatusBadge from '@/components/shared/StatusBadge'
import { getSchool } from '@/lib/api'

// ── Mock (remove when API ready) ──────────────────────────────────────
const MOCK = {
  id: '1', name: 'Springfield High School', location: 'Springfield, IL',
  address: '123 Main Street, Springfield, IL 62701', email: 'admin@springfield.edu',
  phone: '+1 (555) 234-5678', status: 'active', plan: 'Enterprise',
  studentCount: 1245, teacherCount: 78, parentCount: 980,
  adminName: 'Principal Johnson', adminEmail: 'johnson@springfield.edu',
  createdAt: '2024-01-12', lastActive: '2026-05-25',
  recentActivity: [
    { id: 1, action: 'New student enrolled',  time: '10 min ago',  type: 'success' },
    { id: 2, action: 'Emergency alert sent',  time: '2 hours ago', type: 'warning' },
    { id: 3, action: 'Timetable updated',     time: 'Yesterday',   type: 'info' },
    { id: 4, action: 'Parent broadcast sent', time: '2 days ago',  type: 'info' },
  ]
}
// ─────────────────────────────────────────────────────────────────────

const PLAN_COLORS = {
  basic:        'bg-gray-100 text-gray-600',
  standard:     'bg-blue-50 text-blue-700',
  professional: 'bg-purple-50 text-purple-700',
  enterprise:   'bg-amber-50 text-amber-700',
}

const activityDot = { success: 'bg-emerald-500', warning: 'bg-amber-500', info: 'bg-blue-400' }

function StatPill({ icon: Icon, label, value, color = 'text-blue-600', bg = 'bg-blue-50' }) {
  return (
    <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
        <Icon size={18} className={color} />
      </div>
      <div>
        <p className="text-xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </div>
  )
}

export default function SchoolDetailPage() {
  const { schoolId } = useParams()
  const router = useRouter()
  const [school, setSchool] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        // const data = await getSchool(schoolId)   ← uncomment when API ready
        await new Promise(r => setTimeout(r, 500))
        setSchool(MOCK)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [schoolId])

  if (loading) return (
    <div className="p-6 space-y-4">
      {[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />)}
    </div>
  )

  if (error || !school) return (
    <div className="p-6 flex flex-col items-center gap-3 pt-20 text-center">
      <AlertCircle size={40} className="text-red-400" />
      <p className="text-gray-500">{error || 'School not found'}</p>
      <Link href="/superadmin/schools" className="text-sm text-blue-600 underline">Back to schools</Link>
    </div>
  )

  const plan = school.plan?.toLowerCase() || 'basic'

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-gray-500">
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900">{school.name}</h1>
              <StatusBadge status={school.status} />
            </div>
            <p className="text-sm text-gray-400 mt-0.5 flex items-center gap-1">
              <MapPin size={12} /> {school.location}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/superadmin/schools/${schoolId}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Edit size={14} /> Edit
          </Link>
          <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 transition-colors">
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatPill icon={Users}     label="Total Students" value={school.studentCount?.toLocaleString()} color="text-blue-600"   bg="bg-blue-50" />
        <StatPill icon={UserCheck} label="Teachers"        value={school.teacherCount}                   color="text-purple-600" bg="bg-purple-50" />
        <StatPill icon={Users}     label="Parents"         value={school.parentCount?.toLocaleString()}  color="text-emerald-600" bg="bg-emerald-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Details */}
        <div className="lg:col-span-2 space-y-5">
          {/* School Info Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Building2 size={15} className="text-gray-400" /> School Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <Detail icon={Mail}       label="Email"    value={school.email} />
              <Detail icon={Phone}      label="Phone"    value={school.phone} />
              <Detail icon={MapPin}     label="Address"  value={school.address} />
              <Detail icon={CreditCard} label="Plan"     value={
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${PLAN_COLORS[plan]}`}>{school.plan}</span>
              } />
              <Detail icon={Calendar}   label="Joined"   value={new Date(school.createdAt).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })} />
              <Detail icon={CheckCircle} label="Last Active" value={new Date(school.lastActive).toLocaleDateString()} />
            </div>
          </div>

          {/* Admin Info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <UserCheck size={15} className="text-gray-400" /> School Admin
            </h2>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                {school.adminName?.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{school.adminName}</p>
                <p className="text-xs text-gray-400">{school.adminEmail}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Activity */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 h-fit">
          <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Activity size={15} className="text-gray-400" /> Recent Activity
          </h2>
          <div className="space-y-3">
            {school.recentActivity.map((item) => (
              <div key={item.id} className="flex items-start gap-2.5">
                <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${activityDot[item.type]}`} />
                <div>
                  <p className="text-sm text-gray-700">{item.action}</p>
                  <p className="text-xs text-gray-400">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Detail({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon size={14} className="text-gray-400 mt-0.5 shrink-0" />
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <div className="text-sm text-gray-700 font-medium mt-0.5">{value}</div>
      </div>
    </div>
  )
}