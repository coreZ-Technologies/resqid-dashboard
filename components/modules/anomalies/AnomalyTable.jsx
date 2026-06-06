import { MapPin, Clock, Eye, Shield } from "lucide-react"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

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

export default function AnomalyTable({ anomalies = [], selectedId, onSelect }) {
    const router = useRouter()

    if (anomalies.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
                <Shield size={32} className="mx-auto mb-3 text-slate-200" />
                <p className="text-sm text-slate-400">No anomalies found</p>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50">
                            {["ID", "Student", "Type", "Severity", "Location & Time", "Status", ""].map(h => (
                                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {anomalies.map(a => {
                            const type = typeConfig[a.type] || typeConfig.unknown_card
                            const severity = severityConfig[a.severity] || severityConfig.low
                            const isSelected = selectedId === a.id
                            return (
                                <tr key={a.id} onClick={() => router.push(`/school/anomalies/${a.id}`)}
                                    className={cn("border-b border-slate-50 cursor-pointer transition-colors", isSelected ? "bg-violet-50/50" : "hover:bg-slate-50/50")}>
                                    <td className="px-4 py-3.5"><span className="text-xs font-mono text-slate-500">{a.id}</span></td>
                                    <td className="px-4 py-3.5">
                                        <div className="flex items-center gap-2.5">
                                            <div className={`w-7 h-7 rounded-full ${a.avatarColor} flex items-center justify-center text-white text-[10px] font-bold`}>{a.avatar}</div>
                                            <div>
                                                <p className="text-xs font-semibold text-slate-700">{a.student}</p>
                                                <p className="text-[10px] text-slate-400">{a.class}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold border", type.color)}>{type.label}</span>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold", severity.color)}>{severity.label}</span>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <div className="flex items-center gap-1 text-[11px] text-slate-500"><MapPin size={10} />{a.location}</div>
                                        <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5"><Clock size={10} />{a.date} · {a.time}</div>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <StatusBadge status={a.status === "open" ? "absent" : a.status === "investigating" ? "pending" : "present"} size="sm" label={a.status} />
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <button className={cn("p-1.5 rounded-lg transition-colors", isSelected ? "bg-violet-100 text-violet-600" : "text-slate-300 hover:bg-slate-100 hover:text-slate-600")}>
                                            <Eye size={14} />
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}