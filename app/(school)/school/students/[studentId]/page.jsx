// app/(school)/school/students/[studentId]/page.jsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft, User, Mail, Phone, MapPin, Calendar, Heart,
    BookOpen, Clock, CheckCircle, AlertCircle, Edit2, Download,
    Shield, Activity, Droplet, AlertTriangle, Stethoscope, Users,
    GraduationCap, Fingerprint, Smartphone, Home, FileText,
    Printer, Share2, MessageCircle, Bell, Plus, ChevronRight,
    Lock, Eye, EyeOff, QrCode, Camera, FilePlus
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// TABS CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────

const TABS = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'academic', label: 'Academic', icon: GraduationCap },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'emergency', label: 'Emergency', icon: AlertCircle },
    { id: 'medical', label: 'Medical', icon: Heart },
    { id: 'documents', label: 'Documents', icon: FileText },
];

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA (Replace with actual API calls)
// ─────────────────────────────────────────────────────────────────────────────

const getStudentData = (id) => ({
    id: id,
    name: 'Aarav Sharma',
    firstName: 'Aarav',
    lastName: 'Sharma',
    gender: 'MALE',
    dateOfBirth: '2010-05-15',
    age: 14,
    bloodGroup: 'O+',
    rollNumber: '24',
    class: '10',
    section: 'A',
    admissionYear: '2024',
    enrollmentDate: '2024-01-15',
    status: 'Active',
    qrCodeId: 'RESQID-STU-2024-001234',

    // Contact Information
    email: 'aarav.sharma@springdale.edu.in',
    phone: '+91 98765 43210',
    address: '42, Park Street, Kolkata, West Bengal - 700016',
    city: 'Kolkata',
    state: 'West Bengal',
    pincode: '700016',

    // Parent/Guardian Information
    parents: [
        {
            id: 'parent1',
            name: 'Rajesh Sharma',
            relationship: 'Father',
            phone: '+91 98765 43210',
            email: 'rajesh.sharma@example.com',
            occupation: 'Businessman',
            isPrimary: true,
            canCall: true,
            canWhatsapp: true,
        },
        {
            id: 'parent2',
            name: 'Neha Sharma',
            relationship: 'Mother',
            phone: '+91 98765 43211',
            email: 'neha.sharma@example.com',
            occupation: 'Teacher',
            isPrimary: false,
            canCall: true,
            canWhatsapp: true,
        },
    ],

    emergencyContacts: [
        {
            id: 'emergency1',
            name: 'Rajesh Sharma',
            relationship: 'Father',
            phone: '+91 98765 43210',
            priority: 1,
        },
        {
            id: 'emergency2',
            name: 'Dr. Mehta (Family Doctor)',
            relationship: 'Family Physician',
            phone: '+91 98765 43212',
            priority: 2,
        },
    ],

    // Medical Information
    medicalInfo: {
        bloodGroup: 'O+',
        allergies: ['Peanuts', 'Dust Mites', 'Penicillin'],
        conditions: ['Asthma', 'Mild Allergy to Dairy'],
        medications: ['Inhaler (Salbutamol) - As needed', 'Cetirizine - 10mg for allergies'],
        doctor: {
            name: 'Dr. Anjali Mehta',
            specialization: 'Pediatrician',
            clinic: 'Mehta Child Care Clinic',
            phone: '+91 98765 43213',
            address: '15, Lake View Road, Kolkata',
        },
        hospital: {
            name: 'Apollo Gleneagles Hospital',
            phone: '+91 33 2320 3040',
            address: '58, Canal Circular Road, Kolkata',
        },
        insurance: {
            provider: 'Star Health Insurance',
            policyNumber: 'SHI/2024/123456',
            validUntil: '2026-12-31',
        },
        notes: 'Student has mild asthma. Inhaler is kept in the school medical room. Parents informed about condition.',
        lastCheckup: '2024-10-15',
        emergencyInstructions: 'In case of asthma attack, use inhaler immediately and contact parents. For severe reactions, rush to nearest hospital.',
    },

    // Emergency Profile Visibility
    emergencyVisibility: 'PUBLIC', // PUBLIC, MINIMAL, HIDDEN

    // Academic Information
    academicInfo: {
        subjects: [
            { name: 'Mathematics', code: 'MAT101', teacher: 'Mr. Sharma' },
            { name: 'Science', code: 'SCI101', teacher: 'Ms. Gupta' },
            { name: 'English', code: 'ENG101', teacher: 'Mrs. Singh' },
            { name: 'Social Studies', code: 'SST101', teacher: 'Mr. Kumar' },
            { name: 'Computer Science', code: 'CS101', teacher: 'Ms. Patel' },
        ],
        previousSchool: 'Delhi Public School',
        transferCertificate: 'Yes',
        achievements: ['1st Prize in Science Fair 2024', 'School Cricket Team Captain'],
        remarks: 'Excellent academic performance, needs encouragement in Mathematics',
    },

    // Attendance Summary
    attendance: {
        present: 85,
        total: 90,
        percentage: 94.44,
        monthly: [
            { month: 'Jan', present: 22, total: 24, percentage: 91.67 },
            { month: 'Feb', present: 20, total: 22, percentage: 90.91 },
            { month: 'Mar', present: 18, total: 20, percentage: 90.00 },
            { month: 'Apr', present: 23, total: 23, percentage: 100.00 },
            { month: 'May', present: 2, total: 2, percentage: 100.00 },
        ],
        recentAbsences: [
            { date: '2024-12-10', reason: 'Fever', approved: true },
            { date: '2024-11-28', reason: 'Family function', approved: true },
        ],
    },

    // Documents
    documents: [
        { id: 'doc1', name: 'Birth Certificate', type: 'PDF', size: '1.2 MB', uploadedAt: '2024-01-20' },
        { id: 'doc2', name: 'Transfer Certificate', type: 'PDF', size: '0.8 MB', uploadedAt: '2024-01-20' },
        { id: 'doc3', name: 'Medical Report', type: 'PDF', size: '2.1 MB', uploadedAt: '2024-02-15' },
        { id: 'doc4', name: 'Parent ID Proof', type: 'PDF', size: '1.5 MB', uploadedAt: '2024-01-20' },
    ],

    // Recent Activity
    recentActivity: [
        { action: 'Attendance Marked', date: '2024-12-20 09:30 AM', status: 'Present' },
        { action: 'Parent Meeting Scheduled', date: '2024-12-18 02:00 PM', status: 'Pending' },
        { action: 'Report Card Generated', date: '2024-12-15 11:00 AM', status: 'Completed' },
        { action: 'Medical Checkup', date: '2024-12-10 10:00 AM', status: 'Completed' },
    ],

    // Fee Details
    feeDetails: {
        totalFees: 85000,
        paid: 75000,
        pending: 10000,
        lastPayment: '2024-12-05',
        nextDueDate: '2025-01-15',
    },
});

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function StatCard({ label, value, icon: Icon, color }) {
    const colorMap = {
        violet: 'bg-violet-100 text-violet-600',
        emerald: 'bg-emerald-100 text-emerald-600',
        rose: 'bg-rose-100 text-rose-600',
        purple: 'bg-purple-100 text-purple-600',
        amber: 'bg-amber-100 text-amber-600',
        blue: 'bg-blue-100 text-blue-600', // fallback, but we'll use violet as primary
    };
    return (
        <div className="bg-white rounded-md border border-violet-100 p-4">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500">{label}</p>
                    <p className="text-2xl font-bold text-gray-800">{value}</p>
                </div>
                <div className={cn("w-10 h-10 rounded-md flex items-center justify-center", colorMap[color])}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
        </div>
    );
}

function InfoRow({ icon: Icon, label, value, href, className }) {
    if (!value) return null;

    const content = (
        <div className={cn("flex items-start gap-3", className)}>
            <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-gray-500" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 uppercase tracking-wider">{label}</p>
                <p className="text-sm text-gray-700 font-medium mt-0.5 break-words">{value}</p>
            </div>
        </div>
    );

    if (href) {
        return <Link href={href}>{content}</Link>;
    }
    return content;
}

function ContactCard({ contact, onCall, onWhatsApp }) {
    return (
        <div className="flex items-center gap-3 p-3 rounded-md border border-violet-100 hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-100 to-violet-200 flex items-center justify-center text-violet-700 font-semibold">
                {contact.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800">{contact.name}</p>
                <p className="text-xs text-gray-400">{contact.relationship}</p>
                <p className="text-sm text-gray-600 mt-0.5">{contact.phone}</p>
            </div>
            <div className="flex gap-2">
                {contact.canCall !== false && (
                    <button
                        onClick={() => onCall(contact.phone)}
                        className="p-2 rounded-md bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                        title="Call"
                    >
                        <Phone className="w-4 h-4" />
                    </button>
                )}
                {contact.canWhatsapp !== false && (
                    <button
                        onClick={() => onWhatsApp(contact.phone)}
                        className="p-2 rounded-md bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                        title="WhatsApp"
                    >
                        <MessageCircle className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
}

function MedicalChip({ label, value, color }) {
    if (!value || (Array.isArray(value) && value.length === 0)) return null;

    const items = Array.isArray(value) ? value : [value];
    const colorMap = {
        red: 'bg-rose-50 text-rose-700 border-rose-200',
        amber: 'bg-amber-50 text-amber-700 border-amber-200',
        blue: 'bg-sky-50 text-sky-700 border-sky-200',
        purple: 'bg-purple-50 text-purple-700 border-purple-200',
    };

    return (
        <div>
            <p className="text-xs font-medium text-gray-500 mb-2">{label}</p>
            <div className="flex flex-wrap gap-2">
                {items.map((item, idx) => (
                    <span
                        key={idx}
                        className={cn(
                            "px-3 py-1.5 rounded-full text-xs font-medium border",
                            colorMap[color]
                        )}
                    >
                        {item}
                    </span>
                ))}
            </div>
        </div>
    );
}

function EmergencyProfileCard({ student, onToggleVisibility }) {
    const visibilityConfig = {
        PUBLIC: { label: 'Full Visibility', color: 'emerald', icon: Eye, description: 'All emergency contacts and medical info are visible' },
        MINIMAL: { label: 'Minimal Profile', color: 'amber', icon: EyeOff, description: 'Only primary contact is visible' },
        HIDDEN: { label: 'Hidden Profile', color: 'rose', icon: Lock, description: 'No emergency info is visible when scanned' },
    };

    const config = visibilityConfig[student.emergencyVisibility];
    const Icon = config.icon;

    return (
        <div className="bg-white rounded-md border border-violet-100 overflow-hidden">
            <div className="p-4 border-b border-violet-100 bg-gradient-to-r from-rose-50 to-amber-50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-rose-600" />
                        <h3 className="font-semibold text-gray-800">Emergency QR Profile</h3>
                    </div>
                    <button
                        onClick={onToggleVisibility}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-gray-600 hover:bg-white transition-colors"
                    >
                        <Icon className="w-4 h-4" />
                        {config.label}
                    </button>
                </div>
                <p className="text-sm text-gray-600 mt-1">{config.description}</p>
            </div>

            <div className="p-4">
                <div className="bg-gray-50 rounded-md p-3 mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-md bg-white border border-gray-200 flex items-center justify-center">
                            <QrCode className="w-8 h-8 text-gray-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">QR Code ID</p>
                            <p className="font-mono text-sm text-gray-700">{student.qrCodeId}</p>
                            <button className="text-xs text-violet-600 hover:underline mt-1">Download QR Code</button>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Blood Group</span>
                        <span className="font-mono font-bold text-rose-600">{student.medicalInfo.bloodGroup}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Allergies</span>
                        <span className="text-sm text-gray-700">
                            {student.medicalInfo.allergies?.length || 0} recorded
                        </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Emergency Contacts</span>
                        <span className="text-sm text-gray-700">
                            {student.emergencyContacts.length} contacts
                        </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-600">Last Scan</span>
                        <span className="text-sm text-gray-700">2024-12-20 10:30 AM</span>
                    </div>
                </div>

                <button className="w-full mt-4 py-2 rounded-md bg-gradient-to-r from-violet-500 to-violet-700 text-white text-sm font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4" />
                    Preview Emergency Profile
                </button>
            </div>
        </div>
    );
}

function AttendanceChart({ attendance }) {
    return (
        <div className="space-y-4">
            {/* Overall Stats */}
            <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-emerald-50 rounded-md">
                    <p className="text-2xl font-bold text-emerald-600">{attendance.present}</p>
                    <p className="text-xs text-gray-500">Present Days</p>
                </div>
                <div className="text-center p-3 bg-rose-50 rounded-md">
                    <p className="text-2xl font-bold text-rose-600">{attendance.total - attendance.present}</p>
                    <p className="text-xs text-gray-500">Absent Days</p>
                </div>
                <div className="text-center p-3 bg-violet-50 rounded-md">
                    <p className="text-2xl font-bold text-violet-600">{attendance.percentage}%</p>
                    <p className="text-xs text-gray-500">Attendance Rate</p>
                </div>
            </div>

            {/* Progress Bar */}
            <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Overall Attendance</span>
                    <span>{attendance.percentage}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className={cn(
                            "h-full rounded-full transition-all",
                            attendance.percentage >= 75 ? "bg-emerald-500" : attendance.percentage >= 60 ? "bg-amber-500" : "bg-rose-500"
                        )}
                        style={{ width: `${attendance.percentage}%` }}
                    />
                </div>
            </div>

            {/* Monthly Breakdown */}
            <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Monthly Breakdown</p>
                <div className="space-y-2">
                    {attendance.monthly.map((month) => (
                        <div key={month.month}>
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>{month.month}</span>
                                <span>{month.present}/{month.total} ({month.percentage}%)</span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-violet-500 rounded-full"
                                    style={{ width: `${month.percentage}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Absences */}
            {attendance.recentAbsences.length > 0 && (
                <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Recent Absences</p>
                    <div className="space-y-2">
                        {attendance.recentAbsences.map((absence, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded-md">
                                <div>
                                    <p className="text-gray-700">{new Date(absence.date).toLocaleDateString()}</p>
                                    <p className="text-xs text-gray-400">{absence.reason}</p>
                                </div>
                                {absence.approved ? (
                                    <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Approved</span>
                                ) : (
                                    <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">Pending</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function StudentDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const fetchStudent = async () => {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            setStudent(getStudentData(params.studentId));
            setLoading(false);
        };
        fetchStudent();
    }, [params.studentId]);

    const handleCall = (phoneNumber) => {
        window.location.href = `tel:${phoneNumber}`;
    };

    const handleWhatsApp = (phoneNumber) => {
        window.open(`https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}`, '_blank');
    };

    const handleToggleVisibility = () => {
        const visibilityOrder = ['PUBLIC', 'MINIMAL', 'HIDDEN'];
        const currentIndex = visibilityOrder.indexOf(student.emergencyVisibility);
        const nextIndex = (currentIndex + 1) % visibilityOrder.length;
        setStudent({
            ...student,
            emergencyVisibility: visibilityOrder[nextIndex],
        });
        // TODO: API call to update visibility
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-violet-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-500">Loading student profile...</p>
                </div>
            </div>
        );
    }

    if (!student) return null;

    const calculateAge = (dob) => {
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    return (
        <div className="min-h-screen bg-violet-50">
            <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-600 hover:text-violet-600 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Back to Students
                    </button>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                            <Printer size={16} />
                            Print Profile
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                            <Share2 size={16} />
                            Share
                        </button>
                        <Link
                            href={`/school/students/${student.id}/edit`}
                            className="flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-violet-500 to-violet-700 text-sm font-medium text-white hover:opacity-90 transition-all"
                        >
                            <Edit2 size={16} />
                            Edit Profile
                        </Link>
                    </div>
                </div>

                {/* Student Header Card */}
                <div className="bg-white rounded-md border border-violet-100 overflow-hidden mb-6">
                    <div className="p-6 border-b border-violet-100 bg-gradient-to-r from-violet-50 to-white">
                        <div className="flex items-start gap-6">
                            {/* Avatar */}
                            <div className="relative">
                                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center text-white text-3xl font-bold">
                                    {student.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:bg-gray-50">
                                    <Camera className="w-4 h-4 text-gray-500" />
                                </button>
                            </div>

                            {/* Basic Info */}
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h1 className="text-2xl font-bold text-gray-800">{student.name}</h1>
                                    <span className={cn(
                                        "px-2 py-0.5 rounded-full text-xs font-medium",
                                        student.status === 'Active' ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                                    )}>
                                        {student.status}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-3">
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-violet-50 text-violet-700 text-xs font-medium">
                                        <GraduationCap size={12} />
                                        Class {student.class}-{student.section}
                                    </span>
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-medium">
                                        <Fingerprint size={12} />
                                        Roll No: {student.rollNumber}
                                    </span>
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-rose-50 text-rose-700 text-xs font-medium">
                                        <Droplet size={12} />
                                        Blood: {student.bloodGroup}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Mail size={14} className="text-gray-400" />
                                        {student.email}
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Phone size={14} className="text-gray-400" />
                                        {student.phone}
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Calendar size={14} className="text-gray-400" />
                                        DOB: {new Date(student.dateOfBirth).toLocaleDateString()} ({calculateAge(student.dateOfBirth)} years)
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-200">
                        <div className="bg-white p-4 text-center">
                            <p className="text-2xl font-bold text-violet-600">{student.attendance.percentage}%</p>
                            <p className="text-xs text-gray-500">Attendance</p>
                        </div>
                        <div className="bg-white p-4 text-center">
                            <p className="text-2xl font-bold text-emerald-600">{student.academicInfo.subjects.length}</p>
                            <p className="text-xs text-gray-500">Subjects</p>
                        </div>
                        <div className="bg-white p-4 text-center">
                            <p className="text-2xl font-bold text-purple-600">{student.parents.length}</p>
                            <p className="text-xs text-gray-500">Guardians</p>
                        </div>
                        <div className="bg-white p-4 text-center">
                            <p className="text-2xl font-bold text-amber-600">{student.emergencyContacts.length}</p>
                            <p className="text-xs text-gray-500">Emergency Contacts</p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 bg-white p-1 rounded-md border border-violet-100 mb-6 overflow-x-auto">
                    {TABS.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap",
                                    activeTab === tab.id
                                        ? "bg-gradient-to-r from-violet-500 to-violet-700 text-white"
                                        : "text-gray-600 hover:bg-gray-100"
                                )}
                            >
                                <Icon size={16} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Tab Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Always visible */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Emergency Profile Card */}
                        <EmergencyProfileCard
                            student={student}
                            onToggleVisibility={handleToggleVisibility}
                        />

                        {/* Parents/Guardians */}
                        <div className="bg-white rounded-md border border-violet-100 p-4">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-violet-600" />
                                    <h3 className="font-semibold text-gray-800">Parents & Guardians</h3>
                                </div>
                                <button className="text-xs text-violet-600 hover:underline">Add Contact</button>
                            </div>
                            <div className="space-y-3">
                                {student.parents.map((parent) => (
                                    <ContactCard
                                        key={parent.id}
                                        contact={parent}
                                        onCall={handleCall}
                                        onWhatsApp={handleWhatsApp}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Emergency Contacts */}
                        <div className="bg-white rounded-md border border-violet-100 p-4">
                            <div className="flex items-center gap-2 mb-4">
                                <AlertCircle className="w-5 h-5 text-rose-600" />
                                <h3 className="font-semibold text-gray-800">Emergency Contacts</h3>
                            </div>
                            <div className="space-y-3">
                                {student.emergencyContacts.map((contact) => (
                                    <ContactCard
                                        key={contact.id}
                                        contact={contact}
                                        onCall={handleCall}
                                        onWhatsApp={handleWhatsApp}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-md border border-violet-100 p-4">
                            <h3 className="font-semibold text-gray-800 mb-3">Quick Actions</h3>
                            <div className="space-y-2">
                                <button className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-gray-50 text-gray-700 transition-colors">
                                    <MessageCircle size={16} />
                                    <span className="text-sm">Send Message to Parents</span>
                                </button>
                                <button className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-gray-50 text-gray-700 transition-colors">
                                    <Bell size={16} />
                                    <span className="text-sm">Send Notification</span>
                                </button>
                                <button className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-gray-50 text-gray-700 transition-colors">
                                    <FilePlus size={16} />
                                    <span className="text-sm">Generate Report Card</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Tab specific content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Overview Tab */}
                        {activeTab === 'overview' && (
                            <>
                                <div className="bg-white rounded-md border border-violet-100 p-4">
                                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <User className="w-5 h-5 text-violet-600" />
                                        Personal Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InfoRow icon={User} label="Full Name" value={student.name} />
                                        <InfoRow icon={GraduationCap} label="Class & Section" value={`${student.class}-${student.section}`} />
                                        <InfoRow icon={Fingerprint} label="Roll Number" value={student.rollNumber} />
                                        <InfoRow icon={Calendar} label="Date of Birth" value={new Date(student.dateOfBirth).toLocaleDateString()} />
                                        <InfoRow icon={Heart} label="Blood Group" value={student.bloodGroup} />
                                        <InfoRow icon={Smartphone} label="Phone" value={student.phone} />
                                        <InfoRow icon={Mail} label="Email" value={student.email} />
                                        <InfoRow icon={Calendar} label="Enrollment Date" value={new Date(student.enrollmentDate).toLocaleDateString()} />
                                        <InfoRow icon={Home} label="Address" value={student.address} className="md:col-span-2" />
                                    </div>
                                </div>

                                <div className="bg-white rounded-md border border-violet-100 p-4">
                                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <Activity className="w-5 h-5 text-purple-600" />
                                        Recent Activity
                                    </h3>
                                    <div className="space-y-3">
                                        {student.recentActivity.map((activity, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-700">{activity.action}</p>
                                                    <p className="text-xs text-gray-400">{activity.date}</p>
                                                </div>
                                                <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded">{activity.status}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Academic Tab */}
                        {activeTab === 'academic' && (
                            <>
                                <div className="bg-white rounded-md border border-violet-100 p-4">
                                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <BookOpen className="w-5 h-5 text-emerald-600" />
                                        Subjects
                                    </h3>
                                    <div className="space-y-2">
                                        {student.academicInfo.subjects.map((subject, idx) => (
                                            <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                                <div>
                                                    <p className="font-medium text-gray-700">{subject.name}</p>
                                                    <p className="text-xs text-gray-400">Code: {subject.code}</p>
                                                </div>
                                                <p className="text-sm text-gray-600">Teacher: {subject.teacher}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white rounded-md border border-violet-100 p-4">
                                    <h3 className="font-semibold text-gray-800 mb-4">Academic Achievements</h3>
                                    <div className="space-y-2">
                                        {student.academicInfo.achievements.map((achievement, idx) => (
                                            <div key={idx} className="flex items-center gap-2 p-2 bg-violet-50 rounded-md">
                                                <CheckCircle className="w-4 h-4 text-violet-600" />
                                                <span className="text-sm text-gray-700">{achievement}</span>
                                            </div>
                                        ))}
                                    </div>
                                    {student.academicInfo.remarks && (
                                        <div className="mt-4 p-3 bg-amber-50 rounded-md">
                                            <p className="text-xs text-amber-600 mb-1">Teacher's Remarks</p>
                                            <p className="text-sm text-gray-700">{student.academicInfo.remarks}</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {/* Attendance Tab */}
                        {activeTab === 'attendance' && (
                            <div className="bg-white rounded-md border border-violet-100 p-4">
                                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-violet-600" />
                                    Attendance Summary
                                </h3>
                                <AttendanceChart attendance={student.attendance} />
                            </div>
                        )}

                        {/* Emergency Tab */}
                        {activeTab === 'emergency' && (
                            <>
                                <div className="bg-white rounded-md border border-violet-100 p-4">
                                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5 text-rose-600" />
                                        Emergency Instructions
                                    </h3>
                                    <div className="p-4 bg-rose-50 border border-rose-200 rounded-md">
                                        <p className="text-sm text-rose-700">{student.medicalInfo.emergencyInstructions}</p>
                                    </div>
                                </div>

                                <div className="bg-white rounded-md border border-violet-100 p-4">
                                    <h3 className="font-semibold text-gray-800 mb-4">Emergency Contacts - Full List</h3>
                                    <div className="space-y-3">
                                        {[...student.parents, ...student.emergencyContacts].map((contact, idx) => (
                                            <ContactCard
                                                key={idx}
                                                contact={contact}
                                                onCall={handleCall}
                                                onWhatsApp={handleWhatsApp}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Medical Tab */}
                        {activeTab === 'medical' && (
                            <>
                                <div className="bg-white rounded-md border border-violet-100 p-4">
                                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <Stethoscope className="w-5 h-5 text-purple-600" />
                                        Medical Information
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs text-gray-400">Blood Group</p>
                                                <p className="text-lg font-bold text-rose-600">{student.medicalInfo.bloodGroup}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400">Last Checkup</p>
                                                <p className="text-sm text-gray-700">{new Date(student.medicalInfo.lastCheckup).toLocaleDateString()}</p>
                                            </div>
                                        </div>

                                        <MedicalChip label="Allergies" value={student.medicalInfo.allergies} color="red" />
                                        <MedicalChip label="Medical Conditions" value={student.medicalInfo.conditions} color="amber" />
                                        <MedicalChip label="Medications" value={student.medicalInfo.medications} color="blue" />
                                    </div>
                                </div>

                                <div className="bg-white rounded-md border border-violet-100 p-4">
                                    <h3 className="font-semibold text-gray-800 mb-4">Doctor Information</h3>
                                    <div className="space-y-3">
                                        <InfoRow icon={User} label="Doctor Name" value={student.medicalInfo.doctor.name} />
                                        <InfoRow icon={Stethoscope} label="Specialization" value={student.medicalInfo.doctor.specialization} />
                                        <InfoRow icon={Phone} label="Phone" value={student.medicalInfo.doctor.phone} />
                                        <InfoRow icon={Home} label="Clinic Address" value={student.medicalInfo.doctor.address} />
                                    </div>
                                </div>

                                <div className="bg-white rounded-md border border-violet-100 p-4">
                                    <h3 className="font-semibold text-gray-800 mb-4">Insurance Details</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between py-2 border-b border-gray-100">
                                            <span className="text-sm text-gray-500">Provider</span>
                                            <span className="text-sm font-medium text-gray-700">{student.medicalInfo.insurance.provider}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-gray-100">
                                            <span className="text-sm text-gray-500">Policy Number</span>
                                            <span className="text-sm font-medium text-gray-700">{student.medicalInfo.insurance.policyNumber}</span>
                                        </div>
                                        <div className="flex justify-between py-2">
                                            <span className="text-sm text-gray-500">Valid Until</span>
                                            <span className="text-sm font-medium text-gray-700">{new Date(student.medicalInfo.insurance.validUntil).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Documents Tab */}
                        {activeTab === 'documents' && (
                            <div className="bg-white rounded-md border border-violet-100 p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-violet-600" />
                                        Student Documents
                                    </h3>
                                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-gradient-to-r from-violet-500 to-violet-700 text-white text-sm hover:opacity-90 transition-all">
                                        <Plus size={14} />
                                        Upload Document
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {student.documents.map((doc) => (
                                        <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                                            <div className="flex items-center gap-3">
                                                <FileText className="w-8 h-8 text-gray-400" />
                                                <div>
                                                    <p className="font-medium text-gray-700">{doc.name}</p>
                                                    <p className="text-xs text-gray-400">{doc.type} • {doc.size} • Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <button className="text-violet-600 hover:text-violet-700 text-sm">Download</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}