"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Zap, Check, Loader2, Users, QrCode, ChevronDown, ChevronRight, Search } from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import { cn } from "@/lib/utils"

const MOCK_CLASS_QR_STATUS = [
    {
        grade: "Cls 6",
        sections: [
            { section: "A", total: 36, generated: 30, pending: ["Aarav Sharma", "Vihaan Gupta", "Ananya Singh", "Diya Reddy", "Advik Patel", "Kabir Mehta"] },
            { section: "B", total: 35, generated: 35, pending: [] },
        ]
    },
    {
        grade: "Cls 7",
        sections: [
            { section: "A", total: 35, generated: 20, pending: ["Reyansh Joshi", "Anaya Khanna", "Shaurya Saxena", "Myra Kapoor", "Dhruv Sinha", "Kiara Dutta", "Arjun Thakur", "Sara Khan", "Rudra Rajput", "Jiya Bhatia", "Aarav Mehta", "Vihaan Singh", "Ananya Reddy", "Diya Nair", "Advik Sharma"] },
            { section: "B", total: 35, generated: 25, pending: ["Ishita Malhotra", "Kabir Joshi", "Sai Verma", "Aadhya Das", "Reyansh Kumar", "Anaya Patel", "Shaurya Gupta", "Myra Singh", "Dhruv Reddy", "Kiara Nair"] },
            { section: "C", total: 33, generated: 33, pending: [] },
        ]
    },
    {
        grade: "Cls 8",
        sections: [
            { section: "A", total: 34, generated: 10, pending: ["Vivaan Kumar", "Advik Sharma", "Kabir Mehta", "Aadhya Nair", "Sai Verma", "Ishita Malhotra", "Reyansh Joshi", "Anaya Khanna", "Shaurya Saxena", "Myra Kapoor", "Dhruv Sinha", "Kiara Dutta", "Arjun Thakur", "Sara Khan", "Rudra Rajput", "Jiya Bhatia", "Aarav Mehta", "Vihaan Singh", "Ananya Reddy", "Diya Nair", "Advik Patel", "Kabir Joshi", "Sai Reddy", "Aadhya Sharma"] },
        ]
    },
    {
        grade: "Cls 9",
        sections: [
            { section: "A", total: 33, generated: 0, pending: ["All 33 students pending"] },
            { section: "B", total: 32, generated: 0, pending: ["All 32 students pending"] },
        ]
    },
]

export default function GenerateQRCodesPage() {
    const router = useRouter()
    const [expandedClass, setExpandedClass] = useState(null)
    const [expandedSection, setExpandedSection] = useState(null)
    const [selected, setSelected] = useState([]) // ["Cls 7-A", "Cls 7-A-Reyansh Joshi", "Cls 8-A"]
    const [generating, setGenerating] = useState(false)
    const [generated, setGenerated] = useState(false)
    const [search, setSearch] = useState("")

    // Compute totals
    const totalStudents = MOCK_CLASS_QR_STATUS.reduce((s, g) => s + g.sections.reduce((ss, sec) => ss + sec.total, 0), 0)
    const totalGenerated = MOCK_CLASS_QR_STATUS.reduce((s, g) => s + g.sections.reduce((ss, sec) => ss + sec.generated, 0), 0)
    const totalPending = totalStudents - totalGenerated

    // Toggle entire section
    const toggleSection = (grade, section) => {
        const key = `${grade}-${section}`
        setSelected(prev => {
            const isSelected = prev.includes(key)
            if (isSelected) return prev.filter(k => k !== key && !k.startsWith(`${key}-`))
            return [...prev, key]
        })
    }

    // Toggle individual student
    const toggleStudent = (grade, section, studentName) => {
        const sectionKey = `${grade}-${section}`
        const studentKey = `${sectionKey}-${studentName}`
        setSelected(prev => {
            // If section is already fully selected, remove it and add individual students minus this one
            if (prev.includes(sectionKey)) {
                const section = MOCK_CLASS_QR_STATUS.find(g => g.grade === grade)?.sections.find(s => s.section === section)
                const allStudents = section?.pending || []
                return allStudents.filter(s => s !== studentName).map(s => `${sectionKey}-${s}`)
            }
            // Toggle individual
            return prev.includes(studentKey) ? prev.filter(k => k !== studentKey) : [...prev, studentKey]
        })
    }

    // Is a section fully selected?
    const isSectionSelected = (grade, section) => {
        const key = `${grade}-${section}`
        return selected.includes(key)
    }

    // Is an individual student selected?
    const isStudentSelected = (grade, section, studentName) => {
        const sectionKey = `${grade}-${section}`
        const studentKey = `${sectionKey}-${studentName}`
        if (selected.includes(sectionKey)) return true
        return selected.includes(studentKey)
    }

    // Count selected students
    const countSelected = () => {
        let count = 0
        selected.forEach(key => {
            const parts = key.split("-")
            if (parts.length === 2) {
                // Section level — add all pending in that section
                const [grade, section] = parts
                const sec = MOCK_CLASS_QR_STATUS.find(g => g.grade === grade)?.sections.find(s => s.section === section)
                if (sec) count += sec.pending.length
            } else {
                // Individual student
                count += 1
            }
        })
        return count
    }

    const selectAllPending = () => {
        const all = []
        MOCK_CLASS_QR_STATUS.forEach(g => {
            g.sections.forEach(sec => {
                if (sec.pending.length > 0) all.push(`${g.grade}-${sec.section}`)
            })
        })
        setSelected(all)
    }

    const clearAll = () => setSelected([])

    const handleGenerate = async () => {
        setGenerating(true)
        await new Promise(r => setTimeout(r, 2000))
        setGenerating(false)
        setGenerated(true)
        setSelected([])
    }

    // Filter by search
    const filteredClasses = search
        ? MOCK_CLASS_QR_STATUS.map(g => ({
            ...g,
            sections: g.sections.map(sec => ({
                ...sec,
                pending: sec.pending.filter(s => s.toLowerCase().includes(search.toLowerCase()))
            })).filter(sec => sec.pending.length > 0 || sec.total === sec.generated)
        })).filter(g => g.sections.length > 0)
        : MOCK_CLASS_QR_STATUS

    const selectedCount = countSelected()

    return (
        <div className="max-w-[900px] mx-auto space-y-6">
            <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "ID Cards", href: "/school/cards" }, { label: "Generate QR" }]} />

            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"><ArrowLeft size={18} /></button>
                <div>
                    <h1 className="text-[22px] font-bold text-slate-800">Generate QR Codes</h1>
                    <p className="text-[13px] text-slate-500">{totalPending} students across multiple sections need QR codes</p>
                </div>
            </div>

            {generated ? (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-16 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto"><Check size={28} className="text-emerald-600" /></div>
                    <div><h3 className="text-lg font-bold text-slate-800">QR Codes Generated!</h3><p className="text-sm text-slate-500">{selectedCount} students processed</p></div>
                    <div className="flex justify-center gap-3">
                        <button onClick={() => router.push("/school/cards")} className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700">View All Cards</button>
                        <button onClick={() => router.push("/school/cards/print")} className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50">Print Cards</button>
                    </div>
                </div>
            ) : (
                <>
                    {/* Search + Actions Bar */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="relative flex-1">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input value={search} onChange={e => setSearch(e.target.value)}
                                    placeholder="Search student name..."
                                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-violet-500" />
                            </div>
                            <button onClick={selectAllPending} className="text-xs text-violet-500 hover:text-violet-700 font-medium whitespace-nowrap">Select All Pending</button>
                            <span className="text-slate-300">|</span>
                            <button onClick={clearAll} className="text-xs text-slate-400 hover:text-slate-600 font-medium whitespace-nowrap">Clear</button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center"><QrCode size={14} className="text-violet-600" /></div>
                                <span className="text-sm text-slate-600">{totalGenerated}/{totalStudents} students have QR codes</span>
                            </div>
                            <button onClick={handleGenerate} disabled={selectedCount === 0 || generating}
                                className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-violet-700 text-white text-sm font-semibold hover:from-violet-600 hover:to-violet-800 disabled:opacity-50 transition-all flex items-center gap-2">
                                {generating ? <><Loader2 size={14} className="animate-spin" />Generating...</> : <><Zap size={14} />Generate {selectedCount} QR Codes</>}
                            </button>
                        </div>
                    </div>

                    {/* Class Cards */}
                    <div className="space-y-3">
                        {filteredClasses.map(grade => {
                            const gradeTotal = grade.sections.reduce((s, sec) => s + sec.total, 0)
                            const gradeGenerated = grade.sections.reduce((s, sec) => s + sec.generated, 0)
                            const gradeDone = gradeTotal === gradeGenerated
                            const isExpanded = expandedClass === grade.grade

                            return (
                                <div key={grade.grade} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                    {/* Class Header */}
                                    <button onClick={() => setExpandedClass(isExpanded ? null : grade.grade)}
                                        className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center",
                                                gradeDone ? "bg-emerald-100 text-emerald-600" : "bg-violet-100 text-violet-600")}>
                                                {gradeDone ? <Check size={18} /> : <Users size={18} />}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-800">{grade.grade}</p>
                                                <p className="text-xs text-slate-500">{grade.sections.length} section{grade.sections.length !== 1 ? 's' : ''} · {gradeGenerated}/{gradeTotal} done</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-24 h-2 rounded-full bg-slate-100">
                                                <div className={cn("h-full rounded-full", gradeDone ? "bg-emerald-500" : "bg-violet-500")}
                                                    style={{ width: `${Math.round((gradeGenerated / gradeTotal) * 100)}%` }} />
                                            </div>
                                            <span className="text-xs font-semibold text-slate-600">{Math.round((gradeGenerated / gradeTotal) * 100)}%</span>
                                            {isExpanded ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
                                        </div>
                                    </button>

                                    {/* Sections */}
                                    {isExpanded && (
                                        <div className="border-t border-slate-100">
                                            {grade.sections.map(sec => {
                                                const secKey = `${grade.grade}-${sec.section}`
                                                const secDone = sec.generated === sec.total
                                                const secSelected = isSectionSelected(grade.grade, sec.section)
                                                const isSecExpanded = expandedSection === secKey

                                                return (
                                                    <div key={secKey} className="border-b border-slate-50 last:border-b-0">
                                                        {/* Section Row */}
                                                        <div className="px-5 py-3 flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                {!secDone && (
                                                                    <button onClick={() => toggleSection(grade.grade, sec.section)}
                                                                        className={cn("w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0",
                                                                            secSelected ? "bg-violet-600 border-violet-600" : "border-slate-300")}>
                                                                        {secSelected && <Check size={12} className="text-white" />}
                                                                    </button>
                                                                )}
                                                                {secDone && <Check size={20} className="text-emerald-500 flex-shrink-0" />}
                                                                <div>
                                                                    <button onClick={() => setExpandedSection(isSecExpanded ? null : secKey)}
                                                                        className="text-sm font-medium text-slate-700 hover:text-violet-600 flex items-center gap-1">
                                                                        Section {sec.section}
                                                                        {!secDone && isSecExpanded ? <ChevronDown size={12} /> : !secDone ? <ChevronRight size={12} /> : null}
                                                                    </button>
                                                                    <p className="text-xs text-slate-400">{sec.total} students</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                {secDone ? (
                                                                    <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">Complete</span>
                                                                ) : (
                                                                    <span className="text-xs text-violet-600 font-semibold bg-violet-50 px-2 py-0.5 rounded-full">{sec.pending.length} pending</span>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Individual Students (expandable) */}
                                                        {!secDone && isSecExpanded && sec.pending.length > 0 && (
                                                            <div className="bg-slate-50 border-t border-slate-100 px-5 py-2">
                                                                <div className="grid grid-cols-2 gap-1">
                                                                    {sec.pending.map(name => {
                                                                        const studentSelected = isStudentSelected(grade.grade, sec.section, name)
                                                                        return (
                                                                            <button key={name}
                                                                                onClick={() => toggleStudent(grade.grade, sec.section, name)}
                                                                                className={cn("flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors",
                                                                                    studentSelected ? "bg-violet-100 text-violet-700" : "hover:bg-white text-slate-600")}>
                                                                                <div className={cn("w-4 h-4 rounded border flex items-center justify-center flex-shrink-0",
                                                                                    studentSelected ? "bg-violet-600 border-violet-600" : "border-slate-300")}>
                                                                                    {studentSelected && <Check size={10} className="text-white" />}
                                                                                </div>
                                                                                {name}
                                                                            </button>
                                                                        )
                                                                    })}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </>
            )}
        </div>
    )
}