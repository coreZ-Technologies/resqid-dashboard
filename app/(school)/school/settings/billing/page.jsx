"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CreditCard, Check, Zap, Shield, Calendar, Download } from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import { cn } from "@/lib/utils"

const PLANS = [
  {
    id: "module_emergency",
    name: "Emergency",
    price: "₹2,999",
    period: "/month",
    features: ["QR-based ID cards", "Emergency scan alerts", "Parent notifications", "Unlimited scans"],
    color: "bg-rose-500",
    popular: false,
  },
  {
    id: "module_attendance",
    name: "Attendance",
    price: "₹3,999",
    period: "/month",
    features: ["RFID attendance", "Real-time tracking", "Daily reports", "Parent alerts"],
    color: "bg-emerald-500",
    popular: false,
  },
  {
    id: "bundle_safety",
    name: "Safety Bundle",
    price: "₹4,999",
    period: "/month",
    features: ["Emergency + Attendance", "QR & RFID combined", "Device management", "Priority support"],
    color: "bg-violet-500",
    popular: true,
  },
  {
    id: "resqid_complete",
    name: "Complete",
    price: "₹7,999",
    period: "/month",
    features: ["All modules included", "Timetable generator", "Parent communication", "Dedicated support"],
    color: "bg-indigo-500",
    popular: false,
  },
]

const CURRENT_PLAN = {
  name: "Safety Bundle",
  price: "₹4,999/month",
  status: "Active",
  nextBilling: "2026-07-15",
  studentsLimit: 1000,
  studentsUsed: 847,
  activeModules: ["Emergency", "Attendance"],
}

const INVOICES = [
  { id: "INV-001", date: "2026-06-15", amount: "₹4,999", status: "Paid" },
  { id: "INV-002", date: "2026-05-15", amount: "₹4,999", status: "Paid" },
  { id: "INV-003", date: "2026-04-15", amount: "₹4,999", status: "Paid" },
]

export default function BillingPage() {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState(null)

  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "Settings", href: "/school/settings" }, { label: "Billing" }]} />

      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"><ArrowLeft size={18} /></button>
        <div>
          <h1 className="text-[22px] font-bold text-slate-800">Plan & Billing</h1>
          <p className="text-[13px] text-slate-500">Manage your subscription and view invoices</p>
        </div>
      </div>

      {/* Current Plan Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><CreditCard size={18} className="text-violet-600" />Current Plan</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-slate-400 uppercase">Plan</p>
            <p className="text-lg font-bold text-slate-800">{CURRENT_PLAN.name}</p>
            <p className="text-sm text-violet-600 font-semibold">{CURRENT_PLAN.price}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase">Status</p>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold mt-1"><Check size={10} />{CURRENT_PLAN.status}</span>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase">Next Billing</p>
            <p className="text-sm font-semibold text-slate-700 mt-1">{CURRENT_PLAN.nextBilling}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase">Students</p>
            <p className="text-sm font-semibold text-slate-700 mt-1">{CURRENT_PLAN.studentsUsed} / {CURRENT_PLAN.studentsLimit}</p>
            <div className="w-full h-1.5 rounded-full bg-slate-100 mt-1.5">
              <div className="h-full bg-violet-500 rounded-full" style={{ width: `${(CURRENT_PLAN.studentsUsed / CURRENT_PLAN.studentsLimit) * 100}%` }} />
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-400 uppercase mb-2">Active Modules</p>
          <div className="flex gap-2">
            {CURRENT_PLAN.activeModules.map(m => (
              <span key={m} className="px-2.5 py-1 rounded-lg bg-violet-50 text-violet-700 text-xs font-semibold border border-violet-200">{m}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Available Plans */}
      <div>
        <h2 className="font-semibold text-slate-800 mb-4">Available Plans</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLANS.map(plan => (
            <div key={plan.id} className={cn("bg-white rounded-2xl border-2 shadow-sm p-5 relative",
              plan.popular ? "border-violet-500" : "border-slate-200")}>
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-violet-600 text-white text-[10px] font-bold">Most Popular</span>
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
              <button className={cn("w-full mt-5 py-2 rounded-lg text-sm font-semibold transition-all",
                plan.popular ? "bg-violet-600 text-white hover:bg-violet-700" : "border border-slate-200 text-slate-700 hover:bg-slate-50")}>
                {plan.popular ? "Current Plan" : "Upgrade"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Invoices */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800 flex items-center gap-2"><Download size={18} className="text-violet-600" />Billing History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                {["Invoice", "Date", "Amount", "Status", ""].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
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
      </div>
    </div>
  )
}