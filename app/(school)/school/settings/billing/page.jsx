'use client'

import { useState } from 'react'
import {
  CreditCard, CheckCircle2, Zap, Shield, Building2,
  Star, ArrowRight, Download, Clock, AlertCircle,
  ChevronRight, Sparkles, Users, Bell, CalendarCheck,
  MessageCircle, AlertTriangle, BarChart2, Check, X,
  Receipt, TrendingUp, Lock, Info
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Mock data (replace with real API calls) ──────────────────────────────────
const CURRENT_PLAN = 'standard'

const PLANS_CONFIG = [
  {
    id: 'basic',
    name: 'Basic',
    price: 999,
    annualPrice: 799,
    color: 'slate',
    accent: '#64748b',
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    badge: 'bg-slate-100 text-slate-600',
    description: 'Essential tools for small schools',
    maxStudents: 200,
    maxTeachers: 20,
    modules: ['attendance'],
    features: [
      'Attendance tracking',
      'Basic reports',
      'Email notifications',
      'Parent portal (view only)',
      '5 GB storage',
      'Email support',
    ],
    notIncluded: ['Timetable management', 'Emergency alerts', 'Parent communication', 'Advanced analytics'],
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 1999,
    annualPrice: 1599,
    color: 'blue',
    accent: '#2563eb',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-700',
    description: 'Perfect for growing institutions',
    maxStudents: 800,
    maxTeachers: 60,
    modules: ['attendance', 'timetable'],
    popular: true,
    features: [
      'Everything in Basic',
      'Timetable management',
      'Substitute scheduling',
      'Advanced reports & analytics',
      'Push + SMS notifications',
      '20 GB storage',
      'Priority email support',
    ],
    notIncluded: ['Emergency alerts', 'Parent communication'],
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 3499,
    annualPrice: 2799,
    color: 'violet',
    accent: '#7c3aed',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    badge: 'bg-violet-100 text-violet-700',
    description: 'Advanced safety & management',
    maxStudents: 2000,
    maxTeachers: 150,
    modules: ['attendance', 'timetable', 'emergency'],
    features: [
      'Everything in Standard',
      'Emergency alert system',
      'SOS zones & mapping',
      'Real-time safety dashboard',
      'Incident logs & reports',
      '50 GB storage',
      'Phone & chat support',
    ],
    notIncluded: ['Parent communication suite'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 5999,
    annualPrice: 4799,
    color: 'indigo',
    accent: '#4338ca',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    badge: 'bg-indigo-100 text-indigo-700',
    description: 'Complete platform for large schools',
    maxStudents: 99999,
    maxTeachers: 99999,
    modules: ['attendance', 'timetable', 'emergency', 'communication'],
    features: [
      'Everything in Professional',
      'Parent communication suite',
      'Broadcast messaging',
      'Two-way parent messaging',
      'Unlimited storage',
      'Dedicated account manager',
      '24/7 priority support',
      'Custom integrations',
    ],
    notIncluded: [],
  },
]

const MODULE_ICONS = {
  attendance: CalendarCheck,
  timetable: Clock,
  emergency: AlertTriangle,
  communication: MessageCircle,
}

const INVOICES = [
  { id: 'INV-2026-005', date: 'May 1, 2026', amount: 1999, status: 'paid', period: 'May 2026' },
  { id: 'INV-2026-004', date: 'Apr 1, 2026', amount: 1999, status: 'paid', period: 'Apr 2026' },
  { id: 'INV-2026-003', date: 'Mar 1, 2026', amount: 1999, status: 'paid', period: 'Mar 2026' },
  { id: 'INV-2026-002', date: 'Feb 1, 2026', amount: 1999, status: 'paid', period: 'Feb 2026' },
  { id: 'INV-2026-001', date: 'Jan 1, 2026', amount: 1999, status: 'paid', period: 'Jan 2026' },
]

const USAGE = {
  students: { used: 432, max: 800 },
  teachers: { used: 28, max: 60 },
  storage: { used: 8.4, max: 20, unit: 'GB' },
  notifications: { used: 22904, max: 50000 },
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function UsageBar({ used, max, color = 'blue' }) {
  const pct = Math.min((used / max) * 100, 100)
  const warn = pct > 80
  const crit = pct > 95
  return (
    <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
      <div
        className={cn(
          'h-full rounded-full transition-all duration-700',
          crit ? 'bg-red-500' : warn ? 'bg-amber-500' : `bg-${color}-500`
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

function PlanCard({ plan, isCurrent, isDowngrade, onSelect, annual }) {
  const price = annual ? plan.annualPrice : plan.price
  const colorMap = {
    slate: { ring: 'ring-slate-300', btn: 'bg-slate-700 hover:bg-slate-800', text: 'text-slate-700' },
    blue: { ring: 'ring-blue-400', btn: 'bg-blue-600 hover:bg-blue-700', text: 'text-blue-700' },
    violet: { ring: 'ring-violet-400', btn: 'bg-violet-600 hover:bg-violet-700', text: 'text-violet-700' },
    indigo: { ring: 'ring-indigo-400', btn: 'bg-indigo-600 hover:bg-indigo-700', text: 'text-indigo-700' },
  }
  const cm = colorMap[plan.color]

  return (
    <div className={cn(
      'relative flex flex-col rounded-2xl border bg-white p-6 transition-all duration-200',
      isCurrent
        ? `ring-2 ${cm.ring} border-transparent shadow-lg`
        : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
    )}>
      {plan.popular && !isCurrent && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-blue-600 text-white text-[10px] font-semibold px-3 py-1 rounded-full flex items-center gap-1">
            <Star size={9} fill="currentColor" /> Most Popular
          </span>
        </div>
      )}
      {isCurrent && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className={cn('text-[10px] font-semibold px-3 py-1 rounded-full flex items-center gap-1', plan.badge)}>
            <CheckCircle2 size={9} /> Current Plan
          </span>
        </div>
      )}

      <div className="mb-4">
        <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full', plan.badge)}>{plan.name}</span>
        <p className="text-slate-500 text-xs mt-2">{plan.description}</p>
      </div>

      <div className="mb-5">
        <div className="flex items-end gap-1">
          <span className="text-3xl font-bold text-slate-900">₹{price.toLocaleString()}</span>
          <span className="text-slate-400 text-sm mb-1">/mo</span>
        </div>
        {annual && (
          <p className="text-xs text-emerald-600 font-medium mt-0.5">
            Save ₹{((plan.price - plan.annualPrice) * 12).toLocaleString()}/yr
          </p>
        )}
      </div>

      <div className="space-y-1.5 mb-5 flex-1">
        {plan.features.map(f => (
          <div key={f} className="flex items-start gap-2 text-xs text-slate-600">
            <Check size={12} className={cn('mt-0.5 shrink-0', cm.text)} />
            {f}
          </div>
        ))}
        {plan.notIncluded.map(f => (
          <div key={f} className="flex items-start gap-2 text-xs text-slate-300">
            <X size={12} className="mt-0.5 shrink-0" />
            {f}
          </div>
        ))}
      </div>

      <div className="text-xs text-slate-400 mb-4 space-y-1">
        <div>Up to {plan.maxStudents === 99999 ? 'Unlimited' : plan.maxStudents.toLocaleString()} students</div>
        <div>Up to {plan.maxTeachers === 99999 ? 'Unlimited' : plan.maxTeachers.toLocaleString()} teachers</div>
      </div>

      {isCurrent ? (
        <button disabled className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-400 text-sm font-medium cursor-not-allowed">
          Current Plan
        </button>
      ) : (
        <button
          onClick={() => onSelect(plan)}
          className={cn(
            'w-full py-2.5 rounded-xl text-white text-sm font-medium transition-colors flex items-center justify-center gap-1.5',
            cm.btn
          )}
        >
          {isDowngrade ? 'Downgrade' : 'Upgrade'}
          <ArrowRight size={14} />
        </button>
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function BillingPage() {
  const [annual, setAnnual] = useState(false)
  const [tab, setTab] = useState('overview') // overview | plans | invoices
  const [confirmPlan, setConfirmPlan] = useState(null)

  const currentPlan = PLANS_CONFIG.find(p => p.id === CURRENT_PLAN)
  const planIdx = PLANS_CONFIG.findIndex(p => p.id === CURRENT_PLAN)

  const nextRenewal = 'June 1, 2026'
  const paymentMethod = '•••• •••• •••• 4242'

  function handleSelectPlan(plan) {
    setConfirmPlan(plan)
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Header ── */}
      <div className="bg-white border-b border-slate-200 px-8 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Billing & Plan</h1>
            <p className="text-slate-500 text-sm mt-0.5">Manage your subscription and payment details</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors">
            <Zap size={14} />
            Upgrade Plan
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-5">
          {['overview', 'plans', 'invoices'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-lg capitalize transition-colors',
                tab === t
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="px-8 py-6 max-w-7xl mx-auto space-y-6">

        {/* ══════════════════ OVERVIEW TAB ══════════════════ */}
        {tab === 'overview' && (
          <>
            {/* Current plan banner */}
            <div className={cn(
              'rounded-2xl border p-6 flex items-start justify-between gap-4',
              currentPlan.bg, currentPlan.border
            )}>
              <div className="flex items-start gap-4">
                <div className={cn('p-3 rounded-xl', currentPlan.badge)}>
                  <Shield size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-slate-900">{currentPlan.name} Plan</h2>
                    <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', currentPlan.badge)}>
                      Active
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm mt-1">{currentPlan.description}</p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} className="text-slate-400" />
                      Renews {nextRenewal}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CreditCard size={13} className="text-slate-400" />
                      {paymentMethod}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-2xl font-bold text-slate-900">₹{currentPlan.price.toLocaleString()}</p>
                <p className="text-slate-400 text-xs">per month</p>
                <button
                  onClick={() => setTab('plans')}
                  className="mt-3 flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 ml-auto"
                >
                  View all plans <ChevronRight size={12} />
                </button>
              </div>
            </div>

            {/* Active modules */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Active Modules</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['attendance', 'timetable', 'emergency', 'communication'].map(mod => {
                  const Icon = MODULE_ICONS[mod]
                  const active = currentPlan.modules.includes(mod)
                  const requiredPlan = PLANS_CONFIG.find(p => p.modules.includes(mod))
                  return (
                    <div
                      key={mod}
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-xl border',
                        active
                          ? 'bg-blue-50 border-blue-200'
                          : 'bg-slate-50 border-slate-200 opacity-60'
                      )}
                    >
                      <Icon size={16} className={active ? 'text-blue-600' : 'text-slate-400'} />
                      <div className="min-w-0">
                        <p className={cn('text-xs font-medium capitalize truncate', active ? 'text-blue-900' : 'text-slate-400')}>
                          {mod}
                        </p>
                        {!active && (
                          <p className="text-[10px] text-slate-400 flex items-center gap-0.5">
                            <Lock size={8} /> {requiredPlan?.name}+
                          </p>
                        )}
                      </div>
                      {active
                        ? <CheckCircle2 size={13} className="text-blue-500 ml-auto shrink-0" />
                        : <Lock size={13} className="text-slate-300 ml-auto shrink-0" />
                      }
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Usage */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold text-slate-900">Usage This Month</h3>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Info size={11} /> Resets Jun 1, 2026
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  { key: 'students', label: 'Students', icon: Users, color: 'blue' },
                  { key: 'teachers', label: 'Teachers', icon: Users, color: 'violet' },
                  { key: 'notifications', label: 'Notifications Sent', icon: Bell, color: 'amber' },
                  { key: 'storage', label: 'Storage Used', icon: BarChart2, color: 'emerald' },
                ].map(({ key, label, icon: Icon, color }) => {
                  const u = USAGE[key]
                  const pct = Math.round((u.used / u.max) * 100)
                  const warn = pct > 80
                  return (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-slate-600 flex items-center gap-1.5">
                          <Icon size={12} className="text-slate-400" /> {label}
                        </span>
                        <span className={cn('text-xs font-medium', warn ? 'text-amber-600' : 'text-slate-500')}>
                          {u.used.toLocaleString()} / {u.max.toLocaleString()}{u.unit ? ` ${u.unit}` : ''} ({pct}%)
                        </span>
                      </div>
                      <UsageBar used={u.used} max={u.max} color={color} />
                      {warn && (
                        <p className="text-[10px] text-amber-600 mt-1 flex items-center gap-1">
                          <AlertCircle size={9} /> Approaching limit — consider upgrading
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Payment method + next invoice */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">Payment Method</h3>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm">
                    <CreditCard size={18} className="text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">Visa {paymentMethod}</p>
                    <p className="text-xs text-slate-400">Expires 08/2028</p>
                  </div>
                  <button className="ml-auto text-xs text-blue-600 hover:text-blue-700 font-medium">Update</button>
                </div>
                <button className="mt-3 text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1">
                  <CreditCard size={11} /> Add payment method
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">Next Invoice</h3>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-2xl font-bold text-slate-900">₹{currentPlan.price.toLocaleString()}</p>
                    <p className="text-xs text-slate-400 mt-1">Due on {nextRenewal}</p>
                    <div className="mt-3 space-y-1">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{currentPlan.name} Plan × 1 month</span>
                        <span>₹{currentPlan.price.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>GST (18%)</span>
                        <span>₹{Math.round(currentPlan.price * 0.18).toLocaleString()}</span>
                      </div>
                      <div className="border-t border-slate-100 pt-1 flex items-center justify-between text-xs font-semibold text-slate-700">
                        <span>Total</span>
                        <span>₹{Math.round(currentPlan.price * 1.18).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Upgrade nudge if not enterprise */}
            {CURRENT_PLAN !== 'enterprise' && (
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <p className="font-semibold text-lg flex items-center gap-2">
                      <TrendingUp size={18} /> Unlock more with {PLANS_CONFIG[planIdx + 1]?.name}
                    </p>
                    <p className="text-blue-200 text-sm mt-1">
                      {PLANS_CONFIG[planIdx + 1]?.features[1]} and more — starting at ₹{PLANS_CONFIG[planIdx + 1]?.price.toLocaleString()}/mo
                    </p>
                  </div>
                  <button
                    onClick={() => setTab('plans')}
                    className="flex items-center gap-2 bg-white text-blue-700 text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-colors shrink-0"
                  >
                    <Sparkles size={14} /> View Plans
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* ══════════════════ PLANS TAB ══════════════════ */}
        {tab === 'plans' && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-900">Choose a Plan</h2>
                <p className="text-slate-500 text-sm">All prices in INR. Switch plans anytime.</p>
              </div>
              {/* Annual toggle */}
              <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-2">
                <span className={cn('text-sm', !annual ? 'text-slate-900 font-medium' : 'text-slate-400')}>Monthly</span>
                <button
                  onClick={() => setAnnual(!annual)}
                  className={cn(
                    'relative w-10 h-5 rounded-full transition-colors',
                    annual ? 'bg-blue-600' : 'bg-slate-200'
                  )}
                >
                  <span className={cn(
                    'absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform',
                    annual ? 'translate-x-5' : 'translate-x-0.5'
                  )} />
                </button>
                <span className={cn('text-sm', annual ? 'text-slate-900 font-medium' : 'text-slate-400')}>
                  Annual
                  <span className="ml-1.5 text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-semibold">−20%</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 pt-2">
              {PLANS_CONFIG.map((plan, i) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  isCurrent={plan.id === CURRENT_PLAN}
                  isDowngrade={i < planIdx}
                  onSelect={handleSelectPlan}
                  annual={annual}
                />
              ))}
            </div>

            {/* Feature matrix */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mt-2">
              <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="text-sm font-semibold text-slate-900">Feature Comparison</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 w-48">Feature</th>
                      {PLANS_CONFIG.map(p => (
                        <th key={p.id} className="px-4 py-3 text-xs font-semibold text-slate-500 text-center">
                          <span className={cn('px-2 py-0.5 rounded-full', p.badge)}>{p.name}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: 'Attendance', key: 'attendance' },
                      { label: 'Timetable', key: 'timetable' },
                      { label: 'Emergency Alerts', key: 'emergency' },
                      { label: 'Parent Communication', key: 'communication' },
                      { label: 'Reports & Analytics', key: 'reports' },
                      { label: 'Push Notifications', key: 'push' },
                      { label: 'Priority Support', key: 'support' },
                    ].map((row, ri) => (
                      <tr key={row.key} className={ri % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'}>
                        <td className="px-6 py-3 text-xs text-slate-600 font-medium">{row.label}</td>
                        {PLANS_CONFIG.map(p => {
                          const has = p.modules.includes(row.key) ||
                            (row.key === 'reports' && p.id !== 'basic') ||
                            (row.key === 'push' && ['standard','professional','enterprise'].includes(p.id)) ||
                            (row.key === 'support' && ['professional','enterprise'].includes(p.id)) ||
                            (row.key === 'attendance')
                          return (
                            <td key={p.id} className="px-4 py-3 text-center">
                              {has
                                ? <Check size={14} className="mx-auto text-emerald-500" />
                                : <X size={14} className="mx-auto text-slate-200" />
                              }
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                    <tr className="border-t border-slate-100">
                      <td className="px-6 py-3 text-xs text-slate-600 font-medium">Max Students</td>
                      {PLANS_CONFIG.map(p => (
                        <td key={p.id} className="px-4 py-3 text-center text-xs text-slate-500">
                          {p.maxStudents === 99999 ? '∞' : p.maxStudents.toLocaleString()}
                        </td>
                      ))}
                    </tr>
                    <tr className="bg-slate-50/50">
                      <td className="px-6 py-3 text-xs text-slate-600 font-medium">Max Teachers</td>
                      {PLANS_CONFIG.map(p => (
                        <td key={p.id} className="px-4 py-3 text-center text-xs text-slate-500">
                          {p.maxTeachers === 99999 ? '∞' : p.maxTeachers.toLocaleString()}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ══════════════════ INVOICES TAB ══════════════════ */}
        {tab === 'invoices' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Invoice History</h3>
                <p className="text-xs text-slate-400 mt-0.5">Download invoices for your records</p>
              </div>
              <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                <Download size={12} /> Export All
              </button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500">Invoice</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Period</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Amount</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Status</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody>
                {INVOICES.map((inv, i) => (
                  <tr key={inv.id} className={cn('border-b border-slate-50', i % 2 === 0 ? '' : 'bg-slate-50/30')}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-slate-100 rounded-lg">
                          <Receipt size={13} className="text-slate-500" />
                        </div>
                        <span className="text-xs font-mono text-slate-700">{inv.id}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-600">{inv.period}</td>
                    <td className="px-4 py-4 text-xs text-slate-500">{inv.date}</td>
                    <td className="px-4 py-4 text-xs font-semibold text-slate-800">
                      ₹{inv.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                        <CheckCircle2 size={9} /> Paid
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium ml-auto">
                        <Download size={12} /> PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Confirm plan change modal ── */}
      {confirmPlan && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-6">
            <h3 className="text-base font-semibold text-slate-900">
              {PLANS_CONFIG.findIndex(p => p.id === confirmPlan.id) > planIdx ? 'Upgrade' : 'Downgrade'} to {confirmPlan.name}?
            </h3>
            <p className="text-sm text-slate-500 mt-2">
              You'll be switched to the <strong>{confirmPlan.name}</strong> plan at{' '}
              <strong>₹{(annual ? confirmPlan.annualPrice : confirmPlan.price).toLocaleString()}/month</strong>.
              Changes take effect immediately and are prorated.
            </p>

            {PLANS_CONFIG.findIndex(p => p.id === confirmPlan.id) < planIdx && (
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 flex items-start gap-2">
                <AlertCircle size={13} className="shrink-0 mt-0.5" />
                Downgrading will disable modules not included in {confirmPlan.name}. Some data may become inaccessible.
              </div>
            )}

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setConfirmPlan(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // TODO: call API to change plan
                  setConfirmPlan(null)
                }}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
              >
                Confirm Change
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}