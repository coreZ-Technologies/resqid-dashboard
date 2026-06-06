"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Upload, Zap, Eye } from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"

const STEPS = [
    { title: "Generate Timetable", desc: "Go to Timetable → Generate. Choose All Classes or Per Class. Set constraints (max periods, lunch break, working days). Click Generate.", icon: Zap },
    { title: "Validate Existing Timetable", desc: "Already have a timetable? Upload it as CSV. The system checks for teacher conflicts, room clashes, and overloads.", icon: Upload },
    { title: "Review & Edit", desc: "View the generated timetable. Drag and drop to swap periods. System validates in real-time. Save when ready.", icon: Eye },
    { title: "Manage Yearly Timetables", desc: "Create separate timetables for Term 1, Term 2, Term 3. Copy previous term as base. Archive old timetables.", icon: Calendar },
]

export default function TimetableDocsPage() {
    const router = useRouter()

    return (
        <div className="max-w-[800px] mx-auto space-y-6">
            <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "Help", href: "/school/help" }, { label: "Timetable Guide" }]} />
            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"><ArrowLeft size={18} /></button>
                <div><h1 className="text-[22px] font-bold text-slate-800">Timetable Guide</h1><p className="text-[13px] text-slate-500">Generating and managing school timetables</p></div>
            </div>
            <div className="space-y-3">
                {STEPS.map((step, i) => (
                    <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center shrink-0"><step.icon size={18} className="text-violet-600" /></div>
                        <div>
                            <span className="text-xs font-bold text-violet-500 bg-violet-50 px-2 py-0.5 rounded">Step {i + 1}</span>
                            <h3 className="font-semibold text-slate-800 text-sm mt-1">{step.title}</h3>
                            <p className="text-sm text-slate-600 mt-1">{step.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}