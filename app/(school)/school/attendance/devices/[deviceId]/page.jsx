"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import {
    ArrowLeft, Wifi, WifiOff, Battery, RefreshCw, MapPin,
    Activity, Cpu, Calendar, Clock, Users, Download, Eye,
    RotateCcw, Power, AlertTriangle, Check, TrendingUp, X
} from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { KpiCard } from "@/components/shared/KpiCard"
import { MOCK_DEVICES } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const MOCK_DEVICE_LOGS = [
    { time: "8:12 AM", student: "Aarav Sharma", class: "Cls 6-A", cardId: "RFID-001", status: "success" },
    { time: "8:14 AM", student: "Ananya Patel", class: "Cls 6-A", cardId: "RFID-002", status: "success" },
    { time: "8:17 AM", student: "Unknown", class: "—", cardId: "UNREG-042", status: "failed" },
    { time: "8:20 AM", student: "Diya Reddy", class: "Cls 6-A", cardId: "RFID-004", status: "success" },
    { time: "9:05 AM", student: "Arjun Nair", class: "Cls 6-A", cardId: "RFID-003", status: "late" },
]

const MOCK_DEVICE_STATS = {
    scansToday: 487,
    scansThisWeek: 2341,
    successRate: 98.5,
    avgResponseTime: "0.3s",
    uptime: "99.7%",
    lastMaintenance: "2026-05-15",
}

export default function DeviceProfilePage() {
    const router = useRouter()
    const params = useParams()
    const deviceId = params.deviceId

    const [loading, setLoading] = useState(true)
    const [device, setDevice] = useState(null)
    const [notFound, setNotFound] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            const found = MOCK_DEVICES.find(d => d.id === deviceId)
            if (found) setDevice(found)
            else setNotFound(true)
            setLoading(false)
        }, 400)
    }, [deviceId])

    if (!loading && notFound) {
        return (
            <div className="max-w-[600px] mx-auto space-y-6">
                <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "Devices", href: "/school/attendance/devices" }, { label: "Not Found" }]} />
                <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
                    <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4"><X size={24} className="text-slate-400" /></div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">Device not found</h3>
                    <button onClick={() => router.push("/school/attendance/devices")} className="px-5 py-2.5 rounded-lg bg-violet-600 text-white text-sm font-semibold">Back to Devices</button>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="max-w-[1300px] mx-auto space-y-6">
                <div className="h-5 w-48 bg-slate-200 rounded animate-pulse" />
                <div className="h-8 w-64 bg-slate-200 rounded animate-pulse" />
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-slate-100 rounded-xl animate-pulse" />)}</div>
            </div>
        )
    }

    return (
        <div className="max-w-[1300px] mx-auto space-y-6">
            <PageBreadcrumb items={[
                { label: "Dashboard", href: "/school" },
                { label: "Attendance", href: "/school/attendance" },
                { label: "Devices", href: "/school/attendance/devices" },
                { label: device.name },
            ]} />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"><ArrowLeft size={18} /></button>
                    <div className="flex items-center gap-3">
                        <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center", device.status === "online" ? "bg-emerald-500" : "bg-red-500")}>
                            {device.status === "online" ? <Wifi size={24} className="text-white" /> : <WifiOff size={24} className="text-white" />}
                        </div>
                        <div>
                            <h1 className="text-[22px] font-bold text-slate-800">{device.name}</h1>
                            <div className="flex items-center gap-2 mt-0.5">
                                <StatusBadge status={device.status === "online" ? "active" : "inactive"} size="sm" label={device.status} />
                                <span className="text-xs text-slate-400">{device.type} — {device.location}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm"><RotateCcw size={15} /> Restart</button>
                    <button onClick={() => router.push(`/school/attendance/devices/${deviceId}/logs`)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors shadow-sm"><Eye size={15} /> View Logs</button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard title="Scans Today" value={MOCK_DEVICE_STATS.scansToday.toLocaleString("en-IN")} icon={Activity} iconColor="blue" />
                <KpiCard title="Success Rate" value={`${MOCK_DEVICE_STATS.successRate}%`} icon={Check} iconColor="green" />
                <KpiCard title="Avg Response" value={MOCK_DEVICE_STATS.avgResponseTime} icon={Clock} iconColor="violet" />
                <KpiCard title="Uptime" value={MOCK_DEVICE_STATS.uptime} icon={TrendingUp} iconColor="emerald" />
            </div>

            {/* Two Column */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Left — Info + Recent Logs */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Device Info */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                        <h2 className="font-semibold text-slate-800 mb-4">Device Information</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[
                                { icon: MapPin, label: "Location", value: device.location },
                                { icon: Cpu, label: "Firmware", value: device.firmware },
                                { icon: Battery, label: "Battery", value: `${device.battery}%` },
                                { icon: RefreshCw, label: "Last Sync", value: device.lastSync },
                                { icon: Calendar, label: "Last Maintenance", value: MOCK_DEVICE_STATS.lastMaintenance },
                                { icon: Activity, label: "Scans This Week", value: MOCK_DEVICE_STATS.scansThisWeek.toLocaleString("en-IN") },
                                { icon: Clock, label: "Avg Response", value: MOCK_DEVICE_STATS.avgResponseTime },
                                { icon: TrendingUp, label: "Uptime", value: MOCK_DEVICE_STATS.uptime },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-2.5">
                                    <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center shrink-0"><item.icon size={16} className="text-slate-500" /></div>
                                    <div><p className="text-[10px] text-slate-400 uppercase font-semibold">{item.label}</p><p className="text-sm font-medium text-slate-700">{item.value}</p></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Scans */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                            <div><h2 className="font-semibold text-slate-800">Recent Scans</h2><p className="text-xs text-slate-500 mt-0.5">Last 5 tap events</p></div>
                            <button onClick={() => router.push(`/school/attendance/devices/${deviceId}/logs`)}
                                className="text-xs text-violet-500 hover:text-violet-700 font-medium">View All →</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead><tr className="border-b border-slate-50 bg-slate-50/50">
                                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase">Time</th>
                                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase">Student</th>
                                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase">Class</th>
                                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase">Card ID</th>
                                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase">Status</th>
                                </tr></thead>
                                <tbody>
                                    {MOCK_DEVICE_LOGS.map((log, i) => (
                                        <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50">
                                            <td className="px-4 py-3 text-xs text-slate-600">{log.time}</td>
                                            <td className="px-4 py-3 text-sm font-medium text-slate-700">{log.student}</td>
                                            <td className="px-4 py-3 text-xs text-slate-500">{log.class}</td>
                                            <td className="px-4 py-3 text-xs font-mono text-slate-500">{log.cardId}</td>
                                            <td className="px-4 py-3">
                                                <StatusBadge status={log.status === "success" ? "present" : log.status === "late" ? "late" : "inactive"} size="sm" label={log.status} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right — Battery + Health */}
                <div className="space-y-6">
                    {/* Battery Health */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 text-center">
                        <h3 className="font-semibold text-slate-800 mb-4">Battery Health</h3>
                        <div className="relative w-24 h-24 mx-auto mb-3">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="42" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                                <circle cx="50" cy="50" r="42" fill="none" stroke={device.battery > 50 ? "#10b981" : device.battery > 25 ? "#f59e0b" : "#ef4444"} strokeWidth="8"
                                    strokeDasharray={`${device.battery * 2.64} 264`} strokeLinecap="round" className="transition-all duration-700" />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-slate-800">{device.battery}%</span>
                        </div>
                        <p className="text-xs text-slate-500">{device.battery < 25 ? "Low battery — needs charging" : device.battery < 50 ? "Moderate — charge soon" : "Healthy"}</p>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                        <h3 className="font-semibold text-slate-800 mb-4">Performance</h3>
                        <div className="space-y-3">
                            {[
                                { label: "Success Rate", value: `${MOCK_DEVICE_STATS.successRate}%`, color: "bg-emerald-500" },
                                { label: "Avg Response", value: MOCK_DEVICE_STATS.avgResponseTime, color: "bg-blue-500" },
                                { label: "Uptime", value: MOCK_DEVICE_STATS.uptime, color: "bg-violet-500" },
                                { label: "Scans Today", value: MOCK_DEVICE_STATS.scansToday, color: "bg-amber-500" },
                            ].map(stat => (
                                <div key={stat.label} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${stat.color}`} />
                                        <span className="text-xs text-slate-600">{stat.label}</span>
                                    </div>
                                    <span className="text-xs font-semibold text-slate-700">{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Alerts */}
                    {device.battery < 25 && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                            <AlertTriangle size={16} className="text-red-600 mt-0.5" />
                            <div>
                                <p className="text-sm font-semibold text-red-700">Low Battery Alert</p>
                                <p className="text-xs text-red-600">Device battery critically low. Charge immediately to avoid downtime.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}