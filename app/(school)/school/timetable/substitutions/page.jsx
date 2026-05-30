'use client'

import { useState } from 'react'
import {
  UsersRound, UserCheck, UserX, Clock, CalendarDays,
  Plus, Search, Download, RefreshCw, ChevronDown,
  CheckCircle2, XCircle, AlertCircle, BookOpen,
  ChevronRight, Edit2, Trash2, Eye, TrendingUp,
  TrendingDown, ArrowRight, RotateCcw, Filter,
  BookMarked, Users, Bell, X, Save
} from 'lucide-react'
import Link from 'next/link'

// ── Mock Data ──────────────────────────────────────────────────────────────────

const STATS = [
  { label: "Today's Substitutions", value: 4,  icon: UsersRound,  color: 'bg-indigo-500', change: +1  },
  { label: 'Teachers Absent',       value: 3,  icon: UserX,       color: 'bg-rose-500',   change: +1  },
  { label: 'Covered Periods',       value: 11, icon: CheckCircle2,color: 'bg-emerald-500', change: +3  },
  { label: 'Pending Coverage',      value: 2,  icon: AlertCircle, color: 'bg-amber-500',  change: -1  },
]

// All teachers in school
const TEACHERS = [
  { id: 'TCH-001', name: 'Mr. S. Kumar',   subject: 'Mathematics',   avatar: 'SK', color: 'bg-sky-500',    available: true  },
  { id: 'TCH-002', name: 'Ms. P. Nair',    subject: 'English',       avatar: 'PN', color: 'bg-pink-500',   available: true  },
  { id: 'TCH-003', name: 'Mr. A. Das',     subject: 'Science',       avatar: 'AD', color: 'bg-emerald-500',available: false }, // absent
  { id: 'TCH-004', name: 'Ms. S. Roy',     subject: 'History',       avatar: 'SR', color: 'bg-amber-500',  available: true  },
  { id: 'TCH-005', name: 'Mr. R. Sen',     subject: 'Comp. Science', avatar: 'RS', color: 'bg-violet-500', available: false }, // absent
  { id: 'TCH-006', name: 'Ms. K. Ghosh',   subject: 'Geography',     avatar: 'KG', color: 'bg-teal-500',   available: true  },
  { id: 'TCH-007', name: 'Mr. D. Verma',   subject: 'Physics',       avatar: 'DV', color: 'bg-indigo-500', available: true  },
  { id: 'TCH-008', name: 'Ms. M. Sharma',  subject: 'Chemistry',     avatar: 'MS', color: 'bg-rose-500',   available: false }, // absent
  { id: 'TCH-009', name: 'Mr. B. Pillai',  subject: 'Hindi',         avatar: 'BP', color: 'bg-orange-500', available: true  },
  { id: 'TCH-010', name: 'Ms. T. Bose',    subject: 'Biology',       avatar: 'TB', color: 'bg-cyan-500',   available: true  },
]

const SUBSTITUTIONS = [
  {
    id: 'SUB-001',
    date: 'Today',
    period: 'P3',
    time: '9:45 – 10:30',
    class: 'Class 8-A',
    subject: 'Science',
    absentTeacher: { id: 'TCH-003', name: 'Mr. A. Das',    avatar: 'AD', color: 'bg-emerald-500' },
    substituteTeacher: { id: 'TCH-007', name: 'Mr. D. Verma',  avatar: 'DV', color: 'bg-indigo-500' },
    status: 'confirmed',
    reason: 'Medical leave',
    notifiedParents: true,
  },
  {
    id: 'SUB-002',
    date: 'Today',
    period: 'P4',
    time: '10:30 – 11:15',
    class: 'Class 7-B',
    subject: 'Comp. Science',
    absentTeacher: { id: 'TCH-005', name: 'Mr. R. Sen',    avatar: 'RS', color: 'bg-violet-500' },
    substituteTeacher: { id: 'TCH-001', name: 'Mr. S. Kumar',  avatar: 'SK', color: 'bg-sky-500' },
    status: 'confirmed',
    reason: 'Personal leave',
    notifiedParents: false,
  },
  {
    id: 'SUB-003',
    date: 'Today',
    period: 'P5',
    time: '11:45 – 12:30',
    class: 'Class 9-A',
    subject: 'Chemistry',
    absentTeacher: { id: 'TCH-008', name: 'Ms. M. Sharma', avatar: 'MS', color: 'bg-rose-500' },
    substituteTeacher: null,
    status: 'pending',
    reason: 'Emergency leave',
    notifiedParents: false,
  },
  {
    id: 'SUB-004',
    date: 'Today',
    period: 'P6',
    time: '12:30 – 1:15',
    class: 'Class 10-B',
    subject: 'Chemistry',
    absentTeacher: { id: 'TCH-008', name: 'Ms. M. Sharma', avatar: 'MS', color: 'bg-rose-500' },
    substituteTeacher: null,
    status: 'pending',
    reason: 'Emergency leave',
    notifiedParents: false,
  },
  {
    id: 'SUB-005',
    date: 'Yesterday',
    period: 'P2',
    time: '8:45 – 9:30',
    class: 'Class 6-C',
    subject: 'Science',
    absentTeacher: { id: 'TCH-003', name: 'Mr. A. Das',    avatar: 'AD', color: 'bg-emerald-500' },
    substituteTeacher: { id: 'TCH-010', name: 'Ms. T. Bose',  avatar: 'TB', color: 'bg-cyan-500' },
    status: 'completed',
    reason: 'Medical leave',
    notifiedParents: true,
  },
  {
    id: 'SUB-006',
    date: 'Yesterday',
    period: 'P4',
    time: '10:30 – 11:15',
    class: 'Class 11-A',
    subject: 'Comp. Science',
    absentTeacher: { id: 'TCH-005', name: 'Mr. R. Sen',    avatar: 'RS', color: 'bg-violet-500' },
    substituteTeacher: { id: 'TCH-006', name: 'Ms. K. Ghosh',  avatar: 'KG', color: 'bg-teal-500' },
    status: 'completed',
    reason: 'Training program',
    notifiedParents: true,
  },
  {
    id: 'SUB-007',
    date: '2 days ago',
    period: 'P1',
    time: '8:00 – 8:45',
    class: 'Class 5-A',
    subject: 'Mathematics',
    absentTeacher: { id: 'TCH-001', name: 'Mr. S. Kumar',  avatar: 'SK', color: 'bg-sky-500' },
    substituteTeacher: { id: 'TCH-009', name: 'Mr. B. Pillai',  avatar: 'BP', color: 'bg-orange-500' },
    status: 'completed',
    reason: 'Sick leave',
    notifiedParents: true,
  },
]

const STATUS_META = {
  confirmed: { label: 'Confirmed', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  pending:   { label: 'Pending',   color: 'text-amber-700',   bg: 'bg-amber-50',   border: 'border-amber-200',   dot: 'bg-amber-500'   },
  completed: { label: 'Completed', color: 'text-slate-600',   bg: 'bg-slate-100',  border: 'border-slate-200',   dot: 'bg-slate-400'   },
}

const DATE_FILTERS   = ['All', 'Today', 'Yesterday', 'This Week']
const STATUS_FILTERS = ['All Statuses', 'Confirmed', 'Pending', 'Completed']

// ── Sub-components ─────────────────────────────────────────────────────────────

function StatCard({ label, value, icon: Icon, color, change }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={18} className="text-white" />
        </div>
        {change !== null && (
          <span className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg ${
            change >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
          }`}>
            {change >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {change >= 0 ? '+' : ''}{change} vs yesterday
          </span>
        )}
      </div>
      <p className="text-[26px] font-bold text-slate-800 leading-tight">{value}</p>
      <p className="text-[12px] text-slate-500 mt-0.5">{label}</p>
    </div>
  )
}

function StatusBadge({ status }) {
  const m = STATUS_META[status] || STATUS_META.pending
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${m.bg} ${m.color} ${m.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  )
}

function TeacherChip({ teacher, size = 'md' }) {
  if (!teacher) return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-400 border border-slate-200">
      <UserX size={10} /> Unassigned
    </span>
  )
  return (
    <div className="flex items-center gap-2">
      <div className={`${size === 'sm' ? 'w-6 h-6 text-[9px]' : 'w-7 h-7 text-[10px]'} rounded-full ${teacher.color} flex items-center justify-center text-white font-bold shrink-0`}>
        {teacher.avatar}
      </div>
      <span className="text-[12px] font-medium text-slate-700 whitespace-nowrap">{teacher.name}</span>
    </div>
  )
}

// ── Assign Modal ────────────────────────────────────────────────────────────────

function AssignModal({ sub, onClose, onAssign }) {
  const [picked, setPicked] = useState(null)
  const available = TEACHERS.filter(t => t.available && t.id !== sub.absentTeacher.id)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
          <div>
            <p className="text-[14px] font-bold text-slate-800">Assign Substitute</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{sub.period} · {sub.time} · {sub.class} · {sub.subject}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Absent teacher info */}
        <div className="px-5 pt-4">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2">Absent Teacher</p>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-rose-50 border border-rose-200 mb-4">
            <div className={`w-8 h-8 rounded-full ${sub.absentTeacher.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
              {sub.absentTeacher.avatar}
            </div>
            <div>
              <p className="text-[12px] font-semibold text-slate-700">{sub.absentTeacher.name}</p>
              <p className="text-[10px] text-slate-500">Reason: {sub.reason}</p>
            </div>
          </div>

          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2">Select Substitute</p>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {available.map(t => (
              <button
                key={t.id}
                onClick={() => setPicked(t.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                  picked === t.id
                    ? 'border-indigo-300 bg-indigo-50 ring-2 ring-indigo-100'
                    : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-full ${t.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                  {t.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-slate-700">{t.name}</p>
                  <p className="text-[10px] text-slate-400">{t.subject}</p>
                </div>
                {picked === t.id && <CheckCircle2 size={16} className="text-indigo-500 shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-5 py-4 border-t border-slate-50 mt-4">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-[12px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={!picked}
            onClick={() => { onAssign(sub.id, picked); onClose() }}
            className="flex-1 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-100 disabled:text-slate-400 text-white disabled:cursor-not-allowed text-[12px] font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Save size={13} /> Confirm Assignment
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function SubstitutionsPage() {
  const [dateFilter,   setDateFilter]   = useState('Today')
  const [statusFilter, setStatusFilter] = useState('All Statuses')
  const [search,       setSearch]       = useState('')
  const [selected,     setSelected]     = useState(null)
  const [assignModal,  setAssignModal]  = useState(null) // sub object
  const [subs, setSubs] = useState(SUBSTITUTIONS)

  const filtered = subs.filter(s => {
    const matchDate   = dateFilter === 'All' || s.date === dateFilter ||
      (dateFilter === 'This Week' && ['Today', 'Yesterday', '2 days ago'].includes(s.date))
    const matchStatus = statusFilter === 'All Statuses' || s.status === statusFilter.toLowerCase()
    const matchSearch = !search ||
      s.class.toLowerCase().includes(search.toLowerCase()) ||
      s.subject.toLowerCase().includes(search.toLowerCase()) ||
      s.absentTeacher.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.substituteTeacher?.name || '').toLowerCase().includes(search.toLowerCase())
    return matchDate && matchStatus && matchSearch
  })

  const pendingCount = subs.filter(s => s.status === 'pending').length
  const selectedSub  = subs.find(s => s.id === selected)

  function handleAssign(subId, teacherId) {
    const teacher = TEACHERS.find(t => t.id === teacherId)
    setSubs(prev => prev.map(s =>
      s.id === subId ? { ...s, substituteTeacher: teacher, status: 'confirmed' } : s
    ))
  }

  return (
    <>
      {assignModal && (
        <AssignModal
          sub={assignModal}
          onClose={() => setAssignModal(null)}
          onAssign={handleAssign}
        />
      )}

      <div className="space-y-6">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <UsersRound size={20} className="text-indigo-500" />
              <h1 className="text-[22px] font-bold text-slate-800">Substitutions</h1>
              {pendingCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[11px] font-bold">
                  {pendingCount} pending
                </span>
              )}
            </div>
            <p className="text-[13px] text-slate-500">Manage teacher absences and assign substitute coverage</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 text-[12px] text-slate-600 hover:bg-slate-50 transition-colors">
              <Download size={13} /> Export
            </button>
            <button
              onClick={() => setAssignModal(subs.find(s => s.status === 'pending') || null)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-[12px] font-semibold transition-colors"
            >
              <Plus size={13} /> New Substitution
            </button>
          </div>
        </div>

        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map(s => <StatCard key={s.label} {...s} />)}
        </div>

        {/* ── Pending alert banner ── */}
        {pendingCount > 0 && (
          <div className="flex items-start gap-3 px-5 py-4 rounded-2xl bg-amber-50 border border-amber-200">
            <AlertCircle size={16} className="text-amber-500 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-amber-700">
                {pendingCount} period{pendingCount > 1 ? 's' : ''} still need{pendingCount === 1 ? 's' : ''} a substitute assigned
              </p>
              <div className="mt-1 flex flex-wrap gap-2">
                {subs.filter(s => s.status === 'pending').map(s => (
                  <span key={s.id} className="text-[11px] text-amber-600 bg-amber-100 px-2 py-0.5 rounded-lg">
                    {s.period} · {s.class} · {s.subject}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => setStatusFilter('Pending')}
              className="shrink-0 px-3 py-1.5 rounded-xl bg-amber-500 text-white text-[11px] font-semibold hover:bg-amber-600 transition-colors"
            >
              Assign Now
            </button>
          </div>
        )}

        {/* ── Absent teachers strip ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[13px] font-bold text-slate-800">Absent Today</p>
            <Link href="/school/teachers" className="text-[11px] text-sky-500 font-medium flex items-center gap-1">
              All teachers <ChevronRight size={11} />
            </Link>
          </div>
          <div className="flex flex-wrap gap-3">
            {TEACHERS.filter(t => !t.available).map(t => (
              <div key={t.id} className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-rose-50 border border-rose-200">
                <div className={`w-7 h-7 rounded-full ${t.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-slate-700">{t.name}</p>
                  <p className="text-[10px] text-slate-400">{t.subject}</p>
                </div>
                <span className="ml-1 text-[10px] font-semibold text-rose-600 bg-rose-100 px-1.5 py-0.5 rounded-full">Absent</span>
              </div>
            ))}
            {TEACHERS.filter(t => !t.available).length === 0 && (
              <p className="text-[12px] text-slate-400">All teachers present today 🎉</p>
            )}
          </div>
        </div>

        {/* ── Main layout ── */}
        <div className={`grid gap-5 ${selectedSub ? 'lg:grid-cols-[1fr_360px]' : 'grid-cols-1'}`}>

          {/* ── Table panel ── */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 border-b border-slate-50">
              <div className="relative flex-1 max-w-xs">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search class, teacher, subject…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-[12px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all"
                />
              </div>

              {/* Date tabs */}
              <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-0.5">
                {DATE_FILTERS.map(f => (
                  <button
                    key={f}
                    onClick={() => setDateFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all whitespace-nowrap ${
                      dateFilter === f ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* Status filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="appearance-none pl-3 pr-7 py-2 rounded-xl border border-slate-200 text-[12px] text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white cursor-pointer"
                >
                  {STATUS_FILTERS.map(f => <option key={f}>{f}</option>)}
                </select>
                <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-50">
                    {['Period & Time', 'Class & Subject', 'Absent Teacher', 'Substitute', 'Status', 'Date', ''].map(h => (
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
                        <UsersRound size={32} className="mx-auto text-slate-200 mb-3" />
                        <p className="text-[13px] text-slate-400 font-medium">No substitutions found</p>
                        <p className="text-[11px] text-slate-300 mt-1">Try adjusting your filters</p>
                      </td>
                    </tr>
                  ) : (
                    filtered.map(sub => {
                      const isSelected = selected === sub.id
                      return (
                        <tr
                          key={sub.id}
                          onClick={() => setSelected(isSelected ? null : sub.id)}
                          className={`border-b border-slate-50 cursor-pointer transition-colors ${
                            isSelected ? 'bg-indigo-50/50' : 'hover:bg-slate-50/40'
                          }`}
                        >
                          {/* Period */}
                          <td className="px-4 py-3.5">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 text-[11px] font-bold">
                              {sub.period}
                            </span>
                            <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                              <Clock size={9} /> {sub.time}
                            </p>
                          </td>

                          {/* Class & Subject */}
                          <td className="px-4 py-3.5">
                            <p className="text-[12.5px] font-semibold text-slate-700">{sub.class}</p>
                            <p className="text-[11px] text-slate-400 flex items-center gap-1">
                              <BookOpen size={9} /> {sub.subject}
                            </p>
                          </td>

                          {/* Absent teacher */}
                          <td className="px-4 py-3.5">
                            <TeacherChip teacher={sub.absentTeacher} size="sm" />
                          </td>

                          {/* Substitute */}
                          <td className="px-4 py-3.5">
                            {sub.substituteTeacher
                              ? <TeacherChip teacher={sub.substituteTeacher} size="sm" />
                              : (
                                <button
                                  onClick={e => { e.stopPropagation(); setAssignModal(sub) }}
                                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-semibold hover:bg-amber-100 transition-colors"
                                >
                                  <Plus size={11} /> Assign
                                </button>
                              )
                            }
                          </td>

                          {/* Status */}
                          <td className="px-4 py-3.5">
                            <StatusBadge status={sub.status} />
                          </td>

                          {/* Date */}
                          <td className="px-4 py-3.5">
                            <p className="text-[12px] text-slate-500 whitespace-nowrap">{sub.date}</p>
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
              <p className="text-[11px] text-slate-400">Showing {filtered.length} of {subs.length} substitutions</p>
              <Link href="/school/timetable" className="text-[11px] text-sky-500 hover:text-sky-600 font-medium flex items-center gap-1">
                View full timetable <ChevronRight size={11} />
              </Link>
            </div>
          </div>

          {/* ── Detail Panel ── */}
          {selectedSub && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden h-fit">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
                <div>
                  <p className="text-[14px] font-bold text-slate-800">Substitution Detail</p>
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5">{selectedSub.id}</p>
                </div>
                <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                  <XCircle size={16} />
                </button>
              </div>

              <div className="p-5 space-y-5">
                {/* Period info */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Period',  value: selectedSub.period,  icon: BookMarked  },
                    { label: 'Time',    value: selectedSub.time,    icon: Clock       },
                    { label: 'Class',   value: selectedSub.class,   icon: Users       },
                    { label: 'Subject', value: selectedSub.subject, icon: BookOpen    },
                  ].map(item => (
                    <div key={item.label} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <item.icon size={13} className="text-slate-400 mb-1" />
                      <p className="text-[13px] font-bold text-slate-700">{item.value}</p>
                      <p className="text-[10px] text-slate-400">{item.label}</p>
                    </div>
                  ))}
                </div>

                {/* Status + date */}
                <div className="flex items-center gap-2">
                  <StatusBadge status={selectedSub.status} />
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <CalendarDays size={10} /> {selectedSub.date}
                  </span>
                </div>

                {/* Absent teacher */}
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2">Absent Teacher</p>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-rose-50 border border-rose-200">
                    <div className={`w-9 h-9 rounded-full ${selectedSub.absentTeacher.color} flex items-center justify-center text-white text-[11px] font-bold shrink-0`}>
                      {selectedSub.absentTeacher.avatar}
                    </div>
                    <div>
                      <p className="text-[12px] font-semibold text-slate-700">{selectedSub.absentTeacher.name}</p>
                      <p className="text-[10px] text-slate-500">Reason: {selectedSub.reason}</p>
                    </div>
                  </div>
                </div>

                {/* Substitute teacher */}
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2">Substitute Teacher</p>
                  {selectedSub.substituteTeacher ? (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                      <div className={`w-9 h-9 rounded-full ${selectedSub.substituteTeacher.color} flex items-center justify-center text-white text-[11px] font-bold shrink-0`}>
                        {selectedSub.substituteTeacher.avatar}
                      </div>
                      <div className="flex-1">
                        <p className="text-[12px] font-semibold text-slate-700">{selectedSub.substituteTeacher.name}</p>
                        <p className="text-[10px] text-slate-500">{TEACHERS.find(t => t.id === selectedSub.substituteTeacher.id)?.subject}</p>
                      </div>
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-5 gap-3 rounded-xl bg-amber-50 border border-amber-200">
                      <UserX size={22} className="text-amber-400" />
                      <p className="text-[12px] text-amber-700 font-medium">No substitute assigned yet</p>
                      <button
                        onClick={() => setAssignModal(selectedSub)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-500 text-white text-[11px] font-semibold hover:bg-indigo-600 transition-colors"
                      >
                        <Plus size={11} /> Assign Substitute
                      </button>
                    </div>
                  )}
                </div>

                {/* Parent notification */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <Bell size={13} className="text-slate-400" />
                    <p className="text-[12px] text-slate-600 font-medium">Parents Notified</p>
                  </div>
                  {selectedSub.notifiedParents
                    ? <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600"><CheckCircle2 size={12} /> Yes</span>
                    : <button className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:underline"><Bell size={11} /> Notify now</button>
                  }
                </div>

                {/* Actions */}
                {selectedSub.status !== 'completed' && (
                  <div className="space-y-2 pt-1">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Actions</p>
                    {selectedSub.status === 'pending' && (
                      <button
                        onClick={() => setAssignModal(selectedSub)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-[12px] font-semibold transition-colors"
                      >
                        <Plus size={13} /> Assign Substitute
                      </button>
                    )}
                    {selectedSub.substituteTeacher && (
                      <button
                        onClick={() => setAssignModal(selectedSub)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-[12px] font-semibold hover:bg-slate-50 transition-colors"
                      >
                        <Edit2 size={13} /> Change Substitute
                      </button>
                    )}
                    <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 text-[12px] font-semibold transition-colors">
                      <Trash2 size={13} /> Remove Substitution
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}