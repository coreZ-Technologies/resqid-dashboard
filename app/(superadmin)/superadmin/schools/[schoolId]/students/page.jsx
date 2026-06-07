"use client"

import { useState, useMemo } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Search, Eye } from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { MOCK_SCHOOLS } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const generateStudents = () => Array.from({ length: 50 }, (_, i) => ({
    id: `stu_${i + 1}`,
    name: ["Aarav Sharma", "Ananya Patel", "Arjun Nair", "Diya Reddy", "Ishaan Gupta", "Kavya Joshi", "Reyansh Kumar", "Shanaya Das"][i % 8],
    class: `${Math.floor(Math.random() * 12) + 1}-${["A", "B", "C", "D"][i % 4]}`,
    rollNo: i + 1,
    gender: i % 2 === 0 ? "Male" : "Female",
    status: i % 10 === 0 ? "Inactive" : "Active",
}))

const CLASSES = Array.from({ length: 12 }, (_, i) => `${i + 1}`)

export default function SchoolStudentsPage() {
    const router = useRouter()
    const params = useParams()
    const schoolId = params.schoolId
    const [students] = useState(generateStudents)
    const [search, setSearch] = useState("")
    const [classFilter, setClassFilter] = useState("")
    const [page, setPage] = useState(1)
    const perPage = 15

    const school = MOCK_SCHOOLS.find(s => s.id === schoolId)

    const filtered = useMemo(() => students.filter(s => {
        if (classFilter && !s.class.startsWith(classFilter)) return false
        if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false
        return true
    }), [students, search, classFilter])

    const totalPages = Math.ceil(filtered.length / perPage)
    const paginated = filtered.slice((page - 1) * perPage, page * perPage)

    return (
        <div className="max-w-[1300px] mx-auto space-y-6">
            <PageBreadcrumb items={[{ label: "Super Admin", href: "/superadmin" }, { label: "Schools", href: "/superadmin/schools" }, { label: school?.name || "School", href: `/superadmin/schools/${schoolId}` }, { label: "Students" }]} />

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"><ArrowLeft size={18} /></button>
                    <div><h1 className="text-[22px] font-bold text-slate-800">Students</h1><p className="text-[13px] text-slate-500">{school?.name} · {students.length} students</p></div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3 flex items-center gap-3">
                <div className="relative flex-1 min-w-[200px]">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Search by name..."
                        className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-violet-500 transition-all" />
                </div>
                <select value={classFilter} onChange={e => { setClassFilter(e.target.value); setPage(1) }}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500 bg-white">
                    <option value="">All Classes</option>
                    {CLASSES.map(c => <option key={c} value={c}>Class {c}</option>)}
                </select>
            </div>

            <p className="text-sm text-slate-500">Showing <span className="font-semibold text-slate-700">{filtered.length}</span> student{filtered.length !== 1 ? "s" : ""}</p>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead><tr className="border-b border-slate-100 bg-slate-50/50">
                        {["Name", "Class", "Roll No", "Gender", "Status", ""].map(h => <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase">{h}</th>)}
                    </tr></thead>
                    <tbody>
                        {paginated.map(s => (
                            <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                                <td className="px-4 py-3 font-medium text-slate-700">{s.name}</td>
                                <td className="px-4 py-3 text-xs text-slate-500">{s.class}</td>
                                <td className="px-4 py-3 text-xs text-slate-500">{s.rollNo}</td>
                                <td className="px-4 py-3 text-xs text-slate-500">{s.gender}</td>
                                <td className="px-4 py-3"><StatusBadge status={s.status === "Active" ? "active" : "inactive"} size="sm" label={s.status} /></td>
                                <td className="px-4 py-3">
                                    <button onClick={() => router.push(`/superadmin/schools/${schoolId}/students/${s.id}`)}
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
                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => page + i - 2).filter(p => p > 0 && p <= totalPages).map(p => (
                                <button key={p} onClick={() => setPage(p)} className={cn("w-8 h-8 rounded-lg text-xs font-medium", page === p ? "bg-violet-600 text-white" : "border border-slate-200 hover:bg-slate-50")}>{p}</button>
                            ))}
                            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs hover:bg-slate-50 disabled:opacity-50">Next</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}