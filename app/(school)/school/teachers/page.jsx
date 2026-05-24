'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Search, UserPlus, Download, MoreHorizontal,
  Mail, Phone, BookOpen, Users, Star, Award,
  CheckCircle2, Clock, AlertCircle, ChevronRight,
  Eye, Send, Edit2, Trash2, Filter
} from 'lucide-react'

// ── Data ───────────────────────────────────────────────────
const TEACHERS = [
  {
    id: 1,
    name: 'Mr. Suresh Kumar',
    email: 'suresh.kumar@springdale.in',
    phone: '+91 98765 43210',
    avatar: 'SK',
    avatarColor: 'bg-blue-500',
    subject: 'Mathematics',
    subjectColor: 'bg-blue-50 text-blue-700 border-blue-200',
    classes: ['Class 8-A', 'Class 9-B', 'Class 10-A'],
    experience: '8 yrs',
    status: 'active',
    rating: 4.8,
    periodsPerWeek: 18,
    joinedDate: 'Jan 2020',
    qualification: 'M.Sc Mathematics',
  },
  {
    id: 2,
    name: 'Ms. Priya Nair',
    email: 'priya.nair@springdale.in',
    phone: '+91 87654 32109',
    avatar: 'PN',
    avatarColor: 'bg-violet-500',
    subject: 'English',
    subjectColor: 'bg-violet-50 text-violet-700 border-violet-200',
    classes: ['Class 6-A', 'Class 7-B', 'Class 8-A'],
    experience: '5 yrs',
    status: 'active',
    rating: 4.6,
    periodsPerWeek: 15,
    joinedDate: 'Mar 2022',
    qualification: 'M.A English Literature',
  },
  {
    id: 3,
    name: 'Mr. Amit Das',
    email: 'amit.das@springdale.in',
    phone: '+91 76543 21098',
    avatar: 'AD',
    avatarColor: 'bg-emerald-500',
    subject: 'Science',
    subjectColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    classes: ['Class 9-A', 'Class 10-B'],
    experience: '10 yrs',
    status: 'active',
    rating: 4.9,
    periodsPerWeek: 20,
    joinedDate: 'Jun 2018',
    qualification: 'M.Sc Physics',
  },
  {
    id: 4,
    name: 'Ms. Sunita Roy',
    email: 'sunita.roy@springdale.in',
    phone: '+91 65432 10987',
    avatar: 'SR',
    avatarColor: 'bg-rose-500',
    subject: 'History',
    subjectColor: 'bg-amber-50 text-amber-700 border-amber-200',
    classes: ['Class 7-A', 'Class 8-B', 'Class 9-A'],
    experience: '6 yrs',
    status: 'on_leave',
    rating: 4.4,
    periodsPerWeek: 12,
    joinedDate: 'Aug 2021',
    qualification: 'M.A History',
  },
  {
    id: 5,
    name: 'Mr. Rakesh Sen',
    email: 'rakesh.sen@springdale.in',
    phone: '+91 54321 09876',
    avatar: 'RS',
    avatarColor: 'bg-amber-500',
    subject: 'Computer Science',
    subjectColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    classes: ['Class 10-A', 'Class 10-B', 'Class 11-A'],
    experience: '4 yrs',
    status: 'active',
    rating: 4.7,
    periodsPerWeek: 16,
    joinedDate: 'Jan 2023',
    qualification: 'B.Tech CSE',
  },
  {
    id: 6,
    name: 'Ms. Meena Ghosh',
    email: 'meena.ghosh@springdale.in',
    phone: '+91 43210 98765',
    avatar: 'MG',
    avatarColor: 'bg-cyan-500',
    subject: 'Geography',
    subjectColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    classes: ['Class 6-B', 'Class 7-A'],
    experience: '3 yrs',
    status: 'active',
    rating: 4.3,
    periodsPerWeek: 10,
    joinedDate: 'Jul 2024',
    qualification: 'M.A Geography',
  },
  {
    id: 7,
    name: 'Mr. Debashish Paul',
    email: 'debashish.paul@springdale.in',
    phone: '+91 32109 87654',
    avatar: 'DP',
    avatarColor: 'bg-orange-500',
    subject: 'Physical Education',
    subjectColor: 'bg-orange-50 text-orange-700 border-orange-200',
    classes: ['Class 5-A', 'Class 6-A', 'Class 7-B', 'Class 8-A'],
    experience: '7 yrs',
    status: 'active',
    rating: 4.5,
    periodsPerWeek: 22,
    joinedDate: 'Feb 2019',
    qualification: 'B.P.Ed',
  },
  {
    id: 8,
    name: 'Ms. Ananya Bose',
    email: 'ananya.bose@springdale.in',
    phone: '+91 21098 76543',
    avatar: 'AB',
    avatarColor: 'bg-pink-500',
    subject: 'Art & Craft',
    subjectColor: 'bg-rose-50 text-rose-700 border-rose-200',
    classes: ['Class 5-A', 'Class 5-B', 'Class 6-A'],
    experience: '2 yrs',
    status: 'inactive',
    rating: 4.1,
    periodsPerWeek: 8,
    joinedDate: 'Sep 2024',
    qualification: 'B.F.A',
  },
]

const STATUS_STYLE = {
  active:   { label: 'Active',    dot: 'bg-emerald-400', text: 'text-emerald-600', badge: 'bg-emerald-50 border-emerald-200' },
  on_leave: { label: 'On Leave',  dot: 'bg-amber-400',   text: 'text-amber-600',   badge: 'bg-amber-50 border-amber-200' },
  inactive: { label: 'Inactive',  dot: 'bg-slate-300',   text: 'text-slate-500',   badge: 'bg-slate-50 border-slate-200' },
}

// ── Stat Card ──────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-start gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={18} className="text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800 leading-tight">{value}</p>
        <p className="text-[12px] text-slate-500 mt-0.5">{label}</p>
        {sub && <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

// ── Teacher Card ───────────────────────────────────────────
function TeacherCard({ teacher, onClick, selected }) {
  const st = STATUS_STYLE[teacher.status]
  return (
    <div
      onClick={() => onClick(teacher)}
      className={`bg-white rounded-2xl border shadow-sm p-5 cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
        selected ? 'border-sky-400 ring-2 ring-sky-100' : 'border-slate-100'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl ${teacher.avatarColor} flex items-center justify-center text-white text-[13px] font-bold shrink-0`}>
            {teacher.avatar}
          </div>
          <div>
            <p className="text-[14px] font-semibold text-slate-800">{teacher.name}</p>
            <p className="text-[11px] text-slate-400">{teacher.qualification}</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium border ${st.badge} ${st.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
          {st.label}
        </span>
      </div>

      {/* Subject badge */}
      <div className="mb-3">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${teacher.subjectColor}`}>
          <BookOpen size={10} />
          {teacher.subject}
        </span>
      </div>

      {/* Classes */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {teacher.classes.map(cls => (
          <span key={cls} className="bg-slate-50 border border-slate-100 text-slate-500 text-[10px] font-medium px-2 py-0.5 rounded-md">
            {cls}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-50 pt-3">
        <div className="flex items-center gap-1">
          <Clock size={11} />
          <span>{teacher.periodsPerWeek} periods/wk</span>
        </div>
        <div className="flex items-center gap-1">
          <Star size={11} className="text-amber-400 fill-amber-400" />
          <span className="text-slate-600 font-medium">{teacher.rating}</span>
        </div>
      </div>
    </div>
  )
}

// ── Detail Panel ───────────────────────────────────────────
function DetailPanel({ teacher, onClose }) {
  if (!teacher) return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8">
      <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4">
        <Users size={24} className="text-slate-300" />
      </div>
      <p className="text-slate-500 font-medium">Select a teacher</p>
      <p className="text-slate-400 text-[12px] mt-1">Click any card to view full details</p>
    </div>
  )

  const st = STATUS_STYLE[teacher.status]

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-700 to-slate-900 p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-slate-400 text-[11px] font-medium uppercase tracking-widest">Teacher Profile</span>
          <button onClick={onClose} className="text-white/60 hover:text-white text-[11px] transition-colors">✕ Close</button>
        </div>
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl ${teacher.avatarColor} flex items-center justify-center text-white text-[16px] font-bold border-2 border-white/20 shadow-lg`}>
            {teacher.avatar}
          </div>
          <div>
            <h3 className="text-white font-bold text-[16px]">{teacher.name}</h3>
            <p className="text-slate-300 text-[12px]">{teacher.qualification}</p>
            <span className={`inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-white/10 text-white border border-white/20`}>
              <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
              {st.label}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Contact */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-3">Contact Info</p>
          <div className="space-y-2">
            {[
              { icon: Mail,  val: teacher.email },
              { icon: Phone, val: teacher.phone },
            ].map(({ icon: Icon, val }) => (
              <div key={val} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <Icon size={13} className="text-slate-400 shrink-0" />
                <span className="text-[12px] text-slate-600">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-3">Overview</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Subject',      val: teacher.subject },
              { label: 'Experience',   val: teacher.experience },
              { label: 'Periods/Week', val: teacher.periodsPerWeek },
              { label: 'Joined',       val: teacher.joinedDate },
            ].map(({ label, val }) => (
              <div key={label} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <p className="text-[10px] text-slate-400 mb-1">{label}</p>
                <p className="text-[12px] font-semibold text-slate-700">{val}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center shrink-0">
            <Star size={18} className="text-white fill-white" />
          </div>
          <div>
            <p className="text-[20px] font-bold text-amber-700 leading-tight">{teacher.rating}</p>
            <p className="text-[11px] text-amber-600">Average rating</p>
          </div>
        </div>

        {/* Classes */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-3">
            Assigned Classes ({teacher.classes.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {teacher.classes.map(cls => (
              <span key={cls} className="bg-slate-50 border border-slate-200 text-slate-600 text-[12px] font-medium px-3 py-1.5 rounded-xl">
                {cls}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-3">Quick Actions</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: Mail,  label: 'Send Email',   color: 'bg-sky-500' },
              { icon: Edit2, label: 'Edit Profile',  color: 'bg-violet-500' },
              { icon: Eye,   label: 'View Schedule', color: 'bg-emerald-500' },
              { icon: Send,  label: 'Message',       color: 'bg-amber-500' },
            ].map(({ icon: Icon, label, color }) => (
              <button key={label} className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-white text-[12px] font-medium ${color} hover:opacity-90 transition-opacity`}>
                <Icon size={13} /> {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────
export default function TeachersPage() {
  const [search, setSearch]       = useState('')
  const [statusFilter, setStatus] = useState('all')
  const [selected, setSelected]   = useState(null)

  const filtered = TEACHERS.filter(t => {
    const matchSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || t.status === statusFilter
    return matchSearch && matchStatus
  })

  const activeCount   = TEACHERS.filter(t => t.status === 'active').length
  const onLeaveCount  = TEACHERS.filter(t => t.status === 'on_leave').length
  const totalPeriods  = TEACHERS.reduce((a, t) => a + t.periodsPerWeek, 0)
  const avgRating     = (TEACHERS.reduce((a, t) => a + t.rating, 0) / TEACHERS.length).toFixed(1)

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-slate-800">Teachers</h1>
          <p className="text-slate-500 text-[13px] mt-0.5">Manage teaching staff, subjects, and schedules</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-[13px] font-medium hover:bg-slate-50 transition-colors">
            <Download size={14} /> Export
          </button>
          <Link
            href="/school/teachers/add"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 text-white text-[13px] font-medium hover:bg-sky-600 transition-colors shadow-sm shadow-sky-200"
          >
            <UserPlus size={14} /> Add Teacher
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users}    label="Total Teachers"    value={TEACHERS.length} sub={`${activeCount} active`}         color="bg-sky-500" />
        <StatCard icon={Award}    label="Avg. Rating"       value={avgRating}       sub="Across all staff"                color="bg-amber-500" />
        <StatCard icon={BookOpen} label="Periods This Week" value={totalPeriods}    sub="All classes combined"            color="bg-violet-500" />
        <StatCard icon={Clock}    label="On Leave"          value={onLeaveCount}    sub="Currently unavailable"           color="bg-rose-500" />
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, subject, or email..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-all"
          />
        </div>
        <div className="flex gap-2">
          {[
            { id: 'all',      label: 'All' },
            { id: 'active',   label: 'Active' },
            { id: 'on_leave', label: 'On Leave' },
            { id: 'inactive', label: 'Inactive' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setStatus(f.id)}
              className={`px-3.5 py-2.5 rounded-xl text-[12px] font-medium transition-all border ${
                statusFilter === f.id
                  ? 'bg-sky-500 text-white border-sky-500 shadow-sm shadow-sky-200'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Cards */}
        <div className="xl:col-span-2">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4">
                <Users size={22} className="text-slate-300" />
              </div>
              <p className="text-slate-500 font-medium">No teachers found</p>
              <p className="text-slate-400 text-[12px] mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map(t => (
                <TeacherCard
                  key={t.id}
                  teacher={t}
                  onClick={setSelected}
                  selected={selected?.id === t.id}
                />
              ))}
            </div>
          )}
        </div>

        {/* Detail Panel */}
        <div className="xl:col-span-1">
          <DetailPanel teacher={selected} onClose={() => setSelected(null)} />
        </div>
      </div>

      {/* Summary Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50">
          <h2 className="text-[14px] font-semibold text-slate-700">Staff Directory</h2>
          <button className="text-[12px] text-sky-500 hover:text-sky-600 font-medium flex items-center gap-1">
            View All <ChevronRight size={12} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="text-left bg-slate-50/60">
                {['Teacher', 'Subject', 'Classes', 'Periods/Wk', 'Rating', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {TEACHERS.map(t => {
                const st = STATUS_STYLE[t.status]
                return (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => setSelected(t)}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`w-7 h-7 rounded-lg ${t.avatarColor} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                          {t.avatar}
                        </div>
                        <div>
                          <p className="font-medium text-slate-700">{t.name}</p>
                          <p className="text-slate-400 text-[10px]">{t.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${t.subjectColor}`}>
                        {t.subject}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {t.classes.slice(0, 2).map(c => (
                          <span key={c} className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-[10px]">{c}</span>
                        ))}
                        {t.classes.length > 2 && (
                          <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-[10px]">+{t.classes.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 font-medium">{t.periodsPerWeek}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <Star size={11} className="text-amber-400 fill-amber-400" />
                        <span className="font-semibold text-slate-700">{t.rating}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium border ${st.badge} ${st.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                        {st.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button className="p-1.5 rounded-lg hover:bg-sky-50 text-slate-400 hover:text-sky-500 transition-colors">
                          <Eye size={12} />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                          <MoreHorizontal size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}