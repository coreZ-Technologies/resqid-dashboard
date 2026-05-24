'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Users, UserCheck, UsersRound, CalendarCheck,
  AlertTriangle, Bell, TrendingUp, TrendingDown,
  ArrowRight, Clock, CheckCircle2, XCircle,
  AlertCircle, Activity, Shield, MessageCircle,
  BarChart2, Lock, Zap, ChevronRight, UserPlus,
  RefreshCw, Wifi, WifiOff, MapPin, Star
} from 'lucide-react'

// ── Mock Data ──────────────────────────────────────────────

const PLAN = 'standard' // change to test locked modules

const KPI = [
  { id: 'students',   label: 'Total Students',  value: 342,   change: +8,   unit: '',  icon: Users,       color: 'bg-sky-500',     href: '/school/students' },
  { id: 'teachers',   label: 'Total Teachers',  value: 28,    change: +1,   unit: '',  icon: UserCheck,   color: 'bg-violet-500',  href: '/school/teachers' },
  { id: 'parents',    label: 'Parents Linked',  value: 289,   change: +12,  unit: '',  icon: UsersRound,  color: 'bg-emerald-500', href: '/school/parents' },
  { id: 'attendance', label: "Today's Attendance", value: 91.4, change: -1.2, unit: '%', icon: CalendarCheck, color: 'bg-amber-500', href: '/school/attendance' },
]

// Today's attendance by class
const CLASS_ATTENDANCE = [
  { cls: 'Class 5-A', total: 32, present: 30, absent: 2 },
  { cls: 'Class 6-B', total: 30, present: 27, absent: 3 },
  { cls: 'Class 7-A', total: 34, present: 34, absent: 0 },
  { cls: 'Class 8-B', total: 31, present: 28, absent: 3 },
  { cls: 'Class 9-A', total: 33, present: 29, absent: 4 },
  { cls: 'Class 10-B',total: 29, present: 26, absent: 3 },
]

// Weekly attendance trend (Mon–Sat)
const WEEKLY_TREND = [
  { day: 'Mon', pct: 94.2 },
  { day: 'Tue', pct: 91.8 },
  { day: 'Wed', pct: 95.1 },
  { day: 'Thu', pct: 88.6 },
  { day: 'Fri', pct: 92.3 },
  { day: 'Sat', pct: 91.4 },
]

// Recent RFID activity
const RECENT_ACTIVITY = [
  { id: 1, name: 'Priya Sharma',     cls: 'Class 8-A', rfid: 'RFID-2341', type: 'check_in',  time: '8:02 AM',  avatar: 'PS', color: 'bg-blue-500' },
  { id: 2, name: 'Rohit Dey',        cls: 'Class 10-A',rfid: 'RFID-1891', type: 'check_in',  time: '8:05 AM',  avatar: 'RD', color: 'bg-emerald-500' },
  { id: 3, name: 'Sneha Bose',       cls: 'Class 7-C', rfid: 'RFID-3012', type: 'absent',    time: '8:45 AM',  avatar: 'SB', color: 'bg-rose-500' },
  { id: 4, name: 'Dev Chatterjee',   cls: 'Class 9-B', rfid: 'RFID-4201', type: 'late',      time: '9:12 AM',  avatar: 'DC', color: 'bg-amber-500' },
  { id: 5, name: 'Kavya Nair',       cls: 'Class 6-A', rfid: 'RFID-5101', type: 'check_in',  time: '7:58 AM',  avatar: 'KN', color: 'bg-pink-500' },
  { id: 6, name: 'Arjun Sharma',     cls: 'Class 5-B', rfid: 'RFID-2342', type: 'check_in',  time: '8:01 AM',  avatar: 'AS', color: 'bg-violet-500' },
]

// Low attendance students (needs attention)
const LOW_ATTENDANCE = [
  { name: 'Sneha Bose',    cls: 'Class 7-C', pct: 68, avatar: 'SB', color: 'bg-rose-500',   absents: 14 },
  { name: 'Rahul Gupta',   cls: 'Class 11-B',pct: 72, avatar: 'RG', color: 'bg-indigo-500', absents: 11 },
  { name: 'Dev Chatterjee',cls: 'Class 9-B', pct: 74, avatar: 'DC', color: 'bg-amber-500',  absents: 10 },
  { name: 'Meena Sinha',   cls: 'Class 6-A', pct: 76, avatar: 'MS', color: 'bg-cyan-500',   absents: 9  },
]

// Notifications
const NOTIFICATIONS = [
  { id: 1, type: 'alert',   msg: 'Emergency drill scheduled for tomorrow 10 AM', time: '1h ago',   read: false },
  { id: 2, type: 'info',    msg: '12 parents have unread notifications',          time: '2h ago',   read: false },
  { id: 3, type: 'warning', msg: 'Sneha Bose attendance below 75% threshold',     time: '3h ago',   read: false },
  { id: 4, type: 'success', msg: 'Monthly report for May 2026 is ready',          time: 'Yesterday',read: true  },
]

// Today's period snapshot
const TODAY_PERIODS = [
  { period: 'P1', time: '8:00–8:45',  subject: 'Mathematics',  teacher: 'Mr. S. Kumar',  status: 'done' },
  { period: 'P2', time: '8:45–9:30',  subject: 'English',      teacher: 'Ms. P. Nair',   status: 'done' },
  { period: 'P3', time: '9:45–10:30', subject: 'Science',      teacher: 'Mr. A. Das',    status: 'ongoing' },
  { period: 'P4', time: '10:30–11:15',subject: 'History',      teacher: 'Ms. S. Roy',    status: 'upcoming' },
  { period: 'P5', time: '11:45–12:30',subject: 'Comp. Sci.',   teacher: 'Mr. R. Sen',    status: 'upcoming' },
]

const ACTIVITY_STYLE = {
  check_in: { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50', label: 'Check In' },
  absent:   { icon: XCircle,      color: 'text-rose-500',    bg: 'bg-rose-50',    label: 'Absent'   },
  late:     { icon: AlertCircle,  color: 'text-amber-500',   bg: 'bg-amber-50',   label: 'Late'     },
}

const NOTIF_STYLE = {
  alert:   { color: 'text-rose-500',    bg: 'bg-rose-50',    border: 'border-rose-100',   icon: AlertTriangle },
  warning: { color: 'text-amber-500',   bg: 'bg-amber-50',   border: 'border-amber-100',  icon: AlertCircle },
  info:    { color: 'text-sky-500',     bg: 'bg-sky-50',     border: 'border-sky-100',    icon: Bell },
  success: { color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100',icon: CheckCircle2 },
}

const PERIOD_STYLE = {
  done:     { label: 'Done',    color: 'text-slate-400',   bg: 'bg-slate-50',    border: 'border-slate-100' },
  ongoing:  { label: 'Ongoing', color: 'text-emerald-600', bg: 'bg-emerald-50',  border: 'border-emerald-200' },
  upcoming: { label: 'Next',    color: 'text-sky-600',     bg: 'bg-sky-50',      border: 'border-sky-100' },
}

// ── Sub-components ─────────────────────────────────────────

// KPI Card
function KpiCard({ icon: Icon, label, value, change, unit, color, href }) {
  const positive = change >= 0
  return (
    <Link href={href} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
      <div className="flex items-center justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
          <Icon size={18} className="text-white" />
        </div>
        <div className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg ${
          positive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
        }`}>
          {positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {positive ? '+' : ''}{change}{unit}
        </div>
      </div>
      <div>
        <p className="text-[26px] font-bold text-slate-800 leading-tight">
          {value}{unit}
        </p>
        <p className="text-[12px] text-slate-500 mt-0.5">{label}</p>
      </div>
      <div className="flex items-center gap-1 text-[11px] text-slate-400 group-hover:text-sky-500 transition-colors">
        View details <ArrowRight size={11} />
      </div>
    </Link>
  )
}

// Mini bar chart for weekly trend
function TrendBar({ day, pct }) {
  const color = pct >= 93 ? 'bg-emerald-400' : pct >= 88 ? 'bg-amber-400' : 'bg-rose-400'
  const isToday = day === 'Sat'
  return (
    <div className="flex flex-col items-center gap-1.5 flex-1">
      <span className="text-[10px] font-semibold text-slate-600">{pct}%</span>
      <div className="w-full bg-slate-100 rounded-full overflow-hidden" style={{ height: 80 }}>
        <div
          className={`w-full ${color} rounded-full transition-all ${isToday ? 'opacity-100' : 'opacity-70'}`}
          style={{ height: `${pct}%`, marginTop: `${100 - pct}%` }}
        />
      </div>
      <span className={`text-[10px] font-medium ${isToday ? 'text-sky-600 font-bold' : 'text-slate-400'}`}>{day}</span>
    </div>
  )
}

// Quick action button
function QuickAction({ icon: Icon, label, href, color, locked }) {
  if (locked) return (
    <div className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed">
      <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center">
        <Lock size={15} className="text-slate-400" />
      </div>
      <p className="text-[11px] text-slate-400 font-medium text-center leading-tight">{label}</p>
    </div>
  )
  return (
    <Link href={href} className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-slate-100 bg-white hover:border-sky-200 hover:bg-sky-50/40 hover:shadow-sm transition-all group">
      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
        <Icon size={15} className="text-white" />
      </div>
      <p className="text-[11px] text-slate-600 font-medium text-center leading-tight">{label}</p>
    </Link>
  )
}

// ── Main Dashboard ─────────────────────────────────────────
export default function DashboardPage() {
  const [activityFilter, setActivityFilter] = useState('all')

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })

  const totalPresent = CLASS_ATTENDANCE.reduce((a, c) => a + c.present, 0)
  const totalStudents = CLASS_ATTENDANCE.reduce((a, c) => a + c.total, 0)
  const totalAbsent = totalStudents - totalPresent

  const filteredActivity = activityFilter === 'all'
    ? RECENT_ACTIVITY
    : RECENT_ACTIVITY.filter(a => a.type === activityFilter)

  const unreadNotifs = NOTIFICATIONS.filter(n => !n.read).length

  return (
    <div className="p-6 space-y-6">

      {/* ── Header ── */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-slate-800">Good morning, Animesh 👋</h1>
          <p className="text-slate-500 text-[13px] mt-0.5">{today} · Springdale Public School</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Live RFID indicator */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[12px] text-emerald-700 font-medium">RFID Live</span>
          </div>
          <Link
            href="/school/attendance"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 text-white text-[13px] font-medium hover:bg-sky-600 transition-colors shadow-sm shadow-sky-200"
          >
            <CalendarCheck size={14} /> View Attendance
          </Link>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI.map(k => <KpiCard key={k.id} {...k} />)}
      </div>

      {/* ── Today's Attendance Summary + Weekly Trend ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Today's class-wise attendance */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
            <div>
              <p className="text-[14px] font-bold text-slate-800">Today's Attendance</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{totalPresent} present · {totalAbsent} absent · {totalStudents} total</p>
            </div>
            <Link href="/school/attendance" className="text-[12px] text-sky-500 hover:text-sky-600 font-medium flex items-center gap-1">
              Full report <ChevronRight size={12} />
            </Link>
          </div>

          {/* Big attendance circle */}
          <div className="px-5 pt-4 pb-2 flex items-center gap-6">
            <div className="relative w-20 h-20 shrink-0">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="32" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                <circle
                  cx="40" cy="40" r="32" fill="none"
                  stroke="#22c55e" strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 32}`}
                  strokeDashoffset={`${2 * Math.PI * 32 * (1 - totalPresent / totalStudents)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-[14px] font-bold text-slate-800">{Math.round((totalPresent / totalStudents) * 100)}%</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-center">
                <p className="text-[22px] font-bold text-emerald-600">{totalPresent}</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Present</p>
              </div>
              <div className="text-center">
                <p className="text-[22px] font-bold text-rose-500">{totalAbsent}</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Absent</p>
              </div>
              <div className="text-center">
                <p className="text-[22px] font-bold text-slate-700">{totalStudents}</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Total</p>
              </div>
            </div>
          </div>

          {/* Class-wise bars */}
          <div className="px-5 pb-5 space-y-2.5 mt-2">
            {CLASS_ATTENDANCE.map(c => {
              const pct = Math.round((c.present / c.total) * 100)
              const barColor = pct === 100 ? 'bg-emerald-400' : pct >= 90 ? 'bg-sky-400' : pct >= 80 ? 'bg-amber-400' : 'bg-rose-400'
              return (
                <div key={c.cls} className="flex items-center gap-3">
                  <p className="text-[11px] font-semibold text-slate-600 w-[72px] shrink-0">{c.cls}</p>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${barColor} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-[11px] font-bold text-slate-600 w-8 text-right">{pct}%</p>
                  {c.absent > 0 && (
                    <span className="text-[10px] text-rose-500 font-medium w-12 text-right">{c.absent} abs.</span>
                  )}
                  {c.absent === 0 && (
                    <span className="text-[10px] text-emerald-500 font-medium w-12 text-right">Full ✓</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Weekly trend */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[14px] font-bold text-slate-800">Weekly Trend</p>
              <p className="text-[11px] text-slate-400 mt-0.5">This week's attendance</p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center">
              <BarChart2 size={14} className="text-sky-500" />
            </div>
          </div>
          <div className="flex items-end gap-2 h-[160px]">
            {WEEKLY_TREND.map(t => <TrendBar key={t.day} {...t} />)}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Week avg.</span>
            <span className="font-bold text-slate-700">
              {(WEEKLY_TREND.reduce((a, t) => a + t.pct, 0) / WEEKLY_TREND.length).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* ── Activity Feed + Notifications + Low Attendance ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Recent RFID Activity */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
            <div>
              <p className="text-[14px] font-bold text-slate-800">Live Activity</p>
              <p className="text-[11px] text-slate-400 mt-0.5">RFID check-ins today</p>
            </div>
            <div className="flex items-center gap-1">
              {['all', 'check_in', 'late', 'absent'].map(f => (
                <button
                  key={f}
                  onClick={() => setActivityFilter(f)}
                  className={`px-2 py-1 rounded-lg text-[9px] font-semibold uppercase tracking-wide transition-all ${
                    activityFilter === f ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {f === 'check_in' ? 'In' : f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="divide-y divide-slate-50">
            {filteredActivity.map(a => {
              const st = ACTIVITY_STYLE[a.type]
              return (
                <div key={a.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50/50 transition-colors">
                  <div className={`w-8 h-8 rounded-full ${a.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                    {a.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-slate-700 truncate">{a.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{a.cls} · {a.rfid}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-md ${st.bg} ${st.color}`}>
                      <st.icon size={9} /> {st.label}
                    </span>
                    <span className="text-[10px] text-slate-400">{a.time}</span>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="px-5 py-3 border-t border-slate-50">
            <Link href="/school/activity-log" className="text-[12px] text-sky-500 hover:text-sky-600 font-medium flex items-center gap-1">
              View full log <ChevronRight size={12} />
            </Link>
          </div>
        </div>

        {/* Low Attendance Alert + Notifications */}
        <div className="lg:col-span-1 space-y-5">

          {/* Low Attendance */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
              <div>
                <p className="text-[14px] font-bold text-slate-800">Needs Attention</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Below 80% attendance</p>
              </div>
              <div className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center">
                <AlertTriangle size={13} className="text-rose-500" />
              </div>
            </div>
            <div className="divide-y divide-slate-50">
              {LOW_ATTENDANCE.map(s => {
                const barColor = s.pct < 70 ? 'bg-rose-400' : s.pct < 75 ? 'bg-orange-400' : 'bg-amber-400'
                return (
                  <div key={s.name} className="flex items-center gap-3 px-5 py-3">
                    <div className={`w-8 h-8 rounded-full ${s.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                      {s.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-[12px] font-semibold text-slate-700 truncate">{s.name}</p>
                        <span className="text-[11px] font-bold text-rose-600 shrink-0 ml-2">{s.pct}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${barColor} rounded-full`} style={{ width: `${s.pct}%` }} />
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0">{s.absents} abs.</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="px-5 py-3 border-t border-slate-50">
              <Link href="/school/reports" className="text-[12px] text-sky-500 hover:text-sky-600 font-medium flex items-center gap-1">
                View full report <ChevronRight size={12} />
              </Link>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
              <div className="flex items-center gap-2">
                <p className="text-[14px] font-bold text-slate-800">Notifications</p>
                {unreadNotifs > 0 && (
                  <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">{unreadNotifs}</span>
                )}
              </div>
              <Link href="/school/notifications" className="text-[11px] text-sky-500 font-medium">See all</Link>
            </div>
            <div className="divide-y divide-slate-50">
              {NOTIFICATIONS.map(n => {
                const st = NOTIF_STYLE[n.type]
                return (
                  <div key={n.id} className={`flex items-start gap-3 px-5 py-3 transition-colors ${n.read ? '' : 'bg-blue-50/20'}`}>
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${st.bg} border ${st.border}`}>
                      <st.icon size={12} className={st.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[12px] leading-snug ${n.read ? 'text-slate-500' : 'text-slate-700 font-medium'}`}>{n.msg}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{n.time}</p>
                    </div>
                    {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5" />}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Today's Timetable + Quick Actions */}
        <div className="lg:col-span-1 space-y-5">

          {/* Today's Timetable snapshot */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
              <div>
                <p className="text-[14px] font-bold text-slate-800">Today's Schedule</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Class 8-A · Sunday</p>
              </div>
              <Link href="/school/timetable" className="text-[11px] text-sky-500 font-medium">Full view</Link>
            </div>
            <div className="divide-y divide-slate-50">
              {TODAY_PERIODS.map(p => {
                const st = PERIOD_STYLE[p.status]
                return (
                  <div key={p.period} className={`flex items-center gap-3 px-5 py-3 ${p.status === 'ongoing' ? 'bg-emerald-50/40' : ''}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${st.bg} ${st.border}`}>
                      <span className={`text-[10px] font-bold ${st.color}`}>{p.period}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[12px] font-semibold truncate ${p.status === 'done' ? 'text-slate-400' : 'text-slate-700'}`}>{p.subject}</p>
                      <p className="text-[10px] text-slate-400 truncate">{p.teacher} · {p.time}</p>
                    </div>
                    {p.status === 'ongoing' && (
                      <span className="text-[9px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full animate-pulse">LIVE</span>
                    )}
                    {p.status === 'done' && (
                      <CheckCircle2 size={13} className="text-slate-300 shrink-0" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <p className="text-[14px] font-bold text-slate-800 mb-1">Quick Actions</p>
            <p className="text-[11px] text-slate-400 mb-4">Shortcuts to common tasks</p>
            <div className="grid grid-cols-3 gap-3">
              <QuickAction icon={UserPlus}       label="Add Student"   href="/school/students/add"  color="bg-sky-500" />
              <QuickAction icon={UserCheck}      label="Add Teacher"   href="/school/teachers/add"  color="bg-violet-500" />
              <QuickAction icon={UsersRound}     label="Add Parent"    href="/school/parents/add"   color="bg-emerald-500" />
              <QuickAction icon={CalendarCheck}  label="Attendance"    href="/school/attendance"    color="bg-amber-500" />
              <QuickAction icon={BarChart2}      label="Reports"       href="/school/reports"       color="bg-indigo-500" />
              <QuickAction icon={Bell}           label="Notify All"    href="/school/notifications" color="bg-rose-500" />
            </div>
          </div>

          {/* Plan upgrade banner — shown because plan is 'standard' */}
          {(PLAN === 'basic' || PLAN === 'standard') && (
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/5 -translate-y-6 translate-x-6" />
              <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-white/5 translate-y-4 -translate-x-4" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={14} className="text-amber-400" />
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Upgrade Available</span>
                </div>
                <p className="text-white font-bold text-[14px] mb-1">Unlock Emergency Alerts</p>
                <p className="text-slate-400 text-[11px] mb-4">Get real-time SOS alerts, zone mapping, and RFID emergency triggers with the Professional plan.</p>
                <Link
                  href="/school/upgrade"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 text-slate-900 text-[12px] font-bold hover:bg-amber-300 transition-colors"
                >
                  <Zap size={12} /> Upgrade Now
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  )
}