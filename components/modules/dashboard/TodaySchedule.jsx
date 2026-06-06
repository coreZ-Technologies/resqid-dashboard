import { CheckCircle2, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

const statusStyle = {
    done: { label: "Done", color: "text-slate-400", bg: "bg-slate-50" },
    ongoing: { label: "Live", color: "text-emerald-600", bg: "bg-emerald-50" },
    upcoming: { label: "Next", color: "text-sky-600", bg: "bg-sky-50" },
}

export default function TodaySchedule({ periods = [] }) {
    const router = useRouter()

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div>
                    <p className="font-bold text-slate-800">Today's Schedule</p>
                    <p className="text-xs text-slate-400 mt-0.5">Class 8-A</p>
                </div>
                <button onClick={() => router.push("/school/timetable")} className="text-xs text-violet-500 font-medium">Full view</button>
            </div>
            <div className="divide-y divide-slate-50">
                {periods.map(p => {
                    const st = statusStyle[p.status]
                    return (
                        <div key={p.period} className={cn("flex items-center gap-3 px-5 py-3", p.status === "ongoing" && "bg-emerald-50/40")}>
                            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center border", st.bg)}>
                                <span className={cn("text-[10px] font-bold", st.color)}>{p.period}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={cn("text-xs font-semibold", p.status === "done" ? "text-slate-400" : "text-slate-700")}>{p.subject}</p>
                                <p className="text-[10px] text-slate-400">{p.teacher} · {p.time}</p>
                            </div>
                            {p.status === "ongoing" && <span className="text-[9px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">LIVE</span>}
                            {p.status === "done" && <CheckCircle2 size={13} className="text-slate-300" />}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}