"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Mail, Phone, Shield, Calendar, Key, Activity, X } from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { cn } from "@/lib/utils"

const MOCK_USERS_DETAIL = {
    "u1": { id: "u1", name: "Animesh Karan", email: "animesh@springdale.in", phone: "+91 98765 43210", role: "Super Admin", status: "Active", avatar: "AK", color: "bg-indigo-500", lastLogin: "Just now", joined: "2024-01-15", permissions: ["emergency", "attendance", "timetable", "communication"] },
    "u3": { id: "u3", name: "Mr. Suresh Kumar", email: "suresh@springdale.in", phone: "+91 96543 21098", role: "Teacher", status: "Active", avatar: "SK", color: "bg-blue-500", lastLogin: "5h ago", joined: "2024-03-01", permissions: ["attendance", "timetable"] },
}

export default function UserDetailPage() {
    const router = useRouter()
    const params = useParams()
    const userId = params.userId

    const [user, setUser] = useState(null)
    const [notFound, setNotFound] = useState(false)

    useEffect(() => {
        const found = MOCK_USERS_DETAIL[userId]
        if (found) setUser(found)
        else setNotFound(true)
    }, [userId])

    if (notFound) {
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

    if (!user) return null

    return (
        <div className="max-w-[700px] mx-auto space-y-6">
            <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "Users", href: "/school/users" }, { label: user.name }]} />

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"><ArrowLeft size={18} /></button>
                    <div className="flex items-center gap-3">
                        <div className={`w-14 h-14 rounded-xl ${user.color} flex items-center justify-center text-white font-bold text-xl`}>{user.avatar}</div>
                        <div>
                            <h1 className="text-[22px] font-bold text-slate-800">{user.name}</h1>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs text-slate-400">{user.role}</span>
                                <StatusBadge status={user.status === "Active" ? "active" : "inactive"} size="sm" label={user.status} />
                            </div>
                        </div>
                    </div>
                </div>
                <button onClick={() => router.push(`/school/users/${user.id}/reset-password`)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 text-sm font-medium hover:bg-amber-100 transition-colors"><Key size={15} />Reset Password</button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
                <h2 className="font-semibold text-slate-800">Account Information</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    {[
                        { icon: Mail, label: "Email", value: user.email },
                        { icon: Phone, label: "Phone", value: user.phone },
                        { icon: Shield, label: "Role", value: user.role },
                        { icon: Calendar, label: "Joined", value: user.joined },
                        { icon: Activity, label: "Last Login", value: user.lastLogin },
                    ].map(r => (
                        <div key={r.label} className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center"><r.icon size={16} className="text-slate-500" /></div>
                            <div><p className="text-xs text-slate-400 uppercase">{r.label}</p><p className="font-medium text-slate-700">{r.value}</p></div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h2 className="font-semibold text-slate-800 mb-4">Module Access</h2>
                <div className="flex flex-wrap gap-2">
                    {["emergency", "attendance", "timetable", "communication"].map(m => (
                        <span key={m} className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold border capitalize",
                            user.permissions.includes(m) ? "bg-violet-50 text-violet-700 border-violet-200" : "bg-slate-50 text-slate-400 border-slate-200")}>
                            {user.permissions.includes(m) ? "✓" : "✗"} {m}
                        </span>
                    ))}
                </div>
                <button onClick={() => router.push(`/school/users/${user.id}/permissions`)}
                    className="mt-4 text-sm text-violet-500 hover:text-violet-700 font-medium">Manage Permissions →</button>
            </div>
        </div>
    )
}