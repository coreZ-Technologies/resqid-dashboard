'use client'

import { useState } from 'react'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import {
  Users, UserCheck, UsersRound, CalendarCheck, BarChart2,
  TrendingUp, TrendingDown, Download, Calendar, ChevronDown,
  ArrowUpRight, ArrowDownRight, FileText, AlertTriangle,
  Clock, BookOpen, Filter, RefreshCw,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Mock Data ────────────────────────────────────────────────────────────────

const attendanceMonthly = [
  { month: 'Aug', present: 92, absent: 8 },
  { month: 'Sep', present: 88, absent: 12 },
  { month: 'Oct', present: 95, absent: 5 },
  { month: 'Nov', present: 90, absent: 10 },
  { month: 'Dec', present: 85, absent: 15 },
  { month: 'Jan', present: 93, absent: 7 },
  { month: 'Feb', present: 91, absent: 9 },
  { month: 'Mar', present: 96, absent: 4 },
]

const classAttendance = [
  { class: 'Class 1', rate: 94 },
  { class: 'Class 2', rate: 88 },
  { class: 'Class 3', rate: 96 },
  { class: 'Class 4', rate: 82 },
  { class: 'Class 5', rate: 91 },
  { class: 'Class 6', rate: 87 },
  { class: 'Class 7', rate: 93 },
  { class: 'Class 8', rate: 89 },
]

const genderData = [
  { name: 'Male',   value: 312 },
  { name: 'Female', value: 288 },
  { name: 'Other',  value: 14  },
]

const enrollmentTrend = [
  { year: '2020', students: 480 },
  { year: '2021', students: 512 },
  { year: '2022', students: 548 },
  { year: '2023', students: 581 },
  { year: '2024', students: 614 },
]

const topAbsent = [
  { name: 'Riya Sharma',  class: 'Class 5A', absences: 18, trend: 'up'   },
  { name: 'Arjun Mehta',  class: 'Class 7B', absences: 15, trend: 'down' },
  { name: 'Priya Nair',   class: 'Class 3C', absences: 14, trend: 'up'   },
  { name: 'Karan Singh',  class: 'Class 8A', absences: 12, trend: 'down' },
  { name: 'Sneha Patel',  class: 'Class 6B', absences: 11, trend: 'up'   },
]

const PIE_COLORS = ['#2563eb', '#6366f1', '#93c5fd']

const DATE_RANGES = ['This Week', 'This Month', 'This Term', 'This Year']
const TABS        = ['Overview', 'Attendance', 'Students', 'Teachers']

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({ icon: Icon, label, value, change, positive, iconBg, iconColor }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', iconBg)}>
          <Icon size={18} className={iconColor} />
        </div>
        <span className={cn(
          'flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full',
          positive ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-500'
        )}>
          {positive ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
          {change}
        </span>
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-[12px] text-slate-400 mt-0.5">{label}</p>
      </div>
    </div>
  )
}

// ─── Section Card ─────────────────────────────────────────────────────────────

function SectionCard({ title, subtitle, action, children }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <p className="text-[13px] font-semibold text-slate-800">{title}</p>
          {subtitle && <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-slate-900 text-white text-[11px] rounded-lg px-3 py-2 shadow-xl">
      <p className="font-semibold mb-1 text-slate-300">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color ?? '#93c5fd' }}>
          {p.name}: <span className="font-bold">{p.value}{typeof p.value === 'number' && p.name !== 'Students' ? '%' : ''}</span>
        </p>
      ))}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ReportsPage() {
  const [activeTab,        setActiveTab]        = useState('Overview')
  const [dateRange,        setDateRange]        = useState('This Month')
  const [showDateDropdown, setShowDateDropdown] = useState(false)

  return (
    <div className="space-y-6">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Reports & Analytics</h1>
          <p className="text-[13px] text-slate-400 mt-0.5">
            Springdale Public School — Academic Year 2024–25
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Date range */}
          <div className="relative">
            <button
              onClick={() => setShowDateDropdown(v => !v)}
              className="flex items-center gap-2 text-[13px] border border-slate-200 rounded-lg px-3 py-2 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
            >
              <Calendar size={13} className="text-slate-400" />
              {dateRange}
              <ChevronDown size={13} className="text-slate-400" />
            </button>
            {showDateDropdown && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-slate-100 rounded-xl shadow-xl z-20 min-w-[150px] py-1">
                {DATE_RANGES.map(r => (
                  <button
                    key={r}
                    onClick={() => { setDateRange(r); setShowDateDropdown(false) }}
                    className={cn(
                      'w-full text-left px-4 py-2 text-[13px] hover:bg-blue-50 transition-colors',
                      dateRange === r ? 'text-blue-700 font-semibold' : 'text-slate-600'
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Export */}
          <button className="flex items-center gap-2 text-[13px] bg-blue-700 hover:bg-blue-800 text-white rounded-lg px-4 py-2 font-medium transition-colors">
            <Download size={13} />
            Export PDF
          </button>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 border-b border-slate-200">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-4 py-2.5 text-[13px] font-medium border-b-2 -mb-px transition-colors',
              activeTab === tab
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── KPI Row ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          icon={Users}
          label="Total Students"
          value="614"
          change="5.2%"
          positive
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
        <KpiCard
          icon={UserCheck}
          label="Total Teachers"
          value="42"
          change="2 new"
          positive
          iconBg="bg-indigo-50"
          iconColor="text-indigo-600"
        />
        <KpiCard
          icon={CalendarCheck}
          label="Avg. Attendance"
          value="91.4%"
          change="1.2%"
          positive
          iconBg="bg-sky-50"
          iconColor="text-sky-600"
        />
        <KpiCard
          icon={AlertTriangle}
          label="At-Risk Students"
          value="23"
          change="3 more"
          positive={false}
          iconBg="bg-red-50"
          iconColor="text-red-500"
        />
      </div>

      {/* ── Row 2: Attendance Trend + Demographics ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Attendance Trend — spans 2 cols */}
        <div className="lg:col-span-2">
          <SectionCard
            title="Monthly Attendance Trend"
            subtitle="Present vs Absent rate across the academic year"
            action={
              <button className="flex items-center gap-1.5 text-[11px] text-blue-600 font-medium hover:underline">
                <FileText size={11} /> Full Report
              </button>
            }
          >
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={attendanceMonthly} barCategoryGap="32%" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={v => `${v}%`} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f8fafc' }} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} iconType="circle" iconSize={8} />
                <Bar dataKey="present" name="Present" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="absent"  name="Absent"  fill="#dbeafe" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </SectionCard>
        </div>

        {/* Gender Breakdown */}
        <SectionCard title="Student Demographics" subtitle="Gender distribution">
          <ResponsiveContainer width="100%" height={185}>
            <PieChart>
              <Pie
                data={genderData}
                cx="50%" cy="50%"
                innerRadius={52} outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {genderData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v, n) => [`${v} students`, n]}
                contentStyle={{ fontSize: '12px', borderRadius: '10px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-2 mt-1">
            {genderData.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                  <span className="text-[12px] text-slate-500">{item.name}</span>
                </div>
                <span className="text-[12px] font-semibold text-slate-700">{item.value}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* ── Row 3: Class-wise + Enrollment ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Class-wise Attendance */}
        <SectionCard title="Class-wise Attendance" subtitle="Average rate per class — colour coded by threshold">
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={classAttendance} layout="vertical" barCategoryGap="20%" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" domain={[70, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <YAxis dataKey="class" type="category" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} width={55} />
              <Tooltip
                formatter={v => [`${v}%`, 'Attendance']}
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ fontSize: '12px', borderRadius: '10px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="rate" radius={[0, 4, 4, 0]}>
                {classAttendance.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.rate >= 90 ? '#2563eb' : entry.rate >= 85 ? '#f59e0b' : '#ef4444'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className="flex items-center gap-4 mt-3">
            {[
              { color: '#2563eb', label: '≥90% Good'      },
              { color: '#f59e0b', label: '85–89% Average'  },
              { color: '#ef4444', label: '<85% At Risk'     },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} />
                <span className="text-[11px] text-slate-400">{l.label}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Enrollment Trend */}
        <SectionCard title="Enrollment Trend" subtitle="Total student count year over year">
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={enrollmentTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[400, 700]} />
              <Tooltip
                formatter={v => [v, 'Students']}
                content={<ChartTooltip />}
              />
              <Line
                type="monotone"
                dataKey="students"
                name="Students"
                stroke="#2563eb"
                strokeWidth={2.5}
                dot={{ fill: '#2563eb', r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#1d4ed8', strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      {/* ── High Absenteeism Table ── */}
      <SectionCard
        title="High Absenteeism Alert"
        subtitle="Students with the most absences this term"
        action={
          <button className="text-[11px] text-blue-600 font-medium hover:underline">
            View All
          </button>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                {['#', 'Student', 'Class', 'Total Absences', 'Trend'].map(h => (
                  <th key={h} className="text-left text-[11px] font-semibold uppercase tracking-wider text-slate-300 pb-3 pr-4 last:pr-0">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topAbsent.map((s, i) => (
                <tr key={s.name} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 pr-4 text-[12px] text-slate-300 font-mono w-6">{i + 1}</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 text-[11px] font-bold shrink-0">
                        {s.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-[13px] font-medium text-slate-700">{s.name}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="text-[12px] text-slate-400">{s.class}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={cn(
                      'inline-flex items-center gap-1 text-[12px] font-semibold',
                      s.absences >= 15 ? 'text-red-500' : s.absences >= 12 ? 'text-amber-500' : 'text-slate-600'
                    )}>
                      <Clock size={11} />
                      {s.absences} days
                    </span>
                  </td>
                  <td className="py-3">
                    {s.trend === 'up'
                      ? <span className="flex items-center gap-1 text-[11px] font-medium text-red-500"><TrendingUp size={11} /> Worsening</span>
                      : <span className="flex items-center gap-1 text-[11px] font-medium text-blue-600"><TrendingDown size={11} /> Improving</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* ── Quick Exports ── */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-300 mb-3">
          Quick Exports
        </p>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          {[
            { label: 'Attendance Report', icon: CalendarCheck, bg: 'bg-blue-50',   color: 'text-blue-600'   },
            { label: 'Student List',      icon: Users,         bg: 'bg-indigo-50', color: 'text-indigo-600' },
            { label: 'Teacher Summary',   icon: UserCheck,     bg: 'bg-sky-50',    color: 'text-sky-600'    },
            { label: 'Academic Report',   icon: BookOpen,      bg: 'bg-violet-50', color: 'text-violet-600' },
          ].map(({ label, icon: Icon, bg, color }) => (
            <button
              key={label}
              className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3.5 hover:border-blue-200 hover:bg-blue-50/40 transition-all text-left group"
            >
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', bg)}>
                <Icon size={15} className={color} />
              </div>
              <span className="text-[13px] text-slate-600 font-medium group-hover:text-blue-700 transition-colors flex-1">
                {label}
              </span>
              <Download size={12} className="text-slate-300 group-hover:text-blue-500 transition-colors shrink-0" />
            </button>
          ))}
        </div>
      </div>

    </div>
  )
}