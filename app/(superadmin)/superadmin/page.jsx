"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Activity, Users, Building2, TrendingUp, AlertTriangle,
  CheckCircle, IndianRupee, ScanLine, ArrowUp, ArrowDown,
  CreditCard, Globe, Server, Zap, Shield, Eye, Plus
} from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import PageHeader from "@/components/shared/PageHeader"
import { cn } from "@/lib/utils"

const STATS = {
  totalSchools: 124, activeSchools: 118, totalStudents: 28473,
  activeAlerts: 8, monthlyRevenue: 284500, totalScans: 142380,
}

const RECENT_SCHOOLS = [
  { id: "sch_001", name: "Springfield High School", students: 1245, plan: "bundle_safety", status: "active", joinDate: "2025-01-15" },
  { id: "sch_002", name: "Riverside Academy", students: 3420, plan: "resqid_complete", status: "active", joinDate: "2024-11-20" },
  { id: "sch_003", name: "Northside Elementary", students: 580, plan: "module_emergency", status: "active", joinDate: "2025-02-10" },
  { id: "sch_004", name: "Westlake College", students: 890, plan: "module_attendance", status: "suspended", joinDate: "2025-01-05" },
  { id: "sch_005", name: "Sunnydale School", students: 2150, plan: "bundle_ops", status: "active", joinDate: "2024-12-01" },
]

const RECENT_ACTIVITY = [
  { user: "Arjun Das", action: "Created new school", target: "Green Valley School", time: "10:30 AM", type: "create" },
  { user: "Priya Sharma", action: "Updated subscription", target: "Riverside Academy", time: "9:15 AM", type: "update" },
  { user: "System", action: "Alert resolved", target: "High latency spike", time: "8:45 AM", type: "resolve" },
  { user: "Raj Patel", action: "Exported reports", target: "Monthly attendance", time: "Yesterday", type: "export" },
  { user: "Sneha Biswas", action: "Added new admin", target: "Sarah Williams", time: "Yesterday", type: "create" },
]

const SYSTEM_HEALTH = [
  { label: "API Gateway", status: "Operational", color: "emerald" },
  { label: "PostgreSQL", status: "Operational", color: "emerald" },
  { label: "Redis / BullMQ", status: "Operational", color: "emerald" },
  { label: "SMS Gateway", status: "Degraded", color: "amber" },
  { label: "Push Notifications", status: "Operational", color: "emerald" },
  { label: "Storage", status: "Operational", color: "emerald" },
]

const PLAN_COLORS = {
  module_emergency: "bg-red-50 text-red-700",
  module_attendance: "bg-green-50 text-green-700",
  bundle_safety: "bg-violet-50 text-violet-700",
  bundle_ops: "bg-teal-50 text-teal-700",
  resqid_complete: "bg-indigo-50 text-indigo-700",
}

export default function SuperadminDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => { setTimeout(() => setLoading(false), 400) }, [])

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto space-y-6">
        <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">{[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-28 bg-slate-100 rounded-xl animate-pulse" />)}</div>
      </div>
    )
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      <PageBreadcrumb items={[{ label: "Super Admin" }]} />

      <PageHeader title="Dashboard" description="coreZ Technologies · Platform Overview" />

      {/* KPI Cards — 6 cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        {[
          { label: "Total Schools", value: STATS.totalSchools, icon: Building2, color: "bg-indigo-500", trend: "+6.9%", up: true, href: "/superadmin/schools" },
          { label: "Active Schools", value: STATS.activeSchools, icon: CheckCircle, color: "bg-emerald-500", trend: "+4.4%", up: true },
          { label: "Total Students", value: STATS.totalStudents.toLocaleString("en-IN"), icon: Users, color: "bg-blue-500", trend: "+8.2%", up: true },
          { label: "QR Scans", value: STATS.totalScans.toLocaleString("en-IN"), icon: ScanLine, color: "bg-violet-500", trend: "+12.1%", up: true },
          { label: "Monthly Revenue", value: `₹${(STATS.monthlyRevenue / 100).toLocaleString("en-IN")}`, icon: IndianRupee, color: "bg-green-500", trend: "+11.3%", up: true, href: "/superadmin/subscriptions" },
          { label: "Active Alerts", value: STATS.activeAlerts, icon: AlertTriangle, color: STATS.activeAlerts > 0 ? "bg-red-500" : "bg-slate-400", trend: "-20%", up: false },
        ].map(s => (
          <div key={s.label} onClick={() => s.href && router.push(s.href)}
            className={cn("bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col gap-3 hover:shadow-md transition-all", s.href && "cursor-pointer")}>
            <div className="flex items-center justify-between">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", s.color)}><s.icon size={18} className="text-white" /></div>
              <span className={cn("text-[11px] font-semibold flex items-center gap-0.5", s.up ? "text-emerald-600" : "text-red-500")}>
                {s.up ? <ArrowUp size={10} /> : <ArrowDown size={10} />}{s.trend}
              </span>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{s.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Schools Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2"><Building2 size={16} className="text-violet-600" />Recent Schools</h2>
            <button onClick={() => router.push("/superadmin/schools")} className="text-xs text-violet-500 hover:text-violet-700 font-medium">View All →</button>
          </div>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-slate-100 bg-slate-50/50">
              {["School", "Students", "Plan", "Status"].map(h => <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase">{h}</th>)}
            </tr></thead>
            <tbody>
              {RECENT_SCHOOLS.map(school => (
                <tr key={school.id} onClick={() => router.push(`/superadmin/schools/${school.id}`)}
                  className="border-b border-slate-50 hover:bg-slate-50/50 cursor-pointer transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-700 text-sm">{school.name}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{school.students.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3"><span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold", PLAN_COLORS[school.plan] || "bg-slate-100 text-slate-600")}>{school.plan.replace(/_/g, " ")}</span></td>
                  <td className="px-4 py-3">
                    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold", school.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700")}>{school.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2"><Activity size={16} className="text-violet-600" />Recent Activity</h2>
            <button onClick={() => router.push("/superadmin/activity-logs")} className="text-xs text-violet-500 hover:text-violet-700 font-medium">View All →</button>
          </div>
          <div className="divide-y divide-slate-50">
            {RECENT_ACTIVITY.map((a, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50/50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-xs shrink-0">
                  {a.user.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 truncate"><span className="font-medium">{a.user}</span> {a.action}</p>
                  <p className="text-xs text-slate-400 truncate">{a.target}</p>
                </div>
                <span className="text-xs text-slate-400 shrink-0">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Health + Quick Stats */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* System Health */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><Server size={16} className="text-violet-600" />System Health</h2>
          <div className="grid grid-cols-2 gap-2">
            {SYSTEM_HEALTH.map(s => (
              <div key={s.label} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className={cn("w-2 h-2 rounded-full", s.color === "emerald" ? "bg-emerald-500" : s.color === "amber" ? "bg-amber-500" : "bg-red-500")} />
                  <span className="text-sm text-slate-600">{s.label}</span>
                </div>
                <span className={cn("text-xs font-semibold", s.color === "emerald" ? "text-emerald-600" : s.color === "amber" ? "text-amber-600" : "text-red-600")}>{s.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h2 className="font-semibold text-slate-800 mb-4">Quick Actions</h2>
          <div className="space-y-1.5">
            {[
              { icon: Building2, label: "View All Schools", href: "/superadmin/schools" },
              { icon: Plus, label: "Add New School", href: "/superadmin/schools/add" },
              { icon: Activity, label: "Activity Log", href: "/superadmin/activity-logs" },
              { icon: CreditCard, label: "Subscriptions", href: "/superadmin/subscriptions" },
              { icon: Globe, label: "System Health", href: "/superadmin/health" },
            ].map(link => (
              <button key={link.label} onClick={() => router.push(link.href)}
                className="w-full flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-slate-50 text-sm text-slate-600 transition-colors">
                <link.icon size={14} className="text-slate-400" />{link.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}