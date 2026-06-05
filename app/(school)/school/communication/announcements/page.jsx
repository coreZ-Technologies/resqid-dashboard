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
import { cn } from '@/lib/utils';

// ─── Constants ────────────────────────────────────────────────────────────────
const AUDIENCES = ['All', 'All Students', 'All Parents', 'All Teachers', 'Specific Class'];
const CATEGORIES = ['All', 'General', 'Academic', 'Event', 'Holiday', 'Urgent'];
const STATUS_OPTS = ['All', 'Published', 'Draft', 'Scheduled'];

const CATEGORY_STYLE = {
    General:  { bg: 'bg-gray-100',   text: 'text-gray-600',   border: 'border-gray-200'   },
    Academic: { bg: 'bg-violet-50',  text: 'text-violet-700', border: 'border-violet-200' },
    Event:    { bg: 'bg-violet-50',  text: 'text-violet-700', border: 'border-violet-200' },
    Holiday:  { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    Urgent:   { bg: 'bg-rose-50',    text: 'text-rose-700',   border: 'border-rose-200'   },
};

const STATUS_STYLE = {
    Published: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    Draft:     { bg: 'bg-gray-100',   text: 'text-gray-500',   dot: 'bg-gray-400'   },
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

// ─── Compose Modal (Notion style) ────────────────────────────────────────────
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
        <div className="fixed inset-0 bg-black/20 backdrop-blur-[1px] flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-md shadow-lg w-full max-w-xl border border-violet-100" onClick={e => e.stopPropagation()}>
                <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-md bg-gradient-to-r from-violet-500 to-violet-700 flex items-center justify-center">
                            <Megaphone size={17} className="text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800 text-base leading-tight">
                                {announcement ? 'Edit Announcement' : 'New Announcement'}
                            </h3>
                            <p className="text-[11px] text-gray-500">Broadcast to students, parents or teachers</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
                </div>

                <div className="p-5 space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">Title *</label>
                        <input value={title} onChange={e => setTitle(e.target.value)}
                            placeholder="Announcement title..."
                            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-violet-300 focus:ring-1 focus:ring-violet-100" />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">Message *</label>
                        <textarea value={body} onChange={e => setBody(e.target.value)} rows={4}
                            placeholder="Write your announcement here..."
                            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-violet-300 focus:ring-1 focus:ring-violet-100 resize-none" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">Category</label>
                            <div className="relative">
                                <select value={category} onChange={e => setCategory(e.target.value)}
                                    className="w-full appearance-none border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-violet-300 bg-white cursor-pointer">
                                    {['General','Academic','Event','Holiday','Urgent'].map(c => <option key={c}>{c}</option>)}
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">Audience</label>
                            <div className="relative">
                                <select value={audience} onChange={e => setAudience(e.target.value)}
                                    className="w-full appearance-none border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-violet-300 bg-white cursor-pointer">
                                    {['All Students','All Parents','All Teachers','Specific Class'].map(a => <option key={a}>{a}</option>)}
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={pinned} onChange={e => setPinned(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500 focus:ring-1" />
                            <span className="text-xs font-medium text-gray-700">Pin this announcement</span>
                        </label>
                        <div className="flex gap-2 ml-auto">
                            {['Draft','Published'].map(s => (
                                <button key={s} onClick={() => setStatus(s)}
                                    className={`px-3 py-1.5 rounded-md border text-xs font-semibold transition-colors ${status === s ? 'bg-gradient-to-r from-violet-500 to-violet-700 text-white border-transparent' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="px-5 py-3 border-t border-gray-200 flex justify-end gap-2">
                    <button onClick={onClose} className="px-3 py-1.5 rounded-md border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50">Cancel</button>
                    <button onClick={handleSave} disabled={!title || !body || loading}
                        className="px-4 py-1.5 rounded-md bg-gradient-to-r from-violet-500 to-violet-700 hover:opacity-90 text-white text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50 transition-all">
                        {loading ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                        {status === 'Draft' ? 'Save Draft' : 'Publish'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Announcement Card (Notion style) ────────────────────────────────────────
const AnnouncementCard = ({ item, onEdit, onDelete }) => {
    const cat = CATEGORY_STYLE[item.category] || CATEGORY_STYLE.General;
    const st  = STATUS_STYLE[item.status] || STATUS_STYLE.Draft;

    return (
        <div className={cn(
            "bg-white rounded-md border transition-all overflow-hidden",
            item.pinned ? "border-violet-200" : "border-violet-100 hover:border-violet-200"
        )}>
            {item.pinned && <div className="h-0.5 bg-violet-600" />}
            <div className="p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                        {item.pinned && <Pin size={13} className="text-violet-600 shrink-0 mt-0.5" />}
                        <h3 className="font-semibold text-gray-800 text-sm leading-snug">{item.title}</h3>
                    </div>
                    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium", st.bg, st.text)}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", st.dot)} />{item.status}
                    </span>
                </div>

                <p className="text-xs text-gray-500 mb-3 line-clamp-2 leading-relaxed">{item.body}</p>

                <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium border", cat.bg, cat.text, cat.border)}>
                        {item.category}
                    </span>
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-600">
                        <Users size={10} /> {item.audience}
                    </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-3 text-[10px] text-gray-500">
                        {item.publishedAt && (
                            <span className="flex items-center gap-1">
                                <Calendar size={10} />
                                {new Date(item.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                        )}
                        {item.status === 'Published' && (
                            <span className="flex items-center gap-1">
                                <Eye size={10} /> {item.views.toLocaleString('en-IN')} views
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-1">
                        <button onClick={() => onEdit(item)}
                            className="p-1 rounded-md text-gray-400 hover:text-violet-600 hover:bg-violet-50 transition-colors">
                            <Edit2 size={13} />
                        </button>
                        <button onClick={() => onDelete(item.id)}
                            className="p-1 rounded-md text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-colors">
                            <Trash2 size={13} />
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
                    <h1 className="text-xl font-semibold text-gray-800 m-0">Announcements</h1>
                    <p className="text-xs text-gray-500 mt-1">School-wide announcements to students and parents</p>
                </div>
                <button onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-gradient-to-r from-violet-500 to-violet-700 hover:opacity-90 text-white text-xs font-medium transition-all">
                    <Plus size={14} /> New Announcement
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {[
                    { label: 'Total',      value: stats.total,      icon: <Megaphone size={18} className="text-white" />, bg: 'bg-violet-500'    },
                    { label: 'Published',  value: stats.published,  icon: <Globe size={18} className="text-white" />,     bg: 'bg-emerald-500' },
                    { label: 'Pinned',     value: stats.pinned,     icon: <Pin size={18} className="text-white" />,       bg: 'bg-violet-500'  },
                    { label: 'Total Views',value: stats.totalViews.toLocaleString('en-IN'), icon: <Eye size={18} className="text-white" />, bg: 'bg-amber-500' },
                ].map(({ label, value, icon, bg }) => (
                    <div key={label} className="bg-white rounded-md border border-violet-100 p-4 flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-md ${bg} flex items-center justify-center shrink-0`}>{icon}</div>
                        <div>
                            <div className="text-2xl font-semibold text-gray-800">{value}</div>
                            <div className="text-[11px] text-gray-500">{label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-md border border-violet-100 p-3 mb-5 flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px]">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search announcements..."
                        className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-md text-sm outline-none focus:border-violet-300 focus:ring-1 focus:ring-violet-100" />
                </div>
                <div className="flex gap-1.5 flex-wrap">
                    {CATEGORIES.map(c => (
                        <button key={c} onClick={() => setCategory(c)}
                            className={cn("px-3 py-1 rounded-md border text-xs font-medium transition-all",
                                categoryFilter === c
                                    ? "bg-gradient-to-r from-violet-500 to-violet-700 text-white border-transparent"
                                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                            )}>
                            {c}
                        </button>
                    ))}
                </div>
                <div className="flex gap-1.5">
                    {STATUS_OPTS.map(s => (
                        <button key={s} onClick={() => setStatus(s)}
                            className={cn("px-3 py-1 rounded-md border text-xs font-medium transition-all",
                                statusFilter === s
                                    ? "bg-gray-800 text-white border-gray-800"
                                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                            )}>
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            <p className="text-xs text-gray-500 mb-4">
                Showing <span className="font-medium text-gray-700">{sorted.length}</span> announcement{sorted.length !== 1 ? 's' : ''}
            </p>

            {sorted.length === 0 ? (
                <div className="bg-white rounded-md border border-violet-100 p-12 text-center">
                    <Megaphone size={32} className="mx-auto mb-3 text-gray-300" />
                    <p className="text-sm font-medium text-gray-600">No announcements found</p>
                    <button onClick={() => setShowModal(true)} className="mt-4 px-3 py-1.5 rounded-md bg-gradient-to-r from-violet-500 to-violet-700 text-white text-xs font-medium hover:opacity-90 transition-all">
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