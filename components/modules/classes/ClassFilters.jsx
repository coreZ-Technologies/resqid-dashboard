import { Search } from "lucide-react"
import { GRADE_GROUPS, STATUS_OPTIONS } from "@/lib/constants"

export default function ClassFilters({
    search,
    onSearchChange,
    gradeGroup,
    onGradeGroupChange,
    statusFilter,
    onStatusChange
}) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3 mb-5 flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
                <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                    value={search}
                    onChange={e => onSearchChange(e.target.value)}
                    placeholder="Search by grade, section, or teacher..."
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
            </div>

            {/* Grade group tabs */}
            <div className="flex gap-1.5 flex-wrap">
                {GRADE_GROUPS.map(group => (
                    <button
                        key={group}
                        onClick={() => onGradeGroupChange(group)}
                        className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${gradeGroup === group
                                ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                                : "border-slate-200 text-slate-600 hover:bg-slate-50"
                            }`}
                    >
                        {group}
                    </button>
                ))}
            </div>

            {/* Status filter */}
            <div className="flex gap-1.5">
                {STATUS_OPTIONS.map(status => (
                    <button
                        key={status}
                        onClick={() => onStatusChange(status)}
                        className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${statusFilter === status
                                ? "bg-slate-800 border-slate-800 text-white"
                                : "border-slate-200 text-slate-600 hover:bg-slate-50"
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>
        </div>
    )
}