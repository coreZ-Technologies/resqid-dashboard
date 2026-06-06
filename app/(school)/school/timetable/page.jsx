"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
    Calendar, Upload, AlertTriangle, Grid3X3, Plus,
    Download, Eye, Zap, FileText
} from "lucide-react"
import PageHeader from "@/components/shared/PageHeader"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import { KpiCard } from "@/components/shared/KpiCard"
import TimetableGrid from "@/components/modules/timetable/TimetableGrid"
import IssuesList from "@/components/modules/timetable/IssuesList"
import { MOCK_TIMETABLE } from "@/lib/mock-data"

const TABS = [
    { id: "view", label: "View Timetable", icon: Eye },
    { id: "issues", label: "Issues", icon: AlertTriangle },
    { id: "generate", label: "Generate", icon: Zap },
    { id: "validate", label: "Validate", icon: Upload },
]

export default function TimetablePage() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState("view")
    const [selectedClass, setSelectedClass] = useState("c7")
    const [highlightTeacher, setHighlightTeacher] = useState(null)

    const classSlots = useMemo(() =>
        MOCK_TIMETABLE.slots.filter(s => s.classId === selectedClass),
        [selectedClass]
    )

    const classOptions = [...new Set(MOCK_TIMETABLE.slots.map(s => ({ id: s.classId, label: `${s.grade}–${s.section}` })))]
    const teacherOptions = [...new Set(MOCK_TIMETABLE.slots.map(s => s.teacherName))].sort()

    const totalSlots = MOCK_TIMETABLE.slots.length
    const totalClasses = MOCK_TIMETABLE.classes.length
    const issueCount = MOCK_TIMETABLE.issues.filter(i => !i.resolved).length

    return (
        <div className="max-w-[1300px] space-y-6">
            <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "Time Table" }]} />

            <PageHeader title="Time Table" description="Generate, validate, and manage school timetables" />

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard title="Total Slots" value={totalSlots} icon={Grid3X3} iconColor="blue" />
                <KpiCard title="Classes" value={totalClasses} icon={Calendar} iconColor="violet" />
                <KpiCard title="Open Issues" value={issueCount} icon={AlertTriangle} iconColor={issueCount > 0 ? "red" : "green"} />
                <KpiCard title="Status" value={MOCK_TIMETABLE.status} icon={FileText} iconColor="amber" />
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit flex-wrap">
                {TABS.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                        <tab.icon size={14} />{tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === "view" && (
                <div className="space-y-4">
                    {/* Controls */}
                    <div className="flex flex-wrap items-center gap-3 bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-500">Class:</span>
                            <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)}
                                className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-violet-500 bg-white">
                                <option value="">All Classes</option>
                                {classOptions.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                            </select>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-500">Highlight Teacher:</span>
                            <select value={highlightTeacher || ""} onChange={e => setHighlightTeacher(e.target.value || null)}
                                className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-violet-500 bg-white">
                                <option value="">None</option>
                                {teacherOptions.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <button onClick={() => router.push(`/school/timetable/${selectedClass}`)}
                            className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-lg bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 transition-colors">
                            <Eye size={12} /> Full View
                        </button>
                    </div>

                    {/* Grid */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-4">
                        <h2 className="font-semibold text-slate-800 mb-3">
                            {selectedClass ? classOptions.find(c => c.id === selectedClass)?.label : "All Classes"} — Timetable
                        </h2>
                        <TimetableGrid slots={selectedClass ? classSlots : MOCK_TIMETABLE.slots} highlightTeacher={highlightTeacher} />
                    </div>
                </div>
            )}

            {activeTab === "issues" && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-slate-800">Issues Dashboard</h2>
                        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"><Download size={12} /> Export Report</button>
                    </div>
                    <IssuesList issues={MOCK_TIMETABLE.issues} onResolve={(id) => console.log("Resolve:", id)} onView={(issue) => console.log("View:", issue)} />
                </div>
            )}

            {activeTab === "generate" && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center mx-auto"><Zap size={28} className="text-violet-600" /></div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Generate New Timetable</h3>
                        <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">Auto-generate a conflict-free timetable for the entire school or a specific class.</p>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                        <button onClick={() => router.push("/school/timetable/generate")}
                            className="px-5 py-2.5 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors">Generate All Classes</button>
                        <button onClick={() => router.push("/school/timetable/generate?mode=single")}
                            className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors">Per Class</button>
                    </div>
                </div>
            )}

            {activeTab === "validate" && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-sky-100 flex items-center justify-center mx-auto"><Upload size={28} className="text-sky-600" /></div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Validate Existing Timetable</h3>
                        <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">Upload your current timetable CSV to check for conflicts, overloads, and gaps.</p>
                    </div>
                    <button onClick={() => router.push("/school/timetable/validate")}
                        className="px-5 py-2.5 rounded-lg bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700 transition-colors">Upload & Validate</button>
                </div>
            )}
        </div>
    )
}