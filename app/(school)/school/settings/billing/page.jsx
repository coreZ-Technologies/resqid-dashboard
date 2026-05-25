// app/(school)/school/settings/billing/page.jsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  CreditCard, Download, Eye, MoreHorizontal, AlertCircle,
  Calendar, DollarSign, FileText, Users, Zap,
  CheckCircle2, ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Data ─────────────────────────────────────────────────
const CURRENT_PLAN = {
  name: 'Pro School Plan',
  price: 99,
  period: 'month',
  studentsLimit: 500,
  staffLimit: 50,
  storage: 100,
  features: [
    'Unlimited attendance tracking',
    'Advanced analytics & reports',
    'Emergency SOS alerts',
    'Parent communication portal',
    '24/7 priority support',
    'Custom branding',
  ],
  renewalDate: '2025-07-15',
  status: 'active',
}

const INVOICES = [
  { id: 'INV-2025-001', date: '2025-04-01', amount: 99.00, status: 'paid' },
  { id: 'INV-2025-002', date: '2025-05-01', amount: 99.00, status: 'paid' },
  { id: 'INV-2025-003', date: '2025-06-01', amount: 99.00, status: 'paid' },
  { id: 'INV-2025-004', date: '2025-07-01', amount: 99.00, status: 'pending' },
]

const PAYMENT_METHOD = {
  brand: 'visa',
  last4: '4242',
  expiry: '08/2027',
  name: 'Springdale School',
}

// ── Stat Card (matches activity log card styling) ────────
function StatCard({ icon: Icon, iconBg, iconColor, value, label, sub }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
      <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center shrink-0', iconBg)}>
        <Icon size={18} className={iconColor} />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900 leading-tight">{value}</p>
        <p className="text-[12px] text-slate-400 mt-0.5">{label}</p>
        {sub && <p className="text-[11px] text-slate-300 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

function InvoiceStatusBadge({ status }) {
  const styles = {
    paid: {
      label: 'Paid',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      dot: 'bg-emerald-500',
    },
    pending: {
      label: 'Pending',
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      dot: 'bg-amber-500',
    },
  }
  const s = styles[status] || styles.paid
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium border', s.bg, s.text, s.border)}>
      <span className={cn('w-1.5 h-1.5 rounded-full', s.dot)} />
      {s.label}
    </span>
  )
}

// ── Main Component ───────────────────────────────────────
export default function BillingPage() {
  const [showAllInvoices, setShowAllInvoices] = useState(false)
  const displayedInvoices = showAllInvoices ? INVOICES : INVOICES.slice(0, 3)

  const totalPaid = INVOICES.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0)
  const nextDue = INVOICES.find(i => i.status === 'pending')?.amount || CURRENT_PLAN.price

  return (
    <div className="space-y-6">

      {/* Header (matches activity log) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Billing & Subscription</h1>
          <p className="text-[13px] text-slate-400 mt-0.5">Manage your plan, invoices, and payment methods</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button className="flex items-center gap-2 text-[13px] border border-slate-200 rounded-lg px-3 py-2 bg-white hover:bg-slate-50 text-slate-500 transition-colors">
            <Download size={13} /> Export
          </button>
          <Link
            href="/school/upgrade"
            className="flex items-center gap-2 text-[13px] bg-blue-700 hover:bg-blue-800 text-white rounded-lg px-4 py-2 font-medium transition-colors"
          >
            <Zap size={13} /> Upgrade Plan
          </Link>
        </div>
      </div>

      {/* Stats Cards – all blue accents (matching activity log stat cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon={DollarSign}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          value={`$${CURRENT_PLAN.price}`}
          label="Monthly Plan Cost"
          sub={`Billed ${CURRENT_PLAN.period}ly`}
        />
        <StatCard
          icon={FileText}
          iconBg="bg-indigo-50"
          iconColor="text-indigo-600"
          value={`$${totalPaid}`}
          label="Paid Invoices (YTD)"
          sub="Last 12 months"
        />
        <StatCard
          icon={Calendar}
          iconBg="bg-sky-50"
          iconColor="text-sky-600"
          value={`$${nextDue}`}
          label="Next Due"
          sub={`Renews on ${new Date(CURRENT_PLAN.renewalDate).toLocaleDateString()}`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Plan Card */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-[16px] font-semibold text-slate-800">Current Plan</h2>
                <p className="text-[12px] text-slate-400 mt-0.5">Your subscription details</p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium border bg-emerald-50 text-emerald-700 border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Active
              </span>
            </div>
          </div>
          <div className="px-6 py-5">
            <div className="flex flex-wrap items-baseline justify-between gap-4 pb-5 border-b border-slate-100">
              <div>
                <p className="text-[26px] font-bold text-slate-900">${CURRENT_PLAN.price}</p>
                <p className="text-[12px] text-slate-400">per {CURRENT_PLAN.period} / per school</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-[12px] font-medium hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <Link href="/school/upgrade" className="px-4 py-2 rounded-lg bg-blue-700 text-white text-[12px] font-medium hover:bg-blue-800 transition-colors">
                  Change Plan
                </Link>
              </div>
            </div>

            {/* Limits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <Users size={14} className="text-slate-400 mb-1" />
                <p className="text-[18px] font-bold text-slate-700">{CURRENT_PLAN.staffLimit}</p>
                <p className="text-[10px] text-slate-400">Staff members</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <Users size={14} className="text-slate-400 mb-1" />
                <p className="text-[18px] font-bold text-slate-700">{CURRENT_PLAN.studentsLimit}</p>
                <p className="text-[10px] text-slate-400">Student limit</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 mb-1">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
                <p className="text-[18px] font-bold text-slate-700">{CURRENT_PLAN.storage} GB</p>
                <p className="text-[10px] text-slate-400">Cloud storage</p>
              </div>
            </div>

            {/* Features */}
            <div className="mt-6">
              <p className="text-[12px] font-semibold text-slate-700 mb-3">Plan features</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CURRENT_PLAN.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-[12px] text-slate-600">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 text-[11px] text-slate-400 border-t border-slate-100">
              Next renewal: <span className="font-medium text-slate-600">{new Date(CURRENT_PLAN.renewalDate).toLocaleDateString()}</span> — You will be charged ${CURRENT_PLAN.price}
            </div>
          </div>
        </div>

        {/* Payment Method Card */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-5 border-b border-slate-100">
            <h2 className="text-[14px] font-semibold text-slate-700">Payment Method</h2>
          </div>
          <div className="p-5">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <CreditCard size={24} className="text-slate-500" />
              <div className="flex-1">
                <p className="text-[13px] font-medium text-slate-700 capitalize">{PAYMENT_METHOD.brand} •••• {PAYMENT_METHOD.last4}</p>
                <p className="text-[11px] text-slate-400">Expires {PAYMENT_METHOD.expiry}</p>
              </div>
              <button className="text-[11px] text-blue-600 hover:text-blue-700 font-medium">Edit</button>
            </div>
            <button className="w-full mt-4 text-[12px] text-slate-500 border border-slate-200 rounded-lg py-2 hover:bg-slate-50 transition-colors">
              + Add backup method
            </button>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-[14px] font-semibold text-slate-700">Billing History</h2>
          <button
            onClick={() => setShowAllInvoices(!showAllInvoices)}
            className="text-[12px] text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            {showAllInvoices ? 'Show Less' : 'View All'} <ChevronRight size={12} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="text-left bg-slate-50/60">
                {['Invoice ID', 'Date', 'Amount', 'Status', 'Actions'].map((h, i) => (
                  <th key={i} className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {displayedInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-slate-700">{inv.id}</td>
                  <td className="px-5 py-3.5 text-slate-500">{new Date(inv.date).toLocaleDateString()}</td>
                  <td className="px-5 py-3.5 font-semibold text-slate-700">${inv.amount.toFixed(2)}</td>
                  <td className="px-5 py-3.5"><InvoiceStatusBadge status={inv.status} /></td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors">
                        <Eye size={12} />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                        <Download size={12} />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                        <MoreHorizontal size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!showAllInvoices && INVOICES.length > 3 && (
          <div className="px-6 py-3 border-t border-slate-100 text-center">
            <button onClick={() => setShowAllInvoices(true)} className="text-[12px] text-blue-600 font-medium">
              + Show {INVOICES.length - 3} more invoices
            </button>
          </div>
        )}
      </div>

      {/* Sales Banner (info style) */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex items-start gap-4">
        <AlertCircle size={18} className="text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-[13px] font-semibold text-blue-800">Need a custom plan?</p>
          <p className="text-[12px] text-blue-700 mt-0.5">
            Contact our sales team for enterprise pricing, on‑premise deployment, or custom features.
          </p>
          <button className="mt-3 text-[12px] font-medium text-blue-800 underline underline-offset-2 hover:text-blue-900">
            Contact Sales →
          </button>
        </div>
      </div>
    </div>
  )
}