"use client"

import { useState, useMemo } from "react"
import {
    ClipboardList, Search, Plus, Edit2, Trash2, LogIn, LogOut,
    Download, AlertTriangle, CheckCircle, ChevronDown
} from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import PageHeader from "@/components/shared/PageHeader"
import { StatusBadge } from "@/components/shared/StatusBadge"
import ToolbarActions from "@/components/shared/ToolbarActions"
import { cn } from "@/lib/utils"

const ACTORS = ["All", "Super Admin", "School Admin", "System"]
const ACTIONS = ["All", "CREATE", "UPDATE", "DELETE", "LOGIN", "LOGOUT", "EXPORT", "SUSPEND", "RESTORE"]
const RESOURCES = ["All", "School", "Student", "User", "Subscription", "Token", "Anomaly", "Settings", "Report"]

const ACTION_STYLE = {
    CREATE: { bg: "bg-emerald-50 text-emerald-700 border-emerald-200", Icon: Plus },
    UPDATE: { bg: "bg-blue-50 text-blue-700 border-blue-200", Icon: Edit2 },
    DELETE: { bg: "bg-red-50 text-red-700 border-red-200", Icon: Trash2 },
    LOGIN: { bg: "bg-violet-50 text-violet-700 border-violet-200", Icon: LogIn },
    LOGOUT: { bg: "bg-slate-100 text-slate-600 border-slate-200", Icon: LogOut },
    EXPORT: { bg: "bg-amber-50 text-amber-700 border-amber-200", Icon: Download },
    SUSPEND: { bg: "bg-orange-50 text-orange-700 border-orange-200", Icon: AlertTriangle },
    RESTORE: { bg: "bg-teal-50 text-teal-700 border-teal-200", Icon: CheckCircle },
}

const MOCK_LOGS = [
    { id: "al1", actor: "Arjun Das", actorRole: "Super Admin", avatar: "AD", action: "CREATE", resource: "School", target: "Green Valley School", detail: "Created new school with Pro plan", ip: "103.21.58.1", time: new Date(Date.now() - 10 * 60000).toISOString() },
    { id: "al2", actor: "Priya Sharma", actorRole: "Super Admin", avatar: "PS", action: "UPDATE", resource: "Subscription", target: "Riverside Academy", detail: "Upgraded plan to Enterprise", ip: "103.21.58.2", time: new Date(Date.now() - 25 * 60000).toISOString() },
    { id: "al3", actor: "System", actorRole: "System", avatar: "SY", action: "RESTORE", resource: "Anomaly", target: "Alert #A-2024-892", detail: "Alert auto-resolved", ip: "internal", time: new Date(Date.now() - 45 * 60000).toISOString() },
    { id: "al4", actor: "Raj Patel", actorRole: "Super Admin", avatar: "RP", action: "EXPORT", resource: "Report", target: "Monthly Attendance", detail: "Exported attendance report", ip: "103.21.58.3", time: new Date(Date.now() - 4 * 3600000).toISOString() },
    { id: "al5", actor: "Sneha Biswas", actorRole: "Super Admin", avatar: "SB", action: "CREATE", resource: "User", target: "Sarah Williams", detail: "Added new admin user", ip: "103.21.58.4", time: new Date(Date.now() - 2 * 3600000).toISOString() },
    { id: "al6", actor: "Arjun Das", actorRole: "Super Admin", avatar: "AD", action: "SUSPEND", resource: "School", target: "Sunrise Institute", detail: "Suspended — overdue payment", ip: "103.21.58.1", time: new Date(Date.now() - 6 * 3600000).toISOString() },
    { id: "al7", actor: "Animesh Karan", actorRole: "School Admin", avatar: "AK", action: "LOGIN", resource: "User", target: "Springdale School", detail: "Admin login", ip: "182.75.44.9", time: new Date(Date.now() - 30 * 3600000).toISOString() },
    { id: "al8", actor: "System", actorRole: "System", avatar: "SY", action: "DELETE", resource: "Token", target: "47 expired tokens", detail: "Batch cleanup", ip: "internal", time: new Date(Date.now() - 50 * 3600000).toISOString() },
]

const AVATAR_COLORS = { AD: "bg-blue-500", PS: "bg-violet-500", RP: "bg-amber-500", SB: "bg-emerald-500", AK: "bg-rose-500", SY: "bg-slate-400" }

const formatTime = (iso) => {
    const diff = Date.now() - new Date(iso).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return "Just now"
    if (mins < 60) return `${mins}m ago`
    return `${Math.floor(mins / 60)}h ago`
}

export default function AuditLogsPage() {
    const [actorFilter, setActor] = useState("All")
    const [actionFilter, setAction] = useState("All")
    const [resourceFilter, setResource] = useState("All")
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const perPage = 15

    const filtered = useMemo(() => MOCK_LOGS.filter(l => {
        if (actorFilter !== "All" && l.actorRole !== actorFilter) return false
        if (actionFilter !== "All" && l.action !== actionFilter) return false
        if (resourceFilter !== "All" && l.resource !== resourceFilter) return false
        if (search && !l.actor.toLowerCase().includes(search.toLowerCase()) && !l.target.toLowerCase().includes(search.toLowerCase()) && !l.detail.toLowerCase().includes(search.toLowerCase())) return false
        return true
    }), [actorFilter, actionFilter, resourceFilter, search])

    const paginated = filtered.slice((page - 1) * perPage, page * perPage)
    const totalPages = Math.ceil(filtered.length / perPage)

    return (
        <div className="max-w-[1400px] space-y-6">
            <PageBreadcrumb items={[{ label: "Super Admin", href: "/superadmin" }, { label: "Audit Logs" }]} />

            <PageHeader title="Audit Logs" description="Admin action history across the entire platform">
                <ToolbarActions onRefresh={() => { }} onExport={() => { }} />
            </PageHeader>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-slate-400">Actor:</span>
                    {ACTORS.map(a => (
                        <button key={a} onClick={() => { setActor(a); setPage(1) }}
                            className={cn("px-3 py-1.5 rounded-lg border text-xs font-medium transition-all", actorFilter === a ? "bg-violet-600 border-violet-600 text-white" : "border-slate-200 text-slate-600 hover:bg-slate-50")}>{a}</button>
                    ))}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-slate-400">Action:</span>
                    {ACTIONS.map(a => (
                        <button key={a} onClick={() => { setAction(a); setPage(1) }}
                            className={cn("px-3 py-1.5 rounded-lg border text-xs font-medium transition-all", actionFilter === a ? "bg-slate-800 border-slate-800 text-white" : "border-slate-200 text-slate-600 hover:bg-slate-50")}>{a}</button>
                    ))}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-slate-400">Resource:</span>
                    <select value={resourceFilter} onChange={e => { setResource(e.target.value); setPage(1) }}
                        className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-violet-500 bg-white">
                        {RESOURCES.map(r => <option key={r}>{r}</option>)}
                    </select>
                    <div className="relative ml-auto">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
                            placeholder="Search actor, target, detail..."
                            className="pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-violet-500 w-64" />
                    </div>
                </div>
            </div>

            <p className="text-sm text-slate-500">Showing <span className="font-semibold text-slate-700">{filtered.length}</span> log{filtered.length !== 1 ? "s" : ""}</p>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                {["Time", "Actor", "Action", "Resource", "Target", "Detail", "IP"].map(h => (
                                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.map((log, i) => {
                                const act = ACTION_STYLE[log.action] || ACTION_STYLE.UPDATE
                                const ActIcon = act.Icon
                                return (
                                    <tr key={log.id} className={cn("hover:bg-slate-50/50 transition-colors", i < paginated.length - 1 && "border-b border-slate-50")}>
                                        <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-500">{formatTime(log.time)}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-7 h-7 rounded-full ${AVATAR_COLORS[log.avatar] || "bg-slate-400"} flex items-center justify-center text-white text-[10px] font-bold`}>{log.avatar}</div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-700">{log.actor}</p>
                                                    <p className="text-xs text-slate-400">{log.actorRole}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border", act.bg)}>
                                                <ActIcon size={11} />{log.action}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-slate-600">{log.resource}</td>
                                        <td className="px-4 py-3 text-sm font-medium text-slate-700 max-w-[160px] truncate">{log.target}</td>
                                        <td className="px-4 py-3 text-xs text-slate-500 max-w-[200px] truncate">{log.detail}</td>
                                        <td className="px-4 py-3 text-xs font-mono text-slate-400">{log.ip}</td>
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
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs hover:bg-slate-50 disabled:opacity-50">Prev</button>
                            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs hover:bg-slate-50 disabled:opacity-50">Next</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}