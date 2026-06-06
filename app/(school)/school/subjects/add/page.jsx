"use client"

import { useState, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
    Plus, Upload, Download, FileText, Check,
    ArrowLeft, AlertCircle, FileSpreadsheet, Trash2, X
} from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { SUBJECT_CATEGORIES } from "@/lib/constants"

// ─── Demo CSV ─────────────────────────────────────────────────────────────────
const DEMO_CSV_CONTENT = `subjectName,code,category,grade,section,teachers,periodsPerWeek
Mathematics,MATH101,Core,Cls 6,A,"Mr. Suresh Kumar, Ms. Priya Nair",5
Mathematics,MATH101,Core,Cls 6,B,"Mr. Suresh Kumar",5
English,ENG101,Language,Cls 6,A,"Mrs. Ananya Reddy",6
Science,SCI101,Core,Cls 7,A,"Mrs. Geeta Sharma",5`

const DEMO_CSV_HEADERS = ["subjectName", "code", "category", "grade", "section", "teachers", "periodsPerWeek"]

// ─── Single Subject Form ──────────────────────────────────────────────────────
function SingleSubjectForm({ onSubmit, onCancel }) {
    const [name, setName] = useState("")
    const [code, setCode] = useState("")
    const [category, setCategory] = useState("")
    const [description, setDescription] = useState("")
    const [periods, setPeriods] = useState("")
    const [mappings, setMappings] = useState([])
    const [loading, setLoading] = useState(false)

    const addMapping = () => {
        setMappings(prev => [...prev, { grade: "", section: "", teachers: "" }])
    }

    const removeMapping = (idx) => {
        setMappings(prev => prev.filter((_, i) => i !== idx))
    }

    const updateMapping = (idx, field, value) => {
        setMappings(prev => prev.map((m, i) => i === idx ? { ...m, [field]: value } : m))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!name || !code || !category) return
        setLoading(true)
        await new Promise(r => setTimeout(r, 500))
        const cleanMappings = mappings.filter(m => m.grade && m.section).map(m => ({
            grade: m.grade,
            section: m.section,
            teachers: m.teachers.split(",").map(t => t.trim()).filter(Boolean)
        }))
        onSubmit([{ name, code, category, description, periodsPerWeek: parseInt(periods) || 0, mappings: cleanMappings }])
        setLoading(false)
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
            <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                    <Plus size={14} className="text-violet-600" />
                </div>
                <h2 className="font-semibold text-slate-800">Subject Details</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Subject Name *</label>
                    <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Mathematics"
                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all" />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Subject Code *</label>
                    <input value={code} onChange={e => setCode(e.target.value)} placeholder="e.g. MATH101"
                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all font-mono" />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category *</label>
                    <select value={category} onChange={e => setCategory(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all bg-white">
                        <option value="">Select category</option>
                        {SUBJECT_CATEGORIES.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Periods / Week</label>
                    <input type="number" value={periods} onChange={e => setPeriods(e.target.value)} placeholder="e.g. 5"
                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all" />
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description of the subject..." rows={2}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all resize-none" />
            </div>

            {/* Class Mappings */}
            <div className="border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-slate-700">Class Assignments</h3>
                    <button type="button" onClick={addMapping}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                        <Plus size={12} /> Add Class
                    </button>
                </div>

                {mappings.length === 0 ? (
                    <p className="text-xs text-slate-400 py-3 text-center border border-dashed border-slate-200 rounded-lg">
                        No classes assigned yet. Click "Add Class" to assign this subject to a class.
                    </p>
                ) : (
                    <div className="space-y-2">
                        {mappings.map((m, i) => (
                            <div key={i} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                                <input value={m.grade} onChange={e => updateMapping(i, "grade", e.target.value)}
                                    placeholder="Grade" className="flex-1 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-violet-500 bg-white" />
                                <input value={m.section} onChange={e => updateMapping(i, "section", e.target.value)}
                                    placeholder="Sec" className="w-16 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-violet-500 bg-white" />
                                <input value={m.teachers} onChange={e => updateMapping(i, "teachers", e.target.value)}
                                    placeholder="Teachers (comma separated)" className="flex-[2] border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-violet-500 bg-white" />
                                <button type="button" onClick={() => removeMapping(i)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0">
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={onCancel}
                    className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit" disabled={!name || !code || !category || loading}
                    className="px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-50 transition-colors">
                    {loading ? "Adding..." : <><Check size={14} /> Add Subject</>}
                </button>
            </div>
        </form>
    )
}

// ─── Bulk Upload Section ──────────────────────────────────────────────────────
function BulkUploadSection({ onUpload, onCancel }) {
    const [file, setFile] = useState(null)
    const [preview, setPreview] = useState(null)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const fileInputRef = useRef(null)

    const parseCSV = (text) => {
        const lines = text.trim().split("\n")
        if (lines.length < 2) { setError("File must contain a header row and at least one data row"); return }
        const headers = lines[0].split(",").map(h => h.trim().toLowerCase())
        const required = ["subjectname", "category", "grade", "section"]
        const missing = required.filter(h => !headers.includes(h))
        if (missing.length > 0) { setError(`Missing columns: ${missing.join(", ")}`); return }

        const data = []
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(",").map(v => v.trim())
            const row = {}
            headers.forEach((h, idx) => { row[h] = values[idx] || "" })
            data.push({
                subjectName: row.subjectname || row.name || "",
                code: row.code || "",
                category: row.category || "Core",
                grade: row.grade || "",
                section: row.section || "",
                teachers: (row.teachers || "").replace(/"/g, ""),
                periodsPerWeek: parseInt(row.periodsperweek) || 0,
            })
        }
        setPreview(data)
        setError("")
    }

    const handleFileChange = (e) => {
        const f = e.target.files?.[0]
        if (!f) return
        setFile(f); setError(""); setPreview(null)
        const reader = new FileReader()
        reader.onload = (ev) => parseCSV(ev.target.result)
        reader.readAsText(f)
    }

    const handleUpload = async () => {
        if (!preview) return
        setLoading(true)
        await new Promise(r => setTimeout(r, 800))
        onUpload(preview)
        setLoading(false)
    }

    const handleDownloadDemo = () => {
        const blob = new Blob([DEMO_CSV_CONTENT], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url; a.download = "demo-subjects.csv"; a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center">
                        <Upload size={14} className="text-sky-600" />
                    </div>
                    <h2 className="font-semibold text-slate-800">Bulk Upload (CSV)</h2>
                </div>
                <button onClick={handleDownloadDemo}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors">
                    <Download size={12} /> Download Demo CSV
                </button>
            </div>

            <div onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${file ? (preview ? "border-emerald-300 bg-emerald-50/50" : "border-amber-300 bg-amber-50/50") : "border-slate-200 hover:border-sky-300 hover:bg-sky-50/50"}`}>
                <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
                {!file ? (
                    <><FileSpreadsheet size={32} className="mx-auto mb-3 text-slate-300" />
                        <p className="text-sm font-medium text-slate-600 mb-1">Drop your CSV file here or click to browse</p>
                        <p className="text-xs text-slate-400">Headers: subjectName, code, category, grade, section, teachers, periodsPerWeek</p></>
                ) : preview ? (
                    <><Check size={32} className="mx-auto mb-3 text-emerald-500" />
                        <p className="text-sm font-medium text-emerald-700">{file.name} — {preview.length} rows ready</p></>
                ) : (
                    <><AlertCircle size={32} className="mx-auto mb-3 text-amber-500" />
                        <p className="text-sm font-medium text-amber-700">{file.name}</p>
                        <p className="text-xs text-amber-500">{error}</p></>
                )}
            </div>

            {preview && (
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="px-4 py-2 bg-slate-50 border-b flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500 uppercase">Preview ({preview.length} rows)</span>
                        <button onClick={() => { setFile(null); setPreview(null) }}
                            className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1"><Trash2 size={11} /> Clear</button>
                    </div>
                    <div className="overflow-x-auto max-h-48">
                        <table className="w-full text-xs">
                            <thead><tr className="border-b border-slate-100">{DEMO_CSV_HEADERS.map(h => <th key={h} className="px-3 py-2 text-left font-semibold text-slate-500 uppercase">{h}</th>)}</tr></thead>
                            <tbody>
                                {preview.slice(0, 10).map((row, i) => (
                                    <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50">
                                        <td className="px-3 py-2 font-medium text-slate-700">{row.subjectName}</td>
                                        <td className="px-3 py-2 text-slate-500 font-mono">{row.code}</td>
                                        <td className="px-3 py-2"><StatusBadge status={row.category === "Core" ? "active" : "pending"} size="sm" label={row.category} /></td>
                                        <td className="px-3 py-2">{row.grade}</td>
                                        <td className="px-3 py-2">{row.section}</td>
                                        <td className="px-3 py-2 text-slate-500">{row.teachers}</td>
                                        <td className="px-3 py-2">{row.periodsPerWeek}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">Cancel</button>
                <button onClick={handleUpload} disabled={!preview || loading}
                    className="px-5 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-50 transition-colors">
                    {loading ? "Uploading..." : <><Upload size={14} /> Upload {preview?.length || 0} Rows</>}
                </button>
            </div>
        </div>
    )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AddSubjectPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const initialMode = searchParams.get("mode") === "bulk" ? "bulk" : "single"
    const [mode, setMode] = useState(initialMode)
    const [showSuccess, setShowSuccess] = useState(false)
    const [addedCount, setAddedCount] = useState(0)

    const handleSubmit = (data) => {
        console.log("Subjects to add:", data)
        setAddedCount(data.length)
        setShowSuccess(true)
    }

    return (
        <div className="max-w-[900px] mx-auto space-y-6">
            {showSuccess && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl text-center p-6">
                        <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                            <Check size={28} className="text-emerald-600" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">{addedCount} subject{addedCount !== 1 ? "s" : ""} added!</h3>
                        <p className="text-sm text-slate-500 mb-6">Successfully added to the system</p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowSuccess(false)} className="flex-1 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">Add More</button>
                            <button onClick={() => router.push("/school/subjects")} className="flex-1 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-colors">View All Subjects</button>
                        </div>
                    </div>
                </div>
            )}

            <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "Subjects", href: "/school/subjects" }, { label: "Add Subject" }]} />

            <div className="flex items-center gap-4 mb-2">
                <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"><ArrowLeft size={18} /></button>
                <div>
                    <h1 className="text-[22px] font-bold text-slate-800">Add Subjects</h1>
                    <p className="text-[13px] text-slate-500">Create a single subject or upload in bulk via CSV</p>
                </div>
            </div>

            <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
                {[{ id: "single", label: "Single Entry", icon: Plus }, { id: "bulk", label: "Bulk Upload", icon: Upload }].map(tab => (
                    <button key={tab.id} onClick={() => setMode(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === tab.id ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                        <tab.icon size={14} />{tab.label}
                    </button>
                ))}
            </div>

            {mode === "single" ? <SingleSubjectForm onSubmit={handleSubmit} onCancel={() => router.back()} /> : <BulkUploadSection onUpload={handleSubmit} onCancel={() => router.back()} />}
        </div>
    )
}