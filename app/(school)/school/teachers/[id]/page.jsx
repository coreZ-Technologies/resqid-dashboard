"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import {
    ArrowLeft, BookOpen, Clock, Users, Edit2, Phone, Mail, Calendar,
    AlertCircle, UserCheck, GraduationCap, Briefcase, X
} from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { KpiCard } from "@/components/shared/KpiCard"
import { MOCK_TEACHERS } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const wellnessConfig = {
    maternity: { label: "Maternity Leave", color: "bg-pink-50 border-pink-200 text-pink-700", icon: "🤰" },
    medical: { label: "Medical Leave", color: "bg-red-50 border-red-200 text-red-700", icon: "🏥" },
    sabbatical: { label: "Sabbatical", color: "bg-purple-50 border-purple-200 text-purple-700", icon: "🌴" },
    personal: { label: "Personal Leave", color: "bg-amber-50 border-amber-200 text-amber-700", icon: "🏠" },
}

export default function TeacherDetailPage() {
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
                <div className="h-8 w-64 bg-slate-200 rounded animate-pulse" />
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-slate-100 rounded-xl animate-pulse" />)}</div>
            </div>
        )
    }

    const hasWellness = !!teacher.wellness
    const wellness = hasWellness ? wellnessConfig[teacher.wellness.type] : null
    const needsReplacement = hasWellness && teacher.wellness.requiresReplacement && !teacher.replacement
    const replacementTeacher = teacher.replacement ? MOCK_TEACHERS.find(t => t.id === teacher.replacement) : null
    const loadPercent = Math.round((teacher.currentLoad / teacher.maxLoad) * 100)
    const totalClasses = [...new Set((teacher.schedule || []).map(s => s.class))].length

    return (
        <div className="max-w-[1300px] mx-auto space-y-6">
            <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "Teachers", href: "/school/teachers" }, { label: teacher.name }]} />

            {/* Wellness Alert Banner */}
            {hasWellness && (
                <div className={cn("rounded-xl border p-4 flex items-start gap-3", wellness.color)}>
                    <span className="text-xl">{wellness.icon}</span>
                    <div className="flex-1">
                        <p className="font-semibold text-sm">{wellness.label}</p>
                        <p className="text-xs mt-0.5">
                            {teacher.wellness.startDate} – {teacher.wellness.expectedEndDate}
                            {teacher.wellness.notes && <span className="ml-2 opacity-70">— {teacher.wellness.notes}</span>}
                        </p>
                        {needsReplacement && (
                            <p className="text-xs font-semibold mt-1 flex items-center gap-1"><AlertCircle size={12} /> No replacement assigned yet</p>
                        )}
                    </div>
                    <button onClick={() => router.push(`/school/teachers/${teacher.id}/wellness`)} className="text-xs font-semibold underline shrink-0">Manage</button>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"><ArrowLeft size={18} /></button>
                    <div className="flex items-center gap-3">
                        <div className={`w-14 h-14 rounded-xl ${teacher.avatarColor || "bg-blue-500"} flex items-center justify-center shrink-0`}>
                            <span className="text-white font-bold text-xl">{teacher.avatar}</span>
                        </div>
                        <div>
                            <h1 className="text-[22px] font-bold text-slate-800">{teacher.name}</h1>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs font-mono text-slate-400">{teacher.employeeId}</span>
                                <StatusBadge status={teacher.status === "active" ? "active" : teacher.status === "maternity" ? "pending" : teacher.status === "medical" ? "absent" : "inactive"} size="sm" label={teacher.status.replace("_", " ")} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => router.push(`/school/teachers/edit?id=${teacher.id}`)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm"><Edit2 size={15} /> Edit</button>
                    <button onClick={() => router.push(`/school/teachers/${teacher.id}/wellness`)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors shadow-sm"><Briefcase size={15} /> Wellness</button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard title="Subjects" value={teacher.subjects.length} icon={BookOpen} iconColor="blue" />
                <KpiCard title="Classes" value={totalClasses} icon={Users} iconColor="violet" />
                <KpiCard title="Workload" value={`${teacher.currentLoad}/${teacher.maxLoad}`} icon={Clock} iconColor={loadPercent > 90 ? "red" : "amber"} />
                <KpiCard title="Experience" value={teacher.experience} icon={GraduationCap} iconColor="emerald" />
            </div>

            {/* Two Column */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Left — Info + Schedule */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Personal Info */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                        <h2 className="font-semibold text-slate-800 mb-4">Personal Information</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[{ icon: Mail, label: "Email", value: teacher.email },
                            { icon: Phone, label: "Phone", value: teacher.phone || "—" },
                            { icon: GraduationCap, label: "Qualification", value: teacher.qualification || "—" },
                            { icon: Calendar, label: "Joined", value: teacher.joiningDate || "—" }].map((item, i) => (
                                <div key={i} className="flex items-center gap-2.5">
                                    <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center"><item.icon size={16} className="text-slate-500" /></div>
                                    <div><p className="text-[10px] text-slate-400 uppercase font-semibold">{item.label}</p><p className="text-sm font-medium text-slate-700">{item.value}</p></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Subjects + Substitution */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                        <h2 className="font-semibold text-slate-800 mb-3">Subjects</h2>
                        <div className="flex flex-wrap gap-1.5 mb-4">
                            {teacher.subjects.map(s => <span key={s} className="px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">{s}</span>)}
                        </div>

                        {teacher.substituteFor?.length > 0 && (
                            <div className="pt-4 border-t border-slate-100">
                                <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Currently Covering For</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {teacher.substituteFor.map(id => {
                                        const t = MOCK_TEACHERS.find(tt => tt.id === id)
                                        return t ? <span key={id} className="px-2.5 py-1 rounded-md text-xs font-medium bg-violet-50 text-violet-700 border border-violet-200">{t.name}</span> : null
                                    })}
                                </div>
                            </div>
                        )}

                        {replacementTeacher && (
                            <div className="pt-4 border-t border-slate-100 mt-4">
                                <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Replaced By</p>
                                <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">{replacementTeacher.name}</span>
                            </div>
                        )}
                    </div>

                    {/* Weekly Schedule Summary */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                            <div><h2 className="font-semibold text-slate-800">Weekly Schedule</h2><p className="text-xs text-slate-500 mt-0.5">{teacher.schedule?.length || 0} periods this week</p></div>
                            <button onClick={() => router.push(`/school/teachers/${teacher.id}/schedule`)} className="text-xs text-violet-500 hover:text-violet-700 font-medium">Full Schedule →</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead><tr className="border-b border-slate-50 bg-slate-50/50">
                                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase">Day</th>
                                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase">Period</th>
                                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase">Class</th>
                                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase">Subject</th>
                                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase">Type</th>
                                </tr></thead>
                                <tbody>
                                    {(teacher.schedule || []).slice(0, 6).map((s, i) => (
                                        <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50">
                                            <td className="px-4 py-3 text-xs font-medium text-slate-700">{s.day}</td>
                                            <td className="px-4 py-3 text-xs text-slate-500">P{s.period}</td>
                                            <td className="px-4 py-3 text-xs text-slate-700">{s.class}</td>
                                            <td className="px-4 py-3 text-xs text-slate-600">{s.subject}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${s.type === "substitute" ? "bg-violet-100 text-violet-700" : "bg-emerald-100 text-emerald-700"}`}>
                                                    {s.type === "substitute" ? "Covering" : "Regular"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right — Quick Stats */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                        <h3 className="font-semibold text-slate-800 mb-4">Workload Breakdown</h3>
                        <div className="space-y-3">
                            <div><div className="flex items-center justify-between text-xs mb-1"><span className="text-slate-600">Current Load</span><span className="font-semibold">{teacher.currentLoad}/{teacher.maxLoad}</span></div>
                                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden"><div className={cn("h-full rounded-full", loadPercent > 90 ? "bg-red-500" : loadPercent > 70 ? "bg-amber-500" : "bg-emerald-500")} style={{ width: `${Math.min(loadPercent, 100)}%` }} /></div></div>
                            <div className="h-px bg-slate-100" />
                            <div className="flex items-center justify-between text-xs"><span className="text-slate-600">Max Periods/Day</span><span className="font-semibold">{teacher.maxPeriodsPerDay}</span></div>
                            <div className="flex items-center justify-between text-xs"><span className="text-slate-600">Regular Periods</span><span className="font-semibold">{(teacher.schedule || []).filter(s => s.type === "regular").length}</span></div>
                            <div className="flex items-center justify-between text-xs"><span className="text-slate-600">Substitute Periods</span><span className="font-semibold text-violet-600">{(teacher.schedule || []).filter(s => s.type === "substitute").length}</span></div>
                        </div>
                    </div>

                    {teacher.substituteFor?.length > 0 && (
                        <div className="bg-violet-50 rounded-2xl border border-violet-200 p-5">
                            <h3 className="font-semibold text-violet-800 mb-2 flex items-center gap-2"><UserCheck size={16} /> Substitution Duties</h3>
                            <p className="text-xs text-violet-600">This teacher is covering {teacher.substituteFor.length} absent teacher{teacher.substituteFor.length !== 1 ? "s" : ""}.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}