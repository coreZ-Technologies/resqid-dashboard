'use client';

/**
 * SCHOOL ADMIN — REPORTS
 * Place at: app/(school)/school/reports/page.jsx
 */

import { useState, useMemo } from 'react';
import {
    BarChart2, Download, FileText, Users, CheckCircle,
    Clock, ChevronDown, Loader2, RefreshCw,
    FileSpreadsheet, Printer, Search,
    ArrowUpRight, ArrowDownRight,
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────
const REPORT_TYPES = [
    { id: 'attendance', label: 'Attendance', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50',  border: 'border-emerald-200' },
    { id: 'scan_logs',  label: 'Scan Logs',  icon: BarChart2,   color: 'text-blue-600',   bg: 'bg-blue-50',     border: 'border-blue-200'    },
    { id: 'students',   label: 'Students',   icon: Users,       color: 'text-violet-600', bg: 'bg-violet-50',   border: 'border-violet-200'  },
    { id: 'sessions',   label: 'Sessions',   icon: Clock,       color: 'text-amber-600',  bg: 'bg-amber-50',    border: 'border-amber-200'   },
];

const DATE_RANGES = ['Today', 'This Week', 'This Month', 'Last Month', 'Custom'];

// Class list — exact values used in mock data too
const CLASSES = [
    'All Classes',
    'Nursery', 'LKG', 'UKG',
    'Cls 1', 'Cls 2', 'Cls 3', 'Cls 4', 'Cls 5', 'Cls 6',
    'Cls 7', 'Cls 8', 'Cls 9', 'Cls 10', 'Cls 11', 'Cls 12',
];

const SECTIONS = ['A', 'B', 'C', 'D'];

// ─── Mock Data — each row has explicit class + section ────────────────────────
const ALL_ATTENDANCE_ROWS = [
    // Cls 1
    { id: 'r1',  cls: 'Cls 1',  section: 'A', date: '30/5/2026', total: 35, present: 35, absent: 0,  late: 0 },
    { id: 'r2',  cls: 'Cls 1',  section: 'B', date: '29/5/2026', total: 35, present: 34, absent: 1,  late: 1 },
    { id: 'r3',  cls: 'Cls 1',  section: 'C', date: '28/5/2026', total: 35, present: 33, absent: 2,  late: 0 },
    // Cls 2
    { id: 'r4',  cls: 'Cls 2',  section: 'A', date: '30/5/2026', total: 35, present: 32, absent: 3,  late: 2 },
    { id: 'r5',  cls: 'Cls 2',  section: 'B', date: '29/5/2026', total: 35, present: 34, absent: 1,  late: 1 },
    // Cls 3
    { id: 'r6',  cls: 'Cls 3',  section: 'A', date: '30/5/2026', total: 35, present: 33, absent: 2,  late: 2 },
    { id: 'r7',  cls: 'Cls 3',  section: 'C', date: '28/5/2026', total: 35, present: 30, absent: 5,  late: 3 },
    // Cls 4
    { id: 'r8',  cls: 'Cls 4',  section: 'D', date: '27/5/2026', total: 35, present: 32, absent: 3,  late: 0 },
    { id: 'r9',  cls: 'Cls 4',  section: 'B', date: '30/5/2026', total: 35, present: 31, absent: 4,  late: 1 },
    // Cls 5
    { id: 'r10', cls: 'Cls 5',  section: 'A', date: '26/5/2026', total: 35, present: 31, absent: 4,  late: 1 },
    { id: 'r11', cls: 'Cls 5',  section: 'B', date: '30/5/2026', total: 35, present: 35, absent: 0,  late: 0 },
    // Cls 6
    { id: 'r12', cls: 'Cls 6',  section: 'B', date: '25/5/2026', total: 35, present: 30, absent: 5,  late: 2 },
    { id: 'r13', cls: 'Cls 6',  section: 'A', date: '30/5/2026', total: 35, present: 33, absent: 2,  late: 1 },
    // Cls 7
    { id: 'r14', cls: 'Cls 7',  section: 'A', date: '30/5/2026', total: 35, present: 35, absent: 0,  late: 0 },
    { id: 'r15', cls: 'Cls 7',  section: 'B', date: '29/5/2026', total: 35, present: 34, absent: 1,  late: 1 },
    { id: 'r16', cls: 'Cls 7',  section: 'C', date: '28/5/2026', total: 35, present: 33, absent: 2,  late: 2 },
    { id: 'r17', cls: 'Cls 7',  section: 'D', date: '27/5/2026', total: 35, present: 32, absent: 3,  late: 0 },
    // Cls 8
    { id: 'r18', cls: 'Cls 8',  section: 'A', date: '30/5/2026', total: 35, present: 29, absent: 6,  late: 2 },
    { id: 'r19', cls: 'Cls 8',  section: 'B', date: '30/5/2026', total: 35, present: 31, absent: 4,  late: 1 },
    // Cls 9
    { id: 'r20', cls: 'Cls 9',  section: 'A', date: '30/5/2026', total: 33, present: 30, absent: 3,  late: 0 },
    { id: 'r21', cls: 'Cls 9',  section: 'C', date: '29/5/2026', total: 33, present: 28, absent: 5,  late: 3 },
    // Cls 10
    { id: 'r22', cls: 'Cls 10', section: 'A', date: '30/5/2026', total: 32, present: 32, absent: 0,  late: 0 },
    { id: 'r23', cls: 'Cls 10', section: 'B', date: '30/5/2026', total: 32, present: 30, absent: 2,  late: 1 },
    // Cls 11
    { id: 'r24', cls: 'Cls 11', section: 'A', date: '30/5/2026', total: 30, present: 28, absent: 2,  late: 0 },
    // Cls 12
    { id: 'r25', cls: 'Cls 12', section: 'B', date: '30/5/2026', total: 28, present: 27, absent: 1,  late: 0 },
];

ALL_ATTENDANCE_ROWS.forEach(r => {
    r.rate = Math.round((r.present / r.total) * 100);
});

const ALL_SCAN_ROWS = Array.from({ length: 30 }, (_, i) => {
    const clsNum = (i % 12) + 1;
    const clsName = clsNum <= 0 ? 'Nursery' : `Cls ${clsNum}`;
    return {
        id: `sc${i}`,
        student: ['Aarav Sharma','Priya Patel','Rohit Singh','Sneha Gupta','Karan Kumar',
                  'Divya Joshi','Arjun Verma','Meera Shah','Vikram Mehta','Ananya Reddy'][i % 10],
        cls: clsName,
        result: ['SUCCESS','SUCCESS','SUCCESS','INVALID','REVOKED','EXPIRED'][i % 6],
        time: new Date(Date.now() - i * 1800000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        date: new Date(Date.now() - i * 86400000).toLocaleDateString('en-IN'),
        device: ['Chrome/Android','Safari/iOS','Chrome/Windows'][i % 3],
        response: `${80 + (i * 17) % 300}ms`,
    };
});

// ─── Summaries ─────────────────────────────────────────────────────────────────
const SUMMARY = {
    attendance: { present: 1786, absent: 118, late: 85, rate: 85, rateChange: +3, total: 2100 },
    scan_logs:  { total: 4312, success: 4089, failed: 223, rate: 95, rateChange: +2 },
    students:   { total: 2100, active: 2067, inactive: 33, newThisMonth: 12 },
    sessions:   { total: 148, open: 3, closed: 145, avgDuration: '52m' },
};

const RESULT_STYLE = {
    SUCCESS: { bg: 'bg-emerald-50', color: 'text-emerald-700' },
    INVALID: { bg: 'bg-red-50',     color: 'text-red-700'     },
    REVOKED: { bg: 'bg-red-50',     color: 'text-red-700'     },
    EXPIRED: { bg: 'bg-amber-50',   color: 'text-amber-700'   },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const humanize = s => s?.replace(/_/g,' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase()) || '';

// ─── Sub-components ───────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, change, color = 'text-slate-900' }) => (
    <div className="bg-white rounded-none border-r border-b border-slate-200 px-8 py-6 flex-1">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">{label}</div>
        <div className={`text-4xl font-bold ${color}`}>
            {typeof value === 'number' ? value.toLocaleString('en-IN') : value}
        </div>
        <div className="flex items-center gap-1.5 mt-1.5">
            {sub && <span className="text-sm text-slate-400">{sub}</span>}
            {change !== undefined && (
                <span className={`text-sm font-semibold flex items-center gap-0.5 ${change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {change >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {Math.abs(change)}%
                </span>
            )}
        </div>
    </div>
);

const ExportMenu = ({ onExport, loading }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="relative">
            <button
                onClick={() => setOpen(o => !o)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
            >
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                Export <ChevronDown size={13} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
                    <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-20 w-44 overflow-hidden">
                        {[
                            { label: 'Export CSV', icon: FileSpreadsheet, fmt: 'csv'   },
                            { label: 'Export PDF', icon: FileText,        fmt: 'pdf'   },
                            { label: 'Print',      icon: Printer,         fmt: 'print' },
                        ].map(({ label, icon: Icon, fmt }) => (
                            <button key={fmt} onClick={() => { onExport(fmt); setOpen(false); }}
                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                                <Icon size={14} className="text-slate-400" /> {label}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ReportsPage() {
    const [activeType, setActiveType]       = useState('attendance');
    const [dateRange, setDateRange]         = useState('Today');
    const [classFilter, setClassFilter]     = useState('All Classes');
    const [search, setSearch]               = useState('');
    const [exportLoading, setExportLoading] = useState(false);
    const [customFrom, setCustomFrom]       = useState('');
    const [customTo, setCustomTo]           = useState('');

    const summary = SUMMARY[activeType];

    // ── Filtered attendance rows ──────────────────────────────────────────────
    const filteredAttendance = useMemo(() => {
        return ALL_ATTENDANCE_ROWS.filter(r => {
            // Class filter — "All Classes" shows everything
            const matchClass = classFilter === 'All Classes' || r.cls === classFilter;
            // Search filter — matches class name or section
            const matchSearch = !search ||
                `${r.cls} ${r.section}`.toLowerCase().includes(search.toLowerCase()) ||
                r.cls.toLowerCase().includes(search.toLowerCase());
            return matchClass && matchSearch;
        });
    }, [classFilter, search]);

    // ── Filtered scan rows ────────────────────────────────────────────────────
    const filteredScans = useMemo(() => {
        return ALL_SCAN_ROWS.filter(r => {
            const matchClass  = classFilter === 'All Classes' || r.cls === classFilter;
            const matchSearch = !search ||
                (r.student || '').toLowerCase().includes(search.toLowerCase()) ||
                r.cls.toLowerCase().includes(search.toLowerCase());
            return matchClass && matchSearch;
        });
    }, [classFilter, search]);

    const handleExport = async (fmt) => {
        setExportLoading(true);
        await new Promise(res => setTimeout(res, 800));
        setExportLoading(false);
        if (fmt === 'print') window.print();
    };

    return (
        <div className="max-w-[1300px]">

            {/* ── Summary Stats (matches screenshot layout) ──────────────── */}
            <div className="flex border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm mb-6">
                <StatCard label="Total Students"  value={2100}   color="text-slate-900" />
                <StatCard label="Present Today"   value={1786}   sub="85% rate"  change={+3} color="text-emerald-600" />
                <StatCard label="Absent Today"    value={118}    sub="85 late arrivals"        color="text-red-500" />
                <StatCard label="Attendance Rate" value="85%"    change={+3}                   color="text-blue-600" />
            </div>

            {/* ── Report Type Tabs ───────────────────────────────────────── */}
            <div className="flex gap-2 mb-5 flex-wrap">
                {REPORT_TYPES.map(({ id, label, icon: Icon, color, bg, border }) => (
                    <button key={id} onClick={() => { setActiveType(id); setSearch(''); }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                            activeType === id
                                ? `${bg} ${border} ${color} font-semibold shadow-sm`
                                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                        }`}>
                        <Icon size={15} /> {label}
                    </button>
                ))}
            </div>

            {/* ── Filters ───────────────────────────────────────────────── */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm px-4 py-3 mb-5 flex flex-wrap items-center gap-3">
                {/* Date range pills */}
                <div className="flex gap-1.5 flex-wrap">
                    {DATE_RANGES.map(d => (
                        <button key={d} onClick={() => setDateRange(d)}
                            className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                                dateRange === d
                                    ? 'bg-blue-600 border-blue-600 text-white font-semibold'
                                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}>
                            {d}
                        </button>
                    ))}
                </div>

                {/* Custom date pickers */}
                {dateRange === 'Custom' && (
                    <div className="flex items-center gap-2">
                        <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)}
                            className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-blue-500" />
                        <span className="text-slate-400 text-sm">to</span>
                        <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)}
                            className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-blue-500" />
                    </div>
                )}

                {/* Class dropdown */}
                <div className="relative ml-auto">
                    <select
                        value={classFilter}
                        onChange={e => setClassFilter(e.target.value)}
                        className="appearance-none border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-sm text-slate-700 outline-none focus:border-blue-500 bg-white cursor-pointer font-medium"
                    >
                        {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>

                {/* Search */}
                <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search..."
                        className="pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 w-48" />
                </div>

                <ExportMenu onExport={handleExport} loading={exportLoading} />
            </div>

            {/* ── Data Table ─────────────────────────────────────────────── */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

                {/* Table header row */}
                <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
                    <div className="text-sm font-semibold text-slate-800">
                        {humanize(activeType)} Report
                        <span className="text-slate-400 font-normal ml-2">· {dateRange}</span>
                        {classFilter !== 'All Classes' && (
                            <span className="text-slate-400 font-normal ml-1">· {classFilter}</span>
                        )}
                    </div>
                    <button onClick={() => setSearch('')}
                        className="flex items-center gap-1 text-xs text-slate-400 hover:text-blue-600 transition-colors">
                        <RefreshCw size={12} /> Refresh
                    </button>
                </div>

                {/* ── Attendance Table ─── */}
                {activeType === 'attendance' && (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    {['DATE','CLASS','PRESENT','ABSENT','LATE','RATE'].map(h => (
                                        <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-400 tracking-wider whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAttendance.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-16 text-center text-slate-400 text-sm">
                                            No data for <strong>{classFilter}</strong>
                                        </td>
                                    </tr>
                                ) : filteredAttendance.map((row, i) => (
                                    <tr key={row.id}
                                        className={`hover:bg-slate-50 transition-colors ${i < filteredAttendance.length - 1 ? 'border-b border-slate-100' : ''}`}>
                                        <td className="px-5 py-3.5 text-sm text-slate-600 whitespace-nowrap">{row.date}</td>
                                        <td className="px-5 py-3.5">
                                            <span className="font-semibold text-slate-800 text-sm">{row.cls}–{row.section}</span>
                                            <span className="text-xs text-slate-400 ml-1.5">({row.total} students)</span>
                                        </td>
                                        <td className="px-5 py-3.5 text-sm font-bold text-emerald-600">{row.present}</td>
                                        <td className="px-5 py-3.5 text-sm font-bold text-red-500">{row.absent}</td>
                                        <td className="px-5 py-3.5 text-sm font-bold text-amber-500">{row.late}</td>
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-20 bg-slate-100 rounded-full h-2 overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${row.rate >= 90 ? 'bg-emerald-500' : row.rate >= 75 ? 'bg-emerald-400' : row.rate >= 60 ? 'bg-amber-400' : 'bg-red-400'}`}
                                                        style={{ width: `${row.rate}%` }}
                                                    />
                                                </div>
                                                <span className={`text-sm font-bold ${row.rate >= 80 ? 'text-emerald-600' : row.rate >= 60 ? 'text-amber-600' : 'text-red-500'}`}>
                                                    {row.rate}%
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* ── Scan Logs Table ─── */}
                {activeType === 'scan_logs' && (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    {['DATE','TIME','STUDENT','CLASS','RESULT','DEVICE','RESPONSE'].map(h => (
                                        <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-400 tracking-wider whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredScans.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-16 text-center text-slate-400 text-sm">
                                            No scan logs for <strong>{classFilter}</strong>
                                        </td>
                                    </tr>
                                ) : filteredScans.map((row, i) => {
                                    const s = RESULT_STYLE[row.result] || RESULT_STYLE.INVALID;
                                    return (
                                        <tr key={row.id}
                                            className={`hover:bg-slate-50 transition-colors ${i < filteredScans.length - 1 ? 'border-b border-slate-100' : ''}`}>
                                            <td className="px-5 py-3.5 text-xs text-slate-500 whitespace-nowrap">{row.date}</td>
                                            <td className="px-5 py-3.5 text-xs font-mono text-slate-600">{row.time}</td>
                                            <td className="px-5 py-3.5 text-sm font-medium text-slate-800">{row.student}</td>
                                            <td className="px-5 py-3.5 text-sm text-slate-600">{row.cls}</td>
                                            <td className="px-5 py-3.5">
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${s.bg} ${s.color}`}>
                                                    {humanize(row.result)}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5 text-xs text-slate-500">{row.device.split('/')[0]}</td>
                                            <td className="px-5 py-3.5">
                                                <span className={`text-xs font-mono font-semibold ${parseInt(row.response) > 300 ? 'text-amber-600' : 'text-emerald-600'}`}>
                                                    {row.response}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* ── Students / Sessions placeholder ─── */}
                {(activeType === 'students' || activeType === 'sessions') && (
                    <div className="py-20 text-center text-slate-400">
                        <FileText size={36} className="mx-auto mb-3 opacity-20" />
                        <p className="font-medium text-slate-500">{humanize(activeType)} report</p>
                        <p className="text-sm mt-1">Connect your API to populate this table</p>
                    </div>
                )}

                {/* Footer */}
                <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                        {activeType === 'attendance'
                            ? `${filteredAttendance.length} records`
                            : activeType === 'scan_logs'
                            ? `${filteredScans.length} records`
                            : '—'
                        }
                        {classFilter !== 'All Classes' && ` · ${classFilter}`}
                    </span>
                    <button onClick={() => handleExport('csv')}
                        className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                        <Download size={13} /> Download CSV
                    </button>
                </div>
            </div>
        </div>
    );
}