// app/(school)/school/timetable/page.jsx
'use client';

import { useState, useEffect } from 'react';
import {
    Calendar, Clock, Users, BookOpen, CheckCircle, XCircle,
    AlertCircle, RefreshCw, Download, Upload, Save, Eye,
    Edit2, Trash2, Plus, Search, Filter, ChevronLeft,
    ChevronRight, ChevronDown, Settings, Printer, Share2,
    GraduationCap, UserCheck, UserX, AlertTriangle, Check,
    X, Loader2, GripVertical, Swap, Repeat, Calendar as CalendarIcon,
    School, Bell, MessageCircle, Zap, Shield, Target, Activity,
    Move, ArrowLeftRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const PERIODS = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];
const TIME_SLOTS = [
    '08:00 - 08:45', '08:45 - 09:30', '09:30 - 10:15',
    '10:30 - 11:15', '11:15 - 12:00', '12:00 - 12:45',
    '13:30 - 14:15', '14:15 - 15:00'
];

const SUBJECTS = [
    'Mathematics', 'Science', 'Physics', 'Chemistry', 'Biology',
    'English', 'Hindi', 'Sanskrit', 'Social Studies', 'History',
    'Geography', 'Computer Science', 'Physical Education', 'Arts',
    'Music', 'Dance', 'Economics', 'Business Studies'
];

const TEACHERS = [
    'Dr. Sharma', 'Mrs. Gupta', 'Mr. Kumar', 'Ms. Singh', 'Dr. Patel',
    'Mrs. Nair', 'Mr. Reddy', 'Ms. Joshi', 'Dr. Verma', 'Mrs. Malhotra'
];

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA (Replace with actual API calls)
// ─────────────────────────────────────────────────────────────────────────────

const generateMockTimetable = () => {
    const timetable = {};
    const classes = ['10-A', '10-B', '9-A', '9-B', '8-A', '8-B'];

    classes.forEach(className => {
        timetable[className] = {};
        DAYS.forEach(day => {
            timetable[className][day] = {};
            PERIODS.forEach((period, idx) => {
                const subject = SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)];
                const teacher = TEACHERS[Math.floor(Math.random() * TEACHERS.length)];
                timetable[className][day][period] = {
                    subject,
                    teacher,
                    room: `Room ${Math.floor(Math.random() * 20) + 1}`,
                    type: Math.random() > 0.7 ? 'Lab' : 'Theory',
                    periodNumber: idx + 1,
                    timeSlot: TIME_SLOTS[idx]
                };
            });
        });
    });
    return timetable;
};

const generateTeacherAvailability = () => {
    const availability = {};
    TEACHERS.forEach(teacher => {
        availability[teacher] = {};
        DAYS.forEach(day => {
            availability[teacher][day] = {
                available: Math.random() > 0.2,
                maxClasses: Math.floor(Math.random() * 3) + 3,
                preferredPeriods: [1, 2, 3, 4],
                unavailablePeriods: Math.random() > 0.7 ? [5, 6] : []
            };
        });
    });
    return availability;
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function TimetableGrid({ timetable, className, onCellClick, viewType }) {
    const getStatusColor = (cell) => {
        if (!cell) return 'bg-slate-50';
        if (cell.type === 'Lab') return 'bg-purple-50 border-purple-200';
        return 'bg-white border-slate-200';
    };

    if (viewType === 'class') {
        return (
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="p-3 bg-slate-100 border border-slate-200 text-left text-sm font-semibold text-slate-700">Day/Period</th>
                            {PERIODS.map((period, idx) => (
                                <th key={period} className="p-3 bg-slate-100 border border-slate-200 text-center text-sm font-semibold text-slate-700">
                                    {period}
                                    <span className="block text-xs font-normal text-slate-400">{TIME_SLOTS[idx]}</span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {DAYS.map(day => (
                            <tr key={day}>
                                <td className="p-3 bg-slate-50 border border-slate-200 font-medium text-slate-700">{day}</td>
                                {PERIODS.map(period => {
                                    const cell = timetable[className]?.[day]?.[period];
                                    return (
                                        <td
                                            key={period}
                                            onClick={() => onCellClick(className, day, period, cell)}
                                            className={cn(
                                                "p-2 border border-slate-200 cursor-pointer hover:bg-blue-50 transition-colors",
                                                getStatusColor(cell)
                                            )}
                                        >
                                            {cell ? (
                                                <div className="text-center">
                                                    <p className="font-medium text-slate-800 text-sm">{cell.subject}</p>
                                                    <p className="text-xs text-slate-500">{cell.teacher}</p>
                                                    <p className="text-xs text-slate-400">{cell.room}</p>
                                                    {cell.type === 'Lab' && (
                                                        <span className="inline-block mt-1 px-1.5 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">Lab</span>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="text-center text-slate-300 text-sm">—</div>
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

    if (viewType === 'teacher') {
        return (
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="p-3 bg-slate-100 border border-slate-200 text-left text-sm font-semibold text-slate-700">Teacher</th>
                            {DAYS.map(day => (
                                <th key={day} className="p-3 bg-slate-100 border border-slate-200 text-center text-sm font-semibold text-slate-700">{day}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {TEACHERS.map(teacher => {
                            const teacherSchedule = [];
                            DAYS.forEach(day => {
                                let classes = [];
                                for (const [cls, clsData] of Object.entries(timetable)) {
                                    for (const [period, cell] of Object.entries(clsData[day] || {})) {
                                        if (cell?.teacher === teacher) {
                                            classes.push(`${cls} - ${period} (${cell.subject})`);
                                        }
                                    }
                                }
                                teacherSchedule.push(classes);
                            });

                            return (
                                <tr key={teacher}>
                                    <td className="p-3 bg-slate-50 border border-slate-200 font-medium text-slate-700">{teacher}</td>
                                    {teacherSchedule.map((schedule, idx) => (
                                        <td key={idx} className="p-2 border border-slate-200 align-top">
                                            {schedule.length > 0 ? (
                                                <div className="space-y-1">
                                                    {schedule.map((cls, cIdx) => (
                                                        <div key={cIdx} className="text-xs p-1 bg-blue-50 rounded">
                                                            {cls}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center text-slate-300 text-xs">—</div>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    }

    return null;
}

function ValidationPanel({ validationResults, onFix }) {
    const getStatusIcon = (status) => {
        if (status === 'valid') return <CheckCircle className="w-4 h-4 text-green-600" />;
        if (status === 'warning') return <AlertCircle className="w-4 h-4 text-amber-600" />;
        return <XCircle className="w-4 h-4 text-red-600" />;
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Shield size={18} className="text-blue-600" />
                Timetable Validation
            </h3>

            <div className="space-y-3">
                {validationResults.map((result, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                        {getStatusIcon(result.status)}
                        <div className="flex-1">
                            <p className="text-sm font-medium text-slate-700">{result.message}</p>
                            {result.details && (
                                <p className="text-xs text-slate-400 mt-1">{result.details}</p>
                            )}
                        </div>
                        {result.canFix && (
                            <button
                                onClick={() => onFix(result.id)}
                                className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            >
                                Fix
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {validationResults.length === 0 && (
                <div className="text-center py-6">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-slate-600">All constraints satisfied!</p>
                    <p className="text-xs text-slate-400 mt-1">Timetable is ready for publishing</p>
                </div>
            )}
        </div>
    );
}

function TeacherSwapModal({ isOpen, onClose, onSwap, timetable, className, day, period, currentCell }) {
    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [swapWithClass, setSwapWithClass] = useState('');
    const [swapWithPeriod, setSwapWithPeriod] = useState('');
    const [swapWithDay, setSwapWithDay] = useState('');
    const [availableTeachers, setAvailableTeachers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && currentCell) {
            const available = TEACHERS.filter(t => t !== currentCell.teacher);
            setAvailableTeachers(available);
        }
    }, [isOpen, currentCell]);

    const handleSwap = async () => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));

        onSwap({
            className,
            day,
            period,
            currentTeacher: currentCell.teacher,
            newTeacher: selectedTeacher,
            swapWithClass,
            swapWithDay,
            swapWithPeriod
        });

        setLoading(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Swap className="w-5 h-5 text-blue-600" />
                            <h2 className="text-xl font-semibold text-slate-800">Swap Teacher</h2>
                        </div>
                        <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="p-3 bg-slate-50 rounded-lg">
                            <p className="text-sm text-slate-500">Current Assignment</p>
                            <p className="font-medium text-slate-800">{currentCell?.subject}</p>
                            <p className="text-sm text-slate-600">Teacher: {currentCell?.teacher}</p>
                            <p className="text-xs text-slate-400">Class {className} | {day} | {period} Period</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Swap With Teacher</label>
                            <select
                                value={selectedTeacher}
                                onChange={(e) => setSelectedTeacher(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-slate-200"
                            >
                                <option value="">Select Teacher</option>
                                {availableTeachers.map(teacher => (
                                    <option key={teacher} value={teacher}>{teacher}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-px bg-slate-200" />
                            <span className="text-xs text-slate-400">OR</span>
                            <div className="flex-1 h-px bg-slate-200" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Swap with another class period</label>
                            <select
                                value={swapWithClass}
                                onChange={(e) => setSwapWithClass(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 mb-2"
                            >
                                <option value="">Select Class</option>
                                {Object.keys(timetable).map(cls => (
                                    <option key={cls} value={cls}>{cls}</option>
                                ))}
                            </select>

                            <div className="grid grid-cols-2 gap-2">
                                <select
                                    value={swapWithDay}
                                    onChange={(e) => setSwapWithDay(e.target.value)}
                                    className="px-3 py-2 rounded-lg border border-slate-200"
                                    disabled={!swapWithClass}
                                >
                                    <option value="">Select Day</option>
                                    {DAYS.map(d => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>

                                <select
                                    value={swapWithPeriod}
                                    onChange={(e) => setSwapWithPeriod(e.target.value)}
                                    className="px-3 py-2 rounded-lg border border-slate-200"
                                    disabled={!swapWithDay}
                                >
                                    <option value="">Select Period</option>
                                    {PERIODS.map(p => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSwap}
                                disabled={!selectedTeacher && (!swapWithClass || !swapWithDay || !swapWithPeriod)}
                                className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowLeftRight size={16} />}
                                {loading ? 'Swapping...' : 'Swap'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function BulkRescheduleModal({ isOpen, onClose, onReschedule }) {
    const [rescheduleType, setRescheduleType] = useState('auto');
    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [loading, setLoading] = useState(false);

    const handleReschedule = async () => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        onReschedule({ type: rescheduleType, teacher: selectedTeacher, dateRange });
        setLoading(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Repeat className="w-5 h-5 text-blue-600" />
                            <h2 className="text-xl font-semibold text-slate-800">Bulk Reschedule</h2>
                        </div>
                        <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Reschedule Type</label>
                            <div className="space-y-2">
                                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-slate-50">
                                    <input
                                        type="radio"
                                        value="auto"
                                        checked={rescheduleType === 'auto'}
                                        onChange={(e) => setRescheduleType(e.target.value)}
                                        className="w-4 h-4 text-blue-600"
                                    />
                                    <div>
                                        <p className="font-medium text-slate-700">Auto-Optimize</p>
                                        <p className="text-xs text-slate-400">AI-powered timetable optimization</p>
                                    </div>
                                </label>
                                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-slate-50">
                                    <input
                                        type="radio"
                                        value="teacher"
                                        checked={rescheduleType === 'teacher'}
                                        onChange={(e) => setRescheduleType(e.target.value)}
                                        className="w-4 h-4 text-blue-600"
                                    />
                                    <div>
                                        <p className="font-medium text-slate-700">Teacher Leave Coverage</p>
                                        <p className="text-xs text-slate-400">Reschedule classes for absent teacher</p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {rescheduleType === 'teacher' && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Select Teacher</label>
                                <select
                                    value={selectedTeacher}
                                    onChange={(e) => setSelectedTeacher(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200"
                                >
                                    <option value="">Select Teacher</option>
                                    {TEACHERS.map(teacher => (
                                        <option key={teacher} value={teacher}>{teacher}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReschedule}
                                disabled={loading || (rescheduleType === 'teacher' && !selectedTeacher)}
                                className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
                                {loading ? 'Rescheduling...' : 'Start Reschedule'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TeacherAvailabilityModal({ isOpen, onClose, onUpdate, teacherAvailability }) {
    const [availability, setAvailability] = useState(teacherAvailability);
    const [selectedTeacher, setSelectedTeacher] = useState(TEACHERS[0]);

    const handleUpdate = () => {
        onUpdate(availability);
        onClose();
    };

    if (!isOpen) return null;

    const currentTeacherData = availability[selectedTeacher] || {};

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <UserCheck className="w-5 h-5 text-blue-600" />
                        <h2 className="text-xl font-semibold text-slate-800">Teacher Availability</h2>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Select Teacher</label>
                        <select
                            value={selectedTeacher}
                            onChange={(e) => setSelectedTeacher(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200"
                        >
                            {TEACHERS.map(teacher => (
                                <option key={teacher} value={teacher}>{teacher}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-4">
                        {DAYS.map(day => (
                            <div key={day} className="border rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-semibold text-slate-700">{day}</h3>
                                    <label className="flex items-center gap-2">
                                        <span className="text-sm text-slate-500">Available</span>
                                        <input
                                            type="checkbox"
                                            checked={currentTeacherData[day]?.available !== false}
                                            onChange={(e) => {
                                                setAvailability(prev => ({
                                                    ...prev,
                                                    [selectedTeacher]: {
                                                        ...prev[selectedTeacher],
                                                        [day]: {
                                                            ...prev[selectedTeacher]?.[day],
                                                            available: e.target.checked
                                                        }
                                                    }
                                                }));
                                            }}
                                            className="w-4 h-4 text-blue-600 rounded"
                                        />
                                    </label>
                                </div>

                                <div>
                                    <label className="block text-sm text-slate-500 mb-2">Max Classes Per Day</label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="8"
                                        value={currentTeacherData[day]?.maxClasses || 4}
                                        onChange={(e) => {
                                            setAvailability(prev => ({
                                                ...prev,
                                                [selectedTeacher]: {
                                                    ...prev[selectedTeacher],
                                                    [day]: {
                                                        ...prev[selectedTeacher]?.[day],
                                                        maxClasses: parseInt(e.target.value)
                                                    }
                                                }
                                            }));
                                        }}
                                        className="w-full"
                                    />
                                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                                        <span>1</span><span>2</span><span>3</span><span>4</span>
                                        <span>5</span><span>6</span><span>7</span><span>8</span>
                                    </div>
                                </div>

                                <div className="mt-3">
                                    <label className="block text-sm text-slate-500 mb-2">Unavailable Periods</label>
                                    <div className="flex flex-wrap gap-2">
                                        {PERIODS.map((period, idx) => (
                                            <button
                                                key={period}
                                                onClick={() => {
                                                    const current = currentTeacherData[day]?.unavailablePeriods || [];
                                                    const updated = current.includes(idx + 1)
                                                        ? current.filter(p => p !== idx + 1)
                                                        : [...current, idx + 1];
                                                    setAvailability(prev => ({
                                                        ...prev,
                                                        [selectedTeacher]: {
                                                            ...prev[selectedTeacher],
                                                            [day]: {
                                                                ...prev[selectedTeacher]?.[day],
                                                                unavailablePeriods: updated
                                                            }
                                                        }
                                                    }));
                                                }}
                                                className={cn(
                                                    "px-2 py-1 rounded text-xs font-medium transition-colors",
                                                    currentTeacherData[day]?.unavailablePeriods?.includes(idx + 1)
                                                        ? "bg-red-100 text-red-700 border border-red-200"
                                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                                )}
                                            >
                                                {period}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-3 pt-6">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUpdate}
                            className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function TimetablePage() {
    const [timetable, setTimetable] = useState({});
    const [teacherAvailability, setTeacherAvailability] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedClass, setSelectedClass] = useState('10-A');
    const [viewType, setViewType] = useState('class');
    const [selectedCell, setSelectedCell] = useState(null);
    const [showSwapModal, setShowSwapModal] = useState(false);
    const [showRescheduleModal, setShowRescheduleModal] = useState(false);
    const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
    const [validationResults, setValidationResults] = useState([]);
    const [generating, setGenerating] = useState(false);

    const classes = Object.keys(timetable);

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            const mockTimetable = generateMockTimetable();
            const mockAvailability = generateTeacherAvailability();
            setTimetable(mockTimetable);
            setTeacherAvailability(mockAvailability);
            setValidationResults(validateTimetable(mockTimetable, mockAvailability));
            setLoading(false);
        };
        fetchData();
    }, []);

    // Validation function
    const validateTimetable = (tt, availability) => {
        const issues = [];

        // Check for teacher overload
        const teacherLoad = {};
        for (const [cls, clsData] of Object.entries(tt)) {
            for (const [day, dayData] of Object.entries(clsData)) {
                for (const [period, cell] of Object.entries(dayData)) {
                    if (cell?.teacher) {
                        if (!teacherLoad[cell.teacher]) teacherLoad[cell.teacher] = {};
                        if (!teacherLoad[cell.teacher][day]) teacherLoad[cell.teacher][day] = 0;
                        teacherLoad[cell.teacher][day]++;

                        if (teacherLoad[cell.teacher][day] > (availability[cell.teacher]?.[day]?.maxClasses || 5)) {
                            issues.push({
                                id: `overload_${cell.teacher}_${day}`,
                                status: 'error',
                                message: `Teacher ${cell.teacher} has ${teacherLoad[cell.teacher][day]} classes on ${day}`,
                                details: `Maximum allowed: ${availability[cell.teacher]?.[day]?.maxClasses || 5}`,
                                canFix: true
                            });
                        }
                    }
                }
            }
        }

        // Check for empty periods
        for (const [cls, clsData] of Object.entries(tt)) {
            for (const [day, dayData] of Object.entries(clsData)) {
                for (const [period, cell] of Object.entries(dayData)) {
                    if (!cell || !cell.subject) {
                        issues.push({
                            id: `empty_${cls}_${day}_${period}`,
                            status: 'warning',
                            message: `Empty period in ${cls} on ${day} ${period} period`,
                            details: 'No class scheduled',
                            canFix: true
                        });
                    }
                }
            }
        }

        return issues;
    };

    // Generate new timetable
    const handleGenerateTimetable = async () => {
        setGenerating(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        const newTimetable = generateMockTimetable();
        setTimetable(newTimetable);
        setValidationResults(validateTimetable(newTimetable, teacherAvailability));
        setGenerating(false);
    };

    // Swap teachers
    const handleSwapTeachers = (swapData) => {
        const newTimetable = JSON.parse(JSON.stringify(timetable));

        if (swapData.swapWithClass && swapData.swapWithPeriod && swapData.swapWithDay) {
            // Swap with another class period
            const targetCell = newTimetable[swapData.swapWithClass]?.[swapData.swapWithDay]?.[swapData.swapWithPeriod];
            const currentCell = newTimetable[swapData.className]?.[swapData.day]?.[swapData.period];

            if (targetCell && currentCell) {
                const tempTeacher = currentCell.teacher;
                currentCell.teacher = targetCell.teacher;
                targetCell.teacher = tempTeacher;
            }
        } else if (swapData.newTeacher) {
            // Direct teacher swap
            const cell = newTimetable[swapData.className]?.[swapData.day]?.[swapData.period];
            if (cell) {
                cell.teacher = swapData.newTeacher;
            }
        }

        setTimetable(newTimetable);
        setValidationResults(validateTimetable(newTimetable, teacherAvailability));
    };

    // Bulk reschedule
    const handleBulkReschedule = (rescheduleData) => {
        console.log('Rescheduling:', rescheduleData);
        alert(`Reschedule initiated!\nType: ${rescheduleData.type}\n${rescheduleData.teacher ? `Teacher: ${rescheduleData.teacher}` : ''}`);
    };

    // Update teacher availability
    const handleUpdateAvailability = (newAvailability) => {
        setTeacherAvailability(newAvailability);
        setValidationResults(validateTimetable(timetable, newAvailability));
    };

    // Fix validation issue
    const handleFixIssue = (issueId) => {
        console.log('Fixing issue:', issueId);
        alert(`Auto-fix for ${issueId} will be applied.`);
    };

    // Handle cell click for teacher swap
    const handleCellClick = (className, day, period, cell) => {
        if (cell) {
            setSelectedCell({ className, day, period, cell });
            setShowSwapModal(true);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-slate-500">Loading timetable...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="p-6">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 mb-1">Timetable Management</h1>
                        <p className="text-slate-500">Create, validate, and manage school timetable</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowAvailabilityModal(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                            <UserCheck size={16} />
                            Teacher Availability
                        </button>
                        <button
                            onClick={() => setShowRescheduleModal(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                            <Repeat size={16} />
                            Bulk Reschedule
                        </button>
                        <button
                            onClick={handleGenerateTimetable}
                            disabled={generating}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            {generating ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                            {generating ? 'Generating...' : 'Generate New'}
                        </button>
                    </div>
                </div>

                {/* Controls Bar */}
                <div className="bg-white rounded-xl border border-slate-200 mb-6">
                    <div className="p-4 border-b border-slate-200">
                        <div className="flex flex-col lg:flex-row gap-3">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setViewType('class')}
                                    className={cn(
                                        "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                                        viewType === 'class'
                                            ? "bg-blue-600 text-white"
                                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    )}
                                >
                                    Class View
                                </button>
                                <button
                                    onClick={() => setViewType('teacher')}
                                    className={cn(
                                        "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                                        viewType === 'teacher'
                                            ? "bg-blue-600 text-white"
                                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    )}
                                >
                                    Teacher View
                                </button>
                            </div>

                            {viewType === 'class' && classes.length > 0 && (
                                <select
                                    value={selectedClass}
                                    onChange={(e) => setSelectedClass(e.target.value)}
                                    className="px-3 py-2 rounded-lg border border-slate-200 text-sm"
                                >
                                    {classes.map(cls => (
                                        <option key={cls} value={cls}>{cls}</option>
                                    ))}
                                </select>
                            )}

                            <div className="flex-1" />

                            <div className="flex gap-2">
                                <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50">
                                    <Printer size={16} />
                                    Print
                                </button>
                                <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50">
                                    <Download size={16} />
                                    Export
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Timetable Grid */}
                    <div className="p-4">
                        <TimetableGrid
                            timetable={timetable}
                            className={selectedClass}
                            onCellClick={handleCellClick}
                            viewType={viewType}
                        />
                    </div>
                </div>

                {/* Validation Panel */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <ValidationPanel
                            validationResults={validationResults}
                            onFix={handleFixIssue}
                        />
                    </div>

                    <div className="space-y-4">
                        {/* Quick Stats */}
                        <div className="bg-white rounded-xl border border-slate-200 p-4">
                            <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                                <Activity size={18} className="text-green-600" />
                                Quick Stats
                            </h3>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-500">Total Classes</span>
                                    <span className="font-semibold text-slate-800">{classes.length}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-500">Total Teachers</span>
                                    <span className="font-semibold text-slate-800">{TEACHERS.length}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-500">Periods per Day</span>
                                    <span className="font-semibold text-slate-800">8</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-500">Working Days</span>
                                    <span className="font-semibold text-slate-800">6</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                                    <span className="text-sm text-slate-500">Validation Status</span>
                                    <span className={cn(
                                        "text-xs font-medium px-2 py-1 rounded-full",
                                        validationResults.filter(r => r.status === 'error').length === 0
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                    )}>
                                        {validationResults.filter(r => r.status === 'error').length} Issues Found
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-xl border border-slate-200 p-4">
                            <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                                <Zap size={18} className="text-amber-600" />
                                Quick Actions
                            </h3>
                            <div className="space-y-2">
                                <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors">
                                    <Bell size={16} />
                                    Notify Changes
                                </button>
                                <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors">
                                    <Eye size={16} />
                                    Preview Changes
                                </button>
                                <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors">
                                    <Download size={16} />
                                    Download as PDF
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <TeacherSwapModal
                isOpen={showSwapModal}
                onClose={() => setShowSwapModal(false)}
                onSwap={handleSwapTeachers}
                timetable={timetable}
                className={selectedCell?.className}
                day={selectedCell?.day}
                period={selectedCell?.period}
                currentCell={selectedCell?.cell}
            />

            <BulkRescheduleModal
                isOpen={showRescheduleModal}
                onClose={() => setShowRescheduleModal(false)}
                onReschedule={handleBulkReschedule}
            />

            <TeacherAvailabilityModal
                isOpen={showAvailabilityModal}
                onClose={() => setShowAvailabilityModal(false)}
                onUpdate={handleUpdateAvailability}
                teacherAvailability={teacherAvailability}
            />
        </div>
    );
}