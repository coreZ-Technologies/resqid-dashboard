"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import {
    ArrowLeft, Shield, MapPin, Clock, CalendarDays, ScanLine,
    CheckCircle2, AlertCircle, User, Bell, MessageCircle,
    ChevronRight, X, Eye
} from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { MOCK_ANOMALIES, MOCK_SCAN_LOGS } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const typeConfig = {
    duplicate_scan: { label: "Duplicate Scan", color: "bg-rose-100 text-rose-700 border-rose-200" },
    unknown_card: { label: "Unknown Card", color: "bg-amber-100 text-amber-700 border-amber-200" },
    outside_hours: { label: "Outside Hours", color: "bg-violet-100 text-violet-700 border-violet-200" },
    multiple_exits: { label: "Multiple Exits", color: "bg-sky-100 text-sky-700 border-sky-200" },
    suspicious_timing: { label: "Suspicious Timing", color: "bg-orange-100 text-orange-700 border-orange-200" },
}

const severityConfig = {
    high: { label: "High", color: "bg-rose-100 text-rose-700", icon: AlertCircle },
    medium: { label: "Medium", color: "bg-amber-100 text-amber-700", icon: AlertCircle },
    low: { label: "Low", color: "bg-slate-100 text-slate-600", icon: AlertCircle },
}

const MOCK_TIMELINE = (anomalyId) => [
    { time: "8:02 AM", action: "Anomaly detected", detail: "System flagged duplicate scan pattern", type: "system" },
    { time: "8:05 AM", action: "Notification sent", detail: "Admin alerted via dashboard", type: "system" },
    { time: "8:15 AM", action: "Investigation started", detail: "Admin reviewed scan logs", type: "admin" },
    { time: "8:30 AM", action: "Parent contacted", detail: "Called father - confirmed student was at school", type: "admin" },
    { time: "9:00 AM", action: "Status updated", detail: "Marked as investigating", type: "admin" },
]

export default function AnomalyDetailPage() {
    const router = useRouter()
    const params = useParams()
    const anomalyId = params.anomalyId

    const [loading, setLoading] = useState(true)
    const [anomaly, setAnomaly] = useState(null)
    const [notFound, setNotFound] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            const found = MOCK_ANOMALIES.find(a => a.id === anomalyId)
            if (found) setAnomaly(found)
            else setNotFound(true)
            setLoading(false)
        }, 400)
    }, [anomalyId])

    if (!loading && notFound) {
        return (
            <div className="max-w-[600px] mx-auto space-y-6">
                <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "Anomalies", href: "/school/anomalies" }, { label: "Not Found" }]} />
                <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
                    <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4"><X size={24} className="text-slate-400" /></div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">Anomaly not found</h3>
                    <button onClick={() => router.push("/school/anomalies")} className="px-5 py-2.5 rounded-lg bg-violet-600 text-white text-sm font-semibold">Back to Anomalies</button>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="max-w-[1000px] mx-auto space-y-6">
                <div className="h-5 w-48 bg-slate-200 rounded animate-pulse" />
                <div className="h-64 bg-slate-100 rounded-xl animate-pulse" />
            </div>
        )
    }

    const type = typeConfig[anomaly.type] || typeConfig.unknown_card
    const severity = severityConfig[anomaly.severity] || severityConfig.low
    const SeverityIcon = severity.icon
    const timeline = MOCK_TIMELINE(anomaly.id)
    const relatedScans = MOCK_SCAN_LOGS.filter(s => s.studentId === anomaly.studentId).slice(0, 5)

    return (
        <div className="max-w-[1000px] mx-auto space-y-6">
            <PageBreadcrumb items={[
                { label: "Dashboard", href: "/school" },
                { label: "Anomalies", href: "/school/anomalies" },
                { label: anomaly.id },
            ]} />

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"><ArrowLeft size={18} /></button>
                    <div>
                        <h1 className="text-[22px] font-bold text-slate-800">{anomaly.id}</h1>
                        <p className="text-[13px] text-slate-500">{anomaly.description}</p>
                    </div>
                </div>
                <StatusBadge status={anomaly.status === "open" ? "absent" : anomaly.status === "investigating" ? "pending" : "present"} label={anomaly.status} />
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Alert Banner */}
                    {anomaly.status !== "resolved" && (
                        <div className={cn("rounded-xl p-4 flex items-start gap-3",
                            anomaly.severity === "high" ? "bg-rose-50 border border-rose-200" : "bg-amber-50 border border-amber-200")}>
                            <SeverityIcon size={18} className={anomaly.severity === "high" ? "text-rose-600 mt-0.5" : "text-amber-600 mt-0.5"} />
                            <div>
                                <p className="font-semibold text-sm">{anomaly.severity === "high" ? "High Severity Alert" : "Needs Attention"}</p>
                                <p className="text-xs mt-0.5">This anomaly requires investigation. Take appropriate action.</p>
                            </div>
                        </div>
                    )}

                    {/* Student Info */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                        <h2 className="font-semibold text-slate-800 mb-4">Student Information</h2>
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                            <div className={`w-14 h-14 rounded-full ${anomaly.avatarColor} flex items-center justify-center text-white font-bold text-lg`}>{anomaly.avatar}</div>
                            <div>
                                <p className="font-bold text-slate-800 text-lg">{anomaly.student}</p>
                                <p className="text-sm text-slate-500">{anomaly.class}{anomaly.studentId && <span className="ml-2 font-mono">{anomaly.studentId}</span>}</p>
                            </div>
                            {anomaly.studentId && (
                                <button onClick={() => router.push(`/school/students/${anomaly.studentId}`)}
                                    className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors">
                                    <User size={14} />View Profile
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Anomaly Details */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                        <h2 className="font-semibold text-slate-800 mb-4">Anomaly Details</h2>
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold border", type.color)}>{type.label}</span>
                            <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold", severity.color)}>{severity.label}</span>
                            <StatusBadge status={anomaly.status === "open" ? "absent" : anomaly.status === "investigating" ? "pending" : "present"} size="sm" label={anomaly.status} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { icon: MapPin, label: "Location", value: anomaly.location },
                                { icon: Clock, label: "Time", value: `${anomaly.date} · ${anomaly.time}` },
                                { icon: CalendarDays, label: "Date", value: anomaly.date },
                                { icon: ScanLine, label: "Detected By", value: anomaly.detectedBy },
                            ].map(r => (
                                <div key={r.label} className="flex items-center gap-2.5">
                                    <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center"><r.icon size={16} className="text-slate-500" /></div>
                                    <div><p className="text-[10px] text-slate-400 uppercase">{r.label}</p><p className="text-sm font-medium text-slate-700">{r.value}</p></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                        <h2 className="font-semibold text-slate-800 mb-4">Activity Timeline</h2>
                        <div className="space-y-0">
                            {timeline.map((event, i) => {
                                const isLast = i === timeline.length - 1
                                return (
                                    <div key={i} className="flex gap-3">
                                        <div className="flex flex-col items-center">
                                            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center",
                                                event.type === "system" ? "bg-blue-100 text-blue-600" : "bg-violet-100 text-violet-600")}>
                                                {event.type === "system" ? <Shield size={14} /> : <User size={14} />}
                                            </div>
                                            {!isLast && <div className="w-0.5 flex-1 bg-slate-200" />}
                                        </div>
                                        <div className={cn("pb-4", isLast && "pb-0")}>
                                            <p className="text-sm font-medium text-slate-700">{event.action}</p>
                                            <p className="text-xs text-slate-500">{event.detail}</p>
                                            <p className="text-xs text-slate-400 mt-0.5">{event.time}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Related Scans */}
                    {relatedScans.length > 0 && (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-5 py-4 border-b border-slate-100">
                                <h2 className="font-semibold text-slate-800">Related Scans</h2>
                                <p className="text-xs text-slate-500 mt-0.5">Recent scan activity for this student</p>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead><tr className="border-b border-slate-100 bg-slate-50/50">
                                        <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase">Time</th>
                                        <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase">Gate</th>
                                        <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase">Type</th>
                                        <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase">Status</th>
                                    </tr></thead>
                                    <tbody>
                                        {relatedScans.map(scan => (
                                            <tr key={scan.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                                                <td className="px-4 py-3 text-xs text-slate-600">{scan.date} · {scan.time}</td>
                                                <td className="px-4 py-3 text-xs text-slate-500">{scan.gate}</td>
                                                <td className="px-4 py-3 text-xs text-slate-500 capitalize">{scan.type}</td>
                                                <td className="px-4 py-3"><StatusBadge status={scan.status === "success" ? "present" : "inactive"} size="sm" label={scan.status} /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar Actions */}
                <div className="space-y-4">
                    {anomaly.status !== "resolved" && (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-2">
                            <h3 className="font-semibold text-slate-800 mb-2">Actions</h3>
                            <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-colors"><CheckCircle2 size={14} />Mark as Resolved</button>
                            <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-700 text-sm font-semibold transition-colors"><AlertCircle size={14} />Mark as Investigating</button>
                            <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-semibold transition-colors"><Bell size={14} />Notify Parents</button>
                            <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-semibold transition-colors"><MessageCircle size={14} />Message Staff</button>
                        </div>
                    )}

                    {anomaly.status === "resolved" && (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                            <CheckCircle2 size={24} className="mx-auto mb-2 text-emerald-600" />
                            <p className="text-sm font-semibold text-emerald-700">Resolved</p>
                            <p className="text-xs text-emerald-600 mt-1">This anomaly has been resolved</p>
                        </div>
                    )}

                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                        <h3 className="font-semibold text-slate-800 mb-3">Quick Info</h3>
                        <div className="space-y-2 text-xs">
                            <div className="flex justify-between"><span className="text-slate-500">Type</span><span className="font-medium">{type.label}</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">Severity</span><span className={cn("font-medium", severity.color)}>{severity.label}</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">Status</span><span className="font-medium capitalize">{anomaly.status}</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">Detected</span><span className="font-medium">{anomaly.date}</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}