"use client"

import { useState } from "react"
import { Shield, ShieldCheck, UserCog, Users, Eye, Edit2 } from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import PageHeader from "@/components/shared/PageHeader"
import { cn } from "@/lib/utils"

const ROLES = [
  {
    id: "super_admin", name: "Super Admin", color: "bg-red-500", permissions: [
      "Manage schools", "Manage subscriptions", "View all data", "System settings",
      "Manage admins", "Audit logs", "API access", "Delete data",
    ]
  },
  {
    id: "admin", name: "Admin", color: "bg-violet-500", permissions: [
      "Manage schools", "View all data", "System settings", "Manage admins",
      "Audit logs", "API access",
    ]
  },
  {
    id: "support", name: "Support", color: "bg-blue-500", permissions: [
      "View all data", "Audit logs",
    ]
  },
]

function Toggle({ checked, onChange }) {
  return (
    <button role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
      className={cn("relative w-9 h-5 rounded-full transition-colors shrink-0", checked ? "bg-violet-600" : "bg-slate-200")}>
      <span className={cn("absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform", checked && "translate-x-4")} />
    </button>
  )
}

export default function SuperadminRolesPage() {
  const [selectedRole, setSelectedRole] = useState(ROLES[0])
  const [perms, setPerms] = useState(
    Object.fromEntries(ROLES[0].permissions.map(p => [p, true]))
  )

  const selectRole = (role) => {
    setSelectedRole(role)
    setPerms(Object.fromEntries(role.permissions.map(p => [p, true])))
  }

  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      <PageBreadcrumb items={[{ label: "Super Admin", href: "/superadmin" }, { label: "Settings", href: "/superadmin/settings" }, { label: "Roles & Permissions" }]} />
      <PageHeader title="Roles & Permissions" description="Define what each admin role can access" />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Role List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800">Roles</h2>
          </div>
          <div className="divide-y divide-slate-50">
            {ROLES.map(role => (
              <button key={role.id} onClick={() => selectRole(role)}
                className={cn("w-full px-5 py-3 flex items-center gap-3 text-left transition-colors",
                  selectedRole.id === role.id ? "bg-violet-50" : "hover:bg-slate-50")}>
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", role.color)}>
                  <Shield size={14} className="text-white" />
                </div>
                <span className="text-sm font-medium text-slate-700">{role.name}</span>
                <span className="ml-auto text-xs text-slate-400">{role.permissions.length} perms</span>
              </button>
            ))}
          </div>
        </div>

        {/* Permissions */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", selectedRole.color)}>
              <Shield size={18} className="text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-800">{selectedRole.name} Permissions</h2>
              <p className="text-xs text-slate-500">{selectedRole.permissions.length} permissions</p>
            </div>
          </div>
          <div className="space-y-2">
            {selectedRole.permissions.map(perm => (
              <div key={perm} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-700">{perm}</span>
                <Toggle checked={true} onChange={() => { }} />
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-5">
            <button className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors">Save Permissions</button>
          </div>
        </div>
      </div>
    </div>
  )
}