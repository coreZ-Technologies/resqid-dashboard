'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Calendar, Clock, Users, BookOpen, CheckCircle, XCircle,
    AlertCircle, RefreshCw, Download, Save, Eye,
    Edit2, Plus, ChevronDown, Printer,
    GraduationCap, UserCheck, UserX, AlertTriangle, Check,
    X, Loader2, ArrowLeftRight, Repeat,
    Coffee, Lock, LayoutGrid, List,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAYS_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const DAY_SLOTS = [
    { id: 1, label: '1st', time: '8:00–8:45', type: 'PERIOD' },
    { id: 2, label: '2nd', time: '8:45–9:30', type: 'PERIOD' },
    { id: 3, label: '3rd', time: '9:30–10:15', type: 'PERIOD' },
    { id: 'break1', label: 'Short Break', time: '10:15–10:30', type: 'BREAK' },
    { id: 4, label: '4th', time: '10:30–11:15', type: 'PERIOD' },
    { id: 5, label: '5th', time: '11:15–12:00', type: 'PERIOD' },
    { id: 6, label: '6th', time: '12:00–12:45', type: 'PERIOD' },
    { id: 'lunch', label: 'Lunch', time: '12:45–1:30', type: 'BREAK' },
    { id: 7, label: '7th', time: '1:30–2:15', type: 'PERIOD' },
    { id: 8, label: '8th', time: '2:15–3:00', type: 'PERIOD' },
];

const PERIOD_SLOTS = DAY_SLOTS.filter(s => s.type === 'PERIOD');

const TEACHERS = [
    { name: 'Dr. Sharma', initials: 'DS', subjects: ['Mathematics', 'Physics'] },
    { name: 'Mrs. Gupta', initials: 'MG', subjects: ['English', 'Hindi'] },
    { name: 'Mr. Kumar', initials: 'MK', subjects: ['Chemistry', 'Science'] },
    { name: 'Ms. Singh', initials: 'SS', subjects: ['Biology', 'Science'] },
    { name: 'Dr. Patel', initials: 'DP', subjects: ['Computer Science', 'Mathematics'] },
    { name: 'Mrs. Nair', initials: 'MN', subjects: ['History', 'Social Studies', 'Geography'] },
    { name: 'Mr. Reddy', initials: 'MR', subjects: ['Physical Education'] },
    { name: 'Ms. Joshi', initials: 'MJ', subjects: ['Arts', 'Music'] },
    { name: 'Dr. Verma', initials: 'DV', subjects: ['Economics', 'Business Studies'] },
    { name: 'Mrs. Malhotra', initials: 'MM', subjects: ['Sanskrit', 'Hindi'] },
];

const TEACHER_NAMES = TEACHERS.map(t => t.name);
const CLASSES = ['10-A', '10-B', '9-A', '9-B', '8-A', '8-B'];

<<<<<<< HEAD
// Tight subject → color token (Tailwind safe-list friendly)
const SUBJ_COLOR = {
    Mathematics: 'blue',
    Science: 'green',
    Physics: 'violet',
    Chemistry: 'orange',
    Biology: 'emerald',
    English: 'sky',
    Hindi: 'amber',
    Sanskrit: 'yellow',
    'Social Studies': 'teal',
    History: 'rose',
    Geography: 'lime',
    'Computer Science': 'indigo',
=======
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
>>>>>>> b5086afe9f866127f3983a9dd88f7862e3543847
    'Physical Education': 'red',
    Arts: 'pink',
    Music: 'fuchsia',
    Economics: 'cyan',
    'Business Studies': 'slate',
};

<<<<<<< HEAD
const COLOR_CELL = {
    blue: 'bg-blue-50 border-blue-200 text-blue-900',
    green: 'bg-green-50 border-green-200 text-green-900',
    violet: 'bg-violet-50 border-violet-200 text-violet-900',
    orange: 'bg-orange-50 border-orange-200 text-orange-900',
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    sky: 'bg-sky-50 border-sky-200 text-sky-900',
    amber: 'bg-amber-50 border-amber-200 text-amber-900',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    teal: 'bg-teal-50 border-teal-200 text-teal-900',
    rose: 'bg-rose-50 border-rose-200 text-rose-900',
    lime: 'bg-lime-50 border-lime-200 text-lime-900',
    indigo: 'bg-indigo-50 border-indigo-200 text-indigo-900',
    red: 'bg-red-50 border-red-200 text-red-900',
    pink: 'bg-pink-50 border-pink-200 text-pink-900',
    fuchsia: 'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-900',
    cyan: 'bg-cyan-50 border-cyan-200 text-cyan-900',
=======
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
>>>>>>> b5086afe9f866127f3983a9dd88f7862e3543847
    slate: 'bg-slate-100 border-slate-200 text-slate-800',
};

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────

const rnd = (arr) => arr[Math.floor(Math.random() * arr.length)];

const generateTimetable = () => {
    const tt = {};
    CLASSES.forEach(cls => {
        tt[cls] = {};
        DAYS.forEach(day => {
            tt[cls][day] = {};
            PERIOD_SLOTS.forEach(slot => {
                const t = rnd(TEACHERS);
                tt[cls][day][slot.id] = {
                    subject: rnd(t.subjects),
                    teacher: t.name,
                    room: `R${Math.floor(Math.random() * 20) + 101}`,
                    isLab: Math.random() > 0.88,
                };
            });
        });
    });
    return tt;
};

const generateAvailability = () => {
    const av = {};
    TEACHER_NAMES.forEach(name => {
        av[name] = {};
        DAYS.forEach(day => {
            av[name][day] = {
                available: Math.random() > 0.12,
                maxPeriods: Math.floor(Math.random() * 3) + 4,
                unavailablePeriods: Math.random() > 0.75
                    ? [PERIOD_SLOTS[Math.floor(Math.random() * PERIOD_SLOTS.length)].id]
                    : [],
            };
        });
    });
    return av;
};

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

const validate = (tt, av) => {
    const issues = [];
    const load = {};
    const map = {};

    for (const [cls, clsData] of Object.entries(tt)) {
        for (const [day, dayData] of Object.entries(clsData)) {
            for (const [pid, cell] of Object.entries(dayData)) {
                if (!cell?.teacher) continue;
                const t = cell.teacher;
                load[t] = load[t] || {};
                load[t][day] = (load[t][day] || 0) + 1;
                map[t] = map[t] || {};
                map[t][day] = map[t][day] || [];
                map[t][day].push({ periodId: Number(pid), cls });
            }
        }
    }
    for (const [teacher, days] of Object.entries(load)) {
        for (const [day, count] of Object.entries(days)) {
            const max = av[teacher]?.[day]?.maxPeriods ?? 6;
            if (count > max) issues.push({ id: `ol_${teacher}_${day}`, severity: 'error', message: `${teacher} overloaded on ${day}`, details: `${count} assigned, max ${max}` });
        }
    }
    for (const [teacher, days] of Object.entries(map)) {
        for (const [day, slots] of Object.entries(days)) {
            if (av[teacher]?.[day]?.available === false)
                issues.push({ id: `ua_${teacher}_${day}`, severity: 'error', message: `${teacher} absent on ${day}`, details: `Still assigned: ${slots.map(s => `${s.cls} P${s.periodId}`).join(', ')}` });
            for (const { periodId, cls } of slots) {
                if ((av[teacher]?.[day]?.unavailablePeriods ?? []).includes(periodId))
                    issues.push({ id: `up_${teacher}_${day}_${periodId}`, severity: 'warning', message: `${teacher} unavailable P${periodId} on ${day}`, details: `Assigned to ${cls}` });
            }
        }
    }
    return issues;
};

// ─────────────────────────────────────────────────────────────────────────────
<<<<<<< HEAD
// ABSENT TEACHERS (mock — today's substitution queue)
// ─────────────────────────────────────────────────────────────────────────────

const ABSENT_TODAY = [
    {
        name: 'Mr. Kumar', initials: 'MK', subject: 'Science', reason: 'Sick leave',
        periods: [
            { p: 'P2', time: '8:45–9:30', cls: '9-A', subj: 'Science', status: 'assigned', sub: 'Ms. Singh' },
            { p: 'P4', time: '10:30–11:15', cls: '10-B', subj: 'Chemistry', status: 'pending' },
            { p: 'P7', time: '1:30–2:15', cls: '8-A', subj: 'Science', status: 'pending' },
        ]
    },
    {
        name: 'Mrs. Nair', initials: 'MN', subject: 'History', reason: 'Personal leave',
        periods: [
            { p: 'P1', time: '8:00–8:45', cls: '10-A', subj: 'History', status: 'assigned', sub: 'Dr. Verma' },
            { p: 'P5', time: '11:15–12:00', cls: '9-B', subj: 'Geography', status: 'pending' },
            { p: 'P6', time: '12:00–12:45', cls: '8-B', subj: 'Social Studies', status: 'pending' },
        ]
    },
    {
        name: 'Ms. Joshi', initials: 'MJ', subject: 'Arts', reason: 'Emergency',
        periods: [
            { p: 'P3', time: '9:30–10:15', cls: '9-A', subj: 'Arts', status: 'assigned', sub: 'Mrs. Gupta' },
            { p: 'P6', time: '12:00–12:45', cls: '10-A', subj: 'Music', status: 'pending' },
            { p: 'P8', time: '2:15–3:00', cls: '9-B', subj: 'Arts', status: 'pending' },
        ]
    },
];
=======
// SUB-COMPONENTS (Notion‑style violet accent)
// ─────────────────────────────────────────────────────────────────────────────

function Modal({ isOpen, onClose, title, icon: Icon, iconColor = 'text-violet-600', children, maxWidth = 'max-w-md' }) {
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [isOpen, onClose]);
>>>>>>> b5086afe9f866127f3983a9dd88f7862e3543847

const FREE_TEACHERS = {
    Science: ['Dr. Sharma (free P4, P7)', 'Dr. Patel (free P7)'],
    Chemistry: ['Dr. Sharma (free P4)', 'Mrs. Gupta (free P4)'],
    History: ['Dr. Verma (free P5, P6)', 'Mrs. Malhotra (free P6)'],
    Geography: ['Dr. Verma (free P5)', 'Mrs. Malhotra (free P5)'],
    'Social Studies': ['Dr. Verma (free P6)', 'Mrs. Gupta (free P6)'],
    Arts: ['Mrs. Gupta (free P6, P8)', 'Ms. Singh (free P8)'],
    Music: ['Mrs. Gupta (free P6)', 'Mr. Reddy (free P6)'],
};

<<<<<<< HEAD
// ─────────────────────────────────────────────────────────────────────────────
// SMALL PIECES
// ─────────────────────────────────────────────────────────────────────────────
=======
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
>>>>>>> b5086afe9f866127f3983a9dd88f7862e3543847

function CellCard({ cell, isSelected, onClick, locked }) {
    if (!cell) {
        return (
            <div
<<<<<<< HEAD
                onClick={locked ? undefined : onClick}
                className={cn(
                    'h-full min-h-[68px] flex items-center justify-center rounded-lg border border-dashed text-slate-300 transition-colors',
                    locked ? 'border-slate-100 cursor-default' : 'border-slate-200 cursor-pointer hover:border-blue-300 hover:text-blue-300'
                )}
=======
                onClick={onClick}
                className="h-full min-h-[72px] flex items-center justify-center cursor-pointer rounded-md border border-dashed border-gray-200 text-gray-300 hover:border-violet-300 hover:text-violet-300 transition-colors text-xs"
>>>>>>> b5086afe9f866127f3983a9dd88f7862e3543847
            >
                {!locked && <Plus size={13} />}
            </div>
        );
    }

    const color = SUBJ_COLOR[cell.subject] ?? 'slate';
    return (
        <div
            onClick={locked ? undefined : onClick}
            className={cn(
<<<<<<< HEAD
                'min-h-[68px] p-2 rounded-lg border transition-all group',
                COLOR_CELL[color] ?? COLOR_CELL.slate,
                !locked && 'cursor-pointer hover:shadow-sm hover:-translate-y-px',
                isSelected && 'ring-2 ring-blue-500 ring-offset-1 shadow-sm',
                cell.isSubstituted && 'ring-1 ring-amber-400'
=======
                'min-h-[72px] p-2 rounded-md border cursor-pointer transition-all hover:shadow-sm group',
                colorClasses,
                isSelected && 'ring-2 ring-violet-400 ring-offset-1 shadow-sm'
>>>>>>> b5086afe9f866127f3983a9dd88f7862e3543847
            )}
        >
            <p className="font-semibold text-[11px] leading-tight truncate">{cell.subject}</p>
            <p className="text-[10px] opacity-60 mt-0.5 truncate">{cell.isSubstituted ? `↪ ${cell.teacher}` : cell.teacher}</p>
            <div className="flex items-center gap-1 mt-1.5">
                <span className="text-[10px] opacity-50 font-medium">{cell.room}</span>
                {cell.isLab && <span className="text-[9px] font-bold uppercase tracking-wide bg-black/10 px-1 py-px rounded">Lab</span>}
                {cell.isSubstituted && <span className="text-[9px] font-bold uppercase tracking-wide bg-amber-500/20 text-amber-700 px-1 py-px rounded">Sub</span>}
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// CLASS GRID — full viewport width
// ─────────────────────────────────────────────────────────────────────────────

function ClassGrid({ timetable, className, selectedCell, onCellClick, locked }) {
    const data = timetable[className] ?? {};
    return (
        <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-1" style={{ minWidth: 920 }}>
                <thead>
                    <tr>
<<<<<<< HEAD
                        {/* Day column header */}
                        <th className="w-20 pb-2 text-left">
                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider pl-1">Day</span>
=======
                        <th className="w-28 text-left py-2 px-2">
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Day</span>
>>>>>>> b5086afe9f866127f3983a9dd88f7862e3543847
                        </th>
                        {DAY_SLOTS.map(slot => (
                            <th key={slot.id} className={cn('pb-2 text-center', slot.type === 'BREAK' ? 'w-14' : '')}>
                                {slot.type === 'BREAK' ? (
<<<<<<< HEAD
                                    <div className="flex flex-col items-center gap-0.5 opacity-40">
                                        <Coffee size={11} className="text-slate-400" />
                                        <span className="text-[9px] text-slate-400">{slot.id === 'lunch' ? 'Lunch' : 'Break'}</span>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="text-[11px] font-semibold text-slate-600">{slot.label}</p>
                                        <p className="text-[10px] text-slate-400 mt-px">{slot.time}</p>
=======
                                    <div className="flex flex-col items-center gap-0.5">
                                        <Coffee size={12} className="text-gray-300" />
                                        <span className="text-[10px] text-gray-300 font-medium">{slot.label.split(' ')[0]}</span>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="text-xs font-semibold text-gray-600">{slot.label}</p>
                                        <p className="text-[10px] text-gray-400 mt-0.5">{slot.time}</p>
>>>>>>> b5086afe9f866127f3983a9dd88f7862e3543847
                                    </div>
                                )}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {DAYS.map((day, di) => (
                        <tr key={day}>
<<<<<<< HEAD
                            <td className="py-0.5 pl-1 align-middle">
                                <p className="text-[11px] font-semibold text-slate-700">{DAYS_SHORT[di]}</p>
                                <p className="text-[10px] text-slate-400">{day}</p>
=======
                            <td className="py-1 px-2">
                                <span className="text-xs font-semibold text-gray-700">{day.slice(0, 3).toUpperCase()}</span>
                                <span className="text-[10px] text-gray-400 block">{day.slice(3)}</span>
>>>>>>> b5086afe9f866127f3983a9dd88f7862e3543847
                            </td>
                            {DAY_SLOTS.map(slot => {
                                if (slot.type === 'BREAK') {
                                    return (
<<<<<<< HEAD
                                        <td key={slot.id} className="py-0.5">
                                            <div className="min-h-[68px] bg-slate-50 rounded-lg border border-dashed border-slate-100 flex items-center justify-center">
                                                <span className="text-[9px] text-slate-300">{slot.time}</span>
=======
                                        <td key={slot.id} className="py-1">
                                            <div className="h-[72px] bg-gray-50 rounded-md border border-dashed border-gray-200 flex items-center justify-center">
                                                <div className="text-[10px] text-gray-300 text-center leading-tight">
                                                    {slot.time.split('–').map((t, i) => <div key={i}>{t}</div>)}
                                                </div>
>>>>>>> b5086afe9f866127f3983a9dd88f7862e3543847
                                            </div>
                                        </td>
                                    );
                                }
                                const cell = data[day]?.[slot.id];
                                const isSel = selectedCell?.className === className && selectedCell?.day === day && selectedCell?.periodId === slot.id;
                                return (
                                    <td key={slot.id} className="py-0.5">
                                        <CellCard
                                            cell={cell}
                                            isSelected={isSel}
                                            onClick={() => onCellClick(className, day, slot.id, cell)}
                                            locked={locked}
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

// ─────────────────────────────────────────────────────────────────────────────
// TEACHER GRID
// ─────────────────────────────────────────────────────────────────────────────

function TeacherGrid({ timetable }) {
    const schedule = useMemo(() => {
        const m = {};
        TEACHER_NAMES.forEach(t => {
            m[t] = {};
            DAYS.forEach(d => {
                m[t][d] = [];
            });
        });
        for (const [cls, clsData] of Object.entries(timetable)) {
            for (const [day, dayData] of Object.entries(clsData)) {
                for (const [pid, cell] of Object.entries(dayData)) {
                    if (cell?.teacher && m[cell.teacher]) {
                        m[cell.teacher][day].push({ periodId: Number(pid), cls, subject: cell.subject, room: cell.room });
                    }
                }
            }
        }
        Object.values(m).forEach(days => Object.values(days).forEach(arr => arr.sort((a, b) => a.periodId - b.periodId)));
        return m;
    }, [timetable]);

    return (
        <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-1" style={{ minWidth: 700 }}>
                <thead>
<<<<<<< HEAD
                    <tr>
                        <th className="w-36 pb-2 text-left">
                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider pl-1">Teacher</span>
                        </th>
                        {DAYS.map((d, i) => (
                            <th key={d} className="pb-2 text-center">
                                <p className="text-[11px] font-semibold text-slate-600">{DAYS_SHORT[i]}</p>
                                <p className="text-[10px] text-slate-400">{d}</p>
=======
                    <tr className="border-b border-gray-100">
                        <th className="w-36 text-left py-2 px-2">
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Teacher</span>
                        </th>
                        {DAYS.map(d => (
                            <th key={d} className="text-center py-2 px-1">
                                <p className="text-xs font-semibold text-gray-600">{d.slice(0, 3).toUpperCase()}</p>
                                <p className="text-[10px] text-gray-400">{d.slice(3)}</p>
>>>>>>> b5086afe9f866127f3983a9dd88f7862e3543847
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
<<<<<<< HEAD
                    {TEACHERS.map(teacher => (
                        <tr key={teacher.name}>
                            <td className="py-0.5 pl-1 align-top">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                        <span className="text-[9px] font-bold text-blue-700">{teacher.initials}</span>
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-semibold text-slate-700 leading-tight">{teacher.name}</p>
                                        <p className="text-[9px] text-slate-400">{teacher.subjects[0]}</p>
                                    </div>
                                </div>
=======
                    {TEACHER_NAMES.map(teacher => (
                        <tr key={teacher}>
                            <td className="py-1 px-2 align-top">
                                <p className="text-xs font-semibold text-gray-700 leading-tight">{teacher}</p>
>>>>>>> b5086afe9f866127f3983a9dd88f7862e3543847
                            </td>
                            {DAYS.map(day => {
                                const slots = schedule[teacher.name]?.[day] ?? [];
                                return (
                                    <td key={day} className="py-0.5 align-top">
                                        {slots.length === 0 ? (
<<<<<<< HEAD
                                            <div className="min-h-[52px] flex items-center justify-center rounded-lg bg-slate-50 border border-dashed border-slate-100">
                                                <span className="text-[10px] text-slate-300">Free</span>
=======
                                            <div className="min-h-[48px] flex items-center justify-center rounded-md bg-gray-50 border border-dashed border-gray-200">
                                                <span className="text-[10px] text-gray-300">Free</span>
>>>>>>> b5086afe9f866127f3983a9dd88f7862e3543847
                                            </div>
                                        ) : (
                                            <div className="space-y-0.5">
                                                {slots.map(s => {
                                                    const color = SUBJ_COLOR[s.subject] ?? 'slate';
                                                    return (
<<<<<<< HEAD
                                                        <div key={s.periodId} className={cn('px-2 py-1 rounded-lg border text-[10px]', COLOR_CELL[color] ?? COLOR_CELL.slate)}>
                                                            <span className="font-bold">P{s.periodId}</span>
                                                            <span className="opacity-50 mx-1">·</span>
                                                            <span className="font-medium">{s.cls}</span>
=======
                                                        <div key={s.periodId} className={cn(
                                                            'px-2 py-1.5 rounded-md border text-[11px]',
                                                            COLOR_MAP[color] ?? COLOR_MAP.slate
                                                        )}>
                                                            <span className="font-semibold">P{s.periodId}</span>
                                                            <span className="opacity-60 mx-1">·</span>
                                                            <span>{s.cls}</span>
>>>>>>> b5086afe9f866127f3983a9dd88f7862e3543847
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

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION PANEL (right sidebar)
// ─────────────────────────────────────────────────────────────────────────────

function ValidationPanel({ issues }) {
    const errors = issues.filter(i => i.severity === 'error');
    const warnings = issues.filter(i => i.severity === 'warning');

    if (issues.length === 0) {
        return (
<<<<<<< HEAD
            <div className="text-center py-10">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-sm font-semibold text-slate-700">No issues</p>
                <p className="text-xs text-slate-400 mt-0.5">Ready to approve</p>
=======
            <div className="text-center py-6">
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
                <p className="text-sm font-semibold text-gray-700">All constraints satisfied</p>
                <p className="text-xs text-gray-400 mt-1">Timetable is ready to approve</p>
>>>>>>> b5086afe9f866127f3983a9dd88f7862e3543847
            </div>
        );
    }

    return (
<<<<<<< HEAD
        <div className="space-y-2 overflow-y-auto max-h-full pr-0.5">
            {errors.map(i => (
                <div key={i.id} className="flex items-start gap-2.5 p-2.5 bg-red-50 border border-red-100 rounded-xl">
                    <XCircle className="w-3.5 h-3.5 text-red-500 mt-0.5 shrink-0" />
                    <div className="min-w-0">
                        <p className="text-[11px] font-semibold text-red-800 leading-tight">{i.message}</p>
                        <p className="text-[10px] text-red-500 mt-0.5">{i.details}</p>
                    </div>
                </div>
            ))}
            {warnings.map(i => (
                <div key={i.id} className="flex items-start gap-2.5 p-2.5 bg-amber-50 border border-amber-100 rounded-xl">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                    <div className="min-w-0">
                        <p className="text-[11px] font-semibold text-amber-800 leading-tight">{i.message}</p>
                        <p className="text-[10px] text-amber-500 mt-0.5">{i.details}</p>
                    </div>
=======
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
>>>>>>> b5086afe9f866127f3983a9dd88f7862e3543847
                </div>
            ))}
        </div>
    );
}

<<<<<<< HEAD
// ─────────────────────────────────────────────────────────────────────────────
// SUBSTITUTION PANEL
// ─────────────────────────────────────────────────────────────────────────────

function SubstitutionPanel() {
    const [rows, setRows] = useState(ABSENT_TODAY);
    const [selects, setSelects] = useState({});

    const totalPeriods = rows.flatMap(r => r.periods).length;
    const assigned = rows.flatMap(r => r.periods).filter(p => p.status === 'assigned').length;
    const pending = totalPeriods - assigned;

    const assign = (ti, pi) => {
        const key = `${ti}-${pi}`;
        const val = selects[key];
        if (!val) return;
        const name = val.split(' (')[0];
        setRows(prev => {
            const next = prev.map(r => ({ ...r, periods: [...r.periods] }));
            next[ti].periods[pi] = { ...next[ti].periods[pi], status: 'assigned', sub: name };
            return next;
        });
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Summary chips */}
            <div className="grid grid-cols-4 gap-2">
                {[
                    { val: rows.length, label: 'Absent', color: 'text-red-600' },
                    { val: totalPeriods, label: 'Periods', color: 'text-amber-600' },
                    { val: assigned, label: 'Assigned', color: 'text-green-600' },
                    { val: pending, label: 'Pending', color: 'text-blue-600' },
                ].map(({ val, label, color }) => (
                    <div key={label} className="bg-white rounded-xl border border-slate-100 p-3 text-center">
                        <p className={cn('text-xl font-semibold', color)}>{val}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{label}</p>
                    </div>
                ))}
            </div>

            {/* Absent teacher cards */}
            {rows.map((t, ti) => (
                <div key={t.name} className="bg-white rounded-xl border border-slate-100 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 bg-red-50 border-b border-red-100">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                                <span className="text-[10px] font-bold text-red-700">{t.initials}</span>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-800">{t.name}</p>
                                <p className="text-[11px] text-slate-500">{t.subject} · {t.reason}</p>
                            </div>
                        </div>
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 text-red-700 text-[11px] font-semibold">
                            <UserX size={11} /> Absent
                        </span>
                    </div>

                    <div className="divide-y divide-slate-50">
                        {t.periods.map((row, pi) => {
                            const key = `${ti}-${pi}`;
                            return (
                                <div key={pi} className="grid gap-3 px-4 py-2.5 items-center text-xs" style={{ gridTemplateColumns: '72px 80px 1fr 100px' }}>
                                    <div>
                                        <p className="font-semibold text-slate-800">{row.p}</p>
                                        <p className="text-[10px] text-slate-400">{row.time}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-700">{row.cls}</p>
                                        <p className="text-[10px] text-slate-400">{row.subj}</p>
                                    </div>
                                    {row.status === 'assigned' ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-[11px] font-semibold w-fit">
                                            <Check size={10} /> {row.sub}
                                        </span>
                                    ) : (
                                        <select
                                            value={selects[key] ?? ''}
                                            onChange={e => setSelects(prev => ({ ...prev, [key]: e.target.value }))}
                                            className="w-full px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-300"
                                        >
                                            <option value="">Free teachers ({row.subj})…</option>
                                            {(FREE_TEACHERS[row.subj] ?? []).map(o => <option key={o}>{o}</option>)}
                                        </select>
                                    )}
                                    {row.status === 'assigned' ? (
                                        <span className="text-[10px] font-semibold text-green-600 text-right">Done</span>
                                    ) : (
                                        <button
                                            onClick={() => assign(ti, pi)}
                                            disabled={!selects[key]}
                                            className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-[11px] font-semibold hover:bg-blue-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Assign
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// SLOT MODAL
// ─────────────────────────────────────────────────────────────────────────────

function SlotModal({ selection, timetable, onClose, onSave }) {
=======
// ─── SWAP MODAL (Notion style) ───────────────────────────────────────────────

function SwapModal({ isOpen, onClose, onSwap, timetable, selection }) {
>>>>>>> b5086afe9f866127f3983a9dd88f7862e3543847
    const [mode, setMode] = useState('replace');
    const [newTeacher, setNewTeacher] = useState('');
    const [targetClass, setTargetClass] = useState('');
    const [targetDay, setTargetDay] = useState('');
    const [targetPeriod, setTargetPeriod] = useState('');
    const [saving, setSaving] = useState(false);

    if (!selection) return null;

    const canSave = mode === 'replace' ? !!newTeacher : (!!targetClass && !!targetDay && !!targetPeriod);
    const targetCell = timetable[targetClass]?.[targetDay]?.[Number(targetPeriod)];

    const handleSave = async () => {
        setSaving(true);
        await new Promise(r => setTimeout(r, 600));
        onSave({ mode, newTeacher, targetClass, targetDay, targetPeriod: Number(targetPeriod) });
        setSaving(false);
        onClose();
    };

    return (
<<<<<<< HEAD
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200">
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <ArrowLeftRight className="w-4 h-4 text-blue-600" />
                        <h2 className="text-sm font-semibold text-slate-800">Manage Slot</h2>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"><X size={15} /></button>
                </div>
                <div className="p-5 space-y-4">
                    {/* Current slot */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Selected slot</p>
                        <p className="font-semibold text-slate-800">{selection.cell?.subject ?? 'Empty'}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{selection.className} · {selection.day} · Period {selection.periodId}</p>
                        {selection.cell?.teacher && <p className="text-xs text-slate-500">Teacher: <span className="font-medium text-slate-700">{selection.cell.teacher}</span></p>}
                    </div>

                    {/* Mode toggle */}
                    <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl">
                        {(['replace', 'swap']).map(m => (
                            <button key={m} onClick={() => setMode(m)} className={cn(
                                'flex-1 py-1.5 rounded-[10px] text-xs font-medium transition-all',
                                mode === m ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                            )}>
                                {m === 'replace' ? 'Change Teacher' : 'Swap Slots'}
=======
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
>>>>>>> b5086afe9f866127f3983a9dd88f7862e3543847
                            </button>
                        ))}
                    </div>

                    {mode === 'replace' && (
<<<<<<< HEAD
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1.5">New Teacher</label>
                            <select value={newTeacher} onChange={e => setNewTeacher(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300">
                                <option value="">Select teacher…</option>
                                {TEACHER_NAMES.filter(t => t !== selection.cell?.teacher).map(t => <option key={t}>{t}</option>)}
                            </select>
                            <p className="text-[10px] text-slate-400 mt-1.5">Writes a DayOverride — base timetable unchanged.</p>
=======
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
>>>>>>> b5086afe9f866127f3983a9dd88f7862e3543847
                        </div>
                    )}

                    {mode === 'swap' && (
                        <div className="space-y-3">
<<<<<<< HEAD
                            <p className="text-xs text-slate-500">Pick the target slot. Both teachers will be exchanged.</p>
                            <select value={targetClass} onChange={e => { setTargetClass(e.target.value); setTargetDay(''); setTargetPeriod(''); }}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300">
                                <option value="">Select class…</option>
                                {CLASSES.map(c => <option key={c}>{c}</option>)}
                            </select>
                            <div className="grid grid-cols-2 gap-2">
                                <select value={targetDay} onChange={e => { setTargetDay(e.target.value); setTargetPeriod(''); }} disabled={!targetClass}
                                    className="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-40">
                                    <option value="">Day…</option>
                                    {DAYS.map(d => <option key={d}>{d}</option>)}
                                </select>
                                <select value={targetPeriod} onChange={e => setTargetPeriod(e.target.value)} disabled={!targetDay}
                                    className="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-40">
                                    <option value="">Period…</option>
                                    {PERIOD_SLOTS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                                </select>
                            </div>
                            {targetCell && (
                                <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-xs">
                                    <span className="font-semibold text-blue-800">{targetCell.subject}</span>
                                    <span className="text-blue-600"> · {targetCell.teacher}</span>
=======
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
>>>>>>> b5086afe9f866127f3983a9dd88f7862e3543847
                                </div>
                            )}
                        </div>
                    )}

<<<<<<< HEAD
                    <div className="flex gap-2 pt-1">
                        <button onClick={onClose} className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">Cancel</button>
                        <button onClick={handleSave} disabled={!canSave || saving}
                            className="flex-1 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-40 flex items-center justify-center gap-2 transition-colors">
                            {saving ? <Loader2 size={13} className="animate-spin" /> : <ArrowLeftRight size={13} />}
                            {saving ? 'Saving…' : mode === 'replace' ? 'Change Teacher' : 'Swap'}
=======
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
>>>>>>> b5086afe9f866127f3983a9dd88f7862e3543847
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// AVAILABILITY MODAL
// ─────────────────────────────────────────────────────────────────────────────

function AvailabilityModal({ availability, onClose, onUpdate }) {
    const [local, setLocal] = useState(availability);
    const [sel, setSel] = useState(TEACHER_NAMES[0]);
    const data = local[sel] ?? {};

    const toggle = (day, field, val) =>
        setLocal(p => ({ ...p, [sel]: { ...p[sel], [day]: { ...p[sel]?.[day], [field]: val } } }));

    const togglePeriod = (day, id) => {
        const curr = local[sel]?.[day]?.unavailablePeriods ?? [];
        toggle(day, 'unavailablePeriods', curr.includes(id) ? curr.filter(p => p !== id) : [...curr, id]);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-200 flex flex-col" style={{ maxHeight: '85vh' }}>
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-blue-600" />
                        <h2 className="text-sm font-semibold text-slate-800">Teacher Availability</h2>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"><X size={15} /></button>
                </div>
                <div className="flex gap-4 p-5 overflow-hidden flex-1 min-h-0">
                    <div className="w-36 flex-shrink-0 space-y-0.5 overflow-y-auto">
                        {TEACHER_NAMES.map(t => (
                            <button key={t} onClick={() => setSel(t)} className={cn(
                                'w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors',
                                sel === t ? 'bg-blue-600 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
                            )}>{t}</button>
                        ))}
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                        {DAYS.map(day => {
                            const d = data[day] ?? { available: true, maxPeriods: 6, unavailablePeriods: [] };
                            return (
                                <div key={day} className="border border-slate-200 rounded-xl p-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-semibold text-slate-700">{day}</span>
                                        <div onClick={() => toggle(day, 'available', !d.available)}
                                            className={cn('w-8 h-4 rounded-full relative cursor-pointer transition-colors', d.available ? 'bg-green-500' : 'bg-slate-300')}>
                                            <div className={cn('w-3 h-3 bg-white rounded-full absolute top-0.5 shadow transition-transform', d.available ? 'translate-x-4' : 'translate-x-0.5')} />
                                        </div>
                                    </div>
                                    {d.available && (
                                        <>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-[10px] text-slate-500 flex-shrink-0">Max: <b>{d.maxPeriods}</b></span>
                                                <input type="range" min={1} max={8} value={d.maxPeriods} onChange={e => toggle(day, 'maxPeriods', Number(e.target.value))} className="flex-1 accent-blue-600" />
                                            </div>
                                            <div className="flex flex-wrap gap-1">
                                                {PERIOD_SLOTS.map(s => {
                                                    const blocked = (d.unavailablePeriods ?? []).includes(s.id);
                                                    return (
                                                        <button key={s.id} onClick={() => togglePeriod(day, s.id)}
                                                            className={cn('px-2 py-0.5 rounded-md text-[10px] font-medium transition-colors',
                                                                blocked ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')}>
                                                            P{s.id}
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
                <div className="flex gap-2 px-5 py-3 border-t border-slate-100 flex-shrink-0">
                    <button onClick={onClose} className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50">Cancel</button>
                    <button onClick={() => { onUpdate(local); onClose(); }} className="flex-1 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 flex items-center justify-center gap-2">
                        <Save size={13} /> Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// LONG-TERM SWAP MODAL
// ─────────────────────────────────────────────────────────────────────────────

function LongTermSwapModal({ onClose }) {
    const [teacher, setTeacher] = useState('');
    const [replacement, setReplacement] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [saving, setSaving] = useState(false);
    const [done, setDone] = useState(false);

    const canSave = teacher && replacement && replacement !== teacher && startDate && endDate && endDate >= startDate;

    const handleSave = async () => {
        setSaving(true);
        await new Promise(r => setTimeout(r, 900));
        setSaving(false);
        setDone(true);
        setTimeout(onClose, 1200);
    };

    return (
<<<<<<< HEAD
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm border border-slate-200">
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <Repeat className="w-4 h-4 text-violet-600" />
                        <h2 className="text-sm font-semibold text-slate-800">Long-term Swap</h2>
=======
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
>>>>>>> b5086afe9f866127f3983a9dd88f7862e3543847
                    </div>
                    <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"><X size={15} /></button>
                </div>
<<<<<<< HEAD
                <div className="p-5 space-y-3">
                    <div className="p-3 bg-violet-50 border border-violet-100 rounded-xl text-[11px] text-violet-700">
                        Replaces a teacher for a date range. Writes to <code className="bg-violet-100 px-1 rounded">SwapAssignment</code> — auto-reverts on end date.
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-[11px] font-medium text-slate-600 mb-1">Absent teacher</label>
                            <select value={teacher} onChange={e => setTeacher(e.target.value)} className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-violet-300">
                                <option value="">Select…</option>
                                {TEACHER_NAMES.map(t => <option key={t}>{t}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[11px] font-medium text-slate-600 mb-1">Replacement</label>
                            <select value={replacement} onChange={e => setReplacement(e.target.value)} disabled={!teacher} className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-violet-300 disabled:opacity-40">
                                <option value="">Select…</option>
                                {TEACHER_NAMES.filter(t => t !== teacher).map(t => <option key={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-[11px] font-medium text-slate-600 mb-1">Start date</label>
                            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-violet-300" />
                        </div>
                        <div>
                            <label className="block text-[11px] font-medium text-slate-600 mb-1">End date</label>
                            <input type="date" value={endDate} min={startDate} onChange={e => setEndDate(e.target.value)} className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-violet-300" />
                        </div>
                    </div>
                    <div className="flex gap-2 pt-1">
                        <button onClick={onClose} className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50">Cancel</button>
                        <button onClick={handleSave} disabled={!canSave || saving || done}
                            className={cn('flex-1 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors',
                                done ? 'bg-green-600 text-white' : 'bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-40')}>
                            {done ? <><Check size={13} /> Created</> : saving ? <><Loader2 size={13} className="animate-spin" /> Creating…</> : <><Repeat size={13} /> Create Swap</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
=======

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
>>>>>>> b5086afe9f866127f3983a9dd88f7862e3543847
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT PAGE
// ─────────────────────────────────────────────────────────────────────────────

// TabId: teacher | class | substitutions

export default function TimetablePage() {
    const [timetable, setTimetable] = useState({});
    const [availability, setAvailability] = useState({});
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [approving, setApproving] = useState(false);
    const [approved, setApproved] = useState(false);

    const [activeTab, setActiveTab] = useState('teacher');
    const [selectedClass, setSelectedClass] = useState('10-A');
    const [selectedCell, setSelectedCell] = useState(null);

    const [showSlotModal, setShowSlotModal] = useState(false);
    const [showAvailModal, setShowAvailModal] = useState(false);
    const [showSwapModal, setShowSwapModal] = useState(false);

    const issues = useMemo(() => validate(timetable, availability), [timetable, availability]);
    const errorCount = issues.filter(i => i.severity === 'error').length;
    const warnCount = issues.filter(i => i.severity === 'warning').length;

    useEffect(() => {
        (async () => {
            await new Promise(r => setTimeout(r, 700));
            setTimetable(generateTimetable());
            setAvailability(generateAvailability());
            setLoading(false);
        })();
    }, []);

    const handleGenerate = async () => {
        setGenerating(true);
        setApproved(false);
        await new Promise(r => setTimeout(r, 1600));
        setTimetable(generateTimetable());
        setGenerating(false);
    };

    const handleApprove = async () => {
        if (errorCount > 0) return;
        setApproving(true);
        await new Promise(r => setTimeout(r, 900));
        setApproved(true);
        setApproving(false);
    };

    const handleCellClick = useCallback((className, day, periodId, cell) => {
        if (approved) return;
        setSelectedCell({ className, day, periodId, cell });
        setShowSlotModal(true);
    }, [approved]);

    const handleSlotSave = useCallback(({ mode, newTeacher, targetClass, targetDay, targetPeriod }) => {
        setTimetable(prev => {
            const next = JSON.parse(JSON.stringify(prev));
            const { className, day, periodId } = selectedCell;
            if (mode === 'replace') {
                if (next[className]?.[day]?.[periodId]) next[className][day][periodId].teacher = newTeacher;
            } else {
                const a = next[className]?.[day]?.[periodId];
                const b = next[targetClass]?.[targetDay]?.[targetPeriod];
                if (a && b) { const tmp = a.teacher; a.teacher = b.teacher; b.teacher = tmp; }
            }
            return next;
        });
    }, [selectedCell]);

    if (loading) {
        return (
            <div className="min-h-screen bg-violet-50 flex items-center justify-center">
                <div className="text-center">
<<<<<<< HEAD
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
                    <p className="text-sm text-slate-400">Loading timetable…</p>
=======
                    <Loader2 className="w-10 h-10 animate-spin text-violet-600 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">Loading timetable…</p>
>>>>>>> b5086afe9f866127f3983a9dd88f7862e3543847
                </div>
            </div>
        );
    }

    const TABS = [
        { id: 'teacher', label: 'Teacher view' },
        { id: 'class', label: 'Class view' },
        { id: 'substitutions', label: 'Substitutions', badge: 3 },
    ];

    return (
<<<<<<< HEAD
        <div className="min-h-screen bg-slate-50/60 flex flex-col">
            {/* ── Sticky top bar ── */}
            <div className="sticky top-0 z-20 bg-white border-b border-slate-100 shadow-sm">
                <div className="max-w-screen-2xl mx-auto px-6">
                    {/* Row 1: title + actions */}
                    <div className="flex items-center justify-between py-3 gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                                <Calendar className="w-4 h-4 text-white" />
=======
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
>>>>>>> b5086afe9f866127f3983a9dd88f7862e3543847
                            </div>
                            <div>
                                <h1 className="text-base font-semibold text-slate-900 leading-tight">Timetable</h1>
                                <p className="text-xs text-slate-400">Manage weekly schedules & substitutions</p>
                            </div>
                        </div>

<<<<<<< HEAD
                        <div className="flex items-center gap-2">
                            {/* Validation indicator */}
                            {!approved && issues.length > 0 && (
                                <div className={cn(
                                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium',
                                    errorCount > 0 ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                                )}>
                                    {errorCount > 0 ? <XCircle size={12} /> : <AlertCircle size={12} />}
                                    {errorCount > 0 ? `${errorCount} error${errorCount > 1 ? 's' : ''}` : `${warnCount} warning${warnCount > 1 ? 's' : ''}`}
                                </div>
                            )}
                            {approved && (
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                                    <Lock size={12} /> Approved & locked
                                </div>
                            )}

                            <button onClick={() => setShowAvailModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-xs font-medium hover:bg-slate-50 transition-colors">
                                <UserCheck size={13} /> Availability
                            </button>
                            <button onClick={() => setShowSwapModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-xs font-medium hover:bg-slate-50 transition-colors">
                                <Repeat size={13} /> Long-term swap
                            </button>
                            <button onClick={handleGenerate} disabled={generating || approved} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-xs font-medium hover:bg-slate-50 transition-colors disabled:opacity-40">
                                {generating ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
                                {generating ? 'Generating…' : 'Regenerate'}
                            </button>
                            <button onClick={handleApprove} disabled={errorCount > 0 || approving || approved}
                                className={cn(
                                    'flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors',
                                    approved ? 'bg-green-600 text-white cursor-default'
                                        : errorCount > 0 ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                )}>
                                {approving ? <Loader2 size={13} className="animate-spin" /> : approved ? <Lock size={13} /> : <CheckCircle size={13} />}
                                {approving ? 'Approving…' : approved ? 'Locked' : 'Approve'}
                            </button>
                        </div>
                    </div>

                    {/* Row 2: tabs + class pills (inline, no second row) */}
                    <div className="flex items-center gap-0 border-t border-slate-100">
                        {/* Tabs */}
                        <div className="flex">
                            {TABS.map(tab => (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        'flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 transition-all',
                                        activeTab === tab.id
                                            ? 'border-blue-600 text-blue-600'
                                            : 'border-transparent text-slate-500 hover:text-slate-700'
=======
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
>>>>>>> b5086afe9f866127f3983a9dd88f7862e3543847
                                    )}>
                                    {tab.label}
                                    {tab.badge && (
                                        <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">{tab.badge}</span>
                                    )}
                                </button>
                            ))}
                        </div>

<<<<<<< HEAD
                        {/* Class pills — only visible on class tab */}
                        {activeTab === 'class' && (
                            <div className="flex items-center gap-1 ml-4 pl-4 border-l border-slate-100 py-1.5">
                                {CLASSES.map(cls => (
                                    <button key={cls} onClick={() => setSelectedClass(cls)}
                                        className={cn(
                                            'px-3 py-1 rounded-lg text-xs font-medium transition-colors',
                                            selectedClass === cls ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        )}>
                                        {cls}
=======
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
>>>>>>> b5086afe9f866127f3983a9dd88f7862e3543847
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Right: print / export */}
                        <div className="flex items-center gap-1.5 ml-auto py-1.5">
                            <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 text-xs transition-colors">
                                <Printer size={12} /> Print
                            </button>
                            <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 text-xs transition-colors">
                                <Download size={12} /> Export
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Body ── */}
            <div className="flex-1 max-w-screen-2xl w-full mx-auto px-6 py-5 flex gap-5 min-h-0">
                {/* ── Main content area (fills available width) ── */}
                <div className="flex-1 min-w-0 bg-white rounded-2xl border border-slate-100 overflow-hidden flex flex-col">
                    <div className="flex-1 overflow-auto p-4">
                        {activeTab === 'teacher' && <TeacherGrid timetable={timetable} />}
                        {activeTab === 'class' && (
                            <ClassGrid
                                timetable={timetable}
                                className={selectedClass}
                                selectedCell={selectedCell}
                                onCellClick={handleCellClick}
                                locked={approved}
                            />
                        )}
                        {activeTab === 'substitutions' && <SubstitutionPanel />}
                    </div>

                    {/* Bottom hint */}
                    {!approved && activeTab === 'class' && (
                        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50">
                            <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                                <Edit2 size={10} /> Click any cell to change teacher or swap slots
                            </p>
                        </div>
                    )}
                    {approved && (
                        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50">
                            <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                                <Lock size={10} /> Timetable locked — editing disabled
                            </p>
                        </div>
                    )}
                </div>

                {/* ── Right sidebar: validation ── */}
                {activeTab !== 'substitutions' && (
                    <div className="w-64 flex-shrink-0 flex flex-col gap-3">
                        <div className="bg-white rounded-2xl border border-slate-100 flex flex-col overflow-hidden" style={{ maxHeight: 'calc(100vh - 130px)' }}>
                            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
                                <h3 className="text-xs font-semibold text-slate-700">Validation</h3>
                                <div className="flex items-center gap-1.5">
                                    {errorCount > 0 && (
                                        <span className="px-1.5 py-0.5 rounded-md bg-red-100 text-red-700 text-[10px] font-bold">{errorCount} err</span>
                                    )}
                                    {warnCount > 0 && (
                                        <span className="px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-700 text-[10px] font-bold">{warnCount} warn</span>
                                    )}
                                    {issues.length === 0 && (
                                        <span className="px-1.5 py-0.5 rounded-md bg-green-100 text-green-700 text-[10px] font-bold">Clean</span>
                                    )}
                                </div>
                            </div>
                            <div className="p-3 flex-1 overflow-y-auto">
                                <ValidationPanel issues={issues} />
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="bg-white rounded-2xl border border-slate-100 p-4">
                            <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3">Subject legend</h3>
                            <div className="space-y-1">
                                {Object.entries(SUBJ_COLOR).slice(0, 8).map(([subj, color]) => (
                                    <div key={subj} className="flex items-center gap-2">
                                        <div className={cn('w-2.5 h-2.5 rounded-sm border flex-shrink-0', COLOR_CELL[color])} />
                                        <span className="text-[10px] text-slate-600 truncate">{subj}</span>
                                    </div>
                                ))}
                                <p className="text-[10px] text-slate-400 mt-1">+{Object.keys(SUBJ_COLOR).length - 8} more</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Modals ── */}
            {showSlotModal && (
                <SlotModal
                    selection={selectedCell}
                    timetable={timetable}
                    onClose={() => { setShowSlotModal(false); setSelectedCell(null); }}
                    onSave={handleSlotSave}
                />
            )}
            {showAvailModal && (
                <AvailabilityModal
                    availability={availability}
                    onClose={() => setShowAvailModal(false)}
                    onUpdate={setAvailability}
                />
            )}
            {showSwapModal && (
                <LongTermSwapModal onClose={() => setShowSwapModal(false)} />
            )}
        </div>
    );
}