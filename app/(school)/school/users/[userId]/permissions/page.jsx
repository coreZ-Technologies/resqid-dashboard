"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Shield, Check, Loader2 } from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import { cn } from "@/lib/utils"

const MODULES = [
    { id: "emergency", label: "Emergency", desc: "QR cards, scan logs, anomalies" },
    { id: "attendance", label: "Attendance", desc: "RFID tracking, reports, devices" },
    { id: "timetable", label: "Timetable", desc: "Generate, validate, manage schedules" },
    { id: "communication", label: "Communication", desc: "Announcements, parent messages" },
]

export default function PermissionsPage() {
    const router = useRouter()
    const params = useParams()
    const userId = params.userId

    const [perms, setPerms] = useState({})
    const [loading, setLoading] = useState(false)
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        setPerms({ emergency: true, attendance: true, timetable: false, communication: false })
    }, [])

    const toggle = (id) => setPerms(prev => ({ ...prev, [id]: !prev[id] }))

    const handleSave = async () => {
        setLoading(true)
        await new Promise(r => setTimeout(r, 800))
        console.log("Saved permissions:", perms)
        setLoading(false)
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    return (
        <div className="max-w-[600px] mx-auto space-y-6">
            <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "Users", href: "/school/users" }, { label: "Permissions" }]} />

            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"><ArrowLeft size={18} /></button>
                <div><h1 className="text-[22px] font-bold text-slate-800">Module Permissions</h1><p className="text-[13px] text-slate-500">Control what this user can access</p></div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3">
                <h2 className="font-semibold text-slate-800 flex items-center gap-2 mb-2"><Shield size={18} className="text-violet-600" />Access Control</h2>
                {MODULES.map(m => (
                    <div key={m.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                            <p className="text-sm font-medium text-slate-700">{m.label}</p>
                            <p className="text-xs text-slate-400">{m.desc}</p>
                        </div>
                        <button onClick={() => toggle(m.id)}
                            className={cn("w-9 h-5 rounded-full transition-colors relative", perms[m.id] ? "bg-violet-600" : "bg-slate-200")}>
                            <span className={cn("absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform", perms[m.id] ? "left-4" : "left-0.5")} />
                        </button>
                    </div>
                ))}
                <div className="flex justify-end pt-3">
                    <button onClick={handleSave} disabled={loading}
                        className="px-5 py-2 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 disabled:opacity-50 flex items-center gap-2 transition-colors">
                        {loading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} {saved ? "Saved!" : "Save Permissions"}
                    </button>
                </div>
            </div>
        </div>
    )
}