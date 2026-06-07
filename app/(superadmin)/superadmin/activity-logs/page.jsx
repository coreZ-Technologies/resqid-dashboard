"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Activity, Search, Filter, Eye, Clock, Calendar,
  User, Shield, Globe, Users, Settings, AlertTriangle,
  CheckCircle, XCircle, Info, Download, RefreshCw,
  FileSpreadsheet, FileJson, RotateCcw, CreditCard,
  Target, ChevronLeft, ChevronRight
} from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import PageHeader from "@/components/shared/PageHeader"
import { StatusBadge } from "@/components/shared/StatusBadge"
import ToolbarActions from "@/components/shared/ToolbarActions"
import { cn } from "@/lib/utils"

const ACTION_TYPES = [
  { value: "all", label: "All Actions" },
  { value: "create", label: "Create" },
  { value: "update", label: "Update" },
  { value: "delete", label: "Delete" },
  { value: "login", label: "Login" },
  { value: "logout", label: "Logout" },
  { value: "export", label: "Export" },
  { value: "settings", label: "Settings" },
]

const USER_ROLES = [
  { value: "all", label: "All Roles" },
  { value: "superadmin", label: "Super Admin" },
  { value: "school_admin", label: "School Admin" },
  { value: "teacher", label: "Teacher" },
]

const MODULES = [
  { value: "all", label: "All Modules" },
  { value: "schools", label: "Schools" },
  { value: "students", label: "Students" },
  { value: "teachers", label: "Teachers" },
  { value: "attendance", label: "Attendance" },
  { value: "timetable", label: "Timetable" },
  { value: "emergency", label: "Emergency" },
  { value: "communication", label: "Communication" },
  { value: "billing", label: "Billing" },
]

const generateLogs = () => {
  const users = [
    { name: "Animesh Karan", role: "superadmin", avatar: "AK" },
    { name: "Priya Sharma", role: "superadmin", avatar: "PS" },
    { name: "Dr. Meera Shah", role: "school_admin", avatar: "MS" },
    { name: "Suresh Kumar", role: "teacher", avatar: "SK" },
    { name: "Raj Patel", role: "superadmin", avatar: "RP" },
  ]
  const actions = ["create", "update", "delete", "login", "logout", "export", "settings"]
  const modules = ["schools", "students", "teachers", "attendance", "timetable", "emergency", "billing"]
  const statuses = ["success", "failure"]

  return Array.from({ length: 50 }, (_, i) => {
    const user = users[i % users.length]
    const action = actions[i % actions.length]
    const mod = modules[i % modules.length]
    return {
      id: `log_${i + 1}`,
      timestamp: new Date(Date.now() - i * 900000).toISOString(),
      user: user.name, userRole: user.role, avatar: user.avatar,
      action, module: mod,
      status: statuses[i % 2],
      details: `${action} operation on ${mod}`,
      ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    }
  })
}

export default function ActivityLogPage() {
  const [logs] = useState(generateLogs)
  const [search, setSearch] = useState("")
  const [actionFilter, setActionFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const [moduleFilter, setModuleFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [selectedLog, setSelectedLog] = useState(null)
  const perPage = 15

  const filtered = useMemo(() => logs.filter(log => {
    if (actionFilter !== "all" && log.action !== actionFilter) return false
    if (roleFilter !== "all" && log.userRole !== roleFilter) return false
    if (moduleFilter !== "all" && log.module !== moduleFilter) return false
    if (search && !log.user.toLowerCase().includes(search.toLowerCase()) && !log.details.toLowerCase().includes(search.toLowerCase())) return false
    return true
  }), [logs, search, actionFilter, roleFilter, moduleFilter])

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  const stats = {
    total: logs.length,
    uniqueUsers: new Set(logs.map(l => l.user)).size,
    modules: new Set(logs.map(l => l.module)).size,
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      <PageBreadcrumb items={[{ label: "Super Admin", href: "/superadmin" }, { label: "Activity Log" }]} />

      <PageHeader title="Activity Log" description="Complete audit trail of all system actions">
        <ToolbarActions onRefresh={() => { }} onExport={() => { }} />
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Events", value: stats.total, icon: Activity, color: "bg-blue-500" },
          { label: "Unique Users", value: stats.uniqueUsers, icon: Users, color: "bg-emerald-500" },
          { label: "Active Modules", value: stats.modules, icon: Target, color: "bg-violet-500" },
          { label: "Success Rate", value: "96%", icon: CheckCircle, color: "bg-amber-500" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center`}><s.icon size={18} className="text-white" /></div>
            <div><p className="text-xl font-bold text-slate-800">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Search user or details..."
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-violet-500 transition-all" />
        </div>
        <select value={actionFilter} onChange={e => { setActionFilter(e.target.value); setPage(1) }}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500 bg-white">
          {ACTION_TYPES.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
        </select>
        <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1) }}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500 bg-white">
          {USER_ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
        </select>
        <select value={moduleFilter} onChange={e => { setModuleFilter(e.target.value); setPage(1) }}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500 bg-white">
          {MODULES.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
        </select>
      </div>

      <p className="text-sm text-slate-500">Showing <span className="font-semibold text-slate-700">{filtered.length}</span> event{filtered.length !== 1 ? "s" : ""}</p>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-slate-100 bg-slate-50/50">
            {["Time", "User", "Action", "Module", "Status", "Details", ""].map(h => <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase">{h}</th>)}
          </tr></thead>
          <tbody>
            {paginated.map(log => (
              <tr key={log.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                  <Clock size={11} className="inline mr-1" />{new Date(log.timestamp).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">{log.avatar}</div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">{log.user}</p>
                      <p className="text-xs text-slate-400 capitalize">{log.userRole.replace("_", " ")}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 capitalize">{log.action}</span></td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-50 text-violet-700 capitalize">{log.module}</span></td>
                <td className="px-4 py-3"><StatusBadge status={log.status === "success" ? "present" : "absent"} size="sm" label={log.status} /></td>
                <td className="px-4 py-3 text-xs text-slate-500 max-w-[200px] truncate">{log.details}</td>
                <td className="px-4 py-3">
                  <button onClick={() => setSelectedLog(log)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-violet-600"><Eye size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs text-slate-400">Page {page} of {totalPages}</p>
            <div className="flex gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs hover:bg-slate-50 disabled:opacity-50">Prev</button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs hover:bg-slate-50 disabled:opacity-50">Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setSelectedLog(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-slate-100"><h2 className="font-semibold text-slate-800">Event Details</h2></div>
            <div className="p-5 space-y-3 text-sm">
              {[
                { label: "Event ID", value: selectedLog.id },
                { label: "Timestamp", value: new Date(selectedLog.timestamp).toLocaleString() },
                { label: "User", value: selectedLog.user },
                { label: "Role", value: selectedLog.userRole },
                { label: "Action", value: selectedLog.action },
                { label: "Module", value: selectedLog.module },
                { label: "Status", value: selectedLog.status },
                { label: "Details", value: selectedLog.details },
                { label: "IP Address", value: selectedLog.ip },
              ].map(r => (
                <div key={r.label} className="flex justify-between"><span className="text-slate-500">{r.label}</span><span className="font-medium text-slate-700">{r.value}</span></div>
              ))}
            </div>
            <div className="px-5 py-3 border-t border-slate-100 text-right">
              <button onClick={() => setSelectedLog(null)} className="px-4 py-2 rounded-lg bg-slate-100 text-sm font-medium hover:bg-slate-200">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}