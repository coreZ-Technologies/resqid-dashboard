import { Search } from "lucide-react"

const TYPE_OPTIONS = ["All", "emergency", "test", "unknown"]
const ALERT_OPTIONS = ["All", "delivered", "failed", "pending"]

export default function EmergencyScanFilters({ search, onSearchChange, typeFilter, onTypeChange, alertFilter, onAlertChange }) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={search} onChange={e => onSearchChange(e.target.value)} placeholder="Search student, location, or notes..."
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all" />
            </div>
            <div className="flex gap-1.5">
                {TYPE_OPTIONS.map(t => (
                    <button key={t} onClick={() => onTypeChange(t)}
                        className={`px-3 py-2 rounded-lg border text-sm font-medium capitalize transition-all ${typeFilter === t ? "bg-violet-600 border-violet-600 text-white shadow-sm" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>{t}</button>
                ))}
            </div>
            <div className="flex gap-1.5">
                {ALERT_OPTIONS.map(a => (
                    <button key={a} onClick={() => onAlertChange(a)}
                        className={`px-3 py-2 rounded-lg border text-sm font-medium capitalize transition-all ${alertFilter === a ? "bg-slate-800 border-slate-800 text-white" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>{a}</button>
                ))}
            </div>
        </div>
    )
}