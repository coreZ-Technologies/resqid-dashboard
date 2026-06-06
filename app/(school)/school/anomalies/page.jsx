'use client'

import { useState } from 'react'
import {
  Shield, AlertTriangle, Clock, ChevronRight, Filter,
  Search, Download, RefreshCw, Eye, CheckCircle2,
  XCircle, AlertCircle, MapPin, User, QrCode,
  TrendingUp, TrendingDown, ScanLine, ArrowRight,
  MoreHorizontal, ShieldAlert, ShieldCheck, Zap,
  CalendarDays, ChevronDown
} from 'lucide-react'
import Link from 'next/link'
import RefreshButton from '@/components/shared/RefreshButton';
// ── Mock Data ──────────────────────────────────────────────────────────────────

const ANOMALY_STATS = [
  {
    label: 'Total Anomalies',
    value: 24,
    change: +3,
    icon: ShieldAlert,
    color: 'bg-rose-500',
    bg: 'bg-rose-50',
    text: 'text-rose-600',
  },
  {
    label: 'Open / Unresolved',
    value: 7,
    change: -2,
    icon: AlertCircle,
    color: 'bg-amber-500',
    bg: 'bg-amber-50',
    text: 'text-amber-600',
  },
  {
    label: 'Resolved Today',
    value: 5,
    change: +5,
    icon: ShieldCheck,
    color: 'bg-emerald-500',
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
  },
  {
    label: 'High Severity',
    value: 3,
    change: +1,
    icon: Zap,
    color: 'bg-violet-500',
    bg: 'bg-violet-50',
    text: 'text-violet-600',
  },
]

const ANOMALIES = [
  {
    id: 'ANO-001',
    type: 'duplicate_scan',
    severity: 'high',
    status: 'open',
    student: 'Priya Sharma',
    studentId: 'STU-2341',
    class: 'Class 8-A',
    avatar: 'PS',
    avatarColor: 'bg-blue-500',
    description: 'QR card scanned twice within 4 minutes at two different gates',
    location: 'Gate A → Gate C',
    time: '8:02 AM',
    date: 'Today',
    detectedBy: 'Auto-detection',
  },
  {
    id: 'ANO-002',
    type: 'unknown_card',
    severity: 'high',
    status: 'open',
    student: 'Unknown',
    studentId: null,
    class: '—',
    avatar: '?',
    avatarColor: 'bg-slate-400',
    description: 'Unregistered QR card scanned at main entrance',
    location: 'Main Entrance',
    time: '8:17 AM',
    date: 'Today',
    detectedBy: 'Gate Scanner #1',
  },
  {
    id: 'ANO-003',
    type: 'outside_hours',
    severity: 'medium',
    status: 'open',
    student: 'Rahul Gupta',
    studentId: 'STU-1892',
    class: 'Class 11-B',
    avatar: 'RG',
    avatarColor: 'bg-indigo-500',
    description: 'Student scanned card 2 hours after school ended',
    location: 'Back Gate',
    time: '5:45 PM',
    date: 'Today',
    detectedBy: 'Auto-detection',
  },
  {
    id: 'ANO-004',
    type: 'multiple_exits',
    severity: 'medium',
    status: 'investigating',
    student: 'Dev Chatterjee',
    studentId: 'STU-4201',
    class: 'Class 9-B',
    avatar: 'DC',
    avatarColor: 'bg-amber-500',
    description: 'Student recorded exiting campus 3 times in one day without re-entry',
    location: 'Gate B',
    time: '11:30 AM',
    date: 'Today',
    detectedBy: 'Auto-detection',
  },
  {
    id: 'ANO-005',
    type: 'suspicious_timing',
    severity: 'low',
    status: 'open',
    student: 'Sneha Bose',
    studentId: 'STU-3012',
    class: 'Class 7-C',
    avatar: 'SB',
    avatarColor: 'bg-rose-500',
    description: 'Card scanned 35 minutes before school gates officially open',
    location: 'Main Entrance',
    time: '6:55 AM',
    date: 'Today',
    detectedBy: 'Gate Scanner #1',
  },
  {
    id: 'ANO-006',
    type: 'duplicate_scan',
    severity: 'high',
    status: 'resolved',
    student: 'Arjun Sharma',
    studentId: 'STU-2342',
    class: 'Class 5-B',
    avatar: 'AS',
    avatarColor: 'bg-violet-500',
    description: 'Same QR card used simultaneously at Gate A and Gate B',
    location: 'Gate A + Gate B',
    time: '7:58 AM',
    date: 'Yesterday',
    detectedBy: 'Auto-detection',
  },
  {
    id: 'ANO-007',
    type: 'unknown_card',
    severity: 'medium',
    status: 'resolved',
    student: 'Unknown',
    studentId: null,
    class: '—',
    avatar: '?',
    avatarColor: 'bg-slate-400',
    description: 'Deactivated student card attempted access',
    location: 'Side Gate',
    time: '3:12 PM',
    date: 'Yesterday',
    detectedBy: 'Gate Scanner #3',
  },
  {
    id: 'ANO-008',
    type: 'outside_hours',
    severity: 'low',
    status: 'resolved',
    student: 'Kavya Nair',
    studentId: 'STU-5101',
    class: 'Class 6-A',
    avatar: 'KN',
    avatarColor: 'bg-pink-500',
    description: 'Student scanned in on a school holiday',
    location: 'Main Entrance',
    time: '9:15 AM',
    date: '2 days ago',
    detectedBy: 'Auto-detection',
  },
]

const ANOMALY_TYPE_META = {
  duplicate_scan: { label: 'Duplicate Scan', icon: QrCode, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' },
  unknown_card: { label: 'Unknown Card', icon: ScanLine, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  outside_hours: { label: 'Outside Hours', icon: Clock, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-200' },
  multiple_exits: { label: 'Multiple Exits', icon: ArrowRight, color: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-200' },
  suspicious_timing: { label: 'Suspicious Timing', icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
}

const SEVERITY_META = {
  high: { label: 'High', color: 'text-rose-700', bg: 'bg-rose-100', dot: 'bg-rose-500' },
  medium: { label: 'Medium', color: 'text-amber-700', bg: 'bg-amber-100', dot: 'bg-amber-500' },
  low: { label: 'Low', color: 'text-slate-600', bg: 'bg-slate-100', dot: 'bg-slate-400' },
}

const STATUS_META = {
  open: { label: 'Open', color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200', dot: 'bg-rose-500' },
  investigating: { label: 'Investigating', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', dot: 'bg-amber-500' },
  resolved: { label: 'Resolved', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', dot: 'bg-emerald-500' },
}

const FILTERS = ['All', 'Open', 'Investigating', 'Resolved']
const SEVERITY_FILTERS = ['All Severities', 'High', 'Medium', 'Low']

// ── Sub-components ─────────────────────────────────────────────────────────────

function KpiCard({ label, value, change, icon: Icon, color, bg, text }) {
  const positive = change >= 0
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
          <Icon size={18} className="text-white" />
        </div>
        <div className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg ${positive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
          }`}>
          {positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {positive ? '+' : ''}{change} this week
        </div>
      </div>
      <div>
        <p className="text-[26px] font-bold text-slate-800 leading-tight">{value}</p>
        <p className="text-[12px] text-slate-500 mt-0.5">{label}</p>
      </div>
    </div>
  )
}

function SeverityBadge({ severity }) {
  const m = SEVERITY_META[severity] || SEVERITY_META.low
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${m.bg} ${m.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  )
}

function StatusBadge({ status }) {
  const m = STATUS_META[status] || STATUS_META.open
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${m.bg} ${m.color} ${m.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  )
}

function TypeBadge({ type }) {
  const m = ANOMALY_TYPE_META[type]
  if (!m) return null
  const Icon = m.icon
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${m.bg} ${m.color} ${m.border}`}>
      <Icon size={10} />
      {m.label}
    </span>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function AnomaliesPage() {
  const [statusFilter, setStatusFilter] = useState('All')
  const [severityFilter, setSeverityFilter] = useState('All Severities')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  const filtered = ANOMALIES.filter(a => {
    const matchStatus = statusFilter === 'All' || a.status === statusFilter.toLowerCase()
    const matchSeverity = severityFilter === 'All Severities' || a.severity === severityFilter.toLowerCase()
    const matchSearch =
      !search ||
      a.student.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSeverity && matchSearch
  })

  const openCount = ANOMALIES.filter(a => a.status === 'open').length
  const selectedAnomaly = ANOMALIES.find(a => a.id === selected)

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield size={20} className="text-rose-500" />
            <h1 className="text-[22px] font-bold text-slate-800">Anomalies</h1>
            {openCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[11px] font-bold">{openCount} open</span>
            )}
          </div>
          <p className="text-[13px] text-slate-500">Security alerts and suspicious scan activity for your school</p>
        </div>
        <RefreshButton />
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {ANOMALY_STATS.map(s => <KpiCard key={s.label} {...s} />)}
      </div>

      {/* ── Main Content ── */}
      <div className={`grid gap-5 ${selected ? 'lg:grid-cols-[1fr_380px]' : 'grid-cols-1'}`}>

        {/* ── Table Panel ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 border-b border-slate-50">
            {/* Search */}
            <div className="relative flex-1 max-w-xs">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search student, ID…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-[12px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all"
              />
            </div>

            {/* Status tabs */}
            <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-0.5">
              {FILTERS.map(f => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${statusFilter === f
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Severity filter */}
            <div className="relative">
              <select
                value={severityFilter}
                onChange={e => setSeverityFilter(e.target.value)}
                className="appearance-none pl-3 pr-7 py-2 rounded-xl border border-slate-200 text-[12px] text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white cursor-pointer"
              >
                {SEVERITY_FILTERS.map(f => <option key={f}>{f}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-50">
                  {['ID', 'Student', 'Type', 'Severity', 'Location & Time', 'Status', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-16 text-center">
                      <Shield size={32} className="mx-auto text-slate-200 mb-3" />
                      <p className="text-[13px] text-slate-400 font-medium">No anomalies found</p>
                      <p className="text-[11px] text-slate-300 mt-1">Try adjusting your filters</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map(anomaly => {
                    const isSelected = selected === anomaly.id
                    return (
                      <tr
                        key={anomaly.id}
                        onClick={() => setSelected(isSelected ? null : anomaly.id)}
                        className={`border-b border-slate-50 cursor-pointer transition-colors ${isSelected ? 'bg-indigo-50/50' : 'hover:bg-slate-50/50'
                          }`}
                      >
                        {/* ID */}
                        <td className="px-4 py-3.5">
                          <span className="text-[11px] font-mono font-medium text-slate-500">{anomaly.id}</span>
                        </td>

                        {/* Student */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-7 h-7 rounded-full ${anomaly.avatarColor} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                              {anomaly.avatar}
                            </div>
                            <div>
                              <p className="text-[12px] font-semibold text-slate-700 whitespace-nowrap">{anomaly.student}</p>
                              <p className="text-[10px] text-slate-400">{anomaly.class}</p>
                            </div>
                          </div>
                        </td>

                        {/* Type */}
                        <td className="px-4 py-3.5">
                          <TypeBadge type={anomaly.type} />
                        </td>

                        {/* Severity */}
                        <td className="px-4 py-3.5">
                          <SeverityBadge severity={anomaly.severity} />
                        </td>

                        {/* Location & Time */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 whitespace-nowrap">
                            <MapPin size={10} className="text-slate-400 shrink-0" />
                            {anomaly.location}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5 whitespace-nowrap">
                            <Clock size={10} className="shrink-0" />
                            {anomaly.date} · {anomaly.time}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3.5">
                          <StatusBadge status={anomaly.status} />
                        </td>

                        {/* Action */}
                        <td className="px-4 py-3.5">
                          <button className={`p-1.5 rounded-lg transition-colors ${isSelected ? 'bg-indigo-100 text-indigo-600' : 'text-slate-300 hover:bg-slate-100 hover:text-slate-600'}`}>
                            <Eye size={14} />
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-slate-50 flex items-center justify-between">
            <p className="text-[11px] text-slate-400">Showing {filtered.length} of {ANOMALIES.length} anomalies</p>
            <Link href="/school/scans" className="text-[11px] text-sky-500 hover:text-sky-600 font-medium flex items-center gap-1">
              View all scan logs <ChevronRight size={11} />
            </Link>
          </div>
        </div>

        {/* ── Detail Panel ── */}
        {selectedAnomaly && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden h-fit">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
              <div>
                <p className="text-[14px] font-bold text-slate-800">Anomaly Detail</p>
                <p className="text-[11px] font-mono text-slate-400 mt-0.5">{selectedAnomaly.id}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                <XCircle size={16} />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Student info */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className={`w-10 h-10 rounded-full ${selectedAnomaly.avatarColor} flex items-center justify-center text-white text-[13px] font-bold shrink-0`}>
                  {selectedAnomaly.avatar}
                </div>
                <div>
                  <p className="text-[13px] font-bold text-slate-800">{selectedAnomaly.student}</p>
                  <p className="text-[11px] text-slate-500">{selectedAnomaly.class}
                    {selectedAnomaly.studentId && <span className="ml-2 font-mono text-slate-400">{selectedAnomaly.studentId}</span>}
                  </p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <TypeBadge type={selectedAnomaly.type} />
                <SeverityBadge severity={selectedAnomaly.severity} />
                <StatusBadge status={selectedAnomaly.status} />
              </div>

              {/* Description */}
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2">Description</p>
                <p className="text-[13px] text-slate-700 leading-relaxed">{selectedAnomaly.description}</p>
              </div>

              {/* Meta */}
              <div className="space-y-2.5">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Details</p>
                {[
                  { icon: MapPin, label: 'Location', value: selectedAnomaly.location },
                  { icon: Clock, label: 'Time', value: `${selectedAnomaly.date} · ${selectedAnomaly.time}` },
                  { icon: CalendarDays, label: 'Date', value: selectedAnomaly.date },
                  { icon: ScanLine, label: 'Detected By', value: selectedAnomaly.detectedBy },
                ].map(row => (
                  <div key={row.label} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                      <row.icon size={11} className="text-slate-500" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400">{row.label}</p>
                      <p className="text-[12px] font-medium text-slate-700">{row.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              {selectedAnomaly.status !== 'resolved' && (
                <div className="space-y-2 pt-1">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Actions</p>
                  <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-[12px] font-semibold transition-colors">
                    <CheckCircle2 size={14} />
                    Mark as Resolved
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-700 text-[12px] font-semibold transition-colors">
                    <AlertCircle size={14} />
                    Mark as Investigating
                  </button>
                  {selectedAnomaly.studentId && (
                    <Link
                      href={`/school/students/${selectedAnomaly.studentId}`}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-[12px] font-semibold transition-colors"
                    >
                      <User size={14} />
                      View Student Profile
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}