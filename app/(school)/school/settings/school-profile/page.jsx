'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
    School, Clock, Calendar, Users, BookOpen, AlertCircle,
    Save, Check, X, Plus, Minus,
    Building2, GraduationCap, UserCheck, Target, Shield,
    Settings, Sliders, Activity, BarChart3,
    ChevronDown, Info, AlertTriangle, CheckCircle,
    Loader2, RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const PERIODS_PER_DAY_OPTIONS = [4, 5, 6, 7, 8, 9, 10];
const PERIOD_DURATION_OPTIONS = [30, 35, 40, 45, 50, 55, 60];

const ALL_SUBJECTS = [
    'Mathematics', 'Science', 'Physics', 'Chemistry', 'Biology',
    'English', 'Hindi', 'Sanskrit', 'Social Studies',
    'Computer Science', 'Physical Education', 'Arts', 'Music',
    'Economics', 'Business Studies',
];

const DEFAULT_PROFILE = {
    general: {
        schoolName: 'Springdale Public School',
        schoolCode: 'SPR-2024',
        academicYear: '2024-2025',
        term: 'Annual',
    },
    structure: {
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        periodsPerDay: 7,
        periodDuration: 45,
        breakDuration: 15,
        lunchDuration: 30,
        startTime: '08:00',
        endTime: '14:30',
        recessTime: '10:30',
        lunchTime: '12:30',
    },
    teacherConstraints: {
        maxClassesPerDay: { min: 3, max: 8, value: 5 },
        maxClassesPerWeek: { min: 15, max: 35, value: 28 },
        maxConsecutiveClasses: { min: 1, max: 4, value: 3 },
        minBreakBetweenClasses: { min: 0, max: 2, value: 1 },
        maxFreePeriodsPerDay: { min: 0, max: 4, value: 2 },
    },
    classConstraints: {
        maxSubjectsPerDay: { min: 4, max: 8, value: 6 },
        maxTheoryClassesPerDay: { min: 2, max: 5, value: 4 },
        maxPracticalClassesPerDay: { min: 1, max: 3, value: 2 },
        preferredMorningSubjects: ['Mathematics', 'Science', 'English'],
        preferredAfternoonSubjects: ['Arts', 'Physical Education', 'Computer Science'],
    },
    subjectConstraints: {
        minPeriodsPerWeek: { min: 2, max: 8, value: 5 },
        maxPeriodsPerWeek: { min: 3, max: 12, value: 8 },
        subjectPriority: {
            'Mathematics': 5,
            'Science': 5,
            'English': 4,
            'Social Studies': 4,
            'Computer Science': 3,
            'Physical Education': 2,
            'Arts': 2,
            'Music': 2,
        },
        labRequired: ['Science', 'Physics', 'Chemistry', 'Biology', 'Computer Science'],
        specialEquipment: ['Physical Education', 'Arts', 'Music'],
    },
    roomConstraints: {
        totalClassrooms: { min: 10, max: 50, value: 25 },
        totalLabs: { min: 1, max: 10, value: 3 },
        totalComputerLabs: { min: 1, max: 5, value: 2 },
        totalSportsFacilities: { min: 1, max: 3, value: 2 },
        roomCapacity: { min: 20, max: 60, value: 40 },
    },
    timePreferences: {
        morningPreference: ['Mathematics', 'Science', 'English'],
        afternoonPreference: ['Arts', 'Physical Education', 'Music'],
        avoidMondayMorning: ['Physical Education', 'Arts'],
        avoidFridayAfternoon: ['Mathematics', 'Science'],
        preferLabAfterTheory: true,
        balancedLoadAcrossWeek: true,
    },
    specialRequirements: {
        teacherFreeDay: 'Saturday',
        assemblyTime: '08:00',
        assemblyDuration: 15,
        clubActivitiesDay: 'Friday',
        clubActivitiesPeriod: 6,
        remedialClassesDay: 'Thursday',
        remedialClassesPeriod: 7,
    },
};

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION (pure function)
// ─────────────────────────────────────────────────────────────────────────────

function runValidation(p) {
    const hard = [];
    const medium = [];
    const soft = [];

    const totalPeriodsWeek = p.structure.periodsPerDay * p.structure.workingDays.length;

    if (totalPeriodsWeek > 60)
        hard.push(`Total periods/week (${totalPeriodsWeek}) exceeds 60. Reduce periods/day or working days.`);

    if (p.teacherConstraints.maxClassesPerWeek.value > totalPeriodsWeek)
        hard.push(`Max classes/week (${p.teacherConstraints.maxClassesPerWeek.value}) exceeds total available periods (${totalPeriodsWeek}).`);

    if (p.teacherConstraints.maxClassesPerDay.value > p.structure.periodsPerDay)
        hard.push(`Max classes/day (${p.teacherConstraints.maxClassesPerDay.value}) exceeds periods/day (${p.structure.periodsPerDay}).`);

    if (p.structure.workingDays.length < 1)
        hard.push('At least one working day must be selected.');

    if (p.subjectConstraints.minPeriodsPerWeek.value > p.subjectConstraints.maxPeriodsPerWeek.value)
        medium.push('Min periods/week cannot exceed max periods/week.');

    if (p.classConstraints.maxTheoryClassesPerDay.value + p.classConstraints.maxPracticalClassesPerDay.value > p.structure.periodsPerDay)
        medium.push('Theory + Practical max per day exceeds total periods/day.');

    if (p.timePreferences.morningPreference.length > 4)
        soft.push('Too many morning preference subjects may reduce scheduling flexibility.');

    if (p.specialRequirements.clubActivitiesPeriod > p.structure.periodsPerDay)
        soft.push(`Club activities period (${p.specialRequirements.clubActivitiesPeriod}) exceeds periods/day (${p.structure.periodsPerDay}).`);

    if (p.specialRequirements.remedialClassesPeriod > p.structure.periodsPerDay)
        soft.push(`Remedial classes period (${p.specialRequirements.remedialClassesPeriod}) exceeds periods/day.`);

    return { hard, medium, soft };
}

// ─────────────────────────────────────────────────────────────────────────────
// SMALL SHARED COMPONENTS (Notion style)
// ─────────────────────────────────────────────────────────────────────────────

function SectionHeader({ icon: Icon, iconClass, title, badge }) {
    return (
        <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-200">
            <div className={cn('w-8 h-8 rounded-md flex items-center justify-center bg-gray-100', iconClass)}>
                <Icon size={16} className="text-gray-600" />
            </div>
            <div>
                <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
                {badge && <span className="text-[10px] text-gray-500">{badge}</span>}
            </div>
        </div>
    );
}

function FieldLabel({ children, hint }) {
    return (
        <div className="flex items-center gap-1.5 mb-1">
            <label className="text-xs font-medium text-gray-700">{children}</label>
            {hint && (
                <span className="group relative">
                    <Info size={11} className="text-gray-300 cursor-help" />
                    <span className="absolute z-10 left-5 top-0 w-48 bg-gray-800 text-white text-[10px] rounded-md px-2 py-1.5 hidden group-hover:block shadow-md">
                        {hint}
                    </span>
                </span>
            )}
        </div>
    );
}

function StyledInput({ className, ...props }) {
    return (
        <input
            className={cn(
                'w-full px-3 py-2 rounded-md border border-gray-200 bg-white text-sm text-gray-800',
                'focus:outline-none focus:ring-1 focus:ring-violet-400 focus:border-violet-400',
                'placeholder:text-gray-300',
                className
            )}
            {...props}
        />
    );
}

function StyledSelect({ className, children, ...props }) {
    return (
        <select
            className={cn(
                'w-full px-3 py-2 rounded-md border border-gray-200 bg-white text-sm text-gray-800',
                'focus:outline-none focus:ring-1 focus:ring-violet-400 focus:border-violet-400',
                className
            )}
            {...props}
        >
            {children}
        </select>
    );
}

function RangeControl({ label, hint, value, min, max, onChange, unit = '', accentClass = 'accent-violet-500' }) {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <FieldLabel hint={hint}>{label}</FieldLabel>
                <span className="text-xs font-semibold text-gray-800 tabular-nums">{value}{unit}</span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={e => onChange(parseInt(e.target.value))}
                className={cn('w-full h-1 rounded-full appearance-none cursor-pointer bg-gray-200', accentClass)}
            />
            <div className="flex justify-between text-[10px] text-gray-400">
                <span>{min}</span>
                <span className="text-gray-300">──────────────</span>
                <span>{max}</span>
            </div>
        </div>
    );
}

function TogglePill({ label, active, onClick, activeClass = 'bg-violet-600 text-white' }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                'px-2.5 py-1 rounded-md text-xs font-medium transition-all border',
                active
                    ? cn(activeClass, 'border-transparent')
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            )}
        >
            {label}
        </button>
    );
}

function Toggle({ checked, onChange }) {
    return (
        <div
            onClick={() => onChange(!checked)}
            className={cn(
                'w-9 h-5 rounded-full relative cursor-pointer transition-colors shrink-0',
                checked ? 'bg-violet-600' : 'bg-gray-200'
            )}
            style={{ height: 20, width: 36 }}
        >
            <div className={cn(
                'w-3.5 h-3.5 bg-white rounded-full absolute top-[3px] shadow-sm transition-transform',
                checked ? 'translate-x-[18px]' : 'translate-x-[3px]'
            )} />
        </div>
    );
}

function ToggleRow({ label, description, checked, onChange }) {
    return (
        <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
            <div className="pr-4">
                <p className="text-xs font-medium text-gray-700">{label}</p>
                {description && <p className="text-[10px] text-gray-500 mt-0.5">{description}</p>}
            </div>
            <Toggle checked={checked} onChange={onChange} />
        </div>
    );
}

function IssueList({ issues, severity }) {
    if (!issues?.length) return null;
    const styles = {
        hard: { bg: 'bg-rose-50', border: 'border-rose-100', text: 'text-rose-700', icon: <X size={11} className="text-rose-500 shrink-0 mt-0.5" /> },
        medium: { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-700', icon: <AlertCircle size={11} className="text-amber-500 shrink-0 mt-0.5" /> },
        soft: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', icon: <Info size={11} className="text-gray-400 shrink-0 mt-0.5" /> },
    }[severity];

    return (
        <div className="space-y-1 mt-2">
            {issues.map((issue, i) => (
                <div key={i} className={cn('flex items-start gap-1.5 p-2 rounded-md border text-[10px]', styles.bg, styles.border, styles.text)}>
                    {styles.icon}
                    {issue}
                </div>
            ))}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION COMPONENTS (Notion style)
// ─────────────────────────────────────────────────────────────────────────────

function GeneralSection({ data, onChange }) {
    const set = (key, val) => onChange({ ...data, [key]: val });
    return (
        <div>
            <SectionHeader icon={School} iconClass="text-violet-600" title="General School Information" badge="Basic setup" />
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <FieldLabel>School Name</FieldLabel>
                    <StyledInput value={data.schoolName} onChange={e => set('schoolName', e.target.value)} placeholder="e.g. Springdale Public School" />
                </div>
                <div>
                    <FieldLabel hint="Used as identifier in reports and exports">School Code</FieldLabel>
                    <StyledInput value={data.schoolCode} onChange={e => set('schoolCode', e.target.value)} placeholder="e.g. SPR-2024" />
                </div>
                <div>
                    <FieldLabel>Academic Year</FieldLabel>
                    <StyledInput value={data.academicYear} onChange={e => set('academicYear', e.target.value)} placeholder="2024-2025" />
                </div>
                <div>
                    <FieldLabel>Term</FieldLabel>
                    <StyledSelect value={data.term} onChange={e => set('term', e.target.value)}>
                        {['Annual', 'Semester 1', 'Semester 2', 'Quarter 1', 'Quarter 2'].map(t => <option key={t}>{t}</option>)}
                    </StyledSelect>
                </div>
            </div>
        </div>
    );
}

function StructureSection({ data, onChange }) {
    const set = (key, val) => onChange({ ...data, [key]: val });
    const toggleDay = (day) => {
        const next = data.workingDays.includes(day)
            ? data.workingDays.filter(d => d !== day)
            : [...data.workingDays, day];
        set('workingDays', next);
    };

    return (
        <div>
            <SectionHeader icon={Clock} iconClass="text-violet-600" title="Schedule Structure" badge="Hard constraints — cannot be violated" />
            <div className="space-y-5">
                <div>
                    <FieldLabel>Working Days <span className="text-gray-400 font-normal">({data.workingDays.length} selected)</span></FieldLabel>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                        {DAYS_OF_WEEK.map(day => (
                            <TogglePill
                                key={day}
                                label={day.slice(0, 3)}
                                active={data.workingDays.includes(day)}
                                onClick={() => toggleDay(day)}
                                activeClass="bg-violet-600 text-white"
                            />
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <FieldLabel>Periods Per Day</FieldLabel>
                        <StyledSelect value={data.periodsPerDay} onChange={e => set('periodsPerDay', parseInt(e.target.value))}>
                            {PERIODS_PER_DAY_OPTIONS.map(p => <option key={p} value={p}>{p} periods</option>)}
                        </StyledSelect>
                    </div>
                    <div>
                        <FieldLabel>Period Duration</FieldLabel>
                        <StyledSelect value={data.periodDuration} onChange={e => set('periodDuration', parseInt(e.target.value))}>
                            {PERIOD_DURATION_OPTIONS.map(d => <option key={d} value={d}>{d} minutes</option>)}
                        </StyledSelect>
                    </div>
                    <div>
                        <FieldLabel>School Start Time</FieldLabel>
                        <StyledInput type="time" value={data.startTime} onChange={e => set('startTime', e.target.value)} />
                    </div>
                    <div>
                        <FieldLabel>School End Time</FieldLabel>
                        <StyledInput type="time" value={data.endTime} onChange={e => set('endTime', e.target.value)} />
                    </div>
                    <div>
                        <FieldLabel hint="Time the short break between morning sessions starts">Recess Time</FieldLabel>
                        <StyledInput type="time" value={data.recessTime} onChange={e => set('recessTime', e.target.value)} />
                    </div>
                    <div>
                        <FieldLabel>Lunch Time</FieldLabel>
                        <StyledInput type="time" value={data.lunchTime} onChange={e => set('lunchTime', e.target.value)} />
                    </div>
                    <div>
                        <FieldLabel>Break Duration (min)</FieldLabel>
                        <StyledInput type="number" min={5} max={30} value={data.breakDuration} onChange={e => set('breakDuration', parseInt(e.target.value) || 0)} />
                    </div>
                    <div>
                        <FieldLabel>Lunch Duration (min)</FieldLabel>
                        <StyledInput type="number" min={15} max={60} value={data.lunchDuration} onChange={e => set('lunchDuration', parseInt(e.target.value) || 0)} />
                    </div>
                </div>

                <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                    <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Computed Week</p>
                    <p className="text-xs text-gray-700">
                        <span className="font-semibold">{data.periodsPerDay * data.workingDays.length}</span> total periods/week
                        <span className="mx-2 text-gray-300">·</span>
                        <span className="font-semibold">{data.periodsPerDay}</span> periods/day
                        <span className="mx-2 text-gray-300">·</span>
                        <span className="font-semibold">{data.workingDays.length}</span> days
                    </p>
                </div>
            </div>
        </div>
    );
}

function TeacherConstraintsSection({ data, onChange, periodsPerDay }) {
    const LABELS = {
        maxClassesPerDay: { label: 'Max Classes Per Day', hint: 'Hard limit — solver will never exceed this' },
        maxClassesPerWeek: { label: 'Max Classes Per Week', hint: 'Hard limit across all days' },
        maxConsecutiveClasses: { label: 'Max Consecutive Classes', hint: 'Teacher cannot have more than this many periods back-to-back' },
        minBreakBetweenClasses: { label: 'Min Break Between Classes', hint: 'Minimum free periods between two assignments (0 = no minimum)' },
        maxFreePeriodsPerDay: { label: 'Max Free Periods Per Day', hint: 'Solver won\'t leave more free periods than this' },
    };

    const set = (key, val) => {
        const field = data[key];
        onChange({
            ...data,
            [key]: { ...field, value: Math.min(field.max, Math.max(field.min, val)) }
        });
    };

    return (
        <div>
            <SectionHeader icon={UserCheck} iconClass="text-violet-600" title="Teacher Constraints" badge="Hard constraints — set by school admin, nobody overrides" />
            <div className="space-y-5">
                {Object.entries(data).map(([key, constraint]) => (
                    <RangeControl
                        key={key}
                        label={LABELS[key]?.label ?? key}
                        hint={LABELS[key]?.hint}
                        value={constraint.value}
                        min={constraint.min}
                        max={key === 'maxClassesPerDay' ? Math.min(constraint.max, periodsPerDay) : constraint.max}
                        onChange={val => set(key, val)}
                        accentClass="accent-violet-500"
                    />
                ))}
            </div>
        </div>
    );
}

function ClassConstraintsSection({ data, onChange }) {
    const RANGE_LABELS = {
        maxSubjectsPerDay: { label: 'Max Subjects Per Day' },
        maxTheoryClassesPerDay: { label: 'Max Theory Classes Per Day' },
        maxPracticalClassesPerDay: { label: 'Max Practical Classes Per Day' },
    };

    const setRange = (key, val) => {
        const field = data[key];
        onChange({ ...data, [key]: { ...field, value: Math.min(field.max, Math.max(field.min, val)) } });
    };

    const toggleSubject = (listKey, subject) => {
        const curr = data[listKey];
        onChange({ ...data, [listKey]: curr.includes(subject) ? curr.filter(s => s !== subject) : [...curr, subject] });
    };

    return (
        <div>
            <SectionHeader icon={GraduationCap} iconClass="text-violet-600" title="Class Constraints" badge="Hard constraints" />
            <div className="space-y-5">
                {Object.entries(data)
                    .filter(([, v]) => typeof v === 'object' && v.min !== undefined)
                    .map(([key, constraint]) => (
                        <RangeControl
                            key={key}
                            label={RANGE_LABELS[key]?.label ?? key}
                            value={constraint.value}
                            min={constraint.min}
                            max={constraint.max}
                            onChange={val => setRange(key, val)}
                            accentClass="accent-violet-500"
                        />
                    ))
                }

                {[
                    { key: 'preferredMorningSubjects', label: 'Preferred Morning Subjects', activeClass: 'bg-violet-600 text-white' },
                    { key: 'preferredAfternoonSubjects', label: 'Preferred Afternoon Subjects', activeClass: 'bg-violet-600 text-white' },
                ].map(({ key, label, activeClass }) => (
                    <div key={key}>
                        <FieldLabel>{label}</FieldLabel>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                            {ALL_SUBJECTS.map(s => (
                                <TogglePill
                                    key={s}
                                    label={s}
                                    active={data[key].includes(s)}
                                    onClick={() => toggleSubject(key, s)}
                                    activeClass={activeClass}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function SubjectConstraintsSection({ data, onChange }) {
    const setRange = (key, val) => {
        const field = data[key];
        onChange({ ...data, [key]: { ...field, value: Math.min(field.max, Math.max(field.min, val)) } });
    };

    const setPriority = (subject, val) => {
        onChange({ ...data, subjectPriority: { ...data.subjectPriority, [subject]: val } });
    };

    const toggleList = (listKey, item) => {
        const curr = data[listKey];
        onChange({ ...data, [listKey]: curr.includes(item) ? curr.filter(s => s !== item) : [...curr, item] });
    };

    const PRIORITY_LABELS = { 1: 'Low', 2: 'Low+', 3: 'Mid', 4: 'High', 5: 'Critical' };
    const PRIORITY_COLORS = {
        1: 'bg-gray-100 text-gray-600',
        2: 'bg-gray-100 text-gray-600',
        3: 'bg-gray-100 text-gray-600',
        4: 'bg-violet-100 text-violet-700',
        5: 'bg-violet-200 text-violet-800',
    };

    return (
        <div>
            <SectionHeader icon={BookOpen} iconClass="text-violet-600" title="Subject Rules" badge="Medium constraints — headmaster can override" />
            <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                    <RangeControl
                        label="Min Periods / Week"
                        hint="Minimum periods any subject must get per week"
                        value={data.minPeriodsPerWeek.value}
                        min={data.minPeriodsPerWeek.min}
                        max={data.minPeriodsPerWeek.max}
                        onChange={val => setRange('minPeriodsPerWeek', val)}
                        accentClass="accent-violet-500"
                    />
                    <RangeControl
                        label="Max Periods / Week"
                        hint="No subject should exceed this count"
                        value={data.maxPeriodsPerWeek.value}
                        min={data.maxPeriodsPerWeek.min}
                        max={data.maxPeriodsPerWeek.max}
                        onChange={val => setRange('maxPeriodsPerWeek', val)}
                        accentClass="accent-violet-500"
                    />
                </div>

                <div>
                    <FieldLabel hint="Higher priority subjects get scheduled first and in better slots">Subject Scheduling Priority</FieldLabel>
                    <div className="mt-2 rounded-md border border-gray-200 overflow-hidden">
                        {Object.entries(data.subjectPriority).map(([subject, priority], i) => (
                            <div key={subject} className={cn('flex items-center px-3 py-2 gap-3', i % 2 === 0 ? 'bg-white' : 'bg-gray-50')}>
                                <span className="text-xs text-gray-700 w-36 shrink-0">{subject}</span>
                                <div className="flex gap-1 flex-1">
                                    {[1, 2, 3, 4, 5].map(v => (
                                        <button
                                            key={v}
                                            onClick={() => setPriority(subject, v)}
                                            className={cn(
                                                'flex-1 py-1 rounded-md text-[10px] font-semibold transition-all',
                                                priority === v ? PRIORITY_COLORS[v] : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                            )}
                                        >
                                            {v}
                                        </button>
                                    ))}
                                </div>
                                <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full w-14 text-center', PRIORITY_COLORS[priority])}>
                                    {PRIORITY_LABELS[priority]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {[
                    { key: 'labRequired', label: 'Requires Lab', activeClass: 'bg-violet-600 text-white' },
                    { key: 'specialEquipment', label: 'Requires Special Equipment', activeClass: 'bg-violet-600 text-white' },
                ].map(({ key, label, activeClass }) => (
                    <div key={key}>
                        <FieldLabel>{label}</FieldLabel>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                            {ALL_SUBJECTS.map(s => (
                                <TogglePill
                                    key={s}
                                    label={s}
                                    active={data[key].includes(s)}
                                    onClick={() => toggleList(key, s)}
                                    activeClass={activeClass}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function RoomSection({ data, onChange }) {
    const LABELS = {
        totalClassrooms: { label: 'Total Classrooms', hint: 'Standard teaching rooms' },
        totalLabs: { label: 'Total Science Labs', hint: 'Physics, Chem, Bio labs' },
        totalComputerLabs: { label: 'Total Computer Labs', hint: 'Rooms with computers' },
        totalSportsFacilities: { label: 'Sports Facilities', hint: 'Courts, fields, gym' },
        roomCapacity: { label: 'Average Room Capacity', hint: 'Used for feasibility checks' },
    };

    const set = (key, val) => {
        const field = data[key];
        onChange({ ...data, [key]: { ...field, value: Math.min(field.max, Math.max(field.min, val)) } });
    };

    return (
        <div>
            <SectionHeader icon={Building2} iconClass="text-violet-600" title="Room & Facility Setup" badge="Hard constraints" />
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                {Object.entries(data).map(([key, constraint]) => (
                    <RangeControl
                        key={key}
                        label={LABELS[key]?.label ?? key}
                        hint={LABELS[key]?.hint}
                        value={constraint.value}
                        min={constraint.min}
                        max={constraint.max}
                        onChange={val => set(key, val)}
                        accentClass="accent-violet-500"
                    />
                ))}
            </div>
        </div>
    );
}

function PreferencesSection({ data, onChange }) {
    const toggleList = (key, subject) => {
        const curr = data[key];
        onChange({ ...data, [key]: curr.includes(subject) ? curr.filter(s => s !== subject) : [...curr, subject] });
    };
    const set = (key, val) => onChange({ ...data, [key]: val });

    return (
        <div>
            <SectionHeader icon={Target} iconClass="text-violet-600" title="Time Preferences" badge="Soft constraints — solver respects but can bend" />
            <div className="space-y-5">
                {[
                    { key: 'morningPreference', label: 'Morning Preference Subjects', activeClass: 'bg-violet-600 text-white' },
                    { key: 'afternoonPreference', label: 'Afternoon Preference Subjects', activeClass: 'bg-violet-600 text-white' },
                    { key: 'avoidMondayMorning', label: 'Avoid Monday Morning', activeClass: 'bg-violet-600 text-white' },
                    { key: 'avoidFridayAfternoon', label: 'Avoid Friday Afternoon', activeClass: 'bg-violet-600 text-white' },
                ].map(({ key, label, activeClass }) => (
                    <div key={key}>
                        <FieldLabel>{label}</FieldLabel>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                            {ALL_SUBJECTS.map(s => (
                                <TogglePill key={s} label={s} active={data[key].includes(s)} onClick={() => toggleList(key, s)} activeClass={activeClass} />
                            ))}
                        </div>
                    </div>
                ))}

                <div className="rounded-md border border-gray-200 overflow-hidden">
                    <ToggleRow
                        label="Prefer Lab After Theory"
                        description="Schedule practicals immediately after the corresponding theory period"
                        checked={data.preferLabAfterTheory}
                        onChange={val => set('preferLabAfterTheory', val)}
                    />
                    <ToggleRow
                        label="Balance Load Across Week"
                        description="Distribute subject periods evenly — avoid clustering on specific days"
                        checked={data.balancedLoadAcrossWeek}
                        onChange={val => set('balancedLoadAcrossWeek', val)}
                    />
                </div>
            </div>
        </div>
    );
}

function SpecialSection({ data, onChange, periodsPerDay }) {
    const set = (key, val) => onChange({ ...data, [key]: val });

    return (
        <div>
            <SectionHeader icon={Shield} iconClass="text-violet-600" title="Special Rules & Activities" badge="Soft constraints" />
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <FieldLabel hint="Day when teacher preparation / admin meetings are scheduled">Teacher Free Day</FieldLabel>
                    <StyledSelect value={data.teacherFreeDay} onChange={e => set('teacherFreeDay', e.target.value)}>
                        {DAYS_OF_WEEK.map(d => <option key={d}>{d}</option>)}
                    </StyledSelect>
                </div>
                <div>
                    <FieldLabel>Assembly Start Time</FieldLabel>
                    <StyledInput type="time" value={data.assemblyTime} onChange={e => set('assemblyTime', e.target.value)} />
                </div>
                <div>
                    <FieldLabel>Assembly Duration (min)</FieldLabel>
                    <StyledInput type="number" min={5} max={60} value={data.assemblyDuration} onChange={e => set('assemblyDuration', parseInt(e.target.value) || 0)} />
                </div>
                <div className="col-span-2 border-t border-gray-100 pt-4 mt-2">
                    <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Club & Remedial Activities</p>
                </div>
                <div>
                    <FieldLabel>Club Activities Day</FieldLabel>
                    <StyledSelect value={data.clubActivitiesDay} onChange={e => set('clubActivitiesDay', e.target.value)}>
                        {DAYS_OF_WEEK.map(d => <option key={d}>{d}</option>)}
                    </StyledSelect>
                </div>
                <div>
                    <FieldLabel hint={`1 – ${periodsPerDay}`}>Club Activities Period</FieldLabel>
                    <StyledInput type="number" min={1} max={periodsPerDay} value={data.clubActivitiesPeriod} onChange={e => set('clubActivitiesPeriod', Math.min(periodsPerDay, parseInt(e.target.value) || 1))} />
                </div>
                <div>
                    <FieldLabel>Remedial Classes Day</FieldLabel>
                    <StyledSelect value={data.remedialClassesDay} onChange={e => set('remedialClassesDay', e.target.value)}>
                        {DAYS_OF_WEEK.map(d => <option key={d}>{d}</option>)}
                    </StyledSelect>
                </div>
                <div>
                    <FieldLabel hint={`1 – ${periodsPerDay}`}>Remedial Classes Period</FieldLabel>
                    <StyledInput type="number" min={1} max={periodsPerDay} value={data.remedialClassesPeriod} onChange={e => set('remedialClassesPeriod', Math.min(periodsPerDay, parseInt(e.target.value) || 1))} />
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

const SECTIONS = [
    { id: 'general', label: 'General Info', icon: School },
    { id: 'structure', label: 'Schedule Structure', icon: Clock },
    { id: 'teachers', label: 'Teacher Constraints', icon: UserCheck },
    { id: 'classes', label: 'Class Constraints', icon: GraduationCap },
    { id: 'subjects', label: 'Subject Rules', icon: BookOpen },
    { id: 'rooms', label: 'Room Setup', icon: Building2 },
    { id: 'preferences', label: 'Time Preferences', icon: Target },
    { id: 'special', label: 'Special Rules', icon: Shield },
];

export default function TimetableSettingsPage() {
    const [activeSection, setActiveSection] = useState('general');
    const [profile, setProfile] = useState(DEFAULT_PROFILE);
    const [saving, setSaving] = useState(false);
    const [saveState, setSaveState] = useState('idle'); // idle | saving | saved | error

    const validation = useMemo(() => runValidation(profile), [profile]);
    const hasHardErrors = validation.hard.length > 0;
    const totalIssues = validation.hard.length + validation.medium.length + validation.soft.length;

    const handleSave = useCallback(async () => {
        if (hasHardErrors) {
            setActiveSection('teachers');
            return;
        }
        setSaveState('saving');
        try {
            await new Promise(r => setTimeout(r, 1400));
            setSaveState('saved');
            setTimeout(() => setSaveState('idle'), 3000);
        } catch {
            setSaveState('error');
            setTimeout(() => setSaveState('idle'), 3000);
        }
    }, [hasHardErrors, profile]);

    const setSection = useCallback((key, val) => {
        setProfile(prev => ({ ...prev, [key]: val }));
    }, []);

    const activeIdx = SECTIONS.findIndex(s => s.id === activeSection);

    return (
        <div className="min-h-screen bg-violet-50">
            <div className="max-w-screen-xl mx-auto p-6">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-800 tracking-tight">Timetable Configuration</h1>
                        <p className="text-xs text-gray-500 mt-0.5">Set up school profile and constraints for timetable generation</p>
                    </div>

                    <div className="flex items-center gap-3">
                        {totalIssues > 0 && (
                            <div className={cn(
                                'flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-md',
                                hasHardErrors ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                            )}>
                                <AlertTriangle size={12} />
                                {hasHardErrors
                                    ? `${validation.hard.length} hard error${validation.hard.length > 1 ? 's' : ''}`
                                    : `${totalIssues} suggestion${totalIssues > 1 ? 's' : ''}`
                                }
                            </div>
                        )}
                        <button
                            onClick={handleSave}
                            disabled={saveState === 'saving'}
                            className={cn(
                                'flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold transition-all',
                                saveState === 'saved' ? 'bg-emerald-600 text-white'
                                    : saveState === 'error' ? 'bg-rose-600 text-white'
                                        : hasHardErrors ? 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100'
                                            : 'bg-gradient-to-r from-violet-500 to-violet-700 text-white hover:opacity-90',
                                saveState === 'saving' && 'opacity-70 cursor-not-allowed'
                            )}
                        >
                            {saveState === 'saving' ? <Loader2 size={14} className="animate-spin" />
                                : saveState === 'saved' ? <Check size={14} />
                                    : saveState === 'error' ? <AlertCircle size={14} />
                                        : hasHardErrors ? <AlertCircle size={14} />
                                            : <Save size={14} />}
                            {saveState === 'saving' ? 'Saving…'
                                : saveState === 'saved' ? 'Saved!'
                                    : saveState === 'error' ? 'Save Failed'
                                        : hasHardErrors ? 'Fix Errors First'
                                            : 'Save Configuration'}
                        </button>
                    </div>
                </div>

                {/* Validation status cards */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    {[
                        {
                            label: 'Hard Constraints', icon: Shield,
                            valid: validation.hard.length === 0,
                            issues: validation.hard,
                            severity: 'hard',
                            validText: 'All satisfied',
                            invalidText: `${validation.hard.length} error${validation.hard.length > 1 ? 's' : ''}`,
                            validStyle: 'bg-emerald-50 border-emerald-200',
                            invalidStyle: 'bg-rose-50 border-rose-200',
                            validIcon: 'text-emerald-600',
                            invalidIcon: 'text-rose-600',
                        },
                        {
                            label: 'Medium Constraints', icon: Sliders,
                            valid: validation.medium.length === 0,
                            issues: validation.medium,
                            severity: 'medium',
                            validText: 'Optimal settings',
                            invalidText: `${validation.medium.length} suggestion${validation.medium.length > 1 ? 's' : ''}`,
                            validStyle: 'bg-violet-50 border-violet-200',
                            invalidStyle: 'bg-amber-50 border-amber-200',
                            validIcon: 'text-violet-600',
                            invalidIcon: 'text-amber-600',
                        },
                        {
                            label: 'Soft Constraints', icon: Activity,
                            valid: validation.soft.length === 0,
                            issues: validation.soft,
                            severity: 'soft',
                            validText: 'Preferences set',
                            invalidText: `${validation.soft.length} note${validation.soft.length > 1 ? 's' : ''}`,
                            validStyle: 'bg-gray-50 border-gray-200',
                            invalidStyle: 'bg-gray-50 border-gray-200',
                            validIcon: 'text-gray-600',
                            invalidIcon: 'text-gray-600',
                        },
                    ].map(({ label, icon: Icon, valid, issues, severity, validText, invalidText, validStyle, invalidStyle, validIcon, invalidIcon }) => (
                        <div key={label} className={cn('p-3 rounded-md border', valid ? validStyle : invalidStyle)}>
                            <div className="flex items-center gap-2">
                                <Icon size={14} className={valid ? validIcon : invalidIcon} />
                                <span className="text-xs font-semibold text-gray-700">{label}</span>
                                <div className="ml-auto">
                                    {valid
                                        ? <CheckCircle size={12} className={validIcon} />
                                        : <AlertCircle size={12} className={invalidIcon} />
                                    }
                                </div>
                            </div>
                            <p className={cn('text-[10px] mt-1', valid ? validIcon : invalidIcon)}>
                                {valid ? validText : invalidText}
                            </p>
                            <IssueList issues={issues} severity={severity} />
                        </div>
                    ))}
                </div>

                <div className="flex gap-5">
                    {/* Sidebar */}
                    <div className="w-56 shrink-0">
                        <div className="bg-white rounded-md border border-violet-100 overflow-hidden sticky top-6">
                            <div className="px-4 py-3 border-b border-gray-200">
                                <p className="text-xs font-semibold text-gray-700">Configuration</p>
                                <p className="text-[10px] text-gray-500 mt-0.5">8 sections · {totalIssues} issue{totalIssues !== 1 ? 's' : ''}</p>
                            </div>
                            <div className="p-2">
                                {SECTIONS.map((section, idx) => {
                                    const Icon = section.icon;
                                    const isActive = activeSection === section.id;
                                    const sectionHasIssue = (
                                        (section.id === 'structure' || section.id === 'teachers') && validation.hard.length > 0
                                    ) || (
                                            section.id === 'subjects' && validation.medium.length > 0
                                        );

                                    return (
                                        <button
                                            key={section.id}
                                            onClick={() => setActiveSection(section.id)}
                                            className={cn(
                                                'w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-all mb-0.5',
                                                isActive
                                                    ? 'bg-violet-600 text-white'
                                                    : 'text-gray-600 hover:bg-gray-50'
                                            )}
                                        >
                                            <Icon size={14} className={isActive ? 'opacity-90' : 'opacity-60'} />
                                            <span className="flex-1 text-left text-[12px]">{section.label}</span>
                                            {sectionHasIssue && !isActive && (
                                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 bg-white rounded-md border border-violet-100 p-5 min-h-[500px]">
                        {activeSection === 'general' && (
                            <GeneralSection data={profile.general} onChange={v => setSection('general', v)} />
                        )}
                        {activeSection === 'structure' && (
                            <StructureSection data={profile.structure} onChange={v => setSection('structure', v)} />
                        )}
                        {activeSection === 'teachers' && (
                            <TeacherConstraintsSection
                                data={profile.teacherConstraints}
                                onChange={v => setSection('teacherConstraints', v)}
                                periodsPerDay={profile.structure.periodsPerDay}
                            />
                        )}
                        {activeSection === 'classes' && (
                            <ClassConstraintsSection data={profile.classConstraints} onChange={v => setSection('classConstraints', v)} />
                        )}
                        {activeSection === 'subjects' && (
                            <SubjectConstraintsSection data={profile.subjectConstraints} onChange={v => setSection('subjectConstraints', v)} />
                        )}
                        {activeSection === 'rooms' && (
                            <RoomSection data={profile.roomConstraints} onChange={v => setSection('roomConstraints', v)} />
                        )}
                        {activeSection === 'preferences' && (
                            <PreferencesSection data={profile.timePreferences} onChange={v => setSection('timePreferences', v)} />
                        )}
                        {activeSection === 'special' && (
                            <SpecialSection
                                data={profile.specialRequirements}
                                onChange={v => setSection('specialRequirements', v)}
                                periodsPerDay={profile.structure.periodsPerDay}
                            />
                        )}

                        {/* Section nav footer */}
                        <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-200">
                            <button
                                onClick={() => setActiveSection(SECTIONS[Math.max(0, activeIdx - 1)].id)}
                                disabled={activeIdx === 0}
                                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 disabled:opacity-30 transition-colors"
                            >
                                ← {activeIdx > 0 ? SECTIONS[activeIdx - 1].label : ''}
                            </button>
                            <span className="text-[10px] text-gray-400">{activeIdx + 1} / {SECTIONS.length}</span>
                            <button
                                onClick={() => setActiveSection(SECTIONS[Math.min(SECTIONS.length - 1, activeIdx + 1)].id)}
                                disabled={activeIdx === SECTIONS.length - 1}
                                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 disabled:opacity-30 transition-colors"
                            >
                                {activeIdx < SECTIONS.length - 1 ? SECTIONS[activeIdx + 1].label : ''} →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}