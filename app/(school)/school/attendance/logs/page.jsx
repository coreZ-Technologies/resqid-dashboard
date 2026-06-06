"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Search, Download, Filter, X } from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { MOCK_RFID_LOGS } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const STATUS_OPTIONS = ["All", "success", "late", "absent", "failed", "duplicate"]

export default function AttendanceLogsPage() {
    const router = useRouter()
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("All")
    const [dateFilter, setDateFilter] = useState("All")

    const filtered = useMemo(() => MOCK_RFID_LOGS.filter(log => {
        const matchStatus = statusFilter === "All" || log.status === statusFilter
        const matchSearch = !search ||
            log.studentName.toLowerCase().includes(search.toLowerCase()) ||
            log.class.toLowerCase().includes(search.toLowerCase()) ||
            log.cardId.toLowerCase().includes(search.toLowerCase())
        return matchStatus && matchSearch
    }), [search, statusFilter])

    return (
        <div className="max-w-[1300px] mx-auto space-y-6">
            <PageBreadcrumb items={[
                { label: "Dashboard", href: "/school" },
                { label: "Attendance", href: "/school/attendance" },
                { label: "RFID Logs" },
            ]} />

            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"><ArrowLeft size={18} /></button>
                <div>
                    <h1 className="text-[22px] font-bold text-slate-800">RFID Tap Logs</h1>
                    <p className="text-[13px] text-slate-500">Raw tap-in/tap-out events from all gate scanners</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3 flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px]">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by student, class, or card ID..."
                        className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all" />
                </div>
                <div className="flex gap-1.5 flex-wrap">
                    {STATUS_OPTIONS.map(s => (
                        <button key={s} onClick={() => setStatusFilter(s)}
                            className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all capitalize ${statusFilter === s ? "bg-violet-600 border-violet-600 text-white shadow-sm" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>{s}</button>
                    ))}
                </div>
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors"><Download size={14} /> Export</button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                {["Student", "Class", "Card ID", "Tap In", "Tap Out", "Gate", "Status"].map(h => (
                                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan={7} className="px-4 py-16 text-center text-sm text-slate-400">No logs found matching your filters.</td></tr>
                            ) : (
                                filtered.map(log => (
                                    <tr key={log.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                        <td className="px-4 py-3"><span className="text-sm font-medium text-slate-700">{log.studentName}</span></td>
                                        <td className="px-4 py-3 text-xs text-slate-500">{log.class}</td>
                                        <td className="px-4 py-3 text-xs font-mono text-slate-500">{log.cardId}</td>
                                        <td className="px-4 py-3 text-xs text-slate-600">{log.tapIn || "—"}</td>
                                        <td className="px-4 py-3 text-xs text-slate-600">{log.tapOut || "—"}</td>
                                        <td className="px-4 py-3 text-xs text-slate-500">{log.gate}</td>
                                        <td className="px-4 py-3">
                                            <StatusBadge status={
                                                log.status === "success" ? "present" :
                                                    log.status === "late" ? "late" :
                                                        log.status === "absent" ? "absent" :
                                                            log.status === "duplicate" ? "pending" : "inactive"
                                            } size="sm" label={log.status} />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-xs text-slate-400">Showing {filtered.length} of {MOCK_RFID_LOGS.length} logs</p>
                    <button onClick={() => router.push("/school/anomalies")} className="text-xs text-violet-500 hover:text-violet-700 font-medium">
                        View Anomalies →
                    </button>
                </div>
            </div>
        </div>
    )
}