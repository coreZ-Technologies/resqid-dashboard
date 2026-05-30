'use client';

/**
 * SCHOOL ADMIN — CLASSES
 * Place at: app/(school)/school/classes/page.jsx
 */

import { useState, useMemo } from 'react';
import {
    Users, Plus, Search, Download, Edit2, Trash2,
    BookOpen, Clock, ChevronDown, Loader2, X, Check,
    GraduationCap, Layers, UserCheck, LayoutGrid
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────
const GRADE_GROUPS = ['All', 'Primary', 'Middle', 'Secondary', 'Senior'];
const STATUS_OPTIONS = ['All', 'Active', 'Inactive'];

const GRADE_GROUP_MAP = {
    'Nursery': 'Primary', 'LKG': 'Primary', 'UKG': 'Primary',
    'Cls 1': 'Primary',  'Cls 2': 'Primary',  'Cls 3': 'Primary',  'Cls 4': 'Primary',  'Cls 5': 'Primary',
    'Cls 6': 'Middle',   'Cls 7': 'Middle',   'Cls 8': 'Middle',
    'Cls 9': 'Secondary','Cls 10': 'Secondary',
    'Cls 11': 'Senior',  'Cls 12': 'Senior',
};

const GROUP_COLORS = {
    Primary:   { bg: 'bg-blue-500',   light: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200'   },
    Middle:    { bg: 'bg-violet-500', light: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
    Secondary: { bg: 'bg-emerald-500',light: 'bg-emerald-50',text: 'text-emerald-700',border: 'border-emerald-200'},
    Senior:    { bg: 'bg-amber-500',  light: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200'  },
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_CLASSES = [
    { id: 'c1',  grade: 'Nursery', section: 'A', classTeacher: 'Mrs. Meena Pillai',   students: 30, subjects: ['English','Hindi','Maths'],         room: 'R-01', status: 'Active'   },
    { id: 'c2',  grade: 'Nursery', section: 'B', classTeacher: 'Mrs. Rekha Sharma',   students: 28, subjects: ['English','Hindi','Maths'],         room: 'R-02', status: 'Active'   },
    { id: 'c3',  grade: 'LKG',     section: 'A', classTeacher: 'Ms. Anita Joshi',     students: 32, subjects: ['English','Hindi','Maths','EVS'],   room: 'R-03', status: 'Active'   },
    { id: 'c4',  grade: 'Cls 1',   section: 'A', classTeacher: 'Mrs. Kavita Reddy',   students: 35, subjects: ['English','Hindi','Maths','EVS','Arts'], room: 'R-10', status: 'Active'},
    { id: 'c5',  grade: 'Cls 1',   section: 'B', classTeacher: 'Mr. Rajesh Nair',     students: 35, subjects: ['English','Hindi','Maths','EVS'],   room: 'R-11', status: 'Active'   },
    { id: 'c6',  grade: 'Cls 5',   section: 'A', classTeacher: 'Mrs. Sunita Das',     students: 38, subjects: ['English','Hindi','Maths','Science','Social'], room: 'R-20', status: 'Active'},
    { id: 'c7',  grade: 'Cls 6',   section: 'A', classTeacher: 'Mr. Arjun Verma',     students: 36, subjects: ['English','Hindi','Maths','Science','History','Geography'], room: 'R-30', status: 'Active'},
    { id: 'c8',  grade: 'Cls 6',   section: 'B', classTeacher: 'Ms. Divya Joshi',     students: 35, subjects: ['English','Hindi','Maths','Science','History'], room: 'R-31', status: 'Active'},
    { id: 'c9',  grade: 'Cls 7',   section: 'A', classTeacher: 'Mr. Suresh Kumar',    students: 35, subjects: ['Mathematics','English','Science','History','Geography'], room: 'R-32', status: 'Active'},
    { id: 'c10', grade: 'Cls 7',   section: 'B', classTeacher: 'Ms. Priya Nair',      students: 35, subjects: ['Mathematics','English','Science','History'], room: 'R-33', status: 'Active'},
    { id: 'c11', grade: 'Cls 7',   section: 'C', classTeacher: 'Mr. Vikram Mehta',    students: 33, subjects: ['Mathematics','English','Science','History','CS'], room: 'R-34', status: 'Active'},
    { id: 'c12', grade: 'Cls 8',   section: 'A', classTeacher: 'Mrs. Ananya Reddy',   students: 34, subjects: ['Mathematics','English','Science','History','CS'], room: 'R-40', status: 'Active'},
    { id: 'c13', grade: 'Cls 9',   section: 'A', classTeacher: 'Mr. Amit Das',        students: 33, subjects: ['Mathematics','English','Physics','Chemistry','Biology'], room: 'R-50', status: 'Active'},
    { id: 'c14', grade: 'Cls 9',   section: 'B', classTeacher: 'Mrs. Geeta Sharma',   students: 32, subjects: ['Mathematics','English','Physics','Chemistry','CS'], room: 'R-51', status: 'Active'},
    { id: 'c15', grade: 'Cls 10',  section: 'A', classTeacher: 'Mr. Suresh Kumar',    students: 32, subjects: ['Mathematics','English','Physics','Chemistry','Biology'], room: 'R-52', status: 'Active'},
    { id: 'c16', grade: 'Cls 11',  section: 'A', classTeacher: 'Dr. Suresh Nair',     students: 30, subjects: ['Physics','Chemistry','Mathematics','English'], room: 'R-60', status: 'Active'},
    { id: 'c17', grade: 'Cls 11',  section: 'B', classTeacher: 'Ms. Sunita Roy',      students: 28, subjects: ['Biology','Chemistry','Mathematics','English'], room: 'R-61', status: 'Active'},
    { id: 'c18', grade: 'Cls 12',  section: 'A', classTeacher: 'Mr. Arjun Verma',     students: 27, subjects: ['Physics','Chemistry','Mathematics','English'], room: 'R-62', status: 'Active'},
    { id: 'c19', grade: 'Cls 12',  section: 'B', classTeacher: 'Mrs. Meera Shah',     students: 25, subjects: ['Biology','Chemistry','Mathematics','English'], room: 'R-63', status: 'Inactive'},
];

// ─── Add/Edit Modal ───────────────────────────────────────────────────────────
const ClassModal = ({ cls, onClose, onSave }) => {
    const GRADES = ['Nursery','LKG','UKG','Cls 1','Cls 2','Cls 3','Cls 4','Cls 5','Cls 6','Cls 7','Cls 8','Cls 9','Cls 10','Cls 11','Cls 12'];
    const [grade, setGrade]     = useState(cls?.grade || '');
    const [section, setSection] = useState(cls?.section || '');
    const [teacher, setTeacher] = useState(cls?.classTeacher || '');
    const [room, setRoom]       = useState(cls?.room || '');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!grade || !section) return;
        setLoading(true);
        await new Promise(r => setTimeout(r, 700));
        onSave({ grade, section, classTeacher: teacher, room });
        setLoading(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
                            <LayoutGrid size={17} className="text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-lg leading-tight">{cls ? 'Edit Class' : 'Add Class'}</h3>
                            <p className="text-xs text-slate-500">Fill in the class details</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                </div>

                <div className="p-6 space-y-4">
                    {/* Grade */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Grade *</label>
                        <div className="relative">
                            <select value={grade} onChange={e => setGrade(e.target.value)}
                                className="w-full appearance-none border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500 bg-white cursor-pointer">
                                <option value="">Select grade</option>
                                {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Section */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Section *</label>
                        <div className="flex gap-2">
                            {['A','B','C','D','E'].map(s => (
                                <button key={s} onClick={() => setSection(s)}
                                    className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${section === s ? 'border-blue-500 bg-blue-600 text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Class Teacher */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Class Teacher</label>
                        <input value={teacher} onChange={e => setTeacher(e.target.value)}
                            placeholder="e.g. Mr. Rajesh Kumar"
                            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500" />
                    </div>

                    {/* Room */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Room Number</label>
                        <input value={room} onChange={e => setRoom(e.target.value)}
                            placeholder="e.g. R-01"
                            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500" />
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50">Cancel</button>
                    <button onClick={handleSave} disabled={!grade || !section || loading}
                        className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-50 transition-colors">
                        {loading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                        {cls ? 'Save Changes' : 'Add Class'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Class Card ───────────────────────────────────────────────────────────────
const ClassCard = ({ cls, onEdit, onDelete }) => {
    const group = GRADE_GROUP_MAP[cls.grade] || 'Primary';
    const color = GROUP_COLORS[group];
    const isActive = cls.status === 'Active';

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden">
            <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl ${color.bg} flex items-center justify-center shrink-0`}>
                            <span className="text-white font-bold text-base">{cls.grade.replace('Cls ', '')}{cls.section}</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-base leading-tight">
                                {cls.grade === 'Nursery' || cls.grade === 'LKG' || cls.grade === 'UKG'
                                    ? `${cls.grade}–${cls.section}`
                                    : `${cls.grade}–${cls.section}`}
                            </h3>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${color.light} ${color.text}`}>
                                {group}
                            </span>
                        </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        {cls.status}
                    </span>
                </div>

                {/* Class teacher */}
                <div className="flex items-center gap-1.5 mb-3 text-sm text-slate-600">
                    <UserCheck size={13} className="text-slate-400 shrink-0" />
                    <span className="font-medium truncate">{cls.classTeacher}</span>
                </div>

                {/* Subjects */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {cls.subjects.slice(0, 4).map(sub => (
                        <span key={sub} className={`px-2 py-0.5 rounded-md text-xs font-medium border ${color.light} ${color.text} ${color.border}`}>
                            {sub}
                        </span>
                    ))}
                    {cls.subjects.length > 4 && (
                        <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-500">
                            +{cls.subjects.length - 4} more
                        </span>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                            <Users size={12} /> {cls.students} students
                        </span>
                        {cls.room && (
                            <span className="flex items-center gap-1">
                                <LayoutGrid size={12} /> {cls.room}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-1">
                        <button onClick={() => onEdit(cls)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                            <Edit2 size={14} />
                        </button>
                        <button onClick={() => onDelete(cls.id)}
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
export default function ClassesPage() {
    const [classes, setClasses]       = useState(MOCK_CLASSES);
    const [search, setSearch]         = useState('');
    const [gradeGroup, setGradeGroup] = useState('All');
    const [statusFilter, setStatus]   = useState('All');
    const [showModal, setShowModal]   = useState(false);
    const [editCls, setEditCls]       = useState(null);

    const filtered = useMemo(() => classes.filter(c => {
        const group = GRADE_GROUP_MAP[c.grade] || 'Primary';
        const matchGroup  = gradeGroup === 'All' || group === gradeGroup;
        const matchStatus = statusFilter === 'All' || c.status === statusFilter;
        const matchSearch = !search ||
            c.grade.toLowerCase().includes(search.toLowerCase()) ||
            c.section.toLowerCase().includes(search.toLowerCase()) ||
            (c.classTeacher || '').toLowerCase().includes(search.toLowerCase()) ||
            `${c.grade}-${c.section}`.toLowerCase().includes(search.toLowerCase());
        return matchGroup && matchStatus && matchSearch;
    }), [classes, search, gradeGroup, statusFilter]);

    const handleSave = (data) => {
        if (editCls) {
            setClasses(prev => prev.map(c => c.id === editCls.id ? { ...c, ...data } : c));
        } else {
            setClasses(prev => [...prev, {
                id: `c${Date.now()}`, ...data,
                students: 0, subjects: [], status: 'Active'
            }]);
        }
        setEditCls(null);
    };

    const handleDelete = (id) => setClasses(prev => prev.filter(c => c.id !== id));

    const totalStudents = classes.reduce((a, c) => a + c.students, 0);

    return (
        <div className="max-w-[1300px]">
            {(showModal || editCls) && (
                <ClassModal
                    cls={editCls}
                    onClose={() => { setShowModal(false); setEditCls(null); }}
                    onSave={handleSave}
                />
            )}

            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h1 className="text-[1.375rem] font-bold text-slate-900 m-0">Classes</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage class groups, teachers and assignments</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                        <Download size={15} /> Export
                    </button>
                    <button onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm transition-colors">
                        <Plus size={16} /> Add Class
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                    { label: 'Total Classes',   value: classes.length,   icon: <LayoutGrid size={20} className="text-white" />,     bg: 'bg-blue-500'    },
                    { label: 'Total Students',  value: totalStudents,    icon: <Users size={20} className="text-white" />,           bg: 'bg-emerald-500' },
                    { label: 'Active Classes',  value: classes.filter(c => c.status === 'Active').length,
                                                                          icon: <Check size={20} className="text-white" />,           bg: 'bg-violet-500'  },
                    { label: 'Grade Groups',    value: 4,                icon: <GraduationCap size={20} className="text-white" />,   bg: 'bg-amber-500'   },
                ].map(({ label, value, icon, bg }) => (
                    <div key={label} className="bg-white rounded-xl border border-slate-200 shadow-sm px-5 py-4 flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center shrink-0`}>{icon}</div>
                        <div>
                            <div className="text-2xl font-bold text-slate-900">{value.toLocaleString('en-IN')}</div>
                            <div className="text-xs text-slate-500">{label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3 mb-5 flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search by grade, section, or teacher..."
                        className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500" />
                </div>

                {/* Grade group tabs */}
                <div className="flex gap-1.5 flex-wrap">
                    {GRADE_GROUPS.map(g => (
                        <button key={g} onClick={() => setGradeGroup(g)}
                            className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${gradeGroup === g ? 'bg-blue-600 border-blue-600 text-white font-semibold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                            {g}
                        </button>
                    ))}
                </div>

                {/* Status */}
                <div className="flex gap-1.5">
                    {STATUS_OPTIONS.map(s => (
                        <button key={s} onClick={() => setStatus(s)}
                            className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${statusFilter === s ? 'bg-slate-800 border-slate-800 text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Count */}
            <p className="text-sm text-slate-500 mb-4">
                Showing <span className="font-semibold text-slate-700">{filtered.length}</span> class{filtered.length !== 1 ? 'es' : ''}
            </p>

            {/* Grid */}
            {filtered.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-16 text-center">
                    <LayoutGrid size={36} className="mx-auto mb-3 text-slate-300" />
                    <p className="font-semibold text-slate-600">No classes found</p>
                    <p className="text-sm text-slate-400 mt-1">Try a different filter or add a new class</p>
                    <button onClick={() => setShowModal(true)}
                        className="mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
                        Add Class
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filtered.map(cls => (
                        <ClassCard key={cls.id} cls={cls}
                            onEdit={(c) => { setEditCls(c); setShowModal(true); }}
                            onDelete={handleDelete} />
                    ))}
                </div>
            )}
        </div>
    );
}