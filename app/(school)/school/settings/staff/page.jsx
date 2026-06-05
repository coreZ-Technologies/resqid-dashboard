// app/(school)/school/staff/page.jsx
'use client';

import { useState, useEffect } from 'react';
import {
    Users, Search, Filter, Plus, Download, Upload, ChevronLeft, ChevronRight,
    Eye, Edit2, Trash2, X, Check, UserPlus, FileText,
    Mail, Phone, MapPin, Calendar, AlertCircle, Loader2,
    GraduationCap, BookOpen, Briefcase, Clock, Award,
    MoreVertical, FilterX, RefreshCw, Shield, MessageCircle,
    Star, DollarSign, Calendar as CalendarIcon, CheckCircle,
    XCircle, UserCheck, UserX, School, Building2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const DEPARTMENTS = [
    'Teaching', 'Administration', 'Sports', 'Arts', 'Science Lab',
    'Computer Lab', 'Library', 'Counseling', 'Medical', 'Security',
    'Transport', 'Maintenance'
];

const DESIGNATIONS = {
    Teaching: ['Principal', 'Vice Principal', 'Head Teacher', 'Senior Teacher', 'Teacher', 'Assistant Teacher', 'Trainee Teacher'],
    Administration: ['Administrator', 'Accountant', 'Receptionist', 'Clerk', 'Office Assistant'],
    Sports: ['Head Coach', 'Sports Teacher', 'PE Teacher', 'Assistant Coach'],
    Arts: ['Art Teacher', 'Music Teacher', 'Dance Teacher'],
    'Science Lab': ['Lab Assistant', 'Science Teacher'],
    'Computer Lab': ['IT Teacher', 'Computer Instructor', 'Lab Technician'],
    Library: ['Librarian', 'Library Assistant'],
    Counseling: ['School Counselor', 'Psychologist'],
    Medical: ['School Nurse', 'Doctor'],
    Security: ['Security Guard', 'Security Supervisor'],
    Transport: ['Transport Coordinator', 'Driver'],
    Maintenance: ['Maintenance Staff', 'Cleaner', 'Gardener']
};

const QUALIFICATIONS = [
    'B.Ed', 'M.Ed', 'M.Sc', 'M.A', 'B.Tech', 'M.Tech', 'Ph.D',
    'B.P.Ed', 'M.P.Ed', 'Diploma', 'Certification'
];

const SUBJECTS = [
    'Mathematics', 'Science', 'Physics', 'Chemistry', 'Biology',
    'English', 'Hindi', 'Sanskrit', 'Social Studies', 'History',
    'Geography', 'Computer Science', 'Physical Education', 'Arts',
    'Music', 'Dance', 'Economics', 'Business Studies', 'Accountancy'
];

const EXPERIENCE_LEVELS = ['Fresher', '1-2 Years', '3-5 Years', '6-10 Years', '10+ Years'];

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA (Replace with actual API calls)
// ─────────────────────────────────────────────────────────────────────────────

const generateMockStaff = () => {
    const staff = [];
    const firstNames = ['Amit', 'Priya', 'Rajesh', 'Sunita', 'Vikram', 'Neha', 'Sanjay', 'Meera', 'Rahul', 'Anjali', 'Deepak', 'Kavita'];
    const lastNames = ['Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Joshi', 'Nair', 'Reddy', 'Patel', 'Malhotra'];

    for (let i = 1; i <= 150; i++) {
        const dept = DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)];
        const designations = DESIGNATIONS[dept];
        const designation = designations[Math.floor(Math.random() * designations.length)];
        const status = Math.random() > 0.05 ? 'Active' : 'Inactive';

        staff.push({
            id: `STF${String(i).padStart(4, '0')}`,
            name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
            email: `staff${i}@school.edu`,
            phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
            designation: designation,
            department: dept,
            qualification: QUALIFICATIONS[Math.floor(Math.random() * QUALIFICATIONS.length)],
            subjects: [SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)], SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)]],
            experience: EXPERIENCE_LEVELS[Math.floor(Math.random() * EXPERIENCE_LEVELS.length)],
            joiningDate: `202${Math.floor(Math.random() * 4)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-01`,
            dateOfBirth: `198${Math.floor(Math.random() * 9) + 1}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
            address: `${Math.floor(Math.random() * 100)} Staff Colony, Educational District, City`,
            emergencyContact: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
            bloodGroup: ['A+', 'B+', 'O+', 'AB+'][Math.floor(Math.random() * 4)],
            status: status,
            salary: Math.floor(Math.random() * 100000) + 25000,
            gender: ['Male', 'Female'][Math.floor(Math.random() * 2)],
            photo: null,
            isClassTeacher: Math.random() > 0.7,
            classAssigned: Math.random() > 0.7 ? `${Math.floor(Math.random() * 12) + 1}${String.fromCharCode(65 + Math.floor(Math.random() * 4))}` : null,
            qualifications: [
                { degree: 'B.Ed', university: 'Delhi University', year: 2015 },
                { degree: 'M.Sc', university: 'Mumbai University', year: 2017 }
            ],
            certifications: ['Google Certified Educator', 'First Aid Certified'],
            achievements: ['Best Teacher Award 2023', 'Outstanding Performance']
        });
    }
    return staff;
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTS (Notion style)
// ─────────────────────────────────────────────────────────────────────────────

function SearchBar({ value, onChange, placeholder }) {
    return (
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder || "Search by name, ID, designation, or department..."}
                className="w-full pl-9 pr-4 h-10 rounded-md border border-gray-200 bg-white text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-violet-300 focus:ring-1 focus:ring-violet-100 transition-all"
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
                <ChevronRight size={14} className={cn("transition-transform", isOpen && "rotate-90")} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full left-0 mt-1 min-w-[180px] bg-white border border-gray-200 rounded-md shadow-md z-20 py-1 max-h-64 overflow-y-auto">
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
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200 flex-wrap gap-3">
            <div className="text-xs text-gray-500">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} staff
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

function StaffTable({ staff, onView, onEdit, onDelete }) {
    if (staff.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-base font-medium text-gray-800 mb-1">No staff members found</h3>
                <p className="text-xs text-gray-500">Try adjusting your filters or add a new staff member</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                    <tr>
                        <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Staff Member</th>
                        <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Designation</th>
                        <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Department</th>
                        <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                        <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Experience</th>
                        <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="text-right py-3 px-4 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {staff.map((member) => (
                        <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-700 font-semibold text-sm">
                                        {member.photo ? (
                                            <img src={member.photo} alt={member.name} className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800 text-sm">{member.name}</p>
                                        <p className="text-[10px] text-gray-400">ID: {member.id}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="py-3 px-4">
                                <span className="inline-flex items-center px-2 py-1 rounded-md bg-violet-50 text-violet-700 text-xs font-medium">
                                    {member.designation}
                                </span>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">{member.department}</td>
                            <td className="py-3 px-4">
                                <p className="text-xs text-gray-600">{member.phone}</p>
                                <p className="text-[10px] text-gray-400 truncate max-w-[150px]">{member.email}</p>
                            </td>
                            <td className="py-3 px-4 text-xs text-gray-600">{member.experience}</td>
                            <td className="py-3 px-4">
                                <span className={cn(
                                    "inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium",
                                    member.status === 'Active' ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                                )}>
                                    {member.status}
                                </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end gap-1">
                                    <button
                                        onClick={() => onView(member)}
                                        className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-violet-600 transition-colors"
                                        title="View Details"
                                    >
                                        <Eye size={16} />
                                    </button>
                                    <button
                                        onClick={() => onEdit(member)}
                                        className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-emerald-600 transition-colors"
                                        title="Edit"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(member)}
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

function AddStaffModal({ isOpen, onClose, onSave, editingStaff }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        designation: '',
        department: '',
        qualification: '',
        subjects: [],
        experience: '',
        joiningDate: '',
        dateOfBirth: '',
        address: '',
        emergencyContact: '',
        bloodGroup: '',
        gender: 'Male',
        salary: '',
        isClassTeacher: false,
        classAssigned: ''
    });
    const [uploadedFile, setUploadedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (editingStaff) {
            setFormData(editingStaff);
        }
    }, [editingStaff]);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.phone) newErrors.phone = 'Phone number is required';
        if (!formData.designation) newErrors.designation = 'Designation is required';
        if (!formData.department) newErrors.department = 'Department is required';
        return newErrors;
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploading(true);
            setTimeout(() => {
                setUploadedFile(file);
                setUploading(false);
            }, 1000);
        }
    };

    const handleSubmit = () => {
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        onSave({ ...formData, photo: uploadedFile });
        handleClose();
    };

    const handleClose = () => {
        setFormData({
            name: '',
            email: '',
            phone: '',
            designation: '',
            department: '',
            qualification: '',
            subjects: [],
            experience: '',
            joiningDate: '',
            dateOfBirth: '',
            address: '',
            emergencyContact: '',
            bloodGroup: '',
            gender: 'Male',
            salary: '',
            isClassTeacher: false,
            classAssigned: ''
        });
        setUploadedFile(null);
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    const availableDesignations = DESIGNATIONS[formData.department] || [];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" onClick={handleClose} />
            <div className="relative bg-white rounded-md shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-violet-100">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <UserPlus className="w-5 h-5 text-violet-600" />
                        <h2 className="text-base font-semibold text-gray-800">
                            {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
                        </h2>
                    </div>
                    <button onClick={handleClose} className="p-1 rounded-md hover:bg-gray-100 transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <div className="p-5 space-y-5">
                    {/* Photo Upload */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">Profile Photo</label>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                                {uploadedFile ? (
                                    <img src={URL.createObjectURL(uploadedFile)} alt="Preview" className="w-full h-full object-cover" />
                                ) : editingStaff?.photo ? (
                                    <img src={editingStaff.photo} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <UserPlus className="w-6 h-6 text-gray-400" />
                                )}
                            </div>
                            <div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    id="photo-upload"
                                />
                                <label
                                    htmlFor="photo-upload"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors"
                                >
                                    {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                                    {uploading ? 'Uploading...' : 'Upload Photo'}
                                </label>
                                <p className="text-[10px] text-gray-400 mt-1">JPG, PNG (max 2MB)</p>
                            </div>
                        </div>
                    </div>

                    {/* Personal Information */}
                    <div>
                        <h3 className="text-xs font-semibold text-gray-800 mb-3 flex items-center gap-1.5">
                            <Users size={13} /> Personal Information
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className={cn(
                                        "w-full px-3 py-1.5 rounded-md border focus:outline-none focus:ring-1 focus:ring-violet-100 transition-all",
                                        errors.name ? "border-rose-300 focus:border-rose-400" : "border-gray-200 focus:border-violet-300"
                                    )}
                                    placeholder="Enter full name"
                                />
                                {errors.name && <p className="text-[10px] text-rose-500 mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Gender</label>
                                <select
                                    value={formData.gender}
                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                    className="w-full px-3 py-1.5 rounded-md border border-gray-200 focus:outline-none focus:border-violet-300"
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-3 py-1.5 rounded-md border border-gray-200 focus:outline-none focus:border-violet-300"
                                    placeholder="staff@school.edu"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Phone <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-3 py-1.5 rounded-md border border-gray-200 focus:outline-none focus:border-violet-300"
                                    placeholder="+91 XXXXXXXXXX"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Date of Birth</label>
                                <input
                                    type="date"
                                    value={formData.dateOfBirth}
                                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                    className="w-full px-3 py-1.5 rounded-md border border-gray-200 focus:outline-none focus:border-violet-300"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Blood Group</label>
                                <select
                                    value={formData.bloodGroup}
                                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                                    className="w-full px-3 py-1.5 rounded-md border border-gray-200 focus:outline-none focus:border-violet-300"
                                >
                                    <option value="">Select Blood Group</option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                </select>
                            </div>

                            <div className="col-span-2">
                                <label className="block text-xs font-medium text-gray-700 mb-1">Address</label>
                                <textarea
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    rows="2"
                                    className="w-full px-3 py-1.5 rounded-md border border-gray-200 focus:outline-none focus:border-violet-300 resize-none"
                                    placeholder="Enter complete address"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Emergency Contact</label>
                                <input
                                    type="tel"
                                    value={formData.emergencyContact}
                                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                                    className="w-full px-3 py-1.5 rounded-md border border-gray-200 focus:outline-none focus:border-violet-300"
                                    placeholder="Emergency contact number"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Professional Information */}
                    <div>
                        <h3 className="text-xs font-semibold text-gray-800 mb-3 flex items-center gap-1.5">
                            <Briefcase size={13} /> Professional Information
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Department <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.department}
                                    onChange={(e) => {
                                        setFormData({ ...formData, department: e.target.value, designation: '' });
                                    }}
                                    className="w-full px-3 py-1.5 rounded-md border border-gray-200 focus:outline-none focus:border-violet-300"
                                >
                                    <option value="">Select Department</option>
                                    {DEPARTMENTS.map(dept => (
                                        <option key={dept} value={dept}>{dept}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Designation <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.designation}
                                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                    disabled={!formData.department}
                                    className="w-full px-3 py-1.5 rounded-md border border-gray-200 focus:outline-none focus:border-violet-300 disabled:bg-gray-50 disabled:cursor-not-allowed"
                                >
                                    <option value="">Select Designation</option>
                                    {availableDesignations.map(des => (
                                        <option key={des} value={des}>{des}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Qualification</label>
                                <select
                                    value={formData.qualification}
                                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                                    className="w-full px-3 py-1.5 rounded-md border border-gray-200 focus:outline-none focus:border-violet-300"
                                >
                                    <option value="">Select Qualification</option>
                                    {QUALIFICATIONS.map(q => (
                                        <option key={q} value={q}>{q}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Experience</label>
                                <select
                                    value={formData.experience}
                                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                    className="w-full px-3 py-1.5 rounded-md border border-gray-200 focus:outline-none focus:border-violet-300"
                                >
                                    <option value="">Select Experience</option>
                                    {EXPERIENCE_LEVELS.map(exp => (
                                        <option key={exp} value={exp}>{exp}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Joining Date</label>
                                <input
                                    type="date"
                                    value={formData.joiningDate}
                                    onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                                    className="w-full px-3 py-1.5 rounded-md border border-gray-200 focus:outline-none focus:border-violet-300"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Annual Salary (₹)</label>
                                <input
                                    type="number"
                                    value={formData.salary}
                                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                                    className="w-full px-3 py-1.5 rounded-md border border-gray-200 focus:outline-none focus:border-violet-300"
                                    placeholder="Enter salary amount"
                                />
                            </div>

                            <div className="col-span-2">
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200">
                                    <div>
                                        <p className="text-xs font-medium text-gray-700">Class Teacher</p>
                                        <p className="text-[10px] text-gray-500">Assign as class teacher</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.isClassTeacher}
                                            onChange={(e) => setFormData({ ...formData, isClassTeacher: e.target.checked })}
                                            className="sr-only peer"
                                        />
                                        <div className="w-8 h-4 bg-gray-200 rounded-full peer-checked:bg-violet-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all"></div>
                                    </label>
                                </div>
                            </div>

                            {formData.isClassTeacher && (
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Class Assigned</label>
                                    <input
                                        type="text"
                                        value={formData.classAssigned}
                                        onChange={(e) => setFormData({ ...formData, classAssigned: e.target.value })}
                                        className="w-full px-3 py-1.5 rounded-md border border-gray-200 focus:outline-none focus:border-violet-300"
                                        placeholder="e.g., 10-A"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="sticky bottom-0 bg-white border-t border-gray-200 px-5 py-3 flex justify-end gap-2">
                    <button
                        onClick={handleClose}
                        className="px-3 py-1.5 rounded-md border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-3 py-1.5 rounded-md bg-gradient-to-r from-violet-500 to-violet-700 text-xs font-medium text-white hover:opacity-90 transition-all flex items-center gap-1.5"
                    >
                        <Check size={13} />
                        {editingStaff ? 'Update Staff' : 'Add Staff'}
                    </button>
                </div>
            </div>
        </div>
    );
}

function StaffDetailsModal({ isOpen, onClose, staff }) {
    if (!isOpen || !staff) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" onClick={onClose} />
            <div className="relative bg-white rounded-md shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-violet-100">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-violet-600" />
                        <h2 className="text-base font-semibold text-gray-800">Staff Details</h2>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-md hover:bg-gray-100">
                        <X size={18} />
                    </button>
                </div>

                <div className="p-5 space-y-5">
                    {/* Profile Header */}
                    <div className="flex items-center gap-4 pb-3 border-b border-gray-200">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-600 text-xl font-bold">
                            {staff.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <p className="text-base font-bold text-gray-800">{staff.name}</p>
                            <p className="text-xs text-gray-500">{staff.designation} • {staff.department}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={cn(
                                    "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium",
                                    staff.status === 'Active' ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                                )}>
                                    {staff.status}
                                </span>
                                <span className="text-[10px] text-gray-400">ID: {staff.id}</span>
                            </div>
                        </div>
                    </div>

                    {/* Personal Information */}
                    <div>
                        <h3 className="text-xs font-semibold text-gray-800 mb-3 flex items-center gap-1.5">
                            <Users size={13} /> Personal Information
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <p className="text-[10px] text-gray-500">Email</p>
                                <p className="text-xs text-gray-700">{staff.email}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500">Phone</p>
                                <p className="text-xs text-gray-700">{staff.phone}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500">Date of Birth</p>
                                <p className="text-xs text-gray-700">{new Date(staff.dateOfBirth).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500">Blood Group</p>
                                <p className="text-xs text-gray-700">{staff.bloodGroup}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-[10px] text-gray-500">Address</p>
                                <p className="text-xs text-gray-700">{staff.address}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500">Emergency Contact</p>
                                <p className="text-xs text-gray-700">{staff.emergencyContact}</p>
                            </div>
                        </div>
                    </div>

                    {/* Professional Information */}
                    <div>
                        <h3 className="text-xs font-semibold text-gray-800 mb-3 flex items-center gap-1.5">
                            <Briefcase size={13} /> Professional Information
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <p className="text-[10px] text-gray-500">Qualification</p>
                                <p className="text-xs text-gray-700">{staff.qualification}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500">Experience</p>
                                <p className="text-xs text-gray-700">{staff.experience}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500">Joining Date</p>
                                <p className="text-xs text-gray-700">{new Date(staff.joiningDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500">Annual Salary</p>
                                <p className="text-xs text-gray-700">₹{staff.salary?.toLocaleString()}</p>
                            </div>
                            {staff.isClassTeacher && (
                                <div>
                                    <p className="text-[10px] text-gray-500">Class Teacher</p>
                                    <p className="text-xs text-gray-700">Class {staff.classAssigned}</p>
                                </div>
                            )}
                            <div>
                                <p className="text-[10px] text-gray-500">Subjects</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {staff.subjects?.map(subject => (
                                        <span key={subject} className="text-[10px] bg-violet-50 text-violet-700 px-1.5 py-0.5 rounded">
                                            {subject}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full py-2 rounded-md bg-gray-100 text-gray-700 text-xs font-medium hover:bg-gray-200 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function StaffManagementPage() {
    const [staff, setStaff] = useState([]);
    const [filteredStaff, setFilteredStaff] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedDesignation, setSelectedDesignation] = useState('');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

    // Modals
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);
    const [selectedStaff, setSelectedStaff] = useState(null);

    // Fetch staff
    useEffect(() => {
        const fetchStaff = async () => {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            const data = generateMockStaff();
            setStaff(data);
            setFilteredStaff(data);
            setLoading(false);
        };
        fetchStaff();
    }, []);

    // Apply filters
    useEffect(() => {
        let filtered = [...staff];

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(s =>
                s.name.toLowerCase().includes(query) ||
                s.id.toLowerCase().includes(query) ||
                s.designation.toLowerCase().includes(query) ||
                s.department.toLowerCase().includes(query) ||
                s.email.toLowerCase().includes(query)
            );
        }

        if (selectedDepartment) {
            filtered = filtered.filter(s => s.department === selectedDepartment);
        }

        if (selectedStatus) {
            filtered = filtered.filter(s => s.status === selectedStatus);
        }

        if (selectedDesignation) {
            filtered = filtered.filter(s => s.designation === selectedDesignation);
        }

        setFilteredStaff(filtered);
        setCurrentPage(1);
    }, [searchQuery, selectedDepartment, selectedStatus, selectedDesignation, staff]);

    // Pagination
    const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);
    const paginatedStaff = filteredStaff.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Actions
    const handleAddStaff = (newStaff) => {
        const staffMember = {
            ...newStaff,
            id: `STF${String(staff.length + 1).padStart(4, '0')}`,
            status: 'Active',
        };
        setStaff([staffMember, ...staff]);
    };

    const handleUpdateStaff = (updatedStaff) => {
        setStaff(staff.map(s => s.id === updatedStaff.id ? updatedStaff : s));
        setEditingStaff(null);
    };

    const handleViewStaff = (staffMember) => {
        setSelectedStaff(staffMember);
        setIsDetailsModalOpen(true);
    };

    const handleEditStaff = (staffMember) => {
        setEditingStaff(staffMember);
        setIsAddModalOpen(true);
    };

    const handleDeleteStaff = (staffMember) => {
        if (confirm(`Are you sure you want to delete ${staffMember.name}? This action cannot be undone.`)) {
            setStaff(staff.filter(s => s.id !== staffMember.id));
        }
    };

    const handleClearFilters = () => {
        setSearchQuery('');
        setSelectedDepartment('');
        setSelectedStatus('');
        setSelectedDesignation('');
    };

    // Stats
    const stats = [
        { label: 'Total Staff', value: staff.length, icon: Users, color: 'violet' },
        { label: 'Teaching Staff', value: staff.filter(s => s.department === 'Teaching').length, icon: GraduationCap, color: 'emerald' },
        { label: 'Active Staff', value: staff.filter(s => s.status === 'Active').length, icon: CheckCircle, color: 'emerald' },
        { label: 'Departments', value: new Set(staff.map(s => s.department)).size, icon: Building2, color: 'purple' },
    ];

    const statColors = {
        violet: 'bg-violet-50 text-violet-600',
        emerald: 'bg-emerald-50 text-emerald-600',
        purple: 'bg-purple-50 text-purple-600',
    };

    // Get unique designations for filter
    const uniqueDesignations = [...new Set(staff.map(s => s.designation))];

    return (
        <div className="min-h-screen bg-violet-50">
            <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-800 mb-1">Staff Management</h1>
                        <p className="text-xs text-gray-500">Manage teachers and administrative staff</p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingStaff(null);
                            setIsAddModalOpen(true);
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-gradient-to-r from-violet-500 to-violet-700 text-white text-xs font-medium hover:opacity-90 transition-all"
                    >
                        <Plus size={14} />
                        Add Staff Member
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div key={stat.label} className="bg-white rounded-md border border-violet-100 p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-gray-500">{stat.label}</p>
                                        <p className="text-2xl font-semibold text-gray-800">{stat.value}</p>
                                    </div>
                                    <div className={cn("w-10 h-10 rounded-md flex items-center justify-center", statColors[stat.color])}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Filters Bar */}
                <div className="bg-white rounded-md border border-violet-100 mb-6">
                    <div className="p-3 border-b border-gray-200">
                        <div className="flex flex-col lg:flex-row gap-3">
                            <SearchBar
                                value={searchQuery}
                                onChange={setSearchQuery}
                                placeholder="Search by name, ID, designation, department, or email..."
                            />

                            <FilterDropdown
                                label="Department"
                                options={DEPARTMENTS}
                                value={selectedDepartment}
                                onChange={setSelectedDepartment}
                                icon={Building2}
                            />

                            <FilterDropdown
                                label="Designation"
                                options={uniqueDesignations}
                                value={selectedDesignation}
                                onChange={setSelectedDesignation}
                                icon={Briefcase}
                            />

                            <FilterDropdown
                                label="Status"
                                options={['Active', 'Inactive']}
                                value={selectedStatus}
                                onChange={setSelectedStatus}
                                icon={CheckCircle}
                            />

                            {(selectedDepartment || selectedStatus || selectedDesignation || searchQuery) && (
                                <button
                                    onClick={handleClearFilters}
                                    className="flex items-center gap-1.5 px-3 h-10 rounded-md border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    <FilterX size={13} />
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="px-4 py-1.5 bg-gray-50 border-b border-gray-200 text-xs text-gray-500 flex justify-between items-center">
                        <span>Showing {filteredStaff.length} staff members</span>
                        <button className="flex items-center gap-1 text-[10px] text-violet-600 hover:text-violet-700">
                            <RefreshCw size={11} />
                            Refresh
                        </button>
                    </div>

                    {/* Table */}
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
                        </div>
                    ) : (
                        <StaffTable
                            staff={paginatedStaff}
                            onView={handleViewStaff}
                            onEdit={handleEditStaff}
                            onDelete={handleDeleteStaff}
                        />
                    )}

                    {/* Pagination */}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        itemsPerPage={itemsPerPage}
                        totalItems={filteredStaff.length}
                    />
                </div>
            </div>

            {/* Modals */}
            <AddStaffModal
                isOpen={isAddModalOpen}
                onClose={() => {
                    setIsAddModalOpen(false);
                    setEditingStaff(null);
                }}
                onSave={editingStaff ? handleUpdateStaff : handleAddStaff}
                editingStaff={editingStaff}
            />

            <StaffDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => {
                    setIsDetailsModalOpen(false);
                    setSelectedStaff(null);
                }}
                staff={selectedStaff}
            />
        </div>
    );
}