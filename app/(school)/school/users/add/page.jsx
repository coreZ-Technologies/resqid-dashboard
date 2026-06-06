"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, Loader2, Eye, EyeOff, Shield } from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"

export default function AddUserPage() {
    const router = useRouter()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [role, setRole] = useState("Teacher")
    const [password, setPassword] = useState("")
    const [showPass, setShowPass] = useState(false)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!name || !email || !password) return
        setLoading(true)
        await new Promise(r => setTimeout(r, 1000))
        console.log("New user:", { name, email, phone, role })
        setLoading(false)
        setSuccess(true)
    }

    if (success) {
        return (
            <div className="max-w-[500px] mx-auto space-y-6">
                <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "Users", href: "/school/users" }, { label: "Add User" }]} />
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto"><Check size={28} className="text-emerald-600" /></div>
                    <div><h3 className="text-lg font-bold text-slate-800">User Added!</h3><p className="text-sm text-slate-500">{name} has been added as {role}</p></div>
                    <div className="flex justify-center gap-3">
                        <button onClick={() => { setName(""); setEmail(""); setPhone(""); setPassword(""); setSuccess(false) }} className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50">Add Another</button>
                        <button onClick={() => router.push("/school/users")} className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700">View Users</button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-[500px] mx-auto space-y-6">
            <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "Users", href: "/school/users" }, { label: "Add User" }]} />

            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"><ArrowLeft size={18} /></button>
                <div><h1 className="text-[22px] font-bold text-slate-800">Add User</h1><p className="text-[13px] text-slate-500">Create a new staff or admin account</p></div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center"><Shield size={14} className="text-violet-600" /></div>
                    <h2 className="font-semibold text-slate-800">Account Details</h2>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name *</label>
                    <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Mr. Rajesh Kumar"
                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 transition-all" />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email *</label>
                    <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="email@school.in"
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
                    <p className="text-xs text-slate-400 mt-1">Super Admin cannot be created — only one per school.</p>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Initial Password *</label>
                    <div className="relative">
                        <input value={password} onChange={e => setPassword(e.target.value)}
                            type={showPass ? "text" : "password"} placeholder="Set a temporary password"
                            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 pr-10 text-sm outline-none focus:border-violet-500 transition-all" />
                        <button type="button" onClick={() => setShowPass(p => !p)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                            {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">User will be prompted to change on first login.</p>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={() => router.back()} className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50">Cancel</button>
                    <button type="submit" disabled={!name || !email || !password || loading}
                        className="px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-50 transition-colors">
                        {loading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Add User
                    </button>
                </div>
            </form>
        </div>
    )
}