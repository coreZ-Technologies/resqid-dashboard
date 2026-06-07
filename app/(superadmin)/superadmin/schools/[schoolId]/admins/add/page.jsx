"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Shield, Check, Loader2, Eye, EyeOff, Mail } from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import { MOCK_SCHOOLS } from "@/lib/mock-data"

function generatePassword() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789"
    return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
}

export default function AddSchoolAdminPage() {
    const router = useRouter()
    const params = useParams()
    const schoolId = params.schoolId

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [role, setRole] = useState("School Admin")
    const [password, setPassword] = useState("")
    const [showPass, setShowPass] = useState(false)
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState(1)
    const [sendEmail, setSendEmail] = useState(true)

    const school = MOCK_SCHOOLS.find(s => s.id === schoolId)

    const handleGenerate = () => {
        if (!name || !email) return
        setPassword(generatePassword())
        setStep(2)
    }

    const handleSave = async () => {
        setLoading(true)
        await new Promise(r => setTimeout(r, 800))
        console.log("Admin created:", { name, email, phone, role, password, sendEmail })
        setLoading(false)
        router.push(`/superadmin/schools/${schoolId}/admins`)
    }

    return (
        <div className="max-w-[600px] mx-auto space-y-6">
            <PageBreadcrumb items={[{ label: "Super Admin", href: "/superadmin" }, { label: "Schools", href: "/superadmin/schools" }, { label: school?.name || "School", href: `/superadmin/schools/${schoolId}` }, { label: "Admins", href: `/superadmin/schools/${schoolId}/admins` }, { label: "Add Admin" }]} />

            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"><ArrowLeft size={18} /></button>
                <div><h1 className="text-[22px] font-bold text-slate-800">Add Admin</h1><p className="text-[13px] text-slate-500">{school?.name}</p></div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center"><Shield size={14} className="text-violet-600" /></div>
                    <h2 className="font-semibold text-slate-800">Admin Details</h2>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name *</label>
                    <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Dr. Meera Shah"
                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 transition-all" />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email *</label>
                    <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="admin@school.edu.in"
                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 transition-all" />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone</label>
                    <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210"
                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 transition-all" />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Role</label>
                    <select value={role} onChange={e => setRole(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 bg-white">
                        {["School Admin", "Teacher", "Staff"].map(r => <option key={r}>{r}</option>)}
                    </select>
                </div>

                {step === 2 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
                        <p className="text-sm font-semibold text-amber-800">Auto-Generated Password</p>
                        <div className="flex items-center gap-2 bg-white rounded-lg p-2.5 border border-amber-200">
                            <span className="font-mono text-lg font-bold text-slate-800 flex-1">{showPass ? password : "••••••••••"}</span>
                            <button onClick={() => setShowPass(!showPass)} className="p-1.5 rounded hover:bg-slate-100">{showPass ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                        </div>
                        <label className="flex items-center gap-2 text-sm text-amber-700">
                            <input type="checkbox" checked={sendEmail} onChange={e => setSendEmail(e.target.checked)} className="accent-violet-600" />
                            <Mail size={14} /> Send welcome email with credentials
                        </label>
                    </div>
                )}
            </div>

            <div className="flex justify-end gap-3">
                <button onClick={() => router.back()} className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50">Cancel</button>
                {step === 1 ? (
                    <button onClick={handleGenerate} disabled={!name || !email}
                        className="px-5 py-2 rounded-lg bg-violet-600 text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-50 hover:bg-violet-700">
                        Generate Credentials
                    </button>
                ) : (
                    <button onClick={handleSave} disabled={loading}
                        className="px-5 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-50 hover:bg-emerald-700">
                        {loading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                        Create Admin
                    </button>
                )}
            </div>
        </div>
    )
}