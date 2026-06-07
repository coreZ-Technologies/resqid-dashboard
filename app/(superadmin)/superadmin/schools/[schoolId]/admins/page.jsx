"use client"

import { useState, useMemo } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Plus, Search, Key, Edit2, Trash2, Mail } from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { useConfirmDialog } from "@/components/shared/ConfirmDialog"
import { MOCK_SCHOOLS } from "@/lib/mock-data"

const MOCK_ADMINS = [
    { id: "adm1", name: "Animesh Karan", email: "animesh@springdale.in", phone: "+91 98765 43210", role: "School Admin", status: "Active", avatar: "AK", lastLogin: "Just now" },
    { id: "adm2", name: "Priya Sharma", email: "priya@springdale.in", phone: "+91 98765 43211", role: "Teacher", status: "Active", avatar: "PS", lastLogin: "2h ago" },
    { id: "adm3", name: "Rohit Verma", email: "rohit@springdale.in", phone: "+91 98765 43212", role: "Staff", status: "Inactive", avatar: "RV", lastLogin: "1 week ago" },
]

export default function SchoolAdminsPage() {
    const router = useRouter()
    const params = useParams()
    const schoolId = params.schoolId
    const [admins, setAdmins] = useState(MOCK_ADMINS)
    const [search, setSearch] = useState("")
    const { confirmDialog, confirm } = useConfirmDialog()

    const school = MOCK_SCHOOLS.find(s => s.id === schoolId)
    const filtered = useMemo(() => admins.filter(a => !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase())), [admins, search])

    const handleDelete = async (id) => {
        const ok = await confirm({ variant: "delete", title: "Remove admin?", description: "This will permanently remove their access.", confirmLabel: "Remove" })
        if (ok) setAdmins(prev => prev.filter(a => a.id !== id))
    }

    const handleResendWelcome = (admin) => {
        console.log("Resending welcome email to:", admin.email)
    }

    return (
        <div className="max-w-[1100px] mx-auto space-y-6">
            {confirmDialog}
            <PageBreadcrumb items={[{ label: "Super Admin", href: "/superadmin" }, { label: "Schools", href: "/superadmin/schools" }, { label: school?.name || "School", href: `/superadmin/schools/${schoolId}` }, { label: "Admins" }]} />

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"><ArrowLeft size={18} /></button>
                    <div><h1 className="text-[22px] font-bold text-slate-800">School Admins</h1><p className="text-[13px] text-slate-500">{school?.name}</p></div>
                </div>
                <button onClick={() => router.push(`/superadmin/schools/${schoolId}/admins/add`)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-violet-700 text-white text-sm font-semibold shadow-sm shadow-violet-200 hover:from-violet-600 hover:to-violet-800 transition-all">
                    <Plus size={16} /> Add Admin
                </button>
            </div>

            <div className="relative max-w-sm">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search admins..."
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-violet-500" />
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead><tr className="border-b border-slate-100 bg-slate-50/50">
                        {["Admin", "Email", "Role", "Status", "Last Login", "Actions"].map(h => <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase">{h}</th>)}
                    </tr></thead>
                    <tbody>
                        {filtered.map(admin => (
                            <tr key={admin.id} className="border-b border-slate-50 hover:bg-slate-50/50 cursor-pointer" onClick={() => router.push(`/superadmin/schools/${schoolId}/admins/${admin.id}`)}>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-xs">{admin.avatar}</div>
                                        <span className="font-medium text-slate-700">{admin.name}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-xs text-slate-500">{admin.email}</td>
                                <td className="px-4 py-3 text-xs text-slate-500">{admin.role}</td>
                                <td className="px-4 py-3"><StatusBadge status={admin.status === "Active" ? "active" : "inactive"} size="sm" label={admin.status} /></td>
                                <td className="px-4 py-3 text-xs text-slate-400">{admin.lastLogin}</td>
                                <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                                    <div className="flex items-center gap-1">
                                        <button onClick={() => router.push(`/superadmin/schools/${schoolId}/admins/${admin.id}/reset-password`)} className="p-1.5 rounded-lg hover:bg-amber-50 text-slate-400 hover:text-amber-600" title="Reset Password"><Key size={14} /></button>
                                        <button onClick={() => handleResendWelcome(admin)} className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600" title="Resend Welcome"><Mail size={14} /></button>
                                        <button onClick={() => router.push(`/superadmin/schools/${schoolId}/admins/${admin.id}/edit`)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-600"><Edit2 size={14} /></button>
                                        <button onClick={() => handleDelete(admin.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}