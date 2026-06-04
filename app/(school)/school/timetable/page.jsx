'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Calendar, Clock, Users, BookOpen, CheckCircle, XCircle,
    AlertCircle, RefreshCw, Download, Upload, Save, Eye,
    Edit2, Trash2, Plus, Search, Filter, ChevronLeft,
    ChevronRight, ChevronDown, Settings, Printer, Share2,
    GraduationCap, UserCheck, UserX, AlertTriangle, Check,
    X, Loader2, GripVertical, ArrowLeftRight, Repeat,
    Bell, MessageCircle, Zap, Shield, Target, Activity,
    Move, LayoutGrid, List, Coffee, Sun, Lock, Unlock
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Day structure: periods + breaks in order
const DAY_SLOTS = [
    { id: 1, label: '1st Period', time: '08:00–08:45', type: 'PERIOD' },
    { id: 2, label: '2nd Period', time: '08:45–09:30', type: 'PERIOD' },
    { id: 3, label: '3rd Period', time: '09:30–10:15', type: 'PERIOD' },
    { id: 'break1', label: 'Short Break', time: '10:15–10:30', type: 'BREAK' },
    { id: 4, label: '4th Period', time: '10:30–11:15', type: 'PERIOD' },
    { id: 5, label: '5th Period', time: '11:15–12:00', type: 'PERIOD' },
    { id: 6, label: '6th Period', time: '12:00–12:45', type: 'PERIOD' },
    { id: 'lunch', label: 'Lunch Break', time: '12:45–13:30', type: 'BREAK' },
    { id: 7, label: '7th Period', time: '13:30–14:15', type: 'PERIOD' },
    { id: 8, label: '8th Period', time: '14:15–15:00', type: 'PERIOD' },
];

const PERIOD_SLOTS = DAY_SLOTS.filter(s => s.type === 'PERIOD');

const SUBJECTS = [
    'Mathematics', 'Science', 'Physics', 'Chemistry', 'Biology',
    'English', 'Hindi', 'Sanskrit', 'Social Studies', 'History',
    'Geography', 'Computer Science', 'Physical Education', 'Arts',
    'Music', 'Economics', 'Business Studies',
];

const TEACHERS = [
    { name: 'Dr. Sharma', subjects: ['Mathematics', 'Physics'] },
    { name: 'Mrs. Gupta', subjects: ['English', 'Hindi'] },
    { name: 'Mr. Kumar', subjects: ['Chemistry', 'Science'] },
    { name: 'Ms. Singh', subjects: ['Biology', 'Science'] },
    { name: 'Dr. Patel', subjects: ['Computer Science', 'Mathematics'] },
    { name: 'Mrs. Nair', subjects: ['History', 'Social Studies', 'Geography'] },
    { name: 'Mr. Reddy', subjects: ['Physical Education'] },
    { name: 'Ms. Joshi', subjects: ['Arts', 'Music'] },
    { name: 'Dr. Verma', subjects: ['Economics', 'Business Studies'] },
    { name: 'Mrs. Malhotra', subjects: ['Sanskrit', 'Hindi'] },
];

const TEACHER_NAMES = TEACHERS.map(t => t.name);

const SUBJECT_COLORS = {
    'Mathematics': 'violet',
    'Science': 'green',
    'Physics': 'violet',
    'Chemistry': 'amber',
    'Biology': 'emerald',
    'English': 'sky',
    'Hindi': 'amber',
    'Sanskrit': 'yellow',
    'Social Studies': 'teal',
    'History': 'rose',
    'Geography': 'lime',
    'Computer Science': 'violet',
    'Physical Education': 'red',
    'Arts': 'pink',
    'Music': 'fuchsia',
    'Economics': 'cyan',
    'Business Studies': 'slate',
};

const COLOR_MAP = {
    violet: 'bg-violet-50 border-violet-200 text-violet-800',
    green: 'bg-green-50 border-green-200 text-green-800',
    amber: 'bg-amber-50 border-amber-200 text-amber-800',
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    sky: 'bg-sky-50 border-sky-200 text-sky-800',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    teal: 'bg-teal-50 border-teal-200 text-teal-800',
    rose: 'bg-rose-50 border-rose-200 text-rose-800',
    lime: 'bg-lime-50 border-lime-200 text-lime-800',
    indigo: 'bg-indigo-50 border-indigo-200 text-indigo-800',
    red: 'bg-red-50 border-red-200 text-red-800',
    pink: 'bg-pink-50 border-pink-200 text-pink-800',
    fuchsia: 'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-800',
    cyan: 'bg-cyan-50 border-cyan-200 text-cyan-800',
    slate: 'bg-slate-100 border-slate-200 text-slate-800',
};

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────

const generateMockTimetable = () => {
    const timetable = {};
    const classes = ['10-A', '10-B', '9-A', '9-B', '8-A', '8-B'];

    classes.forEach(className => {
        timetable[className] = {};
        DAYS.forEach(day => {
            timetable[className][day] = {};
            PERIOD_SLOTS.forEach(slot => {
                const teacher = TEACHERS[Math.floor(Math.random() * TEACHERS.length)];
                const subject = teacher.subjects[Math.floor(Math.random() * teacher.subjects.length)];
                timetable[className][day][slot.id] = {
                    subject,
                    teacher: teacher.name,
                    room: `R${Math.floor(Math.random() * 20) + 101}`,
                    isLab: Math.random() > 0.85,
                };
            });
        });
    });
    return timetable;
};

const generateTeacherAvailability = () => {
    const avail = {};
    TEACHER_NAMES.forEach(name => {
        avail[name] = {};
        DAYS.forEach(day => {
            avail[name][day] = {
                available: Math.random() > 0.15,
                maxPeriods: Math.floor(Math.random() * 3) + 4,
                unavailablePeriods: Math.random() > 0.7
                    ? [PERIOD_SLOTS[Math.floor(Math.random() * PERIOD_SLOTS.length)].id]
                    : [],
            };
        });
    });
    return avail;
};

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

const validateTimetable = (tt, availability) => {
    const issues = [];

    // Build teacher load map
    const teacherDayLoad = {};
    const teacherPeriodMap = {}; // teacher -> day -> [periodIds]

    for (const [cls, clsData] of Object.entries(tt)) {
        for (const [day, dayData] of Object.entries(clsData)) {
            for (const [periodId, cell] of Object.entries(dayData)) {
                if (!cell?.teacher) continue;
                const t = cell.teacher;
                if (!teacherDayLoad[t]) teacherDayLoad[t] = {};
                if (!teacherDayLoad[t][day]) teacherDayLoad[t][day] = 0;
                teacherDayLoad[t][day]++;

                if (!teacherPeriodMap[t]) teacherPeriodMap[t] = {};
                if (!teacherPeriodMap[t][day]) teacherPeriodMap[t][day] = [];
                teacherPeriodMap[t][day].push({ periodId, cls });
            }
        }
    }

    // Check overload
    for (const [teacher, days] of Object.entries(teacherDayLoad)) {
        for (const [day, count] of Object.entries(days)) {
            const max = availability[teacher]?.[day]?.maxPeriods ?? 6;
            if (count > max) {
                issues.push({
                    id: `overload_${teacher}_${day}`,
                    severity: 'error',
                    message: `${teacher} overloaded on ${day}`,
                    details: `${count} periods assigned, max is ${max}`,
                    canFix: true,
                });
            }
        }
    }

    // Check teacher marked unavailable but still assigned
    for (const [teacher, days] of Object.entries(teacherPeriodMap)) {
        for (const [day, slots] of Object.entries(days)) {
            if (availability[teacher]?.[day]?.available === false) {
                issues.push({
                    id: `unavail_${teacher}_${day}`,
                    severity: 'error',
                    message: `${teacher} marked absent on ${day} but has ${slots.length} class(es)`,
                    details: slots.map(s => `${s.cls} P${s.periodId}`).join(', '),
                    canFix: true,
                });
            }

            const unavailPeriods = availability[teacher]?.[day]?.unavailablePeriods ?? [];
            for (const { periodId, cls } of slots) {
                if (unavailPeriods.includes(Number(periodId))) {
                    issues.push({
                        id: `unavail_period_${teacher}_${day}_${periodId}`,
                        severity: 'warning',
                        message: `${teacher} unavailable period ${periodId} on ${day}`,
                        details: `Assigned to ${cls}`,
                        canFix: true,
                    });
                }
            }
        }
    }

    return issues;
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS (Notion‑style violet accent)
// ─────────────────────────────────────────────────────────────────────────────

function Modal({ isOpen, onClose, title, icon: Icon, iconColor = 'text-violet-600', children, maxWidth = 'max-w-md' }) {
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" onClick={onClose} />
            <div className={cn('relative bg-white rounded-lg shadow-lg border border-violet-100 w-full', maxWidth)}>
                <div className="flex items-center justify-between px-5 py-4 border-b border-violet-100">
                    <div className="flex items-center gap-2.5">
                        {Icon && <Icon className={cn('w-5 h-5', iconColor)} />}
                        <h2 className="text-base font-semibold text-gray-800">{title}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>
                <div className="p-5">{children}</div>
            </div>
        </div>
    );
}

function CellCard({ cell, isSelected, onClick }) {
    if (!cell) {
        return (
            <div
                onClick={onClick}
                className="h-full min-h-[72px] flex items-center justify-center cursor-pointer rounded-md border border-dashed border-gray-200 text-gray-300 hover:border-violet-300 hover:text-violet-300 transition-colors text-xs"
            >
                <Plus size={14} />
            </div>
        );
    }

    const color = SUBJECT_COLORS[cell.subject] ?? 'slate';
    const colorClasses = COLOR_MAP[color] ?? COLOR_MAP.slate;

    return (
        <div
            onClick={onClick}
            className={cn(
                'min-h-[72px] p-2 rounded-md border cursor-pointer transition-all hover:shadow-sm group',
                colorClasses,
                isSelected && 'ring-2 ring-violet-400 ring-offset-1 shadow-sm'
            )}
        >
            <p className="font-semibold text-xs leading-tight truncate">{cell.subject}</p>
            <p className="text-[11px] opacity-70 mt-0.5 truncate">{cell.teacher}</p>
            <div className="flex items-center gap-1 mt-1.5">
                <span className="text-[10px] opacity-60 font-medium">{cell.room}</span>
                {cell.isLab && (
                    <span className="text-[9px] font-semibold uppercase tracking-wide bg-black/10 px-1 py-0.5 rounded">Lab</span>
                )}
            </div>
        </div>
    );
}

function ClassTimetableGrid({ timetable, className, selectedCell, onCellClick }) {
    const classData = timetable[className] ?? {};

    return (
        <div className="overflow-x-auto -mx-1">
            <table className="w-full border-separate border-spacing-1" style={{ minWidth: 900 }}>
                <thead>
                    <tr>
                        <th className="w-28 text-left py-2 px-2">
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Day</span>
                        </th>
                        {DAY_SLOTS.map(slot => (
                            <th key={slot.id} className={cn(
                                'text-center py-2 px-1',
                                slot.type === 'BREAK' ? 'w-16' : 'w-28'
                            )}>
                                {slot.type === 'BREAK' ? (
                                    <div className="flex flex-col items-center gap-0.5">
                                        <Coffee size={12} className="text-gray-300" />
                                        <span className="text-[10px] text-gray-300 font-medium">{slot.label.split(' ')[0]}</span>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="text-xs font-semibold text-gray-600">{slot.label}</p>
                                        <p className="text-[10px] text-gray-400 mt-0.5">{slot.time}</p>
                                    </div>
                                )}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {DAYS.map(day => (
                        <tr key={day}>
                            <td className="py-1 px-2">
                                <span className="text-xs font-semibold text-gray-700">{day.slice(0, 3).toUpperCase()}</span>
                                <span className="text-[10px] text-gray-400 block">{day.slice(3)}</span>
                            </td>
                            {DAY_SLOTS.map(slot => {
                                if (slot.type === 'BREAK') {
                                    return (
                                        <td key={slot.id} className="py-1">
                                            <div className="h-[72px] bg-gray-50 rounded-md border border-dashed border-gray-200 flex items-center justify-center">
                                                <div className="text-[10px] text-gray-300 text-center leading-tight">
                                                    {slot.time.split('–').map((t, i) => <div key={i}>{t}</div>)}
                                                </div>
                                            </div>
                                        </td>
                                    );
                                }
                                const cell = classData[day]?.[slot.id];
                                const isSelected = selectedCell?.className === className &&
                                    selectedCell?.day === day &&
                                    selectedCell?.periodId === slot.id;
                                return (
                                    <td key={slot.id} className="py-1">
                                        <CellCard
                                            cell={cell}
                                            isSelected={isSelected}
                                            onClick={() => onCellClick(className, day, slot.id, cell)}
                                        />
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function TeacherTimetableGrid({ timetable }) {
    // Pre-compute: teacher → day → [{periodId, cls, subject, room}]
    const teacherSchedule = useMemo(() => {
        const map = {};
        TEACHER_NAMES.forEach(t => { map[t] = {}; DAYS.forEach(d => { map[t][d] = []; }); });

        for (const [cls, clsData] of Object.entries(timetable)) {
            for (const [day, dayData] of Object.entries(clsData)) {
                for (const [periodId, cell] of Object.entries(dayData)) {
                    if (cell?.teacher && map[cell.teacher]) {
                        map[cell.teacher][day].push({ periodId: Number(periodId), cls, subject: cell.subject, room: cell.room });
                    }
                }
            }
        }
        // Sort periods
        Object.values(map).forEach(days => Object.values(days).forEach(arr => arr.sort((a, b) => a.periodId - b.periodId)));
        return map;
    }, [timetable]);

    return (
        <div className="overflow-x-auto -mx-1">
            <table className="w-full border-separate border-spacing-1" style={{ minWidth: 700 }}>
                <thead>
                    <tr className="border-b border-gray-100">
                        <th className="w-36 text-left py-2 px-2">
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Teacher</span>
                        </th>
                        {DAYS.map(d => (
                            <th key={d} className="text-center py-2 px-1">
                                <p className="text-xs font-semibold text-gray-600">{d.slice(0, 3).toUpperCase()}</p>
                                <p className="text-[10px] text-gray-400">{d.slice(3)}</p>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {TEACHER_NAMES.map(teacher => (
                        <tr key={teacher}>
                            <td className="py-1 px-2 align-top">
                                <p className="text-xs font-semibold text-gray-700 leading-tight">{teacher}</p>
                            </td>
                            {DAYS.map(day => {
                                const slots = teacherSchedule[teacher]?.[day] ?? [];
                                return (
                                    <td key={day} className="py-1 align-top">
                                        {slots.length === 0 ? (
                                            <div className="min-h-[48px] flex items-center justify-center rounded-md bg-gray-50 border border-dashed border-gray-200">
                                                <span className="text-[10px] text-gray-300">Free</span>
                                            </div>
                                        ) : (
                                            <div className="space-y-1">
                                                {slots.map(s => {
                                                    const color = SUBJECT_COLORS[s.subject] ?? 'slate';
                                                    return (
                                                        <div key={s.periodId} className={cn(
                                                            'px-2 py-1.5 rounded-md border text-[11px]',
                                                            COLOR_MAP[color] ?? COLOR_MAP.slate
                                                        )}>
                                                            <span className="font-semibold">P{s.periodId}</span>
                                                            <span className="opacity-60 mx-1">·</span>
                                                            <span>{s.cls}</span>
                                                            <span className="block opacity-60 truncate">{s.subject}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function ValidationPanel({ issues, onFix }) {
    const errors = issues.filter(i => i.severity === 'error');
    const warnings = issues.filter(i => i.severity === 'warning');

    if (issues.length === 0) {
        return (
            <div className="text-center py-6">
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
                <p className="text-sm font-semibold text-gray-700">All constraints satisfied</p>
                <p className="text-xs text-gray-400 mt-1">Timetable is ready to approve</p>
            </div>
        );
    }

    return (
        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {errors.map(issue => (
                <div key={issue.id} className="flex items-start gap-3 p-3 bg-rose-50 border border-rose-100 rounded-lg">
                    <XCircle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-rose-800 leading-tight">{issue.message}</p>
                        {issue.details && <p className="text-xs text-rose-500 mt-0.5">{issue.details}</p>}
                    </div>
                    {issue.canFix && (
                        <button onClick={() => onFix(issue.id)} className="shrink-0 text-xs px-2 py-1 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition-colors">
                            Fix
                        </button>
                    )}
                </div>
            ))}
            {warnings.map(issue => (
                <div key={issue.id} className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-amber-800 leading-tight">{issue.message}</p>
                        {issue.details && <p className="text-xs text-amber-500 mt-0.5">{issue.details}</p>}
                    </div>
                    {issue.canFix && (
                        <button onClick={() => onFix(issue.id)} className="shrink-0 text-xs px-2 py-1 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors">
                            Fix
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}

// ─── SWAP MODAL (Notion style) ───────────────────────────────────────────────

function SwapModal({ isOpen, onClose, onSwap, timetable, selection }) {
    const [mode, setMode] = useState('replace');
    const [newTeacher, setNewTeacher] = useState('');
    const [targetClass, setTargetClass] = useState('');
    const [targetDay, setTargetDay] = useState('');
    const [targetPeriod, setTargetPeriod] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setMode('replace');
            setNewTeacher('');
            setTargetClass('');
            setTargetDay('');
            setTargetPeriod('');
        }
    }, [isOpen]);

    const targetCell = timetable[targetClass]?.[targetDay]?.[Number(targetPeriod)];

    const canSubmit = mode === 'replace'
        ? !!newTeacher && newTeacher !== selection?.cell?.teacher
        : !!targetClass && !!targetDay && !!targetPeriod;

    const handleSubmit = async () => {
        setLoading(true);
        await new Promise(r => setTimeout(r, 800));
        onSwap({ mode, newTeacher, targetClass, targetDay, targetPeriod: Number(targetPeriod) });
        setLoading(false);
        onClose();
    };

    const otherTeachers = TEACHER_NAMES.filter(t => t !== selection?.cell?.teacher);
    const classes = Object.keys(timetable);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Manage Slot" icon={ArrowLeftRight} iconColor="text-violet-600">
            {selection && (
                <>
                    <div className="mb-5 p-3 bg-violet-50/30 rounded-lg border border-violet-100">
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Selected Slot</p>
                        <p className="font-semibold text-gray-800">{selection.cell?.subject ?? '—'}</p>
                        <p className="text-sm text-gray-500 mt-0.5">
                            {selection.className} · {selection.day} · Period {selection.periodId}
                        </p>
                        {selection.cell?.teacher && (
                            <p className="text-sm text-gray-500">Teacher: <span className="font-medium text-gray-700">{selection.cell.teacher}</span></p>
                        )}
                    </div>

                    <div className="flex gap-2 mb-5">
                        {[{ key: 'replace', label: 'Change Teacher' }, { key: 'swap', label: 'Swap Slots' }].map(opt => (
                            <button
                                key={opt.key}
                                onClick={() => setMode(opt.key)}
                                className={cn(
                                    'flex-1 py-2 rounded-lg text-sm font-medium transition-colors',
                                    mode === opt.key
                                        ? 'bg-gradient-to-r from-violet-500 to-violet-700 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                )}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>

                    {mode === 'replace' && (
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">New Teacher</label>
                                <select
                                    value={newTeacher}
                                    onChange={e => setNewTeacher(e.target.value)}
                                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-100 focus:border-violet-300"
                                >
                                    <option value="">Select teacher…</option>
                                    {otherTeachers.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <p className="text-xs text-gray-400">
                                This writes a <span className="font-semibold">DayOverride</span> — base timetable is untouched.
                            </p>
                        </div>
                    )}

                    {mode === 'swap' && (
                        <div className="space-y-3">
                            <p className="text-xs text-gray-500">Pick the slot to swap with. Both slots will exchange teachers.</p>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Class</label>
                                <select value={targetClass} onChange={e => { setTargetClass(e.target.value); setTargetDay(''); setTargetPeriod(''); }} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-100 focus:border-violet-300">
                                    <option value="">Select class…</option>
                                    {classes.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Day</label>
                                    <select value={targetDay} onChange={e => { setTargetDay(e.target.value); setTargetPeriod(''); }} disabled={!targetClass} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-100 focus:border-violet-300 disabled:opacity-50">
                                        <option value="">Day…</option>
                                        {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Period</label>
                                    <select value={targetPeriod} onChange={e => setTargetPeriod(e.target.value)} disabled={!targetDay} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-100 focus:border-violet-300 disabled:opacity-50">
                                        <option value="">Period…</option>
                                        {PERIOD_SLOTS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                                    </select>
                                </div>
                            </div>
                            {targetCell && (
                                <div className="p-3 bg-violet-50 border border-violet-200 rounded-lg text-sm">
                                    <span className="font-semibold text-violet-800">{targetCell.subject}</span>
                                    <span className="text-violet-600"> · {targetCell.teacher}</span>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex gap-3 mt-6">
                        <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium transition-colors">
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!canSubmit || loading}
                            className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-violet-500 to-violet-700 hover:opacity-90 disabled:opacity-40 text-white text-sm font-medium transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 size={15} className="animate-spin" /> : <ArrowLeftRight size={15} />}
                            {loading ? 'Applying…' : mode === 'replace' ? 'Change Teacher' : 'Swap Slots'}
                        </button>
                    </div>
                </>
            )}
        </Modal>
    );
}

// ─── SWAP (LONG-TERM) MODAL ───────────────────────────────────────────────────

function LongTermSwapModal({ isOpen, onClose, onSwap }) {
    const [teacher, setTeacher] = useState('');
    const [replacement, setReplacement] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);

    const canSubmit = teacher && replacement && replacement !== teacher && startDate && endDate && endDate >= startDate;

    const handleSubmit = async () => {
        setLoading(true);
        await new Promise(r => setTimeout(r, 1000));
        onSwap({ teacher, replacement, startDate, endDate });
        setLoading(false);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Long-term Teacher Swap" icon={Repeat} iconColor="text-violet-600">
            <div className="space-y-4">
                <div className="p-3 bg-violet-50/30 border border-violet-100 rounded-lg">
                    <p className="text-xs text-violet-700">
                        <span className="font-semibold">SWAP</span> — replaces a teacher for a defined date range. Writes to <code className="bg-violet-100 px-1 rounded">SwapAssignment</code>, auto-reverts on end date.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Absent Teacher</label>
                        <select value={teacher} onChange={e => setTeacher(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-100 focus:border-violet-300">
                            <option value="">Select…</option>
                            {TEACHER_NAMES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Replacement</label>
                        <select value={replacement} onChange={e => setReplacement(e.target.value)} disabled={!teacher} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-100 focus:border-violet-300 disabled:opacity-50">
                            <option value="">Select…</option>
                            {TEACHER_NAMES.filter(t => t !== teacher).map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Start Date</label>
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-100 focus:border-violet-300" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">End Date</label>
                        <input type="date" value={endDate} min={startDate} onChange={e => setEndDate(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-100 focus:border-violet-300" />
                    </div>
                </div>

                <div className="flex gap-3 pt-2">
                    <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium">Cancel</button>
                    <button onClick={handleSubmit} disabled={!canSubmit || loading} className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-violet-500 to-violet-700 hover:opacity-90 disabled:opacity-40 text-white text-sm font-medium flex items-center justify-center gap-2">
                        {loading ? <Loader2 size={15} className="animate-spin" /> : <Repeat size={15} />}
                        {loading ? 'Creating SWAP…' : 'Create SWAP'}
                    </button>
                </div>
            </div>
        </Modal>
    );
}

// ─── AVAILABILITY MODAL (Notion style) ───────────────────────────────────────

function AvailabilityModal({ isOpen, onClose, onUpdate, availability }) {
    const [local, setLocal] = useState(availability);
    const [selected, setSelected] = useState(TEACHER_NAMES[0]);

    useEffect(() => { setLocal(availability); }, [availability]);

    const data = local[selected] ?? {};

    const toggle = (day, field, val) => setLocal(prev => ({
        ...prev,
        [selected]: { ...prev[selected], [day]: { ...prev[selected]?.[day], [field]: val } }
    }));

    const togglePeriod = (day, periodId) => {
        const curr = local[selected]?.[day]?.unavailablePeriods ?? [];
        const next = curr.includes(periodId) ? curr.filter(p => p !== periodId) : [...curr, periodId];
        toggle(day, 'unavailablePeriods', next);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Teacher Availability" icon={UserCheck} maxWidth="max-w-2xl">
            <div className="flex gap-4">
                {/* Teacher list */}
                <div className="w-40 shrink-0 space-y-1 overflow-y-auto max-h-[60vh] pr-1">
                    {TEACHER_NAMES.map(t => (
                        <button
                            key={t}
                            onClick={() => setSelected(t)}
                            className={cn(
                                'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                                selected === t ? 'bg-gradient-to-r from-violet-500 to-violet-700 text-white font-semibold' : 'text-gray-600 hover:bg-gray-100'
                            )}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                {/* Day matrix */}
                <div className="flex-1 overflow-y-auto max-h-[60vh] space-y-3 pr-1">
                    {DAYS.map(day => {
                        const dayData = data[day] ?? { available: true, maxPeriods: 6, unavailablePeriods: [] };
                        return (
                            <div key={day} className="border border-gray-200 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-semibold text-gray-700">{day}</span>
                                    <label className="flex items-center gap-2 cursor-pointer select-none">
                                        <span className="text-xs text-gray-500">Available</span>
                                        <div
                                            onClick={() => toggle(day, 'available', !dayData.available)}
                                            className={cn(
                                                'w-9 h-5 rounded-full transition-colors relative cursor-pointer',
                                                dayData.available ? 'bg-emerald-500' : 'bg-gray-300'
                                            )}
                                        >
                                            <div className={cn(
                                                'w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-transform shadow-sm',
                                                dayData.available ? 'translate-x-4' : 'translate-x-0.5'
                                            )} />
                                        </div>
                                    </label>
                                </div>

                                {dayData.available && (
                                    <>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs text-gray-500 w-24 shrink-0">Max periods: <span className="font-semibold text-gray-700">{dayData.maxPeriods ?? 6}</span></span>
                                            <input
                                                type="range" min={1} max={8}
                                                value={dayData.maxPeriods ?? 6}
                                                onChange={e => toggle(day, 'maxPeriods', Number(e.target.value))}
                                                className="flex-1 accent-violet-500"
                                            />
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                            {PERIOD_SLOTS.map(slot => {
                                                const blocked = (dayData.unavailablePeriods ?? []).includes(slot.id);
                                                return (
                                                    <button
                                                        key={slot.id}
                                                        onClick={() => togglePeriod(day, slot.id)}
                                                        className={cn(
                                                            'px-2 py-1 rounded-md text-xs font-medium transition-colors',
                                                            blocked ? 'bg-rose-100 text-rose-700 border border-rose-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                        )}
                                                    >
                                                        P{slot.id}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="flex gap-3 mt-5 pt-5 border-t border-gray-100">
                <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium">Cancel</button>
                <button onClick={() => { onUpdate(local); onClose(); }} className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-violet-500 to-violet-700 hover:opacity-90 text-white text-sm font-medium flex items-center justify-center gap-2">
                    <Save size={15} />
                    Save Changes
                </button>
            </div>
        </Modal>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function TimetablePage() {
    const [timetable, setTimetable] = useState({});
    const [availability, setAvailability] = useState({});
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [approving, setApproving] = useState(false);
    const [approved, setApproved] = useState(false);

    const [viewType, setViewType] = useState('class'); // 'class' | 'teacher'
    const [selectedClass, setSelectedClass] = useState('10-A');
    const [selectedCell, setSelectedCell] = useState(null);

    const [showSwapModal, setShowSwapModal] = useState(false);
    const [showLongTermModal, setShowLongTermModal] = useState(false);
    const [showAvailModal, setShowAvailModal] = useState(false);

    const classes = useMemo(() => Object.keys(timetable), [timetable]);

    const issues = useMemo(() => validateTimetable(timetable, availability), [timetable, availability]);
    const errorCount = issues.filter(i => i.severity === 'error').length;
    const warnCount = issues.filter(i => i.severity === 'warning').length;

    useEffect(() => {
        (async () => {
            setLoading(true);
            await new Promise(r => setTimeout(r, 900));
            setTimetable(generateMockTimetable());
            setAvailability(generateTeacherAvailability());
            setLoading(false);
        })();
    }, []);

    const handleGenerate = async () => {
        setGenerating(true);
        setApproved(false);
        await new Promise(r => setTimeout(r, 1800));
        setTimetable(generateMockTimetable());
        setGenerating(false);
    };

    const handleApprove = async () => {
        if (errorCount > 0) return;
        setApproving(true);
        await new Promise(r => setTimeout(r, 1000));
        setApproved(true);
        setApproving(false);
    };

    const handleCellClick = useCallback((className, day, periodId, cell) => {
        if (approved) return; // locked
        setSelectedCell({ className, day, periodId, cell });
        setShowSwapModal(true);
    }, [approved]);

    const handleSlotAction = useCallback(({ mode, newTeacher, targetClass, targetDay, targetPeriod }) => {
        setTimetable(prev => {
            const next = JSON.parse(JSON.stringify(prev));
            const { className, day, periodId } = selectedCell;

            if (mode === 'replace') {
                if (next[className]?.[day]?.[periodId]) {
                    next[className][day][periodId].teacher = newTeacher;
                }
            } else {
                // swap
                const cellA = next[className]?.[day]?.[periodId];
                const cellB = next[targetClass]?.[targetDay]?.[targetPeriod];
                if (cellA && cellB) {
                    const tmp = cellA.teacher;
                    cellA.teacher = cellB.teacher;
                    cellB.teacher = tmp;
                }
            }
            return next;
        });
    }, [selectedCell]);

    const handleFixIssue = useCallback((id) => {
        console.log('Auto-fix:', id);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-violet-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-violet-600 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">Loading timetable…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-violet-50">
            <div className="max-w-screen-2xl mx-auto p-6 space-y-5">

                {/* ── Header ── */}
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Timetable Management</h1>
                        <p className="text-gray-500 text-sm mt-0.5">Generate, validate, and manage school timetables</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setShowAvailModal(true)}
                            className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 text-sm font-medium transition-colors"
                        >
                            <UserCheck size={15} />
                            Availability
                        </button>
                        <button
                            onClick={() => setShowLongTermModal(true)}
                            className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 text-sm font-medium transition-colors"
                        >
                            <Repeat size={15} />
                            Long-term Swap
                        </button>
                        <button
                            onClick={handleGenerate}
                            disabled={generating || approved}
                            className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 text-sm font-medium transition-colors disabled:opacity-40"
                        >
                            {generating ? <Loader2 size={15} className="animate-spin" /> : <RefreshCw size={15} />}
                            {generating ? 'Generating…' : 'Regenerate'}
                        </button>
                        <button
                            onClick={handleApprove}
                            disabled={errorCount > 0 || approving || approved}
                            className={cn(
                                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all',
                                approved
                                    ? 'bg-emerald-600 text-white cursor-default'
                                    : errorCount > 0
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-violet-500 to-violet-700 text-white hover:opacity-90'
                            )}
                        >
                            {approving ? <Loader2 size={15} className="animate-spin" /> : approved ? <Lock size={15} /> : <CheckCircle size={15} />}
                            {approving ? 'Approving…' : approved ? 'Approved & Locked' : 'Approve Timetable'}
                        </button>
                    </div>
                </div>

                {/* ── Status bar ── */}
                {(errorCount > 0 || warnCount > 0 || approved) && (
                    <div className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-lg border text-sm font-medium',
                        approved ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                            : errorCount > 0 ? 'bg-rose-50 border-rose-200 text-rose-800'
                                : 'bg-amber-50 border-amber-200 text-amber-800'
                    )}>
                        {approved
                            ? <><Lock size={15} /> Timetable is approved and locked. Edit access disabled.</>
                            : errorCount > 0
                                ? <><XCircle size={15} /> {errorCount} error{errorCount > 1 ? 's' : ''} must be resolved before approving.{warnCount > 0 ? ` ${warnCount} warning${warnCount > 1 ? 's' : ''}.` : ''}</>
                                : <><AlertCircle size={15} /> {warnCount} warning{warnCount > 1 ? 's' : ''}. No hard errors — ready to approve.</>
                        }
                    </div>
                )}

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
                    {/* ── Main grid ── */}
                    <div className="xl:col-span-3 bg-white rounded-lg border border-violet-100 overflow-hidden">
                        {/* Controls */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-5 py-3.5 border-b border-violet-100">
                            <div className="flex gap-1 bg-gray-100 p-1 rounded-md">
                                <button
                                    onClick={() => setViewType('class')}
                                    className={cn(
                                        'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all',
                                        viewType === 'class' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                    )}
                                >
                                    <LayoutGrid size={14} />
                                    Class View
                                </button>
                                <button
                                    onClick={() => setViewType('teacher')}
                                    className={cn(
                                        'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all',
                                        viewType === 'teacher' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                    )}
                                >
                                    <Users size={14} />
                                    Teacher View
                                </button>
                            </div>

                            {viewType === 'class' && (
                                <div className="flex gap-1 flex-wrap">
                                    {classes.map(cls => (
                                        <button
                                            key={cls}
                                            onClick={() => setSelectedClass(cls)}
                                            className={cn(
                                                'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                                                selectedClass === cls
                                                    ? 'bg-violet-600 text-white'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            )}
                                        >
                                            {cls}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div className="sm:ml-auto flex gap-2">
                                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 text-sm transition-colors">
                                    <Printer size={13} /> Print
                                </button>
                                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 text-sm transition-colors">
                                    <Download size={13} /> Export
                                </button>
                            </div>
                        </div>

                        {/* Grid */}
                        <div className="p-4">
                            {viewType === 'class' ? (
                                <ClassTimetableGrid
                                    timetable={timetable}
                                    className={selectedClass}
                                    selectedCell={selectedCell}
                                    onCellClick={handleCellClick}
                                />
                            ) : (
                                <TeacherTimetableGrid timetable={timetable} />
                            )}
                        </div>

                        {!approved && viewType === 'class' && (
                            <div className="px-5 pb-4">
                                <p className="text-xs text-gray-400 flex items-center gap-1.5">
                                    <Edit2 size={11} /> Click any cell to change teacher or swap slots
                                </p>
                            </div>
                        )}
                        {approved && (
                            <div className="px-5 pb-4">
                                <p className="text-xs text-gray-400 flex items-center gap-1.5">
                                    <Lock size={11} /> Timetable locked — editing disabled
                                </p>
                            </div>
                        )}
                    </div>

                    {/* ── Sidebar ── */}
                    <div className="space-y-4">
                        {/* Stats */}
                        <div className="bg-white rounded-lg border border-violet-100 p-4">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <Activity size={15} className="text-violet-600" /> Overview
                            </h3>
                            <div className="space-y-2.5">
                                {[
                                    { label: 'Classes', value: classes.length },
                                    { label: 'Teachers', value: TEACHER_NAMES.length },
                                    { label: 'Periods / Day', value: PERIOD_SLOTS.length },
                                    { label: 'Working Days', value: DAYS.length },
                                ].map(({ label, value }) => (
                                    <div key={label} className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">{label}</span>
                                        <span className="text-sm font-semibold text-gray-800">{value}</span>
                                    </div>
                                ))}
                                <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
                                    <span className="text-sm text-gray-500">Status</span>
                                    <span className={cn(
                                        'text-xs font-semibold px-2.5 py-1 rounded-full',
                                        approved ? 'bg-emerald-100 text-emerald-700'
                                            : errorCount > 0 ? 'bg-rose-100 text-rose-700'
                                                : warnCount > 0 ? 'bg-amber-100 text-amber-700'
                                                    : 'bg-emerald-100 text-emerald-700'
                                    )}>
                                        {approved ? 'Approved' : errorCount > 0 ? `${errorCount} Errors` : warnCount > 0 ? `${warnCount} Warnings` : 'Valid'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Validation */}
                        <div className="bg-white rounded-lg border border-violet-100 p-4">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <Shield size={15} className="text-violet-600" /> Validation
                                {issues.length > 0 && (
                                    <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                                        {issues.length}
                                    </span>
                                )}
                            </h3>
                            <ValidationPanel issues={issues} onFix={handleFixIssue} />
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-lg border border-violet-100 p-4">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <Zap size={15} className="text-amber-500" /> Quick Actions
                            </h3>
                            <div className="space-y-1.5">
                                {[
                                    { icon: Bell, label: 'Notify Teachers', color: 'text-violet-600' },
                                    { icon: Eye, label: 'Preview PDF', color: 'text-gray-600' },
                                    { icon: Download, label: 'Download as PDF', color: 'text-gray-600' },
                                    { icon: Upload, label: 'Import from Excel', color: 'text-emerald-600' },
                                ].map(({ icon: Icon, label, color }) => (
                                    <button key={label} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors text-sm text-left">
                                        <Icon size={14} className={color} />
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Modals ── */}
            <SwapModal
                isOpen={showSwapModal}
                onClose={() => { setShowSwapModal(false); setSelectedCell(null); }}
                onSwap={handleSlotAction}
                timetable={timetable}
                selection={selectedCell}
            />
            <LongTermSwapModal
                isOpen={showLongTermModal}
                onClose={() => setShowLongTermModal(false)}
                onSwap={(data) => console.log('SWAP created:', data)}
            />
            <AvailabilityModal
                isOpen={showAvailModal}
                onClose={() => setShowAvailModal(false)}
                onUpdate={setAvailability}
                availability={availability}
            />
        </div>
    );
}