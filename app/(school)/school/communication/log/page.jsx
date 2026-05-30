'use client';

/**
 * SCHOOL ADMIN — DELIVERY LOG
 * Place at: app/(school)/school/delivery-log/page.jsx
 */

import { useState, useMemo } from 'react';
import {
    Truck, Search, CheckCircle, XCircle, Clock,
    AlertTriangle, ChevronDown, RefreshCw,
    Bell, MessageSquare, Mail, Smartphone,
    ArrowUpRight, ArrowDownRight, Filter,
    Eye, RotateCcw, Loader2
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────
const CHANNELS = ['All', 'SMS', 'Email', 'Push', 'WhatsApp'];
const STATUSES = ['All', 'Delivered', 'Failed', 'Pending', 'Bounced'];
const TYPES    = ['All', 'Announcement', 'Attendance', 'Fee Reminder', 'Emergency', 'General'];

const STATUS_STYLE = {
    Delivered:  { bg: 'bg-emerald-50', color: 'text-emerald-700', dot: 'bg-emerald-500', Icon: CheckCircle  },
    Failed:     { bg: 'bg-red-50',     color: 'text-red-700',     dot: 'bg-red-500',     Icon: XCircle      },
    Pending:    { bg: 'bg-amber-50',   color: 'text-amber-700',   dot: 'bg-amber-400',   Icon: Clock        },
    Bounced:    { bg: 'bg-orange-50',  color: 'text-orange-700',  dot: 'bg-orange-500',  Icon: AlertTriangle},
};

const CHANNEL_STYLE = {
    SMS:       { bg: 'bg-blue-50',    color: 'text-blue-700',   icon: <Smartphone size={12} /> },
    Email:     { bg: 'bg-violet-50',  color: 'text-violet-700', icon: <Mail size={12} />       },
    Push:      { bg: 'bg-slate-100',  color: 'text-slate-600',  icon: <Bell size={12} />       },
    WhatsApp:  { bg: 'bg-emerald-50', color: 'text-emerald-700',icon: <MessageSquare size={12} /> },
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_LOGS = Array.from({ length: 40 }, (_, i) => {
    const statuses  = ['Delivered','Delivered','Delivered','Failed','Pending','Bounced'];
    const channels  = ['SMS','Email','Push','WhatsApp'];
    const types     = ['Announcement','Attendance','Fee Reminder','Emergency','General'];
    const names     = ['Mrs. Priya Sharma','Mr. Rohit Verma','Mrs. Ananya Reddy','Mr. Vikram Singh','Mrs. Meera Pillai','Mr. Suresh Nair','Mrs. Kavita Joshi','Mr. Arjun Das'];
    const msgs      = [
        'Annual Sports Day – 10th June 2026',
        'Attendance Alert: Aarav was absent today',
        'Fee payment due by 5th June',
        'Emergency: School closed tomorrow',
        'PTM scheduled for 15th June',
        'Exam schedule has been released',
    ];
    return {
        id:        `log-${i + 1}`,
        recipient: names[i % names.length],
        phone:     `+91 98${(10 + i) % 90}${String(i).padStart(7, '0').slice(0, 7)}`,
        channel:   channels[i % channels.length],
        type:      types[i % types.length],
        message:   msgs[i % msgs.length],
        status:    statuses[i % statuses.length],
        sentAt:    new Date(Date.now() - i * 900000).toISOString(),
        deliveredAt: statuses[i % statuses.length] === 'Delivered'
            ? new Date(Date.now() - i * 900000 + 15000 + Math.random() * 30000).toISOString()
            : null,
        retries:   statuses[i % statuses.length] === 'Failed' ? Math.floor(Math.random() * 3) + 1 : 0,
    };
});

const PAGE_SIZE = 15;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatTime = (iso) => {
    if (!iso) return '—';
    const d = new Date(iso);
    const diff = Date.now() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1)  return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24)  return `${hrs}h ago`;
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

const formatMs = (sentIso, deliveredIso) => {
    if (!sentIso || !deliveredIso) return null;
    const ms = new Date(deliveredIso) - new Date(sentIso);
    return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DeliveryLogPage() {
    const [channelFilter, setChannel] = useState('All');
    const [statusFilter, setStatus]   = useState('All');
    const [typeFilter, setType]       = useState('All');
    const [search, setSearch]         = useState('');
    const [page, setPage]             = useState(1);
    const [retrying, setRetrying]     = useState(null);

    const filtered = useMemo(() => MOCK_LOGS.filter(l => {
        const matchChannel = channelFilter === 'All' || l.channel === channelFilter;
        const matchStatus  = statusFilter  === 'All' || l.status  === statusFilter;
        const matchType    = typeFilter    === 'All' || l.type    === typeFilter;
        const matchSearch  = !search ||
            l.recipient.toLowerCase().includes(search.toLowerCase()) ||
            l.message.toLowerCase().includes(search.toLowerCase()) ||
            l.phone.includes(search);
        return matchChannel && matchStatus && matchType && matchSearch;
    }), [channelFilter, statusFilter, typeFilter, search]);

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleRetry = async (id) => {
        setRetrying(id);
        await new Promise(r => setTimeout(r, 1000));
        setRetrying(null);
    };

    const stats = {
        total:     MOCK_LOGS.length,
        delivered: MOCK_LOGS.filter(l => l.status === 'Delivered').length,
        failed:    MOCK_LOGS.filter(l => l.status === 'Failed').length,
        pending:   MOCK_LOGS.filter(l => l.status === 'Pending').length,
        rate:      Math.round((MOCK_LOGS.filter(l => l.status === 'Delivered').length / MOCK_LOGS.length) * 100),
    };

    return (
        <div className="max-w-[1300px]">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h1 className="text-[1.375rem] font-bold text-slate-900 m-0">Delivery Log</h1>
                    <p className="text-sm text-slate-500 mt-1">Track notification delivery across all channels</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 shadow-sm transition-colors">
                    <RefreshCw size={15} /> Refresh
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                    { label: 'Total Sent',    value: stats.total,     icon: <Truck size={20} className="text-white" />,        bg: 'bg-blue-500'    },
                    { label: 'Delivered',     value: stats.delivered, icon: <CheckCircle size={20} className="text-white" />,  bg: 'bg-emerald-500' },
                    { label: 'Failed',        value: stats.failed,    icon: <XCircle size={20} className="text-white" />,      bg: 'bg-red-500'     },
                    { label: 'Delivery Rate', value: `${stats.rate}%`,icon: <ArrowUpRight size={20} className="text-white" />, bg: 'bg-violet-500'  },
                ].map(({ label, value, icon, bg }) => (
                    <div key={label} className="bg-white rounded-xl border border-slate-200 shadow-sm px-5 py-4 flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center shrink-0`}>{icon}</div>
                        <div>
                            <div className="text-2xl font-bold text-slate-900">{value}</div>
                            <div className="text-xs text-slate-500">{label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3 mb-5 space-y-3">
                {/* Channel + Status */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex gap-1.5 flex-wrap">
                        <span className="text-xs font-semibold text-slate-400 self-center mr-1">Channel</span>
                        {CHANNELS.map(c => (
                            <button key={c} onClick={() => { setChannel(c); setPage(1); }}
                                className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${channelFilter === c ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                                {c}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                        <span className="text-xs font-semibold text-slate-400 self-center mr-1">Status</span>
                        {STATUSES.map(s => (
                            <button key={s} onClick={() => { setStatus(s); setPage(1); }}
                                className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${statusFilter === s ? 'bg-slate-800 border-slate-800 text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Type + Search */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex gap-1.5 flex-wrap">
                        <span className="text-xs font-semibold text-slate-400 self-center mr-1">Type</span>
                        {TYPES.map(t => (
                            <button key={t} onClick={() => { setType(t); setPage(1); }}
                                className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${typeFilter === t ? 'bg-violet-600 border-violet-600 text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                                {t}
                            </button>
                        ))}
                    </div>
                    <div className="relative ml-auto">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                            placeholder="Search recipient, message..."
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
                                {['Sent','Recipient','Message','Channel','Type','Status','Delivery Time','Actions'].map(h => (
                                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="py-16 text-center text-slate-400">
                                        <Truck size={36} className="mx-auto mb-3 opacity-20" />
                                        <p className="font-medium">No delivery logs found</p>
                                    </td>
                                </tr>
                            ) : paginated.map((log, i) => {
                                const st = STATUS_STYLE[log.status] || STATUS_STYLE.Pending;
                                const ch = CHANNEL_STYLE[log.channel] || CHANNEL_STYLE.SMS;
                                const deliveryTime = formatMs(log.sentAt, log.deliveredAt);
                                const StatusIcon = st.Icon;

                                return (
                                    <tr key={log.id}
                                        className={`hover:bg-slate-50 transition-colors ${i < paginated.length - 1 ? 'border-b border-slate-100' : ''}`}>

                                        {/* Sent */}
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <div className="text-sm font-medium text-slate-700">{formatTime(log.sentAt)}</div>
                                        </td>

                                        {/* Recipient */}
                                        <td className="px-4 py-3">
                                            <div className="text-sm font-semibold text-slate-800">{log.recipient}</div>
                                            <div className="text-xs text-slate-400 font-mono">{log.phone}</div>
                                        </td>

                                        {/* Message */}
                                        <td className="px-4 py-3 max-w-[200px]">
                                            <p className="text-sm text-slate-600 truncate">{log.message}</p>
                                        </td>

                                        {/* Channel */}
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${ch.bg} ${ch.color}`}>
                                                {ch.icon} {log.channel}
                                            </span>
                                        </td>

                                        {/* Type */}
                                        <td className="px-4 py-3">
                                            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                                {log.type}
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${st.bg} ${st.color}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                                                {log.status}
                                            </span>
                                            {log.retries > 0 && (
                                                <div className="text-[10px] text-slate-400 mt-0.5">{log.retries} retr{log.retries > 1 ? 'ies' : 'y'}</div>
                                            )}
                                        </td>

                                        {/* Delivery time */}
                                        <td className="px-4 py-3">
                                            {deliveryTime
                                                ? <span className="text-xs font-mono font-semibold text-emerald-600">{deliveryTime}</span>
                                                : <span className="text-xs text-slate-400">—</span>}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 py-3">
                                            {log.status === 'Failed' && (
                                                <button onClick={() => handleRetry(log.id)} disabled={retrying === log.id}
                                                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors">
                                                    {retrying === log.id ? <Loader2 size={12} className="animate-spin" /> : <RotateCcw size={12} />}
                                                    Retry
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-4 py-3.5 border-t border-slate-100 flex items-center justify-between bg-slate-50">
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