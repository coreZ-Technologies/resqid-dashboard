"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, Radio, UserCheck, CalendarCheck, BarChart2 } from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"

const STEPS = [
    { title: "Install RFID Devices", desc: "Place RFID scanners at each gate. Connect to WiFi. Devices appear in Attendance → Devices dashboard.", icon: Radio },
    { title: "Issue RFID Cards", desc: "Each student gets an RFID card. Cards are linked to student profiles. One tap = attendance marked.", icon: UserCheck },
    { title: "Monitor Daily Attendance", desc: "Dashboard shows real-time attendance — who's in, who's absent, who's late. Parents get instant notifications.", icon: CalendarCheck },
    { title: "Generate Reports", desc: "Weekly, monthly, and yearly reports available. Filter by class, student, or date range. Export as CSV.", icon: BarChart2 },
]

export default function AttendanceDocsPage() {
    const router = useRouter()

    return (
        <div className="max-w-[800px] mx-auto space-y-6">
            <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "Help", href: "/school/help" }, { label: "Attendance Guide" }]} />
            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"><ArrowLeft size={18} /></button>
                <div><h1 className="text-[22px] font-bold text-slate-800">RFID Attendance Setup</h1><p className="text-[13px] text-slate-500">Installing and using the RFID attendance system</p></div>
            </div>
            <div className="space-y-3">
                {STEPS.map((step, i) => (
                    <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0"><step.icon size={18} className="text-emerald-600" /></div>
                        <div>
                            <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded">Step {i + 1}</span>
                            <h3 className="font-semibold text-slate-800 text-sm mt-1">{step.title}</h3>
                            <p className="text-sm text-slate-600 mt-1">{step.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}