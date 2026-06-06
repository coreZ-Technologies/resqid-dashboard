import { Search } from "lucide-react"

const CLASSES = ['Nursery', 'LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
const SECTIONS = ['A', 'B', 'C', 'D']
const STATUSES = ['All', 'active', 'lost', 'replaced', 'deactivated']

export default function CardFilters({ search, onSearchChange, classFilter, onClassChange, sectionFilter, onSectionChange, statusFilter, onStatusChange }) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={search} onChange={e => onSearchChange(e.target.value)} placeholder="Search by name, card number, or QR ID..."
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all" />
            </div>
            <select value={classFilter} onChange={e => onClassChange(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500 bg-white">
                <option value="">All Classes</option>
                {CLASSES.map(c => <option key={c} value={c}>Class {c}</option>)}
            </select>
            <select value={sectionFilter} onChange={e => onSectionChange(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500 bg-white">
                <option value="">All Sections</option>
                {SECTIONS.map(s => <option key={s} value={s}>Section {s}</option>)}
            </select>
            <div className="flex gap-1.5">
                {STATUSES.map(s => (
                    <button key={s} onClick={() => onStatusChange(s)}
                        className={`px-3 py-2 rounded-lg border text-sm font-medium capitalize transition-all ${statusFilter === s ? "bg-violet-600 border-violet-600 text-white shadow-sm" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>{s}</button>
                ))}
            </div>
        </div>
    )
}