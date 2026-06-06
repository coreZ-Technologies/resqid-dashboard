"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Users, UserCheck, Clock, AlertTriangle, ChevronRight, Eye, Wifi } from "lucide-react"
import PageHeader from "@/components/shared/PageHeader"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import { KpiCard } from "@/components/shared/KpiCard"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { MOCK_ATTENDANCE_TODAY } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const TABS = [
    { id: "overview", label: "Today's Overview" },
    { id: "classes", label: "By Class" },
]

export default function AttendancePage() {
    const router = useRouter()
    const [tab, setTab] = useState("overview")
    const { totalStudents, present, absent, late, classes } = MOCK_ATTENDANCE_TODAY

    return (
        <div className="max-w-[1300px] space-y-6">
            <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "Attendance" }]} />

            <PageHeader title="Attendance" description="Track daily attendance, RFID logs, and generate reports">
                <div className="flex items-center gap-2">
                    <button onClick={() => router.push("/school/attendance/logs")}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                        <Eye size={15} /> View Logs
                    </button>
                    <button onClick={() => router.push("/school/attendance/reports")}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-violet-700 text-white text-sm font-semibold shadow-sm shadow-violet-200 hover:from-violet-600 hover:to-violet-800 transition-all">
                        <Calendar size={15} /> Reports
                    </button>
                </div>
            </PageHeader>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard title="Total Students" value={totalStudents} icon={Users} iconColor="blue" />
                <KpiCard title="Present" value={present} icon={UserCheck} iconColor="green" description={`${Math.round((present / totalStudents) * 100)}%`} />
                <KpiCard title="Absent" value={absent} icon={AlertTriangle} iconColor="red" change={absent > 0 ? absent : undefined} invert />
                <KpiCard title="Late" value={late} icon={Clock} iconColor="amber" />
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
                {TABS.map(t => (
                    <button key={t.id} onClick={() => setTab(t.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.id ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Class Cards */}
            {tab === "overview" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {classes.map(cls => (
                        <div key={cls.classId} onClick={() => router.push(`/school/attendance/${cls.classId}`)}
                            className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-5 cursor-pointer">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="font-bold text-slate-800">{cls.grade}–{cls.section}</h3>
                                    <p className="text-xs text-slate-500 mt-0.5">{cls.total} students</p>
                                </div>
                                <StatusBadge status={cls.percentage >= 90 ? "present" : cls.percentage >= 75 ? "late" : "absent"}
                                    size="sm" label={`${cls.percentage}%`} />
                            </div>

                            <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                                <span className="flex items-center gap-1"><UserCheck size={11} className="text-emerald-500" /> {cls.present} present</span>
                                <span className="flex items-center gap-1"><AlertTriangle size={11} className="text-red-500" /> {cls.absent} absent</span>
                                {cls.late > 0 && <span className="flex items-center gap-1"><Clock size={11} className="text-amber-500" /> {cls.late} late</span>}
                            </div>

                            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden flex">
                                <div className="h-full bg-emerald-500" style={{ width: `${(cls.present / cls.total) * 100}%` }} />
                                <div className="h-full bg-amber-500" style={{ width: `${(cls.late / cls.total) * 100}%` }} />
                                <div className="h-full bg-red-500" style={{ width: `${(cls.absent / cls.total) * 100}%` }} />
                            </div>

                            <div className="flex items-center justify-end mt-3 pt-3 border-t border-slate-100">
                                <button onClick={(e) => { e.stopPropagation(); router.push(`/school/attendance/mark?class=${cls.classId}`) }}
                                    className="text-xs text-violet-500 hover:text-violet-700 font-medium flex items-center gap-1">
                                    Mark Attendance <ChevronRight size={12} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}