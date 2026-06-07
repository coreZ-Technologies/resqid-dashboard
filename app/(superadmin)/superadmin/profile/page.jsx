"use client"

import { useState } from "react"
import {
    Shield, CheckCircle2, Star, Edit2, Check, X,
    Laptop, Smartphone, Tablet, Activity, UserPlus,
    Camera, AlertTriangle, CalendarCheck, Clock, Settings,
    Key, Mail, Phone, Calendar
} from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import PageHeader from "@/components/shared/PageHeader"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { cn } from "@/lib/utils"

const ACTIVITY_LOG = [
    { Icon: UserPlus, title: 'Added new super admin: Priya Sharma', meta: '2 days ago' },
    { Icon: AlertTriangle, title: 'Suspended school: Sunrise Institute', meta: '3 days ago' },
    { Icon: CalendarCheck, title: 'Reviewed platform audit logs', meta: '1 week ago' },
    { Icon: Clock, title: 'Updated rate limits for API', meta: '1 week ago' },
    { Icon: Settings, title: 'Changed global security policy', meta: '2 weeks ago' },
]

const SESSIONS = [
    { Icon: Laptop, device: 'Chrome — Windows 11', meta: 'Kolkata, India · Just now', current: true },
    { Icon: Smartphone, device: 'Safari — iPhone 15', meta: 'Kolkata, India · 3 hours ago', current: false },
    { Icon: Tablet, device: 'Chrome — iPad Pro', meta: 'Howrah, India · 2 days ago', current: false },
]

const PERMISSIONS = [
    { label: "Manage Schools", granted: true },
    { label: "Manage Subscriptions", granted: true },
    { label: "View All Data", granted: true },
    { label: "System Settings", granted: true },
    { label: "Manage Admins", granted: true },
    { label: "Audit Logs", granted: true },
    { label: "API Access", granted: true },
    { label: "Delete Data", granted: true },
]

export default function SuperAdminProfilePage() {
    const [editing, setEditing] = useState(false)
    const [saved, setSaved] = useState(false)
    const [form, setForm] = useState({
        name: "Animesh Karan",
        email: "animesh@corez.in",
        phone: "+91 98765 43210",
        role: "Super Admin",
        joinedDate: "January 2024",
        orgName: "coreZ Technologies",
    })

    const handleSave = () => { setEditing(false); setSaved(true); setTimeout(() => setSaved(false), 2000) }

    const fields = [
        { key: "name", label: "Full Name", editable: true },
        { key: "email", label: "Email Address", editable: true },
        { key: "phone", label: "Phone Number", editable: true },
        { key: "role", label: "Role", editable: false },
        { key: "orgName", label: "Organization", editable: false },
        { key: "joinedDate", label: "Member Since", editable: false },
    ]

    return (
        <div className="max-w-[900px] mx-auto space-y-6">
            <PageBreadcrumb items={[{ label: "Super Admin", href: "/superadmin" }, { label: "My Profile" }]} />
            <PageHeader title="My Profile" description="Manage your super admin account and security settings" />

            {/* Profile Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Hero */}
                <div className="flex items-start gap-5 p-6 border-b border-slate-100">
                    <div className="relative shrink-0">
                        <div className="w-16 h-16 rounded-full bg-red-100 border border-red-200 flex items-center justify-center text-red-700 text-xl font-bold">
                            {(form.name).slice(0, 2).toUpperCase()}
                        </div>
                        <button className="absolute bottom-0 right-0 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center hover:bg-slate-50 transition-colors">
                            <Camera size={12} className="text-slate-500" />
                        </button>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-bold text-slate-800">{form.name}</h2>
                        <p className="text-xs text-slate-500 mt-0.5">{form.orgName} · {form.role}</p>
                        <div className="flex gap-2 mt-2 flex-wrap">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-50 text-red-700 border border-red-200">
                                <Shield size={10} /> Super Admin
                            </span>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <CheckCircle2 size={10} /> Active
                            </span>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                <Star size={10} /> Full Access
                            </span>
                        </div>
                    </div>
                    <div className="hidden sm:flex gap-6 shrink-0">
                        {[
                            { label: "Schools", value: 124 },
                            { label: "Students", value: "28.4K" },
                            { label: "Admins", value: 8 },
                        ].map(({ label, value }) => (
                            <div key={label} className="text-center">
                                <p className="text-xl font-bold text-slate-800">{value}</p>
                                <p className="text-[10px] text-slate-400 mt-0.5">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Personal Info */}
                <div className="p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="font-semibold text-slate-800">Personal Information</h3>
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
            </div>

            {/* Permissions */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><Shield size={18} className="text-red-600" />Super Admin Permissions</h3>
                <div className="grid grid-cols-2 gap-2">
                    {PERMISSIONS.map(p => (
                        <div key={p.label} className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg">
                            <Check size={14} className="text-emerald-500 shrink-0" />
                            <span className="text-sm text-slate-700">{p.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Two Column */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Activity Log */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="font-semibold text-slate-800 flex items-center gap-2"><Activity size={16} className="text-violet-600" />Recent Activity</h3>
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

                {/* Sessions */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="font-semibold text-slate-800 flex items-center gap-2"><Laptop size={16} className="text-violet-600" />Active Sessions</h3>
                        <button className="text-xs text-slate-500 hover:text-red-600">Revoke all</button>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {SESSIONS.map(({ Icon, device, meta, current }, i) => (
                            <div key={i} className="flex items-center gap-3 px-5 py-3">
                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0"><Icon size={15} className="text-slate-500" /></div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                        {device}
                                        {current && <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-semibold">Current</span>}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-0.5">{meta}</p>
                                </div>
                                {!current && <button className="text-xs text-red-500 hover:text-red-700 font-medium">Revoke</button>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-5 flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-red-700">Danger Zone</h3>
                    <p className="text-xs text-red-500 mt-0.5">Permanently delete your super admin account. This cannot be undone.</p>
                </div>
                <button className="px-4 py-2 rounded-lg border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors">Delete Account</button>
            </div>
        </div>
    )
}