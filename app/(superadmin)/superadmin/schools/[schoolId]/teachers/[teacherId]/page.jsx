"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, User, Mail, Phone, BookOpen, GraduationCap, Calendar, Clock } from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import { StatusBadge } from "@/components/shared/StatusBadge"

const getTeacher = (id) => ({
    id, name: "Mrs. Meena Pillai", email: "meena.p@school.in", phone: "9876543210",
    subjects: ["Mathematics", "Physics"], qualification: "M.Sc, B.Ed", experience: "8 years",
    joiningDate: "2016-06-15", employeeId: "EMP-2016-042",
    status: "maternity", currentLoad: 24, maxLoad: 30,
    classes: ["Cls 6-A", "Cls 7-A", "Cls 9-A", "Cls 10-A"],
    wellness: { type: "maternity", startDate: "2026-01-15", expectedEndDate: "2026-07-15" },
})

export default function TeacherDetailPage() {
    const router = useRouter()
    const params = useParams()
    const schoolId = params.schoolId
    const teacherId = params.teacherId

    const [teacher, setTeacher] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setTimeout(() => { setTeacher(getTeacher(teacherId)); setLoading(false) }, 400)
    }, [teacherId])

    if (loading) return <div className="max-w-[900px] mx-auto space-y-6"><div className="h-64 bg-slate-100 rounded-xl animate-pulse" /></div>
    if (!teacher) return <div className="text-center py-16 text-slate-500">Teacher not found</div>

    const loadPercent = Math.round((teacher.currentLoad / teacher.maxLoad) * 100)

    return (
        <div className="max-w-[900px] mx-auto space-y-6">
            <PageBreadcrumb items={[
                { label: "Super Admin", href: "/superadmin" }, { label: "Schools", href: "/superadmin/schools" },
                { label: "School", href: `/superadmin/schools/${schoolId}` }, { label: "Teachers", href: `/superadmin/schools/${schoolId}/teachers` }, { label: teacher.name }
            ]} />

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"><ArrowLeft size={18} /></button>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-violet-500 flex items-center justify-center text-white font-bold text-lg">
                            {teacher.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                            <h1 className="text-[22px] font-bold text-slate-800">{teacher.name}</h1>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs text-slate-500">{teacher.employeeId}</span>
                                <StatusBadge status={teacher.status === "active" ? "active" : "pending"} size="sm" label={teacher.status} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Subjects", value: teacher.subjects.length, icon: BookOpen, color: "bg-blue-500" },
                    { label: "Classes", value: teacher.classes.length, icon: GraduationCap, color: "bg-violet-500" },
                    { label: "Workload", value: `${teacher.currentLoad}/${teacher.maxLoad}`, icon: Clock, color: loadPercent > 90 ? "bg-red-500" : "bg-emerald-500" },
                    { label: "Experience", value: teacher.experience, icon: Calendar, color: "bg-amber-500" },
                ].map(s => (
                    <div key={s.label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center`}><s.icon size={18} className="text-white" /></div>
                        <div><p className="text-xl font-bold text-slate-800">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <h2 className="font-semibold text-slate-800 mb-4">Personal Information</h2>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        {[
                            { icon: User, label: "Name", value: teacher.name },
                            { icon: Mail, label: "Email", value: teacher.email },
                            { icon: Phone, label: "Phone", value: teacher.phone },
                            { icon: BookOpen, label: "Qualification", value: teacher.qualification },
                            { icon: Calendar, label: "Joined", value: teacher.joiningDate },
                            { icon: Clock, label: "Experience", value: teacher.experience },
                        ].map(r => (
                            <div key={r.label} className="flex items-center gap-2"><r.icon size={14} className="text-slate-400" /><div><p className="text-xs text-slate-400">{r.label}</p><p className="font-medium text-slate-700">{r.value}</p></div></div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                        <h2 className="font-semibold text-slate-800 mb-3">Subjects & Classes</h2>
                        <div className="flex flex-wrap gap-1.5 mb-3">
                            {teacher.subjects.map(s => <span key={s} className="px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs font-medium">{s}</span>)}
                        </div>
                        <p className="text-xs text-slate-400 mb-2">Assigned Classes:</p>
                        <div className="flex flex-wrap gap-1.5">
                            {teacher.classes.map(c => <span key={c} className="px-2 py-1 rounded bg-slate-100 text-slate-600 text-xs">{c}</span>)}
                        </div>
                    </div>

                    {teacher.wellness && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                            <p className="text-sm font-semibold text-amber-800 capitalize">{teacher.wellness.type} Leave</p>
                            <p className="text-xs text-amber-700 mt-1">{teacher.wellness.startDate} – {teacher.wellness.expectedEndDate}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}