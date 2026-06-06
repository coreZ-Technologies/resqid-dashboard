"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Search, Download, Calendar, X } from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { MOCK_DEVICES } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const MOCK_FULL_LOGS = [
    { id: 1, time: "8:12 AM", student: "Aarav Sharma", class: "Cls 6-A", rollNo: 1, cardId: "RFID-001", type: "tap-in", status: "success", date: "Today" },
    { id: 2, time: "8:14 AM", student: "Ananya Patel", class: "Cls 6-A", rollNo: 2, cardId: "RFID-002", type: "tap-in", status: "success", date: "Today" },
    { id: 3, time: "8:17 AM", student: "Unknown", class: "—", rollNo: null, cardId: "UNREG-042", type: "tap-in", status: "failed", date: "Today" },
    { id: 4, time: "8:20 AM", student: "Diya Reddy", class: "Cls 6-A", rollNo: 4, cardId: "RFID-004", type: "tap-in", status: "success", date: "Today" },
    { id: 5, time: "9:05 AM", student: "Arjun Nair", class: "Cls 6-A", rollNo: 3, cardId: "RFID-003", type: "tap-in", status: "late", date: "Today" },
    { id: 6, time: "8:10 AM", student: "Kavya Joshi", class: "Cls 6-A", rollNo: 6, cardId: "RFID-006", type: "tap-in", status: "success", date: "Yesterday" },
    { id: 7, time: "8:11 AM", student: "Reyansh Kumar", class: "Cls 6-A", rollNo: 7, cardId: "RFID-007", type: "tap-in", status: "success", date: "Yesterday" },
    { id: 8, time: "2:05 PM", student: "Aarav Sharma", class: "Cls 6-A", rollNo: 1, cardId: "RFID-001", type: "tap-out", status: "success", date: "Today" },
    { id: 9, time: "2:02 PM", student: "Ananya Patel", class: "Cls 6-A", rollNo: 2, cardId: "RFID-002", type: "tap-out", status: "success", date: "Today" },
    { id: 10, time: "2:00 PM", student: "Arjun Nair", class: "Cls 6-A", rollNo: 3, cardId: "RFID-003", type: "tap-out", status: "success", date: "Today" },
]

const STATUS_OPTIONS = ["All", "success", "late", "failed"]
const TYPE_OPTIONS = ["All", "tap-in", "tap-out"]

export default function DeviceLogsPage() {
    const router = useRouter()
    const params = useParams()
    const deviceId = params.deviceId

    const [device, setDevice] = useState(null)
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("All")
    const [typeFilter, setTypeFilter] = useState("All")

    useEffect(() => {
        const found = MOCK_DEVICES.find(d => d.id === deviceId)
        if (found) setDevice(found)
    }, [deviceId])

    const filtered = useMemo(() => MOCK_FULL_LOGS.filter(log => {
        const matchStatus = statusFilter === "All" || log.status === statusFilter
        const matchType = typeFilter === "All" || log.type === typeFilter
        const matchSearch = !search ||
            log.student.toLowerCase().includes(search.toLowerCase()) ||
            log.cardId.toLowerCase().includes(search.toLowerCase()) ||
            log.class.toLowerCase().includes(search.toLowerCase())
        return matchStatus && matchType && matchSearch
    }), [search, statusFilter, typeFilter])

    const successCount = MOCK_FULL_LOGS.filter(l => l.status === "success").length
    const failedCount = MOCK_FULL_LOGS.filter(l => l.status === "failed").length
    const lateCount = MOCK_FULL_LOGS.filter(l => l.status === "late").length

    return (
        <div className="max-w-[1300px] mx-auto space-y-6">
            <PageBreadcrumb items={[
                { label: "Dashboard", href: "/school" },
                { label: "Attendance", href: "/school/attendance" },
                { label: "Devices", href: "/school/attendance/devices" },
                { label: device?.name || "Device", href: `/school/attendance/devices/${deviceId}` },
                { label: "Logs" },
            ]} />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"><ArrowLeft size={18} /></button>
                    <div>
                        <h1 className="text-[22px] font-bold text-slate-800">{device?.name} — Scan Logs</h1>
                        <p className="text-[13px] text-slate-500">{device?.location}</p>
                    </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm"><Download size={15} /> Export Logs</button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { label: "Total Scans", value: MOCK_FULL_LOGS.length, color: "bg-blue-500" },
                    { label: "Success", value: successCount, color: "bg-emerald-500" },
                    { label: "Failed", value: failedCount, color: "bg-red-500" },
                    { label: "Late", value: lateCount, color: "bg-amber-500" },
                ].map(s => (
                    <div key={s.label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-3 flex items-center gap-3">
                        <div className={`w-2 h-8 rounded-full ${s.color}`} />
                        <div><p className="text-lg font-bold text-slate-800">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3 flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px]">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search student, card ID..."
                        className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-violet-500 transition-all" />
                </div>
                <div className="flex gap-1.5">
                    {STATUS_OPTIONS.map(s => (
                        <button key={s} onClick={() => setStatusFilter(s)}
                            className={`px-3 py-2 rounded-lg border text-sm font-medium capitalize transition-all ${statusFilter === s ? "bg-violet-600 border-violet-600 text-white" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>{s}</button>
                    ))}
                </div>
                <div className="flex gap-1.5">
                    {TYPE_OPTIONS.map(t => (
                        <button key={t} onClick={() => setTypeFilter(t)}
                            className={`px-3 py-2 rounded-lg border text-sm font-medium capitalize transition-all ${typeFilter === t ? "bg-slate-800 border-slate-800 text-white" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>{t}</button>
                    ))}
                </div>
            </div>

            {/* Logs Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                {["Time", "Student", "Class", "Roll No", "Card ID", "Type", "Status"].map(h => (
                                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan={7} className="px-4 py-16 text-center text-sm text-slate-400">No logs found.</td></tr>
                            ) : (
                                filtered.map(log => (
                                    <tr key={log.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                                        <td className="px-4 py-3 text-xs text-slate-600">{log.time}</td>
                                        <td className="px-4 py-3 text-sm font-medium text-slate-700">{log.student}</td>
                                        <td className="px-4 py-3 text-xs text-slate-500">{log.class}</td>
                                        <td className="px-4 py-3 text-xs text-slate-500">{log.rollNo || "—"}</td>
                                        <td className="px-4 py-3 text-xs font-mono text-slate-500">{log.cardId}</td>
                                        <td className="px-4 py-3">
                                            <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold",
                                                log.type === "tap-in" ? "bg-blue-100 text-blue-700" : "bg-violet-100 text-violet-700")}>
                                                {log.type === "tap-in" ? "IN" : "OUT"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <StatusBadge status={log.status === "success" ? "present" : log.status === "late" ? "late" : "inactive"} size="sm" label={log.status} />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-xs text-slate-400">Showing {filtered.length} of {MOCK_FULL_LOGS.length} logs</p>
                </div>
            </div>
        </div>
    )
}