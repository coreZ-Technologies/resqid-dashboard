'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard, Users, UserCheck, UsersRound,
    CalendarCheck, Clock, AlertTriangle, MessageCircle,
    BarChart2, Bell, Activity, Building2, Users2,
    CreditCard, HelpCircle, Lock, ChevronRight,
    Shield, LogOut, Settings
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
    professional: { label: 'Professional', color: 'bg-violet-50 text-violet-600 border-violet-200' },
    enterprise: { label: 'Enterprise', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
}

export default function Sidebar({ user }) {
    const pathname = usePathname()
    const [collapsed, setCollapsed] = useState(false)

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
        <aside
            className={cn(
                'relative flex flex-col h-screen bg-[#0f1117] border-r border-white/[0.06] transition-all duration-300 ease-in-out shrink-0',
                collapsed ? 'w-[64px]' : 'w-[240px]'
            )}
        >
            {/* Logo */}
            <div className={cn(
                'flex items-center gap-3 px-4 border-b border-white/[0.06] shrink-0',
                collapsed ? 'justify-center py-[18px]' : 'py-[18px]'
            )}>
                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
                    <Shield size={16} className="text-white" strokeWidth={2.5} />
                </div>
                {!collapsed && (
                    <div className="overflow-hidden">
                        <p className="text-white font-semibold text-[15px] leading-tight tracking-tight">RESQID</p>
                        <p className="text-white/35 text-[10px] tracking-widest uppercase">coreZ Technologies</p>
                    </div>
                )}
            </div>

            {/* School info */}
            {!collapsed && (
                <div className="mx-3 mt-3 mb-1 px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                    <p className="text-white/40 text-[10px] uppercase tracking-widest mb-0.5">School</p>
                    <p className="text-white/80 text-[13px] font-medium truncate">{schoolName}</p>
                    <span className={cn(
                        'inline-flex items-center mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border',
                        planMeta.color
                    )}>
                        {planMeta.label}
                    </span>
                </div>
            )}

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2 scrollbar-none">
                {SCHOOL_SIDEBAR.map((group) => (
                    <div key={group.section} className="mb-1">
                        {!collapsed && (
                            <p className="px-4 pt-3 pb-1 text-[10px] font-medium uppercase tracking-widest text-white/25">
                                {group.section}
                            </p>
                        )}
                        {group.items.map((item) => {
                            const Icon = ICON_MAP[item.icon]
                            const allowed = isAllowed(item.module)
                            const active = isActive(item.href)

                            if (!allowed) {
                                return (
                                    <Link
                                        key={item.id}
                                        href="/school/upgrade"
                                        className={cn(
                                            'flex items-center gap-3 mx-2 px-3 py-2 rounded-lg group transition-all duration-150',
                                            'text-white/20 hover:text-white/35 hover:bg-white/[0.03]',
                                            collapsed && 'justify-center px-0'
                                        )}
                                        title={collapsed ? `${item.label} — Upgrade required` : undefined}
                                    >
                                        {Icon && <Icon size={16} className="shrink-0" />}
                                        {!collapsed && (
                                            <>
                                                <span className="flex-1 text-[13px] font-medium truncate">{item.label}</span>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-[9px] uppercase tracking-wider text-white/20">{item.plan}</span>
                                                    <Lock size={10} className="text-white/20" />
                                                </div>
                                            </>
                                        )}
                                    </Link>
                                )
                            }

                            return (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    className={cn(
                                        'flex items-center gap-3 mx-2 px-3 py-2 rounded-lg transition-all duration-150 group',
                                        collapsed && 'justify-center px-0',
                                        active
                                            ? 'bg-emerald-500/10 text-emerald-400'
                                            : 'text-white/45 hover:text-white/80 hover:bg-white/[0.04]'
                                    )}
                                    title={collapsed ? item.label : undefined}
                                >
                                    {Icon && (
                                        <Icon
                                            size={16}
                                            className={cn('shrink-0 transition-colors', active ? 'text-emerald-400' : '')}
                                        />
                                    )}
                                    {!collapsed && (
                                        <span className="flex-1 text-[13px] font-medium truncate">{item.label}</span>
                                    )}
                                    {!collapsed && active && (
                                        <div className="w-1 h-1 rounded-full bg-emerald-400" />
                                    )}
                                </Link>
                            )
                        })}
                    </div>
                ))}
            </nav>

            {/* Bottom — user + logout */}
            <div className="shrink-0 border-t border-white/[0.06] p-3">
                {!collapsed ? (
                    <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-white/[0.04] transition-all cursor-pointer group">
                        <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                            <span className="text-emerald-400 text-[11px] font-semibold">
                                {(user?.name ?? 'A').slice(0, 2).toUpperCase()}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white/70 text-[12px] font-medium truncate">{user?.name ?? 'Admin'}</p>
                            <p className="text-white/30 text-[10px] truncate">{user?.email ?? ''}</p>
                        </div>
                        <LogOut size={13} className="text-white/20 group-hover:text-white/50 transition-colors shrink-0" />
                    </div>
                ) : (
                    <div className="flex justify-center">
                        <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center cursor-pointer">
                            <span className="text-emerald-400 text-[11px] font-semibold">
                                {(user?.name ?? 'A').slice(0, 2).toUpperCase()}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Collapse toggle */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className={cn(
                    'absolute -right-3 top-[72px] w-6 h-6 rounded-full bg-[#0f1117] border border-white/[0.1]',
                    'flex items-center justify-center text-white/40 hover:text-white/80 transition-all hover:border-white/20',
                    'shadow-lg z-10'
                )}
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
                <ChevronRight size={12} className={cn('transition-transform duration-300', collapsed ? '' : 'rotate-180')} />
            </button>
        </aside>
    )
}