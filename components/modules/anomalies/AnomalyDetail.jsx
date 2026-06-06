import { X, MapPin, Clock, CalendarDays, ScanLine, CheckCircle2, AlertCircle, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { cn } from "@/lib/utils"

const typeConfig = {
    duplicate_scan: { label: "Duplicate Scan", color: "bg-rose-100 text-rose-700 border-rose-200" },
    unknown_card: { label: "Unknown Card", color: "bg-amber-100 text-amber-700 border-amber-200" },
    outside_hours: { label: "Outside Hours", color: "bg-violet-100 text-violet-700 border-violet-200" },
    multiple_exits: { label: "Multiple Exits", color: "bg-sky-100 text-sky-700 border-sky-200" },
    suspicious_timing: { label: "Suspicious Timing", color: "bg-orange-100 text-orange-700 border-orange-200" },
}

const severityConfig = {
    high: { label: "High", color: "bg-rose-100 text-rose-700" },
    medium: { label: "Medium", color: "bg-amber-100 text-amber-700" },
    low: { label: "Low", color: "bg-slate-100 text-slate-600" },
}

export default function AnomalyDetail({ anomaly, onClose }) {
    const router = useRouter()
    if (!anomaly) return null

    const type = typeConfig[anomaly.type] || typeConfig.unknown_card
    const severity = severityConfig[anomaly.severity] || severityConfig.low

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-fit">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div>
                    <p className="font-bold text-slate-800">Anomaly Detail</p>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">{anomaly.id}</p>
                </div>
                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"><X size={16} /></button>
            </div>

            <div className="p-5 space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className={`w-10 h-10 rounded-full ${anomaly.avatarColor} flex items-center justify-center text-white font-bold text-sm`}>{anomaly.avatar}</div>
                    <div>
                        <p className="text-sm font-bold text-slate-800">{anomaly.student}</p>
                        <p className="text-xs text-slate-500">{anomaly.class}{anomaly.studentId && <span className="ml-2 font-mono text-slate-400">{anomaly.studentId}</span>}</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold border", type.color)}>{type.label}</span>
                    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold", severity.color)}>{severity.label}</span>
                    <StatusBadge status={anomaly.status === "open" ? "absent" : anomaly.status === "investigating" ? "pending" : "present"} size="sm" label={anomaly.status} />
                </div>

                <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Description</p>
                    <p className="text-sm text-slate-700">{anomaly.description}</p>
                </div>

                <div className="space-y-2">
                    {[
                        { icon: MapPin, label: "Location", value: anomaly.location },
                        { icon: Clock, label: "Time", value: `${anomaly.date} · ${anomaly.time}` },
                        { icon: CalendarDays, label: "Date", value: anomaly.date },
                        { icon: ScanLine, label: "Detected By", value: anomaly.detectedBy },
                    ].map(row => (
                        <div key={row.label} className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5"><row.icon size={11} className="text-slate-500" /></div>
                            <div><p className="text-[10px] text-slate-400">{row.label}</p><p className="text-xs font-medium text-slate-700">{row.value}</p></div>
                        </div>
                    ))}
                </div>

                {anomaly.status !== 'resolved' && (
                    <div className="space-y-2 pt-1">
                        <p className="text-xs font-semibold text-slate-400 uppercase">Actions</p>
                        <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors"><CheckCircle2 size={14} />Mark as Resolved</button>
                        <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-semibold transition-colors"><AlertCircle size={14} />Mark as Investigating</button>
                        {anomaly.studentId && (
                            <button onClick={() => router.push(`/school/students/${anomaly.studentId}`)}
                                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold transition-colors"><User size={14} />View Student Profile</button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}