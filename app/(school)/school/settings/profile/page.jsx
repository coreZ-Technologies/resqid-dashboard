'use client'

import { useState } from 'react'
import {
    ShieldCheck, CheckCircle2, Star, LayoutDashboard, Users, UserCheck,
    CalendarCheck, AlertTriangle, Clock, MessageCircle, BarChart2,
    CreditCard, Settings, Edit2, Check, X, Trash2, Laptop, Smartphone,
    Tablet, Activity, UserPlus, Camera,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Static data (replace with real API calls) ─────────────────────────────────
const PERMISSIONS = [
    { id: 'dashboard', label: 'Dashboard', desc: 'Full overview access', Icon: LayoutDashboard, default: true },
    { id: 'students', label: 'Students', desc: 'Add, edit, delete', Icon: Users, default: true },
    { id: 'teachers', label: 'Teachers', desc: 'Manage staff records', Icon: UserCheck, default: true },
    { id: 'attendance', label: 'Attendance', desc: 'Mark & review', Icon: CalendarCheck, default: true },
    { id: 'emergency', label: 'Emergency', desc: 'Trigger SOS alerts', Icon: AlertTriangle, default: true },
    { id: 'timetable', label: 'Timetable', desc: 'Schedule management', Icon: Clock, default: true },
    { id: 'communication', label: 'Communication', desc: 'Broadcast messages', Icon: MessageCircle, default: false },
    { id: 'reports', label: 'Reports', desc: 'View & export data', Icon: BarChart2, default: true },
    { id: 'billing', label: 'Billing', desc: 'Plan & payments', Icon: CreditCard, default: true },
    { id: 'settings', label: 'Settings', desc: 'School configuration', Icon: Settings, default: true },
]

const ACTIVITY_LOG = [
    { Icon: UserPlus, title: 'Added 3 new students', meta: 'Class 9B · 2 hours ago' },
    { Icon: AlertTriangle, title: 'Emergency drill triggered', meta: 'East block · Yesterday' },
    { Icon: CalendarCheck, title: 'Marked attendance — Class 10A', meta: '94% present · Yesterday' },
    { Icon: Clock, title: 'Updated timetable — Class 8B', meta: '3 periods changed · 2 days ago' },
    { Icon: Settings, title: 'Updated school profile', meta: 'Logo & address · 3 days ago' },
]

const SESSIONS = [
    { Icon: Laptop, device: 'Chrome — Windows 11', meta: 'Kolkata, India · Just now', current: true },
    { Icon: Smartphone, device: 'Safari — iPhone 15', meta: 'Kolkata, India · 3 hours ago', current: false },
    { Icon: Tablet, device: 'Chrome — iPad Pro', meta: 'Howrah, India · 2 days ago', current: false },
]

// ─── Sub-components (Notion style) ────────────────────────────────────────────

function Toggle({ checked, onChange }) {
    return (
        <button
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={cn(
                'relative w-9 h-5 rounded-full transition-colors duration-200 shrink-0',
                checked ? 'bg-violet-600' : 'bg-gray-200'
            )}
        >
            <span className={cn(
                'absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200',
                checked && 'translate-x-4'
            )} />
        </button>
    )
}

function Card({ children, className }) {
    return (
        <div className={cn('bg-white border border-violet-100 rounded-md overflow-hidden', className)}>
            {children}
        </div>
    )
}

function CardHeader({ title, icon: Icon, action }) {
    return (
        <div className="flex items-center justify-between px-5 py-3 border-b border-violet-100">
            <span className="flex items-center gap-2 text-sm font-medium text-gray-800">
                {Icon && <Icon size={15} className="text-violet-600" />}
                {title}
            </span>
            {action}
        </div>
    )
}

// ─── Profile hero (Notion style) ──────────────────────────────────────────────

function ProfileHero({ user, stats }) {
    return (
        <div className="flex items-start gap-5 p-5 border-b border-violet-100">
            {/* Avatar */}
            <div className="relative shrink-0">
                <div className="w-16 h-16 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 text-xl font-medium">
                    {(user?.name ?? 'Admin').slice(0, 2).toUpperCase()}
                </div>
                <button
                    className="absolute bottom-0 right-0 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                    aria-label="Change avatar"
                >
                    <Camera size={12} className="text-gray-500" />
                </button>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <h2 className="text-base font-semibold text-gray-800">{user?.name ?? 'Admin'}</h2>
                <p className="text-xs text-gray-500 mt-0.5">{user?.schoolName ?? 'School'} · School Admin</p>
                <div className="flex gap-2 mt-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-violet-50 text-violet-700 border border-violet-200">
                        <ShieldCheck size={10} /> Super Admin
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 size={10} /> Active
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                        <Star size={10} /> {user?.plan ?? 'Professional'} plan
                    </span>
                </div>
            </div>

            {/* Stats */}
            <div className="hidden sm:flex gap-6 shrink-0">
                {stats.map(({ label, value }) => (
                    <div key={label} className="text-center">
                        <p className="text-xl font-semibold text-gray-800">{value}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">{label}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

// ─── Personal info section (Notion style) ─────────────────────────────────────

function PersonalInfo({ user }) {
    const [editing, setEditing] = useState(false)
    const [saved, setSaved] = useState(false)
    const [form, setForm] = useState({
        name: user?.name ?? 'Animesh Karan',
        email: user?.email ?? 'admin@springdaleschool.in',
        phone: user?.phone ?? '+91 98765 43210',
        role: 'School Admin',
        schoolCode: user?.schoolCode ?? 'SPR-2024-K7',
        memberSince: user?.memberSince ?? 'January 2024',
    })

    function handleSave() {
        setEditing(false)
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
        // TODO: call PATCH /api/auth/me with form data
    }

    const fields = [
        { key: 'name', label: 'Full name', editable: true },
        { key: 'email', label: 'Email address', editable: true },
        { key: 'phone', label: 'Phone number', editable: true },
        { key: 'role', label: 'Role', editable: false },
        { key: 'schoolCode', label: 'School code', editable: false },
        { key: 'memberSince', label: 'Member since', editable: false },
    ]

    return (
        <div className="p-5">
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-gray-800">Personal information</p>
                {!editing ? (
                    <button
                        onClick={() => setEditing(true)}
                        className="flex items-center gap-1.5 h-8 px-3 rounded-md text-xs font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-all"
                    >
                        <Edit2 size={12} /> Edit profile
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={() => setEditing(false)}
                            className="flex items-center gap-1.5 h-8 px-3 rounded-md text-xs font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-all"
                        >
                            <X size={12} /> Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-1.5 h-8 px-3 rounded-md text-xs font-medium text-white bg-gradient-to-r from-violet-500 to-violet-700 hover:opacity-90 transition-all"
                        >
                            <Check size={12} /> {saved ? 'Saved!' : 'Save changes'}
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                {fields.map(({ key, label, editable }) => (
                    <div key={key}>
                        <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                            {label}
                        </label>
                        <input
                            value={form[key]}
                            readOnly={!editing || !editable}
                            onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                            className={cn(
                                'w-full h-9 px-3 rounded-md border text-sm text-gray-800 outline-none transition-all',
                                editing && editable
                                    ? 'border-gray-300 bg-white focus:border-violet-300 focus:ring-1 focus:ring-violet-100'
                                    : 'border-gray-200 bg-gray-50 text-gray-500 cursor-default'
                            )}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

// ─── Permissions section (Notion style) ───────────────────────────────────────

function PermissionsGrid() {
    const [perms, setPerms] = useState(
        Object.fromEntries(PERMISSIONS.map(p => [p.id, p.default]))
    )

    function toggle(id) {
        setPerms(prev => ({ ...prev, [id]: !prev[id] }))
        // TODO: PATCH /api/schools/:schoolId/permissions with updated perms
    }

    return (
        <div className="p-5">
            <div className="grid grid-cols-2 gap-3">
                {PERMISSIONS.map(({ id, label, desc, Icon }) => (
                    <div
                        key={id}
                        className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-md"
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-md bg-white border border-gray-200 flex items-center justify-center shrink-0">
                                <Icon size={15} className="text-gray-500" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-medium text-gray-800">{label}</p>
                                <p className="text-[10px] text-gray-400 truncate">{desc}</p>
                            </div>
                        </div>
                        <Toggle checked={perms[id]} onChange={() => toggle(id)} />
                    </div>
                ))}
            </div>
        </div>
    )
}

// ─── Activity log (Notion style) ──────────────────────────────────────────────

function ActivityLog() {
    return (
        <div className="divide-y divide-gray-100 px-5">
            {ACTIVITY_LOG.map(({ Icon, title, meta }, i) => (
                <div key={i} className="flex items-start gap-3 py-3">
                    <div className="w-7 h-7 rounded-md bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon size={13} className="text-gray-500" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-800">{title}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">{meta}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

// ─── Sessions (Notion style) ──────────────────────────────────────────────────

function Sessions() {
    const [sessions, setSessions] = useState(SESSIONS)

    function revoke(index) {
        setSessions(prev => prev.filter((_, i) => i !== index))
        // TODO: DELETE /api/auth/sessions/:sessionId
    }

    return (
        <div>
            <div className="divide-y divide-gray-100 px-5">
                {sessions.map(({ Icon, device, meta, current }, i) => (
                    <div key={i} className="flex items-center gap-3 py-3">
                        <div className="w-8 h-8 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                            <Icon size={15} className="text-gray-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-800 flex items-center gap-1.5 flex-wrap">
                                {device}
                                {current && (
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-medium text-emerald-700">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        Current
                                    </span>
                                )}
                            </p>
                            <p className="text-[10px] text-gray-500 mt-0.5">{meta}</p>
                        </div>
                        {!current && (
                            <button
                                onClick={() => revoke(i)}
                                className="text-[10px] font-medium text-gray-500 hover:text-red-600 px-2 py-1 rounded-md hover:bg-red-50 transition-all border border-gray-200 hover:border-red-200"
                            >
                                Revoke
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Danger zone */}
            <div className="mx-5 mb-5 p-4 bg-rose-50 border border-rose-200 rounded-md flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-rose-800">Danger zone</p>
                    <p className="text-xs text-rose-600 mt-0.5">Permanently delete this admin account</p>
                </div>
                <button className="flex items-center gap-1.5 h-8 px-3 rounded-md text-xs font-medium text-rose-600 bg-white border border-rose-200 hover:bg-rose-50 transition-all shrink-0">
                    <Trash2 size={12} /> Delete account
                </button>
            </div>
        </div>
    )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProfilePage({ user, stats }) {
    const defaultStats = [
        { label: 'Students', value: stats?.students ?? 847 },
        { label: 'Staff', value: stats?.staff ?? 62 },
        { label: 'Classes', value: stats?.classes ?? 24 },
    ]

    return (
        <div className="p-6 space-y-5">

            {/* Hero card */}
            <Card>
                <ProfileHero user={user} stats={defaultStats} />
                <PersonalInfo user={user} />
            </Card>

            {/* Permissions card */}
            <Card>
                <CardHeader
                    title="Module permissions"
                    icon={ShieldCheck}
                    action={<span className="text-[10px] text-gray-500">Toggle to grant or revoke access</span>}
                />
                <PermissionsGrid />
            </Card>

            {/* Two-column footer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Card>
                    <CardHeader
                        title="Recent activity"
                        icon={Activity}
                        action={
                            <a href="/school/activity-log" className="text-[10px] font-medium text-violet-600 hover:text-violet-700">
                                View all
                            </a>
                        }
                    />
                    <ActivityLog />
                </Card>

                <Card>
                    <CardHeader
                        title="Active sessions"
                        icon={Laptop}
                        action={
                            <button className="text-[10px] font-medium text-gray-500 hover:text-red-600">
                                Revoke all
                            </button>
                        }
                    />
                    <Sessions />
                </Card>
            </div>

        </div>
    )
}