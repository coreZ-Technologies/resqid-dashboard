"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Building2, UserCheck, Check, Loader2, Mail, Eye, EyeOff, Copy } from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import { cn } from "@/lib/utils"

function generatePassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789"
  return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
}

export default function AddSchoolPage() {
  const router = useRouter()
  const [step, setStep] = useState(1) // 1=form, 2=generated, 3=done
  const [name, setName] = useState("")
  const [board, setBoard] = useState("CBSE")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [plan, setPlan] = useState("safety_bundle")
  const [adminName, setAdminName] = useState("")
  const [adminEmail, setAdminEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [generatedPassword, setGeneratedPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleGenerate = () => {
    if (!name || !email || !adminName || !adminEmail) return
    setGeneratedPassword(generatePassword())
    setStep(2)
  }

  const handleConfirm = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    // In real app: POST /api/superadmin/schools with all data + send welcome email
    console.log("School created:", { name, board, city, state, email, phone, plan })
    console.log("Admin created:", { adminName, adminEmail, password: generatedPassword })
    console.log("Welcome email sent to:", adminEmail)
    setLoading(false)
    setStep(3)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(`School: ${name}\nAdmin Email: ${adminEmail}\nPassword: ${generatedPassword}\nURL: https://resqid.com/school/login`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSendWelcomeEmail = () => {
    console.log("Resending welcome email to:", adminEmail)
  }

  if (step === 3) {
    return (
      <div className="max-w-[600px] mx-auto space-y-6">
        <PageBreadcrumb items={[{ label: "Super Admin", href: "/superadmin" }, { label: "Schools", href: "/superadmin/schools" }, { label: "Add School" }]} />
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto"><Check size={28} className="text-emerald-600" /></div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">{name} is Live!</h3>
            <p className="text-sm text-slate-500 mt-1">School created and admin account ready</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 text-left text-sm space-y-2 max-w-sm mx-auto">
            <p><span className="text-slate-400">School:</span> <span className="font-semibold">{name}</span></p>
            <p><span className="text-slate-400">Admin:</span> <span className="font-semibold">{adminName}</span></p>
            <p><span className="text-slate-400">Email:</span> <span className="font-semibold">{adminEmail}</span></p>
            <p><span className="text-slate-400">Password:</span> <span className="font-mono font-semibold">{generatedPassword}</span></p>
          </div>
          <div className="flex flex-col gap-2 max-w-sm mx-auto">
            <button onClick={handleCopy} className="w-full py-2 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50 flex items-center justify-center gap-2">
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}{copied ? "Copied!" : "Copy Credentials"}
            </button>
            <button onClick={handleSendWelcomeEmail} className="w-full py-2 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 flex items-center justify-center gap-2">
              <Mail size={14} /> Resend Welcome Email
            </button>
            <button onClick={() => router.push("/superadmin/schools")} className="w-full py-2 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50">View All Schools</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[700px] mx-auto space-y-6">
      <PageBreadcrumb items={[{ label: "Super Admin", href: "/superadmin" }, { label: "Schools", href: "/superadmin/schools" }, { label: "Add School" }]} />
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"><ArrowLeft size={18} /></button>
        <div><h1 className="text-[22px] font-bold text-slate-800">Onboard New School</h1><p className="text-[13px] text-slate-500">Create school + admin account + send welcome email</p></div>
      </div>

      {/* School Details */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center"><Building2 size={14} className="text-blue-600" /></div>
          <h2 className="font-semibold text-slate-800">School Details</h2>
        </div>
        <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">School Name *</label><input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Springdale Public School" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Board</label><select value={board} onChange={e => setBoard(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 bg-white">{["CBSE", "ICSE", "State Board", "IB", "Cambridge"].map(b => <option key={b}>{b}</option>)}</select></div>
          <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Plan</label><select value={plan} onChange={e => setPlan(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 bg-white">{[
            { v: "module_emergency", l: "Emergency (₹2,999/mo)" }, { v: "module_attendance", l: "Attendance (₹3,999/mo)" }, { v: "safety_bundle", l: "Safety Bundle (₹4,999/mo)" }, { v: "resqid_complete", l: "Complete (₹7,999/mo)" }
          ].map(p => <option key={p.v} value={p.v}>{p.l}</option>)}</select></div>
          <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">City</label><input value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. Kolkata" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500" /></div>
          <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">State</label><input value={state} onChange={e => setState(e.target.value)} placeholder="e.g. West Bengal" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500" /></div>
          <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">School Email *</label><input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="info@school.edu.in" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500" /></div>
          <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone</label><input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 33 2456 7890" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500" /></div>
        </div>
      </div>

      {/* Admin Account */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center"><UserCheck size={14} className="text-violet-600" /></div>
          <h2 className="font-semibold text-slate-800">School Admin Account</h2>
        </div>
        <p className="text-xs text-slate-500">This person will be the primary administrator for this school.</p>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Admin Name *</label><input value={adminName} onChange={e => setAdminName(e.target.value)} placeholder="e.g. Dr. Animesh Karan" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500" /></div>
          <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Admin Email *</label><input value={adminEmail} onChange={e => setAdminEmail(e.target.value)} type="email" placeholder="admin@school.edu.in" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500" /></div>
        </div>
      </div>

      {/* Generated Password (Step 2) */}
      {step === 2 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2"><Check size={18} className="text-emerald-600" /><h3 className="font-semibold text-emerald-800">Credentials Generated</h3></div>
          <p className="text-sm text-emerald-700">Auto-generated password for {adminEmail}:</p>
          <div className="flex items-center gap-2 bg-white rounded-lg p-3 border border-emerald-200">
            <span className="font-mono text-lg font-bold text-slate-800 flex-1">{showPassword ? generatedPassword : "••••••••••"}</span>
            <button onClick={() => setShowPassword(!showPassword)} className="p-1.5 rounded hover:bg-slate-100">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
            <button onClick={() => { navigator.clipboard.writeText(generatedPassword); setCopied(true); setTimeout(() => setCopied(false), 2000) }} className="p-1.5 rounded hover:bg-slate-100">{copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}</button>
          </div>
          <p className="text-xs text-emerald-600">A welcome email with login details will be sent to the admin.</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button onClick={() => router.back()} className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50">Cancel</button>
        {step === 1 ? (
          <button onClick={handleGenerate} disabled={!name || !email || !adminName || !adminEmail}
            className="px-5 py-2 rounded-lg bg-violet-600 text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-50 hover:bg-violet-700">
            Generate Credentials
          </button>
        ) : (
          <button onClick={handleConfirm} disabled={loading}
            className="px-5 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-50 hover:bg-emerald-700">
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
            Create School & Send Welcome
          </button>
        )}
      </div>
    </div>
  )
}