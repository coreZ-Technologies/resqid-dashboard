"use client"

import { useState, useMemo } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Search } from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { MOCK_SCHOOLS, MOCK_CLASSES } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export default function SchoolClassesPage() {
    const router = useRouter()
    const params = useParams()
    const schoolId = params.schoolId
    const [classes] = useState(MOCK_CLASSES)
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const perPage = 10

    const school = MOCK_SCHOOLS.find(s => s.id === schoolId)

    const filtered = useMemo(() => classes.filter(c =>
        !search || c.grade.toLowerCase().includes(search.toLowerCase()) || c.section.toLowerCase().includes(search.toLowerCase()) || (c.classTeacher || "").toLowerCase().includes(search.toLowerCase())
    ), [classes, search])

    const totalPages = Math.ceil(filtered.length / perPage)
    const paginated = filtered.slice((page - 1) * perPage, page * perPage)

    return (
        <div className="max-w-[1300px] mx-auto space-y-6">
            <PageBreadcrumb items={[{ label: "Super Admin", href: "/superadmin" }, { label: "Schools", href: "/superadmin/schools" }, { label: school?.name || "School", href: `/superadmin/schools/${schoolId}` }, { label: "Classes" }]} />

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"><ArrowLeft size={18} /></button>
                    <div><h1 className="text-[22px] font-bold text-slate-800">Classes</h1><p className="text-[13px] text-slate-500">{school?.name} · {classes.length} classes</p></div>
                </div>
            </div>

            <div className="relative max-w-sm">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Search by grade, section, or teacher..."
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-violet-500" />
            </div>

            <p className="text-sm text-slate-500">Showing <span className="font-semibold text-slate-700">{filtered.length}</span> class{filtered.length !== 1 ? "es" : ""}</p>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead><tr className="border-b border-slate-100 bg-slate-50/50">
                        {["Class", "Class Teacher", "Students", "Subjects", "Room", "Status"].map(h => <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase">{h}</th>)}
                    </tr></thead>
                    <tbody>
                        {paginated.map(c => (
                            <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                                <td className="px-4 py-3 font-medium text-slate-700">{c.grade}-{c.section}</td>
                                <td className="px-4 py-3 text-xs text-slate-500">{c.classTeacher}</td>
                                <td className="px-4 py-3 text-xs text-slate-600">{c.students}</td>
                                <td className="px-4 py-3 text-xs text-slate-500">{c.subjects?.length || 0}</td>
                                <td className="px-4 py-3 text-xs text-slate-500">{c.room || "—"}</td>
                                <td className="px-4 py-3"><StatusBadge status={c.status === "Active" ? "active" : "inactive"} size="sm" label={c.status} /></td>
                            </tr>
                        ))}
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