"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import {
    ArrowLeft, CreditCard, Check, Loader2, Zap, Shield,
    Calendar, Download, Mail
} from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { MOCK_SCHOOLS } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const PLANS = [
    {
        id: "module_emergency", name: "Emergency", price: "₹2,999", period: "/month",
        features: ["QR-based ID cards", "Emergency scan alerts", "Parent notifications", "Unlimited scans"],
        color: "bg-rose-500", modules: ["emergency"],
    },
    {
        id: "module_attendance", name: "Attendance", price: "₹3,999", period: "/month",
        features: ["RFID attendance", "Real-time tracking", "Daily reports", "Parent alerts"],
        color: "bg-emerald-500", modules: ["attendance"],
    },
    {
        id: "safety_bundle", name: "Safety Bundle", price: "₹4,999", period: "/month",
        features: ["Emergency + Attendance", "QR & RFID combined", "Device management", "Priority support"],
        color: "bg-violet-500", modules: ["emergency", "attendance"],
    },
    {
        id: "resqid_complete", name: "Complete", price: "₹7,999", period: "/month",
        features: ["All modules included", "Timetable generator", "Parent communication", "Dedicated support"],
        color: "bg-indigo-500", modules: ["emergency", "attendance", "timetable", "communication"],
    },
]

const INVOICES = [
    { id: "INV-001", date: "2026-06-15", amount: "₹4,999", status: "Paid" },
    { id: "INV-002", date: "2026-05-15", amount: "₹4,999", status: "Paid" },
    { id: "INV-003", date: "2026-04-15", amount: "₹4,999", status: "Paid" },
    { id: "INV-004", date: "2026-03-15", amount: "₹4,999", status: "Paid" },
]

export default function SchoolSubscriptionPage() {
    const router = useRouter()
    const params = useParams()
    const schoolId = params.schoolId

    const [school, setSchool] = useState(null)
    const [loading, setLoading] = useState(true)
    const [changing, setChanging] = useState(false)
    const [selectedPlan, setSelectedPlan] = useState(null)
    const [showConfirm, setShowConfirm] = useState(false)
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            const found = MOCK_SCHOOLS.find(s => s.id === schoolId)
            if (found) setSchool(found)
            setLoading(false)
        }, 400)
    }, [schoolId])

    const handleChangePlan = (planId) => {
        setSelectedPlan(planId)
        setShowConfirm(true)
    }

    const confirmChange = async () => {
        setChanging(true)
        await new Promise(r => setTimeout(r, 1500))
        setChanging(false)
        setShowConfirm(false)
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
    }

    if (loading) return <div className="max-w-[1100px] mx-auto space-y-6"><div className="h-64 bg-slate-100 rounded-xl animate-pulse" /></div>
    if (!school) return <div className="text-center py-16 text-slate-500">School not found</div>

    const currentPlanMeta = PLANS.find(p => p.id === school.plan) || PLANS[0]

    return (
        <div className="max-w-[1100px] mx-auto space-y-6">
            <PageBreadcrumb items={[{ label: "Super Admin", href: "/superadmin" }, { label: "Schools", href: "/superadmin/schools" }, { label: school.name, href: `/superadmin/schools/${schoolId}` }, { label: "Subscription" }]} />

            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"><ArrowLeft size={18} /></button>
                <div><h1 className="text-[22px] font-bold text-slate-800">Subscription</h1><p className="text-[13px] text-slate-500">{school.name}</p></div>
            </div>

            {/* Success Banner */}
            {success && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
                    <Check size={18} className="text-emerald-600" />
                    <div><p className="font-semibold text-emerald-800">Plan Updated!</p><p className="text-xs text-emerald-700">School has been moved to the new plan.</p></div>
                </div>
            )}

            {/* Current Plan */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><CreditCard size={18} className="text-violet-600" />Current Plan</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <p className="text-xs text-slate-400 uppercase">Plan</p>
                        <div className="flex items-center gap-2 mt-1">
                            <div className={cn("w-3 h-3 rounded-full", currentPlanMeta.color)} />
                            <p className="text-lg font-bold text-slate-800">{school.subscription.plan}</p>
                        </div>
                        <p className="text-sm text-violet-600 font-semibold">{school.subscription.price}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 uppercase">Status</p>
                        <div className="mt-1">
                            <StatusBadge status={school.subscription.status === "active" ? "active" : school.subscription.status === "overdue" ? "absent" : "inactive"} size="sm" label={school.subscription.status} />
                        </div>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 uppercase">Next Billing</p>
                        <p className="text-sm font-semibold text-slate-700 mt-1 flex items-center gap-1"><Calendar size={13} />{school.subscription.nextBilling}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 uppercase">Student Usage</p>
                        <p className="text-sm font-semibold text-slate-700 mt-1">{school.subscription.studentsUsed} / {school.subscription.studentLimit}</p>
                        <div className="w-full h-1.5 rounded-full bg-slate-100 mt-1.5 overflow-hidden">
                            <div className={cn("h-full rounded-full", (school.subscription.studentsUsed / school.subscription.studentLimit) > 0.9 ? "bg-red-500" : "bg-violet-500")}
                                style={{ width: `${(school.subscription.studentsUsed / school.subscription.studentLimit) * 100}%` }} />
                        </div>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-xs text-slate-400 uppercase mb-2">Active Modules</p>
                    <div className="flex flex-wrap gap-2">
                        {["emergency", "attendance", "timetable", "communication"].map(m => (
                            <span key={m} className={cn("px-2.5 py-1 rounded-lg text-xs font-semibold border capitalize",
                                school.modules.includes(m) ? "bg-violet-50 text-violet-700 border-violet-200" : "bg-slate-50 text-slate-400 border-slate-200")}>
                                {school.modules.includes(m) ? "✓" : "✗"} {m}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Available Plans */}
            <div>
                <h2 className="font-semibold text-slate-800 mb-4">Change Plan</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {PLANS.map(plan => {
                        const isCurrent = school.plan === plan.id
                        return (
                            <div key={plan.id} className={cn("bg-white rounded-2xl border-2 shadow-sm p-5 relative",
                                isCurrent ? "border-violet-500" : "border-slate-200")}>
                                {isCurrent && (
                                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-violet-600 text-white text-[10px] font-bold">Current Plan</span>
                                )}
                                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", plan.color)}>
                                    <Zap size={18} className="text-white" />
                                </div>
                                <h3 className="font-bold text-slate-800">{plan.name}</h3>
                                <p className="text-2xl font-bold text-slate-800 mt-2">{plan.price}<span className="text-sm font-normal text-slate-400">{plan.period}</span></p>
                                <ul className="mt-4 space-y-1.5">
                                    {plan.features.map(f => (
                                        <li key={f} className="flex items-start gap-1.5 text-xs text-slate-600"><Check size={12} className="text-emerald-500 mt-0.5 shrink-0" />{f}</li>
                                    ))}
                                </ul>
                                <button onClick={() => handleChangePlan(plan.id)} disabled={isCurrent}
                                    className={cn("w-full mt-5 py-2 rounded-lg text-sm font-semibold transition-all",
                                        isCurrent ? "bg-slate-100 text-slate-400 cursor-default" : "border border-violet-200 text-violet-700 hover:bg-violet-50")}>
                                    {isCurrent ? "Current Plan" : "Switch to Plan"}
                                </button>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Invoices */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="font-semibold text-slate-800">Billing History</h2>
                </div>
                <table className="w-full text-sm">
                    <thead><tr className="border-b border-slate-100 bg-slate-50/50">
                        {["Invoice", "Date", "Amount", "Status", ""].map(h => <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase">{h}</th>)}
                    </tr></thead>
                    <tbody>
                        {INVOICES.map(inv => (
                            <tr key={inv.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                                <td className="px-4 py-3 font-mono text-xs text-slate-600">{inv.id}</td>
                                <td className="px-4 py-3 text-xs text-slate-500">{inv.date}</td>
                                <td className="px-4 py-3 text-xs font-semibold text-slate-700">{inv.amount}</td>
                                <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-semibold">{inv.status}</span></td>
                                <td className="px-4 py-3"><button className="text-xs text-violet-500 hover:text-violet-700 font-medium"><Download size={12} className="inline mr-1" />Download</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Confirm Modal */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowConfirm(false)}>
                    <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center" onClick={e => e.stopPropagation()}>
                        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3">
                            <Zap size={22} className="text-amber-600" />
                        </div>
                        <h3 className="font-bold text-slate-800">Change Plan?</h3>
                        <p className="text-sm text-slate-500 mt-1">
                            Switch from <strong>{currentPlanMeta.name}</strong> to <strong>{PLANS.find(p => p.id === selectedPlan)?.name}</strong>?
                        </p>
                        <p className="text-xs text-slate-400 mt-2">This will update modules and billing immediately.</p>
                        <div className="flex gap-3 mt-4">
                            <button onClick={() => setShowConfirm(false)} className="flex-1 py-2 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50">Cancel</button>
                            <button onClick={confirmChange} disabled={changing}
                                className="flex-1 py-2 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 disabled:opacity-50 flex items-center justify-center gap-2">
                                {changing ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}