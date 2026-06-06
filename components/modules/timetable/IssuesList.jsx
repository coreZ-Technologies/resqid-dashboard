import { AlertCircle, AlertTriangle, Info, CheckCircle2, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const severityConfig = {
    error: { icon: AlertCircle, color: "text-red-600", bg: "bg-red-50", border: "border-red-200", label: "Error" },
    warning: { icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", label: "Warning" },
    info: { icon: Info, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", label: "Info" },
}

export default function IssuesList({ issues = [], onResolve, onView }) {
    const errors = issues.filter(i => i.severity === "error")
    const warnings = issues.filter(i => i.severity === "warning")
    const infos = issues.filter(i => i.severity === "info")

    if (issues.length === 0) {
        return (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center">
                <CheckCircle2 size={32} className="mx-auto mb-3 text-emerald-500" />
                <p className="font-semibold text-emerald-700">No issues found!</p>
                <p className="text-xs text-emerald-600 mt-1">Your timetable looks clean.</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Summary */}
            <div className="flex gap-3">
                <div className="flex items-center gap-2 px-3 py-2 bg-red-50 rounded-lg text-xs font-semibold text-red-700"><AlertCircle size={12} />{errors.length} Error{errors.length !== 1 ? "s" : ""}</div>
                <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 rounded-lg text-xs font-semibold text-amber-700"><AlertTriangle size={12} />{warnings.length} Warning{warnings.length !== 1 ? "s" : ""}</div>
                <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg text-xs font-semibold text-blue-700"><Info size={12} />{infos.length} Info</div>
            </div>

            {/* Issues List */}
            <div className="space-y-1.5">
                {issues.map(issue => {
                    const config = severityConfig[issue.severity]
                    const Icon = config.icon
                    return (
                        <div key={issue.id} className={cn("flex items-center gap-3 p-3 rounded-lg border", config.bg, config.border)}>
                            <Icon size={14} className={cn("shrink-0", config.color)} />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-slate-700">{issue.description}</p>
                                <p className="text-[10px] text-slate-400 mt-0.5">
                                    {issue.class !== "—" && <span className="mr-2">{issue.class}</span>}
                                    {issue.day !== "—" && <span className="mr-2">{issue.day}</span>}
                                    {issue.period && <span>Period {issue.period}</span>}
                                </p>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                                {!issue.resolved && onResolve && (
                                    <button onClick={() => onResolve(issue.id)} className="text-[10px] font-semibold text-green-600 hover:text-green-700 px-2 py-1 rounded hover:bg-green-100 transition-colors">Resolve</button>
                                )}
                                {onView && (
                                    <button onClick={() => onView(issue)} className="p-1 rounded hover:bg-white/50 transition-colors"><ChevronRight size={12} /></button>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}