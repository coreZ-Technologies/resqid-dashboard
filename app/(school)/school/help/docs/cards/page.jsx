"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, CreditCard, QrCode, Printer, AlertTriangle, RotateCcw } from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"

const STEPS = [
    { title: "Generate QR Codes", desc: "Go to Cards → Generate. Select classes or individual students. One click generates QR codes for all selected.", icon: QrCode },
    { title: "Print ID Cards", desc: "Go to Cards → Print. Select cards to print. Layout: 8 cards per A4 sheet. Use PVC card stock for durability.", icon: Printer },
    { title: "Manage Lost Cards", desc: "Report lost cards from the dashboard. System deactivates immediately. Issue replacement with new card number.", icon: AlertTriangle },
    { title: "Track Card Status", desc: "Each card has a status: Active, Lost, Replaced, Deactivated. Full history timeline available per card.", icon: CreditCard },
    { title: "Replace Cards", desc: "When a student loses a card, issue a replacement. Old card is deactivated. New card gets a new number.", icon: RotateCcw },
]

export default function CardsDocsPage() {
    const router = useRouter()

    return (
        <div className="max-w-[800px] mx-auto space-y-6">
            <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "Help", href: "/school/help" }, { label: "Cards Guide" }]} />
            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"><ArrowLeft size={18} /></button>
                <div><h1 className="text-[22px] font-bold text-slate-800">ID Cards & QR Guide</h1><p className="text-[13px] text-slate-500">Managing student ID cards and QR codes</p></div>
            </div>
            <div className="space-y-3">
                {STEPS.map((step, i) => (
                    <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center shrink-0"><step.icon size={18} className="text-sky-600" /></div>
                        <div>
                            <span className="text-xs font-bold text-sky-500 bg-sky-50 px-2 py-0.5 rounded">Step {i + 1}</span>
                            <h3 className="font-semibold text-slate-800 text-sm mt-1">{step.title}</h3>
                            <p className="text-sm text-slate-600 mt-1">{step.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}