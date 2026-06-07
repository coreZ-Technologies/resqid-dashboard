"use client"

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    Bell, Search, ChevronDown, Settings,
    LogOut, User, HelpCircle, X, CheckCheck,
    AlertTriangle, UserX, MessageSquare, CalendarCheck, BarChart2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE TITLES — School + Super Admin routes
// ═══════════════════════════════════════════════════════════════════════════════

const PAGE_TITLES = {
    // School Admin
    '/school': { title: 'Dashboard', sub: 'Welcome back' },
    '/school/students': { title: 'Students', sub: 'Manage student records' },
    '/school/teachers': { title: 'Teachers', sub: 'Manage teaching staff' },
    '/school/subjects': { title: 'Subjects', sub: 'Manage subjects' },
    '/school/classes': { title: 'Classes', sub: 'Manage class groups' },
    '/school/attendance': { title: 'Attendance', sub: 'Track daily attendance' },
    '/school/timetable': { title: 'Timetable', sub: 'Class schedules' },
    '/school/communication': { title: 'Communication', sub: 'Messages & announcements' },
    '/school/cards': { title: 'ID Cards', sub: 'QR card management' },
    '/school/scans': { title: 'Scan Logs', sub: 'QR scan activity' },
    '/school/anomalies': { title: 'Anomalies', sub: 'Security alerts' },
    '/school/settings': { title: 'Settings', sub: 'Manage preferences' },
    '/school/users': { title: 'Manage Users', sub: 'Staff accounts' },
    '/school/help': { title: 'Help & Docs', sub: 'Support resources' },
    '/school/activity-log': { title: 'Activity Log', sub: 'Recent actions' },

    // Super Admin
    '/superadmin': { title: 'Dashboard', sub: 'Platform overview' },
    '/superadmin/schools': { title: 'All Schools', sub: 'Manage onboarded schools' },
    '/superadmin/subscriptions': { title: 'Subscriptions', sub: 'Plans & billing' },
    '/superadmin/scans': { title: 'Scan Logs', sub: 'QR scan activity' },
    '/superadmin/anomalies': { title: 'Anomalies', sub: 'Security alerts' },
    '/superadmin/audit-logs': { title: 'Audit Logs', sub: 'Admin action history' },
    '/superadmin/activity-log': { title: 'Activity Log', sub: 'All user activity' },
    '/superadmin/health': { title: 'System Health', sub: 'Services & uptime' },
    '/superadmin/queues': { title: 'Queue Monitor', sub: 'BullMQ job status' },
    '/superadmin/settings': { title: 'Platform Settings', sub: 'Global configuration' },
    '/superadmin/settings/admins': { title: 'Admin Accounts', sub: 'Manage super admins' },
    '/superadmin/settings/roles': { title: 'Roles & Permissions', sub: 'Access control' },
    '/superadmin/profile': { title: 'My Profile', sub: 'Super admin account settings' },
}

// ═══════════════════════════════════════════════════════════════════════════════
// NOTIFICATION CONFIG
// ═══════════════════════════════════════════════════════════════════════════════

const NOTIF_ICON = {
    alert: { Icon: AlertTriangle, bg: 'bg-red-50', text: 'text-red-500' },
    info: { Icon: UserX, bg: 'bg-blue-50', text: 'text-blue-500' },
    message: { Icon: MessageSquare, bg: 'bg-green-50', text: 'text-green-500' },
    success: { Icon: CalendarCheck, bg: 'bg-blue-50', text: 'text-blue-500' },
    report: { Icon: BarChart2, bg: 'bg-blue-50', text: 'text-blue-500' },
}

const INITIAL_NOTIFICATIONS = [
    { id: 1, type: 'alert', title: 'Emergency drill triggered', body: 'East block — 10 minutes ago', unread: true },
    { id: 2, type: 'info', title: '3 students marked absent', body: 'Class 8A — 30 minutes ago', unread: true },
    { id: 3, type: 'message', title: 'New message from Sunita Sharma', body: "Re: Priya's leave — 2h ago", unread: true },
    { id: 4, type: 'success', title: 'Timetable updated', body: 'Class 10B schedule — Yesterday', unread: false },
    { id: 5, type: 'report', title: 'Monthly report ready', body: 'April 2026 — 2 days ago', unread: false },
]

// ═══════════════════════════════════════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════════════════════════════════════

function useClickOutside(ref, handler) {
    useEffect(() => {
        const listener = (e) => { if (ref.current && !ref.current.contains(e.target)) handler() }
        document.addEventListener('mousedown', listener)
        return () => document.removeEventListener('mousedown', listener)
    }, [ref, handler])
}

// ═══════════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function SearchBar() {
    const [query, setQuery] = useState('')

    return (
        <div className={cn(
            'flex items-center gap-2 h-[34px] px-3 rounded-lg border transition-all duration-150',
            'bg-slate-50 border-slate-200 w-[220px]',
            'focus-within:bg-white focus-within:border-violet-300 focus-within:ring-2 focus-within:ring-violet-100'
        )}>
            <Search size={14} className="text-slate-400 shrink-0" />
            <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search..."
                className="flex-1 min-w-0 bg-transparent text-[12.5px] text-slate-700 placeholder-slate-400 outline-none"
            />
            {query && (
                <button onClick={() => setQuery('')} className="flex items-center justify-center shrink-0 text-slate-400 hover:text-slate-600 transition-colors">
                    <X size={12} />
                </button>
            )}
        </div>
    )
}

function NotificationsDropdown({ notifications, onMarkAllRead }) {
    const unreadCount = notifications.filter(n => n.unread).length

    return (
        <div className="absolute right-0 top-[42px] w-[320px] bg-white rounded-xl border border-slate-200 shadow-lg shadow-slate-200/50 overflow-hidden z-50">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <div>
                    <p className="text-[13px] font-semibold text-slate-800">Notifications</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}</p>
                </div>
                {unreadCount > 0 && (
                    <button onClick={onMarkAllRead} className="flex items-center gap-1.5 text-[11px] text-violet-600 hover:text-violet-700 font-medium transition-colors">
                        <CheckCheck size={12} /> Mark all read
                    </button>
                )}
            </div>
            <div className="max-h-[280px] overflow-y-auto divide-y divide-slate-50 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
                {notifications.map(n => {
                    const cfg = NOTIF_ICON[n.type] ?? NOTIF_ICON.info
                    return (
                        <div key={n.id} className={cn('flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-slate-50', n.unread && 'bg-violet-50/30')}>
                            <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5', cfg.bg, cfg.text)}>
                                <cfg.Icon size={14} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={cn('text-[12px] font-medium leading-snug', n.unread ? 'text-slate-800' : 'text-slate-400')}>{n.title}</p>
                                <p className="text-[11px] text-slate-400 mt-0.5">{n.body}</p>
                            </div>
                            {n.unread && <div className="w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0 mt-1.5" />}
                        </div>
                    )
                })}
            </div>
            <div className="px-4 py-2.5 border-t border-slate-100 text-center">
                <Link href="/school/notifications" className="text-[12px] text-violet-600 hover:text-violet-700 font-medium transition-colors">View all notifications</Link>
            </div>
        </div>
    )
}

function ProfileDropdown({ user }) {
    const pathname = usePathname()
    const isSuperAdmin = pathname.startsWith('/superadmin')

    const links = isSuperAdmin
        ? [
            { Icon: User, label: 'Profile', href: '/superadmin/profile' },
            { Icon: Settings, label: 'Settings', href: '/superadmin/settings' },
        ]
        : [
            { Icon: User, label: 'Profile', href: '/school/profile' },
            { Icon: Settings, label: 'Settings', href: '/school/settings' },
            { Icon: HelpCircle, label: 'Help & docs', href: '/school/help' },
        ]

    return (
        <div className="absolute right-0 top-[42px] w-[200px] bg-white rounded-xl border border-slate-200 shadow-lg shadow-slate-200/50 overflow-hidden z-50">
            <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-[12px] font-semibold text-slate-800 truncate">{user?.name ?? 'Admin'}</p>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">{user?.email ?? ''}</p>
            </div>
            <div className="py-1">
                {links.map(({ Icon, label, href }) => (
                    <Link key={label} href={href} className="flex items-center gap-3 px-4 py-2 text-[12.5px] text-slate-600 hover:bg-violet-50 hover:text-violet-700 transition-colors group">
                        <Icon size={14} className="text-slate-400 group-hover:text-violet-600 transition-colors" />{label}
                    </Link>
                ))}
            </div>
            <div className="border-t border-slate-100 py-1">
                <button className="flex items-center gap-3 w-full px-4 py-2 text-[12.5px] text-red-500 hover:bg-red-50 transition-colors">
                    <LogOut size={14} /> Sign out
                </button>
            </div>
        </div>
    )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN TOPBAR
// ═══════════════════════════════════════════════════════════════════════════════

export default function Topbar({ user }) {
    const pathname = usePathname()
    const [notifOpen, setNotifOpen] = useState(false)
    const [profileOpen, setProfileOpen] = useState(false)
    const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)

    const notifRef = useRef(null)
    const profileRef = useRef(null)

    useClickOutside(notifRef, () => setNotifOpen(false))
    useClickOutside(profileRef, () => setProfileOpen(false))

    const isSuperAdmin = pathname.startsWith('/superadmin')

    // Find matching page title — check exact match first, then prefix match
    const pageInfo = PAGE_TITLES[pathname]
        || Object.entries(PAGE_TITLES).find(([key]) => pathname.startsWith(key) && key !== '/school' && key !== '/superadmin')?.[1]
        || { title: 'RESQID', sub: '' }

    const unreadCount = notifications.filter(n => n.unread).length
    const initials = (user?.name ?? 'Admin').slice(0, 2).toUpperCase()

    function markAllRead() {
        setNotifications(prev => prev.map(n => ({ ...n, unread: false })))
    }

    return (
        <header className="h-[60px] shrink-0 flex items-center justify-between px-6 bg-white border-b border-slate-200">
            {/* Left — page title */}
            <div>
                <h1 className="text-[15px] font-semibold text-slate-800 leading-tight">{pageInfo.title}</h1>
                {pageInfo.sub && <p className="text-[11px] text-slate-400 leading-tight mt-0.5">{pageInfo.sub}</p>}
            </div>

            {/* Right — actions */}
            <div className="flex items-center gap-2">
                <SearchBar />
                <div className="w-px h-5 bg-slate-200 mx-1" />

                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                    <button onClick={() => { setNotifOpen(o => !o); setProfileOpen(false) }}
                        className="relative w-[34px] h-[34px] rounded-lg flex items-center justify-center text-slate-500 hover:bg-violet-50 hover:text-violet-700 transition-all">
                        <Bell size={17} />
                        {unreadCount > 0 && (
                            <span className="absolute top-[5px] right-[5px] w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center border-2 border-white leading-none">{unreadCount}</span>
                        )}
                    </button>
                    {notifOpen && <NotificationsDropdown notifications={notifications} onMarkAllRead={markAllRead} />}
                </div>

                {/* Profile */}
                <div className="relative" ref={profileRef}>
                    <button onClick={() => { setProfileOpen(o => !o); setNotifOpen(false) }}
                        className={cn('flex items-center gap-2 h-[34px] pl-1.5 pr-2.5 rounded-lg border transition-all',
                            profileOpen ? 'bg-violet-50 border-violet-200' : 'bg-white border-slate-200 hover:bg-violet-50 hover:border-violet-200')}>
                        <div className="w-[26px] h-[26px] rounded-full bg-violet-100 border border-violet-200 flex items-center justify-center shrink-0">
                            <span className="text-violet-700 text-[10px] font-bold">{initials}</span>
                        </div>
                        <div className="text-left hidden sm:block">
                            <p className="text-[12px] font-medium text-slate-700 leading-tight">{user?.name ?? 'Admin'}</p>
                            <p className="text-[10px] text-slate-400 leading-tight">{isSuperAdmin ? 'Super Admin' : 'School Admin'}</p>
                        </div>
                        <ChevronDown size={12} className={cn('text-slate-400 transition-transform duration-150', profileOpen && 'rotate-180')} />
                    </button>
                    {profileOpen && <ProfileDropdown user={user} />}
                </div>
            </div>
        </header>
    )
}