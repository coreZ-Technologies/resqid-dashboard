'use client';

/**
 * SCHOOL ADMIN — SCAN LOGS
 * Next.js App Router version — Notion style with violet accent
 * Path: app/(school)/school/scans/page.jsx
 */

import { useState } from 'react';
import { Search, ScanLine, CheckCircle, XCircle, Clock, MapPin, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Inline helpers (replace with actual imports later) ─────────────────────
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

function useDebounce(value) {
    return value;
}

// ─── Constants ──────────────────────────────────────────────────────────────
const RESULTS = ['ALL', 'SUCCESS', 'INVALID', 'REVOKED', 'EXPIRED', 'RATE_LIMITED', 'ERROR'];

const RESULT_STYLE = {
    SUCCESS:      { bg: 'bg-emerald-50', color: 'text-emerald-700', Icon: CheckCircle },
    INVALID:      { bg: 'bg-rose-50',   color: 'text-rose-700',   Icon: XCircle },
    REVOKED:      { bg: 'bg-rose-50',   color: 'text-rose-700',   Icon: XCircle },
    EXPIRED:      { bg: 'bg-amber-50',  color: 'text-amber-700',  Icon: Clock },
    RATE_LIMITED: { bg: 'bg-amber-50',  color: 'text-amber-700',  Icon: Clock },
    ERROR:        { bg: 'bg-rose-50',   color: 'text-rose-700',   Icon: XCircle },
};

const PAGE_SIZE = 15;

// ─── Mock Data ──────────────────────────────────────────────────────────────
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

// ─── Main Page Component ────────────────────────────────────────────────────
export default function ScanLogsPage() {
    const [resultFilter, setResultFilter] = useState('ALL');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const debouncedSearch = useDebounce(search);

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
                <h1 className="text-xl font-semibold text-gray-800 mb-1">Scan Logs</h1>
                <p className="text-xs text-gray-500">Real-time log of all QR code scan events</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {[
                    ["Today's Scans", STATS_TODAY.total,       'text-violet-600'],
                    ['Successful',    STATS_TODAY.success,     'text-emerald-600'],
                    ['Failed',        STATS_TODAY.failed,      'text-rose-500'],
                    ['Avg Response',  STATS_TODAY.avgResponse, 'text-amber-600'],
                ].map(([label, val, colorClass]) => (
                    <div key={label} className="bg-white rounded-md border border-violet-100 p-4">
                        <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                            {label}
                        </div>
                        <div className={`text-2xl font-semibold ${colorClass}`}>
                            {typeof val === 'number' ? val.toLocaleString('en-IN') : val}
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-md border border-violet-100 p-3 mb-4 flex flex-wrap gap-3 items-center">
                <div className="flex flex-wrap gap-1.5">
                    {RESULTS.map(r => (
                        <button
                            key={r}
                            onClick={() => { setResultFilter(r); setPage(1); }}
                            className={cn(
                                'px-3 py-1.5 rounded-md border text-xs font-medium transition-all',
                                resultFilter === r
                                    ? 'bg-gradient-to-r from-violet-500 to-violet-700 text-white border-transparent'
                                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                            )}
                        >
                            {r === 'ALL' ? 'All Results' : humanizeEnum(r)}
                        </button>
                    ))}
                </div>
                <div className="ml-auto relative">
                    <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1); }}
                        placeholder="Search student, city, token..."
                        className="py-1.5 pl-8 pr-3 border border-gray-200 rounded-md text-sm outline-none focus:border-violet-300 focus:ring-1 focus:ring-violet-100 w-[220px]"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-md border border-violet-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
                                {['Time', 'Result', 'Student', 'Token', 'Location', 'Device', 'Response'].map(h => (
                                    <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-16 text-center text-gray-400">
                                        <ScanLine size={32} className="mx-auto mb-3 text-gray-300" />
                                        <div className="text-sm font-medium">No scan logs found</div>
                                    </td>
                                </tr>
                            ) : (
                                paginated.map((scan, idx) => {
                                    const s = RESULT_STYLE[scan.result] || RESULT_STYLE.ERROR;
                                    const isLast = idx === paginated.length - 1;
                                    return (
                                        <tr
                                            key={scan.id}
                                            className={cn(
                                                'hover:bg-gray-50 transition-colors',
                                                !isLast && 'border-b border-gray-100'
                                            )}
                                        >
                                            {/* Time */}
                                            <td className="px-4 py-3">
                                                <div className="text-xs font-medium text-gray-800 whitespace-nowrap">
                                                    {formatRelativeTime(scan.created_at)}
                                                </div>
                                                <div className="text-[10px] text-gray-500">
                                                    {new Date(scan.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </td>

                                            {/* Result badge */}
                                            <td className="px-4 py-3">
                                                <span className={cn(
                                                    'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium border',
                                                    s.bg, s.color,
                                                    scan.result === 'SUCCESS' ? 'border-emerald-200' :
                                                    (scan.result === 'EXPIRED' || scan.result === 'RATE_LIMITED') ? 'border-amber-200' :
                                                    'border-rose-200'
                                                )}>
                                                    <s.Icon size={11} />
                                                    {humanizeEnum(scan.result)}
                                                </span>
                                            </td>

                                            {/* Student */}
                                            <td className={`px-4 py-3 text-xs ${scan.student_name ? 'font-medium text-gray-800' : 'text-gray-400'}`}>
                                                {scan.student_name || 'Unknown'}
                                            </td>

                                            {/* Token */}
                                            <td className="px-4 py-3">
                                                <code className="font-mono text-[10px] bg-gray-100 px-1.5 py-0.5 rounded">
                                                    {maskTokenHash(scan.token_hash)}
                                                </code>
                                            </td>

                                            {/* Location */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1 text-xs text-gray-600">
                                                    <MapPin size={11} className="text-gray-400" />
                                                    {scan.ip_city}
                                                </div>
                                                <div className="text-[10px] text-gray-500 font-mono">{scan.ip_address}</div>
                                            </td>

                                            {/* Device */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1 text-[10px] text-gray-500">
                                                    <Monitor size={11} />
                                                    {scan.device.split('/')[0]}
                                                </div>
                                                <div className="text-[10px] text-gray-400">{scan.device.split('/')[1]}</div>
                                            </td>

                                            {/* Response time */}
                                            <td className="px-4 py-3">
                                                <span className={`font-mono text-xs font-semibold ${scan.response_time_ms > 300 ? 'text-amber-600' : 'text-emerald-600'}`}>
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
                    <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
                        <span className="text-[10px] text-gray-500">
                            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                        </span>
                        <div className="flex gap-1">
                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={cn(
                                        'w-8 h-8 rounded-md border text-xs transition-all',
                                        p === page
                                            ? 'bg-gradient-to-r from-violet-500 to-violet-700 text-white border-transparent'
                                            : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                                    )}
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