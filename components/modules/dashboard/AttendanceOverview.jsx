import { ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export default function AttendanceOverview({ classes = [], totalPresent, totalStudents, totalAbsent }) {
    const router = useRouter()
    const pct = Math.round((totalPresent / totalStudents) * 100)

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div>
                    <p className="font-bold text-slate-800">Today's Attendance</p>
                    <p className="text-xs text-slate-400 mt-0.5">{totalPresent} present · {totalAbsent} absent</p>
                </div>
                <button onClick={() => router.push("/school/attendance")} className="text-xs text-violet-500 hover:text-violet-700 font-medium flex items-center gap-1">
                    Full report <ChevronRight size={12} />
                </button>
            </div>
            <div className="px-5 py-4 flex items-center gap-6">
                <div className="relative w-20 h-20 shrink-0">
                    <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                        <circle cx="40" cy="40" r="32" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                        <circle cx="40" cy="40" r="32" fill="none" stroke="#10b981" strokeWidth="8"
                            strokeDasharray={2 * Math.PI * 32} strokeDashoffset={2 * Math.PI * 32 * (1 - pct / 100)} strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-sm font-bold text-slate-800">{pct}%</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="text-center"><p className="text-xl font-bold text-emerald-600">{totalPresent}</p><p className="text-[10px] text-slate-400">Present</p></div>
                    <div className="text-center"><p className="text-xl font-bold text-rose-500">{totalAbsent}</p><p className="text-[10px] text-slate-400">Absent</p></div>
                </div>
            </div>
            <div className="px-5 pb-5 space-y-2">
                {classes.slice(0, 6).map(c => {
                    const cPct = Math.round((c.present / c.total) * 100)
                    return (
                        <div key={c.grade + c.section} className="flex items-center gap-3">
                            <p className="text-xs font-semibold text-slate-600 w-16">{c.grade}-{c.section}</p>
                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className={cn("h-full rounded-full", cPct === 100 ? "bg-emerald-400" : cPct >= 90 ? "bg-sky-400" : "bg-amber-400")} style={{ width: `${cPct}%` }} />
                            </div>
                            <p className="text-xs font-bold text-slate-600 w-8 text-right">{cPct}%</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}