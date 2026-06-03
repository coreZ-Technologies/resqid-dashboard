'use client';

/**
 * SCHOOL ADMIN — SUBSCRIPTION
 * Place at: app/(school)/school/settings/billing/page.jsx
 */

import { useState } from 'react';
import {
    CreditCard, Check, X, Zap, Shield, Star,
    ChevronDown, Loader2, Download, Calendar,
    AlertTriangle, CheckCircle, Clock, ArrowUpRight,
    Users, BookOpen, Bell, BarChart2, Lock, Unlock
} from 'lucide-react';

// ─── Plans ────────────────────────────────────────────────────────────────────
const PLANS = [
    {
        id: 'basic',
        name: 'Basic',
        price: 2999,
        period: 'per month',
        color: 'bg-slate-600',
        light: 'bg-slate-50',
        border: 'border-slate-200',
        accent: 'text-slate-700',
        icon: <Shield size={22} className="text-white" />,
        description: 'For small schools just getting started',
        features: [
            { text: 'Up to 500 students',         included: true  },
            { text: 'QR attendance',               included: true  },
            { text: 'Basic scan logs',             included: true  },
            { text: 'Email notifications',         included: true  },
            { text: 'Parent messaging',            included: false },
            { text: 'Advanced reports',            included: false },
            { text: 'RFID devices',                included: false },
            { text: 'Priority support',            included: false },
        ],
    },
    {
        id: 'pro',
        name: 'Pro',
        price: 5999,
        period: 'per month',
        color: 'bg-blue-600',
        light: 'bg-blue-50',
        border: 'border-blue-300',
        accent: 'text-blue-700',
        icon: <Zap size={22} className="text-white" />,
        badge: 'Most Popular',
        description: 'For growing schools with advanced needs',
        features: [
            { text: 'Up to 2,000 students',       included: true  },
            { text: 'QR attendance',               included: true  },
            { text: 'Full scan logs & analytics',  included: true  },
            { text: 'SMS + Email notifications',   included: true  },
            { text: 'Parent messaging',            included: true  },
            { text: 'Advanced reports',            included: true  },
            { text: 'RFID devices (2 devices)',    included: false },
            { text: 'Priority support',            included: false },
        ],
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        price: 11999,
        period: 'per month',
        color: 'bg-violet-600',
        light: 'bg-violet-50',
        border: 'border-violet-300',
        accent: 'text-violet-700',
        icon: <Star size={22} className="text-white" />,
        description: 'For large schools needing full control',
        features: [
            { text: 'Unlimited students',          included: true  },
            { text: 'QR attendance',               included: true  },
            { text: 'Full scan logs & analytics',  included: true  },
            { text: 'SMS + Email + WhatsApp',      included: true  },
            { text: 'Parent messaging',            included: true  },
            { text: 'Advanced reports',            included: true  },
            { text: 'Unlimited RFID devices',      included: true  },
            { text: 'Priority support',            included: true  },
        ],
    },
];

// ─── Mock billing history ─────────────────────────────────────────────────────
const BILLING_HISTORY = [
    { id: 'inv1', date: '2026-05-01', amount: 5999, status: 'Paid',   invoice: 'INV-2026-05' },
    { id: 'inv2', date: '2026-04-01', amount: 5999, status: 'Paid',   invoice: 'INV-2026-04' },
    { id: 'inv3', date: '2026-03-01', amount: 5999, status: 'Paid',   invoice: 'INV-2026-03' },
    { id: 'inv4', date: '2026-02-01', amount: 5999, status: 'Paid',   invoice: 'INV-2026-02' },
    { id: 'inv5', date: '2026-01-01', amount: 3999, status: 'Paid',   invoice: 'INV-2026-01' },
];

// ─── Current plan mock ────────────────────────────────────────────────────────
const CURRENT = {
    planId:     'pro',
    renewsOn:   '2026-06-01',
    startedOn:  '2025-06-01',
    students:   1247,
    maxStudents:2000,
    card:       '•••• •••• •••• 4242',
    cardBrand:  'Visa',
};

// ─── Plan Card ────────────────────────────────────────────────────────────────
const PlanCard = ({ plan, isCurrent, onUpgrade, upgrading }) => {
    const isHigher = PLANS.findIndex(p => p.id === plan.id) > PLANS.findIndex(p => p.id === CURRENT.planId);
    const isLower  = PLANS.findIndex(p => p.id === plan.id) < PLANS.findIndex(p => p.id === CURRENT.planId);

    return (
        <div className={`relative bg-white rounded-2xl border-2 shadow-sm overflow-hidden transition-all ${isCurrent ? plan.border + ' shadow-md' : 'border-slate-200 hover:border-slate-300'}`}>
            {plan.badge && (
                <div className="absolute top-4 right-4">
                    <span className="px-2.5 py-1 rounded-full bg-blue-600 text-white text-xs font-bold">{plan.badge}</span>
                </div>
            )}
            {isCurrent && (
                <div className="absolute top-4 right-4">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold">Current Plan</span>
                </div>
            )}

            {/* Header */}
            <div className={`px-6 pt-6 pb-4`}>
                <div className={`w-12 h-12 rounded-xl ${plan.color} flex items-center justify-center mb-4`}>
                    {plan.icon}
                </div>
                <h3 className="font-bold text-slate-900 text-xl mb-1">{plan.name}</h3>
                <p className="text-sm text-slate-500 mb-4">{plan.description}</p>
                <div className="flex items-end gap-1 mb-1">
                    <span className="text-3xl font-bold text-slate-900">₹{plan.price.toLocaleString('en-IN')}</span>
                    <span className="text-sm text-slate-400 mb-1">/{plan.period}</span>
                </div>
            </div>

            <div className="px-6 pb-6">
                {/* Features */}
                <ul className="space-y-2.5 mb-6">
                    {plan.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2.5 text-sm">
                            {f.included
                                ? <CheckCircle size={15} className="text-emerald-500 shrink-0" />
                                : <X size={15} className="text-slate-300 shrink-0" />}
                            <span className={f.included ? 'text-slate-700' : 'text-slate-400'}>{f.text}</span>
                        </li>
                    ))}
                </ul>

                {/* CTA */}
                {isCurrent ? (
                    <button disabled className="w-full py-2.5 rounded-xl border-2 border-emerald-300 bg-emerald-50 text-emerald-700 text-sm font-semibold flex items-center justify-center gap-2 cursor-default">
                        <CheckCircle size={15} /> Current Plan
                    </button>
                ) : isHigher ? (
                    <button onClick={() => onUpgrade(plan.id)} disabled={upgrading === plan.id}
                        className={`w-full py-2.5 rounded-xl ${plan.color} hover:opacity-90 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-opacity`}>
                        {upgrading === plan.id ? <Loader2 size={15} className="animate-spin" /> : <ArrowUpRight size={15} />}
                        Upgrade to {plan.name}
                    </button>
                ) : (
                    <button disabled className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-400 text-sm font-medium cursor-not-allowed">
                        Downgrade
                    </button>
                )}
            </div>
        </div>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SubscriptionPage() {
    const [billing, setBilling]   = useState('monthly');
    const [upgrading, setUpgrading] = useState(null);
    const [showCancel, setShowCancel] = useState(false);

    const currentPlan = PLANS.find(p => p.id === CURRENT.planId);
    const usage = Math.round((CURRENT.students / CURRENT.maxStudents) * 100);

    const handleUpgrade = async (planId) => {
        setUpgrading(planId);
        await new Promise(r => setTimeout(r, 1200));
        setUpgrading(null);
    };

    return (
        <div className="max-w-[1300px]">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h1 className="text-[1.375rem] font-bold text-slate-900 m-0">Subscription</h1>
                    <p className="text-sm text-slate-500 mt-1">Plan & billing management</p>
                </div>
            </div>

            {/* Current Plan Summary */}
            <div className={`bg-white rounded-2xl border-2 ${currentPlan.border} shadow-sm p-6 mb-6`}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl ${currentPlan.color} flex items-center justify-center shrink-0`}>
                            {currentPlan.icon}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h2 className="text-xl font-bold text-slate-900">{currentPlan.name} Plan</h2>
                                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">Active</span>
                            </div>
                            <p className="text-sm text-slate-500">
                                ₹{currentPlan.price.toLocaleString('en-IN')}/month · Renews on{' '}
                                {new Date(CURRENT.renewsOn).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">
                            <CreditCard size={15} /> Update Payment
                        </button>
                        <button onClick={() => setShowCancel(true)}
                            className="px-4 py-2 rounded-xl border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors">
                            Cancel Plan
                        </button>
                    </div>
                </div>

                {/* Usage bars */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
                    {/* Students */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1"><Users size={11} /> Students</span>
                            <span className="text-xs font-bold text-slate-700">{CURRENT.students.toLocaleString('en-IN')} / {CURRENT.maxStudents.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div className={`h-full rounded-full transition-all ${usage > 90 ? 'bg-red-500' : usage > 70 ? 'bg-amber-400' : 'bg-blue-500'}`}
                                style={{ width: `${usage}%` }} />
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{usage}% used</p>
                    </div>
                    {/* Next renewal */}
                    <div>
                        <div className="flex items-center gap-1 mb-1.5">
                            <Calendar size={11} className="text-slate-400" />
                            <span className="text-xs font-semibold text-slate-500">Next Renewal</span>
                        </div>
                        <p className="text-base font-bold text-slate-800">
                            {new Date(CURRENT.renewsOn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">Auto-renews monthly</p>
                    </div>
                    {/* Payment method */}
                    <div>
                        <div className="flex items-center gap-1 mb-1.5">
                            <CreditCard size={11} className="text-slate-400" />
                            <span className="text-xs font-semibold text-slate-500">Payment Method</span>
                        </div>
                        <p className="text-base font-bold text-slate-800">{CURRENT.card}</p>
                        <p className="text-xs text-slate-400 mt-1">{CURRENT.cardBrand}</p>
                    </div>
                </div>
            </div>

            {/* Billing toggle */}
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-slate-900">Available Plans</h2>
                <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
                    {['monthly','yearly'].map(b => (
                        <button key={b} onClick={() => setBilling(b)}
                            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all capitalize ${billing === b ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                            {b}
                            {b === 'yearly' && <span className="ml-1.5 text-xs text-emerald-600 font-bold">-20%</span>}
                        </button>
                    ))}
                </div>
            </div>

            {/* Plan cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
                {PLANS.map(plan => (
                    <PlanCard key={plan.id} plan={plan}
                        isCurrent={plan.id === CURRENT.planId}
                        onUpgrade={handleUpgrade}
                        upgrading={upgrading} />
                ))}
            </div>

            {/* Billing history */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-slate-900">Billing History</h3>
                    <button className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 transition-colors">
                        <Download size={14} /> Download All
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50">
                                {['Date','Invoice','Amount','Status',''].map(h => (
                                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {BILLING_HISTORY.map((inv, i) => (
                                <tr key={inv.id} className={`hover:bg-slate-50 transition-colors ${i < BILLING_HISTORY.length - 1 ? 'border-b border-slate-100' : ''}`}>
                                    <td className="px-5 py-3.5 text-sm text-slate-600">
                                        {new Date(inv.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </td>
                                    <td className="px-5 py-3.5 text-sm font-mono text-slate-700">{inv.invoice}</td>
                                    <td className="px-5 py-3.5 text-sm font-bold text-slate-900">₹{inv.amount.toLocaleString('en-IN')}</td>
                                    <td className="px-5 py-3.5">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />{inv.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <button className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                                            <Download size={12} /> PDF
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Cancel confirmation */}
            {showCancel && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowCancel(false)}>
                    <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6" onClick={e => e.stopPropagation()}>
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle size={22} className="text-red-600" />
                        </div>
                        <h3 className="font-bold text-slate-900 text-lg text-center mb-2">Cancel Subscription?</h3>
                        <p className="text-sm text-slate-500 text-center mb-6">
                            Your plan will remain active until{' '}
                            <strong>{new Date(CURRENT.renewsOn).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}</strong>.
                            After that, access will be restricted.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowCancel(false)}
                                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors">
                                Keep Plan
                            </button>
                            <button onClick={() => setShowCancel(false)}
                                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors">
                                Cancel Plan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}