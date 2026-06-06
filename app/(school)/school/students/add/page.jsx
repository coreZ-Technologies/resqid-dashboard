"use client"

import { useState, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Plus, Upload, Download, Check, ArrowLeft, AlertCircle,
  FileSpreadsheet, Trash2, User, GraduationCap, Users, Heart,
  ChevronLeft, ChevronRight, X, Loader2
} from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { cn } from "@/lib/utils"

const CLASSES = ['Nursery', 'LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
const SECTIONS = ['A', 'B', 'C', 'D']
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']
const RELATIONS = ['Father', 'Mother', 'Guardian', 'Other']

const STEPS = [
  { id: 1, label: 'Personal', icon: User },
  { id: 2, label: 'Academic', icon: GraduationCap },
  { id: 3, label: 'Parents', icon: Users },
  { id: 4, label: 'Medical', icon: Heart },
]

const INITIAL_FORM = {
  firstName: '', lastName: '', gender: 'MALE', dob: '', bloodGroup: '',
  cls: '', section: '', roll: '',
  email: '', phone: '', address: '', city: '', state: '', pin: '',
  parent1Name: '', parent1Relation: 'Father', parent1Phone: '', parent1Email: '',
  parent2Name: '', parent2Relation: 'Mother', parent2Phone: '', parent2Email: '',
  emergencyName: '', emergencyPhone: '', emergencyRelation: '',
  allergies: '', conditions: '', medications: '', doctorName: '', doctorPhone: '',
}

// ─── Bulk Upload Demo CSV ─────────────────────────────────────────────────────
const DEMO_CSV_CONTENT = `firstName,lastName,gender,dateOfBirth,class,section,parent1Name,parent1Phone
Aarav,Sharma,MALE,2010-05-15,10,A,Rajesh Sharma,9876543210
Ananya,Patel,FEMALE,2011-03-22,9,B,Priya Patel,9876543211`

const DEMO_CSV_HEADERS = ["firstName", "lastName", "gender", "dateOfBirth", "class", "section", "parent1Name", "parent1Phone"]

// ─── Single Student Form ──────────────────────────────────────────────────────
function SingleStudentForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const f = (key) => (val) => setForm(p => ({ ...p, [key]: val }))

  const validate = (s) => {
    const e = {}
    if (s === 1) { if (!form.firstName.trim()) e.firstName = 'Required'; if (!form.lastName.trim()) e.lastName = 'Required'; if (!form.dob) e.dob = 'Required' }
    if (s === 2) { if (!form.cls) e.cls = 'Required'; if (!form.section) e.section = 'Required' }
    if (s === 3) { if (!form.parent1Name.trim()) e.parent1Name = 'Required'; if (!form.parent1Phone.trim()) e.parent1Phone = 'Required' }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => { if (validate(step)) setStep(s => Math.min(s + 1, 4)) }
  const prev = () => { setStep(s => Math.max(s - 1, 1)); setErrors({}) }

  const handleSubmit = async () => {
    if (!validate(4)) return
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1500))
    console.log("Student added:", form)
    setSubmitting(false)
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto"><Check size={28} className="text-emerald-600" /></div>
        <div>
          <h3 className="text-lg font-bold text-slate-800">{form.firstName} {form.lastName} added!</h3>
          <p className="text-sm text-slate-500">Student successfully enrolled</p>
        </div>
        <div className="flex justify-center gap-3">
          <button onClick={() => { setForm(INITIAL_FORM); setStep(1); setSuccess(false) }}
            className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50">Add Another</button>
          <button onClick={() => router.push("/school/students")}
            className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700">View Students</button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Step Indicator */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <div className="flex items-center justify-between">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div className="flex items-center gap-2">
                <div className={cn("w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold",
                  step > s.id ? "bg-emerald-100 text-emerald-600" :
                    step === s.id ? "bg-violet-100 text-violet-600" : "bg-slate-100 text-slate-400")}>
                  {step > s.id ? <Check size={16} /> : <s.icon size={16} />}
                </div>
                <span className={cn("text-sm font-semibold hidden sm:block",
                  step === s.id ? "text-violet-700" : "text-slate-400")}>{s.label}</span>
              </div>
              {i < STEPS.length - 1 && <div className="w-8 h-px bg-slate-200 mx-2" />}
            </div>
          ))}
        </div>
        <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
          <div className="h-full bg-violet-500 rounded-full transition-all" style={{ width: `${(step / 4) * 100}%` }} />
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2"><User size={18} className="text-violet-500" /> Personal Info</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="First Name *" value={form.firstName} onChange={f('firstName')} error={errors.firstName} />
              <Field label="Last Name *" value={form.lastName} onChange={f('lastName')} error={errors.lastName} />
              <Field label="Gender" type="select" value={form.gender} onChange={f('gender')} options={[{ v: 'MALE', l: 'Male' }, { v: 'FEMALE', l: 'Female' }, { v: 'OTHER', l: 'Other' }]} />
              <Field label="Date of Birth *" type="date" value={form.dob} onChange={f('dob')} error={errors.dob} />
              <Field label="Blood Group" type="select" value={form.bloodGroup} onChange={f('bloodGroup')} options={[{ v: '', l: 'Select' }, ...BLOOD_GROUPS.map(b => ({ v: b, l: b }))]} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2"><GraduationCap size={18} className="text-violet-500" /> Academic Info</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Class *" type="select" value={form.cls} onChange={f('cls')} error={errors.cls} options={[{ v: '', l: 'Select Class' }, ...CLASSES.map(c => ({ v: c, l: c }))]} />
              <Field label="Section *" type="select" value={form.section} onChange={f('section')} error={errors.section} options={[{ v: '', l: 'Select Section' }, ...SECTIONS.map(s => ({ v: s, l: s }))]} />
              <Field label="Roll Number" value={form.roll} onChange={f('roll')} />
              <Field label="Email" type="email" value={form.email} onChange={f('email')} />
              <Field label="Phone" value={form.phone} onChange={f('phone')} />
              <Field label="Address" value={form.address} onChange={f('address')} className="sm:col-span-2" />
              <Field label="City" value={form.city} onChange={f('city')} />
              <Field label="State" value={form.state} onChange={f('state')} />
              <Field label="Pincode" value={form.pin} onChange={f('pin')} />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2"><Users size={18} className="text-violet-500" /> Parent Info</h2>
            <div className="p-4 rounded-lg border border-violet-100 bg-violet-50/30 space-y-3">
              <p className="text-sm font-semibold text-violet-700">Primary Parent *</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Name *" value={form.parent1Name} onChange={f('parent1Name')} error={errors.parent1Name} />
                <Field label="Phone *" value={form.parent1Phone} onChange={f('parent1Phone')} error={errors.parent1Phone} />
                <Field label="Email" type="email" value={form.parent1Email} onChange={f('parent1Email')} />
                <Field label="Relation" type="select" value={form.parent1Relation} onChange={f('parent1Relation')} options={RELATIONS.map(r => ({ v: r, l: r }))} />
              </div>
            </div>
            <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-3">
              <p className="text-sm font-semibold text-slate-600">Second Parent (Optional)</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Name" value={form.parent2Name} onChange={f('parent2Name')} />
                <Field label="Phone" value={form.parent2Phone} onChange={f('parent2Phone')} />
                <Field label="Email" type="email" value={form.parent2Email} onChange={f('parent2Email')} />
                <Field label="Relation" type="select" value={form.parent2Relation} onChange={f('parent2Relation')} options={RELATIONS.map(r => ({ v: r, l: r }))} />
              </div>
            </div>
            <div className="p-4 rounded-lg border border-red-200 bg-red-50/30 space-y-3">
              <p className="text-sm font-semibold text-red-700">Emergency Contact</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Name" value={form.emergencyName} onChange={f('emergencyName')} />
                <Field label="Phone" value={form.emergencyPhone} onChange={f('emergencyPhone')} />
                <Field label="Relation" value={form.emergencyRelation} onChange={f('emergencyRelation')} />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2"><Heart size={18} className="text-red-500" /> Medical Info <span className="text-xs text-slate-400 font-normal">(Optional)</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Allergies" value={form.allergies} onChange={f('allergies')} />
              <Field label="Medical Conditions" value={form.conditions} onChange={f('conditions')} />
              <Field label="Medications" value={form.medications} onChange={f('medications')} />
              <Field label="Doctor Name" value={form.doctorName} onChange={f('doctorName')} />
              <Field label="Doctor Phone" value={form.doctorPhone} onChange={f('doctorPhone')} />
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-6 pt-5 border-t border-slate-100">
          <button onClick={prev} disabled={step === 1}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors">
            <ChevronLeft size={14} /> Previous
          </button>
          {step < 4 ? (
            <button onClick={next}
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors">
              Next <ChevronRight size={14} />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting}
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 disabled:opacity-50 transition-colors">
              {submitting ? <><Loader2 size={14} className="animate-spin" /> Adding...</> : <><Check size={14} /> Add Student</>}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Field Component ──────────────────────────────────────────────────────────
function Field({ label, type = 'text', value, onChange, placeholder, required, error, options, className }) {
  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
      {type === 'select' ? (
        <select value={value} onChange={e => onChange(e.target.value)}
          className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all bg-white">
          {options.map(o => <option key={o.v ?? o} value={o.v ?? o}>{o.l ?? o}</option>)}
        </select>
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all" />
      )}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

// ─── Bulk Upload ──────────────────────────────────────────────────────────────
function BulkUploadSection() {
  const fileRef = useRef(null)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const parseCSV = (text) => {
    const lines = text.trim().split("\n")
    if (lines.length < 2) { setError("File must contain a header row and at least one data row"); return }
    const headers = lines[0].split(",").map(h => h.trim().toLowerCase())
    const required = ["firstname", "lastname", "class", "section", "parent1name", "parent1phone"]
    const missing = required.filter(h => !headers.includes(h))
    if (missing.length > 0) { setError(`Missing columns: ${missing.join(", ")}`); return }
    const data = []
    for (let i = 1; i < lines.length; i++) {
      const vals = lines[i].split(",").map(v => v.trim().replace(/"/g, ""))
      const row = {}; headers.forEach((h, idx) => { row[h] = vals[idx] || "" })
      data.push(row)
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
    await new Promise(r => setTimeout(r, 1500))
    console.log("Imported:", preview.length, "students")
    setLoading(false)
  }

  const handleDownloadDemo = () => {
    const blob = new Blob([DEMO_CSV_CONTENT], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a"); a.href = url; a.download = "demo-students.csv"; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center"><Upload size={14} className="text-sky-600" /></div>
          <h2 className="font-semibold text-slate-800">Bulk Upload (CSV)</h2>
        </div>
        <button onClick={handleDownloadDemo} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-500 hover:bg-slate-50 transition-colors">
          <Download size={12} /> Download Demo CSV
        </button>
      </div>

      <div onClick={() => fileRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${file ? (preview ? "border-emerald-300 bg-emerald-50/50" : "border-amber-300 bg-amber-50/50") : "border-slate-200 hover:border-sky-300 hover:bg-sky-50/50"}`}>
        <input ref={fileRef} type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
        {!file ? (
          <><FileSpreadsheet size={32} className="mx-auto mb-3 text-slate-300" />
            <p className="text-sm font-medium text-slate-600 mb-1">Drop your CSV file here or click to browse</p>
            <p className="text-xs text-slate-400">Required: firstName, lastName, class, section, parent1Name, parent1Phone</p></>
        ) : preview ? (
          <><Check size={32} className="mx-auto mb-3 text-emerald-500" />
            <p className="text-sm font-medium text-emerald-700">{file.name} — {preview.length} students ready</p></>
        ) : (
          <><AlertCircle size={32} className="mx-auto mb-3 text-amber-500" />
            <p className="text-sm font-medium text-amber-700">{file.name}</p><p className="text-xs text-amber-500">{error}</p></>
        )}
      </div>

      {preview && (
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-4 py-2 bg-slate-50 border-b flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Preview ({preview.length} rows)</span>
            <button onClick={() => { setFile(null); setPreview(null) }} className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1"><Trash2 size={11} /> Clear</button>
          </div>
          <div className="overflow-x-auto max-h-48">
            <table className="w-full text-xs">
              <thead><tr className="border-b border-slate-100">{DEMO_CSV_HEADERS.map(h => <th key={h} className="px-3 py-2 text-left font-semibold text-slate-500 uppercase">{h}</th>)}</tr></thead>
              <tbody>{preview.slice(0, 10).map((row, i) => <tr key={i} className="border-b border-slate-50">{DEMO_CSV_HEADERS.map(h => <td key={h} className="px-3 py-2 text-slate-700">{row[h.toLowerCase()] || "—"}</td>)}</tr>)}</tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button onClick={handleUpload} disabled={!preview || loading}
          className="px-5 py-2 rounded-lg bg-sky-600 text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-50 hover:bg-sky-700 transition-colors">
          {loading ? <><Loader2 size={14} className="animate-spin" /> Importing...</> : <><Upload size={14} /> Import {preview?.length || 0} Students</>}
        </button>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AddStudentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialMode = searchParams.get("mode") === "bulk" ? "bulk" : "single"
  const [mode, setMode] = useState(initialMode)

  return (
    <div className="max-w-[900px] mx-auto space-y-6">
      <PageBreadcrumb items={[
        { label: "Dashboard", href: "/school" },
        { label: "Students", href: "/school/students" },
        { label: "Add Student" },
      ]} />

      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"><ArrowLeft size={18} /></button>
        <div>
          <h1 className="text-[22px] font-bold text-slate-800">Add Students</h1>
          <p className="text-[13px] text-slate-500">Add a single student or import multiple via CSV</p>
        </div>
      </div>

      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
        {[
          { id: "single", label: "Single Entry", icon: Plus },
          { id: "bulk", label: "Bulk Upload", icon: Upload },
        ].map(tab => (
          <button key={tab.id} onClick={() => setMode(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === tab.id ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
            <tab.icon size={14} />{tab.label}
          </button>
        ))}
      </div>

      {mode === "single" ? <SingleStudentForm /> : <BulkUploadSection />}
    </div>
  )
}