'use client';

/**
 * SCHOOL ADMIN — SUBJECTS
 * Notion-inspired UI · Violet Accent System
 */

import { useState, useMemo, useRef, useEffect } from 'react';
import {
    BookOpen, Plus, Search, Download, Edit2, Trash2,
    Users, Clock, Loader2, X, Check, ChevronDown,
    Hash, MoreHorizontal, GripVertical, Sparkles,
    Filter, ArrowUpDown
} from 'lucide-react';

/* ─── DESIGN TOKENS ──────────────────────────────────────────── */
const T = {
    violet50:  '#f5f3ff',
    violet100: '#ede9fe',
    violet200: '#ddd6fe',
    violet400: '#a78bfa',
    violet500: '#8b5cf6',
    violet600: '#7c3aed',
    violet700: '#6d28d9',
    surface:   '#ffffff',
    bg:        '#fbfaff',
    border:    '#ede9fe',
    borderSoft:'#f0edfb',
    text:      '#1c1026',
    textMid:   '#4b3d6e',
    textSoft:  '#8e82a8',
    textXSoft: '#b8afd1',
    red:       '#ef4444',
    green:     '#10b981',
};

const STATUS_OPTIONS = ['All', 'Active', 'Inactive'];
const SORT_OPTIONS   = ['Name', 'Code', 'Periods'];

const MOCK_SUBJECTS = [
    { id: 's1',  name: 'Mathematics',       code: 'MATH',  teachers: 2, classes: ['Cls 8-A','Cls 9-B','Cls 10-A'], periodsPerWeek: 5, status: 'Active',   description: 'Algebra, geometry, calculus and statistics' },
    { id: 's2',  name: 'English',           code: 'ENG',   teachers: 2, classes: ['Cls 6-A','Cls 7-B','Cls 8-A'],  periodsPerWeek: 5, status: 'Active',   description: 'Language, literature, grammar and writing' },
    { id: 's3',  name: 'Science',           code: 'SCI',   teachers: 1, classes: ['Cls 6-B','Cls 7-A','Cls 8-B'],  periodsPerWeek: 4, status: 'Active',   description: 'Physics, chemistry and biology fundamentals' },
    { id: 's4',  name: 'History',           code: 'HIST',  teachers: 1, classes: ['Cls 7-C','Cls 9-A'],            periodsPerWeek: 3, status: 'Active',   description: 'World and Indian history, civics' },
    { id: 's5',  name: 'Physics',           code: 'PHY',   teachers: 1, classes: ['Cls 11-A','Cls 12-B'],          periodsPerWeek: 5, status: 'Active',   description: 'Mechanics, optics, thermodynamics and modern physics' },
    { id: 's6',  name: 'Chemistry',         code: 'CHEM',  teachers: 1, classes: ['Cls 11-B','Cls 12-A'],          periodsPerWeek: 5, status: 'Active',   description: 'Organic, inorganic and physical chemistry' },
    { id: 's7',  name: 'Computer Science',  code: 'CS',    teachers: 1, classes: ['Cls 9-B','Cls 10-B','Cls 11-A'],periodsPerWeek: 3, status: 'Active',   description: 'Programming, data structures and algorithms' },
    { id: 's8',  name: 'Geography',         code: 'GEO',   teachers: 1, classes: ['Cls 6-C','Cls 7-D'],            periodsPerWeek: 3, status: 'Active',   description: 'Physical and human geography' },
    { id: 's9',  name: 'Biology',           code: 'BIO',   teachers: 1, classes: ['Cls 11-C','Cls 12-C'],          periodsPerWeek: 5, status: 'Active',   description: 'Botany, zoology and human physiology' },
    { id: 's10', name: 'Hindi',             code: 'HINDI', teachers: 1, classes: ['Cls 1-A','Cls 2-B','Cls 3-C'],  periodsPerWeek: 4, status: 'Active',   description: 'Hindi language, grammar and literature' },
    { id: 's11', name: 'Physical Education',code: 'PE',    teachers: 1, classes: ['Cls 5-A','Cls 6-A'],            periodsPerWeek: 2, status: 'Active',   description: 'Sports, fitness and health education' },
    { id: 's12', name: 'Art & Craft',       code: 'ART',   teachers: 1, classes: ['Cls 1-B','Cls 2-A'],            periodsPerWeek: 2, status: 'Inactive', description: 'Drawing, painting and creative arts' },
];

/* ─── NOTION PROPERTY PILL ───────────────────────────────────── */
const Prop = ({ icon: Icon, label, value, violet }) => (
    <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        fontSize: 11, color: violet ? T.violet600 : T.textMid,
        background: violet ? T.violet50 : '#f6f4fb',
        padding: '3px 8px', borderRadius: 5,
        fontWeight: violet ? 600 : 400,
        letterSpacing: violet ? '0.01em' : 0,
    }}>
        {Icon && <Icon size={11} strokeWidth={2.2} />}
        {label && <span style={{ color: T.textXSoft, marginRight: 2 }}>{label}</span>}
        {value}
    </div>
);

/* ─── STATUS TAG ─────────────────────────────────────────────── */
const StatusTag = ({ status }) => (
    <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        fontSize: 11, fontWeight: 500,
        color: status === 'Active' ? T.violet600 : T.textXSoft,
        background: status === 'Active' ? T.violet100 : '#f3f2f7',
        padding: '2px 8px', borderRadius: 20,
    }}>
        <span style={{
            width: 5, height: 5, borderRadius: '50%',
            background: status === 'Active' ? T.violet500 : T.textXSoft,
            display: 'inline-block',
        }} />
        {status}
    </span>
);

/* ─── CLASS CHIPS ────────────────────────────────────────────── */
const ClassChips = ({ classes }) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
        {classes.slice(0, 3).map(cls => (
            <span key={cls} style={{
                fontSize: 10, color: T.textMid,
                background: T.violet50,
                border: `1px solid ${T.violet200}`,
                padding: '2px 7px', borderRadius: 4,
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 500,
            }}>{cls}</span>
        ))}
        {classes.length > 3 && (
            <span style={{
                fontSize: 10, color: T.textXSoft,
                padding: '2px 6px',
            }}>+{classes.length - 3} more</span>
        )}
    </div>
);

/* ─── MODAL ──────────────────────────────────────────────────── */
const SubjectModal = ({ subject, onClose, onSave }) => {
    const [name, setName]       = useState(subject?.name || '');
    const [code, setCode]       = useState(subject?.code || '');
    const [desc, setDesc]       = useState(subject?.description || '');
    const [periods, setPeriods] = useState(subject?.periodsPerWeek || 4);
    const [loading, setLoading] = useState(false);
    const overlayRef = useRef();

    const handleSave = async () => {
        if (!name.trim() || !code.trim()) return;
        setLoading(true);
        await new Promise(r => setTimeout(r, 650));
        onSave({ name, code, description: desc, periodsPerWeek: periods });
        setLoading(false);
        onClose();
    };

    return (
        <div
            ref={overlayRef}
            onClick={e => e.target === overlayRef.current && onClose()}
            style={{
                position: 'fixed', inset: 0,
                background: 'rgba(28,16,38,0.28)',
                backdropFilter: 'blur(2px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 1000, padding: 16,
            }}
        >
            <div style={{
                background: T.surface,
                borderRadius: 12,
                width: '100%', maxWidth: 460,
                boxShadow: '0 24px 64px rgba(124,58,237,0.15), 0 4px 16px rgba(0,0,0,0.08)',
                border: `1px solid ${T.border}`,
                overflow: 'hidden',
            }}>
                {/* Header */}
                <div style={{
                    padding: '16px 20px 14px',
                    borderBottom: `1px solid ${T.borderSoft}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: `linear-gradient(135deg, ${T.violet50} 0%, ${T.surface} 100%)`,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                            width: 32, height: 32, borderRadius: 8,
                            background: `linear-gradient(135deg, ${T.violet500}, ${T.violet700})`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <BookOpen size={16} color="#fff" strokeWidth={2} />
                        </div>
                        <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>
                                {subject ? 'Edit subject' : 'New subject'}
                            </div>
                            <div style={{ fontSize: 11, color: T.textSoft }}>
                                {subject ? 'Update subject properties' : 'Add to curriculum'}
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} style={{
                        width: 28, height: 28, borderRadius: 6,
                        border: `1px solid ${T.border}`,
                        background: 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', color: T.textSoft,
                    }}>
                        <X size={14} />
                    </button>
                </div>

                {/* Body */}
                <div style={{ padding: '20px 20px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {/* Name + Code row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        {[
                            { label: 'Subject name', val: name, set: setName, ph: 'Mathematics', mono: false },
                            { label: 'Subject code', val: code, set: v => setCode(v.toUpperCase()), ph: 'MATH', mono: true },
                        ].map(({ label, val, set, ph, mono }) => (
                            <div key={label}>
                                <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: T.textSoft, marginBottom: 5 }}>
                                    {label}
                                </label>
                                <input
                                    value={val}
                                    onChange={e => set(e.target.value)}
                                    placeholder={ph}
                                    style={{
                                        width: '100%', boxSizing: 'border-box',
                                        padding: '7px 10px',
                                        fontSize: mono ? 12 : 13,
                                        fontFamily: mono ? "'JetBrains Mono', monospace" : 'inherit',
                                        fontWeight: mono ? 600 : 400,
                                        color: T.text,
                                        border: `1.5px solid ${T.border}`,
                                        borderRadius: 7,
                                        background: T.bg,
                                        outline: 'none',
                                        letterSpacing: mono ? '0.06em' : 0,
                                    }}
                                    onFocus={e => e.target.style.borderColor = T.violet400}
                                    onBlur={e  => e.target.style.borderColor = T.border}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Description */}
                    <div>
                        <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: T.textSoft, marginBottom: 5 }}>
                            Description
                        </label>
                        <textarea
                            value={desc}
                            onChange={e => setDesc(e.target.value)}
                            rows={2}
                            placeholder="A brief description of this subject..."
                            style={{
                                width: '100%', boxSizing: 'border-box',
                                padding: '7px 10px', fontSize: 13,
                                color: T.text, resize: 'none',
                                border: `1.5px solid ${T.border}`,
                                borderRadius: 7, background: T.bg,
                                outline: 'none', lineHeight: 1.5,
                                fontFamily: 'inherit',
                            }}
                            onFocus={e => e.target.style.borderColor = T.violet400}
                            onBlur={e  => e.target.style.borderColor = T.border}
                        />
                    </div>

                    {/* Periods/week */}
                    <div>
                        <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: T.textSoft, marginBottom: 8 }}>
                            Periods per week
                        </label>
                        <div style={{ display: 'flex', gap: 6 }}>
                            {[1,2,3,4,5,6].map(n => (
                                <button
                                    key={n}
                                    onClick={() => setPeriods(n)}
                                    style={{
                                        flex: 1, padding: '6px 0', fontSize: 13, fontWeight: 600,
                                        borderRadius: 7, cursor: 'pointer',
                                        border: periods === n ? `1.5px solid ${T.violet400}` : `1.5px solid ${T.border}`,
                                        background: periods === n ? T.violet100 : T.bg,
                                        color: periods === n ? T.violet700 : T.textSoft,
                                        transition: 'all 0.15s',
                                    }}
                                >
                                    {n}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    padding: '12px 20px',
                    borderTop: `1px solid ${T.borderSoft}`,
                    display: 'flex', justifyContent: 'flex-end', gap: 8,
                    background: '#fdfcff',
                }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '7px 14px', fontSize: 13, fontWeight: 500,
                            color: T.textMid, background: 'transparent',
                            border: `1.5px solid ${T.border}`,
                            borderRadius: 7, cursor: 'pointer',
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!name || !code || loading}
                        style={{
                            padding: '7px 18px', fontSize: 13, fontWeight: 600,
                            color: '#fff',
                            background: !name || !code || loading
                                ? T.violet200
                                : `linear-gradient(135deg, ${T.violet500}, ${T.violet700})`,
                            border: 'none', borderRadius: 7, cursor: loading ? 'wait' : 'pointer',
                            display: 'flex', alignItems: 'center', gap: 6,
                            boxShadow: !name || !code ? 'none' : `0 2px 12px rgba(124,58,237,0.3)`,
                            transition: 'opacity 0.15s',
                        }}
                    >
                        {loading
                            ? <Loader2 size={13} style={{ animation: 'spin 0.8s linear infinite' }} />
                            : <Check size={13} strokeWidth={2.5} />}
                        {subject ? 'Save changes' : 'Create subject'}
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ─── SUBJECT CARD (Notion DB row card) ──────────────────────── */
const SubjectCard = ({ subject, onEdit, onDelete }) => {
    const [hover, setHover] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => { setHover(false); setMenuOpen(false); }}
            style={{
                background: T.surface,
                border: `1.5px solid ${hover ? T.violet200 : T.borderSoft}`,
                borderRadius: 10,
                padding: '14px 16px',
                position: 'relative',
                transition: 'all 0.15s',
                boxShadow: hover
                    ? `0 4px 20px rgba(124,58,237,0.10), 0 1px 4px rgba(0,0,0,0.04)`
                    : '0 1px 3px rgba(0,0,0,0.04)',
                cursor: 'default',
            }}
        >
            {/* Grip + title row */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <div style={{
                    marginTop: 2, opacity: hover ? 0.3 : 0,
                    transition: 'opacity 0.15s', flexShrink: 0,
                }}>
                    <GripVertical size={13} color={T.textSoft} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Name + Code */}
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, flexWrap: 'wrap' }}>
                        <span style={{
                            fontSize: 14, fontWeight: 600, color: T.text,
                            lineHeight: 1.3,
                        }}>
                            {subject.name}
                        </span>
                        <span style={{
                            fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
                            color: T.violet500,
                            background: T.violet50,
                            padding: '1px 6px', borderRadius: 4,
                            fontFamily: "'JetBrains Mono', monospace",
                            border: `1px solid ${T.violet100}`,
                        }}>
                            {subject.code}
                        </span>
                    </div>

                    {/* Description */}
                    {subject.description && (
                        <p style={{
                            fontSize: 12, color: T.textSoft,
                            marginTop: 4, lineHeight: 1.5,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}>
                            {subject.description}
                        </p>
                    )}

                    {/* Class chips */}
                    <ClassChips classes={subject.classes} />

                    {/* Property row */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 10 }}>
                        <StatusTag status={subject.status} />
                        <Prop icon={Users} value={`${subject.teachers} ${subject.teachers === 1 ? 'teacher' : 'teachers'}`} />
                        <Prop icon={Clock} value={`${subject.periodsPerWeek} per wk`} violet />
                    </div>
                </div>

                {/* Actions */}
                <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                    opacity: hover ? 1 : 0, transition: 'opacity 0.15s', flexShrink: 0,
                }}>
                    <button
                        onClick={() => onEdit(subject)}
                        title="Edit"
                        style={{
                            width: 26, height: 26, borderRadius: 6,
                            border: `1px solid ${T.border}`,
                            background: T.surface,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', color: T.textSoft,
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = T.violet600}
                        onMouseLeave={e => e.currentTarget.style.color = T.textSoft}
                    >
                        <Edit2 size={12} />
                    </button>
                    <button
                        onClick={() => onDelete(subject.id)}
                        title="Delete"
                        style={{
                            width: 26, height: 26, borderRadius: 6,
                            border: `1px solid ${T.border}`,
                            background: T.surface,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', color: T.textSoft,
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = T.red}
                        onMouseLeave={e => e.currentTarget.style.color = T.textSoft}
                    >
                        <Trash2 size={12} />
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ─── STAT CARD ──────────────────────────────────────────────── */
const StatCard = ({ value, label, sub }) => (
    <div style={{
        background: T.surface,
        border: `1.5px solid ${T.borderSoft}`,
        borderRadius: 10,
        padding: '14px 18px',
        minWidth: 0,
    }}>
        <div style={{ fontSize: 26, fontWeight: 700, color: T.violet600, lineHeight: 1, letterSpacing: '-0.02em' }}>
            {value}
        </div>
        <div style={{ fontSize: 12, color: T.textSoft, marginTop: 4, fontWeight: 500 }}>{label}</div>
        {sub && <div style={{ fontSize: 10, color: T.textXSoft, marginTop: 2 }}>{sub}</div>}
    </div>
);

/* ─── MAIN PAGE ──────────────────────────────────────────────── */
export default function SubjectsPage() {
    const [subjects, setSubjects]   = useState(MOCK_SUBJECTS);
    const [search, setSearch]       = useState('');
    const [statusFilter, setStatus] = useState('All');
    const [sortBy, setSortBy]       = useState('Name');
    const [showModal, setShowModal] = useState(false);
    const [editSubject, setEdit]    = useState(null);

    const filtered = useMemo(() => {
        let list = subjects.filter(s => {
            const ok1 = statusFilter === 'All' || s.status === statusFilter;
            const ok2 = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.code.toLowerCase().includes(search.toLowerCase());
            return ok1 && ok2;
        });
        if (sortBy === 'Name')    list = [...list].sort((a,b) => a.name.localeCompare(b.name));
        if (sortBy === 'Code')    list = [...list].sort((a,b) => a.code.localeCompare(b.code));
        if (sortBy === 'Periods') list = [...list].sort((a,b) => b.periodsPerWeek - a.periodsPerWeek);
        return list;
    }, [subjects, search, statusFilter, sortBy]);

    const handleSave = (data) => {
        if (editSubject) {
            setSubjects(prev => prev.map(s => s.id === editSubject.id ? { ...s, ...data } : s));
        } else {
            setSubjects(prev => [...prev, {
                id: `s${Date.now()}`, ...data,
                teachers: 0, classes: [], status: 'Active',
            }]);
        }
        setEdit(null);
    };

    const handleDelete = (id) => setSubjects(prev => prev.filter(s => s.id !== id));

    const stats = {
        total:   subjects.length,
        active:  subjects.filter(s => s.status === 'Active').length,
        periods: subjects.reduce((a, s) => a + s.periodsPerWeek, 0),
        classes: [...new Set(subjects.flatMap(s => s.classes))].length,
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: T.bg,
            fontFamily: "'Geist', 'DM Sans', system-ui, sans-serif",
            color: T.text,
        }}>
            {/* Subtle top gradient bar */}
            <div style={{
                height: 3,
                background: `linear-gradient(90deg, ${T.violet400}, ${T.violet600}, ${T.violet400})`,
            }} />

            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px 48px' }}>

                {(showModal || editSubject) && (
                    <SubjectModal
                        subject={editSubject}
                        onClose={() => { setShowModal(false); setEdit(null); }}
                        onSave={handleSave}
                    />
                )}

                {/* ── Page header ── */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                            <div style={{
                                width: 36, height: 36, borderRadius: 9,
                                background: `linear-gradient(135deg, ${T.violet500}, ${T.violet700})`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: `0 4px 12px rgba(124,58,237,0.3)`,
                            }}>
                                <BookOpen size={18} color="#fff" strokeWidth={2} />
                            </div>
                            <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', color: T.text }}>
                                Subjects
                            </h1>
                        </div>
                        <p style={{ fontSize: 13, color: T.textSoft, marginLeft: 46 }}>
                            Manage curriculum subjects and their properties
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button
                            style={{
                                display: 'flex', alignItems: 'center', gap: 6,
                                padding: '8px 14px', fontSize: 13, fontWeight: 500,
                                color: T.textMid,
                                background: T.surface,
                                border: `1.5px solid ${T.border}`,
                                borderRadius: 8, cursor: 'pointer',
                            }}
                        >
                            <Download size={13} /> Export
                        </button>
                        <button
                            onClick={() => { setEdit(null); setShowModal(true); }}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 6,
                                padding: '8px 16px', fontSize: 13, fontWeight: 600,
                                color: '#fff',
                                background: `linear-gradient(135deg, ${T.violet500}, ${T.violet700})`,
                                border: 'none', borderRadius: 8, cursor: 'pointer',
                                boxShadow: `0 2px 12px rgba(124,58,237,0.35)`,
                            }}
                        >
                            <Plus size={14} strokeWidth={2.5} /> New subject
                        </button>
                    </div>
                </div>

                {/* ── Stats grid ── */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: 12, marginBottom: 24,
                }}>
                    <StatCard value={stats.total}   label="Total subjects"   />
                    <StatCard value={stats.active}  label="Active"           sub={`${stats.total - stats.active} inactive`} />
                    <StatCard value={stats.periods} label="Weekly periods"   sub="across all subjects" />
                    <StatCard value={stats.classes} label="Classes covered"  />
                </div>

                {/* ── Toolbar ── */}
                <div style={{
                    background: T.surface,
                    border: `1.5px solid ${T.borderSoft}`,
                    borderRadius: 10,
                    padding: '10px 14px',
                    display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8,
                    marginBottom: 16,
                }}>
                    {/* Search */}
                    <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 180 }}>
                        <Search size={13} style={{
                            position: 'absolute', left: 9, top: '50%',
                            transform: 'translateY(-50%)', color: T.textXSoft,
                        }} />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search by name or code..."
                            style={{
                                width: '100%', boxSizing: 'border-box',
                                paddingLeft: 28, paddingRight: 10, paddingTop: 6, paddingBottom: 6,
                                fontSize: 13, color: T.text,
                                background: T.bg,
                                border: `1.5px solid ${T.border}`,
                                borderRadius: 7, outline: 'none',
                            }}
                            onFocus={e => e.target.style.borderColor = T.violet400}
                            onBlur={e  => e.target.style.borderColor = T.border}
                        />
                    </div>

                    {/* Status filter */}
                    <div style={{ display: 'flex', background: T.bg, borderRadius: 7, border: `1.5px solid ${T.border}`, overflow: 'hidden' }}>
                        {STATUS_OPTIONS.map(s => (
                            <button
                                key={s}
                                onClick={() => setStatus(s)}
                                style={{
                                    padding: '5px 12px', fontSize: 12, fontWeight: 500,
                                    border: 'none', cursor: 'pointer',
                                    background: statusFilter === s ? T.violet100 : 'transparent',
                                    color: statusFilter === s ? T.violet700 : T.textSoft,
                                    transition: 'all 0.12s',
                                }}
                            >
                                {s}
                            </button>
                        ))}
                    </div>

                    {/* Sort */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <ArrowUpDown size={12} color={T.textXSoft} />
                        <span style={{ fontSize: 12, color: T.textSoft }}>Sort:</span>
                        <div style={{ display: 'flex', background: T.bg, borderRadius: 7, border: `1.5px solid ${T.border}`, overflow: 'hidden' }}>
                            {SORT_OPTIONS.map(s => (
                                <button
                                    key={s}
                                    onClick={() => setSortBy(s)}
                                    style={{
                                        padding: '5px 10px', fontSize: 12, fontWeight: 500,
                                        border: 'none', cursor: 'pointer',
                                        background: sortBy === s ? T.violet100 : 'transparent',
                                        color: sortBy === s ? T.violet700 : T.textSoft,
                                        transition: 'all 0.12s',
                                    }}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ flex: 1 }} />
                    <span style={{ fontSize: 12, color: T.textXSoft }}>
                        {filtered.length} {filtered.length === 1 ? 'subject' : 'subjects'}
                    </span>
                </div>

                {/* ── Grid ── */}
                {filtered.length === 0 ? (
                    <div style={{
                        background: T.surface,
                        border: `1.5px dashed ${T.border}`,
                        borderRadius: 12,
                        padding: '60px 32px',
                        textAlign: 'center',
                    }}>
                        <div style={{
                            width: 52, height: 52, borderRadius: 12,
                            background: T.violet50,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 14px',
                        }}>
                            <BookOpen size={24} color={T.violet400} />
                        </div>
                        <p style={{ fontSize: 14, fontWeight: 600, color: T.textMid, marginBottom: 6 }}>
                            No subjects found
                        </p>
                        <p style={{ fontSize: 13, color: T.textSoft, marginBottom: 16 }}>
                            Try adjusting your filters or add a new subject.
                        </p>
                        <button
                            onClick={() => { setEdit(null); setShowModal(true); }}
                            style={{
                                padding: '8px 18px', fontSize: 13, fontWeight: 600,
                                color: T.violet700,
                                background: T.violet100,
                                border: `1.5px solid ${T.violet200}`,
                                borderRadius: 8, cursor: 'pointer',
                            }}
                        >
                            + Add subject
                        </button>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: 12,
                    }}>
                        {filtered.map(subject => (
                            <SubjectCard
                                key={subject.id}
                                subject={subject}
                                onEdit={s => { setEdit(s); setShowModal(true); }}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}

                {/* Keyframes for spinner */}
                <style>{`
                    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600;700&display=swap');
                    @keyframes spin { to { transform: rotate(360deg); } }
                `}</style>
            </div>
        </div>
    );
}