"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, Shield, QrCode, Bell, AlertTriangle, ChevronRight } from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"

const STEPS = [
    { title: "Generate QR Codes", desc: "Go to ID Cards → Generate QR. Select students and generate unique QR codes for each. Download or print directly.", icon: QrCode },
    { title: "Print ID Cards", desc: "Use the Print section to print 8 cards per A4 sheet. Cards include student name, class, blood group, and QR code.", icon: QrCode },
    { title: "Configure Alerts", desc: "In Settings → Notifications, choose how parents are notified during emergencies (SMS + App recommended).", icon: Bell },
    { title: "Test Emergency Scan", desc: "Scan any student's QR code with a phone camera. Verify that the emergency profile appears and parents receive alerts.", icon: Shield },
    { title: "Monitor Anomalies", desc: "Check the Anomalies page regularly for suspicious scans — duplicate scans, unknown cards, after-hours access.", icon: AlertTriangle },
]

export default function EmergencyDocsPage() {
    const router = useRouter()

    return (
        <div className="max-w-[800px] mx-auto space-y-6">
            <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "Help", href: "/school/help" }, { label: "Emergency Guide" }]} />
            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"><ArrowLeft size={18} /></button>
                <div><h1 className="text-[22px] font-bold text-slate-800">Emergency & QR Setup Guide</h1><p className="text-[13px] text-slate-500">How to set up and use the emergency QR system</p></div>
            </div>
            <div className="space-y-3">
                {STEPS.map((step, i) => (
                    <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0"><step.icon size={18} className="text-rose-600" /></div>
                        <div>
                            <div className="flex items-center gap-2 mb-1"><span className="text-xs font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded">Step {i + 1}</span></div>
                            <h3 className="font-semibold text-slate-800 text-sm">{step.title}</h3>
                            <p className="text-sm text-slate-600 mt-1">{step.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}