'use client';

/**
 * SCHOOL ADMIN — ANNOUNCEMENTS
 * Place at: app/(school)/school/announcements/page.jsx
 */

import { useState, useMemo } from 'react';
import {
    Megaphone, Plus, Search, Download, Edit2, Trash2,
    Users, Clock, X, Check, Loader2, ChevronDown,
    Pin, Bell, Globe, Eye, Calendar, Filter,
    BookOpen, GraduationCap, UserCheck, Send
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────
const AUDIENCES = ['All', 'All Students', 'All Parents', 'All Teachers', 'Specific Class'];
const CATEGORIES = ['All', 'General', 'Academic', 'Event', 'Holiday', 'Urgent'];
const STATUS_OPTS = ['All', 'Published', 'Draft', 'Scheduled'];

const CATEGORY_STYLE = {
    General:  { bg: 'bg-slate-100',   text: 'text-slate-600',   border: 'border-slate-200'   },
    Academic: { bg: 'bg-blue-50',     text: 'text-blue-700',    border: 'border-blue-200'    },
    Event:    { bg: 'bg-violet-50',   text: 'text-violet-700',  border: 'border-violet-200'  },
    Holiday:  { bg: 'bg-emerald-50',  text: 'text-emerald-700', border: 'border-emerald-200' },
    Urgent:   { bg: 'bg-red-50',      text: 'text-red-700',     border: 'border-red-200'     },
};

const STATUS_STYLE = {
    Published: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    Draft:     { bg: 'bg-slate-100',  text: 'text-slate-500',   dot: 'bg-slate-400'   },
    Scheduled: { bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-500'   },
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_ANNOUNCEMENTS = [
    { id: 'a1',  title: 'Annual Sports Day – 10th June 2026',         category: 'Event',    audience: 'All Students', status: 'Published', pinned: true,  views: 1840, publishedAt: '2026-05-28', body: 'The Annual Sports Day will be held on 10th June 2026 at the school ground. All students must report by 8:00 AM in their house colours.' },
    { id: 'a2',  title: 'Half-Yearly Exam Schedule Released',         category: 'Academic', audience: 'All Students', status: 'Published', pinned: true,  views: 2103, publishedAt: '2026-05-27', body: 'The Half-Yearly Examination schedule has been released. Please check the notice board or download the timetable from the school portal.' },
    { id: 'a3',  title: 'Parent-Teacher Meeting – 15th June',         category: 'Event',    audience: 'All Parents',  status: 'Published', pinned: false, views: 963,  publishedAt: '2026-05-26', body: 'A Parent-Teacher Meeting is scheduled for 15th June 2026 from 10 AM to 1 PM. All parents are requested to attend.' },
    { id: 'a4',  title: 'Eid Al-Adha Holiday – 7th June 2026',       category: 'Holiday',  audience: 'All Students', status: 'Published', pinned: false, views: 1560, publishedAt: '2026-05-25', body: 'The school will remain closed on 7th June 2026 on account of Eid Al-Adha. Classes will resume on 9th June 2026.' },
    { id: 'a5',  title: 'New Library Books Available',                category: 'Academic', audience: 'All Students', status: 'Published', pinned: false, views: 412,  publishedAt: '2026-05-24', body: 'A new batch of books has been added to the school library. Students are encouraged to visit and issue books for the summer reading program.' },
    { id: 'a6',  title: 'Fee Payment Reminder – Last Date 5th June', category: 'Urgent',   audience: 'All Parents',  status: 'Published', pinned: false, views: 1230, publishedAt: '2026-05-23', body: 'This is a reminder that the last date for fee payment for the current term is 5th June 2026. Please clear dues to avoid late charges.' },
    { id: 'a7',  title: 'Science Exhibition – Entries Open',          category: 'Event',    audience: 'All Students', status: 'Scheduled', pinned: false, views: 0,    publishedAt: '2026-06-01', body: 'The inter-school Science Exhibition will be held on 20th June. Students from Cls 8–12 can submit their project entries by 10th June.' },
    { id: 'a8',  title: 'Draft: Welcome Address – New Session',       category: 'General',  audience: 'All Students', status: 'Draft',     pinned: false, views: 0,    publishedAt: null,         body: 'Draft content for the welcome address for the new academic session.' },
];

// ─── Compose Modal ────────────────────────────────────────────────────────────
const ComposeModal = ({ announcement, onClose, onSave }) => {
    const [title, setTitle]       = useState(announcement?.title || '');
    const [body, setBody]         = useState(announcement?.body || '');
    const [category, setCategory] = useState(announcement?.category || 'General');
    const [audience, setAudience] = useState(announcement?.audience || 'All Students');
    const [pinned, setPinned]     = useState(announcement?.pinned || false);
    const [status, setStatus]     = useState(announcement?.status || 'Published');
    const [loading, setLoading]   = useState(false);

    const handleSave = async () => {
        if (!title.trim() || !body.trim()) return;
        setLoading(true);
        await new Promise(r => setTimeout(r, 700));
        onSave({ title, body, category, audience, pinned, status });
        setLoading(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
                            <Megaphone size={17} className="text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-lg leading-tight">
                                {announcement ? 'Edit Announcement' : 'New Announcement'}
                            </h3>
                            <p className="text-xs text-slate-500">Broadcast to students, parents or teachers</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Title *</label>
                        <input value={title} onChange={e => setTitle(e.target.value)}
                            placeholder="Announcement title..."
                            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Message *</label>
                        <textarea value={body} onChange={e => setBody(e.target.value)} rows={4}
                            placeholder="Write your announcement here..."
                            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500 resize-none" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category</label>
                            <div className="relative">
                                <select value={category} onChange={e => setCategory(e.target.value)}
                                    className="w-full appearance-none border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500 bg-white cursor-pointer">
                                    {['General','Academic','Event','Holiday','Urgent'].map(c => <option key={c}>{c}</option>)}
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Audience</label>
                            <div className="relative">
                                <select value={audience} onChange={e => setAudience(e.target.value)}
                                    className="w-full appearance-none border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500 bg-white cursor-pointer">
                                    {['All Students','All Parents','All Teachers','Specific Class'].map(a => <option key={a}>{a}</option>)}
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={pinned} onChange={e => setPinned(e.target.checked)}
                                className="w-4 h-4 rounded border-slate-300 accent-blue-600" />
                            <span className="text-sm font-medium text-slate-700">Pin this announcement</span>
                        </label>
                        <div className="flex gap-2 ml-auto">
                            {['Draft','Published'].map(s => (
                                <button key={s} onClick={() => setStatus(s)}
                                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${status === s ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50">Cancel</button>
                    <button onClick={handleSave} disabled={!title || !body || loading}
                        className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-50 transition-colors">
                        {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                        {status === 'Draft' ? 'Save Draft' : 'Publish'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Announcement Card ────────────────────────────────────────────────────────
const AnnouncementCard = ({ item, onEdit, onDelete }) => {
    const cat = CATEGORY_STYLE[item.category] || CATEGORY_STYLE.General;
    const st  = STATUS_STYLE[item.status] || STATUS_STYLE.Draft;

    return (
        <div className={`bg-white rounded-xl border shadow-sm hover:shadow-md transition-all overflow-hidden ${item.pinned ? 'border-blue-200' : 'border-slate-200'}`}>
            {item.pinned && <div className="h-1 bg-blue-500" />}
            <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                        {item.pinned && <Pin size={14} className="text-blue-500 shrink-0 mt-1" />}
                        <h3 className="font-bold text-slate-900 text-base leading-snug">{item.title}</h3>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${st.bg} ${st.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />{item.status}
                    </span>
                </div>

                <p className="text-sm text-slate-500 mb-3 line-clamp-2 leading-relaxed">{item.body}</p>

                <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cat.bg} ${cat.text} ${cat.border}`}>
                        {item.category}
                    </span>
                    <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                        <Users size={11} /> {item.audience}
                    </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                        {item.publishedAt && (
                            <span className="flex items-center gap-1">
                                <Calendar size={11} />
                                {new Date(item.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                        )}
                        {item.status === 'Published' && (
                            <span className="flex items-center gap-1">
                                <Eye size={11} /> {item.views.toLocaleString('en-IN')} views
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-1">
                        <button onClick={() => onEdit(item)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                            <Edit2 size={14} />
                        </button>
                        <button onClick={() => onDelete(item.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AnnouncementsPage() {
    const [items, setItems]           = useState(MOCK_ANNOUNCEMENTS);
    const [search, setSearch]         = useState('');
    const [categoryFilter, setCategory] = useState('All');
    const [statusFilter, setStatus]   = useState('All');
    const [showModal, setShowModal]   = useState(false);
    const [editItem, setEditItem]     = useState(null);

    const filtered = useMemo(() => items.filter(a => {
        const matchCat    = categoryFilter === 'All' || a.category === categoryFilter;
        const matchStatus = statusFilter === 'All' || a.status === statusFilter;
        const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.body.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchStatus && matchSearch;
    }), [items, search, categoryFilter, statusFilter]);

    // Pinned first
    const sorted = [...filtered].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

    const handleSave = (data) => {
        if (editItem) {
            setItems(prev => prev.map(a => a.id === editItem.id ? { ...a, ...data } : a));
        } else {
            setItems(prev => [{ id: `a${Date.now()}`, ...data, views: 0, publishedAt: data.status === 'Published' ? new Date().toISOString().slice(0,10) : null }, ...prev]);
        }
        setEditItem(null);
    };

    const stats = {
        total:     items.length,
        published: items.filter(a => a.status === 'Published').length,
        pinned:    items.filter(a => a.pinned).length,
        totalViews: items.reduce((a, i) => a + i.views, 0),
    };

    return (
        <div className="max-w-[1300px]">
            {(showModal || editItem) && (
                <ComposeModal
                    announcement={editItem}
                    onClose={() => { setShowModal(false); setEditItem(null); }}
                    onSave={handleSave}
                />
            )}

            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h1 className="text-[1.375rem] font-bold text-slate-900 m-0">Announcements</h1>
                    <p className="text-sm text-slate-500 mt-1">School-wide announcements to students and parents</p>
                </div>
                <button onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm transition-colors">
                    <Plus size={16} /> New Announcement
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                    { label: 'Total',      value: stats.total,      icon: <Megaphone size={20} className="text-white" />, bg: 'bg-blue-500'    },
                    { label: 'Published',  value: stats.published,  icon: <Globe size={20} className="text-white" />,     bg: 'bg-emerald-500' },
                    { label: 'Pinned',     value: stats.pinned,     icon: <Pin size={20} className="text-white" />,       bg: 'bg-violet-500'  },
                    { label: 'Total Views',value: stats.totalViews.toLocaleString('en-IN'), icon: <Eye size={20} className="text-white" />, bg: 'bg-amber-500' },
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
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3 mb-5 flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px]">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search announcements..."
                        className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500" />
                </div>
                <div className="flex gap-1.5 flex-wrap">
                    {CATEGORIES.map(c => (
                        <button key={c} onClick={() => setCategory(c)}
                            className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${categoryFilter === c ? 'bg-blue-600 border-blue-600 text-white font-semibold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                            {c}
                        </button>
                    ))}
                </div>
                <div className="flex gap-1.5">
                    {STATUS_OPTS.map(s => (
                        <button key={s} onClick={() => setStatus(s)}
                            className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${statusFilter === s ? 'bg-slate-800 border-slate-800 text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            <p className="text-sm text-slate-500 mb-4">
                Showing <span className="font-semibold text-slate-700">{sorted.length}</span> announcement{sorted.length !== 1 ? 's' : ''}
            </p>

            {sorted.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-16 text-center">
                    <Megaphone size={36} className="mx-auto mb-3 text-slate-300" />
                    <p className="font-semibold text-slate-600">No announcements found</p>
                    <button onClick={() => setShowModal(true)} className="mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
                        New Announcement
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {sorted.map(item => (
                        <AnnouncementCard key={item.id} item={item}
                            onEdit={(a) => { setEditItem(a); setShowModal(true); }}
                            onDelete={(id) => setItems(prev => prev.filter(a => a.id !== id))} />
                    ))}
                </div>
            )}
        </div>
    );
}