// app/(school)/school/students/add/page.jsx
'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft, UserPlus, Upload, Download, FileText, Check, X,
    AlertCircle, CheckCircle, Loader2, Users, GraduationCap,
    User, Mail, Phone, MapPin, Calendar, Heart, AlertTriangle,
    ChevronLeft, ChevronRight, Eye, Trash2, Plus, Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ────────────────────────────────────────────────────────────
// CONSTANTS
// ────────────────────────────────────────────────────────────

const CLASSES = [
    'Nursery', 'LKG', 'UKG',
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'
];

const SECTIONS = ['A', 'B', 'C', 'D'];
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const RELATIONSHIPS = ['Father', 'Mother', 'Guardian', 'Other'];

// ────────────────────────────────────────────────────────────
// MAIN PAGE COMPONENT
// ────────────────────────────────────────────────────────────

export default function AddStudentPage() {
    const router = useRouter();
    const fileInputRef = useRef(null);

    // Mode: 'single' or 'bulk'
    const [mode, setMode] = useState('single');

    // Single Student States
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        gender: 'MALE',
        dateOfBirth: '',
        bloodGroup: '',
        class: '',
        section: '',
        rollNumber: '',
        previousSchool: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        parent1Name: '',
        parent1Relation: 'Father',
        parent1Phone: '',
        parent1Email: '',
        parent1Occupation: '',
        parent2Name: '',
        parent2Relation: 'Mother',
        parent2Phone: '',
        parent2Email: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        emergencyContactRelation: '',
        allergies: '',
        conditions: '',
        medications: '',
        doctorName: '',
        doctorPhone: '',
        emergencyInstructions: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // Bulk Import States
    const [uploadedFile, setUploadedFile] = useState(null);
    const [importStep, setImportStep] = useState('upload'); // upload | validating | preview | importing | complete
    const [csvData, setCsvData] = useState([]);
    const [csvHeaders, setCsvHeaders] = useState([]);
    const [validationErrors, setValidationErrors] = useState([]);
    const [importProgress, setImportProgress] = useState(0);
    const [importResults, setImportResults] = useState(null);
    const [columnMapping, setColumnMapping] = useState({});
    const [showMapping, setShowMapping] = useState(false);

    // ────────────────────────────────────────────────────────
    // SINGLE STUDENT HANDLERS
    // ────────────────────────────────────────────────────────

    const validateStep = (step) => {
        const newErrors = {};

        if (step === 1) {
            if (!formData.firstName.trim()) newErrors.firstName = 'Required';
            if (!formData.lastName.trim()) newErrors.lastName = 'Required';
            if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Required';
        }

        if (step === 2) {
            if (!formData.class) newErrors.class = 'Required';
            if (!formData.section) newErrors.section = 'Required';
        }

        if (step === 3) {
            if (!formData.parent1Name.trim()) newErrors.parent1Name = 'Required';
            if (!formData.parent1Phone.trim()) newErrors.parent1Phone = 'Required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, 4));
        }
    };

    const handlePrevious = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleSingleSubmit = async () => {
        if (!validateStep(currentStep)) return;

        setIsSubmitting(true);
        try {
            // Replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            setSubmitSuccess(true);
            setTimeout(() => {
                router.push('/school/students');
            }, 2000);
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to add student');
        } finally {
            setIsSubmitting(false);
        }
    };

    // ────────────────────────────────────────────────────────
    // BULK IMPORT HANDLERS
    // ────────────────────────────────────────────────────────

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadedFile(file);
        setImportStep('validating');

        // Read CSV file
        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target.result;
            parseCSV(text);
        };
        reader.readAsText(file);
    };

    const parseCSV = (text) => {
        // Simple CSV parser (you can use PapaParse library for better parsing)
        const lines = text.split('\n').filter(line => line.trim());
        if (lines.length < 2) {
            alert('CSV file must have headers and at least one data row');
            setImportStep('upload');
            return;
        }

        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
            const row = {};
            headers.forEach((header, index) => {
                row[header] = values[index] || '';
            });
            data.push(row);
        }

        setCsvHeaders(headers);
        setCsvData(data);

        // Auto-map columns if they match our expected fields
        autoMapColumns(headers);

        // Validate after short delay to show "validating" state
        setTimeout(() => validateCSVData(data, headers), 1000);
    };

    const autoMapColumns = (headers) => {
        const fieldMappings = {
            'firstName': ['firstname', 'first name', 'first_name', 'student name', 'name'],
            'lastName': ['lastname', 'last name', 'last_name', 'surname'],
            'gender': ['gender', 'sex'],
            'dateOfBirth': ['dateofbirth', 'dob', 'birth date', 'birth_date', 'date of birth'],
            'bloodGroup': ['bloodgroup', 'blood group', 'blood_group', 'blood'],
            'class': ['class', 'standard', 'std', 'grade'],
            'section': ['section', 'division', 'div'],
            'rollNumber': ['rollnumber', 'roll number', 'roll_no', 'rollno'],
            'parent1Name': ['parent1name', 'parent name', 'father name', 'mother name', 'parent_name', 'fathername'],
            'parent1Phone': ['parent1phone', 'parent phone', 'phone', 'mobile', 'contact', 'parent_phone', 'fatherphone'],
            'email': ['email', 'e-mail', 'mail'],
            'address': ['address', 'permanent address'],
            'city': ['city', 'town'],
            'state': ['state', 'province'],
            'pincode': ['pincode', 'pin code', 'pin', 'zip', 'zipcode'],
            'previousSchool': ['previousschool', 'previous school', 'prev_school', 'last school'],
        };

        const mapping = {};
        Object.entries(fieldMappings).forEach(([field, possibleNames]) => {
            const found = headers.find(h =>
                possibleNames.includes(h.toLowerCase().replace(/[^a-z0-9]/g, ''))
            );
            if (found) {
                mapping[field] = found;
            }
        });

        setColumnMapping(mapping);
    };

    const validateCSVData = (data, headers) => {
        const errors = [];
        const requiredFields = ['firstName', 'lastName', 'class', 'section', 'parent1Name', 'parent1Phone'];

        data.forEach((row, index) => {
            const rowErrors = [];
            const rowNumber = index + 2; // +2 because row 1 is header, data starts row 2

            requiredFields.forEach(field => {
                const mappedHeader = columnMapping[field];
                if (mappedHeader && !row[mappedHeader]?.trim()) {
                    rowErrors.push(`Missing ${field}`);
                } else if (!mappedHeader && !row[field]?.trim()) {
                    // Try to find field directly
                    const found = Object.keys(row).find(k =>
                        k.toLowerCase().replace(/[^a-z0-9]/g, '') === field.toLowerCase()
                    );
                    if (!found || !row[found]?.trim()) {
                        rowErrors.push(`Missing ${field}`);
                    }
                }
            });

            // Validate gender if present
            const genderField = columnMapping['gender'] || 'gender';
            if (row[genderField] && !['MALE', 'FEMALE', 'OTHER'].includes(row[genderField].toUpperCase())) {
                rowErrors.push(`Invalid gender: ${row[genderField]}`);
            }

            // Validate class if present
            const classField = columnMapping['class'] || 'class';
            if (row[classField] && !CLASSES.includes(row[classField])) {
                rowErrors.push(`Invalid class: ${row[classField]}`);
            }

            if (rowErrors.length > 0) {
                errors.push({
                    row: rowNumber,
                    errors: rowErrors,
                    data: row
                });
            }
        });

        setValidationErrors(errors);
        setImportStep('preview');
    };

    const handleStartImport = async () => {
        setImportStep('importing');

        const totalRecords = csvData.length - validationErrors.length;
        let imported = 0;
        let failed = validationErrors.length;
        const failedRecords = [...validationErrors];

        // Process in batches of 50
        const batchSize = 50;
        const validRecords = csvData.filter((row, index) => {
            return !validationErrors.find(e => e.row === index + 2);
        });

        for (let i = 0; i < validRecords.length; i += batchSize) {
            const batch = validRecords.slice(i, i + batchSize);

            try {
                // Replace with actual API call
                await new Promise(resolve => setTimeout(resolve, 500));

                // Simulate some failures
                if (Math.random() < 0.05) {
                    failed++;
                    failedRecords.push({
                        row: i + 2,
                        errors: ['Database error: Duplicate entry'],
                        data: batch[0]
                    });
                } else {
                    imported += batch.length;
                }
            } catch (error) {
                failed += batch.length;
                batch.forEach((record, idx) => {
                    failedRecords.push({
                        row: i + idx + 2,
                        errors: ['Import failed: ' + error.message],
                        data: record
                    });
                });
            }

            setImportProgress(Math.round(((i + batch.length) / validRecords.length) * 100));
        }

        setImportResults({
            total: csvData.length,
            imported,
            failed,
            failedRecords
        });
        setImportStep('complete');
    };

    const downloadErrorReport = () => {
        if (!importResults?.failedRecords.length) return;

        let csv = 'Row,Errors,Data\n';
        importResults.failedRecords.forEach(record => {
            csv += `${record.row},"${record.errors.join('; ')}","${JSON.stringify(record.data)}"\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'import_errors.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const downloadTemplate = () => {
        const headers = [
            'firstName', 'lastName', 'gender', 'dateOfBirth', 'bloodGroup',
            'class', 'section', 'rollNumber', 'previousSchool',
            'email', 'phone', 'address', 'city', 'state', 'pincode',
            'parent1Name', 'parent1Relation', 'parent1Phone', 'parent1Email', 'parent1Occupation',
            'parent2Name', 'parent2Relation', 'parent2Phone', 'parent2Email',
            'emergencyContactName', 'emergencyContactPhone', 'emergencyContactRelation',
            'allergies', 'conditions', 'medications', 'doctorName', 'doctorPhone', 'emergencyInstructions'
        ];

        const sampleRow = [
            'Aarav', 'Sharma', 'MALE', '2010-05-15', 'O+',
            '10', 'A', '24', 'Delhi Public School',
            'aarav@email.com', '9876543210', '42 Park Street', 'Kolkata', 'West Bengal', '700016',
            'Rajesh Sharma', 'Father', '9876543210', 'rajesh@email.com', 'Businessman',
            'Neha Sharma', 'Mother', '9876543211', 'neha@email.com',
            'Rajesh Sharma', '9876543210', 'Father',
            'Peanuts, Dust', 'Asthma', 'Inhaler', 'Dr. Mehta', '9876543212', 'Use inhaler for asthma'
        ];

        const csv = `${headers.join(',')}\n${sampleRow.join(',')}`;
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'student_import_template.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    // ────────────────────────────────────────────────────────
    // RENDER HELPERS
    // ────────────────────────────────────────────────────────

    const steps = [
        { id: 1, label: 'Personal', icon: User },
        { id: 2, label: 'Academic', icon: GraduationCap },
        { id: 3, label: 'Parents', icon: Users },
        { id: 4, label: 'Medical', icon: Heart }
    ];

    const progress = (currentStep / 4) * 100;

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="p-6">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        href="/school/students"
                        className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors mb-4"
                    >
                        <ArrowLeft size={20} />
                        Back to Students
                    </Link>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Add Students</h1>
                            <p className="text-slate-500 mt-1">Add a single student or import multiple students via CSV</p>
                        </div>
                    </div>
                </div>

                {/* Mode Selector */}
                <div className="bg-white rounded-xl border border-slate-200 p-1 mb-6 inline-flex">
                    <button
                        onClick={() => setMode('single')}
                        className={cn(
                            "px-6 py-2.5 rounded-lg text-sm font-medium transition-all",
                            mode === 'single'
                                ? "bg-blue-600 text-white shadow-sm"
                                : "text-slate-600 hover:bg-slate-100"
                        )}
                    >
                        <UserPlus size={16} className="inline mr-2" />
                        Single Student
                    </button>
                    <button
                        onClick={() => setMode('bulk')}
                        className={cn(
                            "px-6 py-2.5 rounded-lg text-sm font-medium transition-all",
                            mode === 'bulk'
                                ? "bg-blue-600 text-white shadow-sm"
                                : "text-slate-600 hover:bg-slate-100"
                        )}
                    >
                        <Upload size={16} className="inline mr-2" />
                        Bulk Import
                    </button>
                </div>

                {/* ──────────────────────────────────────────────── */}
                {/* SINGLE STUDENT FORM */}
                {/* ──────────────────────────────────────────────── */}
                {mode === 'single' && (
                    <div>
                        {/* Progress Steps */}
                        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
                            <div className="flex items-center justify-between mb-4">
                                {steps.map((step, index) => {
                                    const Icon = step.icon;
                                    const isActive = currentStep === step.id;
                                    const isCompleted = currentStep > step.id;

                                    return (
                                        <div key={step.id} className="flex items-center">
                                            <button
                                                onClick={() => isCompleted && setCurrentStep(step.id)}
                                                className={cn(
                                                    "flex items-center gap-2",
                                                    isActive && "text-blue-600",
                                                    isCompleted && "text-green-600 cursor-pointer",
                                                    !isActive && !isCompleted && "text-slate-400"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-8 h-8 rounded-full flex items-center justify-center",
                                                    isActive && "bg-blue-100",
                                                    isCompleted && "bg-green-100",
                                                    !isActive && !isCompleted && "bg-slate-100"
                                                )}>
                                                    {isCompleted ? <Check size={16} /> : <Icon size={16} />}
                                                </div>
                                                <span className="text-sm font-medium hidden md:block">{step.label}</span>
                                            </button>
                                            {index < steps.length - 1 && (
                                                <div className="w-12 md:w-16 h-0.5 mx-2 bg-slate-200">
                                                    <div
                                                        className="h-full bg-blue-600 transition-all"
                                                        style={{ width: isCompleted ? '100%' : '0%' }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="w-full h-1.5 bg-slate-200 rounded-full">
                                <div
                                    className="h-full bg-blue-600 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>

                        {/* Form Content */}
                        <div className="bg-white rounded-xl border border-slate-200 p-6">
                            {/* Step 1: Personal Information */}
                            {currentStep === 1 && (
                                <div className="space-y-6">
                                    <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                        <User size={20} className="text-blue-600" />
                                        Personal Information
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                First Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.firstName}
                                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                className={cn(
                                                    "w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-100",
                                                    errors.firstName ? "border-red-400" : "border-slate-200 focus:border-blue-400"
                                                )}
                                                placeholder="Enter first name"
                                            />
                                            {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                Last Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.lastName}
                                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                className={cn(
                                                    "w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-100",
                                                    errors.lastName ? "border-red-400" : "border-slate-200 focus:border-blue-400"
                                                )}
                                                placeholder="Enter last name"
                                            />
                                            {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                                            <select
                                                value={formData.gender}
                                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-400"
                                            >
                                                <option value="MALE">Male</option>
                                                <option value="FEMALE">Female</option>
                                                <option value="OTHER">Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                Date of Birth <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                value={formData.dateOfBirth}
                                                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                                className={cn(
                                                    "w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-100",
                                                    errors.dateOfBirth ? "border-red-400" : "border-slate-200 focus:border-blue-400"
                                                )}
                                            />
                                            {errors.dateOfBirth && <p className="text-xs text-red-500 mt-1">{errors.dateOfBirth}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Blood Group</label>
                                            <select
                                                value={formData.bloodGroup}
                                                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                                                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-400"
                                            >
                                                <option value="">Select Blood Group</option>
                                                {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Academic Information */}
                            {currentStep === 2 && (
                                <div className="space-y-6">
                                    <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                        <GraduationCap size={20} className="text-blue-600" />
                                        Academic Information
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                Class <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={formData.class}
                                                onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                                                className={cn(
                                                    "w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-100",
                                                    errors.class ? "border-red-400" : "border-slate-200 focus:border-blue-400"
                                                )}
                                            >
                                                <option value="">Select Class</option>
                                                {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                            {errors.class && <p className="text-xs text-red-500 mt-1">{errors.class}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                Section <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={formData.section}
                                                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                                                className={cn(
                                                    "w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-100",
                                                    errors.section ? "border-red-400" : "border-slate-200 focus:border-blue-400"
                                                )}
                                            >
                                                <option value="">Select Section</option>
                                                {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                            {errors.section && <p className="text-xs text-red-500 mt-1">{errors.section}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Roll Number</label>
                                            <input
                                                type="text"
                                                value={formData.rollNumber}
                                                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                                                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-400"
                                                placeholder="Enter roll number"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Previous School</label>
                                            <input
                                                type="text"
                                                value={formData.previousSchool}
                                                onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
                                                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-400"
                                                placeholder="Previous school name"
                                            />
                                        </div>
                                    </div>

                                    {/* Contact Info */}
                                    <div className="border-t pt-6">
                                        <h3 className="font-medium text-slate-800 mb-4">Contact Information (Optional)</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                                <input
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-400"
                                                    placeholder="student@email.com"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                                                <input
                                                    type="tel"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-400"
                                                    placeholder="Phone number"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                                                <input
                                                    type="text"
                                                    value={formData.address}
                                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-400"
                                                    placeholder="Full address"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                                                <input
                                                    type="text"
                                                    value={formData.city}
                                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-400"
                                                    placeholder="City"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
                                                <input
                                                    type="text"
                                                    value={formData.state}
                                                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-400"
                                                    placeholder="State"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Pincode</label>
                                                <input
                                                    type="text"
                                                    value={formData.pincode}
                                                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-400"
                                                    placeholder="Pincode"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Parent Information */}
                            {currentStep === 3 && (
                                <div className="space-y-6">
                                    <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                        <Users size={20} className="text-blue-600" />
                                        Parent/Guardian Information
                                    </h2>

                                    {/* Parent 1 (Required) */}
                                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                        <h3 className="font-medium text-blue-800 mb-3">Primary Parent/Guardian *</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                                    Name <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.parent1Name}
                                                    onChange={(e) => setFormData({ ...formData, parent1Name: e.target.value })}
                                                    className={cn(
                                                        "w-full px-3 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-blue-100",
                                                        errors.parent1Name ? "border-red-400" : "border-slate-200 focus:border-blue-400"
                                                    )}
                                                    placeholder="Parent name"
                                                />
                                                {errors.parent1Name && <p className="text-xs text-red-500 mt-1">{errors.parent1Name}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Relationship</label>
                                                <select
                                                    value={formData.parent1Relation}
                                                    onChange={(e) => setFormData({ ...formData, parent1Relation: e.target.value })}
                                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-blue-400"
                                                >
                                                    {RELATIONSHIPS.map(r => <option key={r} value={r}>{r}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                                    Phone <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="tel"
                                                    value={formData.parent1Phone}
                                                    onChange={(e) => setFormData({ ...formData, parent1Phone: e.target.value })}
                                                    className={cn(
                                                        "w-full px-3 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-blue-100",
                                                        errors.parent1Phone ? "border-red-400" : "border-slate-200 focus:border-blue-400"
                                                    )}
                                                    placeholder="Phone number"
                                                />
                                                {errors.parent1Phone && <p className="text-xs text-red-500 mt-1">{errors.parent1Phone}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                                <input
                                                    type="email"
                                                    value={formData.parent1Email}
                                                    onChange={(e) => setFormData({ ...formData, parent1Email: e.target.value })}
                                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-blue-400"
                                                    placeholder="parent@email.com"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Occupation</label>
                                                <input
                                                    type="text"
                                                    value={formData.parent1Occupation}
                                                    onChange={(e) => setFormData({ ...formData, parent1Occupation: e.target.value })}
                                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-blue-400"
                                                    placeholder="Occupation"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Parent 2 (Optional) */}
                                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                                        <h3 className="font-medium text-slate-800 mb-3">Second Parent/Guardian (Optional)</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                                                <input
                                                    type="text"
                                                    value={formData.parent2Name}
                                                    onChange={(e) => setFormData({ ...formData, parent2Name: e.target.value })}
                                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-blue-400"
                                                    placeholder="Second parent name"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Relationship</label>
                                                <select
                                                    value={formData.parent2Relation}
                                                    onChange={(e) => setFormData({ ...formData, parent2Relation: e.target.value })}
                                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-blue-400"
                                                >
                                                    {RELATIONSHIPS.map(r => <option key={r} value={r}>{r}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                                                <input
                                                    type="tel"
                                                    value={formData.parent2Phone}
                                                    onChange={(e) => setFormData({ ...formData, parent2Phone: e.target.value })}
                                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-blue-400"
                                                    placeholder="Phone number"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                                <input
                                                    type="email"
                                                    value={formData.parent2Email}
                                                    onChange={(e) => setFormData({ ...formData, parent2Email: e.target.value })}
                                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-blue-400"
                                                    placeholder="parent2@email.com"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Emergency Contact */}
                                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                                        <h3 className="font-medium text-red-800 mb-3">Emergency Contact (Optional)</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                                                <input
                                                    type="text"
                                                    value={formData.emergencyContactName}
                                                    onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-blue-400"
                                                    placeholder="Emergency contact name"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                                                <input
                                                    type="tel"
                                                    value={formData.emergencyContactPhone}
                                                    onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-blue-400"
                                                    placeholder="Emergency phone"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Relationship</label>
                                                <input
                                                    type="text"
                                                    value={formData.emergencyContactRelation}
                                                    onChange={(e) => setFormData({ ...formData, emergencyContactRelation: e.target.value })}
                                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-blue-400"
                                                    placeholder="Relationship"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Medical Information */}
                            {currentStep === 4 && (
                                <div className="space-y-6">
                                    <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                        <Heart size={20} className="text-red-600" />
                                        Medical Information (Optional)
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Allergies</label>
                                            <input
                                                type="text"
                                                value={formData.allergies}
                                                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                                                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-400"
                                                placeholder="e.g., Peanuts, Dust (comma separated)"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Medical Conditions</label>
                                            <input
                                                type="text"
                                                value={formData.conditions}
                                                onChange={(e) => setFormData({ ...formData, conditions: e.target.value })}
                                                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-400"
                                                placeholder="e.g., Asthma, Diabetes"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Medications</label>
                                            <input
                                                type="text"
                                                value={formData.medications}
                                                onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                                                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-400"
                                                placeholder="e.g., Inhaler, Insulin"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Doctor Name</label>
                                            <input
                                                type="text"
                                                value={formData.doctorName}
                                                onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                                                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-400"
                                                placeholder="Family doctor name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Doctor Phone</label>
                                            <input
                                                type="tel"
                                                value={formData.doctorPhone}
                                                onChange={(e) => setFormData({ ...formData, doctorPhone: e.target.value })}
                                                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-400"
                                                placeholder="Doctor phone"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Emergency Instructions</label>
                                            <textarea
                                                value={formData.emergencyInstructions}
                                                onChange={(e) => setFormData({ ...formData, emergencyInstructions: e.target.value })}
                                                rows="2"
                                                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-400 resize-none"
                                                placeholder="What to do in case of emergency..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="flex justify-between mt-8 pt-6 border-t">
                                <button
                                    onClick={handlePrevious}
                                    disabled={currentStep === 1}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft size={16} />
                                    Previous
                                </button>

                                {currentStep < 4 ? (
                                    <button
                                        onClick={handleNext}
                                        className="flex items-center gap-2 px-6 py-2 rounded-lg bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                                    >
                                        Next
                                        <ChevronRight size={16} />
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleSingleSubmit}
                                        disabled={isSubmitting}
                                        className="flex items-center gap-2 px-6 py-2 rounded-lg bg-green-600 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
                                    >
                                        {isSubmitting ? (
                                            <Loader2 size={16} className="animate-spin" />
                                        ) : (
                                            <Check size={16} />
                                        )}
                                        {isSubmitting ? 'Adding Student...' : 'Add Student'}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Success Message */}
                        {submitSuccess && (
                            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <div>
                                    <p className="text-sm font-medium text-green-800">Student Added Successfully!</p>
                                    <p className="text-xs text-green-600">Redirecting to student list...</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ──────────────────────────────────────────────── */}
                {/* BULK IMPORT */}
                {/* ──────────────────────────────────────────────── */}
                {mode === 'bulk' && (
                    <div>
                        {/* Step 1: Upload */}
                        {importStep === 'upload' && (
                            <div className="bg-white rounded-xl border border-slate-200 p-8">
                                <div className="text-center max-w-lg mx-auto">
                                    <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                                        <Upload className="w-10 h-10 text-blue-600" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-slate-800 mb-2">Bulk Import Students</h2>
                                    <p className="text-slate-500 mb-6">
                                        Upload a CSV file with student data. You can import up to 5000 students at once.
                                    </p>

                                    {/* Upload Area */}
                                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 mb-4 hover:border-blue-400 transition-colors">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept=".csv,.xlsx,.xls"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                            id="csv-upload"
                                        />
                                        <label htmlFor="csv-upload" className="cursor-pointer">
                                            <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                                            <p className="text-sm text-slate-600 font-medium">Click to upload CSV file</p>
                                            <p className="text-xs text-slate-400 mt-1">or drag and drop</p>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-center gap-4">
                                        <button
                                            onClick={downloadTemplate}
                                            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                                        >
                                            <Download size={16} />
                                            Download Template
                                        </button>
                                    </div>

                                    {/* Instructions */}
                                    <div className="mt-8 p-4 bg-blue-50 rounded-lg text-left">
                                        <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                                            <Info size={16} />
                                            CSV File Requirements
                                        </h4>
                                        <ul className="text-sm text-blue-700 space-y-1">
                                            <li>• File must be in CSV format</li>
                                            <li>• First row must contain column headers</li>
                                            <li>• Required columns: firstName, lastName, class, section, parent1Name, parent1Phone</li>
                                            <li>• Date format: YYYY-MM-DD (e.g., 2010-05-15)</li>
                                            <li>• Gender must be: MALE, FEMALE, or OTHER</li>
                                            <li>• Maximum 5000 students per file</li>
                                            <li>• Download template for correct format</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Validating */}
                        {importStep === 'validating' && (
                            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                                <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-4" />
                                <h2 className="text-xl font-semibold text-slate-800 mb-2">Validating Data...</h2>
                                <p className="text-slate-500">
                                    Checking {csvData.length} records for errors
                                </p>
                            </div>
                        )}

                        {/* Step 3: Preview */}
                        {importStep === 'preview' && (
                            <div>
                                {/* Summary Card */}
                                <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="text-center p-4 bg-slate-50 rounded-lg">
                                            <p className="text-3xl font-bold text-slate-800">{csvData.length}</p>
                                            <p className="text-sm text-slate-500">Total Records</p>
                                        </div>
                                        <div className="text-center p-4 bg-green-50 rounded-lg">
                                            <p className="text-3xl font-bold text-green-600">
                                                {csvData.length - validationErrors.length}
                                            </p>
                                            <p className="text-sm text-green-500">Valid Records</p>
                                        </div>
                                        <div className="text-center p-4 bg-red-50 rounded-lg">
                                            <p className="text-3xl font-bold text-red-600">{validationErrors.length}</p>
                                            <p className="text-sm text-red-500">Records with Errors</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Data Preview Table */}
                                <div className="bg-white rounded-xl border border-slate-200 mb-6 overflow-hidden">
                                    <div className="p-4 border-b border-slate-200">
                                        <h3 className="font-semibold text-slate-800">Data Preview (First 10 rows)</h3>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-slate-50">
                                                <tr>
                                                    <th className="text-left py-2 px-3 text-xs font-medium text-slate-500">#</th>
                                                    <th className="text-left py-2 px-3 text-xs font-medium text-slate-500">Status</th>
                                                    {csvHeaders.slice(0, 8).map(header => (
                                                        <th key={header} className="text-left py-2 px-3 text-xs font-medium text-slate-500">
                                                            {header}
                                                        </th>
                                                    ))}
                                                    {csvHeaders.length > 8 && (
                                                        <th className="text-left py-2 px-3 text-xs font-medium text-slate-500">...</th>
                                                    )}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {csvData.slice(0, 10).map((row, index) => {
                                                    const hasError = validationErrors.find(e => e.row === index + 2);
                                                    return (
                                                        <tr key={index} className={hasError ? 'bg-red-50' : ''}>
                                                            <td className="py-2 px-3 text-sm text-slate-600">{index + 2}</td>
                                                            <td className="py-2 px-3">
                                                                {hasError ? (
                                                                    <AlertCircle className="w-4 h-4 text-red-500" />
                                                                ) : (
                                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                                )}
                                                            </td>
                                                            {csvHeaders.slice(0, 8).map(header => (
                                                                <td key={header} className="py-2 px-3 text-sm text-slate-600 max-w-[150px] truncate">
                                                                    {row[header]}
                                                                </td>
                                                            ))}
                                                            {csvHeaders.length > 8 && (
                                                                <td className="py-2 px-3 text-sm text-slate-400">+{csvHeaders.length - 8} more</td>
                                                            )}
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Error Details */}
                                {validationErrors.length > 0 && (
                                    <div className="bg-white rounded-xl border border-red-200 p-6 mb-6">
                                        <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                                            <AlertTriangle size={18} />
                                            Validation Errors ({validationErrors.length} rows)
                                        </h3>
                                        <div className="space-y-2 max-h-64 overflow-y-auto">
                                            {validationErrors.slice(0, 20).map((error, idx) => (
                                                <div key={idx} className="p-3 bg-red-50 rounded-lg">
                                                    <p className="text-sm font-medium text-red-700">
                                                        Row {error.row}:
                                                    </p>
                                                    <p className="text-xs text-red-600 mt-1">
                                                        {error.errors.join(', ')}
                                                    </p>
                                                </div>
                                            ))}
                                            {validationErrors.length > 20 && (
                                                <p className="text-sm text-slate-500 text-center">
                                                    ...and {validationErrors.length - 20} more errors
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            setImportStep('upload');
                                            setUploadedFile(null);
                                            setCsvData([]);
                                            setValidationErrors([]);
                                        }}
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleStartImport}
                                        disabled={csvData.length - validationErrors.length === 0}
                                        className="flex items-center gap-2 px-6 py-2 rounded-lg bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <Upload size={16} />
                                        Import {csvData.length - validationErrors.length} Valid Records
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Importing */}
                        {importStep === 'importing' && (
                            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                                <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-4" />
                                <h2 className="text-xl font-semibold text-slate-800 mb-2">Importing Students...</h2>
                                <p className="text-slate-500 mb-4">Please wait, this may take a few minutes</p>

                                <div className="max-w-md mx-auto">
                                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-600 rounded-full transition-all duration-300"
                                            style={{ width: `${importProgress}%` }}
                                        />
                                    </div>
                                    <p className="text-sm text-slate-600 mt-2">{importProgress}% Complete</p>
                                </div>
                            </div>
                        )}

                        {/* Step 5: Complete */}
                        {importStep === 'complete' && importResults && (
                            <div>
                                {/* Success Card */}
                                <div className="bg-white rounded-xl border border-slate-200 p-8 text-center mb-6">
                                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle className="w-10 h-10 text-green-600" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-slate-800 mb-2">Import Complete!</h2>

                                    <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mt-6">
                                        <div className="text-center p-3 bg-slate-50 rounded-lg">
                                            <p className="text-2xl font-bold text-slate-800">{importResults.total}</p>
                                            <p className="text-xs text-slate-500">Total</p>
                                        </div>
                                        <div className="text-center p-3 bg-green-50 rounded-lg">
                                            <p className="text-2xl font-bold text-green-600">{importResults.imported}</p>
                                            <p className="text-xs text-green-500">Imported</p>
                                        </div>
                                        <div className="text-center p-3 bg-red-50 rounded-lg">
                                            <p className="text-2xl font-bold text-red-600">{importResults.failed}</p>
                                            <p className="text-xs text-red-500">Failed</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Failed Records */}
                                {importResults.failedRecords.length > 0 && (
                                    <div className="bg-white rounded-xl border border-red-200 p-6 mb-6">
                                        <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                                            <AlertTriangle size={18} />
                                            Failed Records ({importResults.failedRecords.length})
                                        </h3>
                                        <div className="space-y-2 max-h-48 overflow-y-auto">
                                            {importResults.failedRecords.map((record, idx) => (
                                                <div key={idx} className="p-3 bg-red-50 rounded-lg">
                                                    <p className="text-sm text-red-700">
                                                        Row {record.row}: {record.errors.join(', ')}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => router.push('/school/students')}
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                                    >
                                        View All Students
                                    </button>
                                    {importResults.failedRecords.length > 0 && (
                                        <button
                                            onClick={downloadErrorReport}
                                            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                                        >
                                            <Download size={16} />
                                            Download Error Report
                                        </button>
                                    )}
                                    <button
                                        onClick={() => {
                                            setImportStep('upload');
                                            setUploadedFile(null);
                                            setCsvData([]);
                                            setValidationErrors([]);
                                            setImportResults(null);
                                        }}
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                                    >
                                        Import Another File
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}