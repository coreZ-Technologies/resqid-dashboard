'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import {
    Bell, Search, ChevronDown, Settings,
    LogOut, User, HelpCircle, X, CheckCheck
} from 'lucide-react'
import { cn } from '@/lib/utils'

const PAGE_TITLES = {
    '/school': { title: 'Dashboard', sub: 'Welcome back' },
    '/school/students': { title: 'Students', sub: 'Manage student records' },
    '/school/teachers': { title: 'Teachers', sub: 'Manage teaching staff' },
    '/school/parents': { title: 'Parents', sub: 'Parent directory' },
    '/school/attendance': { title: 'Attendance', sub: 'Track daily attendance' },
    '/school/timetable': { title: 'Timetable', sub: 'Class schedules' },
    '/school/emergency': { title: 'Emergency', sub: 'RESQID alert system' },
    '/school/communication': { title: 'Parent Communication', sub: 'Messages & announcements' },
    '/school/reports': { title: 'Reports & Analytics', sub: 'Insights and data' },
    '/school/notifications': { title: 'Notifications', sub: 'System notifications' },
    '/school/activity-log': { title: 'Activity Log', sub: 'Recent actions' },
    '/school/settings': { title: 'Settings', sub: 'Manage preferences' },
    '/school/settings/school-profile': { title: 'School Profile', sub: 'Edit school details' },
    '/school/settings/staff': { title: 'Staff Management', sub: 'Roles and access' },
    '/school/settings/billing': { title: 'Billing & Plan', sub: 'Subscription management' },
    '/school/help': { title: 'Help & Docs', sub: 'Support resources' },
    '/school/upgrade': { title: 'Upgrade Plan', sub: 'Unlock more modules' },
}

const MOCK_NOTIFICATIONS = [
    { id: 1, type: 'alert', title: 'Emergency drill triggered', body: 'East block — 10 minutes ago', unread: true },
    { id: 2, type: 'info', title: '3 students marked absent', body: 'Class 8A — 30 minutes ago', unread: true },
    { id: 3, type: 'message', title: 'New message from Sunita Sharma', body: 'Re: Priya\'s leave — 2h ago', unread: true },
    { id: 4, type: 'success', title: 'Timetable updated', body: 'Class 10B schedule — Yesterday', unread: false },
    { id: 5, type: 'info', title: 'Monthly report ready', body: 'April 2026 — 2 days ago', unread: false },
]

const NOTIF_COLORS = {
    alert: 'bg-red-500/10 text-red-400',
    info: 'bg-blue-500/10 text-blue-400',
    message: 'bg-emerald-500/10 text-emerald-400',
    success: 'bg-emerald-500/10 text-emerald-400',
}

const NOTIF_DOT = {
    alert: 'bg-red-400',
    info: 'bg-blue-400',
    message: 'bg-emerald-400',
    success: 'bg-emerald-400',
}

export default function Topbar({ user }) {
    const pathname = usePathname()
    const [searchOpen, setSearchOpen] = useState(false)
    const [searchVal, setSearchVal] = useState('')
    const [notifOpen, setNotifOpen] = useState(false)
    const [profileOpen, setProfileOpen] = useState(false)
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)

    const pageInfo = PAGE_TITLES[pathname] ?? { title: 'RESQID', sub: '' }
    const unreadCount = notifications.filter(n => n.unread).length

    function markAllRead() {
        setNotifications(prev => prev.map(n => ({ ...n, unread: false })))
    }

    function closeAll() {
        setNotifOpen(false)
        setProfileOpen(false)
    }

    return (
        <>
            {/* Backdrop for dropdowns */}
            {(notifOpen || profileOpen) && (
                <div className="fixed inset-0 z-20" onClick={closeAll} />
            )}

            <header className="h-[60px] shrink-0 flex items-center justify-between px-6 bg-white border-b border-slate-100">

                {/* Left — page title */}
                <div>
                    <h1 className="text-[15px] font-semibold text-slate-800 leading-tight">{pageInfo.title}</h1>
                    {pageInfo.sub && (
                        <p className="text-[11px] text-slate-400 leading-tight mt-0.5">{pageInfo.sub}</p>
                    )}
                </div>

                {/* Right — actions */}
                <div className="flex items-center gap-2">

                    {/* Search */}
                    <div className={cn(
                        'flex items-center gap-2 h-8 rounded-lg border transition-all duration-200 overflow-hidden',
                        searchOpen
                            ? 'w-[220px] border-slate-200 bg-slate-50 px-3'
                            : 'w-8 border-transparent bg-transparent px-0 justify-center cursor-pointer hover:bg-slate-50 hover:border-slate-200'
                    )}
                        onClick={() => !searchOpen && setSearchOpen(true)}
                    >
                        <Search size={14} className="text-slate-400 shrink-0" />
                        {searchOpen && (
                            <>
                                <input
                                    autoFocus
                                    value={searchVal}
                                    onChange={e => setSearchVal(e.target.value)}
                                    placeholder="Search students, teachers..."
                                    className="flex-1 bg-transparent text-[13px] text-slate-700 placeholder-slate-400 outline-none"
                                />
                                <button onClick={(e) => { e.stopPropagation(); setSearchOpen(false); setSearchVal('') }}>
                                    <X size={12} className="text-slate-400 hover:text-slate-600" />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Notifications */}
                    <div className="relative z-30">
                        <button
                            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false) }}
                            className="relative w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all"
                        >
                            <Bell size={16} />
                            {unreadCount > 0 && (
                                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center leading-none">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {/* Notif dropdown */}
                        {notifOpen && (
                            <div className="absolute right-0 top-10 w-[340px] bg-white rounded-xl border border-slate-200 shadow-xl shadow-slate-200/60 overflow-hidden">
                                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                                    <div>
                                        <p className="text-[13px] font-semibold text-slate-800">Notifications</p>
                                        {unreadCount > 0 && (
                                            <p className="text-[11px] text-slate-400">{unreadCount} unread</p>
                                        )}
                                    </div>
                                    {unreadCount > 0 && (
                                        <button
                                            onClick={markAllRead}
                                            className="flex items-center gap-1.5 text-[11px] text-emerald-600 hover:text-emerald-700 font-medium"
                                        >
                                            <CheckCheck size={12} />
                                            Mark all read
                                        </button>
                                    )}
                                </div>
                                <div className="max-h-[320px] overflow-y-auto divide-y divide-slate-50">
                                    {notifications.map(n => (
                                        <div
                                            key={n.id}
                                            className={cn(
                                                'flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer',
                                                n.unread && 'bg-slate-50/80'
                                            )}
                                        >
                                            <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5', NOTIF_COLORS[n.type])}>
                                                <div className={cn('w-1.5 h-1.5 rounded-full', NOTIF_DOT[n.type])} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={cn('text-[12px] font-medium leading-snug', n.unread ? 'text-slate-800' : 'text-slate-500')}>
                                                    {n.title}
                                                </p>
                                                <p className="text-[11px] text-slate-400 mt-0.5">{n.body}</p>
                                            </div>
                                            {n.unread && (
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="px-4 py-2.5 border-t border-slate-100 text-center">
                                    <button className="text-[12px] text-emerald-600 hover:text-emerald-700 font-medium">
                                        View all notifications
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="w-px h-5 bg-slate-200 mx-1" />

                    {/* Profile */}
                    <div className="relative z-30">
                        <button
                            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false) }}
                            className="flex items-center gap-2.5 h-8 pl-1 pr-2 rounded-lg hover:bg-slate-100 transition-all"
                        >
                            <div className="w-6 h-6 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0">
                                <span className="text-emerald-700 text-[10px] font-bold">
                                    {(user?.name ?? 'A').slice(0, 2).toUpperCase()}
                                </span>
                            </div>
                            <div className="text-left hidden sm:block">
                                <p className="text-[12px] font-medium text-slate-700 leading-tight">{user?.name ?? 'Admin'}</p>
                                <p className="text-[10px] text-slate-400 leading-tight">School Admin</p>
                            </div>
                            <ChevronDown size={12} className={cn('text-slate-400 transition-transform', profileOpen && 'rotate-180')} />
                        </button>

                        {/* Profile dropdown */}
                        {profileOpen && (
                            <div className="absolute right-0 top-10 w-[200px] bg-white rounded-xl border border-slate-200 shadow-xl shadow-slate-200/60 overflow-hidden">
                                <div className="px-4 py-3 border-b border-slate-100">
                                    <p className="text-[12px] font-semibold text-slate-800">{user?.name ?? 'Admin'}</p>
                                    <p className="text-[11px] text-slate-400 truncate">{user?.email ?? ''}</p>
                                </div>
                                <div className="py-1">
                                    {[
                                        { icon: User, label: 'Profile', href: '/school/settings' },
                                        { icon: Settings, label: 'Settings', href: '/school/settings' },
                                        { icon: HelpCircle, label: 'Help & Docs', href: '/school/help' },
                                    ].map(({ icon: Icon, label, href }) => (
                                        <a
                                            key={label}
                                            href={href}
                                            className="flex items-center gap-3 px-4 py-2 text-[13px] text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                                        >
                                            <Icon size={14} className="text-slate-400" />
                                            {label}
                                        </a>
                                    ))}
                                </div>
                                <div className="border-t border-slate-100 py-1">
                                    <button className="flex items-center gap-3 w-full px-4 py-2 text-[13px] text-red-500 hover:bg-red-50 transition-colors">
                                        <LogOut size={14} />
                                        Sign out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>
        </>
    )
}