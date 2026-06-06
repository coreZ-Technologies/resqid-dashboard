import { BookOpen, Users, Clock, Edit2, Trash2 } from "lucide-react"
import { SUBJECT_CATEGORY_COLORS } from "@/lib/constants"
import { cn } from "@/lib/utils"

export default function SubjectCard({ subject, onClick, onEdit, onDelete }) {
    const color = SUBJECT_CATEGORY_COLORS[subject.category] || SUBJECT_CATEGORY_COLORS.Core
    const totalClasses = subject.mappings?.length || 0
    const allTeachers = [...new Set((subject.mappings || []).flatMap(m => m.teachers))]
    const totalTeachers = allTeachers.length
    const isActive = subject.status === "Active"

    return (
        <div
            onClick={onClick}
            className={cn(
                "bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden group",
                onClick && "cursor-pointer"
            )}
        >
            <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl ${color.bg} flex items-center justify-center shrink-0`}>
                            <BookOpen size={20} className="text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-base leading-tight">{subject.name}</h3>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs font-mono text-slate-400">{subject.code}</span>
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${color.light} ${color.text}`}>
                                    {subject.category}
                                </span>
                            </div>
                        </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-slate-400"}`} />
                        {subject.status}
                    </span>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 mb-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                        <Users size={12} /> {totalClasses} class{totalClasses !== 1 ? "es" : ""}
                    </span>
                    <span className="flex items-center gap-1">
                        <BookOpen size={12} /> {totalTeachers} teacher{totalTeachers !== 1 ? "s" : ""}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock size={12} /> {subject.periodsPerWeek} periods/wk
                    </span>
                </div>

                {/* Description */}
                {subject.description && (
                    <p className="text-xs text-slate-400 line-clamp-2 mb-3">{subject.description}</p>
                )}

                {/* Footer */}
                <div className="flex items-center justify-end pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={(e) => { e.stopPropagation(); onEdit(subject) }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                            <Edit2 size={14} />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(subject.id) }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}