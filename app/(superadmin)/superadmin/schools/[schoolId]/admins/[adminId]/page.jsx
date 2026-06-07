"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import {
    ArrowLeft, User, Mail, Phone, Shield, Calendar, Key, Edit2,
    Activity, Clock
} from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { MOCK_SCHOOLS } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const getAdmin = (id) => ({
    id, name: "Animesh Karan", email: "animesh@springdale.in", phone: "+91 98765 43210",
    role: "School Admin", status: "Active", avatar: "AK", color: "bg-violet-500",
    lastLogin: "Just now", joined: "2024-01-15",
    permissions: ["emergency", "attendance", "timetable", "communication"],
    recentActivity: [
        { action: "Marked attendance for Class 10-A", time: "2 hours ago" },
        { action: "Added new student: Aryan Gupta", time: "5 hours ago" },
        { action: "Generated QR codes for Class 6", time: "Yesterday" },
        { action: "Updated school profile", time: "2 days ago" },
    ],
    sessions: [
        { device: "Chrome — Windows 11", location: "Kolkata, India", current: true, time: "Just now" },
        { device: "Safari — iPhone 15", location: "Kolkata, India", current: false, time: "3 hours ago" },
    ],
})

export default function AdminProfilePage() {
    const router = useRouter()
    const params = useParams()
    const schoolId = params.schoolId
    const adminId = params.adminId

    const [admin, setAdmin] = useState(null)
    const [loading, setLoading] = useState(true)

    const school = MOCK_SCHOOLS.find(s => s.id === schoolId)

    useEffect(() => {
        setTimeout(() => { setAdmin(getAdmin(adminId)); setLoading(false) }, 400)
    }, [adminId])

    if (loading) return <div className="max-w-[900px] mx-auto space-y-6"><div className="h-64 bg-slate-100 rounded-xl animate-pulse" /></div>
    if (!admin) return <div className="text-center py-16 text-slate-500">Admin not found</div>

    return (
        <div className="max-w-[900px] mx-auto space-y-6">
            <PageBreadcrumb items={[
                { label: "Super Admin", href: "/superadmin" },
                { label: "Schools", href: "/superadmin/schools" },
                { label: school?.name || "School", href: `/superadmin/schools/${schoolId}` },
                { label: "Admins", href: `/superadmin/schools/${schoolId}/admins` },
                { label: admin.name },
            ]} />

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"><ArrowLeft size={18} /></button>
                    <div className="flex items-center gap-3">
                        <div className={`w-14 h-14 rounded-xl ${admin.color} flex items-center justify-center text-white font-bold text-xl`}>{admin.avatar}</div>
                        <div>
                            <h1 className="text-[22px] font-bold text-slate-800">{admin.name}</h1>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs text-slate-500">{admin.role}</span>
                                <StatusBadge status={admin.status === "Active" ? "active" : "inactive"} size="sm" label={admin.status} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => router.push(`/superadmin/schools/${schoolId}/admins/${admin.id}/reset-password`)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 text-sm font-medium hover:bg-amber-100 shadow-sm transition-colors"><Key size={15} />Reset Password</button>
                    <button onClick={() => router.push(`/superadmin/schools/${schoolId}/admins/${admin.id}/edit`)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 shadow-sm transition-colors"><Edit2 size={15} />Edit</button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Account Info */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                        <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><User size={18} className="text-violet-600" />Account Information</h2>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            {[
                                { icon: User, label: "Full Name", value: admin.name },
                                { icon: Mail, label: "Email", value: admin.email },
                                { icon: Phone, label: "Phone", value: admin.phone },
                                { icon: Shield, label: "Role", value: admin.role },
                                { icon: Calendar, label: "Joined", value: admin.joined },
                                { icon: Clock, label: "Last Login", value: admin.lastLogin },
                            ].map(r => (
                                <div key={r.label} className="flex items-center gap-2.5">
                                    <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center shrink-0"><r.icon size={16} className="text-slate-500" /></div>
                                    <div><p className="text-xs text-slate-400 uppercase">{r.label}</p><p className="font-medium text-slate-700">{r.value}</p></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Module Permissions */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                        <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><Shield size={18} className="text-violet-600" />Module Access</h2>
                        <div className="flex flex-wrap gap-2">
                            {["emergency", "attendance", "timetable", "communication"].map(m => (
                                <span key={m} className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold border capitalize",
                                    admin.permissions.includes(m) ? "bg-violet-50 text-violet-700 border-violet-200" : "bg-slate-50 text-slate-400 border-slate-200")}>
                                    {admin.permissions.includes(m) ? "✓" : "✗"} {m}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                        <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><Activity size={18} className="text-violet-600" />Recent Activity</h2>
                        <div className="space-y-2">
                            {admin.recentActivity.map((a, i) => (
                                <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                                    <span className="text-sm text-slate-700">{a.action}</span>
                                    <span className="text-xs text-slate-400">{a.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Quick Stats */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                        <h2 className="font-semibold text-slate-800 mb-4">Quick Info</h2>
                        <div className="space-y-3 text-sm">
                            {[
                                { label: "Status", value: admin.status, color: "text-emerald-600" },
                                { label: "Role", value: admin.role, color: "text-violet-600" },
                                { label: "School", value: school?.name || "—", color: "text-slate-700" },
                                { label: "Last Active", value: admin.lastLogin, color: "text-slate-700" },
                            ].map(r => (
                                <div key={r.label} className="flex justify-between">
                                    <span className="text-slate-500">{r.label}</span>
                                    <span className={cn("font-semibold", r.color)}>{r.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Active Sessions */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                        <h2 className="font-semibold text-slate-800 mb-4">Active Sessions</h2>
                        <div className="space-y-3">
                            {admin.sessions.map((s, i) => (
                                <div key={i} className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-lg">
                                    <div className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0", s.current ? "bg-emerald-500" : "bg-slate-300")} />
                                    <div>
                                        <p className="text-sm font-medium text-slate-700">{s.device}</p>
                                        <p className="text-xs text-slate-400">{s.location} · {s.time}</p>
                                        {s.current && <span className="text-[10px] font-semibold text-emerald-600">Current Session</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}