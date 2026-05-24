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
    { id: 'dashboard', label: 'Dashboard', desc: 'Full overview access', Icon: LayoutDashboard, color: 'bg-blue-50', icon: 'text-blue-500', default: true },
    { id: 'students', label: 'Students', desc: 'Add, edit, delete', Icon: Users, color: 'bg-green-50', icon: 'text-green-500', default: true },
    { id: 'teachers', label: 'Teachers', desc: 'Manage staff records', Icon: UserCheck, color: 'bg-green-50', icon: 'text-green-500', default: true },
    { id: 'attendance', label: 'Attendance', desc: 'Mark & review', Icon: CalendarCheck, color: 'bg-blue-50', icon: 'text-blue-500', default: true },
    { id: 'emergency', label: 'Emergency', desc: 'Trigger SOS alerts', Icon: AlertTriangle, color: 'bg-amber-50', icon: 'text-amber-500', default: true },
    { id: 'timetable', label: 'Timetable', desc: 'Schedule management', Icon: Clock, color: 'bg-blue-50', icon: 'text-blue-500', default: true },
    { id: 'communication', label: 'Communication', desc: 'Broadcast messages', Icon: MessageCircle, color: 'bg-violet-50', icon: 'text-violet-500', default: false },
    { id: 'reports', label: 'Reports', desc: 'View & export data', Icon: BarChart2, color: 'bg-blue-50', icon: 'text-blue-500', default: true },
    { id: 'billing', label: 'Billing', desc: 'Plan & payments', Icon: CreditCard, color: 'bg-red-50', icon: 'text-red-500', default: true },
    { id: 'settings', label: 'Settings', desc: 'School configuration', Icon: Settings, color: 'bg-slate-50', icon: 'text-slate-500', default: true },
]

const ACTIVITY_LOG = [
    { Icon: UserPlus, color: 'bg-blue-50', icon: 'text-blue-500', title: 'Added 3 new students', meta: 'Class 9B · 2 hours ago' },
    { Icon: AlertTriangle, color: 'bg-amber-50', icon: 'text-amber-500', title: 'Emergency drill triggered', meta: 'East block · Yesterday' },
    { Icon: CalendarCheck, color: 'bg-green-50', icon: 'text-green-500', title: 'Marked attendance — Class 10A', meta: '94% present · Yesterday' },
    { Icon: Clock, color: 'bg-violet-50', icon: 'text-violet-500', title: 'Updated timetable — Class 8B', meta: '3 periods changed · 2 days ago' },
    { Icon: Settings, color: 'bg-red-50', icon: 'text-red-500', title: 'Updated school profile', meta: 'Logo & address · 3 days ago' },
]

const SESSIONS = [
    { Icon: Laptop, device: 'Chrome — Windows 11', meta: 'Kolkata, India · Just now', current: true },
    { Icon: Smartphone, device: 'Safari — iPhone 15', meta: 'Kolkata, India · 3 hours ago', current: false },
    { Icon: Tablet, device: 'Chrome — iPad Pro', meta: 'Howrah, India · 2 days ago', current: false },
]

// ─── Sub-components ────────────────────────────────────────────────────────────

function Toggle({ checked, onChange }) {
    return (
        <button
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={cn(
                'relative w-9 h-5 rounded-full transition-colors duration-200 shrink-0',
                checked ? 'bg-blue-600' : 'bg-slate-200'
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
        <div className={cn('bg-white border border-slate-200 rounded-xl overflow-hidden', className)}>
            {children}
        </div>
    )
}

function CardHeader({ title, icon: Icon, action }) {
    return (
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <span className="flex items-center gap-2 text-[13px] font-semibold text-slate-800">
                {Icon && <Icon size={15} className="text-blue-500" />}
                {title}
            </span>
            {action}
        </div>
    )
}

// ─── Profile hero ──────────────────────────────────────────────────────────────

function ProfileHero({ user, stats }) {
    return (
        <div className="flex items-center gap-5 px-6 py-5 border-b border-slate-100">
            {/* Avatar */}
            <div className="relative shrink-0">
                <div className="w-[72px] h-[72px] rounded-full bg-blue-100 border-2 border-blue-200 flex items-center justify-center text-blue-700 text-2xl font-bold">
                    {(user?.name ?? 'Admin').slice(0, 2).toUpperCase()}
                </div>
                <button
                    className="absolute bottom-0 right-0 w-6 h-6 bg-blue-600 border-2 border-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                    aria-label="Change avatar"
                >
                    <Camera size={10} className="text-white" />
                </button>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <h2 className="text-[18px] font-bold text-slate-900">{user?.name ?? 'Admin'}</h2>
                <p className="text-[12px] text-slate-500 mt-0.5">{user?.schoolName ?? 'School'} · School Admin</p>
                <div className="flex gap-1.5 mt-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-100 text-blue-700 border border-blue-200">
                        <ShieldCheck size={10} /> Super Admin
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-green-100 text-green-700 border border-green-200">
                        <CheckCircle2 size={10} /> Active
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-100 text-amber-700 border border-amber-200">
                        <Star size={10} /> {user?.plan ?? 'Professional'} plan
                    </span>
                </div>
            </div>

            {/* Stats */}
            <div className="hidden sm:flex gap-6 shrink-0">
                {stats.map(({ label, value }) => (
                    <div key={label} className="text-center">
                        <p className="text-[20px] font-bold text-blue-600">{value}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{label}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

// ─── Personal info section ─────────────────────────────────────────────────────

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
        <div className="px-5 py-5">
            <div className="flex items-center justify-between mb-4">
                <p className="text-[13px] font-semibold text-slate-800">Personal information</p>
                {!editing ? (
                    <button
                        onClick={() => setEditing(true)}
                        className="flex items-center gap-1.5 h-[32px] px-3 rounded-lg text-[12px] font-medium text-slate-600 bg-slate-50 border border-slate-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all"
                    >
                        <Edit2 size={12} /> Edit profile
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={() => setEditing(false)}
                            className="flex items-center gap-1.5 h-[32px] px-3 rounded-lg text-[12px] font-medium text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-all"
                        >
                            <X size={12} /> Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-1.5 h-[32px] px-3 rounded-lg text-[12px] font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all"
                        >
                            <Check size={12} /> {saved ? 'Saved!' : 'Save changes'}
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                {fields.map(({ key, label, editable }) => (
                    <div key={key}>
                        <label className="block text-[10.5px] font-500 text-slate-500 uppercase tracking-wide mb-1.5">
                            {label}
                        </label>
                        <input
                            value={form[key]}
                            readOnly={!editing || !editable}
                            onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                            className={cn(
                                'w-full h-[36px] px-3 rounded-lg border text-[13px] text-slate-800 outline-none transition-all',
                                editing && editable
                                    ? 'border-slate-300 bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
                                    : 'border-slate-200 bg-slate-50 text-slate-500 cursor-default'
                            )}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

// ─── Permissions section ───────────────────────────────────────────────────────

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
            <div className="grid grid-cols-2 gap-2.5">
                {PERMISSIONS.map(({ id, label, desc, Icon, color, icon }) => (
                    <div
                        key={id}
                        className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg"
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', color)}>
                                <Icon size={15} className={icon} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[12.5px] font-medium text-slate-800">{label}</p>
                                <p className="text-[11px] text-slate-400 truncate">{desc}</p>
                            </div>
                        </div>
                        <Toggle checked={perms[id]} onChange={() => toggle(id)} />
                    </div>
                ))}
            </div>
        </div>
    )
}

// ─── Activity log ──────────────────────────────────────────────────────────────

function ActivityLog() {
    return (
        <div className="divide-y divide-slate-50 px-5">
            {ACTIVITY_LOG.map(({ Icon, color, icon, title, meta }, i) => (
                <div key={i} className="flex items-start gap-3 py-3">
                    <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5', color)}>
                        <Icon size={13} className={icon} />
                    </div>
                    <div>
                        <p className="text-[12.5px] font-medium text-slate-800">{title}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{meta}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

// ─── Sessions ──────────────────────────────────────────────────────────────────

function Sessions() {
    const [sessions, setSessions] = useState(SESSIONS)

    function revoke(index) {
        setSessions(prev => prev.filter((_, i) => i !== index))
        // TODO: DELETE /api/auth/sessions/:sessionId
    }

    return (
        <div>
            <div className="divide-y divide-slate-50 px-5">
                {sessions.map(({ Icon, device, meta, current }, i) => (
                    <div key={i} className="flex items-center gap-3 py-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                            <Icon size={15} className="text-blue-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[12.5px] font-medium text-slate-800 flex items-center gap-1.5">
                                {device}
                                {current && (
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-green-100 border border-green-200 text-[10px] font-medium text-green-700">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                        Current
                                    </span>
                                )}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">{meta}</p>
                        </div>
                        {!current && (
                            <button
                                onClick={() => revoke(i)}
                                className="text-[11px] font-medium text-slate-500 hover:text-red-600 px-2.5 py-1 rounded-lg hover:bg-red-50 transition-all border border-slate-200 hover:border-red-200"
                            >
                                Revoke
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Danger zone */}
            <div className="mx-5 mb-5 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between gap-4">
                <div>
                    <p className="text-[13px] font-semibold text-red-800">Danger zone</p>
                    <p className="text-[11.5px] text-red-600 mt-0.5">Permanently delete this admin account</p>
                </div>
                <button className="flex items-center gap-1.5 h-[32px] px-3 rounded-lg text-[12px] font-medium text-red-600 bg-white border border-red-200 hover:bg-red-100 transition-all shrink-0">
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
        <div className="p-6 space-y-4">

            {/* Hero */}
            <Card>
                <ProfileHero user={user} stats={defaultStats} />
                <PersonalInfo user={user} />
            </Card>

            {/* Permissions */}
            <Card>
                <CardHeader
                    title="Module permissions"
                    icon={ShieldCheck}
                    action={<span className="text-[11px] text-slate-400">Toggle to grant or revoke access</span>}
                />
                <PermissionsGrid />
            </Card>

            {/* Bottom row */}
            <div className="grid grid-cols-2 gap-4">
                <Card>
                    <CardHeader
                        title="Recent activity"
                        icon={Activity}
                        action={
                            <a href="/school/activity-log" className="text-[11px] font-medium text-blue-600 hover:text-blue-700">
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
                            <button className="text-[11px] font-medium text-red-500 hover:text-red-700">
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