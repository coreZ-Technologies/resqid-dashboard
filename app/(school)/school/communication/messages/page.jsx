"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
    Mail, Plus, Search, Eye, RefreshCw, CheckCircle2, XCircle, Clock
} from "lucide-react"
import PageHeader from "@/components/shared/PageHeader"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import { StatusBadge } from "@/components/shared/StatusBadge"
import ToolbarActions from "@/components/shared/ToolbarActions"
import { cn } from "@/lib/utils"

const MOCK_MESSAGES = [
    { id: "msg1", to: "All Class 10 Parents", subject: "Board Exam Preparation Meeting", sentAt: "Today, 11:30 AM", sent: 32, delivered: 32, read: 28, status: "delivered" },
    { id: "msg2", to: "Mrs. Priya Sharma (Aarav - 9A)", subject: "Attendance concern for this week", sentAt: "Today, 10:15 AM", sent: 1, delivered: 1, read: 1, status: "read" },
    { id: "msg3", to: "All Class 6 Parents", subject: "Fee payment reminder - Due 5th June", sentAt: "Yesterday, 3:00 PM", sent: 36, delivered: 35, read: 22, status: "partial" },
    { id: "msg4", to: "Mr. Vikram Singh (Priya - 8C)", subject: "PTM confirmation for 15th June", sentAt: "Yesterday, 9:00 AM", sent: 1, delivered: 1, read: 1, status: "read" },
    { id: "msg5", to: "All Teachers", subject: "Staff meeting tomorrow at 8:30 AM", sentAt: "2 days ago", sent: 28, delivered: 28, read: 25, status: "delivered" },
    { id: "msg6", to: "Class 7 Parents", subject: "Science project submission deadline", sentAt: "3 days ago", sent: 35, delivered: 33, read: 30, status: "delivered" },
    { id: "msg7", to: "Mrs. Ananya Reddy (Karan - 11A)", subject: "Physics remedial class schedule", sentAt: "5 days ago", sent: 1, delivered: 0, read: 0, status: "failed" },
]

export default function MessagesPage() {
    const router = useRouter()
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("All")

    const filtered = useMemo(() => MOCK_MESSAGES.filter(m => {
        if (statusFilter !== "All" && m.status !== statusFilter) return false
        if (search) {
            const q = search.toLowerCase()
            return m.subject.toLowerCase().includes(q) || m.to.toLowerCase().includes(q)
        }
        return true
    }), [search, statusFilter])

    const stats = {
        total: MOCK_MESSAGES.length,
        delivered: MOCK_MESSAGES.filter(m => m.status === "delivered" || m.status === "read").length,
        read: MOCK_MESSAGES.filter(m => m.status === "read").length,
        failed: MOCK_MESSAGES.filter(m => m.status === "failed").length,
    }

    return (
        <div className="max-w-[1300px] space-y-6">
            <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "Communication", href: "/school/communication" }, { label: "Messages" }]} />

            <PageHeader title="Messages" description="Direct messages sent to parents and staff">
                <div className="flex items-center gap-2">
                    <ToolbarActions onRefresh={() => console.log("Refreshing...")} onExport={() => console.log("Exporting...")} />
                    <button onClick={() => router.push("/school/communication/messages/add")}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-violet-700 text-white text-sm font-semibold shadow-sm shadow-violet-200 hover:from-violet-600 hover:to-violet-800 transition-all">
                        <Plus size={16} /> New Message
                    </button>
                </div>
            </PageHeader>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Sent", value: stats.total, icon: Mail, color: "bg-blue-500" },
                    { label: "Delivered", value: stats.delivered, icon: CheckCircle2, color: "bg-emerald-500" },
                    { label: "Read", value: stats.read, icon: Eye, color: "bg-violet-500" },
                    { label: "Failed", value: stats.failed, icon: XCircle, color: stats.failed > 0 ? "bg-red-500" : "bg-slate-400" },
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
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by subject or recipient..."
                        className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-violet-500 transition-all" />
                </div>
                <div className="flex gap-1.5">
                    {["All", "delivered", "read", "partial", "failed"].map(s => (
                        <button key={s} onClick={() => setStatusFilter(s)}
                            className={`px-3 py-2 rounded-lg border text-sm font-medium capitalize transition-all ${statusFilter === s ? "bg-violet-600 border-violet-600 text-white shadow-sm" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>{s}</button>
                    ))}
                </div>
            </div>

            <p className="text-sm text-slate-500">Showing <span className="font-semibold text-slate-700">{filtered.length}</span> message{filtered.length !== 1 ? "s" : ""}</p>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                {["To", "Subject", "Sent", "Sent", "Delivered", "Read", "Status"].map(h => (
                                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(msg => (
                                <tr key={msg.id} className="border-b border-slate-50 hover:bg-slate-50/50 cursor-pointer"
                                    onClick={() => router.push(`/school/communication/messages/${msg.id}`)}>
                                    <td className="px-4 py-3">
                                        <p className="text-sm font-medium text-slate-700">{msg.to}</p>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600">{msg.subject}</td>
                                    <td className="px-4 py-3 text-xs text-slate-400">{msg.sentAt}</td>
                                    <td className="px-4 py-3 text-xs font-semibold text-slate-700">{msg.sent}</td>
                                    <td className="px-4 py-3 text-xs font-semibold text-emerald-600">{msg.delivered}</td>
                                    <td className="px-4 py-3 text-xs font-semibold text-violet-600">{msg.read}</td>
                                    <td className="px-4 py-3">
                                        <StatusBadge status={msg.status === "delivered" || msg.status === "read" ? "present" : msg.status === "partial" ? "pending" : "absent"} size="sm"
                                            label={msg.status === "read" ? "Read" : msg.status === "delivered" ? "Delivered" : msg.status === "partial" ? "Partial" : "Failed"} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}