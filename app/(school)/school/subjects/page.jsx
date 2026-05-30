'use client';

/**
 * SCHOOL ADMIN — SUBJECTS
 * Place at: app/(school)/school/subjects/page.jsx
 */

import { useState, useMemo } from 'react';
import {
    BookOpen, Plus, Search, Download, Edit2, Trash2,
    Users, Clock, ChevronDown, Loader2, X, Check,
    BarChart2, BookMarked, GraduationCap, Layers
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────
const SUBJECT_COLORS = [
    { bg: 'bg-blue-500',   light: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200'   },
    { bg: 'bg-emerald-500',light: 'bg-emerald-50', text: 'text-emerald-700',border: 'border-emerald-200'},
    { bg: 'bg-violet-500', light: 'bg-violet-50',  text: 'text-violet-700', border: 'border-violet-200' },
    { bg: 'bg-amber-500',  light: 'bg-amber-50',   text: 'text-amber-700',  border: 'border-amber-200'  },
    { bg: 'bg-rose-500',   light: 'bg-rose-50',    text: 'text-rose-700',   border: 'border-rose-200'   },
    { bg: 'bg-cyan-500',   light: 'bg-cyan-50',    text: 'text-cyan-700',   border: 'border-cyan-200'   },
    { bg: 'bg-orange-500', light: 'bg-orange-50',  text: 'text-orange-700', border: 'border-orange-200' },
    { bg: 'bg-teal-500',   light: 'bg-teal-50',    text: 'text-teal-700',   border: 'border-teal-200'   },
];

const STATUS_OPTIONS = ['All', 'Active', 'Inactive'];

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_SUBJECTS = [
    { id: 's1',  name: 'Mathematics',      code: 'MATH',  teachers: 2, classes: ['Cls 8-A','Cls 9-B','Cls 10-A'], periodsPerWeek: 5, status: 'Active',   colorIdx: 0, description: 'Algebra, geometry, calculus and statistics' },
    { id: 's2',  name: 'English',          code: 'ENG',   teachers: 2, classes: ['Cls 6-A','Cls 7-B','Cls 8-A'],  periodsPerWeek: 5, status: 'Active',   colorIdx: 1, description: 'Language, literature, grammar and writing' },
    { id: 's3',  name: 'Science',          code: 'SCI',   teachers: 1, classes: ['Cls 6-B','Cls 7-A','Cls 8-B'],  periodsPerWeek: 4, status: 'Active',   colorIdx: 2, description: 'Physics, chemistry and biology fundamentals' },
    { id: 's4',  name: 'History',          code: 'HIST',  teachers: 1, classes: ['Cls 7-C','Cls 9-A'],            periodsPerWeek: 3, status: 'Active',   colorIdx: 3, description: 'World and Indian history, civics' },
    { id: 's5',  name: 'Physics',          code: 'PHY',   teachers: 1, classes: ['Cls 11-A','Cls 12-B'],          periodsPerWeek: 5, status: 'Active',   colorIdx: 4, description: 'Mechanics, optics, thermodynamics and modern physics' },
    { id: 's6',  name: 'Chemistry',        code: 'CHEM',  teachers: 1, classes: ['Cls 11-B','Cls 12-A'],          periodsPerWeek: 5, status: 'Active',   colorIdx: 5, description: 'Organic, inorganic and physical chemistry' },
    { id: 's7',  name: 'Computer Science', code: 'CS',    teachers: 1, classes: ['Cls 9-B','Cls 10-B','Cls 11-A'],periodsPerWeek: 3, status: 'Active',   colorIdx: 6, description: 'Programming, data structures and algorithms' },
    { id: 's8',  name: 'Geography',        code: 'GEO',   teachers: 1, classes: ['Cls 6-C','Cls 7-D'],            periodsPerWeek: 3, status: 'Active',   colorIdx: 7, description: 'Physical and human geography' },
    { id: 's9',  name: 'Biology',          code: 'BIO',   teachers: 1, classes: ['Cls 11-C','Cls 12-C'],          periodsPerWeek: 5, status: 'Active',   colorIdx: 0, description: 'Botany, zoology and human physiology' },
    { id: 's10', name: 'Hindi',            code: 'HINDI', teachers: 1, classes: ['Cls 1-A','Cls 2-B','Cls 3-C'],  periodsPerWeek: 4, status: 'Active',   colorIdx: 1, description: 'Hindi language, grammar and literature' },
    { id: 's11', name: 'Physical Education',code:'PE',    teachers: 1, classes: ['Cls 5-A','Cls 6-A'],            periodsPerWeek: 2, status: 'Active',   colorIdx: 2, description: 'Sports, fitness and health education' },
    { id: 's12', name: 'Art & Craft',      code: 'ART',   teachers: 1, classes: ['Cls 1-B','Cls 2-A'],            periodsPerWeek: 2, status: 'Inactive', colorIdx: 3, description: 'Drawing, painting and creative arts' },
];

// ─── Add/Edit Modal ───────────────────────────────────────────────────────────
const SubjectModal = ({ subject, onClose, onSave }) => {
    const [name, setName]         = useState(subject?.name || '');
    const [code, setCode]         = useState(subject?.code || '');
    const [desc, setDesc]         = useState(subject?.description || '');
    const [periods, setPeriods]   = useState(subject?.periodsPerWeek || 4);
    const [colorIdx, setColorIdx] = useState(subject?.colorIdx || 0);
    const [loading, setLoading]   = useState(false);

    const handleSave = async () => {
        if (!name.trim() || !code.trim()) return;
        setLoading(true);
        await new Promise(r => setTimeout(r, 700));
        onSave({ name, code, description: desc, periodsPerWeek: periods, colorIdx });
        setLoading(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
                            <BookOpen size={17} className="text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-lg leading-tight">
                                {subject ? 'Edit Subject' : 'Add Subject'}
                            </h3>
                            <p className="text-xs text-slate-500">Fill in the subject details</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Subject Name *</label>
                            <input value={name} onChange={e => setName(e.target.value)}
                                placeholder="e.g. Mathematics"
                                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Code *</label>
                            <input value={code} onChange={e => setCode(e.target.value.toUpperCase())}
                                placeholder="e.g. MATH"
                                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500 font-mono" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                        <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={2}
                            placeholder="Brief description of the subject..."
                            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500 resize-none" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Periods per Week</label>
                        <div className="flex gap-2">
                            {[1,2,3,4,5,6].map(n => (
                                <button key={n} onClick={() => setPeriods(n)}
                                    className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${periods === n ? 'border-blue-500 bg-blue-600 text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                                    {n}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Color</label>
                        <div className="flex gap-2 flex-wrap">
                            {SUBJECT_COLORS.map((c, idx) => (
                                <button key={idx} onClick={() => setColorIdx(idx)}
                                    className={`w-8 h-8 rounded-full ${c.bg} flex items-center justify-center transition-transform hover:scale-110 ${colorIdx === idx ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : ''}`}>
                                    {colorIdx === idx && <Check size={14} className="text-white" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50">Cancel</button>
                    <button onClick={handleSave} disabled={!name || !code || loading}
                        className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-50 transition-colors">
                        {loading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                        {subject ? 'Save Changes' : 'Add Subject'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Subject Card ─────────────────────────────────────────────────────────────
const SubjectCard = ({ subject, onEdit, onDelete }) => {
    const color = SUBJECT_COLORS[subject.colorIdx % SUBJECT_COLORS.length];
    const isActive = subject.status === 'Active';

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden">
            <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-xl ${color.bg} flex items-center justify-center shrink-0`}>
                            <BookOpen size={20} className="text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-base leading-tight">{subject.name}</h3>
                            <span className={`text-xs font-mono font-semibold px-1.5 py-0.5 rounded ${color.light} ${color.text}`}>
                                {subject.code}
                            </span>
                        </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        {subject.status}
                    </span>
                </div>

                {subject.description && (
                    <p className="text-xs text-slate-500 mb-3 leading-relaxed line-clamp-2">{subject.description}</p>
                )}

                {/* Classes assigned */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {subject.classes.slice(0, 4).map(cls => (
                        <span key={cls} className={`px-2 py-0.5 rounded-md text-xs font-medium border ${color.light} ${color.text} ${color.border}`}>
                            {cls}
                        </span>
                    ))}
                    {subject.classes.length > 4 && (
                        <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-500">
                            +{subject.classes.length - 4} more
                        </span>
                    )}
                </div>

                {/* Footer stats */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                            <Users size={12} /> {subject.teachers} teacher{subject.teachers !== 1 ? 's' : ''}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock size={12} /> {subject.periodsPerWeek} periods/wk
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        <button onClick={() => onEdit(subject)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                            <Edit2 size={14} />
                        </button>
                        <button onClick={() => onDelete(subject.id)}
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
export default function SubjectsPage() {
    const [subjects, setSubjects]     = useState(MOCK_SUBJECTS);
    const [search, setSearch]         = useState('');
    const [statusFilter, setStatus]   = useState('All');
    const [showModal, setShowModal]   = useState(false);
    const [editSubject, setEdit]      = useState(null);

    const filtered = useMemo(() => subjects.filter(s => {
        const matchStatus = statusFilter === 'All' || s.status === statusFilter;
        const matchSearch = !search ||
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.code.toLowerCase().includes(search.toLowerCase());
        return matchStatus && matchSearch;
    }), [subjects, search, statusFilter]);

    const handleSave = (data) => {
        if (editSubject) {
            setSubjects(prev => prev.map(s => s.id === editSubject.id ? { ...s, ...data } : s));
        } else {
            setSubjects(prev => [...prev, { id: `s${Date.now()}`, ...data, teachers: 0, classes: [], status: 'Active' }]);
        }
        setEdit(null);
    };

    const handleDelete = (id) => setSubjects(prev => prev.filter(s => s.id !== id));

    const stats = {
        total:    subjects.length,
        active:   subjects.filter(s => s.status === 'Active').length,
        teachers: [...new Set(subjects.flatMap(() => []))].length,
        periods:  subjects.reduce((a, s) => a + s.periodsPerWeek, 0),
    };

    return (
        <div className="max-w-[1300px]">
            {(showModal || editSubject) && (
                <SubjectModal
                    subject={editSubject}
                    onClose={() => { setShowModal(false); setEdit(null); }}
                    onSave={handleSave}
                />
            )}

            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h1 className="text-[1.375rem] font-bold text-slate-900 m-0">Subjects</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage subjects, assignments and schedules</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                        <Download size={15} /> Export
                    </button>
                    <button onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm transition-colors">
                        <Plus size={16} /> Add Subject
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                    { label: 'Total Subjects',   value: stats.total,   icon: <BookOpen size={20} className="text-white" />,       bg: 'bg-blue-500'    },
                    { label: 'Active',           value: stats.active,  icon: <Check size={20} className="text-white" />,           bg: 'bg-emerald-500' },
                    { label: 'Total Periods/wk', value: stats.periods, icon: <Clock size={20} className="text-white" />,           bg: 'bg-violet-500'  },
                    { label: 'Classes Covered',  value: [...new Set(subjects.flatMap(s => s.classes))].length,
                                                                        icon: <Layers size={20} className="text-white" />,          bg: 'bg-amber-500'   },
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
                        placeholder="Search by name or subject, or code..."
                        className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500" />
                </div>
                <div className="flex gap-1.5">
                    {STATUS_OPTIONS.map(s => (
                        <button key={s} onClick={() => setStatus(s)}
                            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${statusFilter === s ? 'bg-blue-600 border-blue-600 text-white font-semibold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Count */}
            <p className="text-sm text-slate-500 mb-4">
                Showing <span className="font-semibold text-slate-700">{filtered.length}</span> subject{filtered.length !== 1 ? 's' : ''}
            </p>

            {/* Grid */}
            {filtered.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-16 text-center">
                    <BookOpen size={36} className="mx-auto mb-3 text-slate-300" />
                    <p className="font-semibold text-slate-600">No subjects found</p>
                    <p className="text-sm text-slate-400 mt-1">Try a different search or add a new subject</p>
                    <button onClick={() => setShowModal(true)}
                        className="mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
                        Add Subject
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filtered.map(subject => (
                        <SubjectCard key={subject.id} subject={subject}
                            onEdit={(s) => { setEdit(s); setShowModal(true); }}
                            onDelete={handleDelete} />
                    ))}
                </div>
            )}
        </div>
    );
}