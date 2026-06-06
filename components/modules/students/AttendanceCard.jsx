import { cn } from "@/lib/utils"

export default function AttendanceCard({ attendance }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
            <h3 className="font-semibold text-slate-800">Attendance Summary</h3>
            <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-emerald-50 rounded-lg"><p className="text-xl font-bold text-emerald-600">{attendance.present}</p><p className="text-xs text-slate-500">Present</p></div>
                <div className="text-center p-3 bg-rose-50 rounded-lg"><p className="text-xl font-bold text-rose-600">{attendance.total - attendance.present}</p><p className="text-xs text-slate-500">Absent</p></div>
                <div className="text-center p-3 bg-violet-50 rounded-lg"><p className="text-xl font-bold text-violet-600">{attendance.percentage}%</p><p className="text-xs text-slate-500">Rate</p></div>
            </div>
            <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1"><span>Overall</span><span>{attendance.percentage}%</span></div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className={cn("h-full rounded-full", attendance.percentage >= 75 ? "bg-emerald-500" : attendance.percentage >= 60 ? "bg-amber-500" : "bg-rose-500")} style={{ width: `${attendance.percentage}%` }} />
                </div>
            </div>
            <div className="space-y-2">
                {attendance.monthly.map(m => (
                    <div key={m.month}>
                        <div className="flex justify-between text-xs text-slate-500 mb-0.5"><span>{m.month}</span><span>{m.present}/{m.total}</span></div>
                        <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden"><div className="h-full bg-violet-500 rounded-full" style={{ width: `${m.percentage}%` }} /></div>
                    </div>
                ))}
            </div>
            {attendance.recentAbsences.length > 0 && (
                <div>
                    <p className="text-sm font-medium text-slate-700 mb-2">Recent Absences</p>
                    {attendance.recentAbsences.map((a, i) => (
                        <div key={i} className="flex justify-between items-center text-sm p-2 bg-slate-50 rounded-lg mb-1.5">
                            <div><p className="text-slate-700">{new Date(a.date).toLocaleDateString()}</p><p className="text-xs text-slate-400">{a.reason}</p></div>
                            <span className={cn("text-xs px-2 py-1 rounded", a.approved ? "text-emerald-600 bg-emerald-50" : "text-amber-600 bg-amber-50")}>{a.approved ? "Approved" : "Pending"}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}