'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  Building2, Plus, Search, Filter, Download,
  LayoutGrid, LayoutList, Users, UserCheck, TrendingUp, AlertCircle
} from 'lucide-react'
import Link from 'next/link'

import KpiCard from '@/components/shared/KpiCard'
import StatusBadge from '@/components/shared/StatusBadge'
import DataTable from '@/components/shared/DataTable'
import SchoolCard from '@/components/superadmin/SchoolCard'
import { getSchools } from '@/lib/api'

const PLAN_COLORS = {
  basic:        'bg-gray-100 text-gray-600',
  standard:     'bg-blue-50 text-blue-700',
  professional: 'bg-purple-50 text-purple-700',
  enterprise:   'bg-amber-50 text-amber-700',
}

// ── Mock data (remove once real API is wired) ─────────────────────────
const MOCK_SCHOOLS = [
  { id: '1', name: 'Springfield High School',   location: 'Springfield, IL', status: 'active',    plan: 'Enterprise',   studentCount: 1245, teacherCount: 78,  createdAt: '2024-01-12' },
  { id: '2', name: 'Shelbyville Middle School', location: 'Shelbyville, IL', status: 'active',    plan: 'Professional', studentCount: 834,  teacherCount: 52,  createdAt: '2024-02-03' },
  { id: '3', name: 'Green Valley Academy',      location: 'Green Valley, AZ',status: 'inactive',  plan: 'Standard',     studentCount: 412,  teacherCount: 31,  createdAt: '2024-03-18' },
  { id: '4', name: 'Riverside Elementary',      location: 'Riverside, CA',   status: 'active',    plan: 'Basic',        studentCount: 620,  teacherCount: 44,  createdAt: '2024-04-07' },
  { id: '5', name: 'Lakewood International',    location: 'Lakewood, CO',    status: 'suspended', plan: 'Standard',     studentCount: 290,  teacherCount: 22,  createdAt: '2024-04-22' },
  { id: '6', name: 'Maplewood Charter',         location: 'Maplewood, NJ',   status: 'active',    plan: 'Professional', studentCount: 510,  teacherCount: 38,  createdAt: '2024-05-01' },
]
// ─────────────────────────────────────────────────────────────────────

export default function SchoolsPage() {
  const router = useRouter()
  const [schools, setSchools]     = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)
  const [view, setView]           = useState('table') // 'table' | 'grid'
  const [search, setSearch]       = useState('')
  const [filterPlan, setFilterPlan]     = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        // const data = await getSchools()      ← uncomment when API is ready
        // setSchools(data.schools ?? data)
        await new Promise(r => setTimeout(r, 600)) // simulate network
        setSchools(MOCK_SCHOOLS)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // ── Derived stats ────────────────────────────────────────────────
  const stats = useMemo(() => ({
    total:    schools.length,
    active:   schools.filter(s => s.status === 'active').length,
    students: schools.reduce((acc, s) => acc + (s.studentCount || 0), 0),
    teachers: schools.reduce((acc, s) => acc + (s.teacherCount || 0), 0),
  }), [schools])

  // ── Filtered list ────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return schools.filter(s => {
      const q = search.toLowerCase()
      const matchSearch = !q || s.name.toLowerCase().includes(q) || s.location?.toLowerCase().includes(q)
      const matchPlan   = filterPlan   === 'all' || s.plan?.toLowerCase() === filterPlan
      const matchStatus = filterStatus === 'all' || s.status?.toLowerCase() === filterStatus
      return matchSearch && matchPlan && matchStatus
    })
  }, [schools, search, filterPlan, filterStatus])

  // ── Table columns ────────────────────────────────────────────────
  const columns = [
    {
      key: 'name', label: 'School', sortable: true,
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <Building2 size={14} className="text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm">{val}</p>
            <p className="text-xs text-gray-400">{row.location}</p>
          </div>
        </div>
      )
    },
    {
      key: 'studentCount', label: 'Students', sortable: true,
      render: (val) => <span className="text-gray-700">{val?.toLocaleString()}</span>
    },
    {
      key: 'teacherCount', label: 'Teachers', sortable: true,
      render: (val) => <span className="text-gray-700">{val}</span>
    },
    {
      key: 'plan', label: 'Plan',
      render: (val) => (
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${PLAN_COLORS[val?.toLowerCase()] || PLAN_COLORS.basic}`}>
          {val}
        </span>
      )
    },
    {
      key: 'status', label: 'Status',
      render: (val) => <StatusBadge status={val} />
    },
    {
      key: 'id', label: '',
      render: (_, row) => (
        <Link
          href={`/superadmin/schools/${row.id}`}
          onClick={e => e.stopPropagation()}
          className="text-xs font-medium text-blue-600 hover:underline"
        >
          View →
        </Link>
      )
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">All Schools</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage and monitor all registered schools</p>
        </div>
        <Link
          href="/superadmin/schools/add"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={15} />
          Add School
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Total Schools"   value={stats.total}                       icon={Building2}  iconBg="bg-blue-50"   iconColor="text-blue-600"   trend="up"   trendValue="6.9%" />
        <KpiCard title="Active Schools"  value={stats.active}                      icon={Building2}  iconBg="bg-emerald-50" iconColor="text-emerald-600" trend="up"   trendValue="4.4%" />
        <KpiCard title="Total Students"  value={stats.students.toLocaleString()}   icon={Users}      iconBg="bg-purple-50" iconColor="text-purple-600"  trend="up"   trendValue="8.2%" />
        <KpiCard title="Total Teachers"  value={stats.teachers.toLocaleString()}   icon={UserCheck}  iconBg="bg-amber-50"  iconColor="text-amber-600"   trend="up"   trendValue="5.1%" />
      </div>

      {/* Filters + View toggle */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 p-4 border-b border-gray-50">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search schools..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>

          {/* Plan filter */}
          <select
            value={filterPlan}
            onChange={e => setFilterPlan(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-600 bg-white"
          >
            <option value="all">All Plans</option>
            <option value="basic">Basic</option>
            <option value="standard">Standard</option>
            <option value="professional">Professional</option>
            <option value="enterprise">Enterprise</option>
          </select>

          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-600 bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>

          {/* View toggle */}
          <div className="flex items-center gap-1 ml-auto bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setView('table')}
              className={`p-1.5 rounded-md transition-colors ${view === 'table' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <LayoutList size={15} />
            </button>
            <button
              onClick={() => setView('grid')}
              className={`p-1.5 rounded-md transition-colors ${view === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <LayoutGrid size={15} />
            </button>
          </div>
        </div>

        {/* Results count */}
        <div className="px-4 py-2.5 flex items-center justify-between text-xs text-gray-400 border-b border-gray-50">
          <span>{filtered.length} school{filtered.length !== 1 ? 's' : ''} found</span>
        </div>

        {/* Loading */}
        {loading && (
          <div className="p-8 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="p-8 flex flex-col items-center gap-2 text-center">
            <AlertCircle size={32} className="text-red-400" />
            <p className="text-sm text-red-500">{error}</p>
            <button onClick={() => window.location.reload()} className="text-xs text-blue-600 underline">Retry</button>
          </div>
        )}

        {/* Table view */}
        {!loading && !error && view === 'table' && (
          <DataTable
            columns={columns}
            data={filtered}
            onRowClick={(row) => router.push(`/superadmin/schools/${row.id}`)}
          />
        )}

        {/* Grid view */}
        {!loading && !error && view === 'grid' && (
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.length === 0 ? (
              <p className="col-span-full text-center text-sm text-gray-400 py-8">No schools found</p>
            ) : (
              filtered.map(school => <SchoolCard key={school.id} school={school} />)
            )}
          </div>
        )}
      </div>
    </div>
  )
}