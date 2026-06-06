"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, BookOpen, Users, Clock, Edit2, X } from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { KpiCard } from "@/components/shared/KpiCard"
import { EmptyState } from "@/components/shared/EmptyState"
import { SUBJECT_CATEGORY_COLORS } from "@/lib/constants"
import { MOCK_SUBJECTS } from "@/lib/mock-data"

export default function SubjectDetailPage() {
    const router = useRouter()
    const params = useParams()
    const subjectId = params.id

    const [loading, setLoading] = useState(true)
    const [subject, setSubject] = useState(null)
    const [notFound, setNotFound] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            const found = MOCK_SUBJECTS.find(s => s.id === subjectId)
            if (found) setSubject(found)
            else setNotFound(true)
            setLoading(false)
        }, 400)
    }, [subjectId])

    if (!loading && notFound) {
        return (
            <div className="max-w-[600px] mx-auto space-y-6">
                <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "Subjects", href: "/school/subjects" }, { label: "Not Found" }]} />
                <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
                    <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4"><X size={24} className="text-slate-400" /></div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">Subject not found</h3>
                    <p className="text-sm text-slate-500 mb-6">This subject may have been deleted.</p>
                    <button onClick={() => router.push("/school/subjects")} className="px-5 py-2.5 rounded-lg bg-violet-600 text-white text-sm font-semibold">Back to Subjects</button>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="max-w-[1300px] mx-auto space-y-6">
                <div className="h-5 w-48 bg-slate-200 rounded animate-pulse" />
                <div className="h-8 w-64 bg-slate-200 rounded animate-pulse" />
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-slate-100 rounded-xl animate-pulse" />)}
                </div>
                <div className="h-64 bg-slate-100 rounded-xl animate-pulse" />
            </div>
        )
    }

    const color = SUBJECT_CATEGORY_COLORS[subject.category] || SUBJECT_CATEGORY_COLORS.Core
    const totalClasses = subject.mappings?.length || 0
    const allTeachers = [...new Set((subject.mappings || []).flatMap(m => m.teachers))]
    const totalTeachers = allTeachers.length

    return (
        <div className="max-w-[1300px] mx-auto space-y-6">
            <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "Subjects", href: "/school/subjects" }, { label: subject.name }]} />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"><ArrowLeft size={18} /></button>
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl ${color.bg} flex items-center justify-center shrink-0`}><BookOpen size={22} className="text-white" /></div>
                        <div>
                            <h1 className="text-[22px] font-bold text-slate-800">{subject.name}</h1>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs font-mono text-slate-400">{subject.code}</span>
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${color.light} ${color.text}`}>{subject.category}</span>
                                <StatusBadge status={subject.status === "Active" ? "active" : "inactive"} size="sm" />
                            </div>
                        </div>
                    </div>
                </div>
                <button onClick={() => router.push(`/school/subjects/edit?id=${subject.id}`)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                    <Edit2 size={15} /> Edit Subject
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard title="Assigned Classes" value={totalClasses} icon={Users} iconColor="blue" />
                <KpiCard title="Total Teachers" value={totalTeachers} icon={BookOpen} iconColor="violet" />
                <KpiCard title="Periods / Week" value={subject.periodsPerWeek} icon={Clock} iconColor="amber" />
                <KpiCard title="Category" value={subject.category} icon={BookOpen} iconColor="emerald" />
            </div>

            {/* Two Column */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Left — Class Breakdown */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100">
                            <h2 className="font-semibold text-slate-800">Class-wise Assignment</h2>
                            <p className="text-xs text-slate-500 mt-0.5">{totalClasses} class{totalClasses !== 1 ? "es" : ""} teaching this subject</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-50 bg-slate-50/50">
                                        <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase">#</th>
                                        <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase">Class</th>
                                        <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase">Teachers</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(subject.mappings || []).length === 0 ? (
                                        <tr><td colSpan={3} className="px-4 py-16 text-center text-sm text-slate-400">No class assignments yet.</td></tr>
                                    ) : (
                                        (subject.mappings || []).map((m, i) => (
                                            <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50">
                                                <td className="px-4 py-3 text-xs text-slate-400">{i + 1}</td>
                                                <td className="px-4 py-3 font-medium text-slate-700">{m.grade}–{m.section}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-wrap gap-1">
                                                        {m.teachers.map((t, j) => (
                                                            <span key={j} className="px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600">{t}</span>
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right — Info */}
                <div className="space-y-6">
                    {/* Description */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                        <h3 className="font-semibold text-slate-800 mb-3">Description</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">{subject.description || "No description provided."}</p>
                    </div>

                    {/* All Teachers */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                        <h3 className="font-semibold text-slate-800 mb-3">All Teachers ({totalTeachers})</h3>
                        {allTeachers.length === 0 ? (
                            <p className="text-xs text-slate-400">No teachers assigned.</p>
                        ) : (
                            <div className="space-y-2">
                                {allTeachers.map((teacher, i) => (
                                    <div key={i} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                                        <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                            {teacher.split(" ").map(w => w[0]).join("").slice(0, 2)}
                                        </div>
                                        <span className="text-sm text-slate-700">{teacher}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                        <h3 className="font-semibold text-slate-800 mb-3">Class Distribution</h3>
                        <div className="space-y-2">
                            {(subject.mappings || []).map((m, i) => (
                                <div key={i} className="flex items-center justify-between text-xs">
                                    <span className="text-slate-600">{m.grade}–{m.section}</span>
                                    <span className="text-slate-400">{m.teachers.length} teacher{m.teachers.length !== 1 ? "s" : ""}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}