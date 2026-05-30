'use client';

/**
 * SCHOOL ADMIN — SCAN LOGS
 * Next.js App Router version (converted from React Router)
 * Place at: app/(school)/school/scans/page.jsx
 *
 * Changes from old frontend:
 * - Added 'use client' directive (required for useState)
 * - Removed CSS variable references (var(--font-display) etc) — replaced with Tailwind
 * - Removed useDebounce import — inline fallback included (swap with @/lib/hooks)
 * - Removed formatters import — inline fallbacks included (swap with @/lib/utils)
 * - All hover effects via Tailwind classes instead of inline onMouseEnter/Leave handlers
 */

import { useState } from 'react';
import { Search, ScanLine, CheckCircle, XCircle, Clock, MapPin, Monitor } from 'lucide-react';

// ─── UPDATE THESE IMPORTS to match your new frontend ──────────────────────────
// Old: '../../utils/formatters.js'    →  New: '@/lib/utils'
// Old: '../../hooks/useDebounce.js'   →  New: '@/lib/hooks'
//
// import { formatRelativeTime, humanizeEnum, maskTokenHash } from '@/lib/utils';
// import { useDebounce } from '@/lib/hooks';

// ─── Inline fallbacks (remove once you wire up real imports above) ─────────────
const formatRelativeTime = (iso) => {
    if (!iso) return '';
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1)   return 'Just now';
    if (mins < 60)  return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24)   return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
};

const humanizeEnum = (str) =>
    str?.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase()) || '';

const maskTokenHash = (hash) =>
    hash ? `${hash.slice(0, 4)}••••${hash.slice(-4)}` : '';

function useDebounce(value, delay) {
    const [debounced, setDebounced] = useState(value);
    // Note: replace this with your real useDebounce from @/lib/hooks
    // This simplified version doesn't actually debounce — it just returns the value
    return value;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const RESULTS = ['ALL', 'SUCCESS', 'INVALID', 'REVOKED', 'EXPIRED', 'RATE_LIMITED', 'ERROR'];

const RESULT_STYLE = {
    SUCCESS:      { bg: '#ECFDF5', color: '#047857', Icon: CheckCircle },
    INVALID:      { bg: '#FEF2F2', color: '#B91C1C', Icon: XCircle },
    REVOKED:      { bg: '#FEF2F2', color: '#B91C1C', Icon: XCircle },
    EXPIRED:      { bg: '#FFFBEB', color: '#B45309', Icon: Clock },
    RATE_LIMITED: { bg: '#FEF3C7', color: '#92400E', Icon: Clock },
    ERROR:        { bg: '#FEF2F2', color: '#B91C1C', Icon: XCircle },
};

const PAGE_SIZE = 15;

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_SCANS = Array.from({ length: 40 }, (_, i) => ({
    id: `scan-${i + 1}`,
    token_hash: `B${Math.random().toString(36).slice(2, 16).toUpperCase()}`,
    result: RESULTS.slice(1)[i % 6],
    student_name: i % 8 !== 0
        ? ['Aarav Sharma', 'Priya Patel', 'Rohit Singh', 'Sneha Gupta', 'Karan Kumar',
           'Divya Joshi', 'Arjun Verma', 'Meera Shah', 'Vikram Mehta', 'Ananya Reddy'][i % 10]
        : null,
    ip_address: `103.${21 + (i % 5)}.${58 + (i % 3)}.${i + 1}`,
    ip_city: ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Chennai', 'Hyderabad'][i % 6],
    device: ['Chrome/Android', 'Safari/iOS', 'Chrome/Windows', 'Firefox/Linux'][i % 4],
    scan_purpose: ['EMERGENCY', 'REGISTRATION', 'UNKNOWN'][i % 3],
    response_time_ms: 80 + (i * 13) % 400,
    created_at: new Date(Date.now() - i * 1800000).toISOString(),
}));

const STATS_TODAY = {
    total: 312,
    success: 289,
    failed: 23,
    avgResponse: '142ms',
};

// ─── Main Page Component (default export required for Next.js App Router) ──────
export default function ScanLogsPage() {
    const [resultFilter, setResultFilter] = useState('ALL');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const debouncedSearch = useDebounce(search, 300);

    const filtered = MOCK_SCANS.filter(s => {
        const matchResult = resultFilter === 'ALL' || s.result === resultFilter;
        const matchSearch =
            !debouncedSearch ||
            (s.student_name || '').toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            s.ip_city.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            s.token_hash.toLowerCase().includes(debouncedSearch.toLowerCase());
        return matchResult && matchSearch;
    });

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <div className="max-w-[1200px]">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-[1.375rem] font-bold text-slate-900 m-0">Scan Logs</h2>
                <p className="text-sm text-slate-500 mt-1">Real-time log of all QR code scan events</p>
            </div>

            {/* Today's Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                    ["Today's Scans", STATS_TODAY.total,       'text-blue-600'],
                    ['Successful',    STATS_TODAY.success,     'text-emerald-600'],
                    ['Failed',        STATS_TODAY.failed,      'text-red-500'],
                    ['Avg Response',  STATS_TODAY.avgResponse, 'text-amber-500'],
                ].map(([label, val, colorClass]) => (
                    <div key={label} className="bg-white rounded-xl border border-slate-200 shadow-sm px-5 py-4">
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                            {label}
                        </div>
                        <div className={`text-[1.75rem] font-bold ${colorClass}`}>
                            {typeof val === 'number' ? val.toLocaleString('en-IN') : val}
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-4 flex flex-wrap gap-3 items-center">
                <div className="flex flex-wrap gap-1.5">
                    {RESULTS.map(r => (
                        <button
                            key={r}
                            onClick={() => { setResultFilter(r); setPage(1); }}
                            className={`px-3 py-1.5 rounded-lg border text-[0.8125rem] font-medium transition-colors cursor-pointer ${
                                resultFilter === r
                                    ? 'border-blue-500 bg-blue-600 text-white font-bold'
                                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            {r === 'ALL' ? 'All Results' : humanizeEnum(r)}
                        </button>
                    ))}
                </div>
                <div className="ml-auto relative">
                    <Search size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1); }}
                        placeholder="Search student, city, token..."
                        className="py-1.5 pl-8 pr-3 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 w-[220px]"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50">
                                {['Time', 'Result', 'Student', 'Token', 'Location', 'Device', 'Response'].map(h => (
                                    <th
                                        key={h}
                                        className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-16 text-center text-slate-400">
                                        <ScanLine size={36} className="mx-auto mb-3 opacity-30" />
                                        <div className="font-medium">No scan logs found</div>
                                    </td>
                                </tr>
                            ) : (
                                paginated.map((scan, idx) => {
                                    const s = RESULT_STYLE[scan.result] || RESULT_STYLE.ERROR;
                                    const isLast = idx === paginated.length - 1;
                                    return (
                                        <tr
                                            key={scan.id}
                                            className={`hover:bg-slate-50 transition-colors ${!isLast ? 'border-b border-slate-100' : ''}`}
                                        >
                                            {/* Time */}
                                            <td className="px-4 py-3">
                                                <div className="text-[0.8125rem] font-medium text-slate-800 whitespace-nowrap">
                                                    {formatRelativeTime(scan.created_at)}
                                                </div>
                                                <div className="text-xs text-slate-400">
                                                    {new Date(scan.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </td>

                                            {/* Result badge */}
                                            <td className="px-4 py-3">
                                                <span
                                                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold"
                                                    style={{ background: s.bg, color: s.color }}
                                                >
                                                    <s.Icon size={11} />
                                                    {humanizeEnum(scan.result)}
                                                </span>
                                            </td>

                                            {/* Student */}
                                            <td className={`px-4 py-3 text-sm ${scan.student_name ? 'font-medium text-slate-800' : 'text-slate-400'}`}>
                                                {scan.student_name || 'Unknown'}
                                            </td>

                                            {/* Token */}
                                            <td className="px-4 py-3">
                                                <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">
                                                    {maskTokenHash(scan.token_hash)}
                                                </code>
                                            </td>

                                            {/* Location */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1 text-[0.8125rem] text-slate-600">
                                                    <MapPin size={12} className="text-slate-400" />
                                                    {scan.ip_city}
                                                </div>
                                                <div className="text-xs text-slate-400 font-mono">{scan.ip_address}</div>
                                            </td>

                                            {/* Device */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1 text-xs text-slate-500">
                                                    <Monitor size={12} />
                                                    {scan.device.split('/')[0]}
                                                </div>
                                                <div className="text-xs text-slate-400">{scan.device.split('/')[1]}</div>
                                            </td>

                                            {/* Response time */}
                                            <td className="px-4 py-3">
                                                <span className={`font-mono text-[0.8125rem] font-semibold ${scan.response_time_ms > 300 ? 'text-amber-600' : 'text-emerald-600'}`}>
                                                    {scan.response_time_ms}ms
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-4 py-3.5 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[0.8125rem] text-slate-400">
                            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                        </span>
                        <div className="flex gap-1">
                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`w-8 h-8 rounded-lg border text-[0.8125rem] cursor-pointer transition-colors ${
                                        p === page
                                            ? 'border-blue-500 bg-blue-600 text-white font-bold'
                                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                                    }`}
                                >
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