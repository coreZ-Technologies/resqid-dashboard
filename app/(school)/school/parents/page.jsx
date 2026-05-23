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

// ── Dummy Data ─────────────────────────────────────────────
const PARENTS = [
  {
    id: 1,
    name: 'Rajesh Sharma',
    email: 'rajesh.sharma@gmail.com',
    phone: '+91 98765 43210',
    location: 'Salt Lake, Kolkata',
    avatar: 'RS',
    avatarColor: 'bg-blue-500',
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
    avatarColor: 'bg-violet-500',
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
  high:   { label: 'High',   dot: 'bg-emerald-400', text: 'text-emerald-400', badge: 'bg-emerald-400/10 border-emerald-400/20' },
  medium: { label: 'Medium', dot: 'bg-amber-400',   text: 'text-amber-400',   badge: 'bg-amber-400/10 border-amber-400/20' },
  low:    { label: 'Low',    dot: 'bg-rose-400',     text: 'text-rose-400',   badge: 'bg-rose-400/10 border-rose-400/20' },
}

const STATUS_STYLE = {
  present: { icon: CheckCircle2, color: 'text-emerald-400', label: 'Present' },
  absent:  { icon: AlertCircle,  color: 'text-rose-400',    label: 'Absent'  },
  late:    { icon: Clock,        color: 'text-amber-400',   label: 'Late'    },
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

// ── Parent Card ────────────────────────────────────────────
function ParentCard({ parent, onClick, selected }) {
  const eng = ENGAGEMENT_STYLE[parent.engagement]
  return (
    <div
      onClick={() => onClick(parent)}
      className={`bg-white rounded-2xl border shadow-sm p-5 cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
        selected ? 'border-sky-400 ring-2 ring-sky-100' : 'border-slate-100'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full ${parent.avatarColor} flex items-center justify-center text-white text-[13px] font-bold shrink-0`}>
            {parent.avatar}
          </div>
          <div>
            <p className="text-[14px] font-semibold text-slate-800">{parent.name}</p>
            <p className="text-[11px] text-slate-400">{parent.lastSeen}</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium border ${eng.badge} ${eng.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${eng.dot}`} />
          {eng.label}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {parent.children.map((child) => {
          const S = STATUS_STYLE[child.status]
          return (
            <div key={child.name} className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1.5">
              <S.icon size={11} className={S.color} />
              <span className="text-[11px] font-medium text-slate-600">{child.name}</span>
              <span className="text-[10px] text-slate-400">{child.class}</span>
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-50 pt-3">
        <div className="flex items-center gap-1">
          <Phone size={11} />
          <span>{parent.phone}</span>
        </div>
        {parent.notifications > 0 && (
          <div className="flex items-center gap-1">
            <Bell size={11} className="text-sky-400" />
            <span className="text-sky-500 font-medium">{parent.notifications} notifications</span>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Detail Panel ───────────────────────────────────────────
function DetailPanel({ parent, onClose }) {
  if (!parent) return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8">
      <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4">
        <Users size={24} className="text-slate-300" />
      </div>
      <p className="text-slate-500 font-medium">Select a parent</p>
      <p className="text-slate-400 text-[12px] mt-1">Click any card to view full details</p>
    </div>
  )

  const eng = ENGAGEMENT_STYLE[parent.engagement]

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
      <div className="bg-gradient-to-br from-sky-500 to-blue-600 p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sky-200 text-[11px] font-medium uppercase tracking-widest">Parent Profile</span>
          <button onClick={onClose} className="text-white/60 hover:text-white text-[11px] transition-colors">✕ Close</button>
        </div>
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl ${parent.avatarColor} flex items-center justify-center text-white text-[16px] font-bold border-2 border-white/20 shadow-lg`}>
            {parent.avatar}
          </div>
          <div>
            <h3 className="text-white font-bold text-[16px]">{parent.name}</h3>
            <p className="text-sky-200 text-[12px]">Joined {parent.joinedDate}</p>
            <span className="inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-white/10 text-white border border-white/20">
              <span className={`w-1.5 h-1.5 rounded-full ${eng.dot}`} />
              {eng.label} Engagement
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-3">Contact Info</p>
          <div className="space-y-2">
            {[
              { icon: Phone, val: parent.phone },
              { icon: Mail, val: parent.email },
              { icon: MapPin, val: parent.location },
            ].map(({ icon: Icon, val }) => (
              <div key={val} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <Icon size={13} className="text-slate-400 shrink-0" />
                <span className="text-[12px] text-slate-600">{val}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-3">Children ({parent.children.length})</p>
          <div className="space-y-3">
            {parent.children.map((child) => {
              const S = STATUS_STYLE[child.status]
              const pct = child.attendance
              const barColor = pct >= 90 ? 'bg-emerald-400' : pct >= 75 ? 'bg-amber-400' : 'bg-rose-400'
              return (
                <div key={child.name} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-[13px] font-semibold text-slate-700">{child.name}</p>
                      <p className="text-[11px] text-slate-400">{child.class} · {child.rfid}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <S.icon size={13} className={S.color} />
                      <span className={`text-[11px] font-medium ${S.color}`}>{S.label}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className={`h-full ${barColor} rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-600 w-8 text-right">{pct}%</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Attendance this term</p>
                </div>
              )
            })}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-3">Quick Actions</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: MessageCircle, label: 'Send Message', color: 'bg-sky-500' },
              { icon: Bell,          label: 'Push Notify',  color: 'bg-violet-500' },
              { icon: Phone,         label: 'Call Parent',  color: 'bg-emerald-500' },
              { icon: Eye,           label: 'View Report',  color: 'bg-amber-500' },
            ].map(({ icon: Icon, label, color }) => (
              <button
                key={label}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-white text-[12px] font-medium ${color} hover:opacity-90 transition-opacity`}
              >
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-3">Recent Notifications</p>
          <div className="space-y-2">
            {[
              { msg: 'Priya marked present via RFID', time: '8:42 AM', type: 'attendance' },
              { msg: 'New announcement: Sports Day', time: 'Yesterday', type: 'announcement' },
              { msg: 'Attendance report — June 2025', time: '3 days ago', type: 'report' },
            ].map(({ msg, time, type }) => (
              <div key={msg} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${type === 'attendance' ? 'bg-emerald-400' : type === 'announcement' ? 'bg-sky-400' : 'bg-violet-400'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-slate-600 leading-tight">{msg}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{time}</p>
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
          <h1 className="text-[22px] font-bold text-slate-800">Parents</h1>
          <p className="text-slate-500 text-[13px] mt-0.5">Manage parent connections, notifications, and engagement</p>
        </div>

        {/* ✅ FIXED: Both buttons now use Link for navigation */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-[13px] font-medium hover:bg-slate-50 transition-colors">
            <Download size={14} />
            Export
          </button>

          {/* ✅ THIS IS THE FIX — was a <button>, now a <Link> */}
          <Link
            href="/school/parents/add"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 text-white text-[13px] font-medium hover:bg-sky-600 transition-colors shadow-sm shadow-sky-200"
          >
            <UserPlus size={14} />
            Add Parent
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users}      label="Total Parents"         value={PARENTS.length} sub={`${totalChildren} children linked`} color="bg-sky-500" />
        <StatCard icon={Star}       label="High Engagement"       value={highEng}        sub="Active this week"                  color="bg-emerald-500" />
        <StatCard icon={Bell}       label="Pending Notifications"  value={pendingNotifs}  sub="Across all parents"                color="bg-violet-500" />
        <StatCard icon={TrendingUp} label="Avg. Attendance"       value="89%"            sub="Linked children"                   color="bg-amber-500" />
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by parent name, email, or child..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-all"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'high', 'medium', 'low'].map((f) => (
            <button
              key={f}
              onClick={() => setEngFilter(f)}
              className={`px-3.5 py-2.5 rounded-xl text-[12px] font-medium capitalize transition-all border ${
                engFilter === f
                  ? 'bg-sky-500 text-white border-sky-500 shadow-sm shadow-sky-200'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
              }`}
            >
              {f === 'all' ? 'All' : `${f.charAt(0).toUpperCase() + f.slice(1)} Eng.`}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-4">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4">
                <Users size={22} className="text-slate-300" />
              </div>
              <p className="text-slate-500 font-medium">No parents found</p>
              <p className="text-slate-400 text-[12px] mt-1">Try adjusting your search or filters</p>
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
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50">
          <h2 className="text-[14px] font-semibold text-slate-700">Parent Engagement Summary</h2>
          <button className="text-[12px] text-sky-500 hover:text-sky-600 font-medium flex items-center gap-1">
            View All <ChevronRight size={12} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="text-left bg-slate-50/60">
                {['Parent', 'Children', 'Avg Attendance', 'Engagement', 'Notifications', 'Actions'].map((h) => (
                  <th key={h} className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {PARENTS.map((p) => {
                const avg = Math.round(p.children.reduce((a, c) => a + c.attendance, 0) / p.children.length)
                const eng = ENGAGEMENT_STYLE[p.engagement]
                const barColor = avg >= 90 ? 'bg-emerald-400' : avg >= 75 ? 'bg-amber-400' : 'bg-rose-400'
                return (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => setSelected(p)}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`w-7 h-7 rounded-full ${p.avatarColor} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                          {p.avatar}
                        </div>
                        <div>
                          <p className="font-medium text-slate-700">{p.name}</p>
                          <p className="text-slate-400 text-[10px]">{p.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {p.children.map((c) => (
                          <span key={c.name} className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md text-[10px]">{c.name}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${barColor} rounded-full`} style={{ width: `${avg}%` }} />
                        </div>
                        <span className="font-semibold text-slate-600">{avg}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium border ${eng.badge} ${eng.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${eng.dot}`} />
                        {eng.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {p.notifications > 0 ? (
                        <span className="bg-sky-50 text-sky-500 border border-sky-100 px-2 py-0.5 rounded-md font-medium">{p.notifications} pending</span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button className="p-1.5 rounded-lg hover:bg-sky-50 text-slate-400 hover:text-sky-500 transition-colors">
                          <Send size={12} />
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