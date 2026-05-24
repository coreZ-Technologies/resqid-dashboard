'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard, Users, UserCheck, UsersRound,
    CalendarCheck, Clock, AlertTriangle, MessageCircle,
    BarChart2, Bell, Activity, Building2, Users2,
    CreditCard, HelpCircle, Lock,
    Shield, LogOut, Settings, Sparkles
} from 'lucide-react'
import { SCHOOL_SIDEBAR } from '@/lib/constants'
import { cn } from '@/lib/utils'

const ICON_MAP = {
    LayoutDashboard, Users, UserCheck, UsersRound,
    CalendarCheck, Clock, AlertTriangle, MessageCircle,
    BarChart2, Bell, Activity, Building2, Users2,
    CreditCard, HelpCircle, Settings
}

const PLAN_META = {
    basic: { label: 'Basic', color: 'bg-slate-100 text-slate-600 border-slate-200' },
    standard: { label: 'Standard', color: 'bg-blue-50 text-blue-600 border-blue-200' },
    professional: { label: 'Professional', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    enterprise: { label: 'Enterprise', color: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
}

export default function Sidebar({ user }) {
    const pathname = usePathname()

    const plan = user?.plan ?? 'basic'
    const schoolName = user?.schoolName ?? 'Your School'
    const planMeta = PLAN_META[plan] ?? PLAN_META.basic

    function isAllowed(moduleId) {
        if (!moduleId) return true
        const allowed = {
            attendance: ['basic', 'standard', 'professional', 'enterprise'],
            timetable: ['standard', 'professional', 'enterprise'],
            emergency: ['professional', 'enterprise'],
            communication: ['enterprise'],
        }
        return (allowed[moduleId] ?? []).includes(plan)
    }

    function isActive(href) {
        if (href === '/school') return pathname === '/school'
        return pathname.startsWith(href)
    }

    return (
        <aside className="flex flex-col h-screen w-[240px] bg-white border-r border-slate-200 shrink-0">

            {/* ── Logo ── */}
            <div className="flex items-center gap-3 px-4 py-[18px] border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center shrink-0">
                    <Shield size={16} className="text-white" strokeWidth={2.5} />
                </div>
                <div className="overflow-hidden">
                    <p className="text-slate-900 font-semibold text-[15px] leading-tight tracking-tight">RESQID</p>
                    <p className="text-slate-400 text-[10px] tracking-widest uppercase">coreZ Technologies</p>
                </div>
            </div>

            {/* ── School card ── */}
            <div className="mx-3 mt-3 mb-1 px-3 py-2.5 rounded-lg bg-blue-50 border border-blue-100">
                <p className="text-blue-300 text-[10px] uppercase tracking-widest mb-0.5">School</p>
                <p className="text-blue-900 text-[13px] font-semibold truncate">{schoolName}</p>
                <span className={cn(
                    'inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border',
                    planMeta.color
                )}>
                    <Sparkles size={8} />
                    {planMeta.label}
                </span>
            </div>

            {/* ── Nav ── */}
            <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2 scrollbar-none">
                {SCHOOL_SIDEBAR.map((group) => (
                    <div key={group.section} className="mb-1">
                        <p className="px-4 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-300">
                            {group.section}
                        </p>

                        {group.items.map((item) => {
                            const Icon = ICON_MAP[item.icon]
                            const allowed = isAllowed(item.module)
                            const active = isActive(item.href)

                            if (!allowed) {
                                return (
                                    <Link
                                        key={item.id}
                                        href="/school/upgrade"
                                        className="flex items-center gap-3 mx-2 px-3 py-2 rounded-lg
                                                   text-slate-300 hover:text-slate-400 hover:bg-slate-50
                                                   transition-all duration-150"
                                        title={`${item.label} — Upgrade required`}
                                    >
                                        {Icon && <Icon size={16} className="shrink-0 text-slate-300" />}
                                        <span className="flex-1 text-[13px] font-medium truncate">{item.label}</span>
                                        <div className="flex items-center gap-1">
                                            <span className="text-[9px] uppercase tracking-wider text-slate-300">{item.plan}</span>
                                            <Lock size={10} className="text-slate-300" />
                                        </div>
                                    </Link>
                                )
                            }

                            return (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    className={cn(
                                        'flex items-center gap-3 mx-2 px-3 py-2 rounded-lg transition-all duration-150 group',
                                        active
                                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                            : 'text-slate-500 hover:text-blue-700 hover:bg-blue-50'
                                    )}
                                >
                                    {Icon && (
                                        <Icon
                                            size={16}
                                            className={cn(
                                                'shrink-0 transition-colors',
                                                active
                                                    ? 'text-blue-600'
                                                    : 'text-slate-400 group-hover:text-blue-600'
                                            )}
                                        />
                                    )}
                                    <span className="flex-1 text-[13px] font-medium truncate">{item.label}</span>
                                    {active && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                                    )}
                                </Link>
                            )
                        })}
                    </div>
                ))}
            </nav>

            {/* ── User + Logout ── */}
            <div className="shrink-0 border-t border-slate-100 p-3">
                <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg
                                hover:bg-blue-50 transition-all cursor-pointer group">
                    <div className="w-7 h-7 rounded-full bg-blue-100 border border-blue-200
                                    flex items-center justify-center shrink-0">
                        <span className="text-blue-700 text-[11px] font-semibold">
                            {(user?.name ?? 'A').slice(0, 2).toUpperCase()}
                        </span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-slate-700 text-[12px] font-medium truncate">{user?.name ?? 'Admin'}</p>
                        <p className="text-slate-400 text-[10px] truncate">{user?.email ?? ''}</p>
                    </div>
                    <LogOut size={13} className="text-slate-300 group-hover:text-blue-600 transition-colors shrink-0" />
                </div>
            </div>

        </aside>
    )
}