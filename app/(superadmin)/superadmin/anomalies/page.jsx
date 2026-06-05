'use client';

/**
 * SUPER ADMIN — ANOMALIES
 * Place at: app/(superadmin)/superadmin/anomalies/page.jsx
 */

import { useState, useMemo } from 'react';
import {
    AlertTriangle, Search, CheckCircle, XCircle,
    Shield, Eye, Clock, ChevronDown, RefreshCw,
    Download, MapPin, Monitor, School, Zap,
    ArrowUpRight, ArrowDownRight, X, Check,
    Loader2, AlertCircle, Ban, Activity
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────
const SEVERITIES = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
const STATUSES   = ['ALL', 'OPEN', 'INVESTIGATING', 'RESOLVED', 'DISMISSED'];
const TYPES      = ['ALL', 'RAPID_SCAN', 'SUSPICIOUS_IP', 'BOT_DETECTED', 'RATE_LIMIT_BREACH', 'UNUSUAL_LOCATION', 'INVALID_TOKEN_BURST'];

const SEVERITY_STYLE = {
    CRITICAL: { bg: 'bg-red-50',    color: 'text-red-700',    border: 'border-red-200',    dot: 'bg-red-500',    label: 'Critical' },
    HIGH:     { bg: 'bg-orange-50', color: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500', label: 'High'     },
    MEDIUM:   { bg: 'bg-amber-50',  color: 'text-amber-700',  border: 'border-amber-200',  dot: 'bg-amber-400',  label: 'Medium'   },
    LOW:      { bg: 'bg-blue-50',   color: 'text-blue-700',   border: 'border-blue-200',   dot: 'bg-blue-400',   label: 'Low'      },
};

const STATUS_STYLE = {
    OPEN:          { bg: 'bg-red-50',     color: 'text-red-700',    dot: 'bg-red-500'    },
    INVESTIGATING: { bg: 'bg-amber-50',   color: 'text-amber-700',  dot: 'bg-amber-400'  },
    RESOLVED:      { bg: 'bg-emerald-50', color: 'text-emerald-700',dot: 'bg-emerald-500'},
    DISMISSED:     { bg: 'bg-slate-100',  color: 'text-slate-500',  dot: 'bg-slate-400'  },
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_ANOMALIES = [
    { id: 'a1',  type: 'RAPID_SCAN',           severity: 'CRITICAL', status: 'OPEN',          school: 'Green Valley School',       ip: '103.21.58.14', city: 'Mumbai',    scanCount: 47,  description: '47 scans in 10 seconds from single IP',           createdAt: new Date(Date.now() - 5 * 60000).toISOString()   },
    { id: 'a2',  type: 'BOT_DETECTED',          severity: 'HIGH',     status: 'INVESTIGATING', school: 'Springdale Public School',  ip: '45.33.22.11',  city: 'Delhi',     scanCount: 120, description: 'Automated bot pattern detected — python-requests UA', createdAt: new Date(Date.now() - 15 * 60000).toISOString()  },
    { id: 'a3',  type: 'INVALID_TOKEN_BURST',   severity: 'HIGH',     status: 'OPEN',          school: 'Riverside Academy',         ip: '182.75.44.9',  city: 'Bangalore', scanCount: 23,  description: '23 invalid token scans in 2 minutes',             createdAt: new Date(Date.now() - 30 * 60000).toISOString()  },
    { id: 'a4',  type: 'UNUSUAL_LOCATION',      severity: 'MEDIUM',   status: 'OPEN',          school: 'Delhi Public School',       ip: '92.14.55.1',   city: 'London',    scanCount: 3,   description: 'Scans from unusual location (UK) for Indian school', createdAt: new Date(Date.now() - 45 * 60000).toISOString()  },
    { id: 'a5',  type: 'RATE_LIMIT_BREACH',     severity: 'MEDIUM',   status: 'RESOLVED',      school: 'St. Mary\'s Convent',       ip: '103.99.12.5',  city: 'Pune',      scanCount: 31,  description: 'Rate limit exceeded 3x in 1 hour',                createdAt: new Date(Date.now() - 2 * 3600000).toISOString() },
    { id: 'a6',  type: 'SUSPICIOUS_IP',         severity: 'HIGH',     status: 'RESOLVED',      school: 'Green Valley School',       ip: '185.220.101.4',city: 'Frankfurt', scanCount: 8,   description: 'IP flagged in threat intelligence database',      createdAt: new Date(Date.now() - 3 * 3600000).toISOString() },
    { id: 'a7',  type: 'RAPID_SCAN',            severity: 'MEDIUM',   status: 'DISMISSED',     school: 'Riverside Academy',         ip: '103.21.58.20', city: 'Chennai',   scanCount: 12,  description: '12 scans in 30 seconds — likely testing',         createdAt: new Date(Date.now() - 5 * 3600000).toISOString() },
    { id: 'a8',  type: 'BOT_DETECTED',          severity: 'LOW',      status: 'DISMISSED',     school: 'Delhi Public School',       ip: '66.249.79.1',  city: 'Mountain View', scanCount: 2, description: 'Googlebot scan detected and blocked',          createdAt: new Date(Date.now() - 8 * 3600000).toISOString() },
    { id: 'a9',  type: 'INVALID_TOKEN_BURST',   severity: 'CRITICAL', status: 'INVESTIGATING', school: 'St. Mary\'s Convent',       ip: '103.77.11.9',  city: 'Hyderabad', scanCount: 58,  description: '58 invalid token attempts — possible brute force',createdAt: new Date(Date.now() - 1 * 3600000).toISOString() },
    { id: 'a10', type: 'UNUSUAL_LOCATION',      severity: 'LOW',      status: 'RESOLVED',      school: 'Springdale Public School',  ip: '203.88.10.3',  city: 'Singapore', scanCount: 1,   description: 'Single scan from Singapore — likely VPN',         createdAt: new Date(Date.now() - 12 * 3600000).toISOString()},
];

const PAGE_SIZE = 10;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatRelativeTime = (iso) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1)  return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24)  return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
};
const humanize = s => s?.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase()) || '';

// ─── Detail Drawer ────────────────────────────────────────────────────────────
const AnomalyDrawer = ({ anomaly, onClose, onStatusChange }) => {
    const [loading, setLoading] = useState(null);
    const sev = SEVERITY_STYLE[anomaly.severity];
    const st  = STATUS_STYLE[anomaly.status];

    const handleAction = async (newStatus) => {
        setLoading(newStatus);
        await new Promise(r => setTimeout(r, 700));
        onStatusChange(anomaly.id, newStatus);
        setLoading(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end" onClick={onClose}>
            <div className="w-full max-w-md bg-white h-full shadow-2xl overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                    <div className="flex items-center gap-2">
                        <AlertTriangle size={18} className="text-red-500" />
                        <h3 className="font-bold text-slate-900">Anomaly Detail</h3>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    {/* Severity + Status */}
                    <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${sev.bg} ${sev.color} ${sev.border}`}>
                            {sev.label}
                        </span>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${st.bg} ${st.color}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />{anomaly.status}
                        </span>
                    </div>

                    {/* Type + Description */}
                    <div className="bg-slate-50 rounded-xl p-4">
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">{humanize(anomaly.type)}</div>
                        <p className="text-sm text-slate-800 font-medium">{anomaly.description}</p>
                    </div>

                    {/* Details grid */}
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: 'School',     value: anomaly.school    },
                            { label: 'Scan Count', value: `${anomaly.scanCount} scans` },
                            { label: 'IP Address', value: anomaly.ip        },
                            { label: 'Location',   value: anomaly.city      },
                            { label: 'Detected',   value: formatRelativeTime(anomaly.createdAt) },
                            { label: 'Time',       value: new Date(anomaly.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) },
                        ].map(({ label, value }) => (
                            <div key={label} className="bg-slate-50 rounded-lg p-3">
                                <div className="text-xs text-slate-400 mb-0.5">{label}</div>
                                <div className="text-sm font-semibold text-slate-800">{value}</div>
                            </div>
                        ))}
                    </div>

                    {/* Actions */}
                    {anomaly.status !== 'RESOLVED' && anomaly.status !== 'DISMISSED' && (
                        <div className="space-y-2 pt-2">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</p>
                            <div className="grid grid-cols-2 gap-2">
                                {anomaly.status !== 'INVESTIGATING' && (
                                    <button onClick={() => handleAction('INVESTIGATING')} disabled={!!loading}
                                        className="py-2.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-amber-100 transition-colors disabled:opacity-50">
                                        {loading === 'INVESTIGATING' ? <Loader2 size={14} className="animate-spin" /> : <Eye size={14} />}
                                        Investigate
                                    </button>
                                )}
                                <button onClick={() => handleAction('RESOLVED')} disabled={!!loading}
                                    className="py-2.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-emerald-100 transition-colors disabled:opacity-50">
                                    {loading === 'RESOLVED' ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                                    Resolve
                                </button>
                                <button onClick={() => handleAction('DISMISSED')} disabled={!!loading}
                                    className="py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors disabled:opacity-50 col-span-2">
                                    {loading === 'DISMISSED' ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SuperAdminAnomaliesPage() {
    const [severityFilter, setSeverity] = useState('ALL');
    const [statusFilter, setStatus]     = useState('ALL');
    const [typeFilter, setType]         = useState('ALL');
    const [search, setSearch]           = useState('');
    const [page, setPage]               = useState(1);
    const [selected, setSelected]       = useState(null);
    const [anomalies, setAnomalies]     = useState(MOCK_ANOMALIES);

    const filtered = useMemo(() => anomalies.filter(a => {
        const matchSev    = severityFilter === 'ALL' || a.severity === severityFilter;
        const matchStatus = statusFilter   === 'ALL' || a.status   === statusFilter;
        const matchType   = typeFilter     === 'ALL' || a.type     === typeFilter;
        const matchSearch = !search ||
            a.description.toLowerCase().includes(search.toLowerCase()) ||
            a.school.toLowerCase().includes(search.toLowerCase()) ||
            a.ip.includes(search) ||
            a.city.toLowerCase().includes(search.toLowerCase());
        return matchSev && matchStatus && matchType && matchSearch;
    }), [anomalies, severityFilter, statusFilter, typeFilter, search]);

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleStatusChange = (id, newStatus) => {
        setAnomalies(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    };

    const stats = {
        total:       anomalies.length,
        open:        anomalies.filter(a => a.status === 'OPEN').length,
        critical:    anomalies.filter(a => a.severity === 'CRITICAL').length,
        resolved:    anomalies.filter(a => a.status === 'RESOLVED').length,
    };

    return (
        <div className="max-w-[1400px]">
            {selected && (
                <AnomalyDrawer
                    anomaly={selected}
                    onClose={() => setSelected(null)}
                    onStatusChange={handleStatusChange}
                />
            )}

            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h1 className="text-[1.375rem] font-bold text-slate-900 m-0">Anomalies</h1>
                    <p className="text-sm text-slate-500 mt-1">Security alerts across all schools</p>
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
                    { label: 'Total Anomalies', value: stats.total,    color: 'text-slate-900',   bg: 'bg-slate-500'    },
                    { label: 'Open',            value: stats.open,     color: 'text-red-600',     bg: 'bg-red-500'      },
                    { label: 'Critical',        value: stats.critical, color: 'text-orange-600',  bg: 'bg-orange-500'   },
                    { label: 'Resolved',        value: stats.resolved, color: 'text-emerald-600', bg: 'bg-emerald-500'  },
                ].map(({ label, value, color, bg }) => (
                    <div key={label} className="bg-white rounded-xl border border-slate-200 shadow-sm px-5 py-4 flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                            <AlertTriangle size={18} className="text-white" />
                        </div>
                        <div>
                            <div className={`text-2xl font-bold ${color}`}>{value}</div>
                            <div className="text-xs text-slate-500">{label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3 mb-5 space-y-3">
                {/* Severity */}
                <div className="flex flex-wrap gap-1.5">
                    {SEVERITIES.map(s => (
                        <button key={s} onClick={() => { setSeverity(s); setPage(1); }}
                            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${severityFilter === s
                                ? s === 'CRITICAL' ? 'bg-red-600 border-red-600 text-white'
                                : s === 'HIGH'     ? 'bg-orange-500 border-orange-500 text-white'
                                : s === 'MEDIUM'   ? 'bg-amber-500 border-amber-500 text-white'
                                : s === 'LOW'      ? 'bg-blue-600 border-blue-600 text-white'
                                : 'bg-slate-800 border-slate-800 text-white'
                                : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                            {s === 'ALL' ? 'All Severities' : s}
                        </button>
                    ))}
                </div>

                {/* Status + Type + Search */}
                <div className="flex flex-wrap items-center gap-2">
                    {STATUSES.map(s => (
                        <button key={s} onClick={() => { setStatus(s); setPage(1); }}
                            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${statusFilter === s ? 'bg-slate-800 border-slate-800 text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                            {s === 'ALL' ? 'All Statuses' : humanize(s)}
                        </button>
                    ))}
                    <div className="relative ml-auto">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                            placeholder="Search description, school, IP..."
                            className="pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 w-64" />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50">
                                {['Detected','Severity','Type','Description','School','IP / Location','Scans','Status',''].map(h => (
                                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.length === 0 ? (
                                <tr><td colSpan={9} className="py-16 text-center text-slate-400">
                                    <Shield size={36} className="mx-auto mb-3 opacity-20" />
                                    <p className="font-medium">No anomalies found</p>
                                </td></tr>
                            ) : paginated.map((a, i) => {
                                const sev = SEVERITY_STYLE[a.severity];
                                const st  = STATUS_STYLE[a.status];
                                return (
                                    <tr key={a.id} className={`hover:bg-slate-50 transition-colors cursor-pointer ${i < paginated.length - 1 ? 'border-b border-slate-100' : ''}`}
                                        onClick={() => setSelected(a)}>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <div className="text-sm font-medium text-slate-700">{formatRelativeTime(a.createdAt)}</div>
                                            <div className="text-xs text-slate-400">{new Date(a.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${sev.bg} ${sev.color} ${sev.border}`}>
                                                {sev.label}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-xs font-medium text-slate-600 whitespace-nowrap">{humanize(a.type)}</td>
                                        <td className="px-4 py-3 max-w-[220px]">
                                            <p className="text-sm text-slate-700 truncate">{a.description}</p>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">{a.school}</td>
                                        <td className="px-4 py-3">
                                            <div className="text-xs font-mono text-slate-600">{a.ip}</div>
                                            <div className="flex items-center gap-1 text-xs text-slate-400"><MapPin size={10} />{a.city}</div>
                                        </td>
                                        <td className="px-4 py-3 text-sm font-bold text-slate-800">{a.scanCount}</td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${st.bg} ${st.color}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />{humanize(a.status)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                                                <Eye size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

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