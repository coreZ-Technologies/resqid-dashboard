"use client"

import { useState, useEffect } from "react"
import {
    BarChart2, Activity, Clock, CheckCircle2, XCircle,
    AlertTriangle, RefreshCw, Layers, Zap, Eye, RotateCcw,
    Trash2, Play, Pause, ChevronRight, Search
} from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import PageHeader from "@/components/shared/PageHeader"
import { StatusBadge } from "@/components/shared/StatusBadge"
import ToolbarActions from "@/components/shared/ToolbarActions"
import { cn } from "@/lib/utils"

// ─── Mock Queue Data (replace with Upstash Redis API calls) ──────────────────

const MOCK_QUEUES = [
    {
        name: "notifications",
        label: "Notifications",
        description: "Parent notification delivery (SMS, Email, Push)",
        waiting: 42,
        active: 8,
        completed: 12450,
        failed: 23,
        delayed: 5,
        paused: false,
        icon: Bell,
        color: "bg-blue-500",
    },
    {
        name: "attendance-sync",
        label: "Attendance Sync",
        description: "RFID tap events → attendance records",
        waiting: 3,
        active: 2,
        completed: 89200,
        failed: 12,
        delayed: 0,
        paused: false,
        icon: CalendarCheck,
        color: "bg-emerald-500",
    },
    {
        name: "qr-generation",
        label: "QR Generation",
        description: "Bulk QR code generation for student cards",
        waiting: 156,
        active: 4,
        completed: 3400,
        failed: 8,
        delayed: 0,
        paused: false,
        icon: QrCode,
        color: "bg-violet-500",
    },
    {
        name: "timetable-gen",
        label: "Timetable Generator",
        description: "CSP/backtracking timetable computation",
        waiting: 0,
        active: 0,
        completed: 87,
        failed: 3,
        delayed: 0,
        paused: false,
        icon: Clock,
        color: "bg-amber-500",
    },
    {
        name: "report-export",
        label: "Report Export",
        description: "CSV/PDF report generation for schools",
        waiting: 12,
        active: 2,
        completed: 5600,
        failed: 45,
        delayed: 3,
        paused: true,
        icon: BarChart2,
        color: "bg-rose-500",
    },
]

const MOCK_JOBS = {
    "notifications": [
        { id: "job-n-001", name: "Send SMS to 32 parents", status: "active", progress: 65, attempts: 1, createdAt: "2 min ago", data: { schoolId: "sch_001", type: "attendance" } },
        { id: "job-n-002", name: "Email fee reminder — Class 10", status: "waiting", progress: 0, attempts: 0, createdAt: "5 min ago", data: { schoolId: "sch_001", type: "fee" } },
        { id: "job-n-003", name: "Push notification — Holiday alert", status: "failed", progress: 0, attempts: 3, createdAt: "1 hour ago", data: { schoolId: "sch_003", type: "holiday" }, error: "Invalid device token" },
        { id: "job-n-004", name: "SMS to specific parent", status: "delayed", progress: 0, attempts: 0, createdAt: "10 min ago", data: { schoolId: "sch_002", type: "direct" }, scheduledFor: "2:00 PM" },
    ],
    "qr-generation": [
        { id: "job-qr-001", name: "Generate QR for Class 6-A (35 students)", status: "active", progress: 42, attempts: 1, createdAt: "3 min ago", data: { schoolId: "sch_001", class: "6-A" } },
        { id: "job-qr-002", name: "Generate QR for Class 10 (60 students)", status: "waiting", progress: 0, attempts: 0, createdAt: "8 min ago", data: { schoolId: "sch_001", class: "10" } },
    ],
}

// ─── Missing icons from lucide ────────────────────────────────────────────────
import { Bell, CalendarCheck, QrCode, Clock as ClockIcon } from "lucide-react"

const JOB_STATUS_CONFIG = {
    active: { label: "Active", color: "text-blue-600", bg: "bg-blue-50", dot: "bg-blue-500" },
    waiting: { label: "Waiting", color: "text-slate-500", bg: "bg-slate-50", dot: "bg-slate-400" },
    completed: { label: "Done", color: "text-emerald-600", bg: "bg-emerald-50", dot: "bg-emerald-500" },
    failed: { label: "Failed", color: "text-red-600", bg: "bg-red-50", dot: "bg-red-500" },
    delayed: { label: "Delayed", color: "text-amber-600", bg: "bg-amber-50", dot: "bg-amber-500" },
}

export default function QueueMonitorPage() {
    const [queues, setQueues] = useState(MOCK_QUEUES)
    const [selectedQueue, setSelectedQueue] = useState(null)
    const [jobs, setJobs] = useState([])
    const [search, setSearch] = useState("")
    const [refreshing, setRefreshing] = useState(false)

    const selectQueue = (queue) => {
        setSelectedQueue(queue)
        setJobs(MOCK_JOBS[queue.name] || [])
    }

    const handleRefresh = async () => {
        setRefreshing(true)
        await new Promise(r => setTimeout(r, 800))
        setRefreshing(false)
    }

    const handlePauseQueue = (queueName) => {
        setQueues(prev => prev.map(q => q.name === queueName ? { ...q, paused: !q.paused } : q))
    }

    const handleRetryJob = (jobId) => {
        setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: "waiting", attempts: 0 } : j))
    }

    const handleRemoveJob = (jobId) => {
        setJobs(prev => prev.filter(j => j.id !== jobId))
    }

    const handleClearQueue = (queueName) => {
        setJobs([])
    }

    const totalWaiting = queues.reduce((s, q) => s + q.waiting, 0)
    const totalActive = queues.reduce((s, q) => s + q.active, 0)
    const totalFailed = queues.reduce((s, q) => s + q.failed, 0)
    const totalCompleted = queues.reduce((s, q) => s + q.completed, 0)

    return (
        <div className="max-w-[1400px] mx-auto space-y-6">
            <PageBreadcrumb items={[{ label: "Super Admin", href: "/superadmin" }, { label: "Queue Monitor" }]} />

            <PageHeader title="Queue Monitor" description="BullMQ / Upstash Redis job queue status">
                <ToolbarActions onRefresh={handleRefresh} onExport={() => console.log("Export")} />
            </PageHeader>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Waiting", value: totalWaiting, icon: Clock, color: "bg-slate-500" },
                    { label: "Active", value: totalActive, icon: Zap, color: "bg-blue-500" },
                    { label: "Completed", value: totalCompleted.toLocaleString("en-IN"), icon: CheckCircle2, color: "bg-emerald-500" },
                    { label: "Failed", value: totalFailed, icon: XCircle, color: totalFailed > 0 ? "bg-red-500" : "bg-slate-400" },
                ].map(s => (
                    <div key={s.label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center`}><s.icon size={18} className="text-white" /></div>
                        <div><p className="text-xl font-bold text-slate-800">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Queue List */}
                <div className="lg:col-span-1 space-y-3">
                    <h2 className="font-semibold text-slate-800">Queues ({queues.length})</h2>
                    {queues.map(queue => (
                        <button key={queue.name} onClick={() => selectQueue(queue)}
                            className={cn("w-full bg-white rounded-xl border shadow-sm p-4 text-left transition-all hover:shadow-md",
                                selectedQueue?.name === queue.name ? "border-violet-500 ring-2 ring-violet-100" : "border-slate-200")}>
                            <div className="flex items-center gap-3 mb-3">
                                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", queue.color)}>
                                    <queue.icon size={18} className="text-white" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold text-slate-800 text-sm">{queue.label}</p>
                                        {queue.paused && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-700">PAUSED</span>}
                                    </div>
                                    <p className="text-xs text-slate-400">{queue.description}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 gap-2 text-center text-xs">
                                <div><p className="font-bold text-slate-700">{queue.waiting}</p><p className="text-slate-400">Wait</p></div>
                                <div><p className="font-bold text-blue-600">{queue.active}</p><p className="text-slate-400">Active</p></div>
                                <div><p className="font-bold text-emerald-600">{queue.completed}</p><p className="text-slate-400">Done</p></div>
                                <div><p className={cn("font-bold", queue.failed > 0 ? "text-red-600" : "text-slate-400")}>{queue.failed}</p><p className="text-slate-400">Fail</p></div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Job Details */}
                <div className="lg:col-span-2">
                    {!selectedQueue ? (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-16 text-center">
                            <Layers size={40} className="mx-auto mb-3 text-slate-300" />
                            <p className="text-slate-500 font-medium">Select a queue to view jobs</p>
                            <p className="text-xs text-slate-400 mt-1">Click any queue from the left panel</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Queue Actions */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center justify-between">
                                <div>
                                    <h2 className="font-semibold text-slate-800">{selectedQueue.label} — Jobs</h2>
                                    <p className="text-xs text-slate-500">{jobs.length} jobs in queue</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handlePauseQueue(selectedQueue.name)}
                                        className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors",
                                            selectedQueue.paused ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-amber-50 border-amber-200 text-amber-700")}>
                                        {selectedQueue.paused ? <><Play size={12} />Resume</> : <><Pause size={12} />Pause</>}
                                    </button>
                                    <button onClick={() => handleClearQueue(selectedQueue.name)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 text-xs font-medium hover:bg-red-50 transition-colors">
                                        <Trash2 size={12} />Clear
                                    </button>
                                </div>
                            </div>

                            {/* Jobs Table */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                                {["Job", "Status", "Progress", "Attempts", "Created", "Actions"].map(h => (
                                                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {jobs.length === 0 ? (
                                                <tr><td colSpan={6} className="px-4 py-16 text-center text-slate-400 text-sm">No jobs in this queue</td></tr>
                                            ) : (
                                                jobs.map(job => {
                                                    const status = JOB_STATUS_CONFIG[job.status] || JOB_STATUS_CONFIG.waiting
                                                    return (
                                                        <tr key={job.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                                                            <td className="px-4 py-3">
                                                                <p className="text-sm font-medium text-slate-700">{job.name}</p>
                                                                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{job.id}</p>
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <span className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold", status.bg, status.color)}>
                                                                    <span className={cn("w-1.5 h-1.5 rounded-full", status.dot)} />{status.label}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                {job.status === "active" ? (
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-20 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                                                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${job.progress}%` }} />
                                                                        </div>
                                                                        <span className="text-xs text-slate-500">{job.progress}%</span>
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-xs text-slate-400">—</span>
                                                                )}
                                                            </td>
                                                            <td className="px-4 py-3 text-xs text-slate-500">{job.attempts}/3</td>
                                                            <td className="px-4 py-3 text-xs text-slate-400">{job.createdAt}</td>
                                                            <td className="px-4 py-3">
                                                                <div className="flex items-center gap-1">
                                                                    {job.status === "failed" && (
                                                                        <button onClick={() => handleRetryJob(job.id)}
                                                                            className="p-1.5 rounded-lg hover:bg-amber-50 text-slate-400 hover:text-amber-600" title="Retry">
                                                                            <RotateCcw size={14} />
                                                                        </button>
                                                                    )}
                                                                    <button onClick={() => handleRemoveJob(job.id)}
                                                                        className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500" title="Remove">
                                                                        <XCircle size={14} />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Job Detail Panel (when clicking a job) */}
                            {jobs.some(j => j.error) && (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                    <h3 className="text-sm font-semibold text-red-800 flex items-center gap-2"><AlertTriangle size={14} />Failed Jobs</h3>
                                    {jobs.filter(j => j.error).map(j => (
                                        <div key={j.id} className="mt-2 text-xs text-red-700">
                                            <span className="font-mono">{j.id}</span>: {j.error}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}