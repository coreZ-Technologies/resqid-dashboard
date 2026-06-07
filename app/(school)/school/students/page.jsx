"use client"

import { useState, useEffect, useMemo } from "react"
import { Plus, Upload, Eye, Edit2, Trash2, Mail, Phone, Search, ArrowUp } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import PageHeader from "@/components/shared/PageHeader"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import { EmptyState } from "@/components/shared/EmptyState"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { useConfirmDialog } from "@/components/shared/ConfirmDialog"
import ToolbarActions from "@/components/shared/ToolbarActions"
import BulkImportButton from "@/components/shared/BulkImportButton"
import { cn } from "@/lib/utils"

const CLASSES = ['Nursery', 'LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
const SECTIONS = ['A', 'B', 'C', 'D']

const generateMockStudents = () => {
    const names = ['Aarav Sharma', 'Vihaan Gupta', 'Ananya Singh', 'Diya Reddy', 'Advik Patel', 'Kabir Mehta', 'Aadhya Nair', 'Sai Verma', 'Ishita Malhotra', 'Reyansh Joshi', 'Anaya Khanna', 'Myra Kapoor', 'Dhruv Sinha', 'Kiara Dutta', 'Arjun Thakur', 'Sara Khan', 'Rudra Rajput', 'Jiya Bhatia', 'Shaurya Saxena', 'Vivaan Kumar']
    const students = []
    for (let i = 1; i <= 250; i++) {
        students.push({
            id: `STU${String(i).padStart(5, '0')}`,
            name: names[Math.floor(Math.random() * names.length)],
            rollNumber: `${Math.floor(Math.random() * 50) + 1}`,
            class: CLASSES[Math.floor(Math.random() * CLASSES.length)],
            section: SECTIONS[Math.floor(Math.random() * SECTIONS.length)],
            parentName: `Parent of Student ${i}`,
            parentPhone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
            email: `student${i}@school.com`,
            status: Math.random() > 0.05 ? 'Active' : 'Inactive',
            gender: ['Male', 'Female'][Math.floor(Math.random() * 2)],
        })
    }
    return students
}

export default function StudentsPage() {
    const router = useRouter()
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [selectedClass, setSelectedClass] = useState("")
    const [selectedSection, setSelectedSection] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 15
    const { confirmDialog, confirm } = useConfirmDialog()

    useEffect(() => {
        setTimeout(() => {
            setStudents(generateMockStudents())
            setLoading(false)
        }, 600)
    }, [])

    const filtered = useMemo(() => {
        let result = [...students]
        if (search) {
            const q = search.toLowerCase()
            result = result.filter(s => s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || s.parentName.toLowerCase().includes(q) || s.rollNumber.includes(q))
        }
        if (selectedClass) result = result.filter(s => s.class === selectedClass)
        if (selectedSection) result = result.filter(s => s.section === selectedSection)
        return result
    }, [students, search, selectedClass, selectedSection])

    const totalPages = Math.ceil(filtered.length / itemsPerPage)
    const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    useEffect(() => { setCurrentPage(1) }, [search, selectedClass, selectedSection])

    const handleDelete = async (student) => {
        const ok = await confirm({ variant: "delete", title: "Delete student?", description: `This will permanently remove ${student.name} and all associated records.`, confirmLabel: "Delete" })
        if (ok) setStudents(prev => prev.filter(s => s.id !== student.id))
    }

    const uniqueClasses = [...new Set(students.map(s => s.class))].sort((a, b) => CLASSES.indexOf(a) - CLASSES.indexOf(b))

    return (
        <div className="max-w-[1300px] space-y-6">
            {confirmDialog}

            <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "Students" }]} />

            <PageHeader title="Students" description="Manage student profiles, emergency info, and ID cards">
                <div className="flex items-center gap-2">
                    <ToolbarActions onRefresh={() => setStudents(generateMockStudents())} onExport={() => console.log("Exporting...")} />
                    <BulkImportButton href="/school/students/add?mode=bulk" label="Bulk Import" />
                    <button onClick={() => router.push("/school/students/add")}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-violet-700 text-white text-sm font-semibold shadow-sm shadow-violet-200 hover:from-violet-600 hover:to-violet-800 transition-all">
                        <Plus size={16} /> Add Student
                    </button>

                    <button onClick={() => router.push("/school/students/promote")}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 text-sm font-medium hover:bg-amber-100 transition-colors shadow-sm">
                        <ArrowUp size={15} /> Promote Students
                    </button>
                </div>
            </PageHeader>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3 flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px]">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, ID, or parent..."
                        className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all" />
                </div>
                <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500 bg-white">
                    <option value="">All Classes</option>
                    {uniqueClasses.map(c => <option key={c} value={c}>Class {c}</option>)}
                </select>
                <select value={selectedSection} onChange={e => setSelectedSection(e.target.value)}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500 bg-white">
                    <option value="">All Sections</option>
                    {SECTIONS.map(s => <option key={s} value={s}>Section {s}</option>)}
                </select>
                {(search || selectedClass || selectedSection) && (
                    <button onClick={() => { setSearch(""); setSelectedClass(""); setSelectedSection("") }}
                        className="text-xs text-slate-400 hover:text-slate-600">Clear filters</button>
                )}
            </div>

            <p className="text-sm text-slate-500">Showing <span className="font-semibold text-slate-700">{filtered.length}</span> student{filtered.length !== 1 ? "s" : ""}</p>

            {/* Table */}
            {loading ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
                    <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />
                </div>
            ) : filtered.length === 0 ? (
                <EmptyState preset="search" title="No students found" description="Try adjusting your filters or add a new student"
                    action={{ label: "Add Student", onClick: () => router.push("/school/students/add") }} />
            ) : (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50">
                                    {["Student", "Class", "Roll No", "Parent", "Contact", "Status", ""].map(h => (
                                        <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {paginated.map(student => (
                                    <tr key={student.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-100 to-violet-200 flex items-center justify-center text-violet-700 font-semibold text-xs">
                                                    {student.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-700">{student.name}</p>
                                                    <p className="text-xs text-slate-400">{student.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="px-2 py-1 rounded-md bg-violet-50 text-violet-700 text-xs font-medium">{student.class}-{student.section}</span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-600">{student.rollNumber}</td>
                                        <td className="px-4 py-3 text-sm text-slate-700">{student.parentName}</td>
                                        <td className="px-4 py-3">
                                            <p className="text-xs text-slate-600">{student.parentPhone}</p>
                                            <p className="text-xs text-slate-400">{student.email}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <StatusBadge status={student.status === "Active" ? "active" : "inactive"} size="sm" />
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link href={`/school/students/${student.id}`} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-violet-600 transition-colors"><Eye size={14} /></Link>
                                                <Link href={`/school/students/${student.id}/edit`} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-emerald-600 transition-colors"><Edit2 size={14} /></Link>
                                                <button onClick={() => handleDelete(student)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
                            <p className="text-xs text-slate-400">Page {currentPage} of {totalPages}</p>
                            <div className="flex gap-1">
                                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs hover:bg-slate-50 disabled:opacity-50">Prev</button>
                                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                    const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4))
                                    const page = start + i
                                    if (page > totalPages) return null
                                    return (
                                        <button key={page} onClick={() => setCurrentPage(page)}
                                            className={cn("w-8 h-8 rounded-lg text-xs font-medium", currentPage === page ? "bg-violet-600 text-white" : "border border-slate-200 hover:bg-slate-50")}>{page}</button>
                                    )
                                })}
                                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs hover:bg-slate-50 disabled:opacity-50">Next</button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}