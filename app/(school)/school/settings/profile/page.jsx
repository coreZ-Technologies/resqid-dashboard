"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
    ShieldCheck, CheckCircle2, Star, Edit2, Check, X,
    Laptop, Smartphone, Tablet, Activity, UserPlus,
    Camera, AlertTriangle, CalendarCheck, Clock, Settings
} from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import PageHeader from "@/components/shared/PageHeader"
import { cn } from "@/lib/utils"

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

function Toggle({ checked, onChange }) {
    return (
        <button role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
            className={cn("relative w-9 h-5 rounded-full transition-colors duration-200 shrink-0", checked ? "bg-violet-600" : "bg-slate-200")}>
            <span className={cn("absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200", checked && "translate-x-4")} />
        </button>
    )
}

function ProfileHero({ user }) {
    return (
        <div className="flex items-start gap-5 p-6 border-b border-slate-100">
            <div className="relative shrink-0">
                <div className="w-16 h-16 rounded-full bg-violet-100 border border-violet-200 flex items-center justify-center text-violet-700 text-xl font-bold">
                    {(user?.name ?? 'AD').slice(0, 2).toUpperCase()}
                </div>
                <button className="absolute bottom-0 right-0 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center hover:bg-slate-50 transition-colors">
                    <Camera size={12} className="text-slate-500" />
                </button>
            </div>
            <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-slate-800">{user?.name ?? 'Animesh Karan'}</h2>
                <p className="text-xs text-slate-500 mt-0.5">{user?.schoolName ?? 'Springdale Public School'} · School Admin</p>
                <div className="flex gap-2 mt-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-50 text-violet-700 border border-violet-200">
                        <ShieldCheck size={10} /> Super Admin
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 size={10} /> Active
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <Star size={10} /> {user?.plan ?? 'Safety Bundle'} plan
                    </span>
                </div>
            </div>
            <div className="hidden sm:flex gap-6 shrink-0">
                {[
                    { label: "Students", value: 847 },
                    { label: "Staff", value: 62 },
                    { label: "Classes", value: 24 },
                ].map(({ label, value }) => (
                    <div key={label} className="text-center">
                        <p className="text-xl font-bold text-slate-800">{value}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{label}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

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

    const handleSave = () => { setEditing(false); setSaved(true); setTimeout(() => setSaved(false), 2000) }

    const fields = [
        { key: 'name', label: 'Full name', editable: true },
        { key: 'email', label: 'Email address', editable: true },
        { key: 'phone', label: 'Phone number', editable: true },
        { key: 'role', label: 'Role', editable: false },
        { key: 'schoolCode', label: 'School code', editable: false },
        { key: 'memberSince', label: 'Member since', editable: false },
    ]

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-slate-800">Personal Information</h2>
                {!editing ? (
                    <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                        <Edit2 size={12} /> Edit
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button onClick={() => setEditing(false)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50"><X size={12} /> Cancel</button>
                        <button onClick={handleSave} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700"><Check size={12} /> {saved ? 'Saved!' : 'Save'}</button>
                    </div>
                )}
            </div>
            <div className="grid grid-cols-2 gap-4">
                {fields.map(({ key, label, editable }) => (
                    <div key={key}>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">{label}</label>
                        <input value={form[key]} readOnly={!editing || !editable}
                            onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                            className={cn("w-full border rounded-lg px-3 py-2 text-sm outline-none", editing && editable ? "border-slate-200 focus:border-violet-500 bg-white" : "border-slate-100 bg-slate-50 text-slate-500 cursor-default")} />
                    </div>
                ))}
            </div>
        </div>
    )
}

function SessionsPanel() {
    const [sessions, setSessions] = useState(SESSIONS)
    const revoke = (i) => setSessions(prev => prev.filter((_, idx) => idx !== i))

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-semibold text-slate-800 flex items-center gap-2"><Laptop size={16} className="text-violet-600" />Active Sessions</h2>
                <button className="text-xs text-slate-500 hover:text-red-600">Revoke all</button>
            </div>
            <div className="divide-y divide-slate-50">
                {sessions.map(({ Icon, device, meta, current }, i) => (
                    <div key={i} className="flex items-center gap-3 px-5 py-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0"><Icon size={15} className="text-slate-500" /></div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                {device}
                                {current && <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-semibold">Current</span>}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">{meta}</p>
                        </div>
                        {!current && <button onClick={() => revoke(i)} className="text-xs text-red-500 hover:text-red-700 font-medium">Revoke</button>}
                    </div>
                ))}
            </div>
        </div>
    )
}

function ActivityLog() {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-semibold text-slate-800 flex items-center gap-2"><Activity size={16} className="text-violet-600" />Recent Activity</h2>
                <button className="text-xs text-violet-500 font-medium">View all</button>
            </div>
            <div className="divide-y divide-slate-50 px-5">
                {ACTIVITY_LOG.map(({ Icon, title, meta }, i) => (
                    <div key={i} className="flex items-start gap-3 py-3">
                        <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5"><Icon size={13} className="text-slate-500" /></div>
                        <div><p className="text-xs font-medium text-slate-700">{title}</p><p className="text-[10px] text-slate-400 mt-0.5">{meta}</p></div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function ProfilePage({ user }) {
    return (
        <div className="max-w-[800px] mx-auto space-y-6">
            <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "My Profile" }]} />
            <PageHeader title="My Profile" description="Manage your personal information and security settings" />

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <ProfileHero user={user} />
                <PersonalInfo user={user} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <ActivityLog />
                <SessionsPanel />
            </div>

            <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-5 flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-red-700">Danger Zone</h3>
                    <p className="text-xs text-red-500 mt-0.5">Permanently delete your admin account and all data</p>
                </div>
                <button className="px-4 py-2 rounded-lg border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors">Delete Account</button>
            </div>
        </div>
    )
}