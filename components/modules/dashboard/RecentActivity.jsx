import { CheckCircle2, XCircle, AlertCircle, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"

const styleMap = {
    check_in: { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50", label: "In" },
    absent: { icon: XCircle, color: "text-rose-500", bg: "bg-rose-50", label: "Absent" },
    late: { icon: AlertCircle, color: "text-amber-500", bg: "bg-amber-50", label: "Late" },
}

export default function RecentActivity({ activities = [] }) {
    const router = useRouter()
    const [filter, setFilter] = useState("all")
    const filtered = filter === "all" ? activities : activities.filter(a => a.type === filter)

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div>
                    <p className="font-bold text-slate-800">Live Activity</p>
                    <p className="text-xs text-slate-400 mt-0.5">RFID check-ins today</p>
                </div>
                <div className="flex gap-1">
                    {["all", "check_in", "late", "absent"].map(f => (
                        <button key={f} onClick={() => setFilter(f)}
                            className={cn("px-2 py-1 rounded-lg text-[9px] font-semibold uppercase", filter === f ? "bg-violet-600 text-white" : "text-slate-400 hover:text-slate-600")}>
                            {f === "check_in" ? "In" : f === "all" ? "All" : f}
                        </button>
                    ))}
                </div>
            </div>
            <div className="divide-y divide-slate-50">
                {filtered.slice(0, 5).map(a => {
                    const st = styleMap[a.type]
                    return (
                        <div key={a.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50/50">
                            <div className={`w-8 h-8 rounded-full ${a.color} flex items-center justify-center text-white text-[10px] font-bold`}>{a.avatar}</div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-slate-700">{a.name}</p>
                                <p className="text-[10px] text-slate-400">{a.cls} · {a.rfid}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <span className={cn("inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-md", st.bg, st.color)}><st.icon size={9} />{st.label}</span>
                                <span className="text-[10px] text-slate-400">{a.time}</span>
                            </div>
                        </div>
                    )
                })}
            </div>
            <button onClick={() => router.push("/school/scans/logs")} className="w-full px-5 py-3 border-t border-slate-100 text-xs text-violet-500 hover:text-violet-700 font-medium text-left">
                View full log <ChevronRight size={12} className="inline" />
            </button>
        </div>
    )
}