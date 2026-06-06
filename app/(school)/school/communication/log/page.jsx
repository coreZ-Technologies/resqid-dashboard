"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
    Search, CheckCircle, XCircle, Clock, AlertTriangle,
    Bell, MessageSquare, Mail, Smartphone, RotateCcw, Loader2
} from "lucide-react"
import PageHeader from "@/components/shared/PageHeader"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import { StatusBadge } from "@/components/shared/StatusBadge"
import ToolbarActions from "@/components/shared/ToolbarActions"
import { cn } from "@/lib/utils"

const CHANNELS = ["All", "SMS", "Email", "Push", "WhatsApp"]
const STATUSES = ["All", "Delivered", "Failed", "Pending", "Bounced"]

const CHANNEL_STYLE = {
    SMS: { bg: "bg-blue-50 text-blue-700", icon: Smartphone },
    Email: { bg: "bg-violet-50 text-violet-700", icon: Mail },
    Push: { bg: "bg-slate-100 text-slate-600", icon: Bell },
    WhatsApp: { bg: "bg-emerald-50 text-emerald-700", icon: MessageSquare },
}

const MOCK_LOGS = Array.from({ length: 30 }, (_, i) => {
    const statuses = ["Delivered", "Delivered", "Delivered", "Failed", "Pending", "Bounced"]
    const channels = ["SMS", "Email", "Push", "WhatsApp"]
    const names = ["Mrs. Priya Sharma", "Mr. Rohit Verma", "Mrs. Ananya Reddy", "Mr. Vikram Singh", "Mrs. Meera Pillai"]
    const msgs = ["Annual Sports Day", "Attendance Alert", "Fee Payment Due", "PTM Scheduled", "Exam Schedule"]
    const status = statuses[i % statuses.length]
    return {
        id: `log-${i + 1}`,
        recipient: names[i % names.length],
        phone: `+91 98${(10 + i) % 90}${String(i).padStart(7, "0").slice(0, 7)}`,
        channel: channels[i % channels.length],
        message: msgs[i % msgs.length],
        status,
        sentAt: new Date(Date.now() - i * 900000).toISOString(),
        deliveredAt: status === "Delivered" ? new Date(Date.now() - i * 900000 + 15000).toISOString() : null,
        retries: status === "Failed" ? Math.floor(Math.random() * 3) + 1 : 0,
    }
})

const formatTime = (iso) => {
    if (!iso) return "—"
    const diff = Date.now() - new Date(iso).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return "Just now"
    if (mins < 60) return `${mins}m ago`
    return `${Math.floor(mins / 60)}h ago`
}

export default function DeliveryLogPage() {
    const router = useRouter()
    const [channelFilter, setChannel] = useState("All")
    const [statusFilter, setStatus] = useState("All")
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const [retrying, setRetrying] = useState(null)
    const perPage = 15

    const filtered = useMemo(() => MOCK_LOGS.filter(l => {
        if (channelFilter !== "All" && l.channel !== channelFilter) return false
        if (statusFilter !== "All" && l.status !== statusFilter) return false
        if (search && !l.recipient.toLowerCase().includes(search.toLowerCase()) && !l.message.toLowerCase().includes(search.toLowerCase())) return false
        return true
    }), [channelFilter, statusFilter, search])

    const paginated = filtered.slice((page - 1) * perPage, page * perPage)
    const totalPages = Math.ceil(filtered.length / perPage)

    const stats = {
        total: MOCK_LOGS.length,
        delivered: MOCK_LOGS.filter(l => l.status === "Delivered").length,
        failed: MOCK_LOGS.filter(l => l.status === "Failed").length,
        rate: Math.round((MOCK_LOGS.filter(l => l.status === "Delivered").length / MOCK_LOGS.length) * 100),
    }

    return (
        <div className="max-w-[1300px] space-y-6">
            <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "Communication", href: "/school/communication" }, { label: "Delivery Log" }]} />

            <PageHeader title="Delivery Log" description="Track notification delivery across all channels">
                <ToolbarActions onRefresh={() => console.log("Refreshing...")} onExport={() => console.log("Exporting...")} />
            </PageHeader>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Sent", value: stats.total, color: "bg-blue-500" },
                    { label: "Delivered", value: stats.delivered, color: "bg-emerald-500" },
                    { label: "Failed", value: stats.failed, color: stats.failed > 0 ? "bg-red-500" : "bg-slate-400" },
                    { label: "Delivery Rate", value: `${stats.rate}%`, color: "bg-violet-500" },
                ].map(s => (
                    <div key={s.label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center`}><CheckCircle size={18} className="text-white" /></div>
                        <div><p className="text-xl font-bold text-slate-800">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3 flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px]">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search recipient or message..."
                        className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-violet-500 transition-all" />
                </div>
                <div className="flex gap-1.5">
                    {CHANNELS.map(c => (
                        <button key={c} onClick={() => setChannel(c)}
                            className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${channelFilter === c ? "bg-violet-600 border-violet-600 text-white shadow-sm" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>{c}</button>
                    ))}
                </div>
                <div className="flex gap-1.5">
                    {STATUSES.map(s => (
                        <button key={s} onClick={() => setStatus(s)}
                            className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${statusFilter === s ? "bg-slate-800 border-slate-800 text-white" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>{s}</button>
                    ))}
                </div>
            </div>

            <p className="text-sm text-slate-500">Showing <span className="font-semibold text-slate-700">{filtered.length}</span> log{filtered.length !== 1 ? "s" : ""}</p>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                {["Sent", "Recipient", "Message", "Channel", "Status", "Actions"].map(h => (
                                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.map(log => {
                                const ch = CHANNEL_STYLE[log.channel] || CHANNEL_STYLE.SMS
                                const ChIcon = ch.icon
                                return (
                                    <tr key={log.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                                        <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{formatTime(log.sentAt)}</td>
                                        <td className="px-4 py-3">
                                            <p className="text-sm font-medium text-slate-700">{log.recipient}</p>
                                            <p className="text-xs text-slate-400 font-mono">{log.phone}</p>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-600 max-w-[200px] truncate">{log.message}</td>
                                        <td className="px-4 py-3">
                                            <span className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold", ch.bg)}>
                                                <ChIcon size={11} />{log.channel}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <StatusBadge status={log.status === "Delivered" ? "present" : log.status === "Failed" ? "absent" : log.status === "Pending" ? "pending" : "inactive"} size="sm" label={log.status} />
                                            {log.retries > 0 && <p className="text-[10px] text-slate-400 mt-0.5">{log.retries} retr{log.retries > 1 ? "ies" : "y"}</p>}
                                        </td>
                                        <td className="px-4 py-3">
                                            {log.status === "Failed" && (
                                                <button onClick={() => setRetrying(log.id)} disabled={retrying === log.id}
                                                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50">
                                                    {retrying === log.id ? <Loader2 size={12} className="animate-spin" /> : <RotateCcw size={12} />} Retry
                                                </button>
                                            )}
                                        </td>
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