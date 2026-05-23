// app/(school)/school/timetable/settings/page.jsx
'use client';

import { useState, useEffect } from 'react';
import {
    School, Clock, Calendar, Users, BookOpen, AlertCircle,
    ChevronRight, Save, Check, X, Edit2, Plus, Minus,
    Building2, GraduationCap, UserCheck, Target, Shield,
    Settings, Sliders, Activity, BarChart3, HelpCircle,
    ChevronDown, ChevronUp, Info, AlertTriangle, CheckCircle,
    Loader2, RefreshCw, Eye, EyeOff
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const PERIODS_PER_DAY = [4, 5, 6, 7, 8, 9, 10];
const PERIOD_DURATIONS = [30, 35, 40, 45, 50, 55, 60];
const CLASS_LEVELS = ['Nursery', 'LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function TimetableSettingsPage() {
    const [activeSection, setActiveSection] = useState('general');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [profile, setProfile] = useState({
        // Section 1: General School Information
        general: {
            schoolName: 'Springdale Public School',
            schoolCode: 'SPR-2024',
            academicYear: '2024-2025',
            term: 'Annual',
        },

        // Section 2: Timetable Structure (HARD CONSTRAINTS)
        structure: {
            workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            periodsPerDay: 7,
            periodDuration: 45, // minutes
            breakDuration: 15,
            lunchDuration: 30,
            startTime: '08:00',
            endTime: '14:30',
            recessTime: '10:30',
            lunchTime: '12:30',
        },

        // Section 3: Teacher Constraints (HARD CONSTRAINTS)
        teacherConstraints: {
            maxClassesPerDay: { min: 3, max: 6, value: 5 },
            maxClassesPerWeek: { min: 15, max: 35, value: 28 },
            maxConsecutiveClasses: { min: 1, max: 4, value: 3 },
            minBreakBetweenClasses: { min: 0, max: 2, value: 1 },
            maxFreePeriodsPerDay: { min: 0, max: 4, value: 2 },
        },

        // Section 4: Class Constraints (HARD CONSTRAINTS)
        classConstraints: {
            maxSubjectsPerDay: { min: 4, max: 8, value: 6 },
            maxTheoryClassesPerDay: { min: 2, max: 5, value: 4 },
            maxPracticalClassesPerDay: { min: 1, max: 3, value: 2 },
            preferredMorningSubjects: ['Mathematics', 'Science', 'English'],
            preferredAfternoonSubjects: ['Arts', 'Physical Education', 'Computer Lab'],
        },

        // Section 5: Subject Constraints (MEDIUM CONSTRAINTS)
        subjectConstraints: {
            subjectPriority: {
                'Mathematics': 5,
                'Science': 5,
                'English': 4,
                'Social Studies': 4,
                'Second Language': 3,
                'Computer Science': 3,
                'Physical Education': 2,
                'Arts': 2,
                'Music': 2,
            },
            minPeriodsPerWeek: { min: 2, max: 8, value: 5 },
            maxPeriodsPerWeek: { min: 3, max: 12, value: 8 },
            labRequired: ['Science', 'Computer Science'],
            specialEquipment: ['Physical Education', 'Arts', 'Music'],
        },

        // Section 6: Room Constraints (HARD CONSTRAINTS)
        roomConstraints: {
            totalClassrooms: { min: 10, max: 50, value: 25 },
            totalLabs: { min: 1, max: 10, value: 3 },
            totalComputerLabs: { min: 1, max: 5, value: 2 },
            totalSportsFacilities: { min: 1, max: 3, value: 2 },
            roomCapacity: { min: 20, max: 60, value: 40 },
        },

        // Section 7: Time Preferences (SOFT CONSTRAINTS)
        timePreferences: {
            morningPreference: ['Mathematics', 'Science', 'English'],
            afternoonPreference: ['Arts', 'Physical Education', 'Music'],
            avoidMondayMorning: ['Physical Education', 'Arts'],
            avoidFridayAfternoon: ['Mathematics', 'Science'],
            preferLabAfterTheory: true,
            balancedLoadAcrossWeek: true,
            specialTimeSlots: [],
        },

        // Section 8: Special Requirements (SOFT CONSTRAINTS)
        specialRequirements: {
            teacherFreeDay: 'Saturday',
            assemblyTime: '08:00',
            assemblyDuration: 15,
            clubActivitiesDay: 'Friday',
            clubActivitiesPeriod: 6,
            remedialClassesDay: 'Thursday',
            remedialClassesPeriod: 7,
        },
    });

    const [errors, setErrors] = useState({});
    const [validationStatus, setValidationStatus] = useState({
        hard: { valid: true, issues: [] },
        medium: { valid: true, issues: [] },
        soft: { valid: true, issues: [] }
    });

    // Validation function
    const validateConstraints = () => {
        const issues = {
            hard: [],
            medium: [],
            soft: []
        };

        // Hard Constraints Validation
        if (profile.structure.periodsPerDay * profile.structure.workingDays.length > 60) {
            issues.hard.push('Total periods per week exceeds 60. Consider reducing periods per day or working days.');
        }

        const totalClassesPerWeek = profile.teacherConstraints.maxClassesPerWeek.value;
        if (totalClassesPerWeek > profile.structure.periodsPerDay * profile.structure.workingDays.length) {
            issues.hard.push(`Teacher's max classes per week (${totalClassesPerWeek}) exceeds total available periods.`);
        }

        if (profile.teacherConstraints.maxClassesPerDay.value > profile.structure.periodsPerDay) {
            issues.hard.push(`Teacher's max classes per day (${profile.teacherConstraints.maxClassesPerDay.value}) exceeds periods per day (${profile.structure.periodsPerDay}).`);
        }

        // Medium Constraints Validation
        if (profile.subjectConstraints.minPeriodsPerWeek.value > profile.subjectConstraints.maxPeriodsPerWeek.value) {
            issues.medium.push('Minimum periods per week cannot be greater than maximum periods per week.');
        }

        // Soft Constraints Validation (warnings only)
        if (profile.timePreferences.morningPreference.length > 3) {
            issues.soft.push('Having too many morning preference subjects may be difficult to schedule.');
        }

        setValidationStatus({
            hard: { valid: issues.hard.length === 0, issues: issues.hard },
            medium: { valid: issues.medium.length === 0, issues: issues.medium },
            soft: { valid: issues.soft.length === 0, issues: issues.soft }
        });

        return issues;
    };

    useEffect(() => {
        validateConstraints();
    }, [profile]);

    const handleSave = async () => {
        const issues = validateConstraints();
        if (issues.hard.length > 0) {
            alert(`Please fix the following hard constraints:\n${issues.hard.join('\n')}`);
            setActiveSection('constraints');
            return;
        }

        setSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        // TODO: Save to API
    };

    const updateRangeValue = (section, field, newValue) => {
        setProfile(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: {
                    ...prev[section][field],
                    value: Math.min(
                        prev[section][field].max,
                        Math.max(prev[section][field].min, newValue)
                    )
                }
            }
        }));
    };

    const sections = [
        { id: 'general', label: 'General Info', icon: School, color: 'blue' },
        { id: 'structure', label: 'Schedule Structure', icon: Clock, color: 'green' },
        { id: 'constraints', label: 'Teacher Constraints', icon: UserCheck, color: 'purple' },
        { id: 'class', label: 'Class Constraints', icon: GraduationCap, color: 'orange' },
        { id: 'subjects', label: 'Subject Rules', icon: BookOpen, color: 'red' },
        { id: 'rooms', label: 'Room Setup', icon: Building2, color: 'teal' },
        { id: 'preferences', label: 'Time Preferences', icon: Target, color: 'indigo' },
        { id: 'special', label: 'Special Rules', icon: Shield, color: 'amber' },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="p-6">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800 mb-1">Timetable Configuration</h1>
                            <p className="text-slate-500">Set up school profile and constraints for timetable generation</p>
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            {saving ? <Loader2 size={18} className="animate-spin" /> : saved ? <Check size={18} /> : <Save size={18} />}
                            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Configuration'}
                        </button>
                    </div>
                </div>

                {/* Validation Status Bar */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className={cn(
                        "p-3 rounded-lg border",
                        validationStatus.hard.valid ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                    )}>
                        <div className="flex items-center gap-2">
                            <Shield size={16} className={validationStatus.hard.valid ? "text-green-600" : "text-red-600"} />
                            <span className="text-sm font-medium">Hard Constraints</span>
                            {validationStatus.hard.valid ? (
                                <CheckCircle size={14} className="text-green-600 ml-auto" />
                            ) : (
                                <AlertCircle size={14} className="text-red-600 ml-auto" />
                            )}
                        </div>
                        <p className="text-xs mt-1 text-slate-600">
                            {validationStatus.hard.valid ? 'All constraints satisfied' : `${validationStatus.hard.issues.length} issues found`}
                        </p>
                    </div>

                    <div className={cn(
                        "p-3 rounded-lg border",
                        validationStatus.medium.valid ? "bg-blue-50 border-blue-200" : "bg-yellow-50 border-yellow-200"
                    )}>
                        <div className="flex items-center gap-2">
                            <Target size={16} className={validationStatus.medium.valid ? "text-blue-600" : "text-yellow-600"} />
                            <span className="text-sm font-medium">Medium Constraints</span>
                            {validationStatus.medium.valid ? (
                                <CheckCircle size={14} className="text-blue-600 ml-auto" />
                            ) : (
                                <AlertCircle size={14} className="text-yellow-600 ml-auto" />
                            )}
                        </div>
                        <p className="text-xs mt-1 text-slate-600">
                            {validationStatus.medium.valid ? 'Optimal settings' : `${validationStatus.medium.issues.length} suggestions`}
                        </p>
                    </div>

                    <div className={cn(
                        "p-3 rounded-lg border",
                        validationStatus.soft.valid ? "bg-purple-50 border-purple-200" : "bg-orange-50 border-orange-200"
                    )}>
                        <div className="flex items-center gap-2">
                            <Activity size={16} className={validationStatus.soft.valid ? "text-purple-600" : "text-orange-600"} />
                            <span className="text-sm font-medium">Soft Constraints</span>
                            <Info size={14} className="text-slate-400 ml-auto" />
                        </div>
                        <p className="text-xs mt-1 text-slate-600">
                            {validationStatus.soft.valid ? 'Flexible preferences set' : `${validationStatus.soft.issues.length} recommendations`}
                        </p>
                    </div>
                </div>

                <div className="flex gap-6">
                    {/* Sidebar Navigation */}
                    <div className="w-64 shrink-0">
                        <div className="bg-white rounded-xl border border-slate-200 sticky top-6">
                            <div className="p-4 border-b border-slate-200">
                                <h3 className="font-semibold text-slate-800">Configuration</h3>
                                <p className="text-xs text-slate-500 mt-1">Set up your timetable rules</p>
                            </div>
                            <div className="p-2">
                                {sections.map((section) => {
                                    const Icon = section.icon;
                                    return (
                                        <button
                                            key={section.id}
                                            onClick={() => setActiveSection(section.id)}
                                            className={cn(
                                                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all mb-1",
                                                activeSection === section.id
                                                    ? `bg-${section.color}-50 text-${section.color}-700`
                                                    : "text-slate-600 hover:bg-slate-50"
                                            )}
                                        >
                                            <Icon size={16} />
                                            {section.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 space-y-6">
                        {/* General Information */}
                        {activeSection === 'general' && (
                            <div className="bg-white rounded-xl border border-slate-200 p-6">
                                <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                    <School size={20} className="text-blue-600" />
                                    General School Information
                                </h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">School Name</label>
                                        <input
                                            type="text"
                                            value={profile.general.schoolName}
                                            onChange={(e) => setProfile(prev => ({
                                                ...prev,
                                                general: { ...prev.general, schoolName: e.target.value }
                                            }))}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-400"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">School Code</label>
                                        <input
                                            type="text"
                                            value={profile.general.schoolCode}
                                            onChange={(e) => setProfile(prev => ({
                                                ...prev,
                                                general: { ...prev.general, schoolCode: e.target.value }
                                            }))}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-400"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Academic Year</label>
                                        <input
                                            type="text"
                                            value={profile.general.academicYear}
                                            onChange={(e) => setProfile(prev => ({
                                                ...prev,
                                                general: { ...prev.general, academicYear: e.target.value }
                                            }))}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-400"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Term</label>
                                        <select
                                            value={profile.general.term}
                                            onChange={(e) => setProfile(prev => ({
                                                ...prev,
                                                general: { ...prev.general, term: e.target.value }
                                            }))}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-400"
                                        >
                                            <option>Annual</option>
                                            <option>Semester 1</option>
                                            <option>Semester 2</option>
                                            <option>Quarter 1</option>
                                            <option>Quarter 2</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Schedule Structure */}
                        {activeSection === 'structure' && (
                            <div className="bg-white rounded-xl border border-slate-200 p-6">
                                <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                    <Clock size={20} className="text-green-600" />
                                    Timetable Structure
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Working Days</label>
                                        <div className="flex flex-wrap gap-2">
                                            {DAYS_OF_WEEK.map(day => (
                                                <button
                                                    key={day}
                                                    onClick={() => {
                                                        const current = profile.structure.workingDays;
                                                        const updated = current.includes(day)
                                                            ? current.filter(d => d !== day)
                                                            : [...current, day];
                                                        setProfile(prev => ({
                                                            ...prev,
                                                            structure: { ...prev.structure, workingDays: updated }
                                                        }));
                                                    }}
                                                    className={cn(
                                                        "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                                                        profile.structure.workingDays.includes(day)
                                                            ? "bg-green-600 text-white"
                                                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                                    )}
                                                >
                                                    {day}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Periods Per Day</label>
                                            <select
                                                value={profile.structure.periodsPerDay}
                                                onChange={(e) => setProfile(prev => ({
                                                    ...prev,
                                                    structure: { ...prev.structure, periodsPerDay: parseInt(e.target.value) }
                                                }))}
                                                className="w-full px-3 py-2 rounded-lg border border-slate-200"
                                            >
                                                {PERIODS_PER_DAY.map(p => <option key={p} value={p}>{p} periods</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Period Duration (minutes)</label>
                                            <select
                                                value={profile.structure.periodDuration}
                                                onChange={(e) => setProfile(prev => ({
                                                    ...prev,
                                                    structure: { ...prev.structure, periodDuration: parseInt(e.target.value) }
                                                }))}
                                                className="w-full px-3 py-2 rounded-lg border border-slate-200"
                                            >
                                                {PERIOD_DURATIONS.map(d => <option key={d} value={d}>{d} minutes</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Start Time</label>
                                            <input
                                                type="time"
                                                value={profile.structure.startTime}
                                                onChange={(e) => setProfile(prev => ({
                                                    ...prev,
                                                    structure: { ...prev.structure, startTime: e.target.value }
                                                }))}
                                                className="w-full px-3 py-2 rounded-lg border border-slate-200"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">End Time</label>
                                            <input
                                                type="time"
                                                value={profile.structure.endTime}
                                                onChange={(e) => setProfile(prev => ({
                                                    ...prev,
                                                    structure: { ...prev.structure, endTime: e.target.value }
                                                }))}
                                                className="w-full px-3 py-2 rounded-lg border border-slate-200"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Break Duration (minutes)</label>
                                            <input
                                                type="number"
                                                value={profile.structure.breakDuration}
                                                onChange={(e) => setProfile(prev => ({
                                                    ...prev,
                                                    structure: { ...prev.structure, breakDuration: parseInt(e.target.value) }
                                                }))}
                                                className="w-full px-3 py-2 rounded-lg border border-slate-200"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Lunch Duration (minutes)</label>
                                            <input
                                                type="number"
                                                value={profile.structure.lunchDuration}
                                                onChange={(e) => setProfile(prev => ({
                                                    ...prev,
                                                    structure: { ...prev.structure, lunchDuration: parseInt(e.target.value) }
                                                }))}
                                                className="w-full px-3 py-2 rounded-lg border border-slate-200"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Teacher Constraints (HARD) */}
                        {activeSection === 'constraints' && (
                            <div className="bg-white rounded-xl border border-slate-200 p-6">
                                <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                    <UserCheck size={20} className="text-purple-600" />
                                    Teacher Constraints (Hard)
                                </h2>
                                <div className="space-y-6">
                                    {Object.entries(profile.teacherConstraints).map(([key, constraint]) => {
                                        const labels = {
                                            maxClassesPerDay: 'Maximum Classes Per Day',
                                            maxClassesPerWeek: 'Maximum Classes Per Week',
                                            maxConsecutiveClasses: 'Maximum Consecutive Classes',
                                            minBreakBetweenClasses: 'Minimum Break Between Classes',
                                            maxFreePeriodsPerDay: 'Maximum Free Periods Per Day'
                                        };

                                        return (
                                            <div key={key} className="space-y-2">
                                                <div className="flex justify-between">
                                                    <label className="text-sm font-medium text-slate-700">{labels[key]}</label>
                                                    <span className="text-sm font-semibold text-blue-600">{constraint.value}</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min={constraint.min}
                                                    max={constraint.max}
                                                    value={constraint.value}
                                                    onChange={(e) => updateRangeValue('teacherConstraints', key, parseInt(e.target.value))}
                                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                                                />
                                                <div className="flex justify-between text-xs text-slate-400">
                                                    <span>Min: {constraint.min}</span>
                                                    <span>Max: {constraint.max}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Class Constraints */}
                        {activeSection === 'class' && (
                            <div className="bg-white rounded-xl border border-slate-200 p-6">
                                <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                    <GraduationCap size={20} className="text-orange-600" />
                                    Class & Subject Constraints
                                </h2>
                                <div className="space-y-6">
                                    {Object.entries(profile.classConstraints).map(([key, constraint]) => {
                                        if (typeof constraint === 'object' && constraint.min !== undefined) {
                                            const labels = {
                                                maxSubjectsPerDay: 'Maximum Subjects Per Day',
                                                maxTheoryClassesPerDay: 'Maximum Theory Classes Per Day',
                                                maxPracticalClassesPerDay: 'Maximum Practical Classes Per Day'
                                            };

                                            return (
                                                <div key={key} className="space-y-2">
                                                    <div className="flex justify-between">
                                                        <label className="text-sm font-medium text-slate-700">{labels[key]}</label>
                                                        <span className="text-sm font-semibold text-blue-600">{constraint.value}</span>
                                                    </div>
                                                    <input
                                                        type="range"
                                                        min={constraint.min}
                                                        max={constraint.max}
                                                        value={constraint.value}
                                                        onChange={(e) => updateRangeValue('classConstraints', key, parseInt(e.target.value))}
                                                        className="w-full h-2 bg-slate-200 rounded-lg"
                                                    />
                                                    <div className="flex justify-between text-xs text-slate-400">
                                                        <span>Min: {constraint.min}</span>
                                                        <span>Max: {constraint.max}</span>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return null;
                                    })}

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Preferred Morning Subjects</label>
                                        <div className="flex flex-wrap gap-2">
                                            {['Mathematics', 'Science', 'English', 'Social Studies', 'Second Language'].map(subj => (
                                                <button
                                                    key={subj}
                                                    onClick={() => {
                                                        const current = profile.classConstraints.preferredMorningSubjects;
                                                        const updated = current.includes(subj)
                                                            ? current.filter(s => s !== subj)
                                                            : [...current, subj];
                                                        setProfile(prev => ({
                                                            ...prev,
                                                            classConstraints: { ...prev.classConstraints, preferredMorningSubjects: updated }
                                                        }));
                                                    }}
                                                    className={cn(
                                                        "px-3 py-1.5 rounded-lg text-sm transition-all",
                                                        profile.classConstraints.preferredMorningSubjects.includes(subj)
                                                            ? "bg-blue-600 text-white"
                                                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                                    )}
                                                >
                                                    {subj}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Subject Rules */}
                        {activeSection === 'subjects' && (
                            <div className="bg-white rounded-xl border border-slate-200 p-6">
                                <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                    <BookOpen size={20} className="text-red-600" />
                                    Subject Period Rules (Medium Constraints)
                                </h2>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <label className="text-sm font-medium text-slate-700">Minimum Periods Per Week</label>
                                            <span className="text-sm font-semibold text-blue-600">{profile.subjectConstraints.minPeriodsPerWeek.value}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min={profile.subjectConstraints.minPeriodsPerWeek.min}
                                            max={profile.subjectConstraints.minPeriodsPerWeek.max}
                                            value={profile.subjectConstraints.minPeriodsPerWeek.value}
                                            onChange={(e) => updateRangeValue('subjectConstraints', 'minPeriodsPerWeek', parseInt(e.target.value))}
                                            className="w-full h-2 bg-slate-200 rounded-lg"
                                        />
                                        <div className="flex justify-between text-xs text-slate-400">
                                            <span>Min: {profile.subjectConstraints.minPeriodsPerWeek.min}</span>
                                            <span>Max: {profile.subjectConstraints.minPeriodsPerWeek.max}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <label className="text-sm font-medium text-slate-700">Maximum Periods Per Week</label>
                                            <span className="text-sm font-semibold text-blue-600">{profile.subjectConstraints.maxPeriodsPerWeek.value}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min={profile.subjectConstraints.maxPeriodsPerWeek.min}
                                            max={profile.subjectConstraints.maxPeriodsPerWeek.max}
                                            value={profile.subjectConstraints.maxPeriodsPerWeek.value}
                                            onChange={(e) => updateRangeValue('subjectConstraints', 'maxPeriodsPerWeek', parseInt(e.target.value))}
                                            className="w-full h-2 bg-slate-200 rounded-lg"
                                        />
                                        <div className="flex justify-between text-xs text-slate-400">
                                            <span>Min: {profile.subjectConstraints.maxPeriodsPerWeek.min}</span>
                                            <span>Max: {profile.subjectConstraints.maxPeriodsPerWeek.max}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Room Setup */}
                        {activeSection === 'rooms' && (
                            <div className="bg-white rounded-xl border border-slate-200 p-6">
                                <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                    <Building2 size={20} className="text-teal-600" />
                                    Room & Facility Setup
                                </h2>
                                <div className="grid grid-cols-2 gap-6">
                                    {Object.entries(profile.roomConstraints).map(([key, constraint]) => {
                                        const labels = {
                                            totalClassrooms: 'Total Classrooms',
                                            totalLabs: 'Total Science Labs',
                                            totalComputerLabs: 'Total Computer Labs',
                                            totalSportsFacilities: 'Total Sports Facilities',
                                            roomCapacity: 'Average Room Capacity'
                                        };

                                        return (
                                            <div key={key} className="space-y-2">
                                                <div className="flex justify-between">
                                                    <label className="text-sm font-medium text-slate-700">{labels[key]}</label>
                                                    <span className="text-sm font-semibold text-blue-600">{constraint.value}</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min={constraint.min}
                                                    max={constraint.max}
                                                    value={constraint.value}
                                                    onChange={(e) => updateRangeValue('roomConstraints', key, parseInt(e.target.value))}
                                                    className="w-full h-2 bg-slate-200 rounded-lg"
                                                />
                                                <div className="flex justify-between text-xs text-slate-400">
                                                    <span>Min: {constraint.min}</span>
                                                    <span>Max: {constraint.max}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Time Preferences (Soft) */}
                        {activeSection === 'preferences' && (
                            <div className="bg-white rounded-xl border border-slate-200 p-6">
                                <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                    <Target size={20} className="text-indigo-600" />
                                    Time Preferences (Soft Constraints)
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Morning Preference Subjects</label>
                                        <div className="flex flex-wrap gap-2">
                                            {['Mathematics', 'Science', 'English', 'Social Studies', 'Computer Science'].map(subj => (
                                                <button
                                                    key={subj}
                                                    onClick={() => {
                                                        const current = profile.timePreferences.morningPreference;
                                                        const updated = current.includes(subj)
                                                            ? current.filter(s => s !== subj)
                                                            : [...current, subj];
                                                        setProfile(prev => ({
                                                            ...prev,
                                                            timePreferences: { ...prev.timePreferences, morningPreference: updated }
                                                        }));
                                                    }}
                                                    className={cn(
                                                        "px-3 py-1.5 rounded-lg text-sm transition-all",
                                                        profile.timePreferences.morningPreference.includes(subj)
                                                            ? "bg-indigo-600 text-white"
                                                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                                    )}
                                                >
                                                    {subj}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Afternoon Preference Subjects</label>
                                        <div className="flex flex-wrap gap-2">
                                            {['Arts', 'Physical Education', 'Music', 'Dance', 'Sports'].map(subj => (
                                                <button
                                                    key={subj}
                                                    onClick={() => {
                                                        const current = profile.timePreferences.afternoonPreference;
                                                        const updated = current.includes(subj)
                                                            ? current.filter(s => s !== subj)
                                                            : [...current, subj];
                                                        setProfile(prev => ({
                                                            ...prev,
                                                            timePreferences: { ...prev.timePreferences, afternoonPreference: updated }
                                                        }));
                                                    }}
                                                    className={cn(
                                                        "px-3 py-1.5 rounded-lg text-sm transition-all",
                                                        profile.timePreferences.afternoonPreference.includes(subj)
                                                            ? "bg-indigo-600 text-white"
                                                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                                    )}
                                                >
                                                    {subj}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                        <div>
                                            <p className="text-sm font-medium text-slate-700">Prefer Lab After Theory</p>
                                            <p className="text-xs text-slate-400">Schedule practical sessions after theory classes</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={profile.timePreferences.preferLabAfterTheory}
                                                onChange={(e) => setProfile(prev => ({
                                                    ...prev,
                                                    timePreferences: { ...prev.timePreferences, preferLabAfterTheory: e.target.checked }
                                                }))}
                                                className="sr-only peer"
                                            />
                                            <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:bg-indigo-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                        <div>
                                            <p className="text-sm font-medium text-slate-700">Balance Load Across Week</p>
                                            <p className="text-xs text-slate-400">Distribute subjects evenly across all days</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={profile.timePreferences.balancedLoadAcrossWeek}
                                                onChange={(e) => setProfile(prev => ({
                                                    ...prev,
                                                    timePreferences: { ...prev.timePreferences, balancedLoadAcrossWeek: e.target.checked }
                                                }))}
                                                className="sr-only peer"
                                            />
                                            <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:bg-indigo-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Special Rules */}
                        {activeSection === 'special' && (
                            <div className="bg-white rounded-xl border border-slate-200 p-6">
                                <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                    <Shield size={20} className="text-amber-600" />
                                    Special Rules & Activities
                                </h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Teacher Free Day</label>
                                        <select
                                            value={profile.specialRequirements.teacherFreeDay}
                                            onChange={(e) => setProfile(prev => ({
                                                ...prev,
                                                specialRequirements: { ...prev.specialRequirements, teacherFreeDay: e.target.value }
                                            }))}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200"
                                        >
                                            {DAYS_OF_WEEK.map(day => <option key={day}>{day}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Assembly Time</label>
                                        <input
                                            type="time"
                                            value={profile.specialRequirements.assemblyTime}
                                            onChange={(e) => setProfile(prev => ({
                                                ...prev,
                                                specialRequirements: { ...prev.specialRequirements, assemblyTime: e.target.value }
                                            }))}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Assembly Duration (minutes)</label>
                                        <input
                                            type="number"
                                            value={profile.specialRequirements.assemblyDuration}
                                            onChange={(e) => setProfile(prev => ({
                                                ...prev,
                                                specialRequirements: { ...prev.specialRequirements, assemblyDuration: parseInt(e.target.value) }
                                            }))}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Club Activities Day</label>
                                        <select
                                            value={profile.specialRequirements.clubActivitiesDay}
                                            onChange={(e) => setProfile(prev => ({
                                                ...prev,
                                                specialRequirements: { ...prev.specialRequirements, clubActivitiesDay: e.target.value }
                                            }))}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200"
                                        >
                                            {DAYS_OF_WEEK.map(day => <option key={day}>{day}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Club Activities Period</label>
                                        <input
                                            type="number"
                                            min={1}
                                            max={profile.structure.periodsPerDay}
                                            value={profile.specialRequirements.clubActivitiesPeriod}
                                            onChange={(e) => setProfile(prev => ({
                                                ...prev,
                                                specialRequirements: { ...prev.specialRequirements, clubActivitiesPeriod: parseInt(e.target.value) }
                                            }))}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Remedial Classes Day</label>
                                        <select
                                            value={profile.specialRequirements.remedialClassesDay}
                                            onChange={(e) => setProfile(prev => ({
                                                ...prev,
                                                specialRequirements: { ...prev.specialRequirements, remedialClassesDay: e.target.value }
                                            }))}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200"
                                        >
                                            {DAYS_OF_WEEK.map(day => <option key={day}>{day}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}