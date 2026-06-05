'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Search, Filter, Phone, Mail, MapPin, ChevronRight,
  Users, MessageCircle, Bell, TrendingUp, MoreHorizontal,
  CheckCircle2, Clock, AlertCircle, Star, Download,
  UserPlus, Eye, Send
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Dummy Data ─────────────────────────────────────────────
const PARENTS = [
  {
    id: 1,
    name: 'Rajesh Sharma',
    email: 'rajesh.sharma@gmail.com',
    phone: '+91 98765 43210',
    location: 'Salt Lake, Kolkata',
    avatar: 'RS',
    avatarColor: 'bg-violet-500',
    children: [
      { name: 'Priya Sharma', class: 'Class 8-A', rfid: 'RFID-2341', attendance: 94, status: 'present' },
      { name: 'Arjun Sharma', class: 'Class 5-B', rfid: 'RFID-2342', attendance: 88, status: 'present' },
    ],
    lastSeen: '2 min ago',
    engagement: 'high',
    notifications: 12,
    joinedDate: 'Jan 2024',
  },
  {
    id: 2,
    name: 'Sunita Dey',
    email: 'sunita.dey@outlook.com',
    phone: '+91 87654 32109',
    location: 'New Town, Kolkata',
    avatar: 'SD',
    avatarColor: 'bg-purple-500',
    children: [
      { name: 'Rohit Dey', class: 'Class 10-A', rfid: 'RFID-1891', attendance: 97, status: 'present' },
    ],
    lastSeen: '1 hr ago',
    engagement: 'high',
    notifications: 5,
    joinedDate: 'Mar 2024',
  },
  {
    id: 3,
    name: 'Amit Bose',
    email: 'amit.bose@yahoo.com',
    phone: '+91 76543 21098',
    location: 'Dum Dum, Kolkata',
    avatar: 'AB',
    avatarColor: 'bg-emerald-500',
    children: [
      { name: 'Sneha Bose', class: 'Class 7-C', rfid: 'RFID-3012', attendance: 76, status: 'absent' },
    ],
    lastSeen: '3 hr ago',
    engagement: 'low',
    notifications: 28,
    joinedDate: 'Feb 2024',
  },
  {
    id: 4,
    name: 'Priya Chatterjee',
    email: 'priya.c@gmail.com',
    phone: '+91 65432 10987',
    location: 'Howrah, WB',
    avatar: 'PC',
    avatarColor: 'bg-rose-500',
    children: [
      { name: 'Dev Chatterjee', class: 'Class 9-B', rfid: 'RFID-4201', attendance: 91, status: 'present' },
      { name: 'Dia Chatterjee', class: 'Class 3-A', rfid: 'RFID-4202', attendance: 85, status: 'late' },
    ],
    lastSeen: '30 min ago',
    engagement: 'medium',
    notifications: 8,
    joinedDate: 'Jan 2024',
  },
  {
    id: 5,
    name: 'Suresh Nair',
    email: 'suresh.nair@gmail.com',
    phone: '+91 54321 09876',
    location: 'Park Street, Kolkata',
    avatar: 'SN',
    avatarColor: 'bg-amber-500',
    children: [
      { name: 'Kavya Nair', class: 'Class 6-A', rfid: 'RFID-5101', attendance: 99, status: 'present' },
    ],
    lastSeen: 'Just now',
    engagement: 'high',
    notifications: 2,
    joinedDate: 'Apr 2024',
  },
  {
    id: 6,
    name: 'Meena Gupta',
    email: 'meena.gupta@rediffmail.com',
    phone: '+91 43210 98765',
    location: 'Jadavpur, Kolkata',
    avatar: 'MG',
    avatarColor: 'bg-cyan-500',
    children: [
      { name: 'Rahul Gupta', class: 'Class 11-B', rfid: 'RFID-6301', attendance: 82, status: 'present' },
    ],
    lastSeen: '5 hr ago',
    engagement: 'medium',
    notifications: 14,
    joinedDate: 'Jun 2024',
  },
]

const ENGAGEMENT_STYLE = {
  high:   { label: 'High',   dot: 'bg-emerald-500', text: 'text-emerald-700', badge: 'bg-emerald-50 border-emerald-200' },
  medium: { label: 'Medium', dot: 'bg-amber-500',   text: 'text-amber-700',   badge: 'bg-amber-50 border-amber-200' },
  low:    { label: 'Low',    dot: 'bg-rose-500',    text: 'text-rose-700',    badge: 'bg-rose-50 border-rose-200' },
}

const STATUS_STYLE = {
  present: { icon: CheckCircle2, color: 'text-emerald-600', label: 'Present' },
  absent:  { icon: AlertCircle,  color: 'text-rose-600',    label: 'Absent'  },
  late:    { icon: Clock,        color: 'text-amber-600',   label: 'Late'    },
}

// ── Stat Card (Notion style) ──────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="bg-white rounded-md border border-violet-100 p-5 flex items-start gap-4 hover:border-violet-200 transition-colors">
      <div className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 bg-violet-50 ${color}`}>
        <Icon size={18} className="text-violet-600" />
      </div>
      <div>
        <p className="text-2xl font-semibold text-gray-800 leading-tight">{value}</p>
        <p className="text-[11px] text-gray-500 mt-0.5">{label}</p>
        {sub && <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

// ── Parent Card (Notion style) ────────────────────────────
function ParentCard({ parent, onClick, selected }) {
  const eng = ENGAGEMENT_STYLE[parent.engagement]
  return (
    <div
      onClick={() => onClick(parent)}
      className={cn(
        'bg-white rounded-md border p-5 cursor-pointer transition-all duration-200 hover:border-violet-200',
        selected ? 'border-violet-400 ring-1 ring-violet-100' : 'border-violet-100'
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full ${parent.avatarColor} flex items-center justify-center text-white text-[13px] font-bold shrink-0`}>
            {parent.avatar}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{parent.name}</p>
            <p className="text-[10px] text-gray-500">{parent.lastSeen}</p>
          </div>
        </div>
        <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium border', eng.badge, eng.text)}>
          <span className={`w-1.5 h-1.5 rounded-full ${eng.dot}`} />
          {eng.label}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {parent.children.map((child) => {
          const S = STATUS_STYLE[child.status]
          return (
            <div key={child.name} className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-md px-2.5 py-1.5">
              <S.icon size={11} className={S.color} />
              <span className="text-[11px] font-medium text-gray-600">{child.name}</span>
              <span className="text-[10px] text-gray-500">{child.class}</span>
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-between text-[11px] text-gray-500 border-t border-gray-100 pt-3">
        <div className="flex items-center gap-1">
          <Phone size={11} />
          <span>{parent.phone}</span>
        </div>
        {parent.notifications > 0 && (
          <div className="flex items-center gap-1">
            <Bell size={11} className="text-violet-600" />
            <span className="text-violet-700 font-medium">{parent.notifications} notifications</span>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Detail Panel (Notion style) ───────────────────────────
function DetailPanel({ parent, onClose }) {
  if (!parent) return (
    <div className="bg-white rounded-md border border-violet-100 flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8">
      <div className="w-16 h-16 rounded-md bg-gray-50 border border-gray-200 flex items-center justify-center mb-4">
        <Users size={24} className="text-gray-300" />
      </div>
      <p className="text-gray-500 font-medium">Select a parent</p>
      <p className="text-gray-400 text-[11px] mt-1">Click any card to view full details</p>
    </div>
  )

  const eng = ENGAGEMENT_STYLE[parent.engagement]

  return (
    <div className="bg-white rounded-md border border-violet-100 overflow-hidden flex flex-col">
      <div className="bg-gradient-to-r from-violet-500 to-violet-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-violet-200 text-[10px] font-medium uppercase tracking-wider">Parent Profile</span>
          <button onClick={onClose} className="text-white/60 hover:text-white text-[10px] transition-colors">✕ Close</button>
        </div>
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-md ${parent.avatarColor} flex items-center justify-center text-white text-[16px] font-bold border border-white/20`}>
            {parent.avatar}
          </div>
          <div>
            <h3 className="text-white font-semibold text-base">{parent.name}</h3>
            <p className="text-violet-200 text-[11px]">Joined {parent.joinedDate}</p>
            <span className="inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-white/10 text-white border border-white/20">
              <span className={`w-1.5 h-1.5 rounded-full ${eng.dot}`} />
              {eng.label} Engagement
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-3">Contact Info</p>
          <div className="space-y-2">
            {[
              { icon: Phone, val: parent.phone },
              { icon: Mail, val: parent.email },
              { icon: MapPin, val: parent.location },
            ].map(({ icon: Icon, val }) => (
              <div key={val} className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                <Icon size={13} className="text-gray-500 shrink-0" />
                <span className="text-[11px] text-gray-600">{val}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-3">Children ({parent.children.length})</p>
          <div className="space-y-3">
            {parent.children.map((child) => {
              const S = STATUS_STYLE[child.status]
              const pct = child.attendance
              const barColor = pct >= 90 ? 'bg-emerald-500' : pct >= 75 ? 'bg-amber-500' : 'bg-rose-500'
              return (
                <div key={child.name} className="bg-gray-50 rounded-md p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-800">{child.name}</p>
                      <p className="text-[10px] text-gray-500">{child.class} · {child.rfid}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <S.icon size={13} className={S.color} />
                      <span className={`text-[10px] font-medium ${S.color}`}>{S.label}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className={`h-full ${barColor} rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-[10px] font-semibold text-gray-600 w-8 text-right">{pct}%</span>
                  </div>
                  <p className="text-[9px] text-gray-500 mt-1">Attendance this term</p>
                </div>
              )
            })}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-3">Quick Actions</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: MessageCircle, label: 'Send Message', color: 'bg-violet-600' },
              { icon: Bell,          label: 'Push Notify',  color: 'bg-violet-600' },
              { icon: Phone,         label: 'Call Parent',  color: 'bg-emerald-600' },
              { icon: Eye,           label: 'View Report',  color: 'bg-amber-600' },
            ].map(({ icon: Icon, label, color }) => (
              <button
                key={label}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-white text-[11px] font-medium ${color} hover:opacity-90 transition-opacity`}
              >
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-3">Recent Notifications</p>
          <div className="space-y-2">
            {[
              { msg: 'Priya marked present via RFID', time: '8:42 AM', type: 'attendance' },
              { msg: 'New announcement: Sports Day', time: 'Yesterday', type: 'announcement' },
              { msg: 'Attendance report — June 2025', time: '3 days ago', type: 'report' },
            ].map(({ msg, time, type }) => (
              <div key={msg} className="flex items-start gap-3 p-3 rounded-md bg-gray-50 border border-gray-200">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${type === 'attendance' ? 'bg-emerald-500' : type === 'announcement' ? 'bg-violet-500' : 'bg-violet-500'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-gray-600 leading-tight">{msg}</p>
                  <p className="text-[9px] text-gray-500 mt-0.5">{time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────
export default function ParentsPage() {
  const [search, setSearch] = useState('')
  const [engFilter, setEngFilter] = useState('all')
  const [selected, setSelected] = useState(null)

  const filtered = PARENTS.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase()) ||
      p.children.some((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    const matchEng = engFilter === 'all' || p.engagement === engFilter
    return matchSearch && matchEng
  })

  const totalChildren = PARENTS.reduce((acc, p) => acc + p.children.length, 0)
  const highEng = PARENTS.filter((p) => p.engagement === 'high').length
  const pendingNotifs = PARENTS.reduce((acc, p) => acc + p.notifications, 0)

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Parents</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage parent connections, notifications, and engagement</p>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 transition-colors">
            <Download size={14} />
            Export
          </button>

          <Link
            href="/school/parents/add"
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-gradient-to-r from-violet-500 to-violet-700 text-white text-xs font-medium hover:opacity-90 transition-all"
          >
            <UserPlus size={14} />
            Add Parent
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users}      label="Total Parents"         value={PARENTS.length} sub={`${totalChildren} children linked`} />
        <StatCard icon={Star}       label="High Engagement"       value={highEng}        sub="Active this week" />
        <StatCard icon={Bell}       label="Pending Notifications"  value={pendingNotifs}  sub="Across all parents" />
        <StatCard icon={TrendingUp} label="Avg. Attendance"       value="89%"            sub="Linked children" />
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by parent name, email, or child..."
            className="w-full pl-9 pr-3 py-2 rounded-md border border-gray-200 text-xs text-gray-700 placeholder:text-gray-400 bg-white focus:outline-none focus:border-violet-300 focus:ring-1 focus:ring-violet-100 transition-all"
          />
        </div>
        <div className="flex gap-1.5">
          {['all', 'high', 'medium', 'low'].map((f) => (
            <button
              key={f}
              onClick={() => setEngFilter(f)}
              className={cn(
                'px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all border',
                engFilter === f
                  ? 'bg-gradient-to-r from-violet-500 to-violet-700 text-white border-transparent'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              )}
            >
              {f === 'all' ? 'All' : `${f.charAt(0).toUpperCase() + f.slice(1)} Eng.`}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 space-y-4">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-md border border-violet-100 p-12 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-md bg-gray-50 border border-gray-200 flex items-center justify-center mb-4">
                <Users size={22} className="text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">No parents found</p>
              <p className="text-gray-400 text-[11px] mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map((p) => (
                <ParentCard
                  key={p.id}
                  parent={p}
                  onClick={setSelected}
                  selected={selected?.id === p.id}
                />
              ))}
            </div>
          )}
        </div>

        <div className="xl:col-span-1">
          <DetailPanel parent={selected} onClose={() => setSelected(null)} />
        </div>
      </div>

      {/* Engagement Summary Table */}
      <div className="bg-white rounded-md border border-violet-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
          <h2 className="text-sm font-medium text-gray-800">Parent Engagement Summary</h2>
          <button className="text-[10px] text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1">
            View All <ChevronRight size={12} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left bg-gray-50 border-b border-gray-200">
                {['Parent', 'Children', 'Avg Attendance', 'Engagement', 'Notifications', 'Actions'].map((h) => (
                  <th key={h} className="px-5 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {PARENTS.map((p) => {
                const avg = Math.round(p.children.reduce((a, c) => a + c.attendance, 0) / p.children.length)
                const eng = ENGAGEMENT_STYLE[p.engagement]
                const barColor = avg >= 90 ? 'bg-emerald-500' : avg >= 75 ? 'bg-amber-500' : 'bg-rose-500'
                return (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setSelected(p)}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-7 h-7 rounded-full ${p.avatarColor} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                          {p.avatar}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 text-xs">{p.name}</p>
                          <p className="text-gray-500 text-[10px]">{p.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1">
                        {p.children.map((c) => (
                          <span key={c.name} className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-md text-[9px]">{c.name}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className={`h-full ${barColor} rounded-full`} style={{ width: `${avg}%` }} />
                        </div>
                        <span className="font-semibold text-gray-700 text-xs">{avg}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={cn('inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-medium border', eng.badge, eng.text)}>
                        <span className={`w-1.5 h-1.5 rounded-full ${eng.dot}`} />
                        {eng.label}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {p.notifications > 0 ? (
                        <span className="bg-violet-50 text-violet-700 border border-violet-200 px-2 py-0.5 rounded-md text-[10px] font-medium">{p.notifications} pending</span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        <button className="p-1 rounded-md hover:bg-violet-50 text-gray-500 hover:text-violet-600 transition-colors">
                          <Send size={12} />
                        </button>
                        <button className="p-1 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors">
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