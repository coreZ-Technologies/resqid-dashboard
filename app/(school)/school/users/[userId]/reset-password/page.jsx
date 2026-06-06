"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Key, Check, Loader2, Eye, EyeOff } from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"

const MOCK_USERS = [
    { id: "u1", name: "Animesh Karan", email: "animesh@springdale.in", role: "Super Admin" },
    { id: "u2", name: "Dr. Meera Shah", email: "meera@springdale.in", role: "School Admin" },
    { id: "u3", name: "Mr. Suresh Kumar", email: "suresh@springdale.in", role: "Teacher" },
]

export default function ResetPasswordPage() {
    const router = useRouter()
    const params = useParams()
    const userId = params.userId

    const [user, setUser] = useState(null)
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPass, setShowPass] = useState(false)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        const found = MOCK_USERS.find(u => u.id === userId)
        if (found) setUser(found)
    }, [userId])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        if (!password || password.length < 6) { setError("Password must be at least 6 characters"); return }
        if (password !== confirmPassword) { setError("Passwords do not match"); return }
        setLoading(true)
        await new Promise(r => setTimeout(r, 1000))
        console.log("Password reset for:", user?.email)
        setLoading(false)
        setSuccess(true)
    }

    if (success) {
        return (
            <div className="max-w-[500px] mx-auto space-y-6">
                <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "Users", href: "/school/users" }, { label: "Reset Password" }]} />
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto"><Check size={28} className="text-emerald-600" /></div>
                    <div><h3 className="text-lg font-bold text-slate-800">Password Reset!</h3><p className="text-sm text-slate-500">A reset link has been sent to {user?.email}</p></div>
                    <button onClick={() => router.push("/school/users")} className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700">Back to Users</button>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-[500px] mx-auto space-y-6">
            <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "Users", href: "/school/users" }, { label: "Reset Password" }]} />

            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"><ArrowLeft size={18} /></button>
                <div>
                    <h1 className="text-[22px] font-bold text-slate-800">Reset Password</h1>
                    <p className="text-[13px] text-slate-500">{user?.name} · {user?.email}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center"><Key size={14} className="text-amber-600" /></div>
                    <h2 className="font-semibold text-slate-800">Set New Password</h2>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">New Password *</label>
                    <div className="relative">
                        <input value={password} onChange={e => setPassword(e.target.value)}
                            type={showPass ? "text" : "password"} placeholder="Min 6 characters"
                            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 pr-10 text-sm outline-none focus:border-violet-500 transition-all" />
                        <button type="button" onClick={() => setShowPass(p => !p)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                            {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm Password *</label>
                    <input value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                        type="password" placeholder="Re-enter password"
                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 transition-all" />
                </div>

                {error && <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>}

                <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={() => router.back()} className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50">Cancel</button>
                    <button type="submit" disabled={!password || !confirmPassword || loading}
                        className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-50 transition-colors">
                        {loading ? <Loader2 size={14} className="animate-spin" /> : <Key size={14} />} Reset Password
                    </button>
                </div>
            </form>
        </div>
    )
}