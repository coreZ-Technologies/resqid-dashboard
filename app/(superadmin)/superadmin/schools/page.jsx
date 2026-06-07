"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Plus, Search, Eye, Building2, Shield, CreditCard, Users } from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import PageHeader from "@/components/shared/PageHeader"
import { StatusBadge } from "@/components/shared/StatusBadge"
import ToolbarActions from "@/components/shared/ToolbarActions"
import { MOCK_SCHOOLS } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const PLAN_COLORS = {
  module_emergency: "bg-red-50 text-red-700",
  module_attendance: "bg-green-50 text-green-700",
  safety_bundle: "bg-violet-50 text-violet-700",
  resqid_complete: "bg-indigo-50 text-indigo-700",
}

export default function SchoolsPage() {
  const router = useRouter()
  const [schools] = useState(MOCK_SCHOOLS)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  const filtered = useMemo(() => schools.filter(s => {
    if (statusFilter !== "All" && s.status !== statusFilter) return false
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.city.toLowerCase().includes(search.toLowerCase())) return false
    return true
  }), [search, statusFilter])

  const stats = {
    total: schools.length,
    active: schools.filter(s => s.status === "active").length,
    totalStudents: schools.reduce((sum, s) => sum + s.stats.students, 0),
    totalRevenue: "₹2,14,000/month",
  }

  return (
    <div className="max-w-[1400px] space-y-6">
      <PageBreadcrumb items={[{ label: "Super Admin", href: "/superadmin" }, { label: "Schools" }]} />

      <PageHeader title="All Schools" description="Manage onboarded schools across the platform">
        <div className="flex items-center gap-2">
          <ToolbarActions onRefresh={() => { }} onExport={() => { }} />
          <button onClick={() => router.push("/superadmin/schools/add")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-violet-700 text-white text-sm font-semibold shadow-sm shadow-violet-200 hover:from-violet-600 hover:to-violet-800 transition-all">
            <Plus size={16} /> Add School
          </button>
        </div>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Schools", value: stats.total, icon: Building2, color: "bg-blue-500" },
          { label: "Active", value: stats.active, icon: Shield, color: "bg-emerald-500" },
          { label: "Total Students", value: stats.totalStudents.toLocaleString("en-IN"), icon: Users, color: "bg-violet-500" },
          { label: "Est. Monthly Revenue", value: stats.totalRevenue, icon: CreditCard, color: "bg-amber-500" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center`}><s.icon size={18} className="text-white" /></div>
            <div><p className="text-xl font-bold text-slate-800">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3 flex items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search schools..."
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-violet-500 transition-all" />
        </div>
        {["All", "active", "suspended", "inactive"].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={cn("px-3 py-2 rounded-lg border text-sm font-medium capitalize transition-all", statusFilter === s ? "bg-violet-600 border-violet-600 text-white shadow-sm" : "border-slate-200 text-slate-600 hover:bg-slate-50")}>{s}</button>
        ))}
      </div>

      {/* School Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(school => (
          <div key={school.id} onClick={() => router.push(`/superadmin/schools/${school.id}`)}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-lg">
                  {school.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{school.name}</h3>
                  <p className="text-xs text-slate-400">{school.city}, {school.state}</p>
                </div>
              </div>
              <StatusBadge status={school.status === "active" ? "active" : school.status === "suspended" ? "inactive" : "inactive"} size="sm" label={school.status} />
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
              <div><span className="text-slate-400">Students:</span> <span className="font-semibold">{school.stats.students}</span></div>
              <div><span className="text-slate-400">Teachers:</span> <span className="font-semibold">{school.stats.teachers}</span></div>
              <div><span className="text-slate-400">Classes:</span> <span className="font-semibold">{school.stats.classes}</span></div>
              <div><span className="text-slate-400">Devices:</span> <span className="font-semibold">{school.stats.devices}</span></div>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {school.modules.map(m => (
                <span key={m} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 capitalize">{m}</span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold", PLAN_COLORS[school.plan] || "bg-slate-100 text-slate-600")}>
                {school.subscription.plan}
              </span>
              <span className="text-xs text-slate-400">{school.subscription.price}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}