"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import {
    ArrowLeft, Upload, Download, FileSpreadsheet, Check,
    AlertCircle, AlertTriangle, Info, FileText, X, Eye
} from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import IssuesList from "@/components/modules/timetable/IssuesList"
import { cn } from "@/lib/utils"

const DEMO_CSV_CONTENT = `day,period,grade,section,subject,teacher,room
Mon,1,Cls 6,A,Mathematics,Mrs. Meena Pillai,R-30
Mon,2,Cls 6,A,English,Mr. Suresh Kumar,R-30
Mon,3,Cls 6,A,Science,Ms. Priya Nair,R-30
Tue,1,Cls 6,A,Hindi,Mrs. Sunita Das,R-30
Tue,2,Cls 6,A,Mathematics,Mrs. Meena Pillai,R-30
Tue,3,Cls 6,A,Mathematics,Mrs. Meena Pillai,R-30`

const DEMO_CSV_HEADERS = ["day", "period", "grade", "section", "subject", "teacher", "room"]

// Mock validation results
const MOCK_VALIDATION = {
    totalSlots: 42,
    validSlots: 34,
    errors: [
        { id: "v1", type: "teacher_conflict", severity: "error", class: "Cls 6-A", day: "Tue", period: 2, description: "Mrs. Meena Pillai double-booked: Cls 6-A and Cls 7-A simultaneously", resolved: false },
        { id: "v2", type: "room_clash", severity: "error", class: "Cls 7-A", day: "Mon", period: 3, description: "Room R-32 assigned to both Cls 7-A Science and Cls 7-B Mathematics", resolved: false },
        { id: "v3", type: "invalid_subject", severity: "error", class: "Cls 9-A", day: "Wed", period: 1, description: "Biology not in Cls 9-A subject list (subjects: Mathematics, English, Physics, Chemistry, CS)", resolved: false },
    ],
    warnings: [
        { id: "v4", type: "teacher_overload", severity: "warning", class: "—", day: "—", period: null, description: "Ms. Priya Nair assigned 30 periods (max: 28)", resolved: false },
        { id: "v5", type: "consecutive_periods", severity: "warning", class: "Cls 6-A", day: "Tue", period: null, description: "Mathematics assigned for 3 consecutive periods on Tuesday", resolved: false },
        { id: "v6", type: "gap_period", severity: "warning", class: "Cls 8-A", day: "Thu", period: null, description: "Gap between P2 and P4 on Thursday", resolved: false },
    ],
    info: [
        { id: "v7", type: "unused_room", severity: "info", class: "—", day: "—", period: null, description: "Room R-52 has no assignments on Friday", resolved: false },
    ]
}

export default function ValidateTimetablePage() {
    const router = useRouter()
    const [file, setFile] = useState(null)
    const [preview, setPreview] = useState(null)
    const [validating, setValidating] = useState(false)
    const [results, setResults] = useState(null)
    const [error, setError] = useState("")
    const fileInputRef = useRef(null)

    const parseCSV = (text) => {
        const lines = text.trim().split("\n")
        if (lines.length < 2) { setError("File must contain a header row and at least one data row"); return }
        const headers = lines[0].split(",").map(h => h.trim().toLowerCase())
        const required = ["day", "period", "grade", "section", "subject", "teacher"]
        const missing = required.filter(h => !headers.includes(h))
        if (missing.length > 0) { setError(`Missing columns: ${missing.join(", ")}`); return }

        const data = []
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(",").map(v => v.trim())
            const row = {}; headers.forEach((h, idx) => { row[h] = values[idx] || "" })
            data.push(row)
        }
        setPreview(data)
        setError("")
    }

    const handleFileChange = (e) => {
        const f = e.target.files?.[0]
        if (!f) return
        setFile(f); setError(""); setPreview(null); setResults(null)
        const reader = new FileReader()
        reader.onload = (ev) => parseCSV(ev.target.result)
        reader.readAsText(f)
    }

    const handleValidate = async () => {
        if (!preview) return
        setValidating(true)
        await new Promise(r => setTimeout(r, 1500))
        setResults(MOCK_VALIDATION)
        setValidating(false)
    }

    const handleDownloadDemo = () => {
        const blob = new Blob([DEMO_CSV_CONTENT], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a"); a.href = url; a.download = "demo-timetable.csv"; a.click()
        URL.revokeObjectURL(url)
    }

    const allIssues = results ? [...results.errors, ...results.warnings, ...results.info] : []

    return (
        <div className="max-w-[900px] mx-auto space-y-6">
            <PageBreadcrumb items={[
                { label: "Dashboard", href: "/school" },
                { label: "Time Table", href: "/school/timetable" },
                { label: "Validate" },
            ]} />

            {/* Header */}
            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"><ArrowLeft size={18} /></button>
                <div>
                    <h1 className="text-[22px] font-bold text-slate-800">Validate Timetable</h1>
                    <p className="text-[13px] text-slate-500">Upload an existing timetable to check for conflicts and issues</p>
                </div>
            </div>

            {/* Upload Section */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center"><Upload size={14} className="text-sky-600" /></div>
                        <h2 className="font-semibold text-slate-800">Upload Timetable CSV</h2>
                    </div>
                    <button onClick={handleDownloadDemo} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors">
                        <Download size={12} /> Download Demo CSV
                    </button>
                </div>

                <div onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${file ? (preview ? "border-emerald-300 bg-emerald-50/50" : "border-amber-300 bg-amber-50/50") : "border-slate-200 hover:border-sky-300 hover:bg-sky-50/50"}`}>
                    <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
                    {!file ? (
                        <><FileSpreadsheet size={32} className="mx-auto mb-3 text-slate-300" />
                            <p className="text-sm font-medium text-slate-600 mb-1">Drop your timetable CSV here or click to browse</p>
                            <p className="text-xs text-slate-400">Required: day, period, grade, section, subject, teacher | Optional: room</p></>
                    ) : preview ? (
                        <><Check size={32} className="mx-auto mb-3 text-emerald-500" />
                            <p className="text-sm font-medium text-emerald-700">{file.name} — {preview.length} slots ready to validate</p></>
                    ) : (
                        <><AlertCircle size={32} className="mx-auto mb-3 text-amber-500" />
                            <p className="text-sm font-medium text-amber-700">{file.name}</p><p className="text-xs text-amber-500">{error}</p></>
                    )}
                </div>

                {/* Preview */}
                {preview && !results && (
                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                        <div className="px-4 py-2 bg-slate-50 border-b flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500 uppercase">Preview ({preview.length} rows)</span>
                            <button onClick={() => { setFile(null); setPreview(null) }} className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1"><X size={11} /> Clear</button>
                        </div>
                        <div className="overflow-x-auto max-h-48">
                            <table className="w-full text-xs">
                                <thead><tr className="border-b border-slate-100">{DEMO_CSV_HEADERS.map(h => <th key={h} className="px-3 py-2 text-left font-semibold text-slate-500 uppercase">{h}</th>)}</tr></thead>
                                <tbody>{preview.slice(0, 10).map((row, i) => (
                                    <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50">
                                        {DEMO_CSV_HEADERS.map(h => <td key={h} className="px-3 py-2 text-slate-700">{row[h.toLowerCase()] || "—"}</td>)}
                                    </tr>
                                ))}</tbody>
                            </table>
                        </div>
                    </div>
                )}

                <div className="flex justify-end">
                    <button onClick={handleValidate} disabled={!preview || validating}
                        className="px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-50 transition-colors">
                        {validating ? (
                            <><svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" /></svg> Validating...</>
                        ) : (
                            <><Check size={14} /> Validate Timetable</>
                        )}
                    </button>
                </div>
            </div>

            {/* Results */}
            {results && (
                <div className="space-y-4">
                    {/* Summary */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                        <h2 className="font-semibold text-slate-800 mb-4">Validation Results</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {[
                                { label: "Total Slots", value: results.totalSlots, color: "bg-blue-500" },
                                { label: "Valid", value: results.validSlots, color: "bg-emerald-500" },
                                { label: "Errors", value: results.errors.length, color: "bg-red-500" },
                                { label: "Warnings", value: results.warnings.length, color: "bg-amber-500" },
                            ].map(s => (
                                <div key={s.label} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                    <div className={`w-2 h-8 rounded-full ${s.color}`} />
                                    <div><p className="text-lg font-bold text-slate-800">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${(results.validSlots / results.totalSlots) * 100}%` }} />
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{Math.round((results.validSlots / results.totalSlots) * 100)}% valid</p>
                    </div>

                    {/* Issues */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-semibold text-slate-800">Issues Found</h2>
                            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"><Download size={12} /> Download Report</button>
                        </div>
                        <IssuesList issues={allIssues} />
                    </div>

                    {/* Actions */}
                    {results.errors.length === 0 && (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                            <Check size={20} className="mx-auto mb-1 text-emerald-600" />
                            <p className="text-sm font-semibold text-emerald-700">No critical errors! Your timetable is ready to use.</p>
                            <button className="mt-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors">Publish Timetable</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}