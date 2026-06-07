"use client"

import { useState, useMemo } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Search, Eye } from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { MOCK_SCHOOLS } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const MOCK_TEACHERS_LIST = [
    { id: "t1", name: "Mrs. Meena Pillai", subjects: ["Mathematics", "Physics"], classes: 3, status: "maternity", email: "meena.p@school.in", phone: "9876543210" },
    { id: "t2", name: "Mr. Suresh Kumar", subjects: ["Mathematics", "Science"], classes: 4, status: "active", email: "suresh.k@school.in", phone: "9876543211" },
    { id: "t3", name: "Ms. Priya Nair", subjects: ["Mathematics", "English"], classes: 3, status: "active", email: "priya.n@school.in", phone: "9876543212" },
    { id: "t4", name: "Dr. Amit Das", subjects: ["Physics", "Chemistry"], classes: 4, status: "active", email: "amit.d@school.in", phone: "9876543213" },
    { id: "t5", name: "Mrs. Sunita Das", subjects: ["Hindi", "English"], classes: 2, status: "medical", email: "sunita.d@school.in", phone: "9876543214" },
    { id: "t6", name: "Mr. Rajesh Nair", subjects: ["Computer Science"], classes: 3, status: "active", email: "rajesh.n@school.in", phone: "9876543215" },
    { id: "t7", name: "Mrs. Ananya Reddy", subjects: ["English", "History"], classes: 2, status: "active", email: "ananya.r@school.in", phone: "9876543216" },
    { id: "t8", name: "Mr. Vikram Mehta", subjects: ["History", "Geography"], classes: 3, status: "active", email: "vikram.m@school.in", phone: "9876543217" },
]

export default function SchoolTeachersPage() {
    const router = useRouter()
    const params = useParams()
    const schoolId = params.schoolId
    const [teachers] = useState(MOCK_TEACHERS_LIST)
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const perPage = 10

    const school = MOCK_SCHOOLS.find(s => s.id === schoolId)

    const filtered = useMemo(() => teachers.filter(t =>
        !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.subjects.some(s => s.toLowerCase().includes(search.toLowerCase()))
    ), [teachers, search])

    const totalPages = Math.ceil(filtered.length / perPage)
    const paginated = filtered.slice((page - 1) * perPage, page * perPage)

    return (
        <div className="max-w-[1300px] mx-auto space-y-6">
            <PageBreadcrumb items={[{ label: "Super Admin", href: "/superadmin" }, { label: "Schools", href: "/superadmin/schools" }, { label: school?.name || "School", href: `/superadmin/schools/${schoolId}` }, { label: "Teachers" }]} />

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"><ArrowLeft size={18} /></button>
                    <div><h1 className="text-[22px] font-bold text-slate-800">Teachers</h1><p className="text-[13px] text-slate-500">{school?.name} · {teachers.length} teachers</p></div>
                </div>
            </div>

            <div className="relative max-w-sm">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Search by name or subject..."
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-violet-500" />
            </div>

            <p className="text-sm text-slate-500">Showing <span className="font-semibold text-slate-700">{filtered.length}</span> teacher{filtered.length !== 1 ? "s" : ""}</p>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead><tr className="border-b border-slate-100 bg-slate-50/50">
                        {["Name", "Subjects", "Classes", "Email", "Status", ""].map(h => <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase">{h}</th>)}
                    </tr></thead>
                    <tbody>
                        {paginated.map(t => (
                            <tr key={t.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-xs">
                                            {t.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                                        </div>
                                        <span className="font-medium text-slate-700">{t.name}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex flex-wrap gap-1">
                                        {t.subjects.map(s => <span key={s} className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">{s}</span>)}
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-xs text-slate-500">{t.classes} classes</td>
                                <td className="px-4 py-3 text-xs text-slate-500">{t.email}</td>
                                <td className="px-4 py-3">
                                    <StatusBadge status={t.status === "active" ? "active" : t.status === "maternity" ? "pending" : "inactive"} size="sm" label={t.status} />
                                </td>
                                <td className="px-4 py-3">
                                    <button onClick={() => router.push(`/superadmin/schools/${schoolId}/teachers/${t.id}`)}
                                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-violet-600"><Eye size={14} /></button>
                                </td>
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