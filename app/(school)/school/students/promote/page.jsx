"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
    ArrowLeft, ArrowUp, GraduationCap, Users, Check, Loader2,
    AlertTriangle, Search, RotateCcw, Download
} from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { useConfirmDialog } from "@/components/shared/ConfirmDialog"
import { cn } from "@/lib/utils"

const CLASSES = ["Nursery", "LKG", "UKG", "Cls 1", "Cls 2", "Cls 3", "Cls 4", "Cls 5", "Cls 6", "Cls 7", "Cls 8", "Cls 9", "Cls 10", "Cls 11", "Cls 12"]
const SECTIONS = ["A", "B", "C", "D"]

// Generate mock students per class
const generateStudents = (cls, section, count, startRoll) => {
    const names = ["Aarav Sharma", "Ananya Patel", "Arjun Nair", "Diya Reddy", "Ishaan Gupta", "Kavya Joshi", "Reyansh Kumar", "Shanaya Das", "Vihaan Mehta", "Zara Khan"]
    return Array.from({ length: count }, (_, i) => ({
        id: `stu_${cls.replace(" ", "")}_${section}_${i + 1}`,
        name: names[i % names.length],
        currentClass: cls,
        currentSection: section,
        currentRoll: startRoll + i,
        promoteTo: cls === "Cls 12" ? "Graduated" : CLASSES[CLASSES.indexOf(cls) + 1] || cls,
        newSection: section,
        newRoll: startRoll + i,
        detain: false,
        status: "promote", // promote | detain | graduate
    }))
}

const MOCK_STUDENTS = [
    ...generateStudents("Cls 5", "A", 10, 1),
    ...generateStudents("Cls 5", "B", 8, 11),
    ...generateStudents("Cls 8", "A", 12, 1),
    ...generateStudents("Cls 8", "B", 10, 13),
    ...generateStudents("Cls 10", "A", 8, 1),
    ...generateStudents("Cls 12", "A", 6, 1),
]

export default function PromoteStudentsPage() {
    const router = useRouter()
    const { confirmDialog, confirm } = useConfirmDialog()
    const [students, setStudents] = useState(MOCK_STUDENTS)
    const [search, setSearch] = useState("")
    const [selectedClass, setSelectedClass] = useState("")
    const [selectedSection, setSelectedSection] = useState("")
    const [step, setStep] = useState(1)
    const [processing, setProcessing] = useState(false)
    const [progress, setProgress] = useState(0)

    const classOptions = [...new Set(students.map(s => s.currentClass))].sort((a, b) => CLASSES.indexOf(a) - CLASSES.indexOf(b))

    const filtered = useMemo(() => students.filter(s => {
        if (selectedClass && s.currentClass !== selectedClass) return false
        if (selectedSection && s.currentSection !== selectedSection) return false
        if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false
        return true
    }), [students, selectedClass, selectedSection, search])

    const stats = {
        total: students.length,
        promoting: students.filter(s => s.status === "promote").length,
        detained: students.filter(s => s.status === "detain").length,
        graduating: students.filter(s => s.status === "graduate").length,
    }

    // Update individual student
    const updateStudent = (id, field, value) => {
        setStudents(prev => prev.map(s => {
            if (s.id !== id) return s
            const updated = { ...s, [field]: value }
            // Auto-set status
            if (field === "detain" && value) updated.status = "detain"
            if (field === "detain" && !value) updated.status = s.currentClass === "Cls 12" ? "graduate" : "promote"
            if (field === "promoteTo" && value === "Graduated") updated.status = "graduate"
            return updated
        }))
    }

    // Mass actions for filtered students
    const promoteAllFiltered = () => {
        setStudents(prev => prev.map(s => {
            if (filtered.find(f => f.id === s.id) && s.status !== "graduate") {
                return { ...s, detain: false, status: "promote" }
            }
            return s
        }))
    }

    const autoRollNumbers = () => {
        setStudents(prev => {
            // Group by promoteTo + newSection
            const groups = {}
            prev.forEach(s => {
                if (s.status === "detain") return
                const key = s.status === "graduate" ? "graduated" : `${s.promoteTo}-${s.newSection}`
                if (!groups[key]) groups[key] = []
                groups[key].push(s)
            })
            // Assign sequential roll numbers
            const updated = [...prev]
            Object.values(groups).forEach(group => {
                group.sort((a, b) => a.name.localeCompare(b.name))
                group.forEach((s, i) => {
                    const idx = updated.findIndex(u => u.id === s.id)
                    if (idx !== -1) updated[idx].newRoll = i + 1
                })
            })
            return updated
        })
    }

    const handlePromote = async () => {
        const ok = await confirm({
            variant: "warning",
            title: "Promote all students?",
            description: `This will promote ${stats.promoting} students and graduate ${stats.graduating}. ${stats.detained} student(s) will be detained. This action cannot be easily undone.`,
            confirmLabel: "Yes, Promote All",
        })
        if (!ok) return

        setProcessing(true)
        setStep(2)
        await new Promise(r => setTimeout(r, 2000))
        setProcessing(false)
        setStep(3)
    }

    return (
        <div className="max-w-[1300px] mx-auto space-y-6">
            {confirmDialog}
            <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "Students", href: "/school/students" }, { label: "Promote Students" }]} />

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"><ArrowLeft size={18} /></button>
                    <div>
                        <h1 className="text-[22px] font-bold text-slate-800">Promote Students</h1>
                        <p className="text-[13px] text-slate-500">End-of-year promotion with individual roll numbers & sections</p>
                    </div>
                </div>
                {step === 1 && (
                    <div className="flex gap-2">
                        <button onClick={autoRollNumbers}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                            <RotateCcw size={15} /> Auto Roll Numbers
                        </button>
                        <button onClick={handlePromote}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-violet-700 text-white text-sm font-semibold shadow-sm shadow-violet-200 hover:from-violet-600 hover:to-violet-800 transition-all">
                            <ArrowUp size={16} /> Promote All
                        </button>
                    </div>
                )}
            </div>

            {/* Step 1: Review & Edit */}
            {step === 1 && (
                <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: "Total Students", value: stats.total, icon: Users, color: "bg-blue-500" },
                            { label: "Promoting", value: stats.promoting, icon: ArrowUp, color: "bg-emerald-500" },
                            { label: "Graduating", value: stats.graduating, icon: GraduationCap, color: "bg-violet-500" },
                            { label: "Detained", value: stats.detained, icon: AlertTriangle, color: stats.detained > 0 ? "bg-red-500" : "bg-slate-400" },
                        ].map(s => (
                            <div key={s.label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center`}><s.icon size={18} className="text-white" /></div>
                                <div><p className="text-xl font-bold text-slate-800">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div>
                            </div>
                        ))}
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3 flex flex-wrap items-center gap-3">
                        <div className="relative flex-1 min-w-[200px]">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search student name..."
                                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-violet-500 transition-all" />
                        </div>
                        <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)}
                            className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500 bg-white">
                            <option value="">All Classes</option>
                            {classOptions.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <select value={selectedSection} onChange={e => setSelectedSection(e.target.value)}
                            className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500 bg-white">
                            <option value="">All Sections</option>
                            {SECTIONS.map(s => <option key={s} value={s}>Section {s}</option>)}
                        </select>
                        <button onClick={promoteAllFiltered} className="text-xs text-violet-500 hover:text-violet-700 font-medium">Promote All Filtered</button>
                    </div>

                    <p className="text-sm text-slate-500">Showing <span className="font-semibold text-slate-700">{filtered.length}</span> student{filtered.length !== 1 ? "s" : ""}</p>

                    {/* Per-Student Table */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50/50">
                                        {["Student", "Current", "Roll", "Promote To", "Section", "New Roll", "Detain?", "Status"].map(h => (
                                            <th key={h} className="px-3 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map(s => (
                                        <tr key={s.id} className={cn("border-b border-slate-50 hover:bg-slate-50/50",
                                            s.status === "detain" && "bg-red-50/30",
                                            s.status === "graduate" && "bg-violet-50/30")}>
                                            <td className="px-3 py-3 text-sm font-medium text-slate-700">{s.name}</td>
                                            <td className="px-3 py-3 text-xs text-slate-500">{s.currentClass}-{s.currentSection}</td>
                                            <td className="px-3 py-3 text-xs text-slate-500">{s.currentRoll}</td>
                                            <td className="px-3 py-3">
                                                {s.currentClass === "Cls 12" ? (
                                                    <span className="text-violet-600 font-medium text-xs">Graduated 🎓</span>
                                                ) : (
                                                    <span className="text-xs font-medium text-slate-700">{s.promoteTo}</span>
                                                )}
                                            </td>
                                            <td className="px-3 py-3">
                                                {s.status !== "graduate" && s.status !== "detain" ? (
                                                    <select value={s.newSection} onChange={e => updateStudent(s.id, "newSection", e.target.value)}
                                                        className="border border-slate-200 rounded px-1.5 py-1 text-xs outline-none focus:border-violet-500 bg-white">
                                                        {SECTIONS.map(sec => <option key={sec} value={sec}>{sec}</option>)}
                                                    </select>
                                                ) : <span className="text-slate-400 text-xs">—</span>}
                                            </td>
                                            <td className="px-3 py-3">
                                                {s.status !== "graduate" && s.status !== "detain" ? (
                                                    <input type="number" value={s.newRoll}
                                                        onChange={e => updateStudent(s.id, "newRoll", parseInt(e.target.value) || 0)}
                                                        className="w-14 border border-slate-200 rounded px-1.5 py-1 text-xs outline-none focus:border-violet-500 text-center" />
                                                ) : <span className="text-slate-400 text-xs">—</span>}
                                            </td>
                                            <td className="px-3 py-3">
                                                {s.currentClass !== "Cls 12" && (
                                                    <input type="checkbox" checked={s.detain}
                                                        onChange={e => updateStudent(s.id, "detain", e.target.checked)}
                                                        className="w-4 h-4 rounded accent-red-500" />
                                                )}
                                            </td>
                                            <td className="px-3 py-3">
                                                <StatusBadge status={s.status === "promote" ? "present" : s.status === "detain" ? "absent" : "pending"} size="sm"
                                                    label={s.status === "promote" ? "Promoting" : s.status === "detain" ? "Detained" : "Graduating"} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* Step 2: Processing */}
            {step === 2 && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-16 text-center space-y-4">
                    <Loader2 size={40} className="text-violet-600 animate-spin mx-auto" />
                    <h3 className="text-lg font-bold text-slate-800">Processing Promotion...</h3>
                    <p className="text-sm text-slate-500">Updating {stats.total} student records</p>
                </div>
            )}

            {/* Step 3: Complete */}
            {step === 3 && (
                <div className="space-y-6">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto"><Check size={32} className="text-emerald-600" /></div>
                        <div>
                            <h3 className="text-lg font-bold text-emerald-800">Promotion Complete!</h3>
                            <p className="text-sm text-emerald-600 mt-1">{stats.promoting} promoted · {stats.graduating} graduated · {stats.detained} detained</p>
                        </div>
                        <div className="flex justify-center gap-3">
                            <button onClick={() => router.push("/school/students")} className="px-5 py-2.5 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700">View Students</button>
                            <button onClick={() => router.push("/school/classes")} className="px-5 py-2.5 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50">View Classes</button>
                            <button className="px-5 py-2.5 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50 flex items-center gap-2"><Download size={14} />Download Report</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}