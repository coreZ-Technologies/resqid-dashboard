"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Shield, Check, Loader2, Eye, EyeOff, Mail, Copy } from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"

function generatePassword() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789"
    return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
}

export default function AddSuperAdminPage() {
    const router = useRouter()
    const [step, setStep] = useState(1) // 1=form, 2=generated, 3=done
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [role, setRole] = useState("Admin")
    const [password, setPassword] = useState("")
    const [showPass, setShowPass] = useState(false)
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [sendEmail, setSendEmail] = useState(true)

    const handleGenerate = () => {
        if (!name || !email) return
        setPassword(generatePassword())
        setStep(2)
    }

    const handleSave = async () => {
        setLoading(true)
        await new Promise(r => setTimeout(r, 1000))
        console.log("Super admin created:", { name, email, phone, role, password, sendEmail })
        setLoading(false)
        setStep(3)
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(`Name: ${name}\nEmail: ${email}\nPassword: ${password}`)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    if (step === 3) {
        return (
            <div className="max-w-[500px] mx-auto space-y-6">
                <PageBreadcrumb items={[{ label: "Super Admin", href: "/superadmin" }, { label: "Settings", href: "/superadmin/settings" }, { label: "Admin Accounts", href: "/superadmin/settings/admins" }, { label: "Add Admin" }]} />
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto"><Check size={28} className="text-emerald-600" /></div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">{name} Added!</h3>
                        <p className="text-sm text-slate-500 mt-1">Super admin account created successfully</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 text-left text-sm space-y-2 max-w-sm mx-auto">
                        <p><span className="text-slate-400">Name:</span> <span className="font-semibold">{name}</span></p>
                        <p><span className="text-slate-400">Email:</span> <span className="font-semibold">{email}</span></p>
                        <p><span className="text-slate-400">Role:</span> <span className="font-semibold">{role}</span></p>
                    </div>
                    <div className="flex gap-2 max-w-sm mx-auto">
                        <button onClick={handleCopy} className="flex-1 py-2 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50 flex items-center justify-center gap-2">
                            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}{copied ? "Copied!" : "Copy Details"}
                        </button>
                        <button onClick={() => router.push("/superadmin/settings/admins")} className="flex-1 py-2 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700">View Admins</button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-[600px] mx-auto space-y-6">
            <PageBreadcrumb items={[{ label: "Super Admin", href: "/superadmin" }, { label: "Settings", href: "/superadmin/settings" }, { label: "Admin Accounts", href: "/superadmin/settings/admins" }, { label: "Add Admin" }]} />

            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"><ArrowLeft size={18} /></button>
                <div><h1 className="text-[22px] font-bold text-slate-800">Add Super Admin</h1><p className="text-[13px] text-slate-500">Create a new platform admin account</p></div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center"><Shield size={14} className="text-red-600" /></div>
                    <h2 className="font-semibold text-slate-800">Account Details</h2>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name *</label>
                    <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Priya Sharma"
                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 transition-all" />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email *</label>
                    <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="priya@corez.in"
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
                        <option value="Super Admin">Super Admin (Full Access)</option>
                        <option value="Admin">Admin (Limited Access)</option>
                        <option value="Support">Support (Read-only)</option>
                    </select>
                    <p className="text-xs text-slate-400 mt-1">Super Admin has unrestricted access to all platform features.</p>
                </div>

                {/* Generated Password */}
                {step === 2 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
                        <div className="flex items-center gap-2"><Shield size={16} className="text-amber-600" /><p className="text-sm font-semibold text-amber-800">Auto-Generated Password</p></div>
                        <div className="flex items-center gap-2 bg-white rounded-lg p-2.5 border border-amber-200">
                            <span className="font-mono text-lg font-bold text-slate-800 flex-1">{showPass ? password : "••••••••••••"}</span>
                            <button onClick={() => setShowPass(!showPass)} className="p-1.5 rounded hover:bg-slate-100">{showPass ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                        </div>
                        <label className="flex items-center gap-2 text-sm text-amber-700">
                            <input type="checkbox" checked={sendEmail} onChange={e => setSendEmail(e.target.checked)} className="accent-violet-600" />
                            <Mail size={14} /> Send welcome email with credentials
                        </label>
                    </div>
                )}
            </div>

            {/* Actions */}
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