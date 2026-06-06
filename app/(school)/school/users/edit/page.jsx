"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Check, Loader2, Shield, X } from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"

const MOCK_USERS = [
    { id: "u1", name: "Animesh Karan", email: "animesh@springdale.in", phone: "+91 98765 43210", role: "Super Admin", status: "Active" },
    { id: "u2", name: "Dr. Meera Shah", email: "meera@springdale.in", phone: "+91 97654 32109", role: "School Admin", status: "Active" },
    { id: "u3", name: "Mr. Suresh Kumar", email: "suresh@springdale.in", phone: "+91 96543 21098", role: "Teacher", status: "Active" },
    { id: "u4", name: "Ms. Priya Nair", email: "priya@springdale.in", phone: "+91 95432 10987", role: "Teacher", status: "Active" },
    { id: "u5", name: "Ms. Sunita Roy", email: "sunita@springdale.in", phone: "+91 94321 09876", role: "Teacher", status: "Inactive" },
    { id: "u6", name: "Ramesh Verma", email: "ramesh@springdale.in", phone: "+91 93210 98765", role: "Staff", status: "Active" },
    { id: "u7", name: "Kavitha Reddy", email: "kavitha@springdale.in", phone: "+91 92109 87654", role: "Staff", status: "Suspended" },
]

export default function EditUserPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const userId = searchParams.get("id")

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [notFound, setNotFound] = useState(false)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [role, setRole] = useState("Teacher")
    const [status, setStatus] = useState("Active")
    const [user, setUser] = useState(null)

    useEffect(() => {
        setTimeout(() => {
            const found = MOCK_USERS.find(u => u.id === userId)
            if (found) {
                setUser(found)
                setName(found.name)
                setEmail(found.email)
                setPhone(found.phone)
                setRole(found.role)
                setStatus(found.status)
            } else {
                setNotFound(true)
            }
            setLoading(false)
        }, 400)
    }, [userId])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!name || !email) return
        setSaving(true)
        await new Promise(r => setTimeout(r, 800))
        console.log("Updated:", { id: userId, name, email, phone, role, status })
        setSaving(false)
        router.push("/school/users")
    }

    const isSuperAdmin = user?.role === "Super Admin"

    if (!loading && notFound) {
        return (
            <div className="max-w-[600px] mx-auto space-y-6">
                <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "Users", href: "/school/users" }, { label: "Not Found" }]} />
                <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
                    <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4"><X size={24} className="text-slate-400" /></div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">User not found</h3>
                    <button onClick={() => router.push("/school/users")} className="px-5 py-2.5 rounded-lg bg-violet-600 text-white text-sm font-semibold">Back to Users</button>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="max-w-[500px] mx-auto space-y-6">
                <div className="h-5 w-32 bg-slate-200 rounded animate-pulse" />
                <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 animate-pulse">
                    {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-10 bg-slate-100 rounded-lg" />)}
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-[500px] mx-auto space-y-6">
            <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "Users", href: "/school/users" }, { label: `Edit ${name}` }]} />

            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"><ArrowLeft size={18} /></button>
                <div><h1 className="text-[22px] font-bold text-slate-800">Edit {name}</h1><p className="text-[13px] text-slate-500">{user.email}</p></div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center"><Shield size={14} className="text-violet-600" /></div>
                    <h2 className="font-semibold text-slate-800">Account Details</h2>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name *</label>
                    <input value={name} onChange={e => setName(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 transition-all" />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email *</label>
                    <input value={email} onChange={e => setEmail(e.target.value)} type="email"
                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 transition-all" />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone</label>
                    <input value={phone} onChange={e => setPhone(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Role</label>
                        <select value={role} onChange={e => setRole(e.target.value)} disabled={isSuperAdmin}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 bg-white disabled:bg-slate-50 disabled:text-slate-400">
                            {["Super Admin", "School Admin", "Teacher", "Staff"].map(r => <option key={r}>{r}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Status</label>
                        <select value={status} onChange={e => setStatus(e.target.value)} disabled={isSuperAdmin}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 bg-white disabled:bg-slate-50 disabled:text-slate-400">
                            {["Active", "Inactive", "Suspended"].map(s => <option key={s}>{s}</option>)}
                        </select>
                    </div>
                </div>

                <div className="flex justify-between pt-2">
                    <button type="button" onClick={() => router.push(`/school/users/${userId}/reset-password`)}
                        className="px-4 py-2 rounded-lg border border-amber-200 bg-amber-50 text-amber-700 text-sm font-medium hover:bg-amber-100 transition-colors">Reset Password</button>
                    <div className="flex gap-3">
                        <button type="button" onClick={() => router.back()} className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50">Cancel</button>
                        <button type="submit" disabled={!name || !email || saving}
                            className="px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-50 transition-colors">
                            {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Save Changes
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}