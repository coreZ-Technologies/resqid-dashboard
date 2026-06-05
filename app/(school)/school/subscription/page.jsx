'use client';

/**
 * SCHOOL ADMIN — SUBSCRIPTION
 * Notion-inspired UI · Violet Accent System
 * Path: app/(school)/school/settings/billing/page.jsx
 */

import { useState } from 'react';
import {
    Check, X, ArrowUpRight, Loader2, Download,
    AlertTriangle, CreditCard, Zap, Shield, Crown,
    ChevronRight, ReceiptText, CalendarClock
} from 'lucide-react';

/* ─── DESIGN TOKENS ──────────────────────────────────────────── */
const T = {
    violet50:  '#f5f3ff',
    violet100: '#ede9fe',
    violet200: '#ddd6fe',
    violet300: '#c4b5fd',
    violet400: '#a78bfa',
    violet500: '#8b5cf6',
    violet600: '#7c3aed',
    violet700: '#6d28d9',
    surface:   '#ffffff',
    bg:        '#fbfaff',
    border:    '#ede9fe',
    borderSoft:'#f0edfb',
    text:      '#1c1026',
    textMid:   '#4b3d6e',
    textSoft:  '#8e82a8',
    textXSoft: '#b8afd1',
    red:       '#ef4444',
    redLight:  '#fef2f2',
    redBorder: '#fecaca',
    green:     '#10b981',
    amber:     '#f59e0b',
};

/* ─── DATA ───────────────────────────────────────────────────── */
const PLAN_ICONS = { basic: Zap, pro: Shield, enterprise: Crown };

const PLANS = [
    {
        id: 'basic', name: 'Basic', price: 2999, period: 'month',
        description: 'For small schools just getting started',
        badge: null,
        features: [
            { text: 'Up to 500 students',      included: true  },
            { text: 'QR attendance',            included: true  },
            { text: 'Basic scan logs',          included: true  },
            { text: 'Email notifications',      included: true  },
            { text: 'Parent messaging',         included: false },
            { text: 'Advanced reports',         included: false },
            { text: 'RFID devices',             included: false },
            { text: 'Priority support',         included: false },
        ],
    },
    {
        id: 'pro', name: 'Pro', price: 5999, period: 'month',
        description: 'For growing schools with advanced needs',
        badge: 'Most popular',
        features: [
            { text: 'Up to 2,000 students',         included: true  },
            { text: 'QR attendance',                included: true  },
            { text: 'Full scan logs & analytics',   included: true  },
            { text: 'SMS + Email notifications',    included: true  },
            { text: 'Parent messaging',             included: true  },
            { text: 'Advanced reports',             included: true  },
            { text: 'RFID devices (2 devices)',     included: false },
            { text: 'Priority support',             included: false },
        ],
    },
    {
        id: 'enterprise', name: 'Enterprise', price: 11999, period: 'month',
        description: 'For large schools needing full control',
        badge: null,
        features: [
            { text: 'Unlimited students',           included: true },
            { text: 'QR attendance',                included: true },
            { text: 'Full scan logs & analytics',   included: true },
            { text: 'SMS + Email + WhatsApp',       included: true },
            { text: 'Parent messaging',             included: true },
            { text: 'Advanced reports',             included: true },
            { text: 'Unlimited RFID devices',       included: true },
            { text: 'Priority support',             included: true },
        ],
    },
];

const CURRENT_SUBSCRIPTION = {
    planId: 'pro', renewsOn: '2026-06-01', startedOn: '2025-06-01',
    students: 1247, maxStudents: 2000,
    cardLast4: '4242', cardBrand: 'Visa',
};

const BILLING_HISTORY = [
    { id: 'inv1', date: '2026-05-01', amount: 5999, invoice: 'INV-2026-05', status: 'Paid' },
    { id: 'inv2', date: '2026-04-01', amount: 5999, invoice: 'INV-2026-04', status: 'Paid' },
    { id: 'inv3', date: '2026-03-01', amount: 5999, invoice: 'INV-2026-03', status: 'Paid' },
    { id: 'inv4', date: '2026-02-01', amount: 5999, invoice: 'INV-2026-02', status: 'Paid' },
    { id: 'inv5', date: '2026-01-01', amount: 3999, invoice: 'INV-2026-01', status: 'Paid' },
];

const fmt = (n) => n.toLocaleString('en-IN');
const fmtDate = (d, opts) => new Date(d).toLocaleDateString('en-IN', opts || { day: 'numeric', month: 'short', year: 'numeric' });

/* ─── PLAN CARD ──────────────────────────────────────────────── */
const PlanCard = ({ plan, isCurrent, onUpgrade, upgrading }) => {
    const planIndex    = PLANS.findIndex(p => p.id === plan.id);
    const currentIndex = PLANS.findIndex(p => p.id === CURRENT_SUBSCRIPTION.planId);
    const isHigher     = planIndex > currentIndex;
    const Icon         = PLAN_ICONS[plan.id];
    const [hov, setHov] = useState(false);

    return (
        <div
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                background: T.surface,
                border: `1.5px solid ${isCurrent ? T.violet300 : hov ? T.violet200 : T.borderSoft}`,
                borderRadius: 12,
                padding: '22px 20px',
                position: 'relative',
                transition: 'all 0.15s',
                boxShadow: isCurrent
                    ? `0 0 0 3px ${T.violet100}, 0 4px 20px rgba(124,58,237,0.12)`
                    : hov ? '0 4px 16px rgba(124,58,237,0.08)' : '0 1px 4px rgba(0,0,0,0.04)',
                display: 'flex', flexDirection: 'column',
            }}
        >
            {/* Badge */}
            {plan.badge && (
                <div style={{
                    position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)',
                    background: `linear-gradient(135deg, ${T.violet500}, ${T.violet700})`,
                    color: '#fff', fontSize: 10, fontWeight: 700,
                    padding: '3px 12px', borderRadius: 20,
                    letterSpacing: '0.04em', whiteSpace: 'nowrap',
                    boxShadow: `0 2px 8px rgba(124,58,237,0.35)`,
                }}>
                    {plan.badge}
                </div>
            )}

            {/* Icon + Name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{
                    width: 34, height: 34, borderRadius: 9,
                    background: isCurrent
                        ? `linear-gradient(135deg, ${T.violet500}, ${T.violet700})`
                        : T.violet50,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                }}>
                    <Icon size={16} color={isCurrent ? '#fff' : T.violet500} strokeWidth={2} />
                </div>
                <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: T.text, lineHeight: 1.2 }}>{plan.name}</div>
                    <div style={{ fontSize: 11, color: T.textSoft, marginTop: 1 }}>{plan.description}</div>
                </div>
            </div>

            {/* Price */}
            <div style={{ marginBottom: 18 }}>
                <span style={{ fontSize: 28, fontWeight: 700, color: T.text, letterSpacing: '-0.03em' }}>
                    ₹{fmt(plan.price)}
                </span>
                <span style={{ fontSize: 12, color: T.textXSoft, marginLeft: 4 }}>/{plan.period}</span>
            </div>

            {/* Features */}
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                {plan.features.map((f, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                        <span style={{
                            width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                            background: f.included ? T.violet100 : '#f3f2f7',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            {f.included
                                ? <Check size={10} color={T.violet600} strokeWidth={2.5} />
                                : <X size={10} color={T.textXSoft} strokeWidth={2.5} />}
                        </span>
                        <span style={{ color: f.included ? T.textMid : T.textXSoft }}>
                            {f.text}
                        </span>
                    </li>
                ))}
            </ul>

            {/* CTA */}
            <div style={{
                borderTop: `1.5px solid ${T.borderSoft}`,
                paddingTop: 16,
            }}>
                {isCurrent ? (
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        fontSize: 12, fontWeight: 600, color: T.violet600,
                        padding: '8px 0',
                    }}>
                        <Check size={13} strokeWidth={2.5} />
                        Current plan
                    </div>
                ) : isHigher ? (
                    <button
                        onClick={() => onUpgrade(plan.id)}
                        disabled={upgrading === plan.id}
                        style={{
                            width: '100%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                            padding: '9px 0', fontSize: 13, fontWeight: 600,
                            color: '#fff',
                            background: upgrading === plan.id
                                ? T.violet300
                                : `linear-gradient(135deg, ${T.violet500}, ${T.violet700})`,
                            border: 'none', borderRadius: 8, cursor: upgrading === plan.id ? 'wait' : 'pointer',
                            boxShadow: upgrading === plan.id ? 'none' : `0 2px 12px rgba(124,58,237,0.3)`,
                            transition: 'all 0.15s',
                        }}
                    >
                        {upgrading === plan.id
                            ? <Loader2 size={14} style={{ animation: 'spin 0.8s linear infinite' }} />
                            : <ArrowUpRight size={14} strokeWidth={2.5} />}
                        Upgrade to {plan.name}
                    </button>
                ) : (
                    <div style={{
                        fontSize: 12, color: T.textXSoft, textAlign: 'center',
                        padding: '8px 0',
                    }}>
                        Contact support to downgrade
                    </div>
                )}
            </div>
        </div>
    );
};

/* ─── CURRENT PLAN SUMMARY ───────────────────────────────────── */
const CurrentPlanSummary = ({ plan, onCancelClick }) => {
    const usagePct   = Math.round((CURRENT_SUBSCRIPTION.students / CURRENT_SUBSCRIPTION.maxStudents) * 100);
    const renewalDate = fmtDate(CURRENT_SUBSCRIPTION.renewsOn, { month: 'short', day: 'numeric', year: 'numeric' });
    const Icon = PLAN_ICONS[plan.id];

    return (
        <div style={{
            background: T.surface,
            border: `1.5px solid ${T.border}`,
            borderRadius: 12,
            marginBottom: 28,
            overflow: 'hidden',
            boxShadow: '0 1px 4px rgba(124,58,237,0.06)',
        }}>
            {/* Top band */}
            <div style={{
                background: `linear-gradient(135deg, ${T.violet50}, #fff)`,
                borderBottom: `1.5px solid ${T.borderSoft}`,
                padding: '18px 22px',
                display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                        width: 42, height: 42, borderRadius: 10,
                        background: `linear-gradient(135deg, ${T.violet500}, ${T.violet700})`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: `0 4px 12px rgba(124,58,237,0.3)`,
                    }}>
                        <Icon size={20} color="#fff" strokeWidth={2} />
                    </div>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 16, fontWeight: 700, color: T.text }}>{plan.name}</span>
                            <span style={{
                                fontSize: 10, fontWeight: 600,
                                color: T.violet600, background: T.violet100,
                                padding: '2px 8px', borderRadius: 20,
                                border: `1px solid ${T.violet200}`,
                            }}>Active</span>
                        </div>
                        <div style={{ fontSize: 12, color: T.textSoft, marginTop: 2 }}>
                            ₹{fmt(plan.price)}/month · Renews {renewalDate}
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button style={{
                        padding: '7px 14px', fontSize: 12, fontWeight: 500,
                        color: T.textMid, background: T.surface,
                        border: `1.5px solid ${T.border}`,
                        borderRadius: 7, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 5,
                    }}>
                        <CreditCard size={12} /> Update payment
                    </button>
                    <button
                        onClick={onCancelClick}
                        style={{
                            padding: '7px 14px', fontSize: 12, fontWeight: 500,
                            color: T.red, background: T.redLight,
                            border: `1.5px solid ${T.redBorder}`,
                            borderRadius: 7, cursor: 'pointer',
                        }}
                    >
                        Cancel plan
                    </button>
                </div>
            </div>

            {/* Stats row */}
            <div style={{
                padding: '16px 22px',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 20,
            }}>
                {/* Seats */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 11, color: T.textSoft }}>Student seats used</span>
                        <span style={{ fontSize: 11, fontWeight: 600, color: T.textMid }}>
                            {fmt(CURRENT_SUBSCRIPTION.students)} / {fmt(CURRENT_SUBSCRIPTION.maxStudents)}
                        </span>
                    </div>
                    <div style={{ height: 5, background: T.borderSoft, borderRadius: 20, overflow: 'hidden' }}>
                        <div style={{
                            height: '100%', borderRadius: 20,
                            width: `${usagePct}%`,
                            background: usagePct > 85
                                ? `linear-gradient(90deg, ${T.amber}, #f97316)`
                                : `linear-gradient(90deg, ${T.violet400}, ${T.violet600})`,
                            transition: 'width 0.4s ease',
                        }} />
                    </div>
                    <div style={{ fontSize: 10, color: T.textXSoft, marginTop: 4 }}>
                        {usagePct}% capacity used
                    </div>
                </div>

                {/* Payment method */}
                <div style={{ paddingLeft: 20, borderLeft: `1.5px solid ${T.borderSoft}` }}>
                    <div style={{ fontSize: 11, color: T.textSoft, marginBottom: 5 }}>Payment method</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <div style={{
                            padding: '3px 8px', borderRadius: 5,
                            background: T.violet50, border: `1px solid ${T.violet200}`,
                            fontSize: 10, fontWeight: 700, color: T.violet600,
                            fontFamily: "'JetBrains Mono', monospace",
                        }}>
                            {CURRENT_SUBSCRIPTION.cardBrand.toUpperCase()}
                        </div>
                        <span style={{ fontSize: 12, color: T.textMid }}>
                            •••• {CURRENT_SUBSCRIPTION.cardLast4}
                        </span>
                    </div>
                </div>

                {/* Next invoice */}
                <div style={{ paddingLeft: 20, borderLeft: `1.5px solid ${T.borderSoft}` }}>
                    <div style={{ fontSize: 11, color: T.textSoft, marginBottom: 5 }}>Next invoice</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>₹{fmt(plan.price)}</div>
                    <div style={{ fontSize: 11, color: T.textSoft, marginTop: 1 }}>on {renewalDate}</div>
                </div>
            </div>
        </div>
    );
};

/* ─── BILLING HISTORY TABLE ──────────────────────────────────── */
const BillingHistory = () => (
    <div style={{
        marginTop: 28,
        background: T.surface,
        border: `1.5px solid ${T.borderSoft}`,
        borderRadius: 12,
        overflow: 'hidden',
    }}>
        {/* Header */}
        <div style={{
            padding: '14px 20px',
            borderBottom: `1.5px solid ${T.borderSoft}`,
            display: 'flex', alignItems: 'center', gap: 8,
            background: `linear-gradient(135deg, ${T.violet50}, #fff)`,
        }}>
            <ReceiptText size={14} color={T.violet500} />
            <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>Billing history</span>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: T.bg }}>
                        {['Date', 'Invoice', 'Amount', 'Status', ''].map((h, i) => (
                            <th key={i} style={{
                                padding: '10px 20px', fontSize: 11, fontWeight: 500,
                                color: T.textSoft, textAlign: i === 4 ? 'right' : 'left',
                                borderBottom: `1.5px solid ${T.borderSoft}`,
                                letterSpacing: '0.04em',
                            }}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {BILLING_HISTORY.map((inv, idx) => (
                        <tr
                            key={inv.id}
                            style={{
                                borderBottom: idx < BILLING_HISTORY.length - 1 ? `1px solid ${T.borderSoft}` : 'none',
                                transition: 'background 0.1s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = T.violet50}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                            <td style={{ padding: '12px 20px', fontSize: 12, color: T.textMid }}>
                                {fmtDate(inv.date)}
                            </td>
                            <td style={{
                                padding: '12px 20px', fontSize: 11,
                                fontFamily: "'JetBrains Mono', monospace",
                                fontWeight: 600, color: T.violet600,
                                letterSpacing: '0.04em',
                            }}>
                                {inv.invoice}
                            </td>
                            <td style={{ padding: '12px 20px', fontSize: 13, fontWeight: 600, color: T.text }}>
                                ₹{fmt(inv.amount)}
                            </td>
                            <td style={{ padding: '12px 20px' }}>
                                <span style={{
                                    fontSize: 10, fontWeight: 600,
                                    color: T.green,
                                    background: '#f0fdf4',
                                    border: '1px solid #bbf7d0',
                                    padding: '2px 8px', borderRadius: 20,
                                }}>
                                    {inv.status}
                                </span>
                            </td>
                            <td style={{ padding: '12px 20px', textAlign: 'right' }}>
                                <button style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 5,
                                    fontSize: 11, fontWeight: 500,
                                    color: T.violet600,
                                    background: T.violet50,
                                    border: `1px solid ${T.violet200}`,
                                    padding: '4px 10px', borderRadius: 6, cursor: 'pointer',
                                }}>
                                    <Download size={11} /> PDF
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

/* ─── CANCEL MODAL ───────────────────────────────────────────── */
const CancelModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;
    const renewalDate = fmtDate(CURRENT_SUBSCRIPTION.renewsOn, { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0,
                background: 'rgba(28,16,38,0.3)',
                backdropFilter: 'blur(2px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 1000, padding: 16,
            }}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    background: T.surface,
                    borderRadius: 14,
                    width: '100%', maxWidth: 380,
                    padding: '28px 24px',
                    boxShadow: '0 24px 64px rgba(28,16,38,0.18)',
                    border: `1.5px solid ${T.border}`,
                    textAlign: 'center',
                }}
            >
                <div style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: T.redLight,
                    border: `1.5px solid ${T.redBorder}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 16px',
                }}>
                    <AlertTriangle size={22} color={T.red} />
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: T.text, marginBottom: 8 }}>
                    Cancel subscription?
                </div>
                <p style={{ fontSize: 13, color: T.textSoft, lineHeight: 1.6, marginBottom: 24 }}>
                    Your plan stays active until{' '}
                    <span style={{ fontWeight: 600, color: T.textMid }}>{renewalDate}</span>.
                    After that, your school's access will be restricted.
                </p>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button
                        onClick={onClose}
                        style={{
                            flex: 1, padding: '10px 0', fontSize: 13, fontWeight: 600,
                            color: T.textMid, background: T.bg,
                            border: `1.5px solid ${T.border}`,
                            borderRadius: 8, cursor: 'pointer',
                        }}
                    >
                        Keep plan
                    </button>
                    <button
                        onClick={onConfirm}
                        style={{
                            flex: 1, padding: '10px 0', fontSize: 13, fontWeight: 600,
                            color: '#fff', background: T.red,
                            border: 'none', borderRadius: 8, cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(239,68,68,0.3)',
                        }}
                    >
                        Cancel plan
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ─── MAIN PAGE ──────────────────────────────────────────────── */
export default function SubscriptionPage() {
    const [upgrading, setUpgrading]           = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);

    const currentPlan = PLANS.find(p => p.id === CURRENT_SUBSCRIPTION.planId);

    const handleUpgrade = async (planId) => {
        setUpgrading(planId);
        await new Promise(r => setTimeout(r, 1200));
        setUpgrading(null);
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: T.bg,
            fontFamily: "'DM Sans', system-ui, sans-serif",
            color: T.text,
        }}>
            {/* Top gradient bar */}
            <div style={{
                height: 3,
                background: `linear-gradient(90deg, ${T.violet400}, ${T.violet600}, ${T.violet400})`,
            }} />

            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px 56px' }}>

                <CancelModal
                    isOpen={showCancelModal}
                    onClose={() => setShowCancelModal(false)}
                    onConfirm={() => setShowCancelModal(false)}
                />

                {/* Page header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                            <div style={{
                                width: 36, height: 36, borderRadius: 9,
                                background: `linear-gradient(135deg, ${T.violet500}, ${T.violet700})`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: `0 4px 12px rgba(124,58,237,0.3)`,
                            }}>
                                <CalendarClock size={18} color="#fff" strokeWidth={2} />
                            </div>
                            <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', color: T.text }}>
                                Subscription
                            </h1>
                        </div>
                        <p style={{ fontSize: 13, color: T.textSoft, marginLeft: 46 }}>
                            Manage your plan, usage and billing details
                        </p>
                    </div>
                    <div style={{
                        fontSize: 11, color: T.textXSoft,
                        background: T.surface, border: `1.5px solid ${T.borderSoft}`,
                        padding: '5px 10px', borderRadius: 7,
                        fontFamily: "'JetBrains Mono', monospace",
                    }}>
                        All prices in INR ₹
                    </div>
                </div>

                {/* Current plan summary */}
                <CurrentPlanSummary plan={currentPlan} onCancelClick={() => setShowCancelModal(true)} />

                {/* Plans section */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    marginBottom: 16,
                }}>
                    <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 2 }}>
                            Available plans
                        </div>
                        <div style={{ fontSize: 12, color: T.textSoft }}>
                            Upgrade anytime. Changes take effect immediately.
                        </div>
                    </div>
                </div>

                {/* Plan cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: 16,
                    marginBottom: 0,
                }}>
                    {PLANS.map(plan => (
                        <PlanCard
                            key={plan.id}
                            plan={plan}
                            isCurrent={plan.id === CURRENT_SUBSCRIPTION.planId}
                            onUpgrade={handleUpgrade}
                            upgrading={upgrading}
                        />
                    ))}
                </div>

                {/* Billing history */}
                <BillingHistory />

                <style>{`
                    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600;700&display=swap');
                    @keyframes spin { to { transform: rotate(360deg); } }
                `}</style>
            </div>
        </div>
    );
}