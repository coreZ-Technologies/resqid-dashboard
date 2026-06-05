// app/(school)/school/students/[studentId]/edit/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft, Save, X, User, Mail, Phone, MapPin, Calendar, Heart,
    Users, GraduationCap, School, AlertCircle, Upload, Camera,
    Plus, Minus, Trash2, Check, Loader2, ChevronDown, ChevronUp,
    Stethoscope, Shield, FileText, Activity, BookOpen, Fingerprint
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
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const GENDERS = ['MALE', 'FEMALE', 'OTHER'];
const RELATIONSHIPS = ['Father', 'Mother', 'Guardian', 'Other'];
const STUDENT_STATUSES = ['Active', 'Inactive', 'Graduated', 'Transferred'];
const EMERGENCY_VISIBILITY_OPTIONS = ['PUBLIC', 'MINIMAL', 'HIDDEN'];

// ─────────────────────────────────────────────────────────────────────────────
// EDIT PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function EditStudentPage() {
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeSection, setActiveSection] = useState('personal');
    const [errors, setErrors] = useState({});

    // Form State - Initialize with empty values
    const [formData, setFormData] = useState({
        // Personal Information
        firstName: '',
        lastName: '',
        gender: '',
        dateOfBirth: '',
        bloodGroup: '',
        photo: null,

        // Academic Information
        class: '',
        section: '',
        rollNumber: '',
        admissionYear: '',
        status: 'Active',
        previousSchool: '',
        transferCertificate: false,

        // Contact Information
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',

        // Emergency QR Profile
        emergencyVisibility: 'PUBLIC',

        // Parents/Guardians
        parents: [],

        // Emergency Contacts
        emergencyContacts: [],

        // Medical Information
        medicalInfo: {
            allergies: [],
            conditions: [],
            medications: [],
            doctorName: '',
            doctorSpecialization: '',
            doctorPhone: '',
            doctorClinic: '',
            doctorAddress: '',
            hospitalName: '',
            hospitalPhone: '',
            hospitalAddress: '',
            insuranceProvider: '',
            insurancePolicyNumber: '',
            insuranceValidUntil: '',
            notes: '',
            lastCheckup: '',
            emergencyInstructions: ''
        },

        // Academic Details
        academicInfo: {
            subjects: [],
            achievements: [],
            remarks: ''
        },

        // Documents
        documents: [],

        // Fee Details
        feeDetails: {
            totalFees: 0,
            paid: 0,
            pending: 0,
            lastPayment: '',
            nextDueDate: ''
        }
    });

    // Fetch Student Data
    useEffect(() => {
        fetchStudentData();
    }, [params.studentId]);

    const fetchStudentData = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const mockData = getMockStudentData(params.studentId);
            setFormData(mockData);
        } catch (error) {
            console.error('Error fetching student:', error);
        } finally {
            setLoading(false);
        }
    };

    // Validation
    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName) newErrors.firstName = 'First name is required';
        if (!formData.lastName) newErrors.lastName = 'Last name is required';
        if (!formData.class) newErrors.class = 'Class is required';
        if (!formData.section) newErrors.section = 'Section is required';
        if (formData.parents.length === 0) newErrors.parents = 'At least one parent is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle Save
    const handleSave = async () => {
        if (!validateForm()) {
            alert('Please fix the required fields');
            return;
        }

        setSaving(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            router.push(`/school/students/${params.studentId}`);
            router.refresh();
        } catch (error) {
            console.error('Error saving student:', error);
            alert('Failed to save changes. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    // Handle Cancel
    const handleCancel = () => {
        if (window.confirm('Are you sure you want to cancel? Unsaved changes will be lost.')) {
            router.push(`/school/students/${params.studentId}`);
        }
    };

    // Parent Management
    const addParent = () => {
        setFormData(prev => ({
            ...prev,
            parents: [...prev.parents, {
                id: `new-${Date.now()}`,
                name: '',
                relationship: 'Guardian',
                phone: '',
                email: '',
                occupation: '',
                isPrimary: false,
                canCall: true,
                canWhatsapp: true
            }]
        }));
    };

    const updateParent = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            parents: prev.parents.map((parent, i) =>
                i === index ? { ...parent, [field]: value } : parent
            )
        }));
    };

    const removeParent = (index) => {
        setFormData(prev => ({
            ...prev,
            parents: prev.parents.filter((_, i) => i !== index)
        }));
    };

    // Emergency Contact Management
    const addEmergencyContact = () => {
        setFormData(prev => ({
            ...prev,
            emergencyContacts: [...prev.emergencyContacts, {
                id: `new-${Date.now()}`,
                name: '',
                relationship: '',
                phone: '',
                priority: prev.emergencyContacts.length + 1
            }]
        }));
    };

    const updateEmergencyContact = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            emergencyContacts: prev.emergencyContacts.map((contact, i) =>
                i === index ? { ...contact, [field]: value } : contact
            )
        }));
    };

    const removeEmergencyContact = (index) => {
        setFormData(prev => ({
            ...prev,
            emergencyContacts: prev.emergencyContacts.filter((_, i) => i !== index)
        }));
    };

    // Subject Management
    const addSubject = () => {
        setFormData(prev => ({
            ...prev,
            academicInfo: {
                ...prev.academicInfo,
                subjects: [...prev.academicInfo.subjects, {
                    name: '',
                    code: '',
                    teacher: ''
                }]
            }
        }));
    };

    const updateSubject = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            academicInfo: {
                ...prev.academicInfo,
                subjects: prev.academicInfo.subjects.map((subject, i) =>
                    i === index ? { ...subject, [field]: value } : subject
                )
            }
        }));
    };

    const removeSubject = (index) => {
        setFormData(prev => ({
            ...prev,
            academicInfo: {
                ...prev.academicInfo,
                subjects: prev.academicInfo.subjects.filter((_, i) => i !== index)
            }
        }));
    };

    // Medical Info Array Fields
    const addMedicalArrayItem = (field, value) => {
        if (!value.trim()) return;
        setFormData(prev => ({
            ...prev,
            medicalInfo: {
                ...prev.medicalInfo,
                [field]: [...prev.medicalInfo[field], value.trim()]
            }
        }));
    };

    const removeMedicalArrayItem = (field, index) => {
        setFormData(prev => ({
            ...prev,
            medicalInfo: {
                ...prev.medicalInfo,
                [field]: prev.medicalInfo[field].filter((_, i) => i !== index)
            }
        }));
    };

    // Achievement Management
    const addAchievement = () => {
        setFormData(prev => ({
            ...prev,
            academicInfo: {
                ...prev.academicInfo,
                achievements: [...prev.academicInfo.achievements, '']
            }
        }));
    };

    const updateAchievement = (index, value) => {
        setFormData(prev => ({
            ...prev,
            academicInfo: {
                ...prev.academicInfo,
                achievements: prev.academicInfo.achievements.map((ach, i) =>
                    i === index ? value : ach
                )
            }
        }));
    };

    const removeAchievement = (index) => {
        setFormData(prev => ({
            ...prev,
            academicInfo: {
                ...prev.academicInfo,
                achievements: prev.academicInfo.achievements.filter((_, i) => i !== index)
            }
        }));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-violet-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-violet-600 mx-auto mb-4" />
                    <p className="text-gray-500">Loading student data...</p>
                </div>
            </div>
        );
    }

    // Section Navigation Items
    const sections = [
        { id: 'personal', label: 'Personal Info', icon: User },
        { id: 'academic', label: 'Academic', icon: GraduationCap },
        { id: 'contact', label: 'Contact', icon: Mail },
        { id: 'parents', label: 'Parents', icon: Users },
        { id: 'emergency', label: 'Emergency', icon: AlertCircle },
        { id: 'medical', label: 'Medical', icon: Heart },
        { id: 'fees', label: 'Fees', icon: Activity },
        { id: 'documents', label: 'Documents', icon: FileText },
    ];

    return (
        <div className="min-h-screen bg-violet-50">
            <div className="p-6">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        href={`/school/students/${params.studentId}`}
                        className="flex items-center gap-2 text-gray-600 hover:text-violet-600 transition-colors mb-4"
                    >
                        <ArrowLeft size={20} />
                        Back to Student Details
                    </Link>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Edit Student</h1>
                            <p className="text-gray-500 mt-1">
                                {formData.firstName} {formData.lastName} - {formData.class}-{formData.section}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 rounded-md border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-2"
                            >
                                <X size={16} />
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-6 py-2 rounded-md bg-gradient-to-r from-violet-500 to-violet-700 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                            >
                                {saving ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Save size={16} />
                                )}
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex gap-6">
                    {/* Left Sidebar Navigation */}
                    <div className="w-64 shrink-0">
                        <div className="bg-white rounded-md border border-violet-100 p-2 sticky top-6">
                            {sections.map((section) => {
                                const Icon = section.icon;
                                return (
                                    <button
                                        key={section.id}
                                        onClick={() => setActiveSection(section.id)}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all mb-1",
                                            activeSection === section.id
                                                ? "bg-violet-50 text-violet-700"
                                                : "text-gray-600 hover:bg-gray-50"
                                        )}
                                    >
                                        <Icon size={18} />
                                        {section.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Content Area */}
                    <div className="flex-1 space-y-6">
                        {/* Personal Information Section */}
                        {activeSection === 'personal' && (
                            <div className="bg-white rounded-md border border-violet-100 p-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                                    <User size={20} className="text-violet-600" />
                                    Personal Information
                                </h2>

                                {/* Photo Upload */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Student Photo</label>
                                    <div className="flex items-center gap-4">
                                        <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                                            {formData.photo ? (
                                                <img
                                                    src={typeof formData.photo === 'string' ? formData.photo : URL.createObjectURL(formData.photo)}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <Camera className="w-8 h-8 text-gray-400" />
                                            )}
                                        </div>
                                        <div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setFormData({ ...formData, photo: e.target.files[0] })}
                                                className="hidden"
                                                id="photo-edit"
                                            />
                                            <label
                                                htmlFor="photo-edit"
                                                className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 cursor-pointer"
                                            >
                                                <Upload size={16} />
                                                Change Photo
                                            </label>
                                            <p className="text-xs text-gray-400 mt-1">JPG, PNG (max 2MB)</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            First Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            className={cn(
                                                "w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-violet-100",
                                                errors.firstName ? "border-red-400" : "border-gray-200 focus:border-violet-300"
                                            )}
                                        />
                                        {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Last Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            className={cn(
                                                "w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-violet-100",
                                                errors.lastName ? "border-red-400" : "border-gray-200 focus:border-violet-300"
                                            )}
                                        />
                                        {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                        <select
                                            value={formData.gender}
                                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                            className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-violet-300"
                                        >
                                            {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                        <input
                                            type="date"
                                            value={formData.dateOfBirth}
                                            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                            className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-violet-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                                        <select
                                            value={formData.bloodGroup}
                                            onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                                            className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-violet-300"
                                        >
                                            <option value="">Select Blood Group</option>
                                            {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-violet-300"
                                        >
                                            {STUDENT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Academic Section */}
                        {activeSection === 'academic' && (
                            <div className="space-y-6">
                                <div className="bg-white rounded-md border border-violet-100 p-6">
                                    <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                                        <GraduationCap size={20} className="text-violet-600" />
                                        Academic Information
                                    </h2>

                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Class <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={formData.class}
                                                onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                                                className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-violet-300"
                                            >
                                                <option value="">Select Class</option>
                                                {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Section <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={formData.section}
                                                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                                                className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-violet-300"
                                            >
                                                <option value="">Select Section</option>
                                                {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
                                            <input
                                                type="text"
                                                value={formData.rollNumber}
                                                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                                                className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-violet-300"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Admission Year</label>
                                            <input
                                                type="number"
                                                value={formData.admissionYear}
                                                onChange={(e) => setFormData({ ...formData, admissionYear: e.target.value })}
                                                className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-violet-300"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Previous School</label>
                                            <input
                                                type="text"
                                                value={formData.previousSchool}
                                                onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
                                                className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-violet-300"
                                            />
                                        </div>
                                    </div>

                                    {/* Subjects */}
                                    <div className="border-t border-gray-200 pt-6 mb-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                                <BookOpen size={16} />
                                                Subjects
                                            </h3>
                                            <button
                                                onClick={addSubject}
                                                className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-gradient-to-r from-violet-500 to-violet-700 text-white text-sm hover:opacity-90 transition-all"
                                            >
                                                <Plus size={14} />
                                                Add Subject
                                            </button>
                                        </div>
                                        <div className="space-y-3">
                                            {formData.academicInfo.subjects.map((subject, index) => (
                                                <div key={index} className="flex gap-3 items-start p-3 bg-gray-50 rounded-md">
                                                    <input
                                                        type="text"
                                                        value={subject.name}
                                                        onChange={(e) => updateSubject(index, 'name', e.target.value)}
                                                        placeholder="Subject Name"
                                                        className="flex-1 px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:border-violet-300"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={subject.code}
                                                        onChange={(e) => updateSubject(index, 'code', e.target.value)}
                                                        placeholder="Code"
                                                        className="w-24 px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:border-violet-300"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={subject.teacher}
                                                        onChange={(e) => updateSubject(index, 'teacher', e.target.value)}
                                                        placeholder="Teacher"
                                                        className="flex-1 px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:border-violet-300"
                                                    />
                                                    <button
                                                        onClick={() => removeSubject(index)}
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Achievements */}
                                    <div className="border-t border-gray-200 pt-6 mb-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-semibold text-gray-800">Achievements</h3>
                                            <button
                                                onClick={addAchievement}
                                                className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-gradient-to-r from-violet-500 to-violet-700 text-white text-sm hover:opacity-90 transition-all"
                                            >
                                                <Plus size={14} />
                                                Add Achievement
                                            </button>
                                        </div>
                                        <div className="space-y-2">
                                            {formData.academicInfo.achievements.map((achievement, index) => (
                                                <div key={index} className="flex gap-3 items-center">
                                                    <input
                                                        type="text"
                                                        value={achievement}
                                                        onChange={(e) => updateAchievement(index, e.target.value)}
                                                        placeholder="Enter achievement"
                                                        className="flex-1 px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:border-violet-300"
                                                    />
                                                    <button
                                                        onClick={() => removeAchievement(index)}
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Remarks */}
                                    <div className="border-t border-gray-200 pt-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
                                        <textarea
                                            value={formData.academicInfo.remarks}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                academicInfo: {
                                                    ...formData.academicInfo,
                                                    remarks: e.target.value
                                                }
                                            })}
                                            rows="3"
                                            className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:border-violet-300 resize-none"
                                            placeholder="Enter any remarks..."
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Contact Information Section */}
                        {activeSection === 'contact' && (
                            <div className="bg-white rounded-md border border-violet-100 p-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                                    <Mail size={20} className="text-violet-600" />
                                    Contact Information
                                </h2>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-violet-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-violet-300"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                        <textarea
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            rows="2"
                                            className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-violet-300 resize-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                        <input
                                            type="text"
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-violet-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                        <input
                                            type="text"
                                            value={formData.state}
                                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                            className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-violet-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                                        <input
                                            type="text"
                                            value={formData.pincode}
                                            onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                                            className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-violet-300"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Parents Section */}
                        {activeSection === 'parents' && (
                            <div className="bg-white rounded-md border border-violet-100 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                        <Users size={20} className="text-violet-600" />
                                        Parents & Guardians
                                    </h2>
                                    <button
                                        onClick={addParent}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-gradient-to-r from-violet-500 to-violet-700 text-white text-sm hover:opacity-90 transition-all"
                                    >
                                        <Plus size={14} />
                                        Add Parent
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {formData.parents.map((parent, index) => (
                                        <div key={parent.id || index} className="p-4 bg-gray-50 rounded-md border border-gray-200">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="font-medium text-gray-700">Parent #{index + 1}</h3>
                                                <button
                                                    onClick={() => removeParent(index)}
                                                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                                                    <input
                                                        type="text"
                                                        value={parent.name}
                                                        onChange={(e) => updateParent(index, 'name', e.target.value)}
                                                        className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:border-violet-300"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">Relationship</label>
                                                    <select
                                                        value={parent.relationship}
                                                        onChange={(e) => updateParent(index, 'relationship', e.target.value)}
                                                        className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:border-violet-300"
                                                    >
                                                        {RELATIONSHIPS.map(r => <option key={r} value={r}>{r}</option>)}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
                                                    <input
                                                        type="tel"
                                                        value={parent.phone}
                                                        onChange={(e) => updateParent(index, 'phone', e.target.value)}
                                                        className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:border-violet-300"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                                                    <input
                                                        type="email"
                                                        value={parent.email}
                                                        onChange={(e) => updateParent(index, 'email', e.target.value)}
                                                        className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:border-violet-300"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">Occupation</label>
                                                    <input
                                                        type="text"
                                                        value={parent.occupation}
                                                        onChange={(e) => updateParent(index, 'occupation', e.target.value)}
                                                        className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:border-violet-300"
                                                    />
                                                </div>
                                                <div className="flex items-center gap-4 pt-4">
                                                    <label className="flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={parent.isPrimary}
                                                            onChange={(e) => updateParent(index, 'isPrimary', e.target.checked)}
                                                            className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                                                        />
                                                        <span className="text-sm text-gray-600">Primary Contact</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {formData.parents.length === 0 && (
                                        <p className="text-center text-gray-400 py-8">No parents added yet</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Emergency Contacts Section */}
                        {activeSection === 'emergency' && (
                            <div className="space-y-6">
                                <div className="bg-white rounded-md border border-violet-100 p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                            <AlertCircle size={20} className="text-rose-600" />
                                            Emergency Contacts
                                        </h2>
                                        <button
                                            onClick={addEmergencyContact}
                                            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-gradient-to-r from-violet-500 to-violet-700 text-white text-sm hover:opacity-90 transition-all"
                                        >
                                            <Plus size={14} />
                                            Add Contact
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {formData.emergencyContacts.map((contact, index) => (
                                            <div key={contact.id || index} className="p-4 bg-gray-50 rounded-md">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h3 className="font-medium text-gray-700">Contact #{index + 1}</h3>
                                                    <button
                                                        onClick={() => removeEmergencyContact(index)}
                                                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                                                        <input
                                                            type="text"
                                                            value={contact.name}
                                                            onChange={(e) => updateEmergencyContact(index, 'name', e.target.value)}
                                                            className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:border-violet-300"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-600 mb-1">Relationship</label>
                                                        <input
                                                            type="text"
                                                            value={contact.relationship}
                                                            onChange={(e) => updateEmergencyContact(index, 'relationship', e.target.value)}
                                                            className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:border-violet-300"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
                                                        <input
                                                            type="tel"
                                                            value={contact.phone}
                                                            onChange={(e) => updateEmergencyContact(index, 'phone', e.target.value)}
                                                            className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:border-violet-300"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-600 mb-1">Priority</label>
                                                        <input
                                                            type="number"
                                                            value={contact.priority}
                                                            onChange={(e) => updateEmergencyContact(index, 'priority', parseInt(e.target.value))}
                                                            className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:border-violet-300"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {formData.emergencyContacts.length === 0 && (
                                            <p className="text-center text-gray-400 py-8">No emergency contacts added</p>
                                        )}
                                    </div>
                                </div>

                                {/* Emergency Visibility */}
                                <div className="bg-white rounded-md border border-violet-100 p-6">
                                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <Shield size={16} className="text-rose-600" />
                                        Emergency QR Profile Visibility
                                    </h3>
                                    <select
                                        value={formData.emergencyVisibility}
                                        onChange={(e) => setFormData({ ...formData, emergencyVisibility: e.target.value })}
                                        className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-violet-300"
                                    >
                                        <option value="PUBLIC">Full Visibility</option>
                                        <option value="MINIMAL">Minimal Profile</option>
                                        <option value="HIDDEN">Hidden</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* Medical Section */}
                        {activeSection === 'medical' && (
                            <div className="space-y-6">
                                <div className="bg-white rounded-md border border-violet-100 p-6">
                                    <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                                        <Heart size={20} className="text-rose-600" />
                                        Medical Information
                                    </h2>

                                    {/* Array Fields (Allergies, Conditions, Medications) */}
                                    {['allergies', 'conditions', 'medications'].map((field) => (
                                        <div key={field} className="mb-6">
                                            <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                                                {field}
                                            </label>
                                            <div className="flex gap-2 mb-2">
                                                <input
                                                    type="text"
                                                    id={`medical-${field}-input`}
                                                    placeholder={`Add ${field.slice(0, -1)}...`}
                                                    className="flex-1 px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:border-violet-300"
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            addMedicalArrayItem(field, e.target.value);
                                                            e.target.value = '';
                                                        }
                                                    }}
                                                />
                                                <button
                                                    onClick={() => {
                                                        const input = document.getElementById(`medical-${field}-input`);
                                                        if (input) {
                                                            addMedicalArrayItem(field, input.value);
                                                            input.value = '';
                                                        }
                                                    }}
                                                    className="px-3 py-2 rounded-md bg-gradient-to-r from-violet-500 to-violet-700 text-white text-sm hover:opacity-90 transition-all"
                                                >
                                                    Add
                                                </button>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {formData.medicalInfo[field].map((item, index) => (
                                                    <span key={index} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 text-rose-700 text-sm border border-rose-200">
                                                        {item}
                                                        <button
                                                            onClick={() => removeMedicalArrayItem(field, index)}
                                                            className="hover:text-rose-900"
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Doctor Information */}
                                <div className="bg-white rounded-md border border-violet-100 p-6">
                                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <Stethoscope size={16} />
                                        Doctor Information
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Doctor Name</label>
                                            <input
                                                type="text"
                                                value={formData.medicalInfo.doctorName}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    medicalInfo: { ...formData.medicalInfo, doctorName: e.target.value }
                                                })}
                                                className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:border-violet-300"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Specialization</label>
                                            <input
                                                type="text"
                                                value={formData.medicalInfo.doctorSpecialization}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    medicalInfo: { ...formData.medicalInfo, doctorSpecialization: e.target.value }
                                                })}
                                                className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:border-violet-300"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
                                            <input
                                                type="tel"
                                                value={formData.medicalInfo.doctorPhone}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    medicalInfo: { ...formData.medicalInfo, doctorPhone: e.target.value }
                                                })}
                                                className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:border-violet-300"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Clinic</label>
                                            <input
                                                type="text"
                                                value={formData.medicalInfo.doctorClinic}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    medicalInfo: { ...formData.medicalInfo, doctorClinic: e.target.value }
                                                })}
                                                className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:border-violet-300"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Hospital Information */}
                                <div className="bg-white rounded-md border border-violet-100 p-6">
                                    <h3 className="font-semibold text-gray-800 mb-4">Hospital Information</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Hospital Name</label>
                                            <input
                                                type="text"
                                                value={formData.medicalInfo.hospitalName}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    medicalInfo: { ...formData.medicalInfo, hospitalName: e.target.value }
                                                })}
                                                className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:border-violet-300"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
                                            <input
                                                type="tel"
                                                value={formData.medicalInfo.hospitalPhone}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    medicalInfo: { ...formData.medicalInfo, hospitalPhone: e.target.value }
                                                })}
                                                className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:border-violet-300"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Insurance Information */}
                                <div className="bg-white rounded-md border border-violet-100 p-6">
                                    <h3 className="font-semibold text-gray-800 mb-4">Insurance Details</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Provider</label>
                                            <input
                                                type="text"
                                                value={formData.medicalInfo.insuranceProvider}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    medicalInfo: { ...formData.medicalInfo, insuranceProvider: e.target.value }
                                                })}
                                                className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:border-violet-300"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Policy Number</label>
                                            <input
                                                type="text"
                                                value={formData.medicalInfo.insurancePolicyNumber}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    medicalInfo: { ...formData.medicalInfo, insurancePolicyNumber: e.target.value }
                                                })}
                                                className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:border-violet-300"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Valid Until</label>
                                            <input
                                                type="date"
                                                value={formData.medicalInfo.insuranceValidUntil}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    medicalInfo: { ...formData.medicalInfo, insuranceValidUntil: e.target.value }
                                                })}
                                                className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:border-violet-300"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Notes */}
                                <div className="bg-white rounded-md border border-violet-100 p-6">
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Instructions</label>
                                        <textarea
                                            value={formData.medicalInfo.emergencyInstructions}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                medicalInfo: { ...formData.medicalInfo, emergencyInstructions: e.target.value }
                                            })}
                                            rows="3"
                                            className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:border-violet-300 resize-none"
                                            placeholder="Enter emergency instructions..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Medical Notes</label>
                                        <textarea
                                            value={formData.medicalInfo.notes}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                medicalInfo: { ...formData.medicalInfo, notes: e.target.value }
                                            })}
                                            rows="3"
                                            className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:border-violet-300 resize-none"
                                            placeholder="Additional medical notes..."
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Fees Section */}
                        {activeSection === 'fees' && (
                            <div className="bg-white rounded-md border border-violet-100 p-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                                    <Activity size={20} className="text-violet-600" />
                                    Fee Details
                                </h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Total Fees</label>
                                        <input
                                            type="number"
                                            value={formData.feeDetails.totalFees}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                feeDetails: { ...formData.feeDetails, totalFees: parseFloat(e.target.value) }
                                            })}
                                            className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-violet-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Paid Amount</label>
                                        <input
                                            type="number"
                                            value={formData.feeDetails.paid}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                feeDetails: { ...formData.feeDetails, paid: parseFloat(e.target.value) }
                                            })}
                                            className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-violet-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Pending Amount</label>
                                        <input
                                            type="number"
                                            value={formData.feeDetails.pending}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                feeDetails: { ...formData.feeDetails, pending: parseFloat(e.target.value) }
                                            })}
                                            className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-violet-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Payment Date</label>
                                        <input
                                            type="date"
                                            value={formData.feeDetails.lastPayment}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                feeDetails: { ...formData.feeDetails, lastPayment: e.target.value }
                                            })}
                                            className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-violet-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Next Due Date</label>
                                        <input
                                            type="date"
                                            value={formData.feeDetails.nextDueDate}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                feeDetails: { ...formData.feeDetails, nextDueDate: e.target.value }
                                            })}
                                            className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-violet-300"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Documents Section */}
                        {activeSection === 'documents' && (
                            <div className="bg-white rounded-md border border-violet-100 p-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                                    <FileText size={20} className="text-violet-600" />
                                    Documents
                                </h2>
                                <div className="space-y-3">
                                    {formData.documents.map((doc, index) => (
                                        <div key={doc.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                                            <div className="flex items-center gap-3">
                                                <FileText className="w-8 h-8 text-gray-400" />
                                                <div>
                                                    <p className="font-medium text-gray-700">{doc.name}</p>
                                                    <p className="text-xs text-gray-400">{doc.type} • {doc.size}</p>
                                                </div>
                                            </div>
                                            <button className="px-3 py-1.5 text-sm text-violet-600 hover:bg-violet-50 rounded-md transition-colors">
                                                Download
                                            </button>
                                        </div>
                                    ))}
                                    {formData.documents.length === 0 && (
                                        <p className="text-center text-gray-400 py-8">No documents uploaded</p>
                                    )}
                                </div>
                                <button className="mt-4 flex items-center gap-2 px-4 py-2 rounded-md border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                                    <Upload size={16} />
                                    Upload Document
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA (Replace with actual API call)
// ─────────────────────────────────────────────────────────────────────────────

function getMockStudentData(id) {
    return {
        firstName: 'Aarav',
        lastName: 'Sharma',
        gender: 'MALE',
        dateOfBirth: '2010-05-15',
        bloodGroup: 'O+',
        photo: null,
        class: '10',
        section: 'A',
        rollNumber: '24',
        admissionYear: '2024',
        status: 'Active',
        previousSchool: 'Delhi Public School',
        transferCertificate: true,
        email: 'aarav.sharma@school.edu.in',
        phone: '+91 98765 43210',
        address: '42, Park Street, Kolkata',
        city: 'Kolkata',
        state: 'West Bengal',
        pincode: '700016',
        emergencyVisibility: 'PUBLIC',
        parents: [
            {
                id: 'parent1',
                name: 'Rajesh Sharma',
                relationship: 'Father',
                phone: '+91 98765 43210',
                email: 'rajesh@example.com',
                occupation: 'Businessman',
                isPrimary: true,
                canCall: true,
                canWhatsapp: true
            },
            {
                id: 'parent2',
                name: 'Neha Sharma',
                relationship: 'Mother',
                phone: '+91 98765 43211',
                email: 'neha@example.com',
                occupation: 'Teacher',
                isPrimary: false,
                canCall: true,
                canWhatsapp: true
            }
        ],
        emergencyContacts: [
            {
                id: 'emergency1',
                name: 'Rajesh Sharma',
                relationship: 'Father',
                phone: '+91 98765 43210',
                priority: 1
            }
        ],
        medicalInfo: {
            allergies: ['Peanuts', 'Dust Mites'],
            conditions: ['Asthma'],
            medications: ['Inhaler'],
            doctorName: 'Dr. Anjali Mehta',
            doctorSpecialization: 'Pediatrician',
            doctorPhone: '+91 98765 43213',
            doctorClinic: 'Mehta Child Care Clinic',
            doctorAddress: '15, Lake View Road, Kolkata',
            hospitalName: 'Apollo Gleneagles Hospital',
            hospitalPhone: '+91 33 2320 3040',
            hospitalAddress: '58, Canal Circular Road, Kolkata',
            insuranceProvider: 'Star Health Insurance',
            insurancePolicyNumber: 'SHI/2024/123456',
            insuranceValidUntil: '2026-12-31',
            notes: 'Student has mild asthma.',
            lastCheckup: '2024-10-15',
            emergencyInstructions: 'Use inhaler for asthma attacks.'
        },
        academicInfo: {
            subjects: [
                { name: 'Mathematics', code: 'MAT101', teacher: 'Mr. Sharma' },
                { name: 'Science', code: 'SCI101', teacher: 'Ms. Gupta' },
                { name: 'English', code: 'ENG101', teacher: 'Mrs. Singh' }
            ],
            achievements: [
                '1st Prize in Science Fair 2024',
                'School Cricket Team Captain'
            ],
            remarks: 'Excellent academic performance.'
        },
        documents: [
            { id: 'doc1', name: 'Birth Certificate', type: 'PDF', size: '1.2 MB', uploadedAt: '2024-01-20' },
            { id: 'doc2', name: 'Transfer Certificate', type: 'PDF', size: '0.8 MB', uploadedAt: '2024-01-20' }
        ],
        feeDetails: {
            totalFees: 85000,
            paid: 75000,
            pending: 10000,
            lastPayment: '2024-12-05',
            nextDueDate: '2025-01-15'
        }
    };
}