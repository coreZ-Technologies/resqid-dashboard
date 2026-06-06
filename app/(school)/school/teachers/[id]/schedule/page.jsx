"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Clock, Download, X } from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import { MOCK_TEACHERS } from "@/lib/mock-data"
import { DAYS_OF_WEEK, PERIOD_TIMES } from "@/lib/constants"
import { cn } from "@/lib/utils"

export default function TeacherSchedulePage() {
    const router = useRouter()
    const params = useParams()
    const teacherId = params.id

    const [loading, setLoading] = useState(true)
    const [teacher, setTeacher] = useState(null)
    const [notFound, setNotFound] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            const found = MOCK_TEACHERS.find(t => t.id === teacherId)
            if (found) setTeacher(found)
            else setNotFound(true)
            setLoading(false)
        }, 400)
    }, [teacherId])

    if (!loading && notFound) {
        return (
            <div className="max-w-[600px] mx-auto space-y-6">
                <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "Teachers", href: "/school/teachers" }, { label: "Not Found" }]} />
                <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
                    <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4"><X size={24} className="text-slate-400" /></div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">Teacher not found</h3>
                    <button onClick={() => router.push("/school/teachers")} className="px-5 py-2.5 rounded-lg bg-violet-600 text-white text-sm font-semibold">Back to Teachers</button>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="max-w-[1300px] mx-auto space-y-6">
                <div className="h-5 w-48 bg-slate-200 rounded animate-pulse" />
                <div className="h-[500px] bg-slate-100 rounded-xl animate-pulse" />
            </div>
        )
    }

    const scheduleMap = {}
    DAYS_OF_WEEK.forEach(day => {
        scheduleMap[day] = {}
        PERIOD_TIMES.forEach((_, idx) => {
            scheduleMap[day][idx + 1] = null
        })
    })
        ; (teacher.schedule || []).forEach(s => {
            if (scheduleMap[s.day]) {
                scheduleMap[s.day][s.period] = s
            }
        })

    const regularCount = (teacher.schedule || []).filter(s => s.type === "regular").length
    const substituteCount = (teacher.schedule || []).filter(s => s.type === "substitute").length
    const loadPercent = Math.round((teacher.currentLoad / teacher.maxLoad) * 100)

    return (
        <div className="max-w-[1300px] mx-auto space-y-6">
            <PageBreadcrumb items={[
                { label: "Dashboard", href: "/school" },
                { label: "Teachers", href: "/school/teachers" },
                { label: teacher.name, href: `/school/teachers/${teacherId}` },
                { label: "Schedule" },
            ]} />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"><ArrowLeft size={18} /></button>
                    <div>
                        <h1 className="text-[22px] font-bold text-slate-800">{teacher.name} — Weekly Schedule</h1>
                        <p className="text-[13px] text-slate-500">{teacher.subjects.join(", ")}</p>
                    </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                    <Download size={15} /> Export Schedule
                </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { label: "Total Periods", value: teacher.schedule?.length || 0, color: "bg-blue-500" },
                    { label: "Regular", value: regularCount, color: "bg-emerald-500" },
                    { label: "Substitute", value: substituteCount, color: "bg-violet-500" },
                    { label: "Load", value: `${teacher.currentLoad}/${teacher.maxLoad}`, color: loadPercent > 90 ? "bg-red-500" : "bg-amber-500" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
                        <div className={`w-2 h-10 rounded-full ${stat.color}`} />
                        <div><p className="text-2xl font-bold text-slate-800">{stat.value}</p><p className="text-xs text-slate-500">{stat.label}</p></div>
                    </div>
                ))}
            </div>

            {/* Weekly Grid */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                        <thead>
                            <tr>
                                <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase border-b border-slate-100 bg-slate-50/50 w-[120px]">Time</th>
                                {DAYS_OF_WEEK.map(day => (
                                    <th key={day} className="px-3 py-3 text-center text-[11px] font-semibold text-slate-400 uppercase border-b border-slate-100 bg-slate-50/50">{day}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {PERIOD_TIMES.map((time, idx) => {
                                const periodNum = idx + 1
                                return (
                                    <tr key={periodNum} className="border-b border-slate-50">
                                        <td className="px-4 py-3 text-xs text-slate-500 border-r border-slate-50">
                                            <span className="font-semibold text-slate-400">P{periodNum}</span>
                                            <span className="ml-2 text-slate-400">{time}</span>
                                        </td>
                                        {DAYS_OF_WEEK.map(day => {
                                            const slot = scheduleMap[day]?.[periodNum]
                                            return (
                                                <td key={day} className="px-2 py-2 text-center border-r border-slate-50 last:border-r-0">
                                                    {slot ? (
                                                        <div className={cn(
                                                            "rounded-lg p-2 text-xs transition-all hover:shadow-sm",
                                                            slot.type === "substitute"
                                                                ? "bg-violet-50 border border-violet-200"
                                                                : "bg-blue-50 border border-blue-200"
                                                        )}>
                                                            <p className="font-semibold text-slate-700">{slot.class}</p>
                                                            <p className="text-[10px] text-slate-500 mt-0.5">{slot.subject}</p>
                                                            <p className="text-[10px] text-slate-400">{slot.room}</p>
                                                            {slot.type === "substitute" && (
                                                                <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-violet-100 text-violet-600">Covering</span>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="rounded-lg p-2 text-xs border border-dashed border-slate-100 text-slate-300">
                                                            <Clock size={12} className="mx-auto mb-0.5" />
                                                            Free
                                                        </div>
                                                    )}
                                                </td>
                                            )
                                        })}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 text-xs text-slate-500">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-blue-50 border border-blue-200" /> Regular Period</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-violet-50 border border-violet-200" /> Substitute (Covering)</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded border border-dashed border-slate-200" /> Free Period</div>
            </div>
        </div>
    )
}