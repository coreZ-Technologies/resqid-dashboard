'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
    LayoutDashboard, Users, UserCheck, UsersRound,
    CalendarCheck, Clock, AlertTriangle, MessageCircle,
    BarChart2, Bell, Activity, Building2, Users2,
    CreditCard, HelpCircle, Lock, BookOpen, QrCode,
    Shield, LogOut, Settings, Sparkles, Radio, ScanLine,
    BookMarked, Megaphone, Mail, ChevronsLeft, Building
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE DEFINITIONS — Matches backend MODULES constant
// ═══════════════════════════════════════════════════════════════════════════════

const MODULES = {
    EMERGENCY: 'emergency',
    ATTENDANCE: 'attendance',
    TIMETABLE: 'timetable',
    PARENT_COMMUNICATION: 'parent_communication',
}

// ═══════════════════════════════════════════════════════════════════════════════
// PLAN → MODULE MAPPING
// ═══════════════════════════════════════════════════════════════════════════════

const PLAN_MODULES = {
    module_emergency: [MODULES.EMERGENCY],
    module_attendance: [MODULES.ATTENDANCE],
    module_timetable: [MODULES.TIMETABLE],
    module_parent_communication: [MODULES.PARENT_COMMUNICATION],
    bundle_safety: [MODULES.EMERGENCY, MODULES.ATTENDANCE],
    bundle_ops: [MODULES.ATTENDANCE, MODULES.TIMETABLE],
    bundle_connect: [MODULES.ATTENDANCE, MODULES.PARENT_COMMUNICATION],
    resqid_complete: [MODULES.EMERGENCY, MODULES.ATTENDANCE, MODULES.TIMETABLE, MODULES.PARENT_COMMUNICATION],
}

// ═══════════════════════════════════════════════════════════════════════════════
// ICON MAP
// ═══════════════════════════════════════════════════════════════════════════════

const ICON_MAP = {
    LayoutDashboard, Users, UserCheck, UsersRound,
    CalendarCheck, Clock, AlertTriangle, MessageCircle,
    BarChart2, Bell, Activity, Building2, Users2,
    CreditCard, HelpCircle, Settings, BookOpen, QrCode,
    Shield, LogOut, Radio, ScanLine, BookMarked, Megaphone, Mail, Building,
}

// ═══════════════════════════════════════════════════════════════════════════════
// PLAN BADGE COLORS
// ═══════════════════════════════════════════════════════════════════════════════

const PLAN_META = {
    module_emergency: { label: 'Emergency', color: 'bg-red-50 text-red-600 border-red-200' },
    module_attendance: { label: 'Attendance', color: 'bg-green-50 text-green-600 border-green-200' },
    module_timetable: { label: 'Timetable', color: 'bg-purple-50 text-purple-600 border-purple-200' },
    module_parent_communication: { label: 'Communication', color: 'bg-orange-50 text-orange-600 border-orange-200' },
    bundle_safety: { label: 'Safety Bundle', color: 'bg-blue-50 text-blue-600 border-blue-200' },
    bundle_ops: { label: 'Ops Bundle', color: 'bg-teal-50 text-teal-600 border-teal-200' },
    bundle_connect: { label: 'Connect Bundle', color: 'bg-amber-50 text-amber-600 border-amber-200' },
    resqid_complete: { label: 'Complete', color: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
}

// ═══════════════════════════════════════════════════════════════════════════════
// FULL SIDEBAR CONFIG — Every item gated by module
// ═══════════════════════════════════════════════════════════════════════════════

const SCHOOL_SIDEBAR = [
    {
        section: 'Home',
        items: [
            {
                id: 'dashboard',
                label: 'Dashboard',
                href: '/school',
                icon: 'LayoutDashboard',
                module: null,
                description: 'Overview of your school',
            },
        ],
    },
    {
        section: 'Emergency ID',
        module: MODULES.EMERGENCY,
        items: [
            {
                id: 'students',
                label: 'Students',
                href: '/school/students',
                icon: 'Users',
                description: 'Profiles & emergency info',
            },
            {
                id: 'qr-cards',
                label: 'QR Cards',
                href: '/school/cards',
                icon: 'QrCode',
                description: 'Generate & manage cards',
            },
            {
                id: 'scan-logs',
                label: 'Scan Logs',
                href: '/school/scans',
                icon: 'ScanLine',
                description: 'QR scan activity',
            },
            {
                id: 'anomalies',
                label: 'Anomalies',
                href: '/school/anomalies',
                icon: 'Shield',
                description: 'Security alerts',
            }
        ],
    },
    {
        section: 'Smart Attendance',
        module: MODULES.ATTENDANCE,
        items: [
            {
                id: 'attendance-overview',
                label: 'Attendance',
                href: '/school/attendance',
                icon: 'CalendarCheck',
                description: 'Daily overview',
            },
            {
                id: 'attendance-reports',
                label: 'Reports',
                href: '/school/attendance/reports',
                icon: 'BarChart2',
                description: 'Monthly & yearly',
            },
            {
                id: 'rfid-devices',
                label: 'RFID Devices',
                href: '/school/attendance/devices',
                icon: 'Radio',
                description: 'Attendance hardware',
            },
        ],
    },
    {
        section: 'Timetable',
        module: MODULES.TIMETABLE,
        items: [
            {
                id: 'timetable-view',
                label: 'Timetable',
                href: '/school/timetable',
                icon: 'BookMarked',
                description: 'Weekly schedule',
            },
            {
                id: 'teachers',
                label: 'Teachers',
                href: '/school/teachers',
                icon: 'UserCheck',
                description: 'Manage staff',
            },
            {
                id: 'subjects',
                label: 'Subjects',
                href: '/school/subjects',
                icon: 'BookOpen',
                description: 'Manage subjects',
            },
            {
                id: 'classes',
                label: 'Classes',
                href: '/school/classes',
                icon: 'Users',
                description: 'Manage class groups',
            },
        ],
    },
    {
        section: 'Parent Communication',
        module: MODULES.PARENT_COMMUNICATION,
        items: [
            {
                id: 'communication-overview',
                label: 'Overview',
                href: '/school/communication',
                icon: 'MessageCircle',
                description: 'Communication dashboard',
            },
            {
                id: 'announcements',
                label: 'Announcements',
                href: '/school/communication/announcements',
                icon: 'Megaphone',
                description: 'School-wide broadcasts',
            },
            {
                id: 'messages',
                label: 'Messages',
                href: '/school/communication/messages',
                icon: 'Mail',
                description: 'Direct messages to parents',
            },
            {
                id: 'notification-log',
                label: 'Delivery Log',
                href: '/school/communication/log',
                icon: 'Activity',
                description: 'Track delivery status',
            },
        ],
    },
    {
        section: 'Settings',
        items: [
            {
                id: 'school-profile',
                label: 'School Profile',
                href: '/school/settings',
                icon: 'Building2',
                module: null,
                description: 'School information',
            },
            {
                id: 'manage-users',
                label: 'Manage Users',
                href: '/school/users',
                icon: 'Users2',
                module: null,
                description: 'Add / remove staff',
            },
            // ── ADD THESE TWO ──
            {
                id: 'activity-log',
                label: 'Activity Log',
                href: '/school/activity-log',
                icon: 'Activity',
                module: null,
                description: 'Audit trail',
            },
            {
                id: 'notifications',
                label: 'Notifications',
                href: '/school/notifications',
                icon: 'Bell',
                module: null,
                description: 'All alerts',
            },
            // ──────────────────
            {
                id: 'help',
                label: 'Help & Support',
                href: '/school/help',
                icon: 'HelpCircle',
                module: null,
                description: 'Docs & support',
            },
        ],
    },
]

// ═══════════════════════════════════════════════════════════════════════════════
// TOOLTIP — shown on collapsed icon hover
// ═══════════════════════════════════════════════════════════════════════════════

function Tooltip({ label, collapsed }) {
    if (!collapsed) return null
    return (
        <div className={cn(
            'absolute left-[calc(100%+8px)] top-1/2 -translate-y-1/2 z-50',
            'bg-slate-900 text-white text-[11px] font-medium px-2.5 py-1.5 rounded-md',
            'whitespace-nowrap pointer-events-none',
            'opacity-0 group-hover:opacity-100 transition-opacity duration-150',
            'shadow-lg',
        )}>
            {label}
            {/* Arrow */}
            <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
        </div>
    )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SIDEBAR COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function Sidebar({ user }) {
    const pathname = usePathname()
    const [collapsed, setCollapsed] = useState(false)

    const plan = user?.plan ?? 'resqid_complete'
    const schoolName = user?.schoolName ?? 'Your School'
    const planMeta = PLAN_META[plan] ?? PLAN_META.module_emergency

    const allowedModules = PLAN_MODULES[plan] ?? Object.values(MODULES)

    function isModuleAllowed(moduleId) {
        if (!moduleId) return true
        return allowedModules.includes(moduleId)
    }

    function isSectionVisible(section) {
        if (!section.module) return true
        return isModuleAllowed(section.module)
    }

    function isActive(href) {
        if (href === '/school') return pathname === '/school'
        return pathname.startsWith(href)
    }

    const initials = (user?.name ?? 'AD').slice(0, 2).toUpperCase()

    return (
        <aside
            className={cn(
                'flex flex-col h-screen bg-white border-r border-slate-200 shrink-0',
                'transition-[width] duration-200 ease-in-out overflow-hidden',
                collapsed ? 'w-[60px]' : 'w-[260px]',
            )}
        >

            {/* ── Logo + Collapse Button ── */}
            <div className="flex items-center border-b border-slate-100 min-h-[56px] px-3 gap-2">

                {/* Logo icon — hidden when collapsed */}
                {!collapsed && (
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                        <Image src="/images/logo.png" alt="RESQID" width={20} height={20} />
                    </div>
                )}

                {/* Text — hidden when collapsed */}
                {!collapsed && (
                    <div className="flex-1 min-w-0 overflow-hidden">
                        <p className="text-slate-900 font-semibold text-[14px] leading-tight whitespace-nowrap">RESQID</p>
                        <p className="text-slate-400 text-[9px] tracking-widest uppercase whitespace-nowrap">coreZ Technologies</p>
                    </div>
                )}

                {/* Collapse button — always visible, centered when collapsed */}
                <button
                    onClick={() => setCollapsed(c => !c)}
                    className={cn(
                        'w-7 h-7 rounded-md border border-slate-200 bg-slate-50',
                        'flex items-center justify-center shrink-0',
                        'hover:bg-slate-100 transition-colors duration-150',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
                        collapsed ? 'mx-auto' : 'ml-auto',
                    )}
                    aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    <ChevronsLeft
                        size={13}
                        className={cn(
                            'text-slate-500 transition-transform duration-200',
                            collapsed && 'rotate-180',
                        )}
                    />
                </button>
            </div>

            {/* ── School Card ── */}
            <div className={cn(
                'mx-2.5 mt-2.5 mb-1.5 rounded-xl border border-slate-100 bg-slate-50',
                'transition-all duration-200',
                collapsed ? 'p-1.5 flex justify-center' : 'px-3 py-2.5',
            )}>
                {/* Collapsed: just a building icon */}
                {collapsed && (
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
                        <Building size={14} className="text-indigo-500" />
                    </div>
                )}

                {/* Expanded: full school info */}
                {!collapsed && (
                    <>
                        <p className="text-[9px] uppercase tracking-widest text-slate-400 mb-0.5 font-medium">School</p>
                        <p className="text-slate-800 text-[12.5px] font-semibold truncate leading-tight">{schoolName}</p>
                        <div className="flex items-center gap-1.5 mt-1.5">
                            <span className={cn(
                                'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border',
                                planMeta.color,
                            )}>
                                <Sparkles size={8} />
                                {planMeta.label}
                            </span>
                            <span className="text-slate-400 text-[10px]">
                                {allowedModules.length} module{allowedModules.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                    </>
                )}
            </div>

            {/* ── Navigation ── */}
            <nav className="flex-1 overflow-y-auto overflow-x-hidden py-1 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
                {SCHOOL_SIDEBAR.map((group, groupIdx) => {
                    if (!isSectionVisible(group)) return null

                    return (
                        <div key={group.section}>
                            {/* Divider between sections */}
                            {groupIdx > 0 && (
                                <div className="h-px bg-slate-100 mx-2.5 my-1.5" />
                            )}

                            {/* Section label */}
                            {!collapsed && (
                                <div className="flex items-center justify-between px-3.5 pt-2.5 pb-1">
                                    <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400">
                                        {group.section}
                                    </p>
                                    {group.module && (
                                        <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-green-50 text-green-500">
                                            Active
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Section items */}
                            {group.items.map((item) => {
                                const Icon = ICON_MAP[item.icon]
                                const allowed = isModuleAllowed(item.module)
                                const active = isActive(item.href)

                                // ── Locked item ──
                                if (!allowed) {
                                    return (
                                        <div
                                            key={item.id}
                                            className={cn(
                                                'group relative flex items-center gap-2.5 mx-2 rounded-lg',
                                                'text-slate-300 cursor-not-allowed select-none',
                                                collapsed ? 'p-2 justify-center' : 'px-3 py-2',
                                            )}
                                            title={!collapsed ? `${item.label} — Requires ${item.module} module` : undefined}
                                        >
                                            {Icon && <Icon size={15} className="shrink-0 text-slate-300" />}

                                            {!collapsed && (
                                                <>
                                                    <div className="flex-1 min-w-0">
                                                        <span className="text-[12.5px] font-medium truncate block">{item.label}</span>
                                                        <span className="text-[10px] text-slate-300 truncate block">{item.description}</span>
                                                    </div>
                                                    <Lock size={9} className="text-slate-300 shrink-0" />
                                                </>
                                            )}

                                            <Tooltip label={item.label} collapsed={collapsed} />
                                        </div>
                                    )
                                }

                                // ── Active / allowed item ──
                                return (
                                    <Link
                                        key={item.id}
                                        href={item.href}
                                        className={cn(
                                            'group relative flex items-center gap-2.5 mx-2 rounded-lg',
                                            'transition-colors duration-100',
                                            collapsed ? 'p-2 justify-center' : 'px-3 py-[7px]',
                                            active
                                                ? 'bg-indigo-50 text-indigo-700'
                                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800',
                                        )}
                                    >
                                        {Icon && (
                                            <Icon
                                                size={15}
                                                className={cn(
                                                    'shrink-0 transition-colors duration-100',
                                                    active
                                                        ? 'text-indigo-600'
                                                        : 'text-slate-400 group-hover:text-slate-600',
                                                )}
                                            />
                                        )}

                                        {!collapsed && (
                                            <>
                                                <div className="flex-1 min-w-0">
                                                    <span className={cn(
                                                        'text-[12.5px] truncate block leading-tight',
                                                        active ? 'font-medium text-indigo-700' : 'font-normal text-slate-700',
                                                    )}>
                                                        {item.label}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400 truncate block group-hover:text-slate-500">
                                                        {item.description}
                                                    </span>
                                                </div>

                                                {/* Active indicator — static dot, no pulse */}
                                                {active && (
                                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                                                )}
                                            </>
                                        )}

                                        <Tooltip label={item.label} collapsed={collapsed} />
                                    </Link>
                                )
                            })}
                        </div>
                    )
                })}
            </nav>

            {/* ── User + Logout ── */}
            <div className="shrink-0 border-t border-slate-100 p-2">
                <div className={cn(
                    'flex items-center gap-2 px-2 py-1.5 rounded-lg',
                    'hover:bg-slate-50 transition-colors duration-100 cursor-pointer group',
                    collapsed && 'justify-center px-1.5',
                )}>
                    {/* Avatar */}
                    <div className="w-7 h-7 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center shrink-0">
                        <span className="text-indigo-700 text-[10px] font-bold">{initials}</span>
                    </div>

                    {/* Info */}
                    {!collapsed && (
                        <>
                            <div className="flex-1 min-w-0">
                                <p className="text-slate-700 text-[12px] font-medium truncate leading-tight">
                                    {user?.name ?? 'Admin'}
                                </p>
                                <p className="text-slate-400 text-[10px] truncate">
                                    {user?.email ?? ''}
                                </p>
                            </div>
                            <LogOut
                                size={13}
                                className="text-slate-300 group-hover:text-red-400 transition-colors duration-150 shrink-0"
                            />
                        </>
                    )}
                </div>
            </div>

        </aside>
    )
}