'use client';

/**
 * SUPER ADMIN — AUDIT LOGS
 * Place at: app/(superadmin)/superadmin/audit-logs/page.jsx
 */

import { useState, useMemo } from 'react';
import {
    ClipboardList, Search, Download, RefreshCw,
    ChevronDown, User, School, Shield, Settings,
    Plus, Edit2, Trash2, LogIn, LogOut, Key,
    AlertTriangle, CheckCircle, Eye, ArrowUpRight,
    ArrowDownRight, Calendar, Filter, X
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────
const ACTORS    = ['ALL', 'Super Admin', 'School Admin', 'System'];
const ACTIONS   = ['ALL', 'CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'EXPORT', 'SUSPEND', 'RESTORE'];
const RESOURCES = ['ALL', 'School', 'Student', 'User', 'Subscription', 'Token', 'Anomaly', 'Settings', 'Report'];
const PAGE_SIZE = 15;

const ACTION_STYLE = {
    CREATE:  { bg: 'bg-emerald-50', color: 'text-emerald-700', Icon: Plus     },
    UPDATE:  { bg: 'bg-blue-50',    color: 'text-blue-700',    Icon: Edit2    },
    DELETE:  { bg: 'bg-red-50',     color: 'text-red-700',     Icon: Trash2   },
    LOGIN:   { bg: 'bg-violet-50',  color: 'text-violet-700',  Icon: LogIn    },
    LOGOUT:  { bg: 'bg-slate-100',  color: 'text-slate-600',   Icon: LogOut   },
    EXPORT:  { bg: 'bg-amber-50',   color: 'text-amber-700',   Icon: Download },
    SUSPEND: { bg: 'bg-orange-50',  color: 'text-orange-700',  Icon: AlertTriangle },
    RESTORE: { bg: 'bg-teal-50',    color: 'text-teal-700',    Icon: CheckCircle   },
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_LOGS = [
    { id: 'al1',  actor: 'Arjun Das',      actorRole: 'Super Admin', actorAvatar: 'AD', action: 'CREATE',  resource: 'School',       target: 'Green Valley School',         detail: 'Created new school with Pro plan',           ip: '103.21.58.1',  createdAt: new Date(Date.now() - 10 * 60000).toISOString()  },
    { id: 'al2',  actor: 'Priya Sharma',   actorRole: 'Super Admin', actorAvatar: 'PS', action: 'UPDATE',  resource: 'Subscription',  target: 'Riverside Academy',           detail: 'Upgraded plan from Basic to Enterprise',     ip: '103.21.58.2',  createdAt: new Date(Date.now() - 25 * 60000).toISOString()  },
    { id: 'al3',  actor: 'System',         actorRole: 'System',      actorAvatar: 'SY', action: 'RESTORE', resource: 'Anomaly',       target: 'Alert #A-2024-892',           detail: 'Alert auto-resolved by system',              ip: 'internal',     createdAt: new Date(Date.now() - 45 * 60000).toISOString()  },
    { id: 'al4',  actor: 'Raj Patel',      actorRole: 'Super Admin', actorAvatar: 'RP', action: 'EXPORT',  resource: 'Report',        target: 'Monthly Attendance - May',    detail: 'Exported monthly attendance report',         ip: '103.21.58.3',  createdAt: new Date(Date.now() - 4 * 3600000).toISOString() },
    { id: 'al5',  actor: 'Sneha Biswas',   actorRole: 'Super Admin', actorAvatar: 'SB', action: 'CREATE',  resource: 'User',          target: 'Sarah Williams',              detail: 'Added new admin user (sarah@corez.in)',      ip: '103.21.58.4',  createdAt: new Date(Date.now() - 2 * 3600000).toISOString() },
    { id: 'al6',  actor: 'Arjun Das',      actorRole: 'Super Admin', actorAvatar: 'AD', action: 'SUSPEND', resource: 'School',        target: 'Sunrise Institute',           detail: 'Suspended school — overdue payment 60d',     ip: '103.21.58.1',  createdAt: new Date(Date.now() - 6 * 3600000).toISOString() },
    { id: 'al7',  actor: 'Priya Sharma',   actorRole: 'Super Admin', actorAvatar: 'PS', action: 'DELETE',  resource: 'Token',         target: 'TOK-2024-8821',               detail: 'Force-revoked compromised token',            ip: '103.21.58.2',  createdAt: new Date(Date.now() - 8 * 3600000).toISOString() },
    { id: 'al8',  actor: 'System',         actorRole: 'System',      actorAvatar: 'SY', action: 'CREATE',  resource: 'Report',        target: 'Weekly Scan Summary',         detail: 'Auto-generated weekly scan report',          ip: 'internal',     createdAt: new Date(Date.now() - 24 * 3600000).toISOString()},
    { id: 'al9',  actor: 'Raj Patel',      actorRole: 'Super Admin', actorAvatar: 'RP', action: 'UPDATE',  resource: 'Settings',      target: 'Platform Config',             detail: 'Updated scan rate limit: 20 → 30/min',       ip: '103.21.58.3',  createdAt: new Date(Date.now() - 28 * 3600000).toISOString()},
    { id: 'al10', actor: 'Animesh Karan',  actorRole: 'School Admin',actorAvatar: 'AK', action: 'LOGIN',   resource: 'User',          target: 'Springdale Public School',    detail: 'Admin login from new device',                ip: '182.75.44.9',  createdAt: new Date(Date.now() - 30 * 3600000).toISOString()},
    { id: 'al11', actor: 'Sneha Biswas',   actorRole: 'Super Admin', actorAvatar: 'SB', action: 'UPDATE',  resource: 'School',        target: 'Delhi Public School',         detail: 'Updated school RFID device limit: 2 → 5',    ip: '103.21.58.4',  createdAt: new Date(Date.now() - 32 * 3600000).toISOString()},
    { id: 'al12', actor: 'Arjun Das',      actorRole: 'Super Admin', actorAvatar: 'AD', action: 'RESTORE', resource: 'School',        target: 'Sunrise Institute',           detail: 'Restored school after payment received',     ip: '103.21.58.1',  createdAt: new Date(Date.now() - 48 * 3600000).toISOString()},
    { id: 'al13', actor: 'System',         actorRole: 'System',      actorAvatar: 'SY', action: 'DELETE',  resource: 'Token',         target: '47 expired tokens',           detail: 'Batch cleanup of expired QR tokens',         ip: 'internal',     createdAt: new Date(Date.now() - 50 * 3600000).toISOString()},
    { id: 'al14', actor: 'Priya Sharma',   actorRole: 'Super Admin', actorAvatar: 'PS', action: 'CREATE',  resource: 'Subscription',  target: 'Green Valley School',         detail: 'Assigned Enterprise plan — annual billing',  ip: '103.21.58.2',  createdAt: new Date(Date.now() - 52 * 3600000).toISOString()},
    { id: 'al15', actor: 'Raj Patel',      actorRole: 'Super Admin', actorAvatar: 'RP', action: 'EXPORT',  resource: 'Report',        target: 'Platform Scan Analytics',     detail: 'Exported platform-wide scan analytics CSV',  ip: '103.21.58.3',  createdAt: new Date(Date.now() - 56 * 3600000).toISOString()},
    { id: 'al16', actor: 'Animesh Karan',  actorRole: 'School Admin',actorAvatar: 'AK', action: 'LOGOUT',  resource: 'User',          target: 'Springdale Public School',    detail: 'Admin session ended',                        ip: '182.75.44.9',  createdAt: new Date(Date.now() - 58 * 3600000).toISOString()},
    { id: 'al17', actor: 'System',         actorRole: 'System',      actorAvatar: 'SY', action: 'UPDATE',  resource: 'Anomaly',       target: 'Alert #A-2024-901',           detail: 'Anomaly escalated — no admin action for 2h', ip: 'internal',     createdAt: new Date(Date.now() - 60 * 3600000).toISOString()},
    { id: 'al18', actor: 'Sneha Biswas',   actorRole: 'Super Admin', actorAvatar: 'SB', action: 'DELETE',  resource: 'User',          target: 'test@corez.in',               detail: 'Removed test admin account',                 ip: '103.21.58.4',  createdAt: new Date(Date.now() - 72 * 3600000).toISOString()},
];

const AVATAR_COLORS = {
    'AD': 'bg-blue-500', 'PS': 'bg-violet-500', 'RP': 'bg-amber-500',
    'SB': 'bg-emerald-500', 'AK': 'bg-rose-500', 'SY': 'bg-slate-400',
};

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

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SuperAdminAuditLogsPage() {
    const [actorFilter, setActor]     = useState('ALL');
    const [actionFilter, setAction]   = useState('ALL');
    const [resourceFilter, setResource] = useState('ALL');
    const [search, setSearch]         = useState('');
    const [dateRange, setDateRange]   = useState('All Time');
    const [page, setPage]             = useState(1);

    const filtered = useMemo(() => MOCK_LOGS.filter(l => {
        const matchActor    = actorFilter    === 'ALL' || l.actorRole === actorFilter;
        const matchAction   = actionFilter   === 'ALL' || l.action    === actionFilter;
        const matchResource = resourceFilter === 'ALL' || l.resource  === resourceFilter;
        const matchSearch   = !search ||
            l.actor.toLowerCase().includes(search.toLowerCase()) ||
            l.target.toLowerCase().includes(search.toLowerCase()) ||
            l.detail.toLowerCase().includes(search.toLowerCase()) ||
            l.resource.toLowerCase().includes(search.toLowerCase());
        return matchActor && matchAction && matchResource && matchSearch;
    }), [MOCK_LOGS, actorFilter, actionFilter, resourceFilter, search]);

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const stats = {
        total:   MOCK_LOGS.length,
        today:   MOCK_LOGS.filter(l => Date.now() - new Date(l.createdAt) < 86400000).length,
        creates: MOCK_LOGS.filter(l => l.action === 'CREATE').length,
        deletes: MOCK_LOGS.filter(l => l.action === 'DELETE').length,
    };

    return (
        <div className="max-w-[1400px]">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h1 className="text-[1.375rem] font-bold text-slate-900 m-0">Audit Logs</h1>
                    <p className="text-sm text-slate-500 mt-1">Admin action history across the platform</p>
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
                    { label: 'Total Logs',    value: stats.total,   color: 'text-slate-900',   bg: 'bg-slate-600',    icon: <ClipboardList size={18} className="text-white" /> },
                    { label: 'Today',         value: stats.today,   color: 'text-blue-600',    bg: 'bg-blue-500',     icon: <Calendar size={18} className="text-white" />      },
                    { label: 'Creates',       value: stats.creates, color: 'text-emerald-600', bg: 'bg-emerald-500',  icon: <Plus size={18} className="text-white" />           },
                    { label: 'Deletes',       value: stats.deletes, color: 'text-red-600',     bg: 'bg-red-500',      icon: <Trash2 size={18} className="text-white" />         },
                ].map(({ label, value, color, bg, icon }) => (
                    <div key={label} className="bg-white rounded-xl border border-slate-200 shadow-sm px-5 py-4 flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}>{icon}</div>
                        <div>
                            <div className={`text-2xl font-bold ${color}`}>{value}</div>
                            <div className="text-xs text-slate-500">{label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3 mb-5 space-y-3">
                {/* Actor filter */}
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-slate-400 mr-1">Actor</span>
                    {ACTORS.map(a => (
                        <button key={a} onClick={() => { setActor(a); setPage(1); }}
                            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${actorFilter === a ? 'bg-blue-600 border-blue-600 text-white font-semibold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                            {a === 'ALL' ? 'All Actors' : a}
                        </button>
                    ))}
                </div>

                {/* Action filter */}
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-slate-400 mr-1">Action</span>
                    {ACTIONS.map(a => (
                        <button key={a} onClick={() => { setAction(a); setPage(1); }}
                            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${actionFilter === a ? 'bg-slate-800 border-slate-800 text-white font-semibold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                            {a === 'ALL' ? 'All Actions' : a}
                        </button>
                    ))}
                </div>

                {/* Resource + Search */}
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-slate-400 mr-1">Resource</span>
                    <div className="relative">
                        <select value={resourceFilter} onChange={e => { setResource(e.target.value); setPage(1); }}
                            className="appearance-none border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-sm text-slate-700 outline-none focus:border-blue-500 bg-white cursor-pointer">
                            {RESOURCES.map(r => <option key={r} value={r}>{r === 'ALL' ? 'All Resources' : r}</option>)}
                        </select>
                        <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                    <div className="relative ml-auto">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                            placeholder="Search actor, target, detail..."
                            className="pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 w-64" />
                    </div>
                </div>
            </div>

            {/* Result count */}
            <p className="text-sm text-slate-500 mb-4">
                Showing <span className="font-semibold text-slate-700">{filtered.length}</span> log{filtered.length !== 1 ? 's' : ''}
            </p>

            {/* Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50">
                                {['Time','Actor','Action','Resource','Target','Detail','IP'].map(h => (
                                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.length === 0 ? (
                                <tr><td colSpan={7} className="py-16 text-center text-slate-400">
                                    <ClipboardList size={36} className="mx-auto mb-3 opacity-20" />
                                    <p className="font-medium">No audit logs found</p>
                                </td></tr>
                            ) : paginated.map((log, i) => {
                                const act = ACTION_STYLE[log.action] || ACTION_STYLE.UPDATE;
                                const ActionIcon = act.Icon;
                                const avatarColor = AVATAR_COLORS[log.actorAvatar] || 'bg-slate-400';
                                return (
                                    <tr key={log.id} className={`hover:bg-slate-50 transition-colors ${i < paginated.length - 1 ? 'border-b border-slate-100' : ''}`}>
                                        {/* Time */}
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <div className="text-sm font-medium text-slate-700">{formatRelativeTime(log.createdAt)}</div>
                                            <div className="text-xs text-slate-400">
                                                {new Date(log.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                            </div>
                                        </td>

                                        {/* Actor */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-7 h-7 rounded-full ${avatarColor} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                                                    {log.actorAvatar}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-slate-800 whitespace-nowrap">{log.actor}</div>
                                                    <div className="text-xs text-slate-400">{log.actorRole}</div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Action */}
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${act.bg} ${act.color}`}>
                                                <ActionIcon size={11} /> {log.action}
                                            </span>
                                        </td>

                                        {/* Resource */}
                                        <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">{log.resource}</td>

                                        {/* Target */}
                                        <td className="px-4 py-3 max-w-[160px]">
                                            <p className="text-sm font-medium text-slate-800 truncate">{log.target}</p>
                                        </td>

                                        {/* Detail */}
                                        <td className="px-4 py-3 max-w-[240px]">
                                            <p className="text-sm text-slate-500 truncate">{log.detail}</p>
                                        </td>

                                        {/* IP */}
                                        <td className="px-4 py-3 text-xs font-mono text-slate-400 whitespace-nowrap">{log.ip}</td>
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