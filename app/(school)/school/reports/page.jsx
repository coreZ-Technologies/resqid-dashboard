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

const PIE_COLORS = ['#8b5cf6', '#7c3aed', '#c4b5fd']  // violet shades

const DATE_RANGES = ['This Week', 'This Month', 'This Term', 'This Year']
const TABS        = ['Overview', 'Attendance', 'Students', 'Teachers']

// ─── KPI Card (Notion style) ─────────────────────────────────────────────────

function KpiCard({ icon: Icon, label, value, change, positive, iconBg, iconColor }) {
  return (
    <div className="bg-white rounded-md border border-violet-100 p-5 flex flex-col gap-4 hover:border-violet-200 transition-colors">
      <div className="flex items-center justify-between">
        <div className={cn('w-9 h-9 rounded-md flex items-center justify-center', iconBg)}>
          <Icon size={18} className={iconColor} />
        </div>
        <span className={cn(
          'flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-md',
          positive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600'
        )}>
          {positive ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
          {change}
        </span>
      </div>
      <div>
        <p className="text-2xl font-semibold text-gray-800">{value}</p>
        <p className="text-[11px] text-gray-500 mt-0.5">{label}</p>
      </div>
    </div>
  )
}

// ─── Section Card (Notion style) ─────────────────────────────────────────────

function SectionCard({ title, subtitle, action, children }) {
  return (
    <div className="bg-white rounded-md border border-violet-100 overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-200 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-800">{title}</p>
          {subtitle && <p className="text-[10px] text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

// ─── Custom Tooltip (Notion style) ───────────────────────────────────────────

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-gray-800 text-white text-[10px] rounded-md px-3 py-2 shadow-md">
      <p className="font-medium mb-1 text-gray-300">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color ?? '#c4b5fd' }}>
          {p.name}: <span className="font-semibold">{p.value}{typeof p.value === 'number' && p.name !== 'Students' ? '%' : ''}</span>
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
          <h1 className="text-xl font-semibold text-gray-800">Reports & Analytics</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Springdale Public School — Academic Year 2024–25
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Date range */}
          <div className="relative">
            <button
              onClick={() => setShowDateDropdown(v => !v)}
              className="flex items-center gap-2 text-xs border border-gray-200 rounded-md px-3 py-2 bg-white hover:bg-gray-50 text-gray-600 transition-colors"
            >
              <Calendar size={13} className="text-gray-400" />
              {dateRange}
              <ChevronDown size={13} className="text-gray-400" />
            </button>
            {showDateDropdown && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-md z-20 min-w-[150px] py-1">
                {DATE_RANGES.map(r => (
                  <button
                    key={r}
                    onClick={() => { setDateRange(r); setShowDateDropdown(false) }}
                    className={cn(
                      'w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 transition-colors',
                      dateRange === r ? 'text-violet-700 font-medium' : 'text-gray-600'
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Export */}
          <button className="flex items-center gap-2 text-xs bg-gradient-to-r from-violet-500 to-violet-700 hover:opacity-90 text-white rounded-md px-3 py-2 font-medium transition-all">
            <Download size={13} />
            Export PDF
          </button>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 border-b border-gray-200">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-4 py-2 text-xs font-medium border-b-2 -mb-px transition-colors',
              activeTab === tab
                ? 'border-violet-600 text-violet-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
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
          iconBg="bg-violet-50"
          iconColor="text-violet-600"
        />
        <KpiCard
          icon={UserCheck}
          label="Total Teachers"
          value="42"
          change="2 new"
          positive
          iconBg="bg-violet-50"
          iconColor="text-violet-600"
        />
        <KpiCard
          icon={CalendarCheck}
          label="Avg. Attendance"
          value="91.4%"
          change="1.2%"
          positive
          iconBg="bg-violet-50"
          iconColor="text-violet-600"
        />
        <KpiCard
          icon={AlertTriangle}
          label="At-Risk Students"
          value="23"
          change="3 more"
          positive={false}
          iconBg="bg-rose-50"
          iconColor="text-rose-500"
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
              <button className="flex items-center gap-1 text-[10px] text-violet-600 font-medium hover:underline">
                <FileText size={10} /> Full Report
              </button>
            }
          >
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={attendanceMonthly} barCategoryGap="32%" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={v => `${v}%`} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f8fafc' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} iconType="circle" iconSize={8} />
                <Bar dataKey="present" name="Present" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="absent"  name="Absent"  fill="#ddd6fe" radius={[4, 4, 0, 0]} />
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
                contentStyle={{ fontSize: '11px', borderRadius: '6px', border: '1px solid #e2e8f0', boxShadow: 'none', backgroundColor: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-2 mt-1">
            {genderData.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                  <span className="text-[11px] text-gray-500">{item.name}</span>
                </div>
                <span className="text-[11px] font-medium text-gray-700">{item.value}</span>
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
                contentStyle={{ fontSize: '11px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#fff' }}
              />
              <Bar dataKey="rate" radius={[0, 4, 4, 0]}>
                {classAttendance.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.rate >= 90 ? '#8b5cf6' : entry.rate >= 85 ? '#f59e0b' : '#ef4444'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className="flex items-center gap-4 mt-3">
            {[
              { color: '#8b5cf6', label: '≥90% Good'      },
              { color: '#f59e0b', label: '85–89% Average'  },
              { color: '#ef4444', label: '<85% At Risk'     },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} />
                <span className="text-[10px] text-gray-500">{l.label}</span>
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
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ fill: '#7c3aed', r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#6d28d9', strokeWidth: 0 }}
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
          <button className="text-[10px] text-violet-600 font-medium hover:underline">
            View All
          </button>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                {['#', 'Student', 'Class', 'Total Absences', 'Trend'].map(h => (
                  <th key={h} className="text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500 pb-3 pr-4 last:pr-0">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topAbsent.map((s, i) => (
                <tr key={s.name} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="py-3 pr-4 text-[11px] text-gray-400 font-mono w-6">{i + 1}</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 text-[10px] font-bold shrink-0">
                        {s.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-xs font-medium text-gray-800">{s.name}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="text-[11px] text-gray-500">{s.class}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={cn(
                      'inline-flex items-center gap-1 text-[11px] font-medium',
                      s.absences >= 15 ? 'text-rose-600' : s.absences >= 12 ? 'text-amber-600' : 'text-gray-600'
                    )}>
                      <Clock size={10} />
                      {s.absences} days
                    </span>
                  </td>
                  <td className="py-3">
                    {s.trend === 'up'
                      ? <span className="flex items-center gap-1 text-[10px] font-medium text-rose-600"><TrendingUp size={10} /> Worsening</span>
                      : <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-600"><TrendingDown size={10} /> Improving</span>
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
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-3">
          Quick Exports
        </p>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          {[
            { label: 'Attendance Report', icon: CalendarCheck, bg: 'bg-violet-50',   color: 'text-violet-600'   },
            { label: 'Student List',      icon: Users,         bg: 'bg-violet-50', color: 'text-violet-600' },
            { label: 'Teacher Summary',   icon: UserCheck,     bg: 'bg-violet-50',    color: 'text-violet-600'    },
            { label: 'Academic Report',   icon: BookOpen,      bg: 'bg-violet-50', color: 'text-violet-600' },
          ].map(({ label, icon: Icon, bg, color }) => (
            <button
              key={label}
              className="flex items-center gap-3 bg-white border border-violet-100 rounded-md px-4 py-3 hover:border-violet-200 transition-all text-left group"
            >
              <div className={cn('w-8 h-8 rounded-md flex items-center justify-center shrink-0', bg)}>
                <Icon size={15} className={color} />
              </div>
              <span className="text-xs text-gray-700 font-medium group-hover:text-violet-700 transition-colors flex-1">
                {label}
              </span>
              <Download size={12} className="text-gray-400 group-hover:text-violet-500 transition-colors shrink-0" />
            </button>
          ))}
        </div>
      </div>

    </div>
  )
}