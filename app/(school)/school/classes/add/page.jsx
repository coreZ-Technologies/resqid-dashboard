"use client"

import { useState, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
    Plus, Upload, Download, FileText, Check, X,
    ArrowLeft, AlertCircle, FileSpreadsheet, Trash2
} from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import { EmptyState } from "@/components/shared/EmptyState"
import { ConfirmDialog, useConfirmDialog } from "@/components/shared/ConfirmDialog"
import { StatusBadge } from "@/components/shared/StatusBadge"

// ─── Demo CSV data ────────────────────────────────────────────────────────────
const DEMO_CSV_CONTENT = `grade,section,classTeacher,room,status
Nursery,A,Mrs. Meena Pillai,R-01,Active
Nursery,B,Mrs. Rekha Sharma,R-02,Active
Cls 1,A,Mrs. Kavita Reddy,R-10,Active
Cls 1,B,Mr. Rajesh Nair,R-11,Active
Cls 9,A,Mr. Amit Das,R-50,Active`

const DEMO_CSV_HEADERS = ["grade", "section", "classTeacher", "room", "status"]

// ─── Sub-components ──────────────────────────────────────────────────────────

function SingleClassForm({ onSubmit, onCancel }) {
    const GRADES = [
        "Nursery", "LKG", "UKG",
        "Cls 1", "Cls 2", "Cls 3", "Cls 4", "Cls 5",
        "Cls 6", "Cls 7", "Cls 8",
        "Cls 9", "Cls 10", "Cls 11", "Cls 12"
    ]
    const SECTIONS = ["A", "B", "C", "D", "E"]

    const [grade, setGrade] = useState("")
    const [section, setSection] = useState("")
    const [teacher, setTeacher] = useState("")
    const [room, setRoom] = useState("")
    const [status, setStatus] = useState("Active")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!grade || !section) return
        setLoading(true)
        await new Promise(r => setTimeout(r, 500))
        onSubmit([{ grade, section, classTeacher: teacher, room, status }])
        setLoading(false)
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
            <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                    <Plus size={14} className="text-violet-600" />
                </div>
                <h2 className="font-semibold text-slate-800">Single Class Entry</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Grade *</label>
                    <select
                        value={grade}
                        onChange={e => setGrade(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all bg-white"
                    >
                        <option value="">Select grade</option>
                        {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Section *</label>
                    <div className="flex gap-2">
                        {SECTIONS.map(s => (
                            <button
                                key={s}
                                type="button"
                                onClick={() => setSection(s)}
                                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${section === s
                                    ? "border-violet-500 bg-violet-600 text-white"
                                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                    }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Class Teacher</label>
                    <input
                        value={teacher}
                        onChange={e => setTeacher(e.target.value)}
                        placeholder="e.g. Mr. Rajesh Kumar"
                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Room Number</label>
                    <input
                        value={room}
                        onChange={e => setRoom(e.target.value)}
                        placeholder="e.g. R-01"
                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Status</label>
                    <div className="flex gap-2">
                        {["Active", "Inactive"].map(s => (
                            <button
                                key={s}
                                type="button"
                                onClick={() => setStatus(s)}
                                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${status === s
                                    ? s === "Active"
                                        ? "border-emerald-500 bg-emerald-600 text-white"
                                        : "border-slate-500 bg-slate-600 text-white"
                                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                    }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={!grade || !section || loading}
                    className="px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-50 transition-colors"
                >
                    {loading ? "Adding..." : <><Check size={14} /> Add Class</>}
                </button>
            </div>
        </form>
    )
}

function BulkUploadSection({ onUpload, onCancel }) {
    const [file, setFile] = useState(null)
    const [preview, setPreview] = useState(null)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const fileInputRef = useRef(null)

    const parseCSV = (text) => {
        const lines = text.trim().split("\n")
        if (lines.length < 2) {
            setError("File must contain a header row and at least one data row")
            return
        }

        const headers = lines[0].split(",").map(h => h.trim().toLowerCase())
        const requiredHeaders = ["grade", "section"]
        const missingHeaders = requiredHeaders.filter(h => !headers.includes(h))

        if (missingHeaders.length > 0) {
            setError(`Missing required columns: ${missingHeaders.join(", ")}`)
            return
        }

        const data = []
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(",").map(v => v.trim())
            if (values.length < 2 || !values[0] || !values[1]) continue

            const row = {}
            headers.forEach((h, idx) => {
                row[h] = values[idx] || ""
            })

            data.push({
                grade: row.grade,
                section: row.section,
                classTeacher: row.classteacher || row.classTeacher || "",
                room: row.room || "",
                status: row.status || "Active",
            })
        }

        if (data.length === 0) {
            setError("No valid data rows found")
            return
        }

        setPreview(data)
        setError("")
    }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0]
        if (!selectedFile) return
        setFile(selectedFile)
        setError("")
        setPreview(null)
        const reader = new FileReader()
        reader.onload = (event) => parseCSV(event.target.result)
        reader.readAsText(selectedFile)
    }

    const handleUpload = async () => {
        if (!preview || preview.length === 0) return
        setLoading(true)
        await new Promise(r => setTimeout(r, 800))
        onUpload(preview)
        setLoading(false)
    }

    const handleDownloadDemo = () => {
        const blob = new Blob([DEMO_CSV_CONTENT], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "demo-classes.csv"
        a.click()
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
                <button
                    onClick={handleDownloadDemo}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
                >
                    <Download size={12} />
                    Download Demo CSV
                </button>
            </div>

            <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${file
                    ? preview
                        ? "border-emerald-300 bg-emerald-50/50"
                        : "border-amber-300 bg-amber-50/50"
                    : "border-slate-200 hover:border-sky-300 hover:bg-sky-50/50"
                    }`}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xls,.xlsx"
                    onChange={handleFileChange}
                    className="hidden"
                />

                {!file ? (
                    <>
                        <FileSpreadsheet size={32} className="mx-auto mb-3 text-slate-300" />
                        <p className="text-sm font-medium text-slate-600 mb-1">
                            Drop your CSV file here or click to browse
                        </p>
                        <p className="text-xs text-slate-400">
                            Supports .csv files with headers: grade, section, classTeacher, room, status
                        </p>
                    </>
                ) : preview ? (
                    <>
                        <Check size={32} className="mx-auto mb-3 text-emerald-500" />
                        <p className="text-sm font-medium text-emerald-700 mb-1">
                            {file.name} — {preview.length} class{preview.length !== 1 ? "es" : ""} ready
                        </p>
                        <p className="text-xs text-emerald-500">Review below and confirm upload</p>
                    </>
                ) : (
                    <>
                        <AlertCircle size={32} className="mx-auto mb-3 text-amber-500" />
                        <p className="text-sm font-medium text-amber-700 mb-1">{file.name}</p>
                        <p className="text-xs text-amber-500">{error}</p>
                    </>
                )}
            </div>

            {preview && preview.length > 0 && (
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                            Preview ({preview.length} rows)
                        </span>
                        <button
                            onClick={() => { setFile(null); setPreview(null) }}
                            className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                        >
                            <Trash2 size={11} /> Clear
                        </button>
                    </div>
                    <div className="overflow-x-auto max-h-48">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    {DEMO_CSV_HEADERS.map(h => (
                                        <th key={h} className="px-3 py-2 text-left font-semibold text-slate-500 uppercase">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {preview.slice(0, 10).map((row, i) => (
                                    <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50">
                                        <td className="px-3 py-2 text-slate-700 font-medium">{row.grade}</td>
                                        <td className="px-3 py-2 text-slate-700">{row.section}</td>
                                        <td className="px-3 py-2 text-slate-600">{row.classTeacher || "—"}</td>
                                        <td className="px-3 py-2 text-slate-600">{row.room || "—"}</td>
                                        <td className="px-3 py-2">
                                            <StatusBadge
                                                status={row.status === "Active" ? "active" : "inactive"}
                                                size="sm"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {preview.length > 10 && (
                            <p className="px-3 py-2 text-xs text-slate-400">
                                +{preview.length - 10} more rows
                            </p>
                        )}
                    </div>
                </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={handleUpload}
                    disabled={!preview || loading}
                    className="px-5 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-50 transition-colors"
                >
                    {loading ? "Uploading..." : <><Upload size={14} /> Upload {preview?.length || 0} Classes</>}
                </button>
            </div>
        </div>
    )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AddClassPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const initialMode = searchParams.get("mode") === "bulk" ? "bulk" : "single"
    const [mode, setMode] = useState(initialMode)
    const [showSuccess, setShowSuccess] = useState(false)
    const [addedCount, setAddedCount] = useState(0)

    const handleSubmit = (data) => {
        console.log("Classes to add:", data)
        setAddedCount(data.length)
        setShowSuccess(true)
    }

    const handleViewAll = () => {
        setShowSuccess(false)
        router.push("/school/classes")
    }

    return (
        <div className="max-w-[900px] mx-auto space-y-6">
            {showSuccess && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl text-center p-6">
                        <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                            <Check size={28} className="text-emerald-600" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">
                            {addedCount} class{addedCount !== 1 ? "es" : ""} added!
                        </h3>
                        <p className="text-sm text-slate-500 mb-6">
                            Successfully added to the system
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowSuccess(false)}
                                className="flex-1 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
                            >
                                Add More
                            </button>
                            <button
                                onClick={handleViewAll}
                                className="flex-1 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-colors"
                            >
                                View All Classes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <PageBreadcrumb
                items={[
                    { label: "Dashboard", href: "/school" },
                    { label: "Classes", href: "/school/classes" },
                    { label: "Add Classes" },
                ]}
            />

            <div className="flex items-center gap-4 mb-2">
                <button
                    onClick={() => router.back()}
                    className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
                >
                    <ArrowLeft size={18} />
                </button>
                <div>
                    <h1 className="text-[22px] font-bold text-slate-800">Add Classes</h1>
                    <p className="text-[13px] text-slate-500">Create a single class or upload in bulk via CSV</p>
                </div>
            </div>

            <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
                {[
                    { id: "single", label: "Single Entry", icon: Plus },
                    { id: "bulk", label: "Bulk Upload", icon: Upload },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setMode(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === tab.id
                            ? "bg-white text-slate-800 shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                            }`}
                    >
                        <tab.icon size={14} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {mode === "single" ? (
                <SingleClassForm
                    onSubmit={handleSubmit}
                    onCancel={() => router.back()}
                />
            ) : (
                <BulkUploadSection
                    onUpload={handleSubmit}
                    onCancel={() => router.back()}
                />
            )}

            {mode === "bulk" && (
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <FileText size={14} className="text-slate-500" />
                        <h3 className="text-sm font-semibold text-slate-700">CSV Format Guide</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                            <p className="font-semibold text-slate-600 mb-1">Required columns:</p>
                            <code className="text-violet-600 bg-violet-50 px-1.5 py-0.5 rounded">grade</code>
                            <span className="text-slate-400 mx-1">·</span>
                            <code className="text-violet-600 bg-violet-50 px-1.5 py-0.5 rounded">section</code>
                        </div>
                        <div>
                            <p className="font-semibold text-slate-600 mb-1">Optional columns:</p>
                            <code className="text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">classTeacher</code>
                            <span className="text-slate-400 mx-1">·</span>
                            <code className="text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">room</code>
                            <span className="text-slate-400 mx-1">·</span>
                            <code className="text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">status</code>
                        </div>
                        <div>
                            <p className="font-semibold text-slate-600 mb-1">Grade format:</p>
                            <code className="text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">Nursery, Cls 1, Cls 10, etc.</code>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}