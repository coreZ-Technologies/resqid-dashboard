"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Plus, Search, Edit2, Trash2, Shield, Key } from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import PageHeader from "@/components/shared/PageHeader"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { useConfirmDialog } from "@/components/shared/ConfirmDialog"
import ToolbarActions from "@/components/shared/ToolbarActions"
import { cn } from "@/lib/utils"

const MOCK_ADMINS = [
  { id: "sa1", name: "Animesh Karan", email: "animesh@corez.in", role: "Super Admin", status: "Active", lastLogin: "Just now", joined: "2024-01-01", avatar: "AK", color: "bg-indigo-500" },
  { id: "sa2", name: "Priya Sharma", email: "priya@corez.in", role: "Admin", status: "Active", lastLogin: "2h ago", joined: "2024-06-15", avatar: "PS", color: "bg-violet-500" },
  { id: "sa3", name: "Rohit Verma", email: "rohit@corez.in", role: "Admin", status: "Inactive", lastLogin: "2 weeks ago", joined: "2024-03-01", avatar: "RV", color: "bg-blue-500" },
]

export default function SuperadminAdminsPage() {
  const router = useRouter()
  const [admins, setAdmins] = useState(MOCK_ADMINS)
  const [search, setSearch] = useState("")
  const { confirmDialog, confirm } = useConfirmDialog()

  const filtered = useMemo(() => admins.filter(a =>
    !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase())
  ), [admins, search])

  const handleDelete = async (id) => {
    const admin = admins.find(a => a.id === id)
    if (admin?.role === "Super Admin") return
    const ok = await confirm({ variant: "delete", title: "Remove admin?", description: `Remove ${admin?.name}'s access permanently?`, confirmLabel: "Remove" })
    if (ok) setAdmins(prev => prev.filter(a => a.id !== id))
  }

  return (
    <div className="max-w-[1100px] mx-auto space-y-6">
      {confirmDialog}
      <PageBreadcrumb items={[{ label: "Super Admin", href: "/superadmin" }, { label: "Settings", href: "/superadmin/settings" }, { label: "Admin Accounts" }]} />

      <PageHeader title="Admin Accounts" description="Manage super admin and platform admin access">
        <div className="flex items-center gap-2">
          <ToolbarActions onRefresh={() => { }} onExport={() => { }} />
          <button onClick={() => router.push("/superadmin/settings/admins/add")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-violet-700 text-white text-sm font-semibold shadow-sm shadow-violet-200 hover:from-violet-600 hover:to-violet-800 transition-all">
            <Plus size={16} /> Add Admin
          </button>
        </div>
      </PageHeader>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search admins..."
          className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-violet-500" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              {["Admin", "Email", "Role", "Status", "Last Login", "Joined", ""].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(admin => (
              <tr key={admin.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full ${admin.color} flex items-center justify-center text-white font-bold text-xs`}>{admin.avatar}</div>
                    <span className="font-medium text-slate-700">{admin.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">{admin.email}</td>
                <td className="px-4 py-3">
                  <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                    admin.role === "Super Admin" ? "bg-red-50 text-red-700 border-red-200" : "bg-violet-50 text-violet-700 border-violet-200")}>{admin.role}</span>
                </td>
                <td className="px-4 py-3"><StatusBadge status={admin.status === "Active" ? "active" : "inactive"} size="sm" label={admin.status} /></td>
                <td className="px-4 py-3 text-xs text-slate-400">{admin.lastLogin}</td>
                <td className="px-4 py-3 text-xs text-slate-400">{admin.joined}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-600"><Edit2 size={14} /></button>
                    {admin.role !== "Super Admin" && (
                      <button onClick={() => handleDelete(admin.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                    )}
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