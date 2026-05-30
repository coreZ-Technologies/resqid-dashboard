'use client';

/**
 * SCHOOL ADMIN — SESSIONS
 * Place at: app/(school)/school/sessions/page.jsx
 * Matches the UI design language from the existing dashboard (white cards, blue accents)
 */

import { useState } from 'react';
import {
    Clock, Plus, StopCircle, PlayCircle, Search,
    CheckCircle, XCircle, AlertCircle, Users,
    Calendar, Timer, MoreVertical, RefreshCw,
    ChevronDown, Loader2, Lock, Unlock
} from 'lucide-react';

// ─── Types / Constants ────────────────────────────────────────────────────────
const SESSION_STATUS = {
    OPEN:   { label: 'Open',   color: 'text-emerald-600', bg: 'bg-emerald-50',  border: 'border-emerald-200', dot: 'bg-emerald-500' },
    CLOSED: { label: 'Closed', color: 'text-slate-500',   bg: 'bg-slate-100',   border: 'border-slate-200',   dot: 'bg-slate-400'   },
    PAUSED: { label: 'Paused', color: 'text-amber-600',   bg: 'bg-amber-50',    border: 'border-amber-200',   dot: 'bg-amber-500'   },
};

const CLASSES = ['All', 'Nursery', 'LKG', 'UKG', 'Cls 1', 'Cls 2', 'Cls 3', 'Cls 4', 'Cls 5', 'Cls 6', 'Cls 7', 'Cls 8', 'Cls 9', 'Cls 10', 'Cls 11', 'Cls 12'];

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_SESSIONS = [
    { id: 's1',  class: 'Cls 10', section: 'A', subject: 'Mathematics',      teacher: 'Mr. Rajesh Kumar',   status: 'OPEN',   opened_at: new Date(Date.now() - 42 * 60000).toISOString(),  closed_at: null,                                              scans: 32, total_students: 35 },
    { id: 's2',  class: 'Cls 9',  section: 'B', subject: 'Science',          teacher: 'Mrs. Anita Singh',   status: 'OPEN',   opened_at: new Date(Date.now() - 18 * 60000).toISOString(),  closed_at: null,                                              scans: 28, total_students: 33 },
    { id: 's3',  class: 'Cls 8',  section: 'A', subject: 'English',          teacher: 'Ms. Pooja Sharma',   status: 'PAUSED', opened_at: new Date(Date.now() - 90 * 60000).toISOString(),  closed_at: null,                                              scans: 30, total_students: 36 },
    { id: 's4',  class: 'Cls 7',  section: 'C', subject: 'History',          teacher: 'Mr. Vikram Mehta',   status: 'CLOSED', opened_at: new Date(Date.now() - 180 * 60000).toISOString(), closed_at: new Date(Date.now() - 60 * 60000).toISOString(),   scans: 34, total_students: 34 },
    { id: 's5',  class: 'Cls 11', section: 'B', subject: 'Physics',          teacher: 'Dr. Suresh Nair',    status: 'CLOSED', opened_at: new Date(Date.now() - 240 * 60000).toISOString(), closed_at: new Date(Date.now() - 120 * 60000).toISOString(),  scans: 29, total_students: 31 },
    { id: 's6',  class: 'Cls 6',  section: 'A', subject: 'Geography',        teacher: 'Mrs. Kavitha Reddy', status: 'OPEN',   opened_at: new Date(Date.now() - 10 * 60000).toISOString(),  closed_at: null,                                              scans: 15, total_students: 38 },
    { id: 's7',  class: 'Cls 12', section: 'A', subject: 'Chemistry',        teacher: 'Mr. Arjun Verma',    status: 'CLOSED', opened_at: new Date(Date.now() - 300 * 60000).toISOString(), closed_at: new Date(Date.now() - 180 * 60000).toISOString(),  scans: 27, total_students: 28 },
    { id: 's8',  class: 'Cls 5',  section: 'B', subject: 'Computer Science', teacher: 'Ms. Divya Joshi',    status: 'OPEN',   opened_at: new Date(Date.now() - 5 * 60000).toISOString(),   closed_at: null,                                              scans: 8,  total_students: 40 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatDuration = (openedAt, closedAt) => {
    const end = closedAt ? new Date(closedAt) : new Date();
    const mins = Math.floor((end - new Date(openedAt)) / 60000);
    if (mins < 60) return `${mins}m`;
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
};

const formatTime = (iso) =>
    new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

// ─── Open Session Modal ───────────────────────────────────────────────────────
const OpenSessionModal = ({ onClose, onOpen }) => {
    const [classVal, setClassVal]     = useState('');
    const [section, setSection]       = useState('');
    const [subject, setSubject]       = useState('');
    const [loading, setLoading]       = useState(false);

    const sections = ['A', 'B', 'C', 'D'];
    const subjects = ['Mathematics', 'Science', 'English', 'History', 'Geography', 'Physics', 'Chemistry', 'Computer Science', 'Biology', 'Hindi'];

    const handleSubmit = async () => {
        if (!classVal || !section || !subject) return;
        setLoading(true);
        await new Promise(r => setTimeout(r, 800));
        onOpen({ class: classVal, section, subject });
        setLoading(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
                        <PlayCircle size={18} className="text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 text-lg leading-tight">Open New Session</h3>
                        <p className="text-xs text-slate-500">Students can scan once session is open</p>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    {/* Class */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Class</label>
                        <div className="relative">
                            <select
                                value={classVal}
                                onChange={e => setClassVal(e.target.value)}
                                className="w-full appearance-none border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 bg-white cursor-pointer"
                            >
                                <option value="">Select class</option>
                                {CLASSES.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Section */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Section</label>
                        <div className="flex gap-2">
                            {sections.map(s => (
                                <button
                                    key={s}
                                    onClick={() => setSection(s)}
                                    className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${section === s ? 'border-blue-500 bg-blue-600 text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Subject */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Subject</label>
                        <div className="relative">
                            <select
                                value={subject}
                                onChange={e => setSubject(e.target.value)}
                                className="w-full appearance-none border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 bg-white cursor-pointer"
                            >
                                <option value="">Select subject</option>
                                {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    {classVal && section && subject && (
                        <div className="p-3 rounded-lg bg-blue-50 border border-blue-100 text-sm text-blue-800">
                            <span className="font-semibold">Opening:</span> {classVal}–{section} · {subject}
                        </div>
                    )}
                </div>

                <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!classVal || !section || !subject || loading}
                        className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-50 transition-colors"
                    >
                        {loading ? <Loader2 size={15} className="animate-spin" /> : <PlayCircle size={15} />}
                        Open Session
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Session Card ─────────────────────────────────────────────────────────────
const SessionCard = ({ session, onClose, onPause, onResume }) => {
    const cfg = SESSION_STATUS[session.status];
    const attendance = Math.round((session.scans / session.total_students) * 100);
    const isOpen = session.status === 'OPEN';
    const isPaused = session.status === 'PAUSED';
    const isClosed = session.status === 'CLOSED';

    return (
        <div className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all hover:shadow-md ${isClosed ? 'border-slate-200 opacity-80' : 'border-slate-200'}`}>
            {/* Top color bar */}
            <div className={`h-1 ${isOpen ? 'bg-emerald-500' : isPaused ? 'bg-amber-400' : 'bg-slate-300'}`} />

            <div className="p-5">
                {/* Header row */}
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-slate-900 text-base">{session.class}–{session.section}</span>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${isOpen ? 'animate-pulse' : ''}`} />
                                {cfg.label}
                            </span>
                        </div>
                        <p className="text-sm text-slate-500">{session.subject}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{session.teacher}</p>
                    </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="bg-slate-50 rounded-lg p-2.5 text-center">
                        <div className="text-lg font-bold text-slate-900">{session.scans}</div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wide">Scanned</div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2.5 text-center">
                        <div className="text-lg font-bold text-slate-900">{session.total_students}</div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wide">Total</div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2.5 text-center">
                        <div className={`text-lg font-bold ${attendance >= 80 ? 'text-emerald-600' : attendance >= 60 ? 'text-amber-600' : 'text-red-500'}`}>
                            {attendance}%
                        </div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wide">Rate</div>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="mb-4">
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all ${attendance >= 80 ? 'bg-emerald-500' : attendance >= 60 ? 'bg-amber-400' : 'bg-red-400'}`}
                            style={{ width: `${attendance}%` }}
                        />
                    </div>
                </div>

                {/* Time info */}
                <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
                    <span className="flex items-center gap-1">
                        <Clock size={11} /> Opened {formatTime(session.opened_at)}
                    </span>
                    <span className="flex items-center gap-1">
                        <Timer size={11} /> {formatDuration(session.opened_at, session.closed_at)}
                    </span>
                    {session.closed_at && (
                        <span className="flex items-center gap-1">
                            <Lock size={11} /> Closed {formatTime(session.closed_at)}
                        </span>
                    )}
                </div>

                {/* Actions */}
                {!isClosed && (
                    <div className="flex gap-2">
                        {isOpen && (
                            <button
                                onClick={() => onPause(session.id)}
                                className="flex-1 py-2 rounded-lg border border-amber-200 bg-amber-50 text-amber-700 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-amber-100 transition-colors"
                            >
                                <AlertCircle size={13} /> Pause
                            </button>
                        )}
                        {isPaused && (
                            <button
                                onClick={() => onResume(session.id)}
                                className="flex-1 py-2 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-emerald-100 transition-colors"
                            >
                                <PlayCircle size={13} /> Resume
                            </button>
                        )}
                        <button
                            onClick={() => onClose(session.id)}
                            className="flex-1 py-2 rounded-lg border border-red-200 bg-red-50 text-red-600 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-red-100 transition-colors"
                        >
                            <StopCircle size={13} /> Close Session
                        </button>
                    </div>
                )}

                {isClosed && (
                    <div className="flex items-center justify-center gap-1.5 py-1.5 text-xs text-slate-400">
                        <Lock size={12} /> Session closed
                    </div>
                )}
            </div>
        </div>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SessionsPage() {
    const [sessions, setSessions]         = useState(MOCK_SESSIONS);
    const [search, setSearch]             = useState('');
    const [classFilter, setClassFilter]   = useState('All');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [showModal, setShowModal]       = useState(false);

    // Stats
    const openCount   = sessions.filter(s => s.status === 'OPEN').length;
    const pausedCount = sessions.filter(s => s.status === 'PAUSED').length;
    const closedCount = sessions.filter(s => s.status === 'CLOSED').length;
    const totalScans  = sessions.reduce((acc, s) => acc + s.scans, 0);

    // Filter
    const filtered = sessions.filter(s => {
        const matchClass  = classFilter === 'All' || s.class === classFilter || s.class.replace('Cls ', 'Cls ') === classFilter;
        const matchStatus = statusFilter === 'ALL' || s.status === statusFilter;
        const matchSearch = !search ||
            s.class.toLowerCase().includes(search.toLowerCase()) ||
            s.subject.toLowerCase().includes(search.toLowerCase()) ||
            s.teacher.toLowerCase().includes(search.toLowerCase()) ||
            s.section.toLowerCase().includes(search.toLowerCase());
        return matchClass && matchStatus && matchSearch;
    });

    const handleOpenSession = ({ class: cls, section, subject }) => {
        const newSession = {
            id: `s${Date.now()}`,
            class: cls,
            section,
            subject,
            teacher: 'Current Teacher',
            status: 'OPEN',
            opened_at: new Date().toISOString(),
            closed_at: null,
            scans: 0,
            total_students: 35,
        };
        setSessions(prev => [newSession, ...prev]);
    };

    const handleCloseSession = (id) => {
        setSessions(prev => prev.map(s =>
            s.id === id ? { ...s, status: 'CLOSED', closed_at: new Date().toISOString() } : s
        ));
    };

    const handlePauseSession = (id) => {
        setSessions(prev => prev.map(s => s.id === id ? { ...s, status: 'PAUSED' } : s));
    };

    const handleResumeSession = (id) => {
        setSessions(prev => prev.map(s => s.id === id ? { ...s, status: 'OPEN' } : s));
    };

    return (
        <div className="max-w-[1300px]">
            {showModal && (
                <OpenSessionModal
                    onClose={() => setShowModal(false)}
                    onOpen={handleOpenSession}
                />
            )}

            {/* Page Header */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h1 className="text-[1.375rem] font-bold text-slate-900 m-0">Sessions</h1>
                    <p className="text-sm text-slate-500 mt-1">Open / close attendance sessions per class</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm transition-colors"
                >
                    <Plus size={16} /> Open Session
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                    { label: 'Open Sessions',   value: openCount,   color: 'text-emerald-600', icon: <Unlock size={18} className="text-emerald-500" /> },
                    { label: 'Paused',          value: pausedCount, color: 'text-amber-600',   icon: <AlertCircle size={18} className="text-amber-500" /> },
                    { label: 'Closed Today',    value: closedCount, color: 'text-slate-600',   icon: <Lock size={18} className="text-slate-400" /> },
                    { label: 'Total Scans',     value: totalScans,  color: 'text-blue-600',    icon: <Users size={18} className="text-blue-500" /> },
                ].map(({ label, value, color, icon }) => (
                    <div key={label} className="bg-white rounded-xl border border-slate-200 shadow-sm px-5 py-4 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                            {icon}
                        </div>
                        <div>
                            <div className={`text-2xl font-bold ${color}`}>{value}</div>
                            <div className="text-xs text-slate-500">{label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-5 space-y-3">
                {/* Class tabs */}
                <div className="flex gap-1.5 flex-wrap">
                    {CLASSES.map(c => (
                        <button
                            key={c}
                            onClick={() => setClassFilter(c)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                                classFilter === c
                                    ? 'bg-blue-600 border-blue-600 text-white font-semibold'
                                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            {c}
                        </button>
                    ))}
                </div>

                {/* Status + Search row */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex gap-1.5">
                        {[['ALL', 'All'], ['OPEN', 'Open'], ['PAUSED', 'Paused'], ['CLOSED', 'Closed']].map(([val, lbl]) => (
                            <button
                                key={val}
                                onClick={() => setStatusFilter(val)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                                    statusFilter === val
                                        ? 'bg-slate-800 border-slate-800 text-white'
                                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                {lbl}
                            </button>
                        ))}
                    </div>
                    <div className="relative ml-auto">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search class, subject, teacher..."
                            className="pl-8 pr-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 w-64"
                        />
                    </div>
                </div>
            </div>

            {/* Results count */}
            <p className="text-sm text-slate-500 mb-4">
                Showing <span className="font-semibold text-slate-700">{filtered.length}</span> session{filtered.length !== 1 ? 's' : ''}
                {openCount > 0 && <span className="ml-2 inline-flex items-center gap-1 text-emerald-600 font-medium"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" /> {openCount} live</span>}
            </p>

            {/* Session Cards Grid */}
            {filtered.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-16 text-center">
                    <Clock size={40} className="mx-auto mb-3 text-slate-300" />
                    <p className="font-semibold text-slate-600">No sessions found</p>
                    <p className="text-sm text-slate-400 mt-1">Try adjusting your filters or open a new session</p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
                    >
                        Open Session
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filtered.map(session => (
                        <SessionCard
                            key={session.id}
                            session={session}
                            onClose={handleCloseSession}
                            onPause={handlePauseSession}
                            onResume={handleResumeSession}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}