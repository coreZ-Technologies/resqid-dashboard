"use client"

import { useState } from "react"
import {
    Building2, Clock, CalendarCheck, Bell, GraduationCap,
    ShieldCheck, Activity, Laptop, CreditCard, User, Settings2
} from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import PageHeader from "@/components/shared/PageHeader"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"


const TABS = [
    { id: "profile", label: "School Profile", icon: Building2 },
    { id: "timetable", label: "Timetable", icon: Clock },
    { id: "attendance", label: "Attendance", icon: CalendarCheck },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "academic", label: "Academic Year", icon: GraduationCap },
    { id: "permissions", label: "Permissions", icon: ShieldCheck },
    { id: "sessions", label: "Sessions", icon: Laptop },
]

function Toggle({ checked, onChange }) {
    return (
        <button role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
            className={cn("relative w-9 h-5 rounded-full transition-colors duration-200 shrink-0", checked ? "bg-violet-600" : "bg-slate-200")}>
            <span className={cn("absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200", checked && "translate-x-4")} />
        </button>
    )
}

function SchoolProfileSection() {
    const [editing, setEditing] = useState(false)
    const [saved, setSaved] = useState(false)
    const [form, setForm] = useState({
        name: "Springdale Public School",
        board: "CBSE",
        udise: "UDISE-2024-WB-001234",
        code: "SPR-2024-K7",
        phone: "+91 33 2456 7890",
        email: "info@springdaleschool.in",
        address: "42, Park Street, Kolkata - 700016",
        principal: "Dr. Animesh Karan",
    })

    const handleSave = () => { setEditing(false); setSaved(true); setTimeout(() => setSaved(false), 2000) }

    const fields = [
        { key: "name", label: "School Name", editable: true },
        { key: "board", label: "Board Affiliation", editable: true, type: "select", options: ["CBSE", "ICSE", "State Board", "IB", "Cambridge"] },
        { key: "udise", label: "UDISE Number", editable: false },
        { key: "code", label: "School Code", editable: false },
        { key: "phone", label: "Phone", editable: true },
        { key: "email", label: "Email", editable: true },
        { key: "address", label: "Address", editable: true },
        { key: "principal", label: "Principal Name", editable: true },
    ]

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-slate-800 flex items-center gap-2"><Building2 size={18} className="text-violet-600" />School Profile</h2>
                {!editing ? (
                    <button onClick={() => setEditing(true)} className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">Edit</button>
                ) : (
                    <div className="flex gap-2">
                        <button onClick={() => setEditing(false)} className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
                        <button onClick={handleSave} className="px-3 py-1.5 rounded-lg bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700">{saved ? "Saved!" : "Save"}</button>
                    </div>
                )}
            </div>
            <div className="grid grid-cols-2 gap-4">
                {fields.map(({ key, label, editable, type, options }) => (
                    <div key={key}>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">{label}</label>
                        {type === "select" && editing ? (
                            <select value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500 bg-white">
                                {options.map(o => <option key={o}>{o}</option>)}
                            </select>
                        ) : (
                            <input value={form[key]} readOnly={!editing || !editable}
                                onChange={e => setForm({ ...form, [key]: e.target.value })}
                                className={cn("w-full border rounded-lg px-3 py-2 text-sm outline-none", editing && editable ? "border-slate-200 focus:border-violet-500 bg-white" : "border-slate-100 bg-slate-50 text-slate-500 cursor-default")} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

function TimetableConstraintsSection() {
    const [form, setForm] = useState({
        maxPeriods: "8",
        lunchPeriod: "5",
        maxConsecutive: "2",
        periodDuration: "45 min",
        workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    })

    const toggleDay = (day) => {
        setForm(prev => ({
            ...prev,
            workingDays: prev.workingDays.includes(day) ? prev.workingDays.filter(d => d !== day) : [...prev.workingDays, day]
        }))
    }

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2 mb-5"><Clock size={18} className="text-violet-600" />Timetable Constraints</h2>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Max Periods Per Day</label>
                    <input type="number" value={form.maxPeriods} onChange={e => setForm({ ...form, maxPeriods: e.target.value })}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500" />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Lunch Break Period</label>
                    <input type="number" value={form.lunchPeriod} onChange={e => setForm({ ...form, lunchPeriod: e.target.value })}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500" />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Max Consecutive Periods (Same Subject)</label>
                    <input type="number" value={form.maxConsecutive} onChange={e => setForm({ ...form, maxConsecutive: e.target.value })}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500" />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Period Duration</label>
                    <select value={form.periodDuration} onChange={e => setForm({ ...form, periodDuration: e.target.value })}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500 bg-white">
                        {["30 min", "35 min", "40 min", "45 min", "50 min", "60 min"].map(o => <option key={o}>{o}</option>)}
                    </select>
                </div>
            </div>
            <div className="mt-4">
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Working Days</label>
                <div className="flex gap-1.5">
                    {days.map(day => (
                        <button key={day} onClick={() => toggleDay(day)}
                            className={cn("px-3 py-1.5 rounded-lg border text-xs font-medium transition-all",
                                form.workingDays.includes(day) ? "bg-violet-600 text-white border-violet-600" : "border-slate-200 text-slate-500 hover:bg-slate-50")}>
                            {day}
                        </button>
                    ))}
                </div>
            </div>
            <button className="mt-5 px-4 py-2 rounded-lg bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 transition-colors">Save Constraints</button>
        </div>
    )
}

function AttendanceSettingsSection() {
    const [form, setForm] = useState({ gateOpens: "7:30 AM", lateCutoff: "8:30 AM", autoAbsent: "10:00 AM", notifyTapIn: true, notifyTapOut: true, notifyAbsent: true })

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2 mb-5"><CalendarCheck size={18} className="text-violet-600" />Attendance Settings</h2>
            <div className="grid grid-cols-2 gap-4 mb-5">
                {[
                    { key: "gateOpens", label: "Gate Opens At" },
                    { key: "lateCutoff", label: "Late Cutoff Time" },
                    { key: "autoAbsent", label: "Auto-Mark Absent After" },
                ].map(({ key, label }) => (
                    <div key={key}>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">{label}</label>
                        <input type="time" value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500" />
                    </div>
                ))}
            </div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Notify Parents On</label>
            <div className="space-y-2">
                {[
                    { key: "notifyTapIn", label: "Tap-in (Student arrives)" },
                    { key: "notifyTapOut", label: "Tap-out (Student leaves)" },
                    { key: "notifyAbsent", label: "Absent (Student didn't arrive)" },
                ].map(({ key, label }) => (
                    <div key={key} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                        <span className="text-sm text-slate-700">{label}</span>
                        <Toggle checked={form[key]} onChange={v => setForm({ ...form, [key]: v })} />
                    </div>
                ))}
            </div>
            <button className="mt-5 px-4 py-2 rounded-lg bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 transition-colors">Save Settings</button>
        </div>
    )
}

function NotificationPreferencesSection() {
    const [form, setForm] = useState({ emergency: "sms_app", attendance: "app_only", announcements: "app_email" })

    const options = [
        { value: "sms_app", label: "SMS + App Push" },
        { value: "email_app", label: "Email + App Push" },
        { value: "app_only", label: "App Push Only" },
        { value: "all", label: "SMS + Email + App" },
    ]

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2 mb-5"><Bell size={18} className="text-violet-600" />Notification Preferences</h2>
            <div className="space-y-4">
                {[
                    { key: "emergency", label: "Emergency Alerts", desc: "QR code emergency scans" },
                    { key: "attendance", label: "Attendance Alerts", desc: "Student tap-in/out notifications" },
                    { key: "announcements", label: "Announcements", desc: "School-wide broadcast messages" },
                ].map(({ key, label, desc }) => (
                    <div key={key}>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">{label}</label>
                        <p className="text-xs text-slate-400 mb-2">{desc}</p>
                        <select value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500 bg-white">
                            {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                    </div>
                ))}
            </div>
            <button className="mt-5 px-4 py-2 rounded-lg bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 transition-colors">Save Preferences</button>
        </div>
    )
}

function AcademicYearSection() {
    const [form, setForm] = useState({ academicYear: "2026-2027", term1Start: "2026-04-01", term1End: "2026-09-15", term2Start: "2026-10-01", term2End: "2027-03-15" })

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2 mb-5"><GraduationCap size={18} className="text-violet-600" />Academic Year & Terms</h2>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Academic Year</label>
                    <select value={form.academicYear} onChange={e => setForm({ ...form, academicYear: e.target.value })}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500 bg-white">
                        {["2025-2026", "2026-2027", "2027-2028"].map(y => <option key={y}>{y}</option>)}
                    </select>
                </div>
                <div />
                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Term 1 Start</label>
                    <input type="date" value={form.term1Start} onChange={e => setForm({ ...form, term1Start: e.target.value })}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500" />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Term 1 End</label>
                    <input type="date" value={form.term1End} onChange={e => setForm({ ...form, term1End: e.target.value })}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500" />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Term 2 Start</label>
                    <input type="date" value={form.term2Start} onChange={e => setForm({ ...form, term2Start: e.target.value })}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500" />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Term 2 End</label>
                    <input type="date" value={form.term2End} onChange={e => setForm({ ...form, term2End: e.target.value })}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500" />
                </div>
            </div>
            <button className="mt-5 px-4 py-2 rounded-lg bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 transition-colors">Save Academic Year</button>
        </div>
    )
}

function PermissionsSection() {
    const perms = [
        { id: "emergency", label: "Emergency", desc: "QR card management & alerts" },
        { id: "attendance", label: "Attendance", desc: "RFID attendance & reports" },
        { id: "timetable", label: "Timetable", desc: "Schedule generation & management" },
        { id: "communication", label: "Communication", desc: "Parent messaging & broadcasts" },
    ]
    const [active, setActive] = useState({ emergency: true, attendance: true, timetable: true, communication: false })

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2 mb-5"><ShieldCheck size={18} className="text-violet-600" />Module Permissions</h2>
            <div className="space-y-2">
                {perms.map(({ id, label, desc }) => (
                    <div key={id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                            <p className="text-sm font-medium text-slate-700">{label}</p>
                            <p className="text-xs text-slate-400">{desc}</p>
                        </div>
                        <Toggle checked={active[id]} onChange={v => setActive({ ...active, [id]: v })} />
                    </div>
                ))}
            </div>
        </div>
    )
}

function SessionsSection() {
    const sessions = [
        { device: "Chrome — Windows 11", meta: "Kolkata, India · Just now", current: true },
        { device: "Safari — iPhone 15", meta: "Kolkata, India · 3 hours ago", current: false },
        { device: "Chrome — iPad Pro", meta: "Howrah, India · 2 days ago", current: false },
    ]

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2 mb-5"><Laptop size={18} className="text-violet-600" />Active Sessions</h2>
            <div className="space-y-3">
                {sessions.map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                            <p className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                {s.device}
                                {s.current && <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-semibold">Current</span>}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">{s.meta}</p>
                        </div>
                        {!s.current && <button className="text-xs text-red-500 hover:text-red-700 font-medium">Revoke</button>}
                    </div>
                ))}
            </div>
            <button className="mt-4 text-xs text-red-500 hover:text-red-700 font-medium">Revoke All Other Sessions</button>
        </div>
    )
}

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("profile")
    const router = useRouter()

    return (
        <div className="max-w-[1000px] mx-auto space-y-6">
            <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "Settings" }]} />

            <PageHeader title="School Settings" description="Manage school profile, constraints, and preferences" />

            {/* Tabs */}
            <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit flex-wrap">
                {TABS.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={cn("flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                            activeTab === tab.id ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700")}>
                        <tab.icon size={14} />{tab.label}
                    </button>
                ))}
                <button onClick={() => router.push("/school/settings/billing")}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-700 transition-all">
                    <CreditCard size={14} />Billing
                </button>
            </div>

            {/* Content */}
            {activeTab === "profile" && <SchoolProfileSection />}
            {activeTab === "timetable" && <TimetableConstraintsSection />}
            {activeTab === "attendance" && <AttendanceSettingsSection />}
            {activeTab === "notifications" && <NotificationPreferencesSection />}
            {activeTab === "academic" && <AcademicYearSection />}
            {activeTab === "permissions" && <PermissionsSection />}
            {activeTab === "sessions" && <SessionsSection />}
        </div>
    )
}