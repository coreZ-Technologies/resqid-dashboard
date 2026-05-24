'use client'

import { useState, useMemo } from 'react'
import {
  Activity, Search, Filter, Download, RefreshCw,
  UserCheck, Users, Shield, Settings, LogIn, LogOut,
  FileText, Bell, AlertTriangle, Trash2, Edit3, Plus,
  Eye, Lock, Unlock, Calendar, ChevronDown, ChevronLeft,
  ChevronRight, Clock, Monitor, Smartphone, Globe,
  ArrowUpRight, CheckCircle2, XCircle, Info, Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const MOCK_LOGS = [
  { id: 1,  actor: 'Animesh Karan',   role: 'School Admin', avatar: 'AK', action: 'Exported attendance report',          module: 'Reports',       type: 'export',  severity: 'info',     ip: '192.168.1.12', device: 'desktop', time: '2026-05-24T06:47:43', status: 'success' },
  { id: 2,  actor: 'Priya Nair',      role: 'Teacher',      avatar: 'PN', action: 'Marked attendance for Class 5A',      module: 'Attendance',    type: 'update',  severity: 'info',     ip: '192.168.1.34', device: 'mobile',  time: '2026-05-24T06:31:10', status: 'success' },
  { id: 3,  actor: 'Animesh Karan',   role: 'School Admin', avatar: 'AK', action: 'Sent notification to all parents',    module: 'Notifications', type: 'create',  severity: 'info',     ip: '192.168.1.12', device: 'desktop', time: '2026-05-24T06:15:00', status: 'success' },
  { id: 4,  actor: 'Rajan Mehta',     role: 'Teacher',      avatar: 'RM', action: 'Failed login attempt (wrong password)',module: 'Auth',          type: 'login',   severity: 'warning',  ip: '203.0.113.45', device: 'desktop', time: '2026-05-24T05:58:22', status: 'failed'  },
  { id: 5,  actor: 'Animesh Karan',   role: 'School Admin', avatar: 'AK', action: 'Added new student: Aryan Gupta',      module: 'Students',      type: 'create',  severity: 'info',     ip: '192.168.1.12', device: 'desktop', time: '2026-05-24T05:44:05', status: 'success' },
  { id: 6,  actor: 'Sneha Patel',     role: 'Teacher',      avatar: 'SP', action: 'Updated timetable for Class 7B',      module: 'Timetable',     type: 'update',  severity: 'info',     ip: '192.168.1.67', device: 'mobile',  time: '2026-05-24T05:30:11', status: 'success' },
  { id: 7,  actor: 'Animesh Karan',   role: 'School Admin', avatar: 'AK', action: 'Deleted parent record: Kavita Singh', module: 'Parents',       type: 'delete',  severity: 'critical', ip: '192.168.1.12', device: 'desktop', time: '2026-05-24T05:12:45', status: 'success' },
  { id: 8,  actor: 'System',          role: 'System',       avatar: 'SY', action: 'Automated backup completed',           module: 'System',        type: 'system',  severity: 'info',     ip: 'internal',     device: 'server',  time: '2026-05-24T05:00:00', status: 'success' },
  { id: 9,  actor: 'Karan Singh',     role: 'Teacher',      avatar: 'KS', action: 'Logged in successfully',               module: 'Auth',          type: 'login',   severity: 'info',     ip: '192.168.1.89', device: 'mobile',  time: '2026-05-24T04:55:30', status: 'success' },
  { id: 10, actor: 'Animesh Karan',   role: 'School Admin', avatar: 'AK', action: 'Updated school profile settings',      module: 'Settings',      type: 'update',  severity: 'info',     ip: '192.168.1.12', device: 'desktop', time: '2026-05-24T04:40:18', status: 'success' },
  { id: 11, actor: 'Priya Nair',      role: 'Teacher',      avatar: 'PN', action: 'Generated student report — Class 5A',  module: 'Reports',       type: 'export',  severity: 'info',     ip: '192.168.1.34', device: 'desktop', time: '2026-05-24T04:22:55', status: 'success' },
  { id: 12, actor: 'System',          role: 'System',       avatar: 'SY', action: 'Push notification delivery failed',    module: 'Notifications', type: 'system',  severity: 'warning',  ip: 'internal',     device: 'server',  time: '2026-05-24T04:10:00', status: 'failed'  },
  { id: 13, actor: 'Animesh Karan',   role: 'School Admin', avatar: 'AK', action: 'Upgraded billing plan to Standard',    module: 'Billing',       type: 'update',  severity: 'info',     ip: '192.168.1.12', device: 'desktop', time: '2026-05-23T18:30:00', status: 'success' },
  { id: 14, actor: 'Rajan Mehta',     role: 'Teacher',      avatar: 'RM', action: 'Added substitute for Period 3',        module: 'Timetable',     type: 'create',  severity: 'info',     ip: '192.168.1.99', device: 'mobile',  time: '2026-05-23T17:45:00', status: 'success' },
  { id: 15, actor: 'Animesh Karan',   role: 'School Admin', avatar: 'AK', action: 'Logged out',                           module: 'Auth',          type: 'logout',  severity: 'info',     ip: '192.168.1.12', device: 'desktop', time: '2026-05-23T17:00:00', status: 'success' },
  { id: 16, actor: 'Sneha Patel',     role: 'Teacher',      avatar: 'SP', action: 'Bulk imported 12 students via CSV',    module: 'Students',      type: 'create',  severity: 'info',     ip: '192.168.1.67', device: 'desktop', time: '2026-05-23T16:20:00', status: 'success' },
  { id: 17, actor: 'System',          role: 'System',       avatar: 'SY', action: 'SSL certificate auto-renewed',         module: 'System',        type: 'system',  severity: 'info',     ip: 'internal',     device: 'server',  time: '2026-05-23T15:00:00', status: 'success' },
  { id: 18, actor: 'Karan Singh',     role: 'Teacher',      avatar: 'KS', action: 'Reset password via email link',        module: 'Auth',          type: 'update',  severity: 'warning',  ip: '203.0.113.12', device: 'mobile',  time: '2026-05-23T14:30:00', status: 'success' },
  { id: 19, actor: 'Animesh Karan',   role: 'School Admin', avatar: 'AK', action: 'Viewed billing invoice #INV-0042',     module: 'Billing',       type: 'view',    severity: 'info',     ip: '192.168.1.12', device: 'desktop', time: '2026-05-23T13:10:00', status: 'success' },
  { id: 20, actor: 'Priya Nair',      role: 'Teacher',      avatar: 'PN', action: 'Deleted draft timetable entry',        module: 'Timetable',     type: 'delete',  severity: 'critical', ip: '192.168.1.34', device: 'desktop', time: '2026-05-23T12:00:00', status: 'success' },
]

const MODULE_STYLE = {
  Auth:          { bg: 'bg-slate-100',  text: 'text-slate-600'   },
  Attendance:    { bg: 'bg-blue-50',    text: 'text-blue-700'    },
  Students:      { bg: 'bg-indigo-50',  text: 'text-indigo-700'  },
  Reports:       { bg: 'bg-violet-50',  text: 'text-violet-700'  },
  Notifications: { bg: 'bg-sky-50',     text: 'text-sky-700'     },
  Timetable:     { bg: 'bg-cyan-50',    text: 'text-cyan-700'    },
  Settings:      { bg: 'bg-slate-100',  text: 'text-slate-600'   },
  System:        { bg: 'bg-orange-50',  text: 'text-orange-600'  },
  Parents:       { bg: 'bg-pink-50',    text: 'text-pink-700'    },
  Billing:       { bg: 'bg-emerald-50', text: 'text-emerald-700' },
}

const TYPE_ICON = {
  create: { Icon: Plus,     color: 'text-blue-500',    bg: 'bg-blue-50'    },
  update: { Icon: Edit3,    color: 'text-indigo-500',  bg: 'bg-indigo-50'  },
  delete: { Icon: Trash2,   color: 'text-red-500',     bg: 'bg-red-50'     },
  export: { Icon: Download, color: 'text-violet-500',  bg: 'bg-violet-50'  },
  login:  { Icon: LogIn,    color: 'text-emerald-500', bg: 'bg-emerald-50' },
  logout: { Icon: LogOut,   color: 'text-slate-400',   bg: 'bg-slate-100'  },
  view:   { Icon: Eye,      color: 'text-sky-500',     bg: 'bg-sky-50'     },
  system: { Icon: Zap,      color: 'text-orange-500',  bg: 'bg-orange-50'  },
}

const SEVERITY_DOT = {
  info:     'bg-blue-400',
  warning:  'bg-amber-400',
  critical: 'bg-red-500',
}

const ROLE_AVATAR = {
  'School Admin': 'bg-blue-100 text-blue-700 border-blue-200',
  'Teacher':      'bg-indigo-100 text-indigo-700 border-indigo-200',
  'System':       'bg-orange-100 text-orange-700 border-orange-200',
}

const ACTION_TYPES = ['All Types', 'create', 'update', 'delete', 'export', 'login', 'logout', 'view', 'system']
const STATUS_OPTS  = ['All Status', 'success', 'failed']
const ROLE_OPTS    = ['All Roles', 'School Admin', 'Teacher', 'System']
const PAGE_SIZE    = 10

function formatTime(iso) {
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  })
}

function relativeTime(iso) {
  const diff = Math.floor((Date.now() - new Date(iso)) / 1000)
  if (diff < 60)    return `${diff}s ago`
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function DeviceIcon({ device }) {
  const cls = "text-slate-300"
  if (device === 'mobile') return <Smartphone size={11} className={cls} />
  if (device === 'server') return <Globe      size={11} className={cls} />
  return <Monitor size={11} className={cls} />
}

function StatCard({ icon: Icon, iconBg, iconColor, value, label, badge, badgePositive }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', iconBg)}>
          <Icon size={17} className={iconColor} />
        </div>
        {badge && (
          <span className={cn(
            'flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full',
            badgePositive ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-500'
          )}>
            <ArrowUpRight size={10} />{badge}
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-[12px] text-slate-400 mt-0.5">{label}</p>
      </div>
    </div>
  )
}

export default function ActivityLogPage() {
  const [search,        setSearch]        = useState('')
  const [typeFilter,    setTypeFilter]    = useState('All Types')
  const [statusFilter,  setStatusFilter]  = useState('All Status')
  const [roleFilter,    setRoleFilter]    = useState('All Roles')
  const [dateFrom,      setDateFrom]      = useState('')
  const [dateTo,        setDateTo]        = useState('')
  const [page,          setPage]          = useState(1)
  const [expanded,      setExpanded]      = useState(null)

  const filtered = useMemo(() => {
    return MOCK_LOGS.filter(log => {
      const q = search.toLowerCase()
      if (q && !log.actor.toLowerCase().includes(q) &&
               !log.action.toLowerCase().includes(q) &&
               !log.module.toLowerCase().includes(q)) return false
      if (typeFilter   !== 'All Types'  && log.type   !== typeFilter)   return false
      if (statusFilter !== 'All Status' && log.status !== statusFilter)  return false
      if (roleFilter   !== 'All Roles'  && log.role   !== roleFilter)    return false
      if (dateFrom && new Date(log.time) < new Date(dateFrom))            return false
      if (dateTo   && new Date(log.time) > new Date(dateTo + 'T23:59'))   return false
      return true
    })
  }, [search, typeFilter, statusFilter, roleFilter, dateFrom, dateTo])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const todayCount    = MOCK_LOGS.filter(l => l.time.startsWith('2026-05-24')).length
  const criticalCount = MOCK_LOGS.filter(l => l.severity === 'critical').length
  const failedCount   = MOCK_LOGS.filter(l => l.status === 'failed').length
  const uniqueUsers   = new Set(MOCK_LOGS.map(l => l.actor)).size

  const hasFilters = search || typeFilter !== 'All Types' || statusFilter !== 'All Status' ||
                     roleFilter !== 'All Roles' || dateFrom || dateTo

  function reset() {
    setSearch(''); setTypeFilter('All Types'); setStatusFilter('All Status')
    setRoleFilter('All Roles'); setDateFrom(''); setDateTo(''); setPage(1)
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Activity Log</h1>
          <p className="text-[13px] text-slate-400 mt-0.5">Full audit trail of all user and system actions</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={reset} className="flex items-center gap-2 text-[13px] border border-slate-200 rounded-lg px-3 py-2 bg-white hover:bg-slate-50 text-slate-500 transition-colors">
            <RefreshCw size={13} /> Refresh
          </button>
          <button className="flex items-center gap-2 text-[13px] bg-blue-700 hover:bg-blue-800 text-white rounded-lg px-4 py-2 font-medium transition-colors">
            <Download size={13} /> Export CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={Activity}      iconBg="bg-blue-50"   iconColor="text-blue-600"   value={MOCK_LOGS.length} label="Total Events"      badge="+8%"               badgePositive />
        <StatCard icon={Clock}         iconBg="bg-indigo-50" iconColor="text-indigo-600" value={todayCount}       label="Today's Activity"  badge={`+${todayCount}`}  badgePositive />
        <StatCard icon={Users}         iconBg="bg-sky-50"    iconColor="text-sky-600"    value={uniqueUsers}      label="Active Users" />
        <StatCard icon={AlertTriangle} iconBg="bg-red-50"    iconColor="text-red-500"    value={criticalCount}    label="Critical Actions"  badge={`${failedCount} failed`} badgePositive={false} />
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 flex-1 min-w-[200px]">
            <Search size={13} className="text-slate-400 shrink-0" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search by actor, action, or module..."
              className="bg-transparent text-[13px] text-slate-700 placeholder:text-slate-400 outline-none w-full"
            />
          </div>
          {[
            { value: typeFilter,   onChange: v => { setTypeFilter(v);   setPage(1) }, opts: ACTION_TYPES },
            { value: statusFilter, onChange: v => { setStatusFilter(v); setPage(1) }, opts: STATUS_OPTS  },
            { value: roleFilter,   onChange: v => { setRoleFilter(v);   setPage(1) }, opts: ROLE_OPTS    },
          ].map((sel, i) => (
            <select key={i} value={sel.value} onChange={e => sel.onChange(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-[13px] text-slate-600 bg-white outline-none cursor-pointer hover:border-blue-300 transition-colors">
              {sel.opts.map(o => <option key={o}>{o}</option>)}
            </select>
          ))}
          <input type="date" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setPage(1) }}
            className="border border-slate-200 rounded-lg px-3 py-2 text-[13px] text-slate-600 bg-white outline-none hover:border-blue-300 transition-colors" />
          <span className="text-slate-300 text-[12px]">to</span>
          <input type="date" value={dateTo} onChange={e => { setDateTo(e.target.value); setPage(1) }}
            className="border border-slate-200 rounded-lg px-3 py-2 text-[13px] text-slate-600 bg-white outline-none hover:border-blue-300 transition-colors" />
          {hasFilters && (
            <button onClick={reset} className="text-[12px] text-red-400 hover:text-red-600 font-medium underline transition-colors">
              Clear filters
            </button>
          )}
        </div>
        <p className="text-[12px] text-slate-400">
          Showing <span className="font-semibold text-slate-600">{filtered.length}</span> events
        </p>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">

        {/* Header row */}
        <div className="hidden lg:grid grid-cols-[36px_1fr_110px_100px_150px_120px] gap-4 px-5 py-3 border-b border-slate-100 bg-slate-50">
          {['', 'Action & Actor', 'Module', 'Status', 'Timestamp', 'IP / Device'].map((h, i) => (
            <p key={i} className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{h}</p>
          ))}
        </div>

        {paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
            <Activity size={32} className="text-slate-200" />
            <p className="text-[13px]">No activity found for these filters</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {paginated.map(log => {
              const tc  = TYPE_ICON[log.type]   ?? TYPE_ICON.view
              const mc  = MODULE_STYLE[log.module] ?? MODULE_STYLE.System
              const dot = SEVERITY_DOT[log.severity]
              const av  = ROLE_AVATAR[log.role] ?? 'bg-slate-100 text-slate-600 border-slate-200'
              const open = expanded === log.id

              return (
                <div key={log.id}>
                  <div
                    onClick={() => setExpanded(open ? null : log.id)}
                    className={cn(
                      'grid grid-cols-[36px_1fr] lg:grid-cols-[36px_1fr_110px_100px_150px_120px] gap-4 px-5 py-3.5 items-center cursor-pointer transition-colors',
                      open ? 'bg-blue-50/40' : 'hover:bg-slate-50/70'
                    )}
                  >
                    {/* Type icon */}
                    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', tc.bg)}>
                      <tc.Icon size={14} className={tc.color} />
                    </div>

                    {/* Action + actor */}
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-slate-800 truncate leading-tight">{log.action}</p>
                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        <div className={cn('w-4 h-4 rounded-full border flex items-center justify-center text-[8px] font-bold shrink-0', av)}>
                          {log.avatar}
                        </div>
                        <span className="text-[11px] text-slate-500">{log.actor}</span>
                        <span className="text-slate-300 text-[10px]">·</span>
                        <span className="text-[10px] text-slate-400">{log.role}</span>
                        {/* On mobile show module + status inline */}
                        <span className="lg:hidden">
                          <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded-full ml-1', mc.bg, mc.text)}>
                            {log.module}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Module — desktop */}
                    <span className={cn('hidden lg:inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full w-fit', mc.bg, mc.text)}>
                      {log.module}
                    </span>

                    {/* Status — desktop */}
                    <div className="hidden lg:flex items-center gap-1.5">
                      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dot)} />
                      {log.status === 'success'
                        ? <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1"><CheckCircle2 size={11} />Success</span>
                        : <span className="text-[11px] font-medium text-red-500 flex items-center gap-1"><XCircle size={11} />Failed</span>
                      }
                    </div>

                    {/* Timestamp — desktop */}
                    <div className="hidden lg:block">
                      <p className="text-[12px] text-slate-600">{relativeTime(log.time)}</p>
                      <p className="text-[10px] text-slate-300 mt-0.5">{formatTime(log.time)}</p>
                    </div>

                    {/* IP — desktop */}
                    <div className="hidden lg:flex items-center gap-1.5">
                      <DeviceIcon device={log.device} />
                      <span className="text-[11px] text-slate-400 font-mono truncate">{log.ip}</span>
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {open && (
                    <div className="mx-5 mb-4 bg-slate-50 border border-slate-100 rounded-xl px-5 py-4">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-3">
                        Event Detail
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                          { label: 'Event ID',    value: `#LOG-${String(log.id).padStart(4, '0')}` },
                          { label: 'Actor',       value: `${log.actor} (${log.role})` },
                          { label: 'Module',      value: log.module },
                          { label: 'Action Type', value: log.type.charAt(0).toUpperCase() + log.type.slice(1) },
                          { label: 'Severity',    value: log.severity.charAt(0).toUpperCase() + log.severity.slice(1) },
                          { label: 'Status',      value: log.status.charAt(0).toUpperCase() + log.status.slice(1) },
                          { label: 'IP Address',  value: log.ip },
                          { label: 'Full Time',   value: formatTime(log.time) },
                        ].map(({ label, value }) => (
                          <div key={label}>
                            <p className="text-[10px] text-slate-400 font-medium">{label}</p>
                            <p className="text-[12px] text-slate-700 font-semibold mt-0.5">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100">
            <p className="text-[12px] text-slate-400">
              Page <span className="font-semibold text-slate-600">{page}</span> of{' '}
              <span className="font-semibold text-slate-600">{totalPages}</span>
              {' '}· {filtered.length} total events
            </p>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-blue-50 hover:border-blue-200 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={cn(
                    'w-8 h-8 flex items-center justify-center rounded-lg text-[12px] font-medium border transition-colors',
                    p === page
                      ? 'bg-blue-700 text-white border-blue-700'
                      : 'border-slate-200 text-slate-500 hover:bg-blue-50 hover:border-blue-200'
                  )}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-blue-50 hover:border-blue-200 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}