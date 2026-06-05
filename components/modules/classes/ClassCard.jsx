import { Users, LayoutGrid, Edit2, Trash2, UserCheck } from "lucide-react"
import { GRADE_GROUP_MAP, GROUP_COLORS } from "@/lib/constants"
import { cn } from "@/lib/utils"

export default function ClassCard({ cls, onEdit, onDelete, onClick }) {
    const group = GRADE_GROUP_MAP[cls.grade] || "Primary"
    const color = GROUP_COLORS[group]
    const isActive = cls.status === "Active"

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
                            <span className="text-white font-bold text-base">
                                {cls.grade.replace("Cls ", "")}{cls.section}
                            </span>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-base leading-tight">
                                {cls.grade}–{cls.section}
                            </h3>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${color.light} ${color.text}`}>
                                {group}
                            </span>
                        </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-slate-400"}`} />
                        {cls.status}
                    </span>
                </div>

                {/* Class teacher */}
                <div className="flex items-center gap-1.5 mb-3 text-sm text-slate-600">
                    <UserCheck size={13} className="text-slate-400 shrink-0" />
                    <span className="font-medium truncate">{cls.classTeacher}</span>
                </div>

                {/* Subjects */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {cls.subjects.slice(0, 4).map(sub => (
                        <span key={sub} className={`px-2 py-0.5 rounded-md text-xs font-medium border ${color.light} ${color.text} ${color.border}`}>
                            {sub}
                        </span>
                    ))}
                    {cls.subjects.length > 4 && (
                        <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-500">
                            +{cls.subjects.length - 4} more
                        </span>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                            <Users size={12} /> {cls.students} students
                        </span>
                        {cls.room && (
                            <span className="flex items-center gap-1">
                                <LayoutGrid size={12} /> {cls.room}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                onEdit(cls)
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                            <Edit2 size={14} />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                onDelete(cls.id)
                            }}
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