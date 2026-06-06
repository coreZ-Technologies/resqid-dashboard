"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, HelpCircle, ChevronDown, ChevronRight } from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import { useState } from "react"

const FAQS = [
    { q: "How do I generate QR codes for my students?", a: "Go to ID Cards → Generate QR. Select classes or individual students and click Generate. QR codes are created instantly. Download them as PNG or print directly on A4 sheets." },
    { q: "What happens when someone scans a student's QR code?", a: "The scanner sees the student's emergency profile (name, blood group, allergies, emergency contacts). Simultaneously, parents receive an SMS + app notification with the GPS location of the scan." },
    { q: "How does RFID attendance work?", a: "Students tap their RFID cards on the gate scanner. The system records tap-in/tap-out times. Parents get real-time notifications. Attendance reports are auto-generated daily." },
    { q: "Can I generate timetable for the entire school at once?", a: "Yes! Go to Timetable → Generate → All Classes. The system uses constraint solving to create conflict-free timetables. You can also generate per-class." },
    { q: "How do I handle teacher substitutions?", a: "When a teacher is on leave (maternity, medical, etc.), go to Teachers → Wellness → Set leave status. The system suggests available replacements based on subject match and workload." },
    { q: "What if a student loses their ID card?", a: "Go to ID Cards → mark the card as Lost. This deactivates it immediately. Then issue a replacement card with a new card number. The old card will not work anymore." },
    { q: "How do I change my plan or upgrade?", a: "Go to Settings → Billing. You'll see your current plan and available upgrades. Plans are: Emergency, Attendance, Safety Bundle, and Complete. Upgrade is instant." },
    { q: "Can parents use the app too?", a: "Yes! Parents get the RESQID Parent App. They receive attendance alerts, emergency notifications, school announcements, and can view their child's profile." },
    { q: "How do I bulk import students?", a: "Go to Students → Add → Bulk Upload tab. Download the demo CSV, fill in your data, and upload. The system validates and shows a preview before importing." },
    { q: "What devices are needed for RFID attendance?", a: "You need an RFID scanner at each gate. We provide the hardware. Each device connects via WiFi and syncs attendance data in real-time to the dashboard." },
]

export default function FAQPage() {
    const router = useRouter()
    const [openIndex, setOpenIndex] = useState(null)

    return (
        <div className="max-w-[800px] mx-auto space-y-6">
            <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "Help", href: "/school/help" }, { label: "FAQs" }]} />
            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"><ArrowLeft size={18} /></button>
                <div><h1 className="text-[22px] font-bold text-slate-800">Frequently Asked Questions</h1><p className="text-[13px] text-slate-500">Quick answers to common questions</p></div>
            </div>
            <div className="space-y-3">
                {FAQS.map((faq, i) => (
                    <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <button onClick={() => setOpenIndex(openIndex === i ? null : i)}
                            className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors">
                            <span className="text-sm font-semibold text-slate-800 pr-4">{faq.q}</span>
                            {openIndex === i ? <ChevronDown size={16} className="text-slate-400 shrink-0" /> : <ChevronRight size={16} className="text-slate-400 shrink-0" />}
                        </button>
                        {openIndex === i && (
                            <div className="px-5 pb-4 text-sm text-slate-600 leading-relaxed">{faq.a}</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}