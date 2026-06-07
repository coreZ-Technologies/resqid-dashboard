"use client"

import { useState, useMemo } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Search, BookOpen } from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { MOCK_SCHOOLS, MOCK_SUBJECTS } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export default function SchoolSubjectsPage() {
    const router = useRouter()
    const params = useParams()
    const schoolId = params.schoolId
    const [subjects] = useState(MOCK_SUBJECTS)
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const perPage = 10

    const school = MOCK_SCHOOLS.find(s => s.id === schoolId)

    const filtered = useMemo(() => subjects.filter(s =>
        !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.code.toLowerCase().includes(search.toLowerCase()) || s.category.toLowerCase().includes(search.toLowerCase())
    ), [subjects, search])

    const totalPages = Math.ceil(filtered.length / perPage)
    const paginated = filtered.slice((page - 1) * perPage, page * perPage)

    const totalClasses = subjects.reduce((sum, s) => sum + (s.mappings?.length || 0), 0)
    const totalTeachers = new Set(subjects.flatMap(s => (s.mappings || []).flatMap(m => m.teachers || []))).size

    return (
        <div className="max-w-[1300px] mx-auto space-y-6">
            <PageBreadcrumb items={[{ label: "Super Admin", href: "/superadmin" }, { label: "Schools", href: "/superadmin/schools" }, { label: school?.name || "School", href: `/superadmin/schools/${schoolId}` }, { label: "Subjects" }]} />

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"><ArrowLeft size={18} /></button>
                    <div><h1 className="text-[22px] font-bold text-slate-800">Subjects</h1><p className="text-[13px] text-slate-500">{school?.name} · {subjects.length} subjects · {totalClasses} assignments · {totalTeachers} teachers</p></div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Subjects", value: subjects.length, color: "bg-blue-500" },
                    { label: "Class Assignments", value: totalClasses, color: "bg-violet-500" },
                    { label: "Teachers Involved", value: totalTeachers, color: "bg-emerald-500" },
                    { label: "Categories", value: new Set(subjects.map(s => s.category)).size, color: "bg-amber-500" },
                ].map(s => (
                    <div key={s.label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center`}><BookOpen size={18} className="text-white" /></div>
                        <div><p className="text-xl font-bold text-slate-800">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div>
                    </div>
                ))}
            </div>

            <div className="relative max-w-sm">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Search by name, code, or category..."
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-violet-500" />
            </div>

            <p className="text-sm text-slate-500">Showing <span className="font-semibold text-slate-700">{filtered.length}</span> subject{filtered.length !== 1 ? "s" : ""}</p>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead><tr className="border-b border-slate-100 bg-slate-50/50">
                        {["Name", "Code", "Category", "Classes", "Teachers", "Periods/Week"].map(h => <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase">{h}</th>)}
                    </tr></thead>
                    <tbody>
                        {paginated.map(s => {
                            const classCount = s.mappings?.length || 0
                            const teacherSet = new Set((s.mappings || []).flatMap(m => m.teachers || []))
                            return (
                                <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                                    <td className="px-4 py-3 font-medium text-slate-700">{s.name}</td>
                                    <td className="px-4 py-3 text-xs font-mono text-slate-500">{s.code}</td>
                                    <td className="px-4 py-3">
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600">{s.category}</span>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-slate-600">{classCount} class{classCount !== 1 ? "es" : ""}</td>
                                    <td className="px-4 py-3 text-xs text-slate-600">{teacherSet.size}</td>
                                    <td className="px-4 py-3 text-xs text-slate-600">{s.periodsPerWeek || 0}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                {totalPages > 1 && (
                    <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
                        <p className="text-xs text-slate-400">Page {page} of {totalPages}</p>
                        <div className="flex gap-1">
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs hover:bg-slate-50 disabled:opacity-50">Prev</button>
                            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs hover:bg-slate-50 disabled:opacity-50">Next</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}