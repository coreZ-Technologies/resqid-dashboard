"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, Building2, Users, UserCheck, CalendarCheck, QrCode } from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"

const STEPS = [
    { title: "Set Up School Profile", desc: "Go to Settings → School Profile. Add your school name, board, address, and principal details.", icon: Building2 },
    { title: "Add Students", desc: "Go to Students → Add. Add individually or bulk import via CSV. Include parent and emergency contact details.", icon: Users },
    { title: "Add Teachers", desc: "Go to Teachers → Add. Add subject expertise, qualifications, and contact info. Assign class teachers.", icon: UserCheck },
    { title: "Configure Attendance", desc: "Go to Settings → Attendance. Set gate timings, late cutoff, and parent notification preferences.", icon: CalendarCheck },
    { title: "Generate QR Cards", desc: "Go to Cards → Generate. Create QR codes for all students. Print and distribute ID cards.", icon: QrCode },
]

export default function GettingStartedPage() {
    const router = useRouter()

    return (
        <div className="max-w-[800px] mx-auto space-y-6">
            <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "Help", href: "/school/help" }, { label: "Getting Started" }]} />
            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"><ArrowLeft size={18} /></button>
                <div><h1 className="text-[22px] font-bold text-slate-800">Getting Started</h1><p className="text-[13px] text-slate-500">First-time setup guide for your school</p></div>
            </div>
            <div className="space-y-3">
                {STEPS.map((step, i) => (
                    <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0"><step.icon size={18} className="text-blue-600" /></div>
                        <div>
                            <span className="text-xs font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded">Step {i + 1}</span>
                            <h3 className="font-semibold text-slate-800 text-sm mt-1">{step.title}</h3>
                            <p className="text-sm text-slate-600 mt-1">{step.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}