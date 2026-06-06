"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
    Plus, Edit2, Trash2, Key, Shield, UserCheck, UserX, Search
} from "lucide-react"
import PageHeader from "@/components/shared/PageHeader"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { useConfirmDialog } from "@/components/shared/ConfirmDialog"
import ToolbarActions from "@/components/shared/ToolbarActions"
import { cn } from "@/lib/utils"

const ROLES = ["All", "School Admin", "Teacher", "Staff"]
const STATUS_OPTS = ["All", "Active", "Inactive", "Suspended"]

const ROLE_STYLE = {
    "Super Admin": "bg-indigo-50 text-indigo-700 border-indigo-200",
    "School Admin": "bg-violet-50 text-violet-700 border-violet-200",
    "Teacher": "bg-blue-50 text-blue-700 border-blue-200",
    "Staff": "bg-slate-100 text-slate-600 border-slate-200",
}

const MOCK_USERS = [
    { id: "u1", name: "Animesh Karan", email: "animesh@springdale.in", phone: "+91 98765 43210", role: "Super Admin", status: "Active", avatar: "AK", color: "bg-indigo-500", lastLogin: "Just now", joined: "2024-01-15" },
    { id: "u2", name: "Dr. Meera Shah", email: "meera@springdale.in", phone: "+91 97654 32109", role: "School Admin", status: "Active", avatar: "MS", color: "bg-violet-500", lastLogin: "2h ago", joined: "2024-03-01" },
    { id: "u3", name: "Mr. Suresh Kumar", email: "suresh@springdale.in", phone: "+91 96543 21098", role: "Teacher", status: "Active", avatar: "SK", color: "bg-blue-500", lastLogin: "5h ago", joined: "2024-03-01" },
    { id: "u4", name: "Ms. Priya Nair", email: "priya@springdale.in", phone: "+91 95432 10987", role: "Teacher", status: "Active", avatar: "PN", color: "bg-emerald-500", lastLogin: "1d ago", joined: "2024-06-01" },
    { id: "u5", name: "Ms. Sunita Roy", email: "sunita@springdale.in", phone: "+91 94321 09876", role: "Teacher", status: "Inactive", avatar: "SR", color: "bg-rose-500", lastLogin: "2 weeks ago", joined: "2024-06-01" },
    { id: "u6", name: "Ramesh Verma", email: "ramesh@springdale.in", phone: "+91 93210 98765", role: "Staff", status: "Active", avatar: "RV", color: "bg-cyan-500", lastLogin: "3h ago", joined: "2023-09-01" },
    { id: "u7", name: "Kavitha Reddy", email: "kavitha@springdale.in", phone: "+91 92109 87654", role: "Staff", status: "Suspended", avatar: "KR", color: "bg-teal-500", lastLogin: "1 month ago", joined: "2023-07-15" },
]

export default function ManageUsersPage() {
    const router = useRouter()
    const [users, setUsers] = useState(MOCK_USERS)
    const [search, setSearch] = useState("")
    const [roleFilter, setRoleFilter] = useState("All")
    const [statusFilter, setStatusFilter] = useState("All")
    const { confirmDialog, confirm } = useConfirmDialog()

    const filtered = useMemo(() => users.filter(u => {
        const matchRole = roleFilter === "All" || u.role === roleFilter
        const matchStatus = statusFilter === "All" || u.status === statusFilter
        const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
        return matchRole && matchStatus && matchSearch
    }), [users, search, roleFilter, statusFilter])

    const handleDelete = async (id) => {
        const user = users.find(u => u.id === id)
        if (user?.role === "Super Admin") return
        const ok = await confirm({ variant: "delete", title: "Delete user?", description: `This will permanently remove ${user?.name}'s account.`, confirmLabel: "Delete" })
        if (ok) setUsers(prev => prev.filter(u => u.id !== id))
    }

    const stats = {
        total: users.length,
        active: users.filter(u => u.status === "Active").length,
        admins: users.filter(u => u.role === "Super Admin" || u.role === "School Admin").length,
        suspended: users.filter(u => u.status === "Suspended").length,
    }

    return (
        <div className="max-w-[1300px] space-y-6">
            {confirmDialog}

            <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "Manage Users" }]} />

            <PageHeader title="Manage Users" description="Add and manage staff, teacher, and admin accounts">
                <div className="flex items-center gap-2">
                    <ToolbarActions onRefresh={() => console.log("Refreshing...")} onExport={() => console.log("Exporting...")} />
                    <button onClick={() => router.push("/school/users/add")}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-violet-700 text-white text-sm font-semibold shadow-sm shadow-violet-200 hover:from-violet-600 hover:to-violet-800 transition-all">
                        <Plus size={16} /> Add User
                    </button>
                </div>
            </PageHeader>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Users", value: stats.total, icon: Shield, color: "bg-blue-500" },
                    { label: "Active", value: stats.active, icon: UserCheck, color: "bg-emerald-500" },
                    { label: "Admins", value: stats.admins, icon: Shield, color: "bg-violet-500" },
                    { label: "Suspended", value: stats.suspended, icon: UserX, color: "bg-red-500" },
                ].map(s => (
                    <div key={s.label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center`}><s.icon size={18} className="text-white" /></div>
                        <div><p className="text-xl font-bold text-slate-800">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3 flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px]">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..."
                        className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-violet-500 transition-all" />
                </div>
                <div className="flex gap-1.5">
                    {ROLES.map(r => (
                        <button key={r} onClick={() => setRoleFilter(r)}
                            className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${roleFilter === r ? "bg-violet-600 border-violet-600 text-white shadow-sm" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>{r}</button>
                    ))}
                </div>
                <div className="flex gap-1.5">
                    {STATUS_OPTS.map(s => (
                        <button key={s} onClick={() => setStatusFilter(s)}
                            className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${statusFilter === s ? "bg-slate-800 border-slate-800 text-white" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>{s}</button>
                    ))}
                </div>
            </div>

            <p className="text-sm text-slate-500">Showing <span className="font-semibold text-slate-700">{filtered.length}</span> user{filtered.length !== 1 ? "s" : ""}</p>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                {["User", "Phone", "Role", "Status", "Last Login", "Joined", ""].map(h => (
                                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(user => {
                                const roleStyle = ROLE_STYLE[user.role] || ROLE_STYLE.Staff
                                return (
                                    <tr key={user.id} onClick={() => router.push(`/school/users/${user.id}`)}
                                        className="border-b border-slate-50 hover:bg-slate-50/50 cursor-pointer transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-9 h-9 rounded-full ${user.color} flex items-center justify-center text-white font-bold text-xs`}>{user.avatar}</div>
                                                <div>
                                                    <p className="font-medium text-slate-700">{user.name}</p>
                                                    <p className="text-xs text-slate-400">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-slate-500">{user.phone}</td>
                                        <td className="px-4 py-3">
                                            <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold border", roleStyle)}>{user.role}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <StatusBadge status={user.status === "Active" ? "active" : user.status === "Suspended" ? "inactive" : "inactive"} size="sm" label={user.status} />
                                        </td>
                                        <td className="px-4 py-3 text-xs text-slate-400">{user.lastLogin}</td>
                                        <td className="px-4 py-3 text-xs text-slate-400">{user.joined}</td>
                                        <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                                            <div className="flex items-center gap-1">
                                                <button onClick={() => router.push(`/school/users/${user.id}/reset-password`)} className="p-1.5 rounded-lg hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition-colors" title="Reset Password"><Key size={14} /></button>
                                                <button onClick={() => router.push(`/school/users/edit?id=${user.id}`)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors" title="Edit"><Edit2 size={14} /></button>
                                                {user.role !== "Super Admin" && (
                                                    <button onClick={() => handleDelete(user.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors" title="Delete"><Trash2 size={14} /></button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}