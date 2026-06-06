import { AlertTriangle, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LowAttendanceAlert({ students = [] }) {
    const router = useRouter()

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div>
                    <p className="font-bold text-slate-800">Needs Attention</p>
                    <p className="text-xs text-slate-400 mt-0.5">Below 80% attendance</p>
                </div>
                <AlertTriangle size={16} className="text-rose-500" />
            </div>
            <div className="divide-y divide-slate-50">
                {students.map(s => (
                    <div key={s.name} className="flex items-center gap-3 px-5 py-3">
                        <div className={`w-8 h-8 rounded-full ${s.color} flex items-center justify-center text-white text-[10px] font-bold`}>{s.avatar}</div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-xs font-semibold text-slate-700">{s.name}</p>
                                <span className="text-xs font-bold text-rose-600">{s.pct}%</span>
                            </div>
                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-rose-400 rounded-full" style={{ width: `${s.pct}%` }} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={() => router.push("/school/attendance/reports")} className="w-full px-5 py-3 border-t border-slate-100 text-xs text-violet-500 font-medium text-left">
                View full report <ChevronRight size={12} className="inline" />
            </button>
        </div>
    )
}