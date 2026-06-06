import { Search, ChevronDown } from "lucide-react"

const STATUS_OPTIONS = ['All', 'Open', 'Investigating', 'Resolved']
const SEVERITY_OPTIONS = ['All Severities', 'High', 'Medium', 'Low']

export default function AnomalyFilters({ search, onSearchChange, statusFilter, onStatusChange, severityFilter, onSeverityChange }) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={search} onChange={e => onSearchChange(e.target.value)} placeholder="Search student, ID, or description..."
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all" />
            </div>
            <div className="flex gap-1.5">
                {STATUS_OPTIONS.map(s => (
                    <button key={s} onClick={() => onStatusChange(s)}
                        className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${statusFilter === s ? "bg-violet-600 border-violet-600 text-white shadow-sm" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>{s}</button>
                ))}
            </div>
            <select value={severityFilter} onChange={e => onSeverityChange(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500 bg-white">
                {SEVERITY_OPTIONS.map(s => <option key={s}>{s}</option>)}
            </select>
        </div>
    )
}