"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  Activity, Search, Download, RefreshCw, UserCheck, Users,
  AlertTriangle, Plus, Edit3, Trash2, Eye, LogIn, LogOut,
  Zap, ChevronLeft, ChevronRight, CheckCircle2, XCircle,
  Smartphone, Globe, Monitor
} from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import PageHeader from "@/components/shared/PageHeader"
import ToolbarActions from "@/components/shared/ToolbarActions"
import { cn } from "@/lib/utils"

const MOCK_LOGS = [
  { id: 1, actor: 'Animesh Karan', role: 'School Admin', avatar: 'AK', action: 'Exported attendance report', module: 'Reports', type: 'export', severity: 'info', ip: '192.168.1.12', device: 'desktop', time: '2026-06-07T08:47:43', status: 'success' },
  { id: 2, actor: 'Priya Nair', role: 'Teacher', avatar: 'PN', action: 'Marked attendance for Class 6-A', module: 'Attendance', type: 'update', severity: 'info', ip: '192.168.1.34', device: 'mobile', time: '2026-06-07T08:31:10', status: 'success' },
  { id: 3, actor: 'Animesh Karan', role: 'School Admin', avatar: 'AK', action: 'Sent notification to all parents', module: 'Communication', type: 'create', severity: 'info', ip: '192.168.1.12', device: 'desktop', time: '2026-06-07T08:15:00', status: 'success' },
  { id: 4, actor: 'Rajan Mehta', role: 'Teacher', avatar: 'RM', action: 'Failed login attempt', module: 'Auth', type: 'login', severity: 'warning', ip: '203.0.113.45', device: 'desktop', time: '2026-06-07T07:58:22', status: 'failed' },
  { id: 5, actor: 'Animesh Karan', role: 'School Admin', avatar: 'AK', action: 'Added new student: Aryan Gupta', module: 'Students', type: 'create', severity: 'info', ip: '192.168.1.12', device: 'desktop', time: '2026-06-07T07:44:05', status: 'success' },
  { id: 6, actor: 'System', role: 'System', avatar: 'SY', action: 'Automated backup completed', module: 'System', type: 'system', severity: 'info', ip: 'internal', device: 'server', time: '2026-06-07T05:00:00', status: 'success' },
  { id: 7, actor: 'Animesh Karan', role: 'School Admin', avatar: 'AK', action: 'Updated school profile settings', module: 'Settings', type: 'update', severity: 'info', ip: '192.168.1.12', device: 'desktop', time: '2026-06-07T04:40:18', status: 'success' },
  { id: 8, actor: 'System', role: 'System', avatar: 'SY', action: 'Push notification delivery failed', module: 'Communication', type: 'system', severity: 'warning', ip: 'internal', device: 'server', time: '2026-06-07T04:10:00', status: 'failed' },
]

const MODULE_COLORS = {
  Auth: "bg-slate-100 text-slate-600", Attendance: "bg-blue-50 text-blue-700",
  Students: "bg-indigo-50 text-indigo-700", Reports: "bg-violet-50 text-violet-700",
  Communication: "bg-sky-50 text-sky-700", Timetable: "bg-cyan-50 text-cyan-700",
  Settings: "bg-slate-100 text-slate-600", System: "bg-orange-50 text-orange-600",
  Billing: "bg-emerald-50 text-emerald-700",
}

const TYPE_ICON = {
  create: { Icon: Plus, color: "text-blue-500", bg: "bg-blue-50" },
  update: { Icon: Edit3, color: "text-indigo-500", bg: "bg-indigo-50" },
  delete: { Icon: Trash2, color: "text-red-500", bg: "bg-red-50" },
  export: { Icon: Download, color: "text-violet-500", bg: "bg-violet-50" },
  login: { Icon: LogIn, color: "text-emerald-500", bg: "bg-emerald-50" },
  view: { Icon: Eye, color: "text-sky-500", bg: "bg-sky-50" },
  system: { Icon: Zap, color: "text-orange-500", bg: "bg-orange-50" },
}

const ACTION_TYPES = ["All Types", "create", "update", "delete", "export", "login", "view", "system"]
const PAGE_SIZE = 10

function formatTime(iso) {
  return new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true })
}

function DeviceIcon({ device }) {
  if (device === "mobile") return <Smartphone size={11} className="text-slate-300" />
  if (device === "server") return <Globe size={11} className="text-slate-300" />
  return <Monitor size={11} className="text-slate-300" />
}

export default function ActivityLogPage() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("All Types")
  const [page, setPage] = useState(1)
  const [expanded, setExpanded] = useState(null)

  const filtered = useMemo(() => MOCK_LOGS.filter(log => {
    if (typeFilter !== "All Types" && log.type !== typeFilter) return false
    if (search) {
      const q = search.toLowerCase()
      if (!log.actor.toLowerCase().includes(q) && !log.action.toLowerCase().includes(q) && !log.module.toLowerCase().includes(q)) return false
    }
    return true
  }), [search, typeFilter])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="max-w-[1300px] mx-auto space-y-6">
      <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "Activity Log" }]} />

      <PageHeader title="Activity Log" description="Full audit trail of all user and system actions">
        <ToolbarActions onRefresh={() => console.log("Refreshing...")} onExport={() => console.log("Exporting...")} />
      </PageHeader>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search by actor, action, or module..."
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-violet-500 transition-all" />
        </div>
        <div className="flex gap-1.5">
          {ACTION_TYPES.map(t => (
            <button key={t} onClick={() => { setTypeFilter(t); setPage(1) }}
              className={`px-3 py-2 rounded-lg border text-sm font-medium capitalize transition-all ${typeFilter === t ? "bg-violet-600 border-violet-600 text-white shadow-sm" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>{t}</button>
          ))}
        </div>
      </div>

      <p className="text-sm text-slate-500">Showing <span className="font-semibold text-slate-700">{filtered.length}</span> events</p>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                {["", "Action & Actor", "Module", "Status", "Time", "Device"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map(log => {
                const tc = TYPE_ICON[log.type] || TYPE_ICON.view
                const mc = MODULE_COLORS[log.module] || MODULE_COLORS.System
                const open = expanded === log.id
                return (
                  <tr key={log.id} onClick={() => setExpanded(open ? null : log.id)}
                    className={cn("border-b border-slate-50 cursor-pointer transition-colors", open ? "bg-violet-50/40" : "hover:bg-slate-50/50")}>
                    <td className="px-4 py-3">
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", tc.bg)}><tc.Icon size={14} className={tc.color} /></div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-slate-700">{log.action}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{log.actor} · {log.role}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold", mc)}>{log.module}</span>
                    </td>
                    <td className="px-4 py-3">
                      {log.status === "success"
                        ? <span className="text-xs text-emerald-600 flex items-center gap-1"><CheckCircle2 size={11} />Success</span>
                        : <span className="text-xs text-red-500 flex items-center gap-1"><XCircle size={11} />Failed</span>}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">{formatTime(log.time)}</td>
                    <td className="px-4 py-3"><DeviceIcon device={log.device} /></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs text-slate-400">Page {page} of {totalPages}</p>
            <div className="flex gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs hover:bg-slate-50 disabled:opacity-50">Prev</button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs hover:bg-slate-50 disabled:opacity-50">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}