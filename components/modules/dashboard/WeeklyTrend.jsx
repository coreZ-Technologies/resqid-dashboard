import { BarChart2 } from "lucide-react"

export default function WeeklyTrend({ data = [] }) {
    const avg = data.length ? (data.reduce((a, t) => a + t.pct, 0) / data.length).toFixed(1) : 0

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="font-bold text-slate-800">Weekly Trend</p>
                    <p className="text-xs text-slate-400 mt-0.5">This week's attendance</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                    <BarChart2 size={14} className="text-violet-500" />
                </div>
            </div>
            <div className="flex items-end gap-2 h-[120px]">
                {data.map(d => {
                    const color = d.pct >= 93 ? "bg-emerald-400" : d.pct >= 88 ? "bg-amber-400" : "bg-rose-400"
                    return (
                        <div key={d.day} className="flex flex-col items-center gap-1.5 flex-1">
                            <span className="text-[10px] font-semibold text-slate-600">{d.pct}%</span>
                            <div className="w-full rounded-full overflow-hidden" style={{ height: 80 }}>
                                <div className={`w-full ${color} rounded-full`} style={{ height: `${d.pct}%`, marginTop: `${100 - d.pct}%` }} />
                            </div>
                            <span className="text-[10px] text-slate-400">{d.day}</span>
                        </div>
                    )
                })}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">Week avg.</span>
                <span className="font-bold text-slate-700">{avg}%</span>
            </div>
        </div>
    )
}