'use client'

import { useState } from 'react'
import {
    Building2, Bell, ShieldCheck, CreditCard, Puzzle,
    Edit2, Check, X, Upload, Mail, MessageSquare, Smartphone,
    AlertTriangle, CheckCircle2, Info, ChevronRight,
    Laptop, Tablet, Trash2, RefreshCw, Download, ExternalLink,
    Lock, Key, Eye, EyeOff, Zap, Star, Users, Globe,
    ToggleLeft, Save,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Static data (replace with real API calls) ─────────────────────────────────

const SCHOOL_INFO = {
    name: 'Springdale Public School',
    code: 'SPR-2024-K7',
    board: 'CBSE',
    address: '42, Park Street, Kolkata, West Bengal - 700016',
    phone: '+91 33 2229 4400',
    email: 'admin@springdaleschool.in',
    website: 'www.springdaleschool.in',
    established: '1998',
    type: 'Co-educational',
    medium: 'English',
}

const NOTIFICATION_PREFS = [
    {
        id: 'emergency_alerts',
        label: 'Emergency alerts',
        desc: 'SOS triggers, drill notifications',
        icon: AlertTriangle,
        color: 'bg-red-50',
        iconCls: 'text-red-500',
        channels: { email: true, sms: true, push: true },
    },
    {
        id: 'attendance_reports',
        label: 'Attendance reports',
        desc: 'Daily summary & anomalies',
        icon: CheckCircle2,
        color: 'bg-green-50',
        iconCls: 'text-green-500',
        channels: { email: true, sms: false, push: true },
    },
    {
        id: 'new_registrations',
        label: 'New registrations',
        desc: 'Student & parent sign-ups',
        icon: Users,
        color: 'bg-blue-50',
        iconCls: 'text-blue-500',
        channels: { email: true, sms: false, push: false },
    },
    {
        id: 'billing_updates',
        label: 'Billing & payments',
        desc: 'Invoices, renewals, failures',
        icon: CreditCard,
        color: 'bg-amber-50',
        iconCls: 'text-amber-500',
        channels: { email: true, sms: true, push: false },
    },
    {
        id: 'system_updates',
        label: 'System updates',
        desc: 'Maintenance, new features',
        icon: RefreshCw,
        color: 'bg-violet-50',
        iconCls: 'text-violet-500',
        channels: { email: true, sms: false, push: false },
    },
    {
        id: 'login_activity',
        label: 'Login activity',
        desc: 'New sessions, suspicious access',
        icon: ShieldCheck,
        color: 'bg-slate-100',
        iconCls: 'text-slate-500',
        channels: { email: true, sms: false, push: true },
    },
]

const SESSIONS = [
    { Icon: Laptop, device: 'Chrome — Windows 11', meta: 'Kolkata, India · Just now', current: true, id: 1 },
    { Icon: Smartphone, device: 'Safari — iPhone 15', meta: 'Kolkata, India · 3 hours ago', current: false, id: 2 },
    { Icon: Tablet, device: 'Chrome — iPad Pro', meta: 'Howrah, India · 2 days ago', current: false, id: 3 },
]

const BILLING_PLAN = {
    name: 'Standard',
    price: '₹4,999',
    cycle: 'per year',
    renewsOn: 'March 15, 2026',
    students: 847,
    studentLimit: 1000,
    features: [
        'QR-based emergency ID cards',
        'Parent portal access',
        'Attendance & timetable modules',
        'Email & SMS notifications',
        'Reports & analytics',
    ],
    upgrades: [
        { label: 'Emergency SOS alerts', plan: 'Professional' },
        { label: 'Parent communication broadcast', plan: 'Enterprise' },
        { label: 'Custom branding on ID cards', plan: 'Professional' },
    ],
}

const BOARDS = ['CBSE', 'ICSE', 'IB', 'State Board', 'NIOS']
const SCHOOL_TYPES = ['Co-educational', 'Boys', 'Girls']
const MEDIUMS = ['English', 'Hindi', 'Bengali', 'Other']

const TABS = [
    { id: 'profile', label: 'School profile', Icon: Building2 },
    { id: 'notifications', label: 'Notifications', Icon: Bell },
    { id: 'security', label: 'Security', Icon: ShieldCheck },
    { id: 'billing', label: 'Billing', Icon: CreditCard },
]

// ─── Shared primitives ─────────────────────────────────────────────────────────

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

function CardHeader({ title, icon: Icon, action, desc }) {
    return (
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div>
                <span className="flex items-center gap-2 text-[13px] font-semibold text-slate-800">
                    {Icon && <Icon size={15} className="text-blue-500" />}
                    {title}
                </span>
                {desc && <p className="text-[11px] text-slate-400 mt-0.5">{desc}</p>}
            </div>
            {action}
        </div>
    )
}

function Field({ label, value, editable, editing, onChange }) {
    return (
        <div>
            <label className="block text-[10.5px] font-medium text-slate-500 uppercase tracking-wide mb-1.5">
                {label}
            </label>
            <input
                value={value}
                readOnly={!editing || !editable}
                onChange={e => onChange?.(e.target.value)}
                className={cn(
                    'w-full h-[36px] px-3 rounded-lg border text-[13px] text-slate-800 outline-none transition-all',
                    editing && editable
                        ? 'border-slate-300 bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
                        : 'border-slate-200 bg-slate-50 text-slate-500 cursor-default'
                )}
            />
        </div>
    )
}

function SelectField({ label, value, options, editable, editing, onChange }) {
    return (
        <div>
            <label className="block text-[10.5px] font-medium text-slate-500 uppercase tracking-wide mb-1.5">
                {label}
            </label>
            {editing && editable ? (
                <select
                    value={value}
                    onChange={e => onChange?.(e.target.value)}
                    className="w-full h-[36px] px-3 rounded-lg border border-slate-300 bg-white text-[13px] text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                >
                    {options.map(o => <option key={o}>{o}</option>)}
                </select>
            ) : (
                <input
                    value={value}
                    readOnly
                    className="w-full h-[36px] px-3 rounded-lg border border-slate-200 bg-slate-50 text-[13px] text-slate-500 cursor-default outline-none"
                />
            )}
        </div>
    )
}

function SaveRow({ editing, saved, onEdit, onCancel, onSave }) {
    if (!editing) {
        return (
            <div className="flex justify-end pt-1">
                <button
                    onClick={onEdit}
                    className="flex items-center gap-1.5 h-[32px] px-3 rounded-lg text-[12px] font-medium text-slate-600 bg-slate-50 border border-slate-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all"
                >
                    <Edit2 size={12} /> Edit
                </button>
            </div>
        )
    }
    return (
        <div className="flex justify-end gap-2 pt-1">
            <button
                onClick={onCancel}
                className="flex items-center gap-1.5 h-[32px] px-3 rounded-lg text-[12px] font-medium text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-all"
            >
                <X size={12} /> Cancel
            </button>
            <button
                onClick={onSave}
                className="flex items-center gap-1.5 h-[32px] px-3 rounded-lg text-[12px] font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all"
            >
                <Check size={12} /> {saved ? 'Saved!' : 'Save changes'}
            </button>
        </div>
    )
}

// ─── Tab: School profile ───────────────────────────────────────────────────────

function SchoolProfileTab() {
    const [editing, setEditing] = useState(false)
    const [saved, setSaved] = useState(false)
    const [form, setForm] = useState(SCHOOL_INFO)

    function set(key) {
        return val => setForm(prev => ({ ...prev, [key]: val }))
    }

    function handleSave() {
        setEditing(false)
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
        // TODO: PATCH /api/schools/:schoolId
    }

    return (
        <div className="space-y-4">

            {/* Basic info */}
            <Card>
                <CardHeader
                    title="Basic information"
                    icon={Building2}
                    desc="Your school's identity on RESQID"
                />
                <div className="p-5 space-y-4">

                    {/* Logo upload */}
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-blue-100 border-2 border-blue-200 flex items-center justify-center text-blue-700 text-xl font-bold shrink-0">
                            SP
                        </div>
                        {editing ? (
                            <button className="flex items-center gap-2 h-[32px] px-3 rounded-lg text-[12px] font-medium text-slate-600 bg-slate-50 border border-slate-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all">
                                <Upload size={12} /> Upload logo
                            </button>
                        ) : (
                            <div>
                                <p className="text-[12.5px] font-medium text-slate-700">School logo</p>
                                <p className="text-[11px] text-slate-400 mt-0.5">PNG or JPG, max 2MB</p>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Field label="School name" value={form.name} editable editing={editing} onChange={set('name')} />
                        <Field label="School code" value={form.code} editable={false} editing={editing} />
                        <SelectField label="Board affiliation" value={form.board} options={BOARDS} editable editing={editing} onChange={set('board')} />
                        <Field label="Established year" value={form.established} editable editing={editing} onChange={set('established')} />
                        <SelectField label="School type" value={form.type} options={SCHOOL_TYPES} editable editing={editing} onChange={set('type')} />
                        <SelectField label="Medium of instruction" value={form.medium} options={MEDIUMS} editable editing={editing} onChange={set('medium')} />
                    </div>

                    <SaveRow
                        editing={editing} saved={saved}
                        onEdit={() => setEditing(true)}
                        onCancel={() => { setEditing(false); setForm(SCHOOL_INFO) }}
                        onSave={handleSave}
                    />
                </div>
            </Card>

            {/* Contact info */}
            <Card>
                <CardHeader title="Contact details" icon={Globe} desc="How parents & staff reach the school" />
                <div className="p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <Field label="Address" value={form.address} editable editing={editing} onChange={set('address')} />
                        </div>
                        <Field label="Phone number" value={form.phone} editable editing={editing} onChange={set('phone')} />
                        <Field label="Official email" value={form.email} editable editing={editing} onChange={set('email')} />
                        <Field label="Website" value={form.website} editable editing={editing} onChange={set('website')} />
                    </div>
                    <SaveRow
                        editing={editing} saved={saved}
                        onEdit={() => setEditing(true)}
                        onCancel={() => { setEditing(false); setForm(SCHOOL_INFO) }}
                        onSave={handleSave}
                    />
                </div>
            </Card>

        </div>
    )
}

// ─── Digest card (extracted to avoid hooks-in-map) ────────────────────────────

const DIGEST_ITEMS = [
    { label: 'Daily attendance digest', desc: 'Sent every morning at 8 AM', defaultOn: true },
    { label: 'Weekly activity summary', desc: 'Sent every Monday at 9 AM', defaultOn: true },
    { label: 'Monthly billing statement', desc: 'Sent on the 1st of each month', defaultOn: false },
]

function DigestCard() {
    const [on, setOn] = useState(
        Object.fromEntries(DIGEST_ITEMS.map((item, i) => [i, item.defaultOn]))
    )
    return (
        <Card>
            <CardHeader title="Digest & summary" icon={Mail} desc="Scheduled email summaries" />
            <div className="divide-y divide-slate-50 px-5">
                {DIGEST_ITEMS.map(({ label, desc }, i) => (
                    <div key={i} className="flex items-center justify-between py-3">
                        <div>
                            <p className="text-[12.5px] font-medium text-slate-800">{label}</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">{desc}</p>
                        </div>
                        <Toggle checked={on[i]} onChange={v => setOn(prev => ({ ...prev, [i]: v }))} />
                    </div>
                ))}
            </div>
        </Card>
    )
}

// ─── Tab: Notifications ────────────────────────────────────────────────────────

function NotificationsTab() {
    const [prefs, setPrefs] = useState(
        Object.fromEntries(NOTIFICATION_PREFS.map(p => [p.id, { ...p.channels }]))
    )

    function toggle(id, channel) {
        setPrefs(prev => ({
            ...prev,
            [id]: { ...prev[id], [channel]: !prev[id][channel] },
        }))
        // TODO: PATCH /api/schools/:schoolId/notification-prefs
    }

    const CHANNELS = [
        { key: 'email', Icon: Mail, label: 'Email' },
        { key: 'sms', Icon: Smartphone, label: 'SMS' },
        { key: 'push', Icon: Bell, label: 'Push' },
    ]

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader
                    title="Notification preferences"
                    icon={Bell}
                    desc="Choose how & when you get notified"
                />
                {/* Channel headers */}
                <div className="px-5 pt-4">
                    <div className="grid grid-cols-[1fr_80px_80px_80px] gap-2 pb-2 border-b border-slate-100">
                        <span className="text-[10.5px] font-medium text-slate-400 uppercase tracking-wide">Event</span>
                        {CHANNELS.map(({ key, label }) => (
                            <span key={key} className="text-[10.5px] font-medium text-slate-400 uppercase tracking-wide text-center">
                                {label}
                            </span>
                        ))}
                    </div>

                    <div className="divide-y divide-slate-50">
                        {NOTIFICATION_PREFS.map(({ id, label, desc, icon: Icon, color, iconCls }) => (
                            <div key={id} className="grid grid-cols-[1fr_80px_80px_80px] gap-2 items-center py-3">
                                <div className="flex items-center gap-3">
                                    <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center shrink-0', color)}>
                                        <Icon size={13} className={iconCls} />
                                    </div>
                                    <div>
                                        <p className="text-[12.5px] font-medium text-slate-800">{label}</p>
                                        <p className="text-[11px] text-slate-400">{desc}</p>
                                    </div>
                                </div>
                                {CHANNELS.map(({ key }) => (
                                    <div key={key} className="flex justify-center">
                                        <Toggle
                                            checked={prefs[id][key]}
                                            onChange={() => toggle(id, key)}
                                        />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="px-5 py-4 bg-blue-50 border-t border-blue-100 flex items-center gap-2">
                    <Info size={13} className="text-blue-500 shrink-0" />
                    <p className="text-[11.5px] text-blue-700">
                        SMS notifications consume credits from your MSG91 balance. <a href="#" className="underline font-medium">Check balance</a>
                    </p>
                </div>
            </Card>

            {/* Digest settings */}
            <DigestCard />
        </div>
    )
}

// ─── Tab: Security ─────────────────────────────────────────────────────────────

function SecurityTab() {
    const [sessions, setSessions] = useState(SESSIONS)
    const [showCurrent, setShowCurrent] = useState(false)
    const [twoFA, setTwoFA] = useState(false)
    const [loginAlerts, setLoginAlerts] = useState(true)
    const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' })
    const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false })
    const [pwSaved, setPwSaved] = useState(false)

    function revoke(id) {
        setSessions(prev => prev.filter(s => s.id !== id))
        // TODO: DELETE /api/auth/sessions/:sessionId
    }

    function revokeAll() {
        setSessions(prev => prev.filter(s => s.current))
        // TODO: DELETE /api/auth/sessions?all=true
    }

    function handlePasswordSave() {
        setPwSaved(true)
        setPwForm({ current: '', next: '', confirm: '' })
        setTimeout(() => setPwSaved(false), 2000)
        // TODO: PATCH /api/auth/change-password
    }

    function pwField(key, label) {
        return (
            <div>
                <label className="block text-[10.5px] font-medium text-slate-500 uppercase tracking-wide mb-1.5">{label}</label>
                <div className="relative">
                    <input
                        type={showPw[key] ? 'text' : 'password'}
                        value={pwForm[key]}
                        onChange={e => setPwForm(prev => ({ ...prev, [key]: e.target.value }))}
                        placeholder="••••••••"
                        className="w-full h-[36px] px-3 pr-9 rounded-lg border border-slate-300 bg-white text-[13px] text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPw(prev => ({ ...prev, [key]: !prev[key] }))}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                        {showPw[key] ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4">

            {/* Change password */}
            <Card>
                <CardHeader title="Change password" icon={Key} desc="Use a strong password you don't use elsewhere" />
                <div className="p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">{pwField('current', 'Current password')}</div>
                        {pwField('next', 'New password')}
                        {pwField('confirm', 'Confirm new password')}
                    </div>
                    <div className="flex justify-end">
                        <button
                            onClick={handlePasswordSave}
                            className="flex items-center gap-1.5 h-[32px] px-3 rounded-lg text-[12px] font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all"
                        >
                            <Lock size={12} /> {pwSaved ? 'Password updated!' : 'Update password'}
                        </button>
                    </div>
                </div>
            </Card>

            {/* 2FA + login alerts */}
            <Card>
                <CardHeader title="Access controls" icon={ShieldCheck} />
                <div className="divide-y divide-slate-50 px-5">
                    <div className="flex items-center justify-between py-3.5">
                        <div>
                            <p className="text-[12.5px] font-medium text-slate-800">Two-factor authentication</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">Secure your account with OTP on login</p>
                        </div>
                        <Toggle checked={twoFA} onChange={setTwoFA} />
                    </div>
                    <div className="flex items-center justify-between py-3.5">
                        <div>
                            <p className="text-[12.5px] font-medium text-slate-800">Login activity alerts</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">Get notified on new or suspicious logins</p>
                        </div>
                        <Toggle checked={loginAlerts} onChange={setLoginAlerts} />
                    </div>
                </div>
            </Card>

            {/* Active sessions */}
            <Card>
                <CardHeader
                    title="Active sessions"
                    icon={Laptop}
                    action={
                        <button
                            onClick={revokeAll}
                            className="text-[11px] font-medium text-red-500 hover:text-red-700"
                        >
                            Revoke all
                        </button>
                    }
                />
                <div className="divide-y divide-slate-50 px-5">
                    {sessions.map(({ Icon, device, meta, current, id }) => (
                        <div key={id} className="flex items-center gap-3 py-3">
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
                                    onClick={() => revoke(id)}
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
            </Card>

        </div>
    )
}

// ─── Tab: Billing ──────────────────────────────────────────────────────────────

function BillingTab() {
    const used = BILLING_PLAN.students
    const limit = BILLING_PLAN.studentLimit
    const pct = Math.round((used / limit) * 100)

    return (
        <div className="space-y-4">

            {/* Current plan */}
            <Card>
                <CardHeader title="Current plan" icon={Star} desc="Your active subscription" />
                <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-[20px] font-bold text-slate-900">{BILLING_PLAN.name}</span>
                                <span className="px-2 py-0.5 rounded-full bg-blue-100 border border-blue-200 text-[11px] font-medium text-blue-700">Active</span>
                            </div>
                            <p className="text-[13px] text-slate-500 mt-0.5">
                                <span className="text-[18px] font-bold text-slate-800">{BILLING_PLAN.price}</span> {BILLING_PLAN.cycle}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-1">Renews on {BILLING_PLAN.renewsOn}</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="flex items-center gap-1.5 h-[32px] px-3 rounded-lg text-[12px] font-medium text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-all">
                                <Download size={12} /> Invoice
                            </button>
                            <button className="flex items-center gap-1.5 h-[32px] px-3 rounded-lg text-[12px] font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all">
                                <Zap size={12} /> Upgrade
                            </button>
                        </div>
                    </div>

                    {/* Student usage */}
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-[12px] font-medium text-slate-700">Student seats used</p>
                            <p className="text-[12px] font-medium text-slate-700">{used} / {limit}</p>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div
                                className={cn('h-full rounded-full transition-all', pct > 85 ? 'bg-amber-500' : 'bg-blue-500')}
                                style={{ width: `${pct}%` }}
                            />
                        </div>
                        <p className="text-[10.5px] text-slate-400 mt-1.5">{pct}% of limit used{pct > 85 ? ' — consider upgrading soon' : ''}</p>
                    </div>

                    {/* Included features */}
                    <div className="mt-4">
                        <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide mb-2">Included</p>
                        <ul className="space-y-1.5">
                            {BILLING_PLAN.features.map(f => (
                                <li key={f} className="flex items-center gap-2 text-[12.5px] text-slate-700">
                                    <CheckCircle2 size={13} className="text-green-500 shrink-0" /> {f}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </Card>

            {/* Unlock with upgrade */}
            <Card>
                <CardHeader title="Unlock with upgrade" icon={Zap} desc="Features available on higher plans" />
                <div className="divide-y divide-slate-50 px-5">
                    {BILLING_PLAN.upgrades.map(({ label, plan }) => (
                        <div key={label} className="flex items-center justify-between py-3">
                            <p className="text-[12.5px] text-slate-700">{label}</p>
                            <span className={cn(
                                'px-2 py-0.5 rounded-full text-[10.5px] font-medium border',
                                plan === 'Professional'
                                    ? 'bg-amber-50 border-amber-200 text-amber-700'
                                    : 'bg-violet-50 border-violet-200 text-violet-700'
                            )}>
                                {plan}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="px-5 pb-5 pt-3">
                    <button className="w-full h-[36px] rounded-lg text-[13px] font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                        <Zap size={13} /> View all plans
                    </button>
                </div>
            </Card>

        </div>
    )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('profile')

    const tabContent = {
        profile: <SchoolProfileTab />,
        notifications: <NotificationsTab />,
        security: <SecurityTab />,
        billing: <BillingTab />,
    }

    return (
        <div className="p-6 space-y-4">

            {/* Tab bar */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
                {TABS.map(({ id, label, Icon }) => (
                    <button
                        key={id}
                        onClick={() => setActiveTab(id)}
                        className={cn(
                            'flex items-center gap-1.5 h-[32px] px-3.5 rounded-lg text-[12.5px] font-medium transition-all',
                            activeTab === id
                                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                                : 'text-slate-500 hover:text-slate-700'
                        )}
                    >
                        <Icon size={13} />
                        {label}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            {tabContent[activeTab]}

        </div>
    )
}