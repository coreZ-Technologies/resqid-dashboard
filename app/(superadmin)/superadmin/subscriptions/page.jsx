"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
    Search, Eye, CreditCard, Zap, Building2, IndianRupee,
    TrendingUp, TrendingDown, CheckCircle, AlertTriangle
} from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import PageHeader from "@/components/shared/PageHeader"
import { StatusBadge } from "@/components/shared/StatusBadge"
import ToolbarActions from "@/components/shared/ToolbarActions"
import { cn } from "@/lib/utils"

const MOCK_SUBSCRIPTIONS = [
    { id: "sub_001", schoolId: "sch_001", school: "Springdale Public School", city: "Kolkata", plan: "safety_bundle", price: "₹4,999/mo", students: "847/1000", status: "active", nextBilling: "2026-07-15", onboarded: "2024-01-15" },
    { id: "sub_002", schoolId: "sch_002", school: "Delhi Public School", city: "New Delhi", plan: "resqid_complete", price: "₹7,999/mo", students: "1200/1500", status: "active", nextBilling: "2026-06-01", onboarded: "2024-03-01" },
    { id: "sub_003", schoolId: "sch_003", school: "Riverside Academy", city: "Mumbai", plan: "module_emergency", price: "₹2,999/mo", students: "450/500", status: "overdue", nextBilling: "2026-05-15", onboarded: "2024-06-01" },
    { id: "sub_004", schoolId: "sch_004", school: "Green Valley School", city: "Bangalore", plan: "bundle_safety", price: "₹4,999/mo", students: "620/1000", status: "active", nextBilling: "2026-08-01", onboarded: "2024-09-10" },
    { id: "sub_005", schoolId: "sch_005", school: "Sunrise Institute", city: "Chennai", plan: "module_attendance", price: "₹3,999/mo", students: "320/500", status: "suspended", nextBilling: "2026-04-01", onboarded: "2024-02-20" },
    { id: "sub_006", schoolId: "sch_006", school: "Oxford Public School", city: "Hyderabad", plan: "resqid_complete", price: "₹7,999/mo", students: "980/1500", status: "active", nextBilling: "2026-07-01", onboarded: "2024-05-15" },
    { id: "sub_007", schoolId: "sch_007", school: "Mount Carmel Academy", city: "Pune", plan: "bundle_safety", price: "₹4,999/mo", students: "510/1000", status: "active", nextBilling: "2026-06-15", onboarded: "2024-08-01" },
    { id: "sub_008", schoolId: "sch_008", school: "St. Xavier's School", city: "Jaipur", plan: "module_emergency", price: "₹2,999/mo", students: "280/500", status: "trial", nextBilling: "2026-06-30", onboarded: "2026-05-01" },
]

const PLAN_COLORS = {
    module_emergency: "bg-red-50 text-red-700 border-red-200",
    module_attendance: "bg-green-50 text-green-700 border-green-200",
    safety_bundle: "bg-violet-50 text-violet-700 border-violet-200",
    resqid_complete: "bg-indigo-50 text-indigo-700 border-indigo-200",
}

export default function SubscriptionsPage() {
    const router = useRouter()
    const [subscriptions] = useState(MOCK_SUBSCRIPTIONS)
    const [search, setSearch] = useState("")
    const [planFilter, setPlanFilter] = useState("All")
    const [statusFilter, setStatusFilter] = useState("All")

    const filtered = useMemo(() => subscriptions.filter(s => {
        if (planFilter !== "All" && s.plan !== planFilter) return false
        if (statusFilter !== "All" && s.status !== statusFilter) return false
        if (search && !s.school.toLowerCase().includes(search.toLowerCase()) && !s.city.toLowerCase().includes(search.toLowerCase())) return false
        return true
    }), [search, planFilter, statusFilter])

    const stats = {
        total: subscriptions.length,
        active: subscriptions.filter(s => s.status === "active").length,
        overdue: subscriptions.filter(s => s.status === "overdue").length,
        mrr: "₹3,42,000",
        mrrTrend: "+12.5%",
    }

    return (
        <div className="max-w-[1400px] space-y-6">
            <PageBreadcrumb items={[{ label: "Super Admin", href: "/superadmin" }, { label: "Subscriptions" }]} />

            <PageHeader title="Subscriptions" description="Manage school plans, billing, and usage across the platform">
                <ToolbarActions onRefresh={() => { }} onExport={() => { }} />
            </PageHeader>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Subscriptions", value: stats.total, icon: CreditCard, color: "bg-blue-500" },
                    { label: "Active", value: stats.active, icon: CheckCircle, color: "bg-emerald-500" },
                    { label: "Overdue", value: stats.overdue, icon: AlertTriangle, color: stats.overdue > 0 ? "bg-red-500" : "bg-slate-400" },
                    { label: "Est. MRR", value: stats.mrr, icon: IndianRupee, color: "bg-violet-500", trend: stats.mrrTrend },
                ].map(s => (
                    <div key={s.label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center`}><s.icon size={18} className="text-white" /></div>
                            {s.trend && <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5"><TrendingUp size={11} />{s.trend}</span>}
                        </div>
                        <p className="text-2xl font-bold text-slate-800">{s.value}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3 flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px]">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search school or city..."
                        className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-violet-500 transition-all" />
                </div>
                <select value={planFilter} onChange={e => setPlanFilter(e.target.value)}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500 bg-white">
                    <option value="All">All Plans</option>
                    <option value="module_emergency">Emergency</option>
                    <option value="module_attendance">Attendance</option>
                    <option value="safety_bundle">Safety Bundle</option>
                    <option value="resqid_complete">Complete</option>
                </select>
                <div className="flex gap-1.5">
                    {["All", "active", "overdue", "suspended", "trial"].map(s => (
                        <button key={s} onClick={() => setStatusFilter(s)}
                            className={cn("px-3 py-2 rounded-lg border text-sm font-medium capitalize transition-all", statusFilter === s ? "bg-violet-600 border-violet-600 text-white shadow-sm" : "border-slate-200 text-slate-600 hover:bg-slate-50")}>{s}</button>
                    ))}
                </div>
            </div>

            <p className="text-sm text-slate-500">Showing <span className="font-semibold text-slate-700">{filtered.length}</span> subscription{filtered.length !== 1 ? "s" : ""}</p>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead><tr className="border-b border-slate-100 bg-slate-50/50">
                        {["School", "City", "Plan", "Price", "Usage", "Next Billing", "Status", ""].map(h => <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase">{h}</th>)}
                    </tr></thead>
                    <tbody>
                        {filtered.map(sub => (
                            <tr key={sub.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                                <td className="px-4 py-3 font-medium text-slate-700">{sub.school}</td>
                                <td className="px-4 py-3 text-xs text-slate-500">{sub.city}</td>
                                <td className="px-4 py-3">
                                    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold border", PLAN_COLORS[sub.plan] || "bg-slate-100 text-slate-600")}>
                                        {sub.plan.replace(/_/g, " ")}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-xs font-semibold text-slate-700">{sub.price}</td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-20 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                            <div className={cn("h-full rounded-full", sub.status === "overdue" ? "bg-red-500" : "bg-violet-500")}
                                                style={{ width: `${(parseInt(sub.students.split("/")[0]) / parseInt(sub.students.split("/")[1])) * 100}%` }} />
                                        </div>
                                        <span className="text-xs text-slate-500">{sub.students}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-xs text-slate-500">{sub.nextBilling}</td>
                                <td className="px-4 py-3">
                                    <StatusBadge status={sub.status === "active" ? "active" : sub.status === "overdue" ? "absent" : sub.status === "trial" ? "pending" : "inactive"} size="sm" label={sub.status} />
                                </td>
                                <td className="px-4 py-3">
                                    <button onClick={() => router.push(`/superadmin/schools/${sub.schoolId}/subscription`)}
                                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-violet-600"><Eye size={14} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}