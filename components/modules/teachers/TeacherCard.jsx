import { BookOpen, Users, Clock, Edit2, Trash2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const statusConfig = {
    active: { label: "Active", dot: "bg-emerald-500", bg: "bg-emerald-50", text: "text-emerald-700" },
    on_leave: { label: "On Leave", dot: "bg-amber-500", bg: "bg-amber-50", text: "text-amber-700" },
    medical: { label: "Medical Leave", dot: "bg-red-500", bg: "bg-red-50", text: "text-red-700" },
    maternity: { label: "Maternity", dot: "bg-pink-500", bg: "bg-pink-50", text: "text-pink-700" },
    sabbatical: { label: "Sabbatical", dot: "bg-purple-500", bg: "bg-purple-50", text: "text-purple-700" },
    resigned: { label: "Resigned", dot: "bg-slate-400", bg: "bg-slate-100", text: "text-slate-500" },
}

export default function TeacherCard({ teacher, onClick, onEdit, onDelete }) {
    const status = statusConfig[teacher.status] || statusConfig.active
    const loadPercent = Math.round((teacher.currentLoad / teacher.maxLoad) * 100)
    const hasWellness = !!teacher.wellness
    const needsReplacement = hasWellness && teacher.wellness.requiresReplacement && !teacher.replacement

    return (
        <div onClick={onClick} className={cn("bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden group", onClick && "cursor-pointer")}>
            <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl ${teacher.avatarColor || "bg-blue-500"} flex items-center justify-center shrink-0`}>
                            <span className="text-white font-bold text-base">{teacher.avatar}</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-base leading-tight">{teacher.name}</h3>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />{status.label}
                                </span>
                                {needsReplacement && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-600">
                                        <AlertCircle size={10} /> Needs Replacement
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 mb-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><BookOpen size={12} /> {teacher.subjects.length} subject{teacher.subjects.length !== 1 ? "s" : ""}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {teacher.experience}</span>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                    {teacher.subjects.slice(0, 3).map(s => (
                        <span key={s} className="px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600">{s}</span>
                    ))}
                    {teacher.subjects.length > 3 && <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-400">+{teacher.subjects.length - 3}</span>}
                </div>

                <div className="mb-1">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span>Workload</span>
                        <span className="font-medium">{teacher.currentLoad}/{teacher.maxLoad}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div className={cn("h-full rounded-full transition-all", loadPercent > 90 ? "bg-red-500" : loadPercent > 70 ? "bg-amber-500" : "bg-emerald-500")} style={{ width: `${Math.min(loadPercent, 100)}%` }} />
                    </div>
                </div>

                {teacher.substituteFor?.length > 0 && (
                    <p className="text-xs text-violet-600 mt-2">Covering for {teacher.substituteFor.length} teacher{teacher.substituteFor.length !== 1 ? "s" : ""}</p>
                )}

                <div className="flex items-center justify-end pt-3 border-t border-slate-100 mt-3">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => { e.stopPropagation(); onEdit(teacher) }} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"><Edit2 size={14} /></button>
                        <button onClick={(e) => { e.stopPropagation(); onDelete(teacher.id) }} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 size={14} /></button>
                    </div>
                </div>
            </div>
        </div>
    )
}