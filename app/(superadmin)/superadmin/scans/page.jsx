'use client';

/**
 * SUPER ADMIN — SCAN LOGS
 * Place at: app/(superadmin)/superadmin/scan-logs/page.jsx
 */

import { useState, useMemo } from 'react';
import {
    ScanLine, Search, CheckCircle, XCircle, Clock,
    MapPin, Monitor, Download, RefreshCw, Filter,
    AlertTriangle, ChevronDown, School, Users,
    ArrowUpRight, ArrowDownRight
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────
const RESULTS     = ['ALL', 'SUCCESS', 'INVALID', 'REVOKED', 'EXPIRED', 'RATE_LIMITED', 'ERROR'];
const PAGE_SIZE   = 15;

const RESULT_STYLE = {
    SUCCESS:      { bg: 'bg-emerald-50', color: 'text-emerald-700', dot: 'bg-emerald-500', Icon: CheckCircle  },
    INVALID:      { bg: 'bg-red-50',     color: 'text-red-700',     dot: 'bg-red-500',     Icon: XCircle      },
    REVOKED:      { bg: 'bg-red-50',     color: 'text-red-700',     dot: 'bg-red-500',     Icon: XCircle      },
    EXPIRED:      { bg: 'bg-amber-50',   color: 'text-amber-700',   dot: 'bg-amber-400',   Icon: Clock        },
    RATE_LIMITED: { bg: 'bg-orange-50',  color: 'text-orange-700',  dot: 'bg-orange-400',  Icon: AlertTriangle},
    ERROR:        { bg: 'bg-red-50',     color: 'text-red-700',     dot: 'bg-red-500',     Icon: XCircle      },
};

// ─── Mock Data — platform-wide (all schools) ──────────────────────────────────
const SCHOOLS = [
    'All Schools',
    'Springdale Public School',
    'Green Valley School',
    'Riverside Academy',
    'St. Mary\'s Convent',
    'Delhi Public School',
];

const MOCK_SCANS = Array.from({ length: 60 }, (_, i) => ({
    id:               `scan-${i + 1}`,
    token_hash:       `B${Math.random().toString(36).slice(2, 14).toUpperCase()}`,
    result:           RESULTS.slice(1)[i % 6],
    student_name:     i % 8 !== 0
        ? ['Aarav Sharma','Priya Patel','Rohit Singh','Sneha Gupta','Karan Kumar',
           'Divya Joshi','Arjun Verma','Meera Shah','Vikram Mehta','Ananya Reddy'][i % 10]
        : null,
    school:           SCHOOLS.slice(1)[i % 5],
    ip_address:       `103.${21 + (i % 5)}.${58 + (i % 3)}.${i + 1}`,
    ip_city:          ['Mumbai','Delhi','Bangalore','Pune','Chennai','Hyderabad'][i % 6],
    device:           ['Chrome/Android','Safari/iOS','Chrome/Windows','Firefox/Linux'][i % 4],
    scan_purpose:     ['EMERGENCY','REGISTRATION','UNKNOWN'][i % 3],
    response_time_ms: 80 + (i * 13) % 400,
    created_at:       new Date(Date.now() - i * 1800000).toISOString(),
}));

const STATS = {
    total:       142380,
    success:     136284,
    failed:      6096,
    avgResponse: '138ms',
    change:      +12.1,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatRelativeTime = (iso) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1)   return 'Just now';
    if (mins < 60)  return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24)   return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
};

const humanize = s => s?.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase()) || '';
const maskToken = h => h ? `${h.slice(0, 4)}••••${h.slice(-4)}` : '';

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SuperAdminScanLogsPage() {
    const [resultFilter, setResult] = useState('ALL');
    const [schoolFilter, setSchool] = useState('All Schools');
    const [search, setSearch]       = useState('');
    const [page, setPage]           = useState(1);

    const filtered = useMemo(() => MOCK_SCANS.filter(s => {
        const matchResult = resultFilter === 'ALL' || s.result === resultFilter;
        const matchSchool = schoolFilter === 'All Schools' || s.school === schoolFilter;
        const matchSearch = !search ||
            (s.student_name || '').toLowerCase().includes(search.toLowerCase()) ||
            s.school.toLowerCase().includes(search.toLowerCase()) ||
            s.ip_city.toLowerCase().includes(search.toLowerCase()) ||
            s.token_hash.toLowerCase().includes(search.toLowerCase());
        return matchResult && matchSchool && matchSearch;
    }), [resultFilter, schoolFilter, search]);

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <div className="max-w-[1400px]">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h1 className="text-[1.375rem] font-bold text-slate-900 m-0">Scan Logs</h1>
                    <p className="text-sm text-slate-500 mt-1">QR scan activity across all schools</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 shadow-sm transition-colors">
                        <Download size={15} /> Export
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 shadow-sm transition-colors">
                        <RefreshCw size={15} /> Refresh
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                    { label: 'Total Scans',    value: STATS.total.toLocaleString('en-IN'),   color: 'text-slate-900',    change: STATS.change  },
                    { label: 'Successful',     value: STATS.success.toLocaleString('en-IN'), color: 'text-emerald-600',  change: +8.3          },
                    { label: 'Failed',         value: STATS.failed.toLocaleString('en-IN'),  color: 'text-red-500',      change: -3.1          },
                    { label: 'Avg Response',   value: STATS.avgResponse,                     color: 'text-blue-600',     change: null          },
                ].map(({ label, value, color, change }) => (
                    <div key={label} className="bg-white rounded-xl border border-slate-200 shadow-sm px-5 py-4">
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">{label}</div>
                        <div className={`text-2xl font-bold ${color}`}>{value}</div>
                        {change !== null && (
                            <div className={`flex items-center gap-0.5 mt-1 text-xs font-semibold ${change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                {change >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                                {Math.abs(change)}% vs last month
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3 mb-5 space-y-3">
                {/* Result filter */}
                <div className="flex flex-wrap gap-1.5">
                    {RESULTS.map(r => (
                        <button key={r} onClick={() => { setResult(r); setPage(1); }}
                            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${resultFilter === r ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                            {r === 'ALL' ? 'All Results' : humanize(r)}
                        </button>
                    ))}
                </div>

                {/* School + Search */}
                <div className="flex flex-wrap items-center gap-3">
                    {/* School dropdown */}
                    <div className="relative">
                        <School size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select value={schoolFilter} onChange={e => { setSchool(e.target.value); setPage(1); }}
                            className="appearance-none border border-slate-200 rounded-lg pl-8 pr-8 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 bg-white cursor-pointer">
                            {SCHOOLS.map(s => <option key={s}>{s}</option>)}
                        </select>
                        <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>

                    {/* Search */}
                    <div className="relative ml-auto">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                            placeholder="Search student, school, city, token..."
                            className="pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 w-72" />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50">
                                {['Time','Result','Student','School','Token','Location','Device','Response'].map(h => (
                                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.length === 0 ? (
                                <tr><td colSpan={8} className="py-16 text-center text-slate-400">
                                    <ScanLine size={36} className="mx-auto mb-3 opacity-20" />
                                    <p className="font-medium">No scan logs found</p>
                                </td></tr>
                            ) : paginated.map((scan, i) => {
                                const s = RESULT_STYLE[scan.result] || RESULT_STYLE.ERROR;
                                return (
                                    <tr key={scan.id} className={`hover:bg-slate-50 transition-colors ${i < paginated.length - 1 ? 'border-b border-slate-100' : ''}`}>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <div className="text-sm font-medium text-slate-700">{formatRelativeTime(scan.created_at)}</div>
                                            <div className="text-xs text-slate-400">{new Date(scan.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${s.bg} ${s.color}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                                                {humanize(scan.result)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm font-medium text-slate-800">{scan.student_name || <span className="text-slate-400">Unknown</span>}</td>
                                        <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">{scan.school}</td>
                                        <td className="px-4 py-3"><code className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded">{maskToken(scan.token_hash)}</code></td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1 text-sm text-slate-600"><MapPin size={12} className="text-slate-400" />{scan.ip_city}</div>
                                            <div className="text-xs text-slate-400 font-mono">{scan.ip_address}</div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1 text-xs text-slate-500"><Monitor size={12} />{scan.device.split('/')[0]}</div>
                                            <div className="text-xs text-slate-400">{scan.device.split('/')[1]}</div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`text-xs font-mono font-bold ${scan.response_time_ms > 300 ? 'text-amber-600' : 'text-emerald-600'}`}>
                                                {scan.response_time_ms}ms
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-4 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                        <span className="text-xs text-slate-400">
                            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                        </span>
                        <div className="flex gap-1">
                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                                <button key={p} onClick={() => setPage(p)}
                                    className={`w-8 h-8 rounded-lg border text-xs font-semibold transition-colors ${p === page ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}