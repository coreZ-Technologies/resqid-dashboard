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

// ── Stat Card – pure Notion style (no colored background) ─
function StatCard({ icon: Icon, value, label, sub }) {
  return (
    <div className="bg-white border border-gray-200 rounded-md p-4 flex items-start gap-3 hover:border-gray-300 transition-colors">
      <div className="w-8 h-8 rounded-md bg-gray-50 flex items-center justify-center shrink-0">
        <Icon size={16} className="text-gray-500" />
      </div>
      <div>
        <p className="text-2xl font-semibold text-gray-800 leading-tight">{value}</p>
        <p className="text-[11px] text-gray-500 mt-0.5">{label}</p>
        {sub && <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

function InvoiceStatusBadge({ status }) {
  const styles = {
    paid: {
      label: 'Paid',
      bg: 'bg-gray-50',
      text: 'text-gray-700',
      border: 'border-gray-200',
      dot: 'bg-gray-500',
    },
    pending: {
      label: 'Pending',
      bg: 'bg-gray-50',
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

      {/* Header – no changes, but ensure spacing */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Billing & Subscription</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage your plan, invoices, and payment methods</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button className="flex items-center gap-1.5 text-xs border border-gray-200 rounded-md px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-600 transition-colors">
            <Download size={12} /> Export
          </button>
          <Link
            href="/school/upgrade"
            className="flex items-center gap-1.5 text-xs bg-gradient-to-r from-violet-500 to-violet-700 hover:opacity-90 text-white rounded-md px-3 py-1.5 font-medium transition-all"
          >
            <Zap size={12} /> Upgrade Plan
          </Link>
        </div>
      </div>

      {/* Stats Cards – no colored backgrounds, only border */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon={DollarSign}
          value={`$${CURRENT_PLAN.price}`}
          label="Monthly Plan Cost"
          sub={`Billed ${CURRENT_PLAN.period}ly`}
        />
        <StatCard
          icon={FileText}
          value={`$${totalPaid}`}
          label="Paid Invoices (YTD)"
          sub="Last 12 months"
        />
        <StatCard
          icon={Calendar}
          value={`$${nextDue}`}
          label="Next Due"
          sub={`Renews on ${new Date(CURRENT_PLAN.renewalDate).toLocaleDateString()}`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Plan Card */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-md overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-sm font-medium text-gray-800">Current Plan</h2>
                <p className="text-[11px] text-gray-500 mt-0.5">Your subscription details</p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border bg-gray-50 text-gray-700 border-gray-200">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                Active
              </span>
            </div>
          </div>
          <div className="px-5 py-5">
            <div className="flex flex-wrap items-baseline justify-between gap-4 pb-4 border-b border-gray-100">
              <div>
                <p className="text-3xl font-bold text-gray-800">${CURRENT_PLAN.price}</p>
                <p className="text-[11px] text-gray-500">per {CURRENT_PLAN.period} / per school</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 rounded-md border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <Link href="/school/upgrade" className="px-3 py-1 rounded-md bg-gradient-to-r from-violet-500 to-violet-700 text-white text-xs font-medium hover:opacity-90 transition-all">
                  Change Plan
                </Link>
              </div>
            </div>

            {/* Limits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
              <div className="bg-gray-50 rounded-md p-3 border border-gray-100">
                <Users size={14} className="text-gray-500 mb-1" />
                <p className="text-lg font-semibold text-gray-700">{CURRENT_PLAN.staffLimit}</p>
                <p className="text-[10px] text-gray-500">Staff members</p>
              </div>
              <div className="bg-gray-50 rounded-md p-3 border border-gray-100">
                <Users size={14} className="text-gray-500 mb-1" />
                <p className="text-lg font-semibold text-gray-700">{CURRENT_PLAN.studentsLimit}</p>
                <p className="text-[10px] text-gray-500">Student limit</p>
              </div>
              <div className="bg-gray-50 rounded-md p-3 border border-gray-100">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 mb-1">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
                <p className="text-lg font-semibold text-gray-700">{CURRENT_PLAN.storage} GB</p>
                <p className="text-[10px] text-gray-500">Cloud storage</p>
              </div>
            </div>

            {/* Features */}
            <div className="mt-5">
              <p className="text-xs font-medium text-gray-700 mb-2">Plan features</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-3">
                {CURRENT_PLAN.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-xs text-gray-600">
                    <CheckCircle2 size={12} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-3 text-[10px] text-gray-500 border-t border-gray-100">
              Next renewal: <span className="font-medium text-gray-700">{new Date(CURRENT_PLAN.renewalDate).toLocaleDateString()}</span> — You will be charged ${CURRENT_PLAN.price}
            </div>
          </div>
        </div>

        {/* Payment Method Card */}
        <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-medium text-gray-800">Payment Method</h2>
          </div>
          <div className="p-5">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md border border-gray-100">
              <CreditCard size={20} className="text-gray-500" />
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-700 capitalize">{PAYMENT_METHOD.brand} •••• {PAYMENT_METHOD.last4}</p>
                <p className="text-[10px] text-gray-500">Expires {PAYMENT_METHOD.expiry}</p>
              </div>
              <button className="text-[10px] text-violet-600 hover:text-violet-700">Edit</button>
            </div>
            <button className="w-full mt-4 text-[11px] text-gray-600 border border-gray-200 rounded-md py-1.5 hover:bg-gray-50 transition-colors">
              + Add backup method
            </button>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <h2 className="text-sm font-medium text-gray-800">Billing History</h2>
          <button
            onClick={() => setShowAllInvoices(!showAllInvoices)}
            className="text-[11px] text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1"
          >
            {showAllInvoices ? 'Show Less' : 'View All'} <ChevronRight size={12} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left bg-gray-50/50 border-b border-gray-100">
                {['Invoice ID', 'Date', 'Amount', 'Status', 'Actions'].map((h, i) => (
                  <th key={i} className="px-5 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayedInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3 font-medium text-gray-700">{inv.id}</td>
                  <td className="px-5 py-3 text-gray-600">{new Date(inv.date).toLocaleDateString()}</td>
                  <td className="px-5 py-3 font-semibold text-gray-700">${inv.amount.toFixed(2)}</td>
                  <td className="px-5 py-3"><InvoiceStatusBadge status={inv.status} /></td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button className="p-1 rounded hover:bg-gray-100 text-gray-500 transition-colors">
                        <Eye size={12} />
                      </button>
                      <button className="p-1 rounded hover:bg-gray-100 text-gray-500 transition-colors">
                        <Download size={12} />
                      </button>
                      <button className="p-1 rounded hover:bg-gray-100 text-gray-500 transition-colors">
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
          <div className="px-5 py-2.5 border-t border-gray-100 text-center">
            <button onClick={() => setShowAllInvoices(true)} className="text-[11px] text-violet-600 font-medium">
              + Show {INVOICES.length - 3} more invoices
            </button>
          </div>
        )}
      </div>

      {/* Sales Banner – subtle gray with violet accent */}
      <div className="bg-gray-50 border border-gray-200 rounded-md p-5 flex items-start gap-4">
        <AlertCircle size={18} className="text-violet-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-gray-800">Need a custom plan?</p>
          <p className="text-xs text-gray-600 mt-0.5">
            Contact our sales team for enterprise pricing, on‑premise deployment, or custom features.
          </p>
          <button className="mt-2 text-xs font-medium text-violet-600 hover:text-violet-700 underline underline-offset-2">
            Contact Sales →
          </button>
        </div>
      </div>
    </div>
  )
}