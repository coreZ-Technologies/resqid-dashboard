"use client"

import { useState, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Plus, Upload, Download, Check, ArrowLeft, AlertCircle, FileSpreadsheet, Trash2 } from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import { StatusBadge } from "@/components/shared/StatusBadge"

const DEMO_CSV_CONTENT = `name,email,phone,subjects,qualification,experience,joiningDate,employeeId
"Mrs. Meena Pillai",meena.p@school.in,9876543210,"Mathematics,Physics","M.Sc, B.Ed",8 years,2016-06-15,EMP-2016-042
"Mr. Suresh Kumar",suresh.k@school.in,9876543211,"Mathematics,Science","M.Sc, M.Ed",12 years,2012-03-10,EMP-2012-018
"Ms. Priya Nair",priya.n@school.in,9876543212,"Mathematics,English","M.A, B.Ed",5 years,2019-07-22,EMP-2019-031`

const DEMO_CSV_HEADERS = ["name", "email", "phone", "subjects", "qualification", "experience", "joiningDate", "employeeId"]

function SingleTeacherForm({ onSubmit, onCancel }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [subjects, setSubjects] = useState("")
  const [qualification, setQualification] = useState("")
  const [experience, setExperience] = useState("")
  const [joiningDate, setJoiningDate] = useState("")
  const [employeeId, setEmployeeId] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name || !email) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 500))
    onSubmit([{ name, email, phone, subjects: subjects.split(",").map(s => s.trim()).filter(Boolean), qualification, experience, joiningDate, employeeId }])
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center"><Plus size={14} className="text-violet-600" /></div>
        <h2 className="font-semibold text-slate-800">Teacher Details</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name *</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Mrs. Meena Pillai"
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email *</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="teacher@school.in"
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone</label>
          <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="9876543210"
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Employee ID</label>
          <input value={employeeId} onChange={e => setEmployeeId(e.target.value)} placeholder="EMP-2026-001"
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all font-mono" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Subjects (comma separated)</label>
          <input value={subjects} onChange={e => setSubjects(e.target.value)} placeholder="Mathematics, Physics"
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Qualification</label>
          <input value={qualification} onChange={e => setQualification(e.target.value)} placeholder="M.Sc, B.Ed"
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Experience</label>
          <input value={experience} onChange={e => setExperience(e.target.value)} placeholder="8 years"
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Joining Date</label>
          <input type="date" value={joiningDate} onChange={e => setJoiningDate(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all" />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">Cancel</button>
        <button type="submit" disabled={!name || !email || loading}
          className="px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-50 transition-colors">
          {loading ? "Adding..." : <><Check size={14} /> Add Teacher</>}
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
    if (lines.length < 2) { setError("File must contain a header row and at least one data row"); return }
    const headers = lines[0].split(",").map(h => h.trim().toLowerCase())
    if (!headers.includes("name") || !headers.includes("email")) { setError("Missing required columns: name, email"); return }
    const data = []
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map(v => v.trim().replace(/"/g, ""))
      const row = {}; headers.forEach((h, idx) => { row[h] = values[idx] || "" })
      data.push({ name: row.name, email: row.email, phone: row.phone || "", subjects: (row.subjects || "").replace(/"/g, ""), qualification: row.qualification || "", experience: row.experience || "", joiningDate: row.joiningdate || "", employeeId: row.employeeid || "" })
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

  const handleUpload = async () => { if (!preview) return; setLoading(true); await new Promise(r => setTimeout(r, 800)); onUpload(preview); setLoading(false) }
  const handleDownloadDemo = () => {
    const blob = new Blob([DEMO_CSV_CONTENT], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a"); a.href = url; a.download = "demo-teachers.csv"; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center"><Upload size={14} className="text-sky-600" /></div><h2 className="font-semibold text-slate-800">Bulk Upload (CSV)</h2></div>
        <button onClick={handleDownloadDemo} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"><Download size={12} /> Download Demo CSV</button>
      </div>
      <div onClick={() => fileInputRef.current?.click()} className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${file ? (preview ? "border-emerald-300 bg-emerald-50/50" : "border-amber-300 bg-amber-50/50") : "border-slate-200 hover:border-sky-300 hover:bg-sky-50/50"}`}>
        <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
        {!file ? (<><FileSpreadsheet size={32} className="mx-auto mb-3 text-slate-300" /><p className="text-sm font-medium text-slate-600 mb-1">Drop your CSV file here or click to browse</p><p className="text-xs text-slate-400">Headers: name, email, phone, subjects, qualification, experience, joiningDate, employeeId</p></>)
          : preview ? (<><Check size={32} className="mx-auto mb-3 text-emerald-500" /><p className="text-sm font-medium text-emerald-700">{file.name} — {preview.length} teachers ready</p></>)
            : (<><AlertCircle size={32} className="mx-auto mb-3 text-amber-500" /><p className="text-sm font-medium text-amber-700">{file.name}</p><p className="text-xs text-amber-500">{error}</p></>)}
      </div>
      {preview && (
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-4 py-2 bg-slate-50 border-b flex items-center justify-between"><span className="text-xs font-semibold text-slate-500 uppercase">Preview ({preview.length} rows)</span><button onClick={() => { setFile(null); setPreview(null) }} className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1"><Trash2 size={11} /> Clear</button></div>
          <div className="overflow-x-auto max-h-48"><table className="w-full text-xs"><thead><tr className="border-b border-slate-100">{DEMO_CSV_HEADERS.map(h => <th key={h} className="px-3 py-2 text-left font-semibold text-slate-500 uppercase">{h}</th>)}</tr></thead><tbody>{preview.slice(0, 10).map((row, i) => (<tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50"><td className="px-3 py-2 font-medium text-slate-700">{row.name}</td><td className="px-3 py-2 text-slate-500">{row.email}</td><td className="px-3 py-2">{row.phone}</td><td className="px-3 py-2 text-slate-500">{row.subjects}</td><td className="px-3 py-2">{row.qualification}</td><td className="px-3 py-2">{row.experience}</td><td className="px-3 py-2">{row.joiningDate}</td><td className="px-3 py-2 font-mono text-slate-500">{row.employeeId}</td></tr>))}</tbody></table></div>
        </div>
      )}
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">Cancel</button>
        <button onClick={handleUpload} disabled={!preview || loading} className="px-5 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-50 transition-colors">{loading ? "Uploading..." : <><Upload size={14} /> Upload {preview?.length || 0} Teachers</>}</button>
      </div>
    </div>
  )
}

export default function AddTeacherPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialMode = searchParams.get("mode") === "bulk" ? "bulk" : "single"
  const [mode, setMode] = useState(initialMode)
  const [showSuccess, setShowSuccess] = useState(false)
  const [addedCount, setAddedCount] = useState(0)

  const handleSubmit = (data) => { console.log("Teachers to add:", data); setAddedCount(data.length); setShowSuccess(true) }

  return (
    <div className="max-w-[900px] mx-auto space-y-6">
      {showSuccess && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl text-center p-6">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4"><Check size={28} className="text-emerald-600" /></div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">{addedCount} teacher{addedCount !== 1 ? "s" : ""} added!</h3>
            <p className="text-sm text-slate-500 mb-6">Successfully added to the system</p>
            <div className="flex gap-3">
              <button onClick={() => setShowSuccess(false)} className="flex-1 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">Add More</button>
              <button onClick={() => router.push("/school/teachers")} className="flex-1 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-colors">View All Teachers</button>
            </div>
          </div>
        </div>
      )}
      <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "Teachers", href: "/school/teachers" }, { label: "Add Teacher" }]} />
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"><ArrowLeft size={18} /></button>
        <div><h1 className="text-[22px] font-bold text-slate-800">Add Teachers</h1><p className="text-[13px] text-slate-500">Create a single teacher or upload in bulk via CSV</p></div>
      </div>
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
        {[{ id: "single", label: "Single Entry", icon: Plus }, { id: "bulk", label: "Bulk Upload", icon: Upload }].map(tab => (
          <button key={tab.id} onClick={() => setMode(tab.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === tab.id ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}><tab.icon size={14} />{tab.label}</button>
        ))}
      </div>
      {mode === "single" ? <SingleTeacherForm onSubmit={handleSubmit} onCancel={() => router.back()} /> : <BulkUploadSection onUpload={handleSubmit} onCancel={() => router.back()} />}
    </div>
  )
}