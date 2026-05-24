'use client';

import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import {
    Calendar, Users, Search, Download, CheckCircle, XCircle,
    Clock, TrendingUp, TrendingDown, UserX, FilterX, RefreshCw,
    Loader2, MessageCircle, School, X, Save, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const CLASSES = [
    'Nursery', 'LKG', 'UKG',
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'
];

const SECTIONS = ['A', 'B', 'C', 'D'];

const ATTENDANCE_STATUS = {
    present: { label: 'Present', icon: CheckCircle },
    absent: { label: 'Absent', icon: XCircle },
    late: { label: 'Late', icon: Clock },
    leave: { label: 'Leave', icon: UserX },
};

const STATUS_STYLES = {
    present: 'bg-green-50 text-green-700 border-green-200',
    absent: 'bg-red-50 text-red-700 border-red-200',
    late: 'bg-amber-50 text-amber-700 border-amber-200',
    leave: 'bg-purple-50 text-purple-700 border-purple-200',
};

const STATUS_BUTTON_ACTIVE = {
    present: 'bg-green-100 text-green-700 ring-1 ring-green-300',
    absent: 'bg-red-100 text-red-700 ring-1 ring-red-300',
    late: 'bg-amber-100 text-amber-700 ring-1 ring-amber-300',
    leave: 'bg-purple-100 text-purple-700 ring-1 ring-purple-300',
};

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA — generated once, outside React, never regenerated on render
// ─────────────────────────────────────────────────────────────────────────────

const FIRST_NAMES = ['Aarav', 'Vihaan', 'Vivaan', 'Ananya', 'Diya', 'Advik', 'Kabir', 'Aadhya', 'Sai', 'Ishita', 'Reyansh', 'Anaya', 'Shaurya', 'Myra', 'Dhruv', 'Kiara', 'Arjun', 'Sara', 'Rudra', 'Jiya'];
const LAST_NAMES = ['Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Joshi', 'Nair', 'Reddy', 'Patel', 'Malhotra'];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateStudents = (className, section) =>
    Array.from({ length: 35 }, (_, i) => {
        const r = Math.random();
        const status = r < 0.05 ? 'absent' : r < 0.10 ? 'late' : r < 0.15 ? 'leave' : 'present';
        return {
            id: `STU${String(i + 1).padStart(4, '0')}`,
            name: `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,
            roll: i + 1,
            status,
            pct: rnd(70, 99),
            phone: `+91 ${rnd(7000000000, 9999999999)}`,
            email: `parent${i + 1}@example.com`,
            className,
            section,
        };
    });

const generateAttendanceData = () =>
    CLASSES.flatMap(cls =>
        SECTIONS.map(sec => {
            const students = generateStudents(cls, sec);
            const present = students.filter(s => s.status === 'present').length;
            const absent = students.filter(s => s.status === 'absent').length;
            const late = students.filter(s => s.status === 'late').length;
            const leave = students.filter(s => s.status === 'leave').length;
            return {
                cls, sec, students,
                present, absent, late, leave,
                total: students.length,
                pct: Math.round((present / students.length) * 100),
            };
        })
    );

const generateMonthlyStats = () =>
    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        .map(month => ({ month, pct: rnd(78, 97) }));

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const pctColor = (p) =>
    p >= 85
        ? { pill: 'bg-green-100 text-green-700', bar: 'bg-green-500' }
        : p >= 70
            ? { pill: 'bg-amber-100 text-amber-700', bar: 'bg-amber-500' }
            : { pill: 'bg-red-100 text-red-700', bar: 'bg-red-500' };

// ─────────────────────────────────────────────────────────────────────────────
// STAT CARD — memo: never re-renders unless props change
// ─────────────────────────────────────────────────────────────────────────────

const StatCard = memo(function StatCard({ title, value, icon: Icon, iconBg, iconColor, trend, subtitle }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', iconBg)}>
                    <Icon className={cn('w-4 h-4', iconColor)} />
                </div>
                {trend !== 0 && (
                    <span className={cn(
                        'inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full',
                        trend > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    )}>
                        {trend > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                        {Math.abs(trend)}%
                    </span>
                )}
            </div>
            <div>
                <p className="text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
                <p className="text-sm font-medium text-slate-700 mt-0.5">{title}</p>
                {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
            </div>
        </div>
    );
});

// ─────────────────────────────────────────────────────────────────────────────
// CLASS CARD — memo: skips re-render when other cards change
// ─────────────────────────────────────────────────────────────────────────────

const ClassCard = memo(function ClassCard({ data, onViewDetails }) {
    const colors = pctColor(data.pct);
    return (
        <div
            className="bg-white rounded-2xl border border-slate-100 p-4 hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer group"
            onClick={() => onViewDetails(data)}
        >
            <div className="flex items-start justify-between mb-3">
                <div>
                    <h3 className="text-sm font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">
                        Class {data.cls}–{data.sec}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">{data.total} students</p>
                </div>
                <span className={cn('text-[11px] font-semibold px-2.5 py-0.5 rounded-full', colors.pill)}>
                    {data.pct}%
                </span>
            </div>

            <div className="h-1 bg-slate-100 rounded-full overflow-hidden mb-4">
                <div className={cn('h-full rounded-full', colors.bar)} style={{ width: `${data.pct}%` }} />
            </div>

            <div className="grid grid-cols-3 divide-x divide-slate-100 text-center">
                <div className="pr-2">
                    <p className="text-sm font-semibold text-green-600">{data.present}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Present</p>
                </div>
                <div className="px-2">
                    <p className="text-sm font-semibold text-red-600">{data.absent}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Absent</p>
                </div>
                <div className="pl-2">
                    <p className="text-sm font-semibold text-amber-600">{data.late + data.leave}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Late / Leave</p>
                </div>
            </div>
        </div>
    );
});

// ─────────────────────────────────────────────────────────────────────────────
// MONTHLY CHART — memo
// ─────────────────────────────────────────────────────────────────────────────

const MonthlyChart = memo(function MonthlyChart({ data }) {
    const max = useMemo(() => Math.max(...data.map(d => d.pct)), [data]);
    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold text-slate-800">Monthly attendance trend</h3>
                <select className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-600 bg-white">
                    <option>2024–2025</option>
                    <option>2023–2024</option>
                </select>
            </div>
            <div className="flex items-end gap-1.5 h-36">
                {data.map((d, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group cursor-pointer">
                        <span className="text-[9px] font-medium text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            {d.pct}%
                        </span>
                        <div
                            className="w-full bg-blue-500 rounded-t-md group-hover:bg-blue-600 transition-colors"
                            style={{ height: `${Math.round((d.pct / max) * 100)}%`, minHeight: 4 }}
                        />
                        <span className="text-[9px] text-slate-400">{d.month}</span>
                    </div>
                ))}
            </div>
        </div>
    );
});

// ─────────────────────────────────────────────────────────────────────────────
// STUDENT ROW — memo: each row only re-renders if that student's status changed
// ─────────────────────────────────────────────────────────────────────────────

const StudentRow = memo(function StudentRow({ student, status, onUpdateStatus }) {
    const cfg = ATTENDANCE_STATUS[status];
    const Icon = cfg.icon;
    return (
        <tr className="hover:bg-slate-50/70 transition-colors">
            <td className="py-3 px-4 text-slate-400 text-xs">{student.roll}</td>
            <td className="py-3 px-4">
                <p className="font-medium text-slate-800 text-sm leading-tight">{student.name}</p>
                <p className="text-[10px] text-slate-400">{student.id}</p>
            </td>
            <td className="py-3 px-4">
                <span className={cn(
                    'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border',
                    STATUS_STYLES[status]
                )}>
                    <Icon size={11} />
                    {cfg.label}
                </span>
            </td>
            <td className="py-3 px-4">
                <div className="flex gap-1.5">
                    {Object.entries(ATTENDANCE_STATUS).map(([key, config]) => {
                        const BtnIcon = config.icon;
                        return (
                            <button
                                key={key}
                                onClick={() => onUpdateStatus(student.id, key)}
                                title={config.label}
                                className={cn(
                                    'p-1.5 rounded-lg transition-all',
                                    status === key
                                        ? STATUS_BUTTON_ACTIVE[key]
                                        : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                                )}
                            >
                                <BtnIcon size={13} />
                            </button>
                        );
                    })}
                </div>
            </td>
        </tr>
    );
});

// ─────────────────────────────────────────────────────────────────────────────
// ATTENDANCE MODAL
// ─────────────────────────────────────────────────────────────────────────────

function AttendanceModal({ classData, onClose, onSave }) {
    // Shallow status-only map — much cheaper than deep-cloning 35 student objects
    const [statusMap, setStatusMap] = useState(() => {
        const m = {};
        classData.students.forEach(s => { m[s.id] = s.status; });
        return m;
    });
    const [hasChanges, setHasChanges] = useState(false);

    const updateStatus = useCallback((id, status) => {
        setStatusMap(prev => ({ ...prev, [id]: status }));
        setHasChanges(true);
    }, []);

    const counts = useMemo(() => {
        const c = { present: 0, absent: 0, late: 0, leave: 0 };
        Object.values(statusMap).forEach(s => c[s]++);
        return c;
    }, [statusMap]);

    const pct = Math.round((counts.present / classData.students.length) * 100);

    const handleSave = () => {
        const updated = classData.students.map(s => ({ ...s, status: statusMap[s.id] }));
        onSave(updated);
        setHasChanges(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl flex flex-col border border-slate-200" style={{ height: '80vh', overflow: 'hidden' }}>
                {/* Header */}
                <div className="flex items-start justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
                    <div>
                        <h2 className="text-base font-semibold text-slate-900">
                            Class {classData.cls}–{classData.sec}
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5">
                            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={16} />
                    </button>
                </div>

                {/* Summary chips */}
                <div className="flex gap-3 px-6 py-3 border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
                    {[
                        { label: 'Present', val: counts.present, color: 'text-green-600' },
                        { label: 'Absent', val: counts.absent, color: 'text-red-600' },
                        { label: 'Late', val: counts.late, color: 'text-amber-600' },
                        { label: 'Leave', val: counts.leave, color: 'text-purple-600' },
                    ].map(({ label, val, color }) => (
                        <div key={label} className="bg-white rounded-xl border border-slate-100 px-4 py-2 text-center min-w-[72px]">
                            <p className={cn('text-xl font-semibold', color)}>{val}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{label}</p>
                        </div>
                    ))}
                    <div className="bg-white rounded-xl border border-slate-100 px-4 py-2 text-center min-w-[72px] ml-auto">
                        <p className={cn('text-xl font-semibold', pct >= 85 ? 'text-green-600' : pct >= 70 ? 'text-amber-600' : 'text-red-600')}>{pct}%</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Attendance</p>
                    </div>
                </div>

                {/* Scrollable table — isolated scroll region, GPU-promoted */}
                <div
                    className="overflow-y-auto flex-1"
                    style={{ overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch', willChange: 'transform' }}
                >
                    <table className="w-full text-sm">
                        <thead className="sticky top-0 bg-white border-b border-slate-100 z-10">
                            <tr>
                                <th className="text-left py-3 px-4 text-[10px] font-semibold text-slate-400 uppercase tracking-wider w-12">#</th>
                                <th className="text-left py-3 px-4 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Student</th>
                                <th className="text-left py-3 px-4 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="text-left py-3 px-4 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Mark as</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {classData.students.map(student => (
                                <StudentRow
                                    key={student.id}
                                    student={student}
                                    status={statusMap[student.id]}
                                    onUpdateStatus={updateStatus}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex-shrink-0">
                    <p className="text-xs text-slate-400">
                        {counts.present} of {classData.students.length} present · {pct}%
                    </p>
                    <button
                        onClick={handleSave}
                        disabled={!hasChanges}
                        className={cn(
                            'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
                            hasChanges
                                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        )}
                    >
                        <Save size={14} />
                        Save changes
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// CLASS SELECTOR — inline pill-style tabs instead of dropdown
// Nursery/LKG/UKG + 1–12 in a horizontally-scrollable row,
// sections appear inline once a class is selected
// ─────────────────────────────────────────────────────────────────────────────

const ClassSelector = memo(function ClassSelector({
    selectedClass, setSelectedClass,
    selectedSection, setSelectedSection,
}) {
    const handleClassClick = useCallback((cls) => {
        if (selectedClass === cls) {
            setSelectedClass('');
            setSelectedSection('');
        } else {
            setSelectedClass(cls);
            setSelectedSection('');
        }
    }, [selectedClass, setSelectedClass, setSelectedSection]);

    const handleSectionClick = useCallback((sec) => {
        setSelectedSection(prev => prev === sec ? '' : sec);
    }, [setSelectedSection]);

    return (
        <div className="flex flex-col gap-2">
            {/* Class pills — scrollable on mobile */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
                <button
                    onClick={() => { setSelectedClass(''); setSelectedSection(''); }}
                    className={cn(
                        'flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                        !selectedClass
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    )}
                >
                    All
                </button>
                {CLASSES.map(cls => (
                    <button
                        key={cls}
                        onClick={() => handleClassClick(cls)}
                        className={cn(
                            'flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                            selectedClass === cls
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        )}
                    >
                        {cls === 'Nursery' ? 'Nurs.' : cls === 'LKG' ? 'LKG' : cls === 'UKG' ? 'UKG' : `Cls ${cls}`}
                    </button>
                ))}
            </div>

            {/* Section pills — only shown when a class is selected */}
            {selectedClass && (
                <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 font-medium mr-1">Section:</span>
                    <button
                        onClick={() => setSelectedSection('')}
                        className={cn(
                            'px-2.5 py-1 rounded-md text-xs font-medium transition-all',
                            !selectedSection
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        )}
                    >
                        All
                    </button>
                    {SECTIONS.map(sec => (
                        <button
                            key={sec}
                            onClick={() => handleSectionClick(sec)}
                            className={cn(
                                'px-2.5 py-1 rounded-md text-xs font-medium transition-all',
                                selectedSection === sec
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            )}
                        >
                            {sec}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
});

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function AttendancePage() {
    const [allData, setAllData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [viewMode, setViewMode] = useState('grid');
    const [modalData, setModalData] = useState(null);
    const [monthlyStats, setMonthlyStats] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    // Load data once
    useEffect(() => {
        const load = async () => {
            setLoading(true);
            await new Promise(r => setTimeout(r, 800));
            setAllData(generateAttendanceData());
            setMonthlyStats(generateMonthlyStats());
            setLoading(false);
        };
        load();
    }, []);

    // Derived filtered data — useMemo avoids recalculating on unrelated state changes
    const filteredData = useMemo(() => {
        let f = allData;
        if (selectedClass) f = f.filter(c => c.cls === selectedClass);
        if (selectedSection) f = f.filter(c => c.sec === selectedSection);
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            f = f.filter(c => `class ${c.cls} ${c.sec} section ${c.sec}`.toLowerCase().includes(q));
        }
        return f;
    }, [allData, selectedClass, selectedSection, searchQuery]);

    // Aggregates from filteredData
    const { totalStudents, totalPresent, totalAbsent, totalLate, overallPct } = useMemo(() => {
        const totalStudents = allData.reduce((s, c) => s + c.total, 0);
        const totalPresent = allData.reduce((s, c) => s + c.present, 0);
        const totalAbsent = allData.reduce((s, c) => s + c.absent, 0);
        const totalLate = allData.reduce((s, c) => s + c.late, 0);
        const overallPct = totalStudents > 0 ? Math.round((totalPresent / totalStudents) * 100) : 0;
        return { totalStudents, totalPresent, totalAbsent, totalLate, overallPct };
    }, [allData]);

    const stats = useMemo(() => [
        { title: 'Total students', value: totalStudents, icon: Users, iconBg: 'bg-blue-50', iconColor: 'text-blue-600', trend: 5, subtitle: 'Across all classes' },
        { title: 'Present today', value: totalPresent, icon: CheckCircle, iconBg: 'bg-green-50', iconColor: 'text-green-600', trend: 3, subtitle: `${overallPct}% overall` },
        { title: 'Absent today', value: totalAbsent, icon: XCircle, iconBg: 'bg-red-50', iconColor: 'text-red-600', trend: -2, subtitle: `${totalLate} late arrivals` },
        { title: 'Classes shown', value: filteredData.length, icon: School, iconBg: 'bg-purple-50', iconColor: 'text-purple-600', trend: 0, subtitle: 'Active today' },
    ], [totalStudents, totalPresent, totalAbsent, totalLate, overallPct, filteredData.length]);

    const handleSaveAttendance = useCallback((updatedStudents) => {
        setAllData(prev => prev.map(c => {
            if (c.cls !== modalData?.cls || c.sec !== modalData?.sec) return c;
            const present = updatedStudents.filter(s => s.status === 'present').length;
            const absent = updatedStudents.filter(s => s.status === 'absent').length;
            const late = updatedStudents.filter(s => s.status === 'late').length;
            const leave = updatedStudents.filter(s => s.status === 'leave').length;
            return { ...c, students: updatedStudents, present, absent, late, leave, pct: Math.round((present / c.total) * 100) };
        }));
        // TODO: POST /api/attendance
    }, [modalData]);

    const clearFilters = useCallback(() => {
        setSelectedClass('');
        setSelectedSection('');
        setSearchQuery('');
    }, []);

    const handleViewDetails = useCallback((data) => setModalData(data), []);
    const hasFilters = selectedClass || selectedSection || searchQuery;

    return (
        <div className="min-h-screen bg-slate-50/60">
            <div className="max-w-screen-xl mx-auto p-6 space-y-5">

                {/* ── Header ── */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-600" />
                            Attendance
                        </h1>
                        <p className="text-sm text-slate-400 mt-0.5">Track and manage student attendance across all classes</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                            <Download size={14} />
                            Export report
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
                            <MessageCircle size={14} />
                            Send reminders
                        </button>
                    </div>
                </div>

                {/* ── Stat Cards ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {stats.map((stat, i) => <StatCard key={i} {...stat} />)}
                </div>

                {/* ── Class Selector ── */}
                <div className="bg-white rounded-2xl border border-slate-100 px-4 py-3">
                    <ClassSelector
                        selectedClass={selectedClass}
                        setSelectedClass={setSelectedClass}
                        selectedSection={selectedSection}
                        setSelectedSection={setSelectedSection}
                    />
                </div>

                {/* ── Toolbar + Content ── */}
                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">

                    {/* Search / view toggle row */}
                    <div className="p-3 border-b border-slate-100 flex flex-wrap gap-2 items-center">
                        <div className="relative flex-1 min-w-[180px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search class or section…"
                                className="w-full pl-9 pr-3 h-9 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition"
                            />
                        </div>

                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={e => setSelectedDate(e.target.value)}
                                className="h-9 px-3 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                            />
                        </div>

                        <div className="flex bg-slate-100 p-0.5 rounded-xl gap-0.5 ml-auto">
                            {['grid', 'list'].map(v => (
                                <button
                                    key={v}
                                    onClick={() => setViewMode(v)}
                                    className={cn(
                                        'px-3 py-1.5 rounded-[10px] text-xs font-medium transition-all capitalize',
                                        viewMode === v
                                            ? 'bg-white text-slate-800 shadow-sm'
                                            : 'text-slate-500 hover:text-slate-700'
                                    )}
                                >
                                    {v}
                                </button>
                            ))}
                        </div>

                        {hasFilters && (
                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-1.5 px-3 h-9 rounded-xl border border-slate-200 text-xs text-slate-500 hover:bg-slate-50 transition-colors"
                            >
                                <FilterX size={12} />
                                Clear
                            </button>
                        )}
                    </div>

                    {/* Meta bar */}
                    <div className="px-4 py-2 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
                        <p className="text-xs text-slate-400">Showing {filteredData.length} classes</p>
                        <button
                            onClick={() => setAllData(generateAttendanceData())}
                            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 transition-colors"
                        >
                            <RefreshCw size={11} />
                            Refresh
                        </button>
                    </div>

                    {/* Content */}
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                        </div>
                    ) : viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 p-4">
                            {filteredData.map((d) => (
                                <ClassCard
                                    key={`${d.cls}-${d.sec}`}
                                    data={d}
                                    onViewDetails={handleViewDetails}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        {['Class', 'Section', 'Students', 'Present', 'Absent', 'Attendance', ''].map((h, i) => (
                                            <th key={i} className="text-left py-3 px-4 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredData.map((d) => {
                                        const colors = pctColor(d.pct);
                                        return (
                                            <tr key={`${d.cls}-${d.sec}`} className="hover:bg-slate-50/70 transition-colors">
                                                <td className="py-3 px-4 font-medium text-slate-800">Class {d.cls}</td>
                                                <td className="py-3 px-4 text-slate-500">{d.sec}</td>
                                                <td className="py-3 px-4 text-slate-500">{d.total}</td>
                                                <td className="py-3 px-4 font-medium text-green-600">{d.present}</td>
                                                <td className="py-3 px-4 font-medium text-red-600">{d.absent}</td>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-16 h-1 bg-slate-200 rounded-full overflow-hidden">
                                                            <div className={cn('h-full rounded-full', colors.bar)} style={{ width: `${d.pct}%` }} />
                                                        </div>
                                                        <span className="text-xs text-slate-600">{d.pct}%</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <button
                                                        onClick={() => handleViewDetails(d)}
                                                        className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                                                    >
                                                        View <ChevronRight size={12} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* ── Monthly Chart ── */}
                <MonthlyChart data={monthlyStats} />
            </div>

            {/* ── Attendance Modal ── */}
            {modalData && (
                <AttendanceModal
                    classData={modalData}
                    onClose={() => setModalData(null)}
                    onSave={handleSaveAttendance}
                />
            )}
        </div>
    );
}