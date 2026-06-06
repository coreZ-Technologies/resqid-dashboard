"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Check, X, Clock, Users, Save, UserCheck, RotateCcw } from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { MOCK_CLASSES } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const MOCK_STUDENTS_BY_CLASS = {
    c7: [
        { id: "s1", name: "Aarav Sharma", rollNo: 1, avatar: "AS", avatarColor: "bg-blue-500", status: null },
        { id: "s2", name: "Ananya Patel", rollNo: 2, avatar: "AP", avatarColor: "bg-pink-500", status: null },
        { id: "s3", name: "Arjun Nair", rollNo: 3, avatar: "AN", avatarColor: "bg-indigo-500", status: null },
        { id: "s4", name: "Diya Reddy", rollNo: 4, avatar: "DR", avatarColor: "bg-rose-500", status: null },
        { id: "s5", name: "Ishaan Gupta", rollNo: 5, avatar: "IG", avatarColor: "bg-amber-500", status: null },
        { id: "s6", name: "Kavya Joshi", rollNo: 6, avatar: "KJ", avatarColor: "bg-violet-500", status: null },
        { id: "s7", name: "Reyansh Kumar", rollNo: 7, avatar: "RK", avatarColor: "bg-emerald-500", status: null },
        { id: "s8", name: "Shanaya Das", rollNo: 8, avatar: "SD", avatarColor: "bg-orange-500", status: null },
        { id: "s9", name: "Vihaan Mehta", rollNo: 9, avatar: "VM", avatarColor: "bg-cyan-500", status: null },
        { id: "s10", name: "Zara Khan", rollNo: 10, avatar: "ZK", avatarColor: "bg-purple-500", status: null },
    ]
}

export default function MarkAttendancePage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const classParam = searchParams.get("class")

    const [selectedClass, setSelectedClass] = useState(classParam || "")
    const [students, setStudents] = useState([])
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    const classOptions = MOCK_CLASSES.filter(c => c.status === "Active")

    useEffect(() => {
        if (selectedClass && MOCK_STUDENTS_BY_CLASS[selectedClass]) {
            setStudents(MOCK_STUDENTS_BY_CLASS[selectedClass].map(s => ({ ...s, status: null })))
        } else {
            setStudents([])
        }
        setSaved(false)
    }, [selectedClass])

    const markStatus = (studentId, status) => {
        setStudents(prev => prev.map(s => s.id === studentId ? { ...s, status: s.status === status ? null : status } : s))
    }

    const markAllPresent = () => {
        setStudents(prev => prev.map(s => ({ ...s, status: "present" })))
    }

    const resetAll = () => {
        setStudents(prev => prev.map(s => ({ ...s, status: null })))
    }

    const handleSave = async () => {
        setSaving(true)
        await new Promise(r => setTimeout(r, 800))
        console.log("Attendance saved:", { classId: selectedClass, date: new Date().toISOString(), records: students })
        setSaving(false)
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
    }

    const presentCount = students.filter(s => s.status === "present").length
    const absentCount = students.filter(s => s.status === "absent").length
    const lateCount = students.filter(s => s.status === "late").length
    const unmarkedCount = students.filter(s => !s.status).length
    const selectedClassName = classOptions.find(c => c.id === selectedClass)

    return (
        <div className="max-w-[900px] mx-auto space-y-6">
            <PageBreadcrumb items={[
                { label: "Dashboard", href: "/school" },
                { label: "Attendance", href: "/school/attendance" },
                { label: "Mark Attendance" },
            ]} />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"><ArrowLeft size={18} /></button>
                    <div>
                        <h1 className="text-[22px] font-bold text-slate-800">Mark Attendance</h1>
                        <p className="text-[13px] text-slate-500">{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
                    </div>
                </div>
            </div>

            {/* Class Selector */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Select Class</label>
                <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 bg-white">
                    <option value="">Choose a class...</option>
                    {classOptions.map(c => <option key={c.id} value={c.id}>{c.grade}–{c.section} — {c.classTeacher}</option>)}
                </select>
            </div>

            {selectedClass && students.length > 0 && (
                <>
                    {/* Summary + Actions */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-4 text-xs">
                            <span className="flex items-center gap-1 text-emerald-600 font-semibold"><UserCheck size={12} /> {presentCount} Present</span>
                            <span className="flex items-center gap-1 text-red-600 font-semibold"><X size={12} /> {absentCount} Absent</span>
                            <span className="flex items-center gap-1 text-amber-600 font-semibold"><Clock size={12} /> {lateCount} Late</span>
                            {unmarkedCount > 0 && <span className="text-slate-400 font-medium">{unmarkedCount} unmarked</span>}
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={markAllPresent} className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">Mark All Present</button>
                            <button onClick={resetAll} className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"><RotateCcw size={11} className="inline mr-1" />Reset</button>
                            <button onClick={handleSave} disabled={saving || unmarkedCount > 0}
                                className="px-4 py-1.5 rounded-lg bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 transition-colors disabled:opacity-50 flex items-center gap-1.5">
                                {saving ? "Saving..." : saved ? <><Check size={12} /> Saved!</> : <><Save size={12} /> Save</>}
                            </button>
                        </div>
                    </div>

                    {/* Student List */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-5 py-3 border-b border-slate-100">
                            <h2 className="font-semibold text-slate-800">{selectedClassName?.grade}–{selectedClassName?.section} — {students.length} Students</h2>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {students.map(student => (
                                <div key={student.id} className={cn("flex items-center justify-between px-5 py-3 hover:bg-slate-50/50 transition-colors",
                                    student.status === "present" && "bg-emerald-50/30",
                                    student.status === "absent" && "bg-red-50/30",
                                    student.status === "late" && "bg-amber-50/30"
                                )}>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-mono text-slate-400 w-6">#{student.rollNo}</span>
                                        <div className={`w-8 h-8 rounded-full ${student.avatarColor} flex items-center justify-center text-white text-[10px] font-bold`}>{student.avatar}</div>
                                        <span className="text-sm font-medium text-slate-700">{student.name}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        {[
                                            { status: "present", label: "Present", color: "border-emerald-300 text-emerald-600 hover:bg-emerald-50", activeColor: "bg-emerald-600 text-white border-emerald-600" },
                                            { status: "absent", label: "Absent", color: "border-red-300 text-red-600 hover:bg-red-50", activeColor: "bg-red-600 text-white border-red-600" },
                                            { status: "late", label: "Late", color: "border-amber-300 text-amber-600 hover:bg-amber-50", activeColor: "bg-amber-600 text-white border-amber-600" },
                                        ].map(opt => (
                                            <button key={opt.status} onClick={() => markStatus(student.id, opt.status)}
                                                className={cn("px-3 py-1.5 rounded-lg border text-xs font-medium transition-all",
                                                    student.status === opt.status ? opt.activeColor : opt.color)}>
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {selectedClass && students.length === 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
                    <Users size={32} className="mx-auto mb-3 text-slate-300" />
                    <p className="text-sm text-slate-500">No students found for this class.</p>
                </div>
            )}
        </div>
    )
}