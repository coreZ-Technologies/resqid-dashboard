// app/(school)/school/attendance/page.jsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    Calendar, Users, Search, Filter, Download, ChevronLeft, ChevronRight,
    CheckCircle, XCircle, Clock, Eye, TrendingUp, TrendingDown,
    PieChart, BarChart3, Activity, UserCheck, UserX,
    Calendar as CalendarIcon, FilterX, RefreshCw, Loader2,
    ChevronDown, Printer, Mail, MessageCircle, AlertCircle,
    GraduationCap, BookOpen, School, Plus, Minus, Settings
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
    PRESENT: { label: 'Present', color: 'green', icon: CheckCircle, value: 'present' },
    ABSENT: { label: 'Absent', color: 'red', icon: XCircle, value: 'absent' },
    LATE: { label: 'Late', color: 'amber', icon: Clock, value: 'late' },
    HOLIDAY: { label: 'Holiday', color: 'blue', icon: Calendar, value: 'holiday' },
    LEAVE: { label: 'Leave', color: 'purple', icon: UserX, value: 'leave' }
};

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA (Replace with actual API calls)
// ─────────────────────────────────────────────────────────────────────────────

const generateMockStudents = (className, section) => {
    const students = [];
    const firstNames = ['Aarav', 'Vihaan', 'Vivaan', 'Ananya', 'Diya', 'Advik', 'Kabir', 'Aadhya', 'Sai', 'Ishita', 'Reyansh', 'Anaya', 'Shaurya', 'Myra', 'Dhruv', 'Kiara', 'Arjun', 'Sara', 'Rudra', 'Jiya'];
    const lastNames = ['Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Joshi', 'Nair', 'Reddy', 'Patel', 'Malhotra'];

    for (let i = 1; i <= 35; i++) {
        const statuses = ['present', 'absent', 'late', 'leave'];
        const weights = [0.85, 0.05, 0.05, 0.05];
        let random = Math.random();
        let cumulative = 0;
        let status = 'present';
        for (let j = 0; j < weights.length; j++) {
            cumulative += weights[j];
            if (random < cumulative) {
                status = statuses[j];
                break;
            }
        }

        students.push({
            id: `STU${String(i).padStart(4, '0')}`,
            name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
            rollNumber: i,
            className: className,
            section: section,
            status: status,
            attendancePercentage: Math.floor(Math.random() * 30) + 70,
            lastAttendance: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
            parentPhone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
            parentEmail: `parent${i}@example.com`
        });
    }
    return students;
};

const generateMockAttendanceData = () => {
    const data = [];
    for (const className of CLASSES) {
        for (const section of SECTIONS) {
            data.push({
                class: className,
                section: section,
                students: generateMockStudents(className, section),
                totalStudents: 35,
                present: Math.floor(Math.random() * 30) + 25,
                absent: Math.floor(Math.random() * 5) + 1,
                late: Math.floor(Math.random() * 3),
                leave: Math.floor(Math.random() * 2),
                percentage: Math.floor(Math.random() * 20) + 75
            });
        }
    }
    return data;
};

const generateMonthlyStats = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map(month => ({
        month,
        percentage: Math.floor(Math.random() * 15) + 80,
        total: Math.floor(Math.random() * 500) + 800
    }));
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function StatCard({ title, value, icon: Icon, color, trend, subtitle }) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", color)}>
                    <Icon className="w-5 h-5 text-white" />
                </div>
                {trend && (
                    <div className={cn(
                        "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                        trend > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    )}>
                        {trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
            <p className="text-sm text-slate-500 mt-1">{title}</p>
            {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
    );
}

function ClassCard({ data, onViewDetails }) {
    const statusColor = data.percentage >= 85 ? 'green' : data.percentage >= 70 ? 'amber' : 'red';

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-all cursor-pointer" onClick={() => onViewDetails(data)}>
            <div className="flex items-center justify-between mb-3">
                <div>
                    <h3 className="font-semibold text-slate-800">Class {data.class}-{data.section}</h3>
                    <p className="text-xs text-slate-400">{data.totalStudents} Students</p>
                </div>
                <div className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    statusColor === 'green' && "bg-green-100 text-green-700",
                    statusColor === 'amber' && "bg-amber-100 text-amber-700",
                    statusColor === 'red' && "bg-red-100 text-red-700"
                )}>
                    {data.percentage}%
                </div>
            </div>

            <div className="mb-3">
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className={cn(
                            "h-full rounded-full transition-all",
                            statusColor === 'green' && "bg-green-500",
                            statusColor === 'amber' && "bg-amber-500",
                            statusColor === 'red' && "bg-red-500"
                        )}
                        style={{ width: `${data.percentage}%` }}
                    />
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                    <p className="text-green-600 font-semibold">{data.present}</p>
                    <p className="text-slate-400">Present</p>
                </div>
                <div>
                    <p className="text-red-600 font-semibold">{data.absent}</p>
                    <p className="text-slate-400">Absent</p>
                </div>
                <div>
                    <p className="text-amber-600 font-semibold">{data.late + data.leave}</p>
                    <p className="text-slate-400">Late/Leave</p>
                </div>
            </div>
        </div>
    );
}

function StudentAttendanceTable({ students, classInfo, onUpdateStatus, onSave }) {
    const [localStudents, setLocalStudents] = useState(students);
    const [hasChanges, setHasChanges] = useState(false);

    const updateStudentStatus = (studentId, newStatus) => {
        setLocalStudents(prev => prev.map(s =>
            s.id === studentId ? { ...s, status: newStatus } : s
        ));
        setHasChanges(true);
    };

    const handleSave = () => {
        onSave(localStudents);
        setHasChanges(false);
    };

    const getStatusColor = (status) => {
        const colors = {
            present: 'bg-green-100 text-green-700 border-green-200',
            absent: 'bg-red-100 text-red-700 border-red-200',
            late: 'bg-amber-100 text-amber-700 border-amber-200',
            leave: 'bg-purple-100 text-purple-700 border-purple-200'
        };
        return colors[status] || colors.present;
    };

    const presentCount = localStudents.filter(s => s.status === 'present').length;
    const attendancePercentage = ((presentCount / localStudents.length) * 100).toFixed(1);

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-slate-800">
                        Class {classInfo.class}-{classInfo.section} Attendance
                    </h3>
                    <p className="text-sm text-slate-500">
                        Today's Attendance: {presentCount}/{localStudents.length} ({attendancePercentage}%)
                    </p>
                </div>
                {hasChanges && (
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                        <CheckCircle size={16} />
                        Save Changes
                    </button>
                )}
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Roll No</th>
                            <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Student Name</th>
                            <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Parent Contact</th>
                            <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Attendance Status</th>
                            <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {localStudents.map((student) => (
                            <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                                <td className="py-3 px-4 text-sm text-slate-600">{student.rollNumber}</td>
                                <td className="py-3 px-4">
                                    <div>
                                        <p className="font-medium text-slate-800">{student.name}</p>
                                        <p className="text-xs text-slate-400">ID: {student.id}</p>
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <p className="text-sm text-slate-600">{student.parentPhone}</p>
                                    <p className="text-xs text-slate-400">{student.parentEmail}</p>
                                </td>
                                <td className="py-3 px-4">
                                    <span className={cn(
                                        "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border",
                                        getStatusColor(student.status)
                                    )}>
                                        {ATTENDANCE_STATUS[student.status.toUpperCase()]?.label || student.status}
                                    </span>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex gap-2">
                                        {Object.entries(ATTENDANCE_STATUS).map(([key, config]) => {
                                            if (key === 'HOLIDAY') return null;
                                            const Icon = config.icon;
                                            return (
                                                <button
                                                    key={key}
                                                    onClick={() => updateStudentStatus(student.id, config.value)}
                                                    className={cn(
                                                        "p-1.5 rounded-lg transition-colors",
                                                        student.status === config.value
                                                            ? `bg-${config.color}-100 text-${config.color}-600`
                                                            : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                                                    )}
                                                    title={config.label}
                                                >
                                                    <Icon size={14} />
                                                </button>
                                            );
                                        })}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function AttendanceChart({ data }) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-800">Monthly Attendance Trend</h3>
                <select className="text-sm border border-slate-200 rounded-lg px-2 py-1">
                    <option>2024-2025</option>
                    <option>2023-2024</option>
                </select>
            </div>
            <div className="h-64 relative">
                <div className="flex h-full items-end gap-2">
                    {data.map((month, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                            <div
                                className="w-full bg-blue-500 rounded-t-lg transition-all hover:bg-blue-600 cursor-pointer"
                                style={{ height: `${month.percentage}%` }}
                            />
                            <span className="text-xs text-slate-500 rotate-45 origin-left">{month.month}</span>
                            <span className="text-xs font-semibold text-slate-700">{month.percentage}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ClassFilter({ selectedClass, setSelectedClass, selectedSection, setSelectedSection }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
                <Filter size={14} />
                {selectedClass ? `Class ${selectedClass}${selectedSection ? `-${selectedSection}` : ''}` : 'All Classes'}
                <ChevronDown size={14} className={cn("transition-transform", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-slate-200 rounded-lg shadow-lg z-20 p-2">
                        <button
                            onClick={() => {
                                setSelectedClass('');
                                setSelectedSection('');
                                setIsOpen(false);
                            }}
                            className={cn(
                                "w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-slate-50",
                                !selectedClass && "bg-blue-50 text-blue-600"
                            )}
                        >
                            All Classes
                        </button>
                        <div className="border-t border-slate-100 my-1" />
                        {CLASSES.map(className => (
                            <div key={className}>
                                <button
                                    onClick={() => {
                                        setSelectedClass(className);
                                        setSelectedSection('');
                                    }}
                                    className={cn(
                                        "w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-slate-50",
                                        selectedClass === className && !selectedSection && "bg-blue-50 text-blue-600"
                                    )}
                                >
                                    Class {className}
                                </button>
                                {selectedClass === className && (
                                    <div className="pl-4 space-y-1">
                                        {SECTIONS.map(section => (
                                            <button
                                                key={section}
                                                onClick={() => {
                                                    setSelectedSection(section);
                                                    setIsOpen(false);
                                                }}
                                                className={cn(
                                                    "w-full text-left px-3 py-1 rounded-lg text-sm hover:bg-slate-50",
                                                    selectedSection === section && "bg-blue-50 text-blue-600"
                                                )}
                                            >
                                                Section {section}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

function DateRangePicker({ startDate, endDate, onStartChange, onEndChange }) {
    return (
        <div className="flex items-center gap-2">
            <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => onStartChange(e.target.value)}
                    className="pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm"
                />
            </div>
            <span className="text-slate-400">to</span>
            <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => onEndChange(e.target.value)}
                    className="pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm"
                />
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function AttendancePage() {
    const [attendanceData, setAttendanceData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [viewMode, setViewMode] = useState('grid'); // grid, list, detailed
    const [selectedClassData, setSelectedClassData] = useState(null);
    const [showDetailedView, setShowDetailedView] = useState(false);
    const [monthlyStats, setMonthlyStats] = useState([]);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch attendance data
    useEffect(() => {
        const fetchAttendance = async () => {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            const data = generateMockAttendanceData();
            setAttendanceData(data);
            setFilteredData(data);
            setMonthlyStats(generateMonthlyStats());
            setLoading(false);
        };
        fetchAttendance();
    }, []);

    // Apply filters
    useEffect(() => {
        let filtered = [...attendanceData];

        if (selectedClass) {
            filtered = filtered.filter(c => c.class === selectedClass);
        }

        if (selectedSection) {
            filtered = filtered.filter(c => c.section === selectedSection);
        }

        if (searchQuery) {
            filtered = filtered.filter(c =>
                c.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.section.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredData(filtered);
    }, [selectedClass, selectedSection, searchQuery, attendanceData]);

    // Calculate statistics
    const totalStudents = attendanceData.reduce((sum, c) => sum + c.totalStudents, 0);
    const totalPresent = attendanceData.reduce((sum, c) => sum + c.present, 0);
    const totalAbsent = attendanceData.reduce((sum, c) => sum + c.absent, 0);
    const totalLate = attendanceData.reduce((sum, c) => sum + c.late, 0);
    const overallPercentage = ((totalPresent / totalStudents) * 100).toFixed(1);

    const stats = [
        { title: 'Total Students', value: totalStudents, icon: Users, color: 'bg-blue-600', trend: 5, subtitle: 'Across all classes' },
        { title: 'Present Today', value: totalPresent, icon: CheckCircle, color: 'bg-green-600', trend: 3, subtitle: `${overallPercentage}% attendance` },
        { title: 'Absent Today', value: totalAbsent, icon: XCircle, color: 'bg-red-600', trend: -2, subtitle: `${totalLate} late arrivals` },
        { title: 'Classes Today', value: filteredData.length, icon: School, color: 'bg-purple-600', trend: 0, subtitle: 'Active classes' }
    ];

    const handleViewDetails = (classData) => {
        setSelectedClassData(classData);
        setShowDetailedView(true);
    };

    const handleUpdateAttendance = (updatedStudents) => {
        // Update local state
        if (selectedClassData) {
            const updatedClassData = {
                ...selectedClassData,
                students: updatedStudents,
                present: updatedStudents.filter(s => s.status === 'present').length,
                absent: updatedStudents.filter(s => s.status === 'absent').length,
                late: updatedStudents.filter(s => s.status === 'late').length,
                leave: updatedStudents.filter(s => s.status === 'leave').length,
                percentage: ((updatedStudents.filter(s => s.status === 'present').length / updatedStudents.length) * 100).toFixed(1)
            };

            setAttendanceData(prev => prev.map(c =>
                c.class === updatedClassData.class && c.section === updatedClassData.section ? updatedClassData : c
            ));
            setSelectedClassData(updatedClassData);
        }

        // TODO: API call to save attendance
        console.log('Attendance updated:', updatedStudents);
    };

    const handleExport = () => {
        // TODO: Export attendance data to CSV/Excel
        console.log('Exporting attendance data...');
    };

    const handleSendReminders = () => {
        // TODO: Send reminders to parents of absent students
        console.log('Sending reminders...');
    };

    const handleClearFilters = () => {
        setSelectedClass('');
        setSelectedSection('');
        setSearchQuery('');
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 mb-1">Attendance Management</h1>
                        <p className="text-slate-500">Track and manage student attendance across all classes</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                            <Download size={16} />
                            Export Report
                        </button>
                        <button
                            onClick={handleSendReminders}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                        >
                            <MessageCircle size={16} />
                            Send Reminders
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {stats.map((stat, idx) => (
                        <StatCard key={idx} {...stat} />
                    ))}
                </div>

                {/* Filters Bar */}
                <div className="bg-white rounded-xl border border-slate-200 mb-6">
                    <div className="p-4 border-b border-slate-200">
                        <div className="flex flex-col lg:flex-row gap-3">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search by class or section..."
                                        className="w-full pl-9 pr-4 h-10 rounded-lg border border-slate-200 text-sm"
                                    />
                                </div>
                            </div>

                            <ClassFilter
                                selectedClass={selectedClass}
                                setSelectedClass={setSelectedClass}
                                selectedSection={selectedSection}
                                setSelectedSection={setSelectedSection}
                            />

                            <DateRangePicker
                                startDate={startDate}
                                endDate={endDate}
                                onStartChange={setStartDate}
                                onEndChange={setEndDate}
                            />

                            <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={cn(
                                        "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                                        viewMode === 'grid' ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                    )}
                                >
                                    Grid View
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={cn(
                                        "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                                        viewMode === 'list' ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                    )}
                                >
                                    List View
                                </button>
                            </div>

                            {(selectedClass || selectedSection || searchQuery) && (
                                <button
                                    onClick={handleClearFilters}
                                    className="flex items-center gap-2 px-3 h-10 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50"
                                >
                                    <FilterX size={14} />
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 text-sm text-slate-500 flex justify-between items-center">
                        <span>Showing {filteredData.length} classes</span>
                        <button className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700">
                            <RefreshCw size={12} />
                            Refresh Data
                        </button>
                    </div>

                    {/* Content */}
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        </div>
                    ) : viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
                            {filteredData.map((classData, idx) => (
                                <ClassCard key={idx} data={classData} onViewDetails={handleViewDetails} />
                            ))}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Class</th>
                                        <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Section</th>
                                        <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Total Students</th>
                                        <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Present</th>
                                        <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Absent</th>
                                        <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Attendance %</th>
                                        <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredData.map((classData, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                            <td className="py-3 px-4 font-medium text-slate-800">{classData.class}</td>
                                            <td className="py-3 px-4 text-slate-600">{classData.section}</td>
                                            <td className="py-3 px-4 text-slate-600">{classData.totalStudents}</td>
                                            <td className="py-3 px-4 text-green-600 font-medium">{classData.present}</td>
                                            <td className="py-3 px-4 text-red-600 font-medium">{classData.absent}</td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                                        <div
                                                            className={cn(
                                                                "h-full rounded-full",
                                                                classData.percentage >= 85 ? "bg-green-500" : classData.percentage >= 70 ? "bg-amber-500" : "bg-red-500"
                                                            )}
                                                            style={{ width: `${classData.percentage}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-sm text-slate-600">{classData.percentage}%</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <button
                                                    onClick={() => handleViewDetails(classData)}
                                                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Monthly Trend Chart */}
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <AttendanceChart data={monthlyStats} />
                </div>
            </div>

            {/* Detailed View Modal */}
            {showDetailedView && selectedClassData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowDetailedView(false)} />
                    <div className="relative bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold text-slate-800">
                                    Class {selectedClassData.class}-{selectedClassData.section} Attendance
                                </h2>
                                <p className="text-sm text-slate-500 mt-1">
                                    {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                            <button onClick={() => setShowDetailedView(false)} className="p-1 rounded-lg hover:bg-slate-100">
                                <XCircle size={20} />
                            </button>
                        </div>

                        <div className="p-6">
                            <StudentAttendanceTable
                                students={selectedClassData.students}
                                classInfo={selectedClassData}
                                onUpdateStatus={(studentId, status) => {
                                    const updated = selectedClassData.students.map(s =>
                                        s.id === studentId ? { ...s, status } : s
                                    );
                                    handleUpdateAttendance(updated);
                                }}
                                onSave={handleUpdateAttendance}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}