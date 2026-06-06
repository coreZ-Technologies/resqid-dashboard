"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Download, Calendar, TrendingUp, TrendingDown, Users, BarChart3 } from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import { KpiCard } from "@/components/shared/KpiCard"
import { MOCK_CLASSES } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const MOCK_WEEKLY_DATA = [
    { day: "Mon", date: "Jun 1", present: 478, absent: 42, late: 22, total: 542 },
    { day: "Tue", date: "Jun 2", present: 485, absent: 38, late: 19, total: 542 },
    { day: "Wed", date: "Jun 3", present: 470, absent: 50, late: 22, total: 542 },
    { day: "Thu", date: "Jun 4", present: 490, absent: 35, late: 17, total: 542 },
    { day: "Fri", date: "Jun 5", present: 487, absent: 38, late: 17, total: 542 },
]

const MOCK_CLASS_REPORT = MOCK_CLASSES.filter(c => c.status === "Active").map(c => ({
    id: c.id, grade: c.grade, section: c.section, total: c.students,
    presentAvg: Math.floor(Math.random() * 15) + 80,
    trend: Math.random() > 0.5 ? "up" : "down",
})).slice(0, 8)

const REPORT_TABS = [
    { id: "daily", label: "Daily" },
    { id: "weekly", label: "Weekly" },
    { id: "monthly", label: "Monthly" },
]

export default function AttendanceReportsPage() {
    const router = useRouter()
    const [tab, setTab] = useState("weekly")
    const [selectedClass, setSelectedClass] = useState("All")

    const weekAvg = Math.round(MOCK_WEEKLY_DATA.reduce((sum, d) => sum + d.present, 0) / MOCK_WEEKLY_DATA.length)
    const bestDay = MOCK_WEEKLY_DATA.reduce((best, d) => d.present > best.present ? d : best, MOCK_WEEKLY_DATA[0])
    const worstDay = MOCK_WEEKLY_DATA.reduce((worst, d) => d.present < worst.present ? d : worst, MOCK_WEEKLY_DATA[0])

    return (
        <div className="max-w-[1300px] mx-auto space-y-6">
            <PageBreadcrumb items={[
                { label: "Dashboard", href: "/school" },
                { label: "Attendance", href: "/school/attendance" },
                { label: "Reports" },
            ]} />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"><ArrowLeft size={18} /></button>
                    <div>
                        <h1 className="text-[22px] font-bold text-slate-800">Attendance Reports</h1>
                        <p className="text-[13px] text-slate-500">June 1 – June 5, 2026</p>
                    </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                    <Download size={15} /> Export Report
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard title="Avg Attendance" value={`${weekAvg}/542`} icon={BarChart3} iconColor="blue" />
                <KpiCard title="Avg Percentage" value={`${Math.round((weekAvg / 542) * 100)}%`} icon={TrendingUp} iconColor="green" />
                <KpiCard title="Best Day" value={bestDay.day} icon={TrendingUp} iconColor="emerald" description={`${bestDay.present} present`} />
                <KpiCard title="Lowest Day" value={worstDay.day} icon={TrendingDown} iconColor="red" description={`${worstDay.present} present`} />
            </div>

            {/* Tabs */}
            <div className="flex items-center justify-between">
                <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
                    {REPORT_TABS.map(t => (
                        <button key={t.id} onClick={() => setTab(t.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.id ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>{t.label}</button>
                    ))}
                </div>
                <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)}
                    className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-violet-500 bg-white">
                    <option value="All">All Classes</option>
                    {MOCK_CLASS_REPORT.map(c => <option key={c.id} value={c.id}>{c.grade}–{c.section}</option>)}
                </select>
            </div>

            {/* Weekly Bar Chart (Visual) */}
            {tab === "weekly" && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <h2 className="font-semibold text-slate-800 mb-6">Weekly Attendance Overview</h2>
                    <div className="flex items-end justify-between gap-2 h-48">
                        {MOCK_WEEKLY_DATA.map(d => {
                            const pct = Math.round((d.present / d.total) * 100)
                            return (
                                <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                                    <span className="text-xs font-semibold text-slate-700">{d.present}</span>
                                    <div className="w-full rounded-t-lg bg-gradient-to-t from-violet-500 to-violet-400 transition-all hover:from-violet-600 hover:to-violet-500"
                                        style={{ height: `${pct}%`, minHeight: 8 }} />
                                    <span className="text-[10px] text-slate-400">{d.day}</span>
                                    <span className="text-[10px] text-slate-400">{d.date}</span>
                                </div>
                            )
                        })}
                    </div>
                    <div className="flex items-center justify-center gap-6 mt-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-violet-400" /> Present</span>
                        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-400" /> Absent</span>
                        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-400" /> Late</span>
                    </div>
                </div>
            )}

            {/* Class-wise Report */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100">
                    <h2 className="font-semibold text-slate-800">Class-wise Attendance</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Average attendance percentage for the selected period</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                {["Class", "Students", "Avg Attendance", "Trend", "Status"].map(h => (
                                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_CLASS_REPORT.filter(c => selectedClass === "All" || c.id === selectedClass).map(cls => (
                                <tr key={cls.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                                    <td className="px-4 py-3 font-medium text-slate-700">{cls.grade}–{cls.section}</td>
                                    <td className="px-4 py-3 text-xs text-slate-500">{cls.total}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-24 h-2 rounded-full bg-slate-100 overflow-hidden">
                                                <div className={cn("h-full rounded-full", cls.presentAvg >= 90 ? "bg-emerald-500" : cls.presentAvg >= 75 ? "bg-amber-500" : "bg-red-500")}
                                                    style={{ width: `${cls.presentAvg}%` }} />
                                            </div>
                                            <span className="text-xs font-semibold text-slate-700">{cls.presentAvg}%</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        {cls.trend === "up" ? (
                                            <span className="inline-flex items-center gap-1 text-xs text-emerald-600"><TrendingUp size={12} /> +2%</span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-xs text-red-600"><TrendingDown size={12} /> -1%</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold",
                                            cls.presentAvg >= 90 ? "bg-emerald-100 text-emerald-700" :
                                                cls.presentAvg >= 75 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700")}>
                                            {cls.presentAvg >= 90 ? "Good" : cls.presentAvg >= 75 ? "Average" : "Low"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detailed Day-wise Table */}
            {tab === "weekly" && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100">
                        <h2 className="font-semibold text-slate-800">Day-wise Breakdown</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50">
                                    {["Day", "Date", "Present", "Absent", "Late", "Total", "%"].map(h => (
                                        <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {MOCK_WEEKLY_DATA.map(d => (
                                    <tr key={d.day} className="border-b border-slate-50 hover:bg-slate-50/50">
                                        <td className="px-4 py-3 font-medium text-slate-700">{d.day}</td>
                                        <td className="px-4 py-3 text-xs text-slate-500">{d.date}</td>
                                        <td className="px-4 py-3 text-xs text-emerald-600 font-semibold">{d.present}</td>
                                        <td className="px-4 py-3 text-xs text-red-600 font-semibold">{d.absent}</td>
                                        <td className="px-4 py-3 text-xs text-amber-600 font-semibold">{d.late}</td>
                                        <td className="px-4 py-3 text-xs text-slate-500">{d.total}</td>
                                        <td className="px-4 py-3 text-xs font-semibold text-slate-700">{Math.round((d.present / d.total) * 100)}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}