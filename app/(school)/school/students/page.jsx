// app/(school)/school/students/page.jsx
'use client';

import { useState, useEffect } from 'react';
import {
    Users, Search, Plus, Upload, ChevronLeft, ChevronRight,
    Eye, Edit2, Trash2, GraduationCap, Mail, Phone,
    Loader2, School, BookOpen, ChevronDown, RefreshCw, FilterX, Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS & MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────

const CLASSES = [
    'Nursery', 'LKG', 'UKG',
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'
];

const SECTIONS = ['A', 'B', 'C', 'D'];

// Generate 200+ mock students for demonstration
const generateMockStudents = () => {
    const students = [];
    const names = [
        'Aarav Sharma', 'Vihaan Gupta', 'Vivaan Kumar', 'Ananya Singh', 'Diya Reddy',
        'Advik Patel', 'Kabir Mehta', 'Aadhya Nair', 'Sai Verma', 'Ishita Malhotra',
        'Reyansh Joshi', 'Anaya Khanna', 'Shaurya Saxena', 'Myra Kapoor', 'Dhruv Sinha',
        'Kiara Dutta', 'Arjun Thakur', 'Sara Khan', 'Rudra Rajput', 'Jiya Bhatia'
    ];

    for (let i = 1; i <= 250; i++) {
        const classIndex = Math.floor(Math.random() * CLASSES.length);
        const sectionIndex = Math.floor(Math.random() * SECTIONS.length);
        students.push({
            id: `STU${String(i).padStart(5, '0')}`,
            name: names[Math.floor(Math.random() * names.length)],
            rollNumber: `${Math.floor(Math.random() * 50) + 1}`,
            class: CLASSES[classIndex],
            section: SECTIONS[sectionIndex],
            parentName: `Parent of Student ${i}`,
            parentPhone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
            email: `student${i}@school.com`,
            address: `${Math.floor(Math.random() * 100)} Educational Street, City ${Math.floor(Math.random() * 10) + 1}`,
            dateOfBirth: `201${Math.floor(Math.random() * 6)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
            bloodGroup: ['A+', 'B+', 'O+', 'AB+'][Math.floor(Math.random() * 4)],
            emergencyContact: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
            enrollmentDate: `202${Math.floor(Math.random() * 3)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-01`,
            status: Math.random() > 0.05 ? 'Active' : 'Inactive',
            photo: null,
            gender: ['Male', 'Female'][Math.floor(Math.random() * 2)],
        });
    }
    return students;
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function SearchBar({ value, onChange, placeholder }) {
    return (
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder || "Search by name, ID, roll number, or parent name..."}
                className="w-full pl-9 pr-4 h-10 rounded-md border border-gray-200 bg-white text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100 transition-all"
            />
        </div>
    );
}

function FilterDropdown({ label, options, value, onChange, icon: Icon }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center gap-2 px-3 h-10 rounded-md border text-sm font-medium transition-all whitespace-nowrap",
                    value
                        ? "bg-violet-50 border-violet-200 text-violet-700"
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                )}
            >
                {Icon && <Icon size={14} />}
                {value ? `${label}: ${value}` : label}
                <ChevronDown size={14} className={cn("transition-transform", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20 py-1 max-h-64 overflow-y-auto">
                        <button
                            onClick={() => {
                                onChange('');
                                setIsOpen(false);
                            }}
                            className={cn(
                                "w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors",
                                !value && "text-violet-600 bg-violet-50"
                            )}
                        >
                            All {label}s
                        </button>
                        {options.map((opt) => (
                            <button
                                key={opt}
                                onClick={() => {
                                    onChange(opt);
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    "w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors",
                                    value === opt && "text-violet-600 bg-violet-50"
                                )}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

function Pagination({ currentPage, totalPages, onPageChange, itemsPerPage, totalItems }) {
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);

        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 flex-wrap gap-3">
            <div className="text-sm text-gray-500">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} students
            </div>
            <div className="flex gap-1">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-md border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                    <ChevronLeft size={16} />
                </button>
                {getPageNumbers().map(page => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={cn(
                            "w-8 h-8 rounded-md text-sm font-medium transition-colors",
                            currentPage === page
                                ? "bg-gradient-to-r from-violet-500 to-violet-700 text-white"
                                : "hover:bg-gray-100 text-gray-600"
                        )}
                    >
                        {page}
                    </button>
                ))}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-md border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
}

function StudentTable({ students, onDelete }) {
    if (students.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-1">No students found</h3>
                <p className="text-sm text-gray-500">Try adjusting your filters or add a new student</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                    <tr>
                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Class/Section</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Roll No.</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Parent/Guardian</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {students.map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-100 to-violet-200 flex items-center justify-center text-violet-700 font-semibold text-sm">
                                        {student.photo ? (
                                            <img src={student.photo} alt={student.name} className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            student.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">{student.name}</p>
                                        <p className="text-xs text-gray-400">ID: {student.id}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="py-3 px-4">
                                <span className="inline-flex items-center px-2 py-1 rounded-md bg-violet-50 text-violet-700 text-xs font-medium">
                                    {student.class}-{student.section}
                                </span>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">{student.rollNumber}</td>
                            <td className="py-3 px-4">
                                <p className="text-sm text-gray-800">{student.parentName}</p>
                                <p className="text-xs text-gray-400">{student.relationship || 'Parent'}</p>
                            </td>
                            <td className="py-3 px-4">
                                <p className="text-sm text-gray-600">{student.parentPhone}</p>
                                <p className="text-xs text-gray-400 truncate max-w-[150px]">{student.email}</p>
                            </td>
                            <td className="py-3 px-4">
                                <span className={cn(
                                    "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                                    student.status === 'Active' ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                                )}>
                                    {student.status}
                                </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end gap-1">
                                    <Link
                                        href={`/school/students/${student.id}`}
                                        className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-violet-600 transition-colors"
                                        title="View Details"
                                    >
                                        <Eye size={16} />
                                    </Link>
                                    <Link
                                        href={`/school/students/${student.id}/edit`}
                                        className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-emerald-600 transition-colors"
                                        title="Edit"
                                    >
                                        <Edit2 size={16} />
                                    </Link>
                                    <button
                                        onClick={() => onDelete(student)}
                                        className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-rose-600 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function StudentsPage() {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

    // Fetch students (replace with actual API call)
    const fetchStudents = async () => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockData = generateMockStudents();
        setStudents(mockData);
        setFilteredStudents(mockData);
        setLoading(false);
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    // Apply filters
    useEffect(() => {
        let filtered = [...students];

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(s =>
                s.name.toLowerCase().includes(query) ||
                s.id.toLowerCase().includes(query) ||
                s.parentName.toLowerCase().includes(query) ||
                s.rollNumber.includes(query)
            );
        }

        if (selectedClass) {
            filtered = filtered.filter(s => s.class === selectedClass);
        }

        if (selectedSection) {
            filtered = filtered.filter(s => s.section === selectedSection);
        }

        setFilteredStudents(filtered);
        setCurrentPage(1);
    }, [searchQuery, selectedClass, selectedSection, students]);

    // Pagination
    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
    const paginatedStudents = filteredStudents.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Actions
    const handleDeleteStudent = (student) => {
        if (confirm(`Are you sure you want to delete ${student.name}? This action cannot be undone.`)) {
            setStudents(students.filter(s => s.id !== student.id));
            // TODO: Call API to delete
        }
    };

    const handleClearFilters = () => {
        setSearchQuery('');
        setSelectedClass('');
        setSelectedSection('');
    };

    // Stats
    const stats = [
        { label: 'Total Students', value: students.length, icon: Users, color: 'violet' },
        { label: 'Total Classes', value: new Set(students.map(s => s.class)).size, icon: BookOpen, color: 'green' },
        { label: 'Active Students', value: students.filter(s => s.status === 'Active').length, icon: Check, color: 'emerald' },
        { label: 'Sections', value: SECTIONS.length, icon: School, color: 'purple' },
    ];

    // Get unique classes for filter
    const uniqueClasses = [...new Set(students.map(s => s.class))].sort((a, b) => {
        const order = CLASSES;
        return order.indexOf(a) - order.indexOf(b);
    });

    const statColors = {
        violet: 'bg-violet-100 text-violet-600',
        green: 'bg-green-100 text-green-600',
        emerald: 'bg-emerald-100 text-emerald-600',
        purple: 'bg-purple-100 text-purple-600',
    };

    return (
        <div className="min-h-screen bg-violet-50">
            <div className="p-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-1">Student Management</h1>
                    <p className="text-gray-500">Manage all students from Nursery to 12th grade</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div key={stat.label} className="bg-white rounded-lg border border-violet-100 p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">{stat.label}</p>
                                        <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                                    </div>
                                    <div className={cn(
                                        "w-10 h-10 rounded-md flex items-center justify-center",
                                        statColors[stat.color]
                                    )}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Actions Bar */}
                <div className="bg-white rounded-lg border border-violet-100 mb-6">
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex flex-col lg:flex-row gap-3 justify-between">
                            <SearchBar
                                value={searchQuery}
                                onChange={setSearchQuery}
                                placeholder="Search by name, ID, roll number, or parent name..."
                            />
                            <div className="flex gap-2 flex-wrap">
                                <FilterDropdown
                                    label="Class"
                                    options={uniqueClasses}
                                    value={selectedClass}
                                    onChange={setSelectedClass}
                                    icon={GraduationCap}
                                />
                                <FilterDropdown
                                    label="Section"
                                    options={SECTIONS}
                                    value={selectedSection}
                                    onChange={setSelectedSection}
                                    icon={School}
                                />
                                {(selectedClass || selectedSection || searchQuery) && (
                                    <button
                                        onClick={handleClearFilters}
                                        className="flex items-center gap-2 px-3 h-10 rounded-md border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                                    >
                                        <FilterX size={14} />
                                        Clear Filters
                                    </button>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Link
                                    href="/school/students/add?mode=bulk"
                                    className="flex items-center gap-2 px-4 h-10 rounded-md border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    <Upload size={16} />
                                    Bulk Import
                                </Link>
                                <Link
                                    href="/school/students/add"
                                    className="flex items-center gap-2 px-4 h-10 rounded-md bg-gradient-to-r from-violet-500 to-violet-700 text-sm font-medium text-white hover:opacity-90 transition-all"
                                >
                                    <Plus size={16} />
                                    Add Student
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Results Summary */}
                    <div className="px-4 py-2 bg-violet-50/30 border-b border-gray-200 text-sm text-gray-500 flex justify-between items-center">
                        <span>Showing {paginatedStudents.length} of {filteredStudents.length} students</span>
                        <button
                            onClick={fetchStudents}
                            className="flex items-center gap-1 text-xs text-violet-600 hover:text-violet-700"
                        >
                            <RefreshCw size={12} />
                            Refresh
                        </button>
                    </div>

                    {/* Table */}
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
                        </div>
                    ) : (
                        <StudentTable
                            students={paginatedStudents}
                            onDelete={handleDeleteStudent}
                        />
                    )}

                    {/* Pagination */}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        itemsPerPage={itemsPerPage}
                        totalItems={filteredStudents.length}
                    />
                </div>
            </div>
        </div>
    );
}