// app/(school)/school/emergency/page.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import {
    Search, AlertTriangle, Phone, Heart, Droplets, User,
    ChevronDown, ChevronRight, X, Clock, MapPin, Shield,
    Zap, Activity, FileText, CheckCircle, XCircle,
    PhoneCall, MessageSquare, Navigation, Bell, Filter,
    RefreshCw, Eye, ClipboardList, Siren, UserCheck,
    Ambulance, BookOpen, CalendarDays, Hash, AlertCircle,
    Radio, Wifi, WifiOff, ChevronUp, Loader2, Copy, ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

const mockStudents = Array.from({ length: 48 }, (_, i) => {
    const classes = ['6A', '6B', '7A', '7B', '8A', '8C', '9A', '9B', '10A', '10B', '11A', '12B'];
    const conditions = [[], ['Asthma'], ['Diabetes Type 1'], ['Epilepsy'], ['Severe Nut Allergy'], ['Heart Condition'], []];
    const allergies = [[], ['Penicillin'], ['Shellfish', 'Tree Nuts'], ['Latex'], ['Dust, Pollen'], []];
    const firstNames = ['Arjun', 'Priya', 'Riya', 'Siddharth', 'Anika', 'Rohan', 'Kavya', 'Nikhil', 'Shruti', 'Dev', 'Ishaan', 'Pooja', 'Ayaan', 'Tanya', 'Karan'];
    const lastNames = ['Sharma', 'Patel', 'Singh', 'Kumar', 'Verma', 'Gupta', 'Nair', 'Reddy', 'Joshi', 'Malhotra'];
    const cond = conditions[Math.floor(Math.random() * conditions.length)];
    const allerg = allergies[Math.floor(Math.random() * allergies.length)];
    return {
        id: `RQ-0001-${String(i + 1).padStart(8, '0')}`,
        studentId: `STU${String(i + 1).padStart(4, '0')}`,
        name: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
        class: classes[i % classes.length],
        rollNo: String(Math.floor(Math.random() * 40) + 1).padStart(2, '0'),
        dob: `201${Math.floor(Math.random() * 4) + 0}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        bloodGroup: BLOOD_GROUPS[i % BLOOD_GROUPS.length],
        photo: null,
        medicalConditions: cond,
        allergies: allerg,
        medications: cond.length > 0 ? ['Prescribed medication on file'] : [],
        doctorName: 'Dr. Ramesh Iyer',
        doctorPhone: `+91 98${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
        parents: [
            {
                relation: 'Father',
                name: `${lastNames[i % lastNames.length]} Sr.`,
                phone: `+91 98${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
                alternatePhone: null,
                isReachable: Math.random() > 0.2,
            },
            {
                relation: 'Mother',
                name: `Sunita ${lastNames[i % lastNames.length]}`,
                phone: `+91 97${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
                alternatePhone: null,
                isReachable: Math.random() > 0.3,
            }
        ],
        emergencyContacts: [
            {
                relation: 'Uncle',
                name: `Suresh ${lastNames[i % lastNames.length]}`,
                phone: `+91 96${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
            }
        ],
        address: `Flat ${Math.floor(Math.random() * 200) + 1}, Block ${String.fromCharCode(65 + (i % 5))}, Green Park, City - 400001`,
        insuranceNo: `INS${String(i + 1).padStart(6, '0')}`,
        notes: cond.length > 0 ? `Student has ${cond.join(', ')}. Keep inhaler / medication accessible. Contact parents immediately if symptoms appear.` : '',
        hasHighRisk: cond.length > 0,
        lastScanned: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
    };
});

const mockIncidents = [
    { id: 'INC001', studentName: 'Arjun Sharma', studentId: 'STU0001', class: '9A', type: 'Medical', severity: 'High', time: '2 hours ago', status: 'Resolved', description: 'Asthma attack during PT period. Inhaler administered.' },
    { id: 'INC002', studentName: 'Priya Patel', studentId: 'STU0002', class: '7B', type: 'Injury', severity: 'Medium', time: '1 day ago', status: 'Resolved', description: 'Minor fall in staircase. First aid given.' },
    { id: 'INC003', studentName: 'Rohan Singh', studentId: 'STU0006', class: '10A', type: 'Medical', severity: 'Low', time: '3 days ago', status: 'Closed', description: 'Complained of headache. Parents notified.' },
];

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function BloodBadge({ group }) {
    return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-bold border border-red-200">
            <Droplets size={10} className="fill-red-500 text-red-500" />
            {group}
        </span>
    );
}

function RiskBadge({ hasRisk }) {
    if (!hasRisk) return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
            <CheckCircle size={10} /> Low Risk
        </span>
    );
    return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200 animate-pulse">
            <AlertTriangle size={10} /> High Risk
        </span>
    );
}

function SeverityDot({ severity }) {
    const map = {
        High: 'bg-red-500',
        Medium: 'bg-amber-400',
        Low: 'bg-sky-400',
    };
    return <span className={cn('inline-block w-2 h-2 rounded-full', map[severity] || 'bg-slate-300')} />;
}

function ContactCard({ contact, isPrimary }) {
    const [calling, setCalling] = useState(false);
    const [msgSent, setMsgSent] = useState(false);

    const handleCall = () => {
        setCalling(true);
        setTimeout(() => setCalling(false), 2000);
    };
    const handleMsg = () => {
        setMsgSent(true);
        setTimeout(() => setMsgSent(false), 2500);
    };

    return (
        <div className={cn(
            "flex items-center justify-between p-3 rounded-xl border transition-all",
            isPrimary
                ? "bg-gradient-to-r from-red-50 to-orange-50 border-red-200"
                : "bg-white border-slate-200 hover:border-slate-300"
        )}>
            <div className="flex items-center gap-3 min-w-0">
                <div className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                    isPrimary ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-600"
                )}>
                    {contact.name.charAt(0)}
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{contact.name}</p>
                    <p className="text-xs text-slate-500">{contact.relation} · {contact.phone}</p>
                </div>
            </div>
            <div className="flex items-center gap-1 ml-2 shrink-0">
                {'isReachable' in contact && (
                    <span className={cn(
                        'w-2 h-2 rounded-full mr-1',
                        contact.isReachable ? 'bg-emerald-400' : 'bg-slate-300'
                    )} title={contact.isReachable ? 'Reachable' : 'Unreachable'} />
                )}
                <button
                    onClick={handleMsg}
                    className={cn(
                        "p-2 rounded-lg text-xs transition-all",
                        msgSent
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                    )}
                    title="Send SMS alert"
                >
                    {msgSent ? <CheckCircle size={14} /> : <MessageSquare size={14} />}
                </button>
                <button
                    onClick={handleCall}
                    className={cn(
                        "p-2 rounded-lg text-xs transition-all",
                        calling
                            ? "bg-green-100 text-green-700 animate-pulse"
                            : "bg-red-50 text-red-600 hover:bg-red-100"
                    )}
                    title="Call"
                >
                    {calling ? <PhoneCall size={14} /> : <Phone size={14} />}
                </button>
            </div>
        </div>
    );
}

function MedicalTag({ label, type = 'condition' }) {
    const styles = {
        condition: 'bg-red-50 text-red-700 border-red-200',
        allergy: 'bg-amber-50 text-amber-700 border-amber-200',
        medication: 'bg-blue-50 text-blue-700 border-blue-200',
    };
    return (
        <span className={cn(
            'inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border',
            styles[type]
        )}>
            {type === 'condition' && <Heart size={10} />}
            {type === 'allergy' && <AlertTriangle size={10} />}
            {type === 'medication' && <Activity size={10} />}
            {label}
        </span>
    );
}

function EmptyState({ icon: Icon, title, subtitle }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <Icon className="w-7 h-7 text-slate-300" />
            </div>
            <p className="text-sm font-semibold text-slate-600">{title}</p>
            {subtitle && <p className="text-xs text-slate-400 mt-1 max-w-xs">{subtitle}</p>}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// STUDENT SEARCH PANEL
// ─────────────────────────────────────────────────────────────────────────────

function StudentSearchPanel({ onSelect, selectedId }) {
    const [query, setQuery] = useState('');
    const [classFilter, setClassFilter] = useState('');
    const [riskFilter, setRiskFilter] = useState('');
    const inputRef = useRef(null);

    const classes = [...new Set(mockStudents.map(s => s.class))].sort();

    const filtered = mockStudents.filter(s => {
        const q = query.toLowerCase();
        const matchQ = !q || s.name.toLowerCase().includes(q) || s.studentId.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || s.class.toLowerCase().includes(q);
        const matchClass = !classFilter || s.class === classFilter;
        const matchRisk = !riskFilter || (riskFilter === 'high' ? s.hasHighRisk : !s.hasHighRisk);
        return matchQ && matchClass && matchRisk;
    });

    return (
        <div className="flex flex-col h-full">
            {/* Search header */}
            <div className="p-4 border-b border-slate-200 space-y-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Name, ID, class, scan code…"
                        className="w-full pl-9 pr-4 h-9 rounded-lg border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all"
                        autoFocus
                    />
                    {query && (
                        <button onClick={() => setQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                            <X size={14} />
                        </button>
                    )}
                </div>
                <div className="flex gap-2">
                    <select
                        value={classFilter}
                        onChange={e => setClassFilter(e.target.value)}
                        className="flex-1 h-8 px-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-600 focus:outline-none focus:border-red-300"
                    >
                        <option value="">All Classes</option>
                        {classes.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select
                        value={riskFilter}
                        onChange={e => setRiskFilter(e.target.value)}
                        className="flex-1 h-8 px-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-600 focus:outline-none focus:border-red-300"
                    >
                        <option value="">All Risk</option>
                        <option value="high">High Risk</option>
                        <option value="low">Low Risk</option>
                    </select>
                </div>
                <p className="text-xs text-slate-400">{filtered.length} student{filtered.length !== 1 ? 's' : ''}</p>
            </div>

            {/* Student list */}
            <div className="flex-1 overflow-y-auto">
                {filtered.length === 0 ? (
                    <EmptyState icon={Search} title="No students found" subtitle="Try a different name or ID" />
                ) : (
                    <div className="p-2 space-y-1">
                        {filtered.map(student => (
                            <button
                                key={student.id}
                                onClick={() => onSelect(student)}
                                className={cn(
                                    "w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all border",
                                    selectedId === student.id
                                        ? "bg-red-50 border-red-200 shadow-sm"
                                        : "hover:bg-slate-50 border-transparent hover:border-slate-200"
                                )}
                            >
                                <div className={cn(
                                    "w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0",
                                    student.hasHighRisk ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
                                )}>
                                    {student.name.charAt(0)}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1.5 mb-0.5">
                                        <p className="text-sm font-semibold text-slate-800 truncate">{student.name}</p>
                                        {student.hasHighRisk && <AlertTriangle size={11} className="text-amber-500 shrink-0" />}
                                    </div>
                                    <p className="text-xs text-slate-500">{student.class} · Roll {student.rollNo}</p>
                                </div>
                                <BloodBadge group={student.bloodGroup} />
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// EMERGENCY PROFILE PANEL
// ─────────────────────────────────────────────────────────────────────────────

function EmergencyProfile({ student, onLogIncident }) {
    const [activeTab, setActiveTab] = useState('overview');
    const [alertSent, setAlertSent] = useState(false);
    const [copied, setCopied] = useState(false);

    const tabs = [
        { id: 'overview', label: 'Overview', icon: Shield },
        { id: 'contacts', label: 'Contacts', icon: Phone },
        { id: 'medical', label: 'Medical', icon: Heart },
        { id: 'incidents', label: 'Incidents', icon: ClipboardList },
    ];

    const handleBroadcast = () => {
        setAlertSent(true);
        setTimeout(() => setAlertSent(false), 3000);
    };

    const handleCopyId = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    if (!student) {
        return (
            <div className="flex flex-col h-full items-center justify-center">
                <div className="text-center max-w-sm mx-auto">
                    <div className="w-20 h-20 rounded-3xl bg-red-50 border-2 border-dashed border-red-200 flex items-center justify-center mx-auto mb-5">
                        <Siren className="w-9 h-9 text-red-300" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-700 mb-2">No Student Selected</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">Search for a student on the left to view their emergency profile, contact details, and medical information.</p>
                    <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                        <p className="text-xs text-amber-700 font-medium flex items-center justify-center gap-1.5">
                            <Zap size={12} /> Tip: Scan a student QR code to jump directly to their profile
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Student identity header */}
            <div className="p-5 border-b border-slate-200 bg-gradient-to-br from-slate-50 to-white">
                <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-xl font-black text-white shrink-0 shadow-lg shadow-red-200">
                        {student.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-xl font-black text-slate-900">{student.name}</h2>
                            <RiskBadge hasRisk={student.hasHighRisk} />
                        </div>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                            <span className="text-sm text-slate-500">Class {student.class} · Roll {student.rollNo}</span>
                            <BloodBadge group={student.bloodGroup} />
                        </div>
                        <button onClick={handleCopyId} className="mt-1.5 flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition-colors group">
                            <Hash size={10} />
                            <span>{student.studentId}</span>
                            {copied ? <CheckCircle size={10} className="text-emerald-500" /> : <Copy size={10} className="opacity-0 group-hover:opacity-100" />}
                        </button>
                    </div>
                    {/* Broadcast button */}
                    <button
                        onClick={handleBroadcast}
                        className={cn(
                            "flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0",
                            alertSent
                                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200"
                                : "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-200 hover:shadow-red-300 active:scale-95"
                        )}
                    >
                        {alertSent ? <CheckCircle size={18} /> : <Bell size={18} />}
                        {alertSent ? 'Sent!' : 'Alert All'}
                    </button>
                </div>

                {/* Quick action bar */}
                <div className="grid grid-cols-3 gap-2 mt-4">
                    <button className="flex items-center justify-center gap-2 h-9 rounded-xl bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-all shadow-sm shadow-red-200 active:scale-95">
                        <PhoneCall size={13} /> Call Parents
                    </button>
                    <button className="flex items-center justify-center gap-2 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all">
                        <Ambulance size={13} /> Call Ambulance
                    </button>
                    <button
                        onClick={onLogIncident}
                        className="flex items-center justify-center gap-2 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all"
                    >
                        <FileText size={13} /> Log Incident
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 bg-white px-4">
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap",
                                activeTab === tab.id
                                    ? "border-red-500 text-red-600"
                                    : "border-transparent text-slate-500 hover:text-slate-700"
                            )}
                        >
                            <Icon size={12} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* ── OVERVIEW TAB ── */}
                {activeTab === 'overview' && (
                    <>
                        {/* High risk banner */}
                        {student.hasHighRisk && (
                            <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-50 border border-amber-200">
                                <AlertTriangle className="text-amber-600 mt-0.5 shrink-0" size={16} />
                                <div>
                                    <p className="text-sm font-bold text-amber-800">High Risk Student</p>
                                    <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">{student.notes || 'Review medical conditions before emergency response.'}</p>
                                </div>
                            </div>
                        )}

                        {/* Key info grid */}
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: 'Date of Birth', value: student.dob, icon: CalendarDays },
                                { label: 'Blood Group', value: student.bloodGroup, icon: Droplets, accent: 'red' },
                                { label: 'Insurance No.', value: student.insuranceNo, icon: Shield },
                                { label: 'Last QR Scan', value: new Date(student.lastScanned).toLocaleDateString('en-IN'), icon: Activity },
                            ].map(item => {
                                const Icon = item.icon;
                                return (
                                    <div key={item.label} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <Icon size={12} className={item.accent === 'red' ? 'text-red-500' : 'text-slate-400'} />
                                            <p className="text-xs text-slate-500">{item.label}</p>
                                        </div>
                                        <p className={cn("text-sm font-bold", item.accent === 'red' ? 'text-red-600' : 'text-slate-800')}>{item.value}</p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Address */}
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                            <div className="flex items-center gap-1.5 mb-1">
                                <MapPin size={12} className="text-slate-400" />
                                <p className="text-xs text-slate-500">Home Address</p>
                            </div>
                            <p className="text-sm text-slate-700">{student.address}</p>
                            <a
                                href={`https://maps.google.com/?q=${encodeURIComponent(student.address)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-1.5 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
                            >
                                <Navigation size={10} /> Open in Maps
                            </a>
                        </div>

                        {/* Doctor */}
                        <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-blue-500 mb-0.5">Family Doctor</p>
                                    <p className="text-sm font-bold text-blue-800">{student.doctorName}</p>
                                    <p className="text-xs text-blue-600">{student.doctorPhone}</p>
                                </div>
                                <button className="p-2 rounded-xl bg-blue-100 text-blue-700 hover:bg-blue-200 transition-all">
                                    <Phone size={16} />
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {/* ── CONTACTS TAB ── */}
                {activeTab === 'contacts' && (
                    <>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Parent / Guardian</p>
                            <div className="space-y-2">
                                {student.parents.map((p, i) => (
                                    <ContactCard key={i} contact={p} isPrimary={i === 0} />
                                ))}
                            </div>
                        </div>
                        {student.emergencyContacts.length > 0 && (
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Emergency Contacts</p>
                                <div className="space-y-2">
                                    {student.emergencyContacts.map((c, i) => (
                                        <ContactCard key={i} contact={c} isPrimary={false} />
                                    ))}
                                </div>
                            </div>
                        )}
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Medical</p>
                            <ContactCard contact={{ name: student.doctorName, phone: student.doctorPhone, relation: 'Family Doctor' }} isPrimary={false} />
                        </div>

                        {/* Bulk notify */}
                        <div className="p-3 rounded-xl bg-slate-50 border border-dashed border-slate-300">
                            <p className="text-xs font-semibold text-slate-600 mb-2">Bulk Notify All Contacts</p>
                            <button className="w-full flex items-center justify-center gap-2 h-9 rounded-xl bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-all active:scale-95">
                                <Radio size={13} /> Send Emergency SMS to All
                            </button>
                        </div>
                    </>
                )}

                {/* ── MEDICAL TAB ── */}
                {activeTab === 'medical' && (
                    <>
                        {student.medicalConditions.length === 0 && student.allergies.length === 0 && student.medications.length === 0 ? (
                            <EmptyState icon={Heart} title="No Medical Records" subtitle="No conditions, allergies or medications on file for this student." />
                        ) : (
                            <>
                                {student.medicalConditions.length > 0 && (
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Medical Conditions</p>
                                        <div className="flex flex-wrap gap-2">
                                            {student.medicalConditions.map(c => <MedicalTag key={c} label={c} type="condition" />)}
                                        </div>
                                    </div>
                                )}

                                {student.allergies.length > 0 && (
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Allergies</p>
                                        <div className="flex flex-wrap gap-2">
                                            {student.allergies.map(a => <MedicalTag key={a} label={a} type="allergy" />)}
                                        </div>
                                    </div>
                                )}

                                {student.medications.length > 0 && (
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Current Medications</p>
                                        <div className="flex flex-wrap gap-2">
                                            {student.medications.map(m => <MedicalTag key={m} label={m} type="medication" />)}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Notes */}
                        {student.notes && (
                            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                                <p className="text-xs font-bold text-amber-700 mb-1 flex items-center gap-1.5">
                                    <AlertCircle size={12} /> Important Notes
                                </p>
                                <p className="text-xs text-amber-800 leading-relaxed">{student.notes}</p>
                            </div>
                        )}

                        {/* Blood group prominent */}
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-red-50 to-rose-50 border border-red-200">
                            <div className="w-14 h-14 rounded-2xl bg-red-500 flex items-center justify-center shadow-lg shadow-red-200">
                                <Droplets className="text-white" size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-red-400 font-medium">Blood Group</p>
                                <p className="text-3xl font-black text-red-600">{student.bloodGroup}</p>
                            </div>
                        </div>

                        {/* Insurance */}
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                            <p className="text-xs text-slate-500 mb-0.5 flex items-center gap-1.5"><Shield size={11} /> Insurance Number</p>
                            <p className="text-sm font-bold text-slate-800">{student.insuranceNo}</p>
                        </div>
                    </>
                )}

                {/* ── INCIDENTS TAB ── */}
                {activeTab === 'incidents' && (
                    <>
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Incident History</p>
                            <button
                                onClick={onLogIncident}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 border border-red-200 transition-all"
                            >
                                <FileText size={11} /> Log New
                            </button>
                        </div>
                        {mockIncidents.filter(i => i.studentId === student.studentId).length === 0 ? (
                            <EmptyState icon={ClipboardList} title="No Incidents Logged" subtitle="No past incidents on record for this student." />
                        ) : (
                            <div className="space-y-2">
                                {mockIncidents.filter(i => i.studentId === student.studentId).map(inc => (
                                    <div key={inc.id} className="p-3 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-all">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <div className="flex items-center gap-2">
                                                <SeverityDot severity={inc.severity} />
                                                <span className="text-xs font-bold text-slate-700">{inc.type}</span>
                                                <span className={cn(
                                                    "text-xs px-1.5 py-0.5 rounded-full font-medium",
                                                    inc.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                                                )}>{inc.status}</span>
                                            </div>
                                            <span className="text-xs text-slate-400">{inc.time}</span>
                                        </div>
                                        <p className="text-xs text-slate-600 leading-relaxed">{inc.description}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// LOG INCIDENT MODAL
// ─────────────────────────────────────────────────────────────────────────────

function LogIncidentModal({ isOpen, onClose, student }) {
    const [form, setForm] = useState({ type: 'Medical', severity: 'Medium', description: '', action: '' });
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            setSaved(true);
            setTimeout(() => {
                setSaved(false);
                onClose();
            }, 1200);
        }, 1000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-gradient-to-r from-red-50 to-orange-50">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-red-500 flex items-center justify-center">
                            <FileText size={15} className="text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-black text-slate-800">Log Incident</p>
                            {student && <p className="text-xs text-slate-500">{student.name} · {student.class}</p>}
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
                        <X size={16} />
                    </button>
                </div>

                <div className="p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-semibold text-slate-600 block mb-1.5">Incident Type</label>
                            <select
                                value={form.type}
                                onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                                className="w-full h-9 px-3 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-red-400"
                            >
                                {['Medical', 'Injury', 'Behavioral', 'Mental Health', 'Other'].map(t => (
                                    <option key={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-600 block mb-1.5">Severity</label>
                            <select
                                value={form.severity}
                                onChange={e => setForm(f => ({ ...f, severity: e.target.value }))}
                                className="w-full h-9 px-3 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-red-400"
                            >
                                {['Low', 'Medium', 'High', 'Critical'].map(s => (
                                    <option key={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1.5">What happened?</label>
                        <textarea
                            value={form.description}
                            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                            placeholder="Describe the incident in detail..."
                            rows={3}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-red-400 resize-none"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1.5">Action Taken</label>
                        <textarea
                            value={form.action}
                            onChange={e => setForm(f => ({ ...f, action: e.target.value }))}
                            placeholder="First aid given, parents called, sent to hospital..."
                            rows={2}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-red-400 resize-none"
                        />
                    </div>

                    <div className="flex gap-2 pt-1">
                        <button onClick={onClose} className="flex-1 h-10 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving || saved}
                            className={cn(
                                "flex-1 h-10 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2",
                                saved ? "bg-emerald-500 text-white" : "bg-red-500 text-white hover:bg-red-600 active:scale-95"
                            )}
                        >
                            {saving && <Loader2 size={14} className="animate-spin" />}
                            {saved && <CheckCircle size={14} />}
                            {saved ? 'Logged!' : saving ? 'Saving...' : 'Log Incident'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// RECENT INCIDENTS SIDEBAR
// ─────────────────────────────────────────────────────────────────────────────

function RecentIncidents({ onSelectStudent }) {
    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-slate-200">
                <p className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Activity size={12} className="text-red-500" /> Recent Incidents
                </p>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {mockIncidents.map(inc => (
                    <button
                        key={inc.id}
                        onClick={() => {
                            const s = mockStudents.find(st => st.studentId === inc.studentId);
                            if (s) onSelectStudent(s);
                        }}
                        className="w-full p-3 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-left transition-all group"
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <SeverityDot severity={inc.severity} />
                            <span className="text-xs font-bold text-slate-700">{inc.studentName}</span>
                        </div>
                        <p className="text-xs text-slate-500">{inc.class} · {inc.type}</p>
                        <p className="text-xs text-slate-400 mt-1">{inc.time}</p>
                    </button>
                ))}
            </div>

            {/* Emergency numbers */}
            <div className="p-3 border-t border-slate-200 space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Emergency Numbers</p>
                {[
                    { label: 'Ambulance', number: '108', color: 'red' },
                    { label: 'Police', number: '100', color: 'blue' },
                    { label: 'Fire', number: '101', color: 'orange' },
                ].map(e => (
                    <a
                        key={e.label}
                        href={`tel:${e.number}`}
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all group"
                    >
                        <span className="text-xs font-semibold text-slate-600">{e.label}</span>
                        <span className={cn(
                            "text-sm font-black",
                            e.color === 'red' ? 'text-red-600' : e.color === 'blue' ? 'text-blue-600' : 'text-orange-600'
                        )}>{e.number}</span>
                    </a>
                ))}
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// STATS BAR
// ─────────────────────────────────────────────────────────────────────────────

function StatsBar() {
    const highRisk = mockStudents.filter(s => s.hasHighRisk).length;
    const stats = [
        { label: 'Total Students', value: mockStudents.length, icon: User, color: 'slate' },
        { label: 'High Risk', value: highRisk, icon: AlertTriangle, color: 'amber' },
        { label: 'Incidents Today', value: 0, icon: ClipboardList, color: 'blue' },
        { label: 'Resolved', value: 3, icon: CheckCircle, color: 'emerald' },
    ];

    const colorMap = {
        slate: { bg: 'bg-slate-100', text: 'text-slate-600', val: 'text-slate-800' },
        amber: { bg: 'bg-amber-100', text: 'text-amber-600', val: 'text-amber-700' },
        blue: { bg: 'bg-blue-100', text: 'text-blue-600', val: 'text-blue-800' },
        emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', val: 'text-emerald-800' },
    };

    return (
        <div className="grid grid-cols-4 gap-3 mb-4">
            {stats.map(stat => {
                const Icon = stat.icon;
                const c = colorMap[stat.color];
                return (
                    <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3">
                        <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0", c.bg)}>
                            <Icon size={16} className={c.text} />
                        </div>
                        <div>
                            <p className={cn("text-xl font-black leading-none", c.val)}>{stat.value}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{stat.label}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function EmergencyPage() {
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isLogModalOpen, setIsLogModalOpen] = useState(false);

    return (
        <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
            <div className="flex flex-col flex-1 min-h-0 p-5 max-w-[1600px] mx-auto w-full">

                {/* ── Header ── */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center shadow-lg shadow-red-200">
                            <Siren size={20} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-slate-900">Emergency Module</h1>
                            <p className="text-xs text-slate-500">Student emergency profiles, contacts &amp; incident management</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-semibold text-emerald-700">System Active</span>
                        </div>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 transition-all">
                            <RefreshCw size={12} /> Refresh
                        </button>
                    </div>
                </div>

                {/* ── Stats ── */}
                <StatsBar />

                {/* ── Three-column layout — fills all remaining height ── */}
                <div className="grid grid-cols-[300px_1fr_220px] gap-4 flex-1 min-h-0">

                    {/* LEFT: Student search */}
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col shadow-sm">
                        <div className="px-4 py-3 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white flex items-center gap-2">
                            <Search size={13} className="text-red-500" />
                            <span className="text-xs font-black text-slate-700 uppercase tracking-wider">Find Student</span>
                        </div>
                        <StudentSearchPanel
                            onSelect={setSelectedStudent}
                            selectedId={selectedStudent?.id}
                        />
                    </div>

                    {/* CENTER: Emergency profile */}
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col shadow-sm">
                        <EmergencyProfile
                            student={selectedStudent}
                            onLogIncident={() => setIsLogModalOpen(true)}
                        />
                    </div>

                    {/* RIGHT: Recent incidents + emergency numbers */}
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col shadow-sm">
                        <RecentIncidents onSelectStudent={setSelectedStudent} />
                    </div>
                </div>
            </div>

            {/* Log incident modal */}
            <LogIncidentModal
                isOpen={isLogModalOpen}
                onClose={() => setIsLogModalOpen(false)}
                student={selectedStudent}
            />
        </div>
    );
}