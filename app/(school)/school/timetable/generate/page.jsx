"use client"

import { useState, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
    ArrowLeft, Zap, Download, Check, AlertCircle,
    Loader2, Grid3X3, Calendar, Clock, RefreshCw,
    ChevronDown, Eye
} from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import { StatusBadge } from "@/components/shared/StatusBadge"
import TimetableGrid from "@/components/modules/timetable/TimetableGrid"
import IssuesList from "@/components/modules/timetable/IssuesList"
import { MOCK_CLASSES } from "@/lib/mock-data"
import { MOCK_TIMETABLE } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const CONSTRAINT_PRESETS = {
    balanced: { label: "Balanced", description: "Even distribution across week", maxConsecutive: 2, maxDaily: 6, allowGaps: true },
    compact: { label: "Compact", description: "Minimize gaps, longer blocks", maxConsecutive: 3, maxDaily: 7, allowGaps: false },
    relaxed: { label: "Relaxed", description: "Fewer periods per day", maxConsecutive: 2, maxDaily: 5, allowGaps: true },
}

export default function GenerateTimetablePage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const modeParam = searchParams.get("mode")

    const [mode, setMode] = useState(modeParam === "single" ? "single" : "all")
    const [selectedClass, setSelectedClass] = useState("")
    const [selectedClasses, setSelectedClasses] = useState([])
    const [preset, setPreset] = useState("balanced")
    const [generating, setGenerating] = useState(false)
    const [progress, setProgress] = useState(0)
    const [result, setResult] = useState(null)
    const [error, setError] = useState("")

    const classOptions = MOCK_CLASSES.filter(c => c.status === "Active")

    const toggleClass = (id) => {
        setSelectedClasses(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id])
    }

    const selectAll = () => setSelectedClasses(classOptions.map(c => c.id))
    const clearAll = () => setSelectedClasses([])

    const handleGenerate = async () => {
        if (mode === "single" && !selectedClass) { setError("Please select a class"); return }
        if (mode === "all" && selectedClasses.length === 0) { setError("Please select at least one class"); return }

        setError("")
        setGenerating(true)
        setProgress(0)
        setResult(null)

        const totalSteps = 5
        for (let i = 1; i <= totalSteps; i++) {
            await new Promise(r => setTimeout(r, 600))
            setProgress((i / totalSteps) * 100)
        }

        const classesToGenerate = mode === "single" ? [selectedClass] : selectedClasses
        setResult({
            classesGenerated: classesToGenerate.length,
            totalSlots: MOCK_TIMETABLE.slots.length,
            conflicts: MOCK_TIMETABLE.issues.filter(i => i.severity === "error").length,
            warnings: MOCK_TIMETABLE.issues.filter(i => i.severity === "warning").length,
            timeTaken: "3.2s",
            slots: MOCK_TIMETABLE.slots.filter(s => classesToGenerate.includes(s.classId)),
            issues: MOCK_TIMETABLE.issues,
        })
        setGenerating(false)
    }

    const handlePublish = () => {
        console.log("Publishing timetable...")
        router.push("/school/timetable")
    }

    return (
        <div className="max-w-[1300px] mx-auto space-y-6">
            <PageBreadcrumb items={[
                { label: "Dashboard", href: "/school" },
                { label: "Time Table", href: "/school/timetable" },
                { label: "Generate" },
            ]} />

            {/* Header */}
            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"><ArrowLeft size={18} /></button>
                <div>
                    <h1 className="text-[22px] font-bold text-slate-800">Generate Timetable</h1>
                    <p className="text-[13px] text-slate-500">Auto-generate a conflict-free timetable using constraint solving</p>
                </div>
            </div>

            {/* Mode Toggle */}
            <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
                {[
                    { id: "all", label: "All Classes", description: "Generate for entire school" },
                    { id: "single", label: "Per Class", description: "Generate for one class" },
                ].map(tab => (
                    <button key={tab.id} onClick={() => setMode(tab.id)}
                        className={`px-4 py-2.5 rounded-lg text-left transition-all ${mode === tab.id ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                        <p className="text-sm font-medium">{tab.label}</p>
                        <p className="text-[10px] opacity-70">{tab.description}</p>
                    </button>
                ))}
            </div>

            {/* Configuration */}
            {!result && (
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Class Selection */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
                        <h2 className="font-semibold text-slate-800">
                            {mode === "single" ? "Select Class" : "Select Classes"}
                        </h2>

                        {mode === "single" ? (
                            <select value={selectedClass} onChange={e => { setSelectedClass(e.target.value); setError("") }}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 bg-white">
                                <option value="">Choose a class...</option>
                                {classOptions.map(c => <option key={c.id} value={c.id}>{c.grade}–{c.section} — {c.classTeacher}</option>)}
                            </select>
                        ) : (
                            <>
                                <div className="flex gap-2 mb-2">
                                    <button onClick={selectAll} className="text-xs text-violet-500 hover:text-violet-700 font-medium">Select All</button>
                                    <span className="text-slate-300">|</span>
                                    <button onClick={clearAll} className="text-xs text-slate-400 hover:text-slate-600 font-medium">Clear</button>
                                    <span className="ml-auto text-xs text-slate-400">{selectedClasses.length} selected</span>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                                    {classOptions.map(c => (
                                        <button key={c.id} onClick={() => toggleClass(c.id)}
                                            className={cn("flex items-center gap-2 p-2 rounded-lg border text-xs font-medium transition-all text-left",
                                                selectedClasses.includes(c.id) ? "border-violet-500 bg-violet-50 text-violet-700" : "border-slate-200 text-slate-600 hover:bg-slate-50")}>
                                            <div className={`w-2 h-2 rounded-full ${selectedClasses.includes(c.id) ? "bg-violet-500" : "bg-slate-300"}`} />
                                            {c.grade}–{c.section}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}

                        {error && (
                            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                                <AlertCircle size={12} />{error}
                            </div>
                        )}
                    </div>

                    {/* Constraints */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
                        <h2 className="font-semibold text-slate-800">Constraints</h2>
                        <div className="space-y-2">
                            {Object.entries(CONSTRAINT_PRESETS).map(([key, val]) => (
                                <button key={key} onClick={() => setPreset(key)}
                                    className={cn("w-full p-3 rounded-lg border text-left transition-all",
                                        preset === key ? "border-violet-500 bg-violet-50" : "border-slate-200 hover:bg-slate-50")}>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-slate-700">{val.label}</span>
                                        {preset === key && <Check size={14} className="text-violet-600" />}
                                    </div>
                                    <p className="text-xs text-slate-500 mt-0.5">{val.description}</p>
                                    <div className="flex gap-3 mt-1.5 text-[10px] text-slate-400">
                                        <span>Max {val.maxConsecutive} consecutive</span>
                                        <span>{val.maxDaily} periods/day</span>
                                        <span>{val.allowGaps ? "Gaps allowed" : "No gaps"}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Generate Button */}
            {!result && (
                <div className="flex justify-center">
                    <button onClick={handleGenerate} disabled={generating}
                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-violet-700 text-white text-sm font-semibold shadow-lg shadow-violet-200 hover:from-violet-600 hover:to-violet-800 transition-all disabled:opacity-70 flex items-center gap-2">
                        {generating ? <><Loader2 size={16} className="animate-spin" /> Generating... {Math.round(progress)}%</> : <><Zap size={16} /> Generate Timetable</>}
                    </button>
                </div>
            )}

            {/* Progress Bar */}
            {generating && (
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-violet-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
            )}

            {/* Results */}
            {result && (
                <div className="space-y-6">
                    {/* Success Banner */}
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center"><Check size={20} className="text-emerald-600" /></div>
                            <div>
                                <p className="font-semibold text-emerald-800">Timetable Generated!</p>
                                <p className="text-xs text-emerald-600">{result.classesGenerated} class{result.classesGenerated !== 1 ? "es" : ""} generated in {result.timeTaken}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setResult(null)} className="px-3 py-1.5 rounded-lg border border-emerald-300 text-xs font-medium text-emerald-700 hover:bg-emerald-100 transition-colors"><RefreshCw size={12} className="inline mr-1" />Regenerate</button>
                            <button onClick={handlePublish} className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors">Publish</button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                            { label: "Classes", value: result.classesGenerated, color: "bg-blue-500", icon: Grid3X3 },
                            { label: "Total Slots", value: result.totalSlots, color: "bg-violet-500", icon: Calendar },
                            { label: "Conflicts", value: result.conflicts, color: result.conflicts > 0 ? "bg-red-500" : "bg-emerald-500", icon: AlertCircle },
                            { label: "Warnings", value: result.warnings, color: result.warnings > 0 ? "bg-amber-500" : "bg-emerald-500", icon: AlertCircle },
                        ].map(s => (
                            <div key={s.label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center`}><s.icon size={18} className="text-white" /></div>
                                <div><p className="text-xl font-bold text-slate-800">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div>
                            </div>
                        ))}
                    </div>

                    {/* Preview Grid */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="font-semibold text-slate-800">Preview</h2>
                            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"><Download size={12} /> Export</button>
                        </div>
                        <TimetableGrid slots={result.slots} />
                    </div>

                    {/* Issues */}
                    {result.issues.length > 0 && (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                            <h2 className="font-semibold text-slate-800 mb-4">Issues Found</h2>
                            <IssuesList issues={result.issues} />
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}