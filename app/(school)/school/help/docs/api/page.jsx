"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Server, Key, Lock, Clock, Copy, Check, Eye, EyeOff } from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import { cn } from "@/lib/utils"

const API_BASE = "https://api.resqid.com/v1"

const ENDPOINTS = [
    {
        method: "GET", path: "/auth/me", desc: "Get current user info", auth: true,
        response: `{ "user": { "id": "string", "name": "string", "email": "string", "role": "admin", "schoolId": "string" } }`
    },
    {
        method: "GET", path: "/students", desc: "List all students", auth: true, params: "?class=10&section=A&search=aarav",
        response: `{ "students": [{ "id": "string", "name": "string", "class": "string", "rollNumber": 24 }], "total": 342 }`
    },
    {
        method: "POST", path: "/students", desc: "Add a new student", auth: true,
        body: `{ "firstName": "Aarav", "lastName": "Sharma", "class": "10", "section": "A", "parent1Name": "Rajesh", "parent1Phone": "9876543210" }`,
        response: `{ "student": { "id": "stu_new", "name": "Aarav Sharma" }, "message": "Student added" }`
    },
    {
        method: "GET", path: "/attendance", desc: "Get attendance records", auth: true, params: "?date=2026-06-07&class=10&section=A",
        response: `{ "date": "2026-06-07", "total": 32, "present": 30, "absent": 2, "records": [...] }`
    },
    {
        method: "POST", path: "/attendance/mark", desc: "Mark attendance", auth: true,
        body: `{ "date": "2026-06-07", "class": "10", "section": "A", "records": [{ "studentId": "stu1", "status": "present" }] }`,
        response: `{ "message": "Attendance recorded", "marked": 32 }`
    },
    {
        method: "GET", path: "/emergency/scans", desc: "Get emergency scan logs", auth: true,
        response: `{ "scans": [{ "id": "scan_001", "student": "Aarav Sharma", "time": "11:30 AM", "location": "Main Gate" }] }`
    },
    {
        method: "POST", path: "/emergency/alert", desc: "Trigger emergency alert", auth: true,
        body: `{ "studentId": "stu1", "type": "medical", "location": "Playground", "notes": "Student fell" }`,
        response: `{ "alertId": "alert_001", "status": "triggered", "parentsNotified": true }`
    },
    {
        method: "GET", path: "/timetable", desc: "Get timetable", auth: true, params: "?class=10&section=A",
        response: `{ "class": "10-A", "slots": [{ "day": "Mon", "period": 1, "subject": "Math", "teacher": "Mr. Suresh" }] }`
    },
    {
        method: "POST", path: "/timetable/generate", desc: "Generate timetable", auth: true,
        body: `{ "classes": ["c7", "c8"], "term": "Term 1", "constraints": { "maxPeriods": 8 } }`,
        response: `{ "status": "generated", "classesProcessed": 2, "conflicts": 0 }`
    },
    {
        method: "GET", path: "/cards", desc: "List all ID cards", auth: true, params: "?status=active&class=10",
        response: `{ "cards": [{ "id": "card_001", "cardNumber": "RESQID-2024-0001", "student": "Aarav Sharma", "status": "active" }] }`
    },
    {
        method: "POST", path: "/cards/generate", desc: "Generate QR codes", auth: true,
        body: `{ "studentIds": ["stu1", "stu2"], "format": "PNG" }`,
        response: `{ "generated": 2, "cards": [...] }`
    },
]

function CodeBlock({ code, label }) {
    const [copied, setCopied] = useState(false)
    const handleCopy = () => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000) }

    return (
        <div>
            {label && <p className="text-xs font-semibold text-slate-500 uppercase mb-1.5">{label}</p>}
            <div className="relative">
                <pre className="bg-slate-800 text-slate-100 p-4 rounded-lg overflow-x-auto text-xs font-mono leading-relaxed"><code>{code}</code></pre>
                <button onClick={handleCopy} className="absolute top-2 right-2 p-1.5 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors">
                    {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} className="text-slate-400" />}
                </button>
            </div>
        </div>
    )
}

const methodColors = {
    GET: "bg-emerald-100 text-emerald-700 border-emerald-200",
    POST: "bg-violet-100 text-violet-700 border-violet-200",
    PUT: "bg-amber-100 text-amber-700 border-amber-200",
    DELETE: "bg-rose-100 text-rose-700 border-rose-200",
}

export default function APIDocsPage() {
    const router = useRouter()
    const [showToken, setShowToken] = useState(false)

    return (
        <div className="max-w-[900px] mx-auto space-y-6">
            <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "Help", href: "/school/help" }, { label: "API Reference" }]} />

            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"><ArrowLeft size={18} /></button>
                <div>
                    <h1 className="text-[22px] font-bold text-slate-800">API Reference</h1>
                    <p className="text-[13px] text-slate-500">Programmatic access to your ResQID school data</p>
                </div>
            </div>

            {/* Auth Info */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
                <h2 className="font-semibold text-slate-800 flex items-center gap-2"><Key size={18} className="text-violet-600" />Authentication</h2>
                <p className="text-sm text-slate-600">All API requests require a Bearer token in the Authorization header.</p>
                <CodeBlock code={`Authorization: Bearer your_api_token_here`} label="Header Format" />
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                    <Lock size={14} className="text-slate-500" />
                    <span className="text-sm text-slate-600">Your API token is available in</span>
                    <button onClick={() => router.push("/school/settings")} className="text-sm text-violet-600 hover:text-violet-700 font-medium">Settings → API Keys</button>
                </div>
            </div>

            {/* Base URL */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <h2 className="font-semibold text-slate-800 flex items-center gap-2 mb-3"><Server size={18} className="text-violet-600" />Base URL</h2>
                <CodeBlock code={API_BASE} />
            </div>

            {/* Rate Limits */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <h2 className="font-semibold text-slate-800 flex items-center gap-2 mb-3"><Clock size={18} className="text-violet-600" />Rate Limits</h2>
                <div className="flex gap-6 text-sm text-slate-600">
                    <span>100 requests / minute</span>
                    <span>1,000 requests / hour</span>
                    <span>10,000 requests / day</span>
                </div>
            </div>

            {/* Endpoints */}
            <div>
                <h2 className="font-semibold text-slate-800 mb-4">Endpoints</h2>
                <div className="space-y-3">
                    {ENDPOINTS.map((ep, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                                <span className={cn("px-2 py-0.5 rounded text-[11px] font-mono font-bold border", methodColors[ep.method])}>{ep.method}</span>
                                <code className="text-sm text-slate-700 font-mono">{API_BASE}{ep.path}</code>
                                {ep.auth && <Lock size={12} className="text-slate-400 ml-auto" />}
                            </div>
                            <div className="p-5 space-y-4">
                                <p className="text-sm text-slate-600">{ep.desc}</p>
                                {ep.params && <CodeBlock code={ep.params} label="Query Parameters" />}
                                {ep.body && <CodeBlock code={ep.body} label="Request Body" />}
                                {ep.response && <CodeBlock code={ep.response} label="Response" />}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}