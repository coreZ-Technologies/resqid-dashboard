'use client'

import { useState } from 'react'
import {
  AlertTriangle, Phone, User, Users, Search,
  Plus, Download, ChevronRight, Mail, MapPin,
  Heart, Shield, Edit2, Trash2, ChevronDown,
  CheckCircle2, XCircle, Clock, Filter,
  Ambulance, Building2, UserCheck, MoreHorizontal,
  RefreshCw, PhoneCall, PhoneMissed
} from 'lucide-react'
import Link from 'next/link'

// ── Mock Data ──────────────────────────────────────────────────────────────────

const STATS = [
  { label: 'Students with Contacts',  value: 318, total: 342, icon: Users,     color: 'bg-emerald-500' },
  { label: 'Missing Contacts',        value: 24,  total: 342, icon: XCircle,   color: 'bg-rose-500'    },
  { label: 'Medical Alerts',          value: 11,              icon: Heart,     color: 'bg-amber-500'   },
  { label: 'Verified Numbers',        value: 601,             icon: PhoneCall, color: 'bg-sky-500'     },
]

const CONTACTS = [
  {
    id: 'STU-001',
    studentName: 'Priya Sharma',
    studentClass: 'Class 8-A',
    rollNo: '08A-12',
    avatar: 'PS',
    avatarColor: 'bg-blue-500',
    bloodGroup: 'B+',
    medicalAlert: 'Asthma — carries inhaler',
    contacts: [
      { name: 'Rajan Sharma',   relation: 'Father', phone: '+91 98301 11234', email: 'rajan.s@gmail.com',   primary: true,  verified: true  },
      { name: 'Sunita Sharma',  relation: 'Mother', phone: '+91 98301 55678', email: 'sunita.s@gmail.com',  primary: false, verified: true  },
    ],
    address: '14B, Salt Lake, Kolkata - 700091',
  },
  {
    id: 'STU-002',
    studentName: 'Rohit Dey',
    studentClass: 'Class 10-A',
    rollNo: '10A-05',
    avatar: 'RD',
    avatarColor: 'bg-emerald-500',
    bloodGroup: 'O+',
    medicalAlert: null,
    contacts: [
      { name: 'Subhash Dey',    relation: 'Father', phone: '+91 90071 22345', email: 'subhash.d@gmail.com', primary: true,  verified: true  },
      { name: 'Anita Dey',      relation: 'Mother', phone: '+91 90071 66789', email: null,                  primary: false, verified: false },
    ],
    address: '7, Ballygunge Place, Kolkata - 700019',
  },
  {
    id: 'STU-003',
    studentName: 'Sneha Bose',
    studentClass: 'Class 7-C',
    rollNo: '07C-21',
    avatar: 'SB',
    avatarColor: 'bg-rose-500',
    bloodGroup: 'A+',
    medicalAlert: 'Nut allergy — carries EpiPen',
    contacts: [
      { name: 'Tapan Bose',     relation: 'Father', phone: '+91 93301 33456', email: 'tapan.b@yahoo.com',   primary: true,  verified: true  },
    ],
    address: '3, Gariahat Road, Kolkata - 700029',
  },
  {
    id: 'STU-004',
    studentName: 'Dev Chatterjee',
    studentClass: 'Class 9-B',
    rollNo: '09B-08',
    avatar: 'DC',
    avatarColor: 'bg-amber-500',
    bloodGroup: 'AB-',
    medicalAlert: null,
    contacts: [
      { name: 'Amit Chatterjee',relation: 'Father', phone: '+91 98741 44567', email: 'amit.c@gmail.com',    primary: true,  verified: true  },
      { name: 'Rupa Chatterjee', relation: 'Mother', phone: '+91 98741 88901', email: 'rupa.c@gmail.com',   primary: false, verified: true  },
      { name: 'Dr. S. Mukherjee',relation: 'Doctor', phone: '+91 33 2222 1111', email: null,               primary: false, verified: false },
    ],
    address: '22, Jodhpur Park, Kolkata - 700068',
  },
  {
    id: 'STU-005',
    studentName: 'Kavya Nair',
    studentClass: 'Class 6-A',
    rollNo: '06A-17',
    avatar: 'KN',
    avatarColor: 'bg-pink-500',
    bloodGroup: 'O-',
    medicalAlert: 'Diabetic — insulin dependent',
    contacts: [
      { name: 'Krishnan Nair',  relation: 'Father', phone: '+91 94401 55678', email: 'k.nair@gmail.com',    primary: true,  verified: true  },
      { name: 'Meera Nair',     relation: 'Mother', phone: '+91 94401 99012', email: 'meera.n@gmail.com',   primary: false, verified: true  },
    ],
    address: '9, Southern Avenue, Kolkata - 700029',
  },
  {
    id: 'STU-006',
    studentName: 'Arjun Sharma',
    studentClass: 'Class 5-B',
    rollNo: '05B-03',
    avatar: 'AS',
    avatarColor: 'bg-violet-500',
    bloodGroup: 'B-',
    medicalAlert: null,
    contacts: [],
    address: null,
  },
  {
    id: 'STU-007',
    studentName: 'Rahul Gupta',
    studentClass: 'Class 11-B',
    rollNo: '11B-14',
    avatar: 'RG',
    avatarColor: 'bg-indigo-500',
    bloodGroup: 'A-',
    medicalAlert: null,
    contacts: [
      { name: 'Suresh Gupta',   relation: 'Father', phone: '+91 99031 66789', email: 'suresh.g@gmail.com',  primary: true,  verified: false },
    ],
    address: '55, Lansdowne Road, Kolkata - 700029',
  },
]

const RELATION_META = {
  Father:  { color: 'text-sky-700',     bg: 'bg-sky-50',     border: 'border-sky-200'     },
  Mother:  { color: 'text-pink-700',    bg: 'bg-pink-50',    border: 'border-pink-200'    },
  Guardian:{ color: 'text-violet-700',  bg: 'bg-violet-50',  border: 'border-violet-200'  },
  Doctor:  { color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  default: { color: 'text-slate-700',   bg: 'bg-slate-50',   border: 'border-slate-200'   },
}

const BLOOD_COLORS = {
  'A+': 'bg-red-100 text-red-700', 'A-': 'bg-red-100 text-red-700',
  'B+': 'bg-orange-100 text-orange-700', 'B-': 'bg-orange-100 text-orange-700',
  'O+': 'bg-amber-100 text-amber-700', 'O-': 'bg-amber-100 text-amber-700',
  'AB+': 'bg-purple-100 text-purple-700', 'AB-': 'bg-purple-100 text-purple-700',
}

const CLASS_FILTERS = ['All Classes', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12']
const STATUS_FILTERS = ['All', 'Complete', 'Missing', 'Medical Alert']

// ── Sub-components ─────────────────────────────────────────────────────────────

function StatCard({ label, value, total, icon: Icon, color }) {
  const pct = total ? Math.round((value / total) * 100) : null
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={18} className="text-white" />
        </div>
        {pct !== null && (
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">{pct}%</span>
        )}
      </div>
      <p className="text-[26px] font-bold text-slate-800 leading-tight">{value}</p>
      <p className="text-[12px] text-slate-500 mt-0.5">{label}</p>
      {total && (
        <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${color}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </div>
  )
}

function RelationBadge({ relation }) {
  const m = RELATION_META[relation] || RELATION_META.default
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${m.bg} ${m.color} ${m.border}`}>
      {relation}
    </span>
  )
}

function ContactRow({ contact }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-[12px] font-semibold text-slate-700">{contact.name}</p>
          <RelationBadge relation={contact.relation} />
          {contact.primary && (
            <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded-full">PRIMARY</span>
          )}
          {contact.verified
            ? <CheckCircle2 size={11} className="text-emerald-500" />
            : <Clock size={11} className="text-amber-400" title="Unverified" />
          }
        </div>
        <div className="flex items-center gap-3 mt-1 flex-wrap">
          <a href={`tel:${contact.phone}`} className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-sky-600 transition-colors">
            <Phone size={9} /> {contact.phone}
          </a>
          {contact.email && (
            <a href={`mailto:${contact.email}`} className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-sky-600 transition-colors truncate">
              <Mail size={9} /> {contact.email}
            </a>
          )}
        </div>
      </div>
      <a
        href={`tel:${contact.phone}`}
        className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center hover:bg-emerald-100 transition-colors shrink-0"
        title="Call"
      >
        <Phone size={12} className="text-emerald-600" />
      </a>
    </div>
  )
}

function StudentCard({ student, selected, onSelect }) {
  const hasContacts = student.contacts.length > 0
  const isSelected = selected === student.id
  const allVerified = student.contacts.every(c => c.verified)

  return (
    <div
      onClick={() => onSelect(isSelected ? null : student.id)}
      className={`bg-white rounded-2xl border shadow-sm overflow-hidden cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'border-indigo-300 ring-2 ring-indigo-100'
          : 'border-slate-100 hover:border-slate-200 hover:shadow-md'
      }`}
    >
      {/* Student header */}
      <div className="flex items-center gap-3 p-4">
        <div className={`w-10 h-10 rounded-full ${student.avatarColor} flex items-center justify-center text-white text-[12px] font-bold shrink-0`}>
          {student.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-[13px] font-bold text-slate-800 truncate">{student.studentName}</p>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${BLOOD_COLORS[student.bloodGroup] || 'bg-slate-100 text-slate-600'}`}>
              {student.bloodGroup}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">{student.studentClass} · Roll {student.rollNo}</p>
        </div>
        <div className="shrink-0">
          {!hasContacts
            ? <span className="flex items-center gap-1 text-[10px] font-semibold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-1 rounded-full"><XCircle size={10} /> Missing</span>
            : allVerified
              ? <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full"><CheckCircle2 size={10} /> Verified</span>
              : <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-1 rounded-full"><Clock size={10} /> Pending</span>
          }
        </div>
      </div>

      {/* Medical alert */}
      {student.medicalAlert && (
        <div className="mx-4 mb-3 flex items-start gap-2 px-3 py-2 rounded-xl bg-rose-50 border border-rose-200">
          <Heart size={12} className="text-rose-500 mt-0.5 shrink-0" />
          <p className="text-[11px] text-rose-700 font-medium leading-snug">{student.medicalAlert}</p>
        </div>
      )}

      {/* Contacts preview (collapsed) */}
      {!isSelected && hasContacts && (
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2 flex-wrap">
            {student.contacts.slice(0, 2).map((c, i) => (
              <span key={i} className="flex items-center gap-1.5 text-[11px] text-slate-500 bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1.5">
                <Phone size={9} className="text-slate-400" />
                {c.name} <RelationBadge relation={c.relation} />
              </span>
            ))}
            {student.contacts.length > 2 && (
              <span className="text-[11px] text-slate-400">+{student.contacts.length - 2} more</span>
            )}
          </div>
        </div>
      )}

      {/* Expanded contacts */}
      {isSelected && (
        <div className="px-4 pb-4 space-y-3 border-t border-slate-50 pt-3">
          {hasContacts ? (
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">Emergency Contacts</p>
              <div>
                {student.contacts.map((c, i) => <ContactRow key={i} contact={c} />)}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center py-4 gap-2">
              <PhoneMissed size={22} className="text-slate-200" />
              <p className="text-[12px] text-slate-400 font-medium">No contacts added</p>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500 text-white text-[11px] font-semibold hover:bg-indigo-600 transition-colors">
                <Plus size={11} /> Add Contact
              </button>
            </div>
          )}

          {student.address && (
            <div className="flex items-start gap-2 pt-1">
              <MapPin size={11} className="text-slate-400 mt-0.5 shrink-0" />
              <p className="text-[11px] text-slate-500">{student.address}</p>
            </div>
          )}

          {hasContacts && (
            <div className="flex gap-2 pt-1">
              <Link
                href={`/school/students/${student.id}`}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-slate-200 text-slate-600 text-[11px] font-semibold hover:bg-slate-50 transition-colors"
                onClick={e => e.stopPropagation()}
              >
                <User size={12} /> View Profile
              </Link>
              <button
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-700 text-[11px] font-semibold hover:bg-indigo-100 transition-colors"
                onClick={e => e.stopPropagation()}
              >
                <Edit2 size={12} /> Edit Contacts
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function EmergencyContactsPage() {
  const [search, setSearch] = useState('')
  const [classFilter, setClassFilter] = useState('All Classes')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selected, setSelected] = useState(null)

  const filtered = CONTACTS.filter(s => {
    const matchSearch =
      !search ||
      s.studentName.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(search.toLowerCase()) ||
      s.contacts.some(c => c.name.toLowerCase().includes(search.toLowerCase()))

    const matchClass =
      classFilter === 'All Classes' ||
      s.studentClass.startsWith(classFilter)

    const matchStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Missing' && s.contacts.length === 0) ||
      (statusFilter === 'Complete' && s.contacts.length > 0) ||
      (statusFilter === 'Medical Alert' && s.medicalAlert)

    return matchSearch && matchClass && matchStatus
  })

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={20} className="text-amber-500" />
            <h1 className="text-[22px] font-bold text-slate-800">Emergency Contacts</h1>
          </div>
          <p className="text-[13px] text-slate-500">Manage and verify student emergency contacts and medical information</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 text-[12px] text-slate-600 hover:bg-slate-50 transition-colors">
            <Download size={13} />
            Export
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-[12px] font-semibold transition-colors">
            <Plus size={13} />
            Add Contact
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* ── Alert banner for missing contacts ── */}
      {CONTACTS.filter(s => s.contacts.length === 0).length > 0 && (
        <div className="flex items-start gap-3 px-5 py-4 rounded-2xl bg-rose-50 border border-rose-200">
          <AlertTriangle size={16} className="text-rose-500 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-[13px] font-semibold text-rose-700">
              {CONTACTS.filter(s => s.contacts.length === 0).length} students have no emergency contacts
            </p>
            <p className="text-[12px] text-rose-600 mt-0.5">
              Please collect contact information for these students. Click "Missing" filter to view them.
            </p>
          </div>
          <button
            onClick={() => setStatusFilter('Missing')}
            className="shrink-0 px-3 py-1.5 rounded-xl bg-rose-500 text-white text-[11px] font-semibold hover:bg-rose-600 transition-colors"
          >
            View Missing
          </button>
        </div>
      )}

      {/* ── Filters ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search student or contact name…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-[12px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all"
          />
        </div>

        {/* Status tabs */}
        <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-0.5">
          {STATUS_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all whitespace-nowrap ${
                statusFilter === f
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Class filter */}
        <div className="relative">
          <select
            value={classFilter}
            onChange={e => setClassFilter(e.target.value)}
            className="appearance-none pl-3 pr-7 py-2 rounded-xl border border-slate-200 text-[12px] text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white cursor-pointer"
          >
            {CLASS_FILTERS.map(f => <option key={f}>{f}</option>)}
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* ── Cards Grid ── */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-20 flex flex-col items-center gap-3">
          <Users size={36} className="text-slate-200" />
          <p className="text-[14px] font-semibold text-slate-400">No students found</p>
          <p className="text-[12px] text-slate-300">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(student => (
            <StudentCard
              key={student.id}
              student={student}
              selected={selected}
              onSelect={setSelected}
            />
          ))}
        </div>
      )}

      {/* Footer count */}
      <p className="text-[11px] text-slate-400 text-center pb-2">
        Showing {filtered.length} of {CONTACTS.length} students
      </p>
    </div>
  )
}