import { Search } from "lucide-react"
import { TEACHER_STATUS_OPTIONS } from "@/lib/constants"

export default function TeacherFilters({ search, onSearchChange, statusFilter, onStatusChange, subjectFilter, onSubjectChange, allSubjects = [] }) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={search} onChange={e => onSearchChange(e.target.value)} placeholder="Search by name, subject, or ID..."
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all" />
            </div>
            <div className="flex gap-1.5 flex-wrap">
                {TEACHER_STATUS_OPTIONS.map(s => (
                    <button key={s} onClick={() => onStatusChange(s)}
                        className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${statusFilter === s ? "bg-violet-600 border-violet-600 text-white shadow-sm" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>{s}</button>
                ))}
            </div>
            {allSubjects.length > 0 && (
                <select value={subjectFilter} onChange={e => onSubjectChange(e.target.value)}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500 bg-white">
                    <option value="All">All Subjects</option>
                    {allSubjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            )}
        </div>
    )
}