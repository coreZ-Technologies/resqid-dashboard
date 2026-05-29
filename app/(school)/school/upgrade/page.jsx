'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Nunito } from 'next/font/google'
import {
    UserCheck, ShieldCheck, CalendarClock,
    MessageCircle, TrendingUp, CheckCircle2,
    Lock, Zap, Crown, Building2, ArrowLeft,
    Sparkles, ChevronRight, Star
} from 'lucide-react'

const nunito = Nunito({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800', '900'],
    display: 'swap',
})

/* ─── Data ──────────────────────────────────────────────── */

const MODULES = [
    {
        id: 'attendance',
        icon: UserCheck,
        title: 'Student Attendance',
        description: 'QR-based daily attendance tracking, auto-absent alerts, and parent notifications.',
        color: 'blue',
        plans: ['starter', 'growth', 'enterprise'],
    },
    {
        id: 'emergency',
        icon: ShieldCheck,
        title: 'Emergency Profile',
        description: 'RESQID card scanning, instant emergency identity access, medical info & SOS alerts.',
        color: 'blue',
        plans: ['starter', 'growth', 'enterprise'],
    },
    {
        id: 'timetable',
        icon: CalendarClock,
        title: 'Teacher Attendance & Timetable',
        description: 'Staff attendance, class scheduling, timetable rescheduling and substitute management.',
        color: 'blue',
        plans: ['growth', 'enterprise'],
    },
    {
        id: 'communication',
        icon: MessageCircle,
        title: 'Parent Communication',
        description: 'Broadcast announcements, two-way messaging, event notices and fee reminders.',
        color: 'blue',
        plans: ['growth', 'enterprise'],
    },
    {
        id: 'performance',
        icon: TrendingUp,
        title: 'Student Performance',
        description: 'Academic analytics, grade tracking, progress reports and teacher insights.',
        color: 'blue',
        plans: ['enterprise'],
        comingSoon: true,
    },
]

const PLANS = [
    {
        id: 'starter',
        name: 'Starter',
        price: '₹2,999',
        period: '/mo',
        icon: Zap,
        desc: 'Perfect for small schools getting started with digital safety.',
        modules: ['attendance', 'emergency'],
        highlight: false,
        cta: 'Get Starter',
        badge: null,
    },
    {
        id: 'growth',
        name: 'Growth',
        price: '₹5,999',
        period: '/mo',
        icon: Star,
        desc: 'For growing schools that need full staff and parent management.',
        modules: ['attendance', 'emergency', 'timetable', 'communication'],
        highlight: true,
        cta: 'Get Growth',
        badge: 'Most Popular',
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        price: 'Custom',
        period: '',
        icon: Crown,
        desc: 'Full platform access with dedicated support and SLA.',
        modules: ['attendance', 'emergency', 'timetable', 'communication', 'performance'],
        highlight: false,
        cta: 'Contact Sales',
        badge: 'All Features',
    },
]

const MODULE_ICONS = {
    attendance: UserCheck,
    emergency: ShieldCheck,
    timetable: CalendarClock,
    communication: MessageCircle,
    performance: TrendingUp,
}

/* ─── Component ─────────────────────────────────────────── */

export default function UpgradePage({ currentPlan = 'starter', schoolName = 'Your School' }) {
    const [hoveredPlan, setHoveredPlan] = useState(null)

    const current = PLANS.find(p => p.id === currentPlan) ?? PLANS[0]

    function isUnlocked(moduleId, planId) {
        const mod = MODULES.find(m => m.id === moduleId)
        return mod?.plans.includes(planId)
    }

    return (
        <div className={`min-h-screen bg-[#F0F4FF] ${nunito.className}`}>

            {/* ── Top bar ── */}
            <div className="bg-white border-b border-slate-100 sticky top-0 z-20">
                <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-3">
                    <Link
                        href="/school"
                        className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors text-sm font-semibold"
                    >
                        <ArrowLeft size={16} />
                        Back to Dashboard
                    </Link>
                    <span className="text-slate-200">|</span>
                    <div className="flex items-center gap-2">
                        <Building2 size={14} className="text-blue-400" />
                        <span className="text-slate-500 text-sm font-semibold truncate">{schoolName}</span>
                    </div>
                    <div className="ml-auto flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-3 py-1">
                        <Sparkles size={12} className="text-blue-500" />
                        <span className="text-blue-600 text-xs font-bold uppercase tracking-wide">
                            Current: {current.name}
                        </span>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-12">

                {/* ── Hero ── */}
                <div className="text-center mb-14">
                    {/* Eyebrow */}
                    <div className="inline-flex items-center gap-2 bg-blue-600 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
                        <Crown size={12} />
                        Unlock Your School's Full Potential
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 leading-tight mb-3">
                        Choose the right plan
                        <span className="block text-blue-600">for your school</span>
                    </h1>
                    <p className="text-slate-500 text-base font-medium max-w-xl mx-auto leading-relaxed">
                        RESQID is built in focused modules. Start with what you need,
                        unlock more as your school grows.
                    </p>
                </div>

                {/* ── Pricing cards ── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
                    {PLANS.map((plan) => {
                        const PlanIcon = plan.icon
                        const isCurrent = plan.id === currentPlan
                        const isHovered = hoveredPlan === plan.id

                        return (
                            <div
                                key={plan.id}
                                className={`relative rounded-2xl border-2 overflow-hidden cursor-pointer transition-transform duration-200 hover:-translate-y-1
                                    ${plan.highlight
                                        ? 'bg-blue-700 border-blue-600 shadow-2xl shadow-blue-200'
                                        : 'bg-white border-slate-200 shadow-sm'
                                    }
                                    ${isCurrent ? 'ring-2 ring-offset-2 ring-blue-400' : ''}
                                `}
                                onMouseEnter={() => setHoveredPlan(plan.id)}
                                onMouseLeave={() => setHoveredPlan(null)}
                            >
                                {/* Badge */}
                                {plan.badge && (
                                    <div className={`absolute top-4 right-4 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full
                                        ${plan.highlight ? 'bg-white text-blue-700' : 'bg-blue-50 text-blue-600 border border-blue-200'}`}>
                                        {plan.badge}
                                    </div>
                                )}
                                {isCurrent && (
                                    <div className="absolute top-4 left-4 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-green-100 text-green-700 border border-green-200">
                                        Active
                                    </div>
                                )}

                                <div className="p-6">
                                    {/* Icon + name */}
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4
                                        ${plan.highlight ? 'bg-blue-600' : 'bg-blue-50'}`}>
                                        <PlanIcon size={18} className={plan.highlight ? 'text-white' : 'text-blue-600'} />
                                    </div>

                                    <p className={`text-xs font-black uppercase tracking-widest mb-1
                                        ${plan.highlight ? 'text-blue-200' : 'text-blue-500'}`}>
                                        {plan.name}
                                    </p>

                                    <div className="flex items-end gap-1 mb-3">
                                        <span className={`text-3xl font-black ${plan.highlight ? 'text-white' : 'text-slate-900'}`}>
                                            {plan.price}
                                        </span>
                                        {plan.period && (
                                            <span className={`text-sm font-semibold mb-1 ${plan.highlight ? 'text-blue-200' : 'text-slate-400'}`}>
                                                {plan.period}
                                            </span>
                                        )}
                                    </div>

                                    <p className={`text-sm font-medium leading-relaxed mb-5
                                        ${plan.highlight ? 'text-blue-100' : 'text-slate-500'}`}>
                                        {plan.desc}
                                    </p>

                                    {/* Module list */}
                                    <div className="space-y-2 mb-6">
                                        {MODULES.map((mod) => {
                                            const unlocked = isUnlocked(mod.id, plan.id)
                                            const ModIcon = MODULE_ICONS[mod.id]
                                            return (
                                                <div key={mod.id} className={`flex items-center gap-2.5 text-sm font-semibold
                                                    ${unlocked
                                                        ? plan.highlight ? 'text-white' : 'text-slate-700'
                                                        : plan.highlight ? 'text-blue-400/50' : 'text-slate-300'
                                                    }`}>
                                                    {unlocked
                                                        ? <CheckCircle2 size={14} className={plan.highlight ? 'text-blue-200 shrink-0' : 'text-blue-500 shrink-0'} />
                                                        : <Lock size={14} className="shrink-0 opacity-40" />
                                                    }
                                                    <span className={mod.comingSoon ? 'opacity-60' : ''}>
                                                        {mod.title}
                                                        {mod.comingSoon && (
                                                            <span className={`ml-2 text-[10px] font-bold uppercase tracking-wide
                                                                ${plan.highlight ? 'text-blue-300' : 'text-blue-400'}`}>
                                                                Soon
                                                            </span>
                                                        )}
                                                    </span>
                                                </div>
                                            )
                                        })}
                                    </div>

                                    {/* CTA */}
                                    <button className={`w-full py-2.5 rounded-xl text-sm font-black tracking-wide transition-all
                                        ${isCurrent
                                            ? 'bg-green-50 text-green-600 border-2 border-green-200 cursor-default'
                                            : plan.highlight
                                                ? 'bg-white text-blue-700 hover:bg-blue-50'
                                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                        }`}>
                                        {isCurrent ? '✓ Current Plan' : plan.cta}
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* ── Module breakdown table ── */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm mb-12">
                    <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                            <Sparkles size={15} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-slate-900 font-black text-sm">Module Breakdown</p>
                            <p className="text-slate-400 text-xs font-medium">See exactly what's included in each plan</p>
                        </div>
                    </div>

                    {/* Table header */}
                    <div className="grid grid-cols-[1fr_120px_120px_120px] border-b border-slate-100 bg-slate-50">
                        <div className="px-6 py-3 text-xs font-black uppercase tracking-widest text-slate-400">Module</div>
                        {PLANS.map(p => (
                            <div key={p.id} className={`py-3 text-center text-xs font-black uppercase tracking-widest
                                ${p.highlight ? 'text-blue-600' : 'text-slate-400'}`}>
                                {p.name}
                            </div>
                        ))}
                    </div>

                    {/* Rows */}
                    {MODULES.map((mod, i) => {
                        const ModIcon = mod.icon
                        const isCurrentlyLocked = !isUnlocked(mod.id, currentPlan)
                        return (
                            <div
                                key={mod.id}
                                className={`grid grid-cols-[1fr_120px_120px_120px] transition-colors duration-150 hover:bg-blue-50/40
                                    ${i !== MODULES.length - 1 ? 'border-b border-slate-100' : ''}
                                    ${isCurrentlyLocked ? 'bg-slate-50/60' : 'bg-white'}
                                `}
                            >
                                {/* Module info */}
                                <div className="px-6 py-4 flex items-start gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5
                                        ${isCurrentlyLocked ? 'bg-slate-100' : 'bg-blue-50'}`}>
                                        <ModIcon size={15} className={isCurrentlyLocked ? 'text-slate-300' : 'text-blue-500'} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className={`text-sm font-bold ${isCurrentlyLocked ? 'text-slate-400' : 'text-slate-800'}`}>
                                                {mod.title}
                                            </p>
                                            {mod.comingSoon && (
                                                <span className="text-[10px] font-black uppercase tracking-wide text-blue-400 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded-full">
                                                    Coming Soon
                                                </span>
                                            )}
                                            {isCurrentlyLocked && (
                                                <span className="text-[10px] font-black uppercase tracking-wide text-amber-500 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded-full">
                                                    Locked
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs font-medium text-slate-400 mt-0.5 leading-relaxed max-w-sm">
                                            {mod.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Plan cells */}
                                {PLANS.map(plan => {
                                    const unlocked = isUnlocked(mod.id, plan.id)
                                    return (
                                        <div key={plan.id} className={`flex items-center justify-center py-4
                                            ${plan.highlight ? 'bg-blue-50/30' : ''}`}>
                                            {unlocked
                                                ? <CheckCircle2 size={18} className="text-blue-500" />
                                                : <Lock size={14} className="text-slate-300" />
                                            }
                                        </div>
                                    )
                                })}
                            </div>
                        )
                    })}
                </div>

                {/* ── Bottom CTA banner ── */}
                <div className="relative overflow-hidden rounded-2xl bg-blue-700 p-8 text-center">
                    {/* Decorative blobs */}
                    <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-blue-600 opacity-40" />
                    <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-blue-800 opacity-50" />
                    <div className="absolute top-4 right-20 w-16 h-16 rounded-full bg-blue-500 opacity-20" />

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 bg-white/10 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
                            <Crown size={12} />
                            Need help choosing?
                        </div>
                        <h2 className="text-2xl font-black text-white mb-2">
                            Talk to our school success team
                        </h2>
                        <p className="text-blue-200 text-sm font-medium mb-6 max-w-md mx-auto">
                            We'll help you find the right plan for your school size,
                            budget, and goals — no pressure.
                        </p>
                        <div className="flex items-center justify-center gap-3 flex-wrap">
                            <a
                                href="mailto:hello@getresqid.in"
                                className="flex items-center gap-2 bg-white text-blue-700 font-black text-sm px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-colors"
                            >
                                Contact Sales
                                <ChevronRight size={14} />
                            </a>
                            <Link
                                href="/school"
                                className="flex items-center gap-2 bg-blue-600 text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-blue-500 transition-colors border border-blue-500"
                            >
                                Back to Dashboard
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Footer note */}
                <p className="text-center text-slate-400 text-xs font-medium mt-8">
                    All plans include free onboarding support · Prices are per school per month · GST applicable
                </p>
            </div>
        </div>
    )
}