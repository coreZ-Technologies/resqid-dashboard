'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
<<<<<<< HEAD
  Search, UserPlus, Download, MoreHorizontal,
  Mail, Phone, BookOpen, Users, Star,
  Clock, Eye, Send, Edit2, Trash2, X
=======
  ArrowLeft, ChevronRight, User, Mail, Phone,
  BookOpen, Lock, Eye, EyeOff, CheckCircle2,
  AlertCircle, Loader2, UserPlus, Plus, X, GraduationCap
>>>>>>> b5086afe9f866127f3983a9dd88f7862e3543847
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { ScrollArea } from '@/components/ui/scroll-area'

<<<<<<< HEAD
// ── Status Config ───────────────────────────────────────────
const STATUS_CONFIG = {
  active: { label: 'Active', variant: 'default' },
  on_leave: { label: 'On Leave', variant: 'secondary' },
  inactive: { label: 'Inactive', variant: 'outline' },
}

// ── Teachers Data ───────────────────────────────────────────
const TEACHERS = [
  {
    id: 1,
    name: 'Mr. Suresh Kumar',
    email: 'suresh.kumar@springdale.in',
    phone: '+91 98765 43210',
    avatar: 'SK',
    avatarColor: 'bg-blue-500',
    subject: 'Mathematics',
    classes: ['Class 8-A', 'Class 9-B', 'Class 10-A'],
    experience: '8 yrs',
    status: 'active',
    rating: 4.8,
    periodsPerWeek: 18,
    joinedDate: 'Jan 2020',
    qualification: 'M.Sc Mathematics',
    maxPeriodsPerDay: 6,
    maxPeriodsPerWeek: 30,
    isPartTime: false,
  },
  {
    id: 2,
    name: 'Ms. Priya Nair',
    email: 'priya.nair@springdale.in',
    phone: '+91 87654 32109',
    avatar: 'PN',
    avatarColor: 'bg-violet-500',
    subject: 'English',
    classes: ['Class 6-A', 'Class 7-B', 'Class 8-A'],
    experience: '5 yrs',
    status: 'active',
    rating: 4.6,
    periodsPerWeek: 15,
    joinedDate: 'Mar 2022',
    qualification: 'M.A English Literature',
    wellness: { isSenior: false },
  },
  {
    id: 3,
    name: 'Mr. Amit Das',
    email: 'amit.das@springdale.in',
    phone: '+91 76543 21098',
    avatar: 'AD',
    avatarColor: 'bg-emerald-500',
    subject: 'Science',
    classes: ['Class 9-A', 'Class 10-B'],
    experience: '10 yrs',
    status: 'active',
    rating: 4.9,
    periodsPerWeek: 20,
    joinedDate: 'Jun 2018',
    qualification: 'M.Sc Physics',
    wellness: { isSenior: true, preferredMaxPerDay: 4 },
  },
  {
    id: 4,
    name: 'Ms. Sunita Roy',
    email: 'sunita.roy@springdale.in',
    phone: '+91 65432 10987',
    avatar: 'SR',
    avatarColor: 'bg-rose-500',
    subject: 'History',
    classes: ['Class 7-A', 'Class 8-B', 'Class 9-A'],
    experience: '6 yrs',
    status: 'on_leave',
    rating: 4.4,
    periodsPerWeek: 12,
    joinedDate: 'Aug 2021',
    qualification: 'M.A History',
  },
  {
    id: 5,
    name: 'Mr. Rakesh Sen',
    email: 'rakesh.sen@springdale.in',
    phone: '+91 54321 09876',
    avatar: 'RS',
    avatarColor: 'bg-amber-500',
    subject: 'Computer Science',
    classes: ['Class 10-A', 'Class 10-B', 'Class 11-A'],
    experience: '4 yrs',
    status: 'active',
    rating: 4.7,
    periodsPerWeek: 16,
    joinedDate: 'Jan 2023',
    qualification: 'B.Tech CSE',
  },
  {
    id: 6,
    name: 'Ms. Meena Ghosh',
    email: 'meena.ghosh@springdale.in',
    phone: '+91 43210 98765',
    avatar: 'MG',
    avatarColor: 'bg-cyan-500',
    subject: 'Geography',
    classes: ['Class 6-B', 'Class 7-A'],
    experience: '3 yrs',
    status: 'active',
    rating: 4.3,
    periodsPerWeek: 10,
    joinedDate: 'Jul 2024',
    qualification: 'M.A Geography',
  },
  {
    id: 7,
    name: 'Mr. Debashish Paul',
    email: 'debashish.paul@springdale.in',
    phone: '+91 32109 87654',
    avatar: 'DP',
    avatarColor: 'bg-orange-500',
    subject: 'Physical Education',
    classes: ['Class 5-A', 'Class 6-A', 'Class 7-B', 'Class 8-A'],
    experience: '7 yrs',
    status: 'active',
    rating: 4.5,
    periodsPerWeek: 22,
    joinedDate: 'Feb 2019',
    qualification: 'B.P.Ed',
  },
  {
    id: 8,
    name: 'Ms. Ananya Bose',
    email: 'ananya.bose@springdale.in',
    phone: '+91 21098 76543',
    avatar: 'AB',
    avatarColor: 'bg-pink-500',
    subject: 'Art & Craft',
    classes: ['Class 5-A', 'Class 5-B', 'Class 6-A'],
    experience: '2 yrs',
    status: 'inactive',
    rating: 4.1,
    periodsPerWeek: 8,
    joinedDate: 'Sep 2024',
    qualification: 'B.F.A',
  },
]

// ── Stat Card ──────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center shrink-0">
          <Icon size={18} className="text-sky-600" />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
          {sub && <p className="text-[11px] text-muted-foreground/60">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  )
}

// ── Teacher Card ───────────────────────────────────────────
function TeacherCard({ teacher, selected, onSelect }) {
  const status = STATUS_CONFIG[teacher.status]

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${selected ? 'ring-2 ring-primary border-primary' : ''}`}
      onClick={() => onSelect(teacher)}
    >
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className={`${teacher.avatarColor} text-white text-xs font-bold`}>
                {teacher.avatar}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold">{teacher.name}</p>
              <p className="text-[11px] text-muted-foreground">{teacher.qualification}</p>
            </div>
          </div>
          <Badge variant={status.variant} className="text-[10px]">
            {status.label}
          </Badge>
        </div>

        {/* Subject */}
        <Badge variant="outline" className="text-[11px] gap-1">
          <BookOpen size={10} />
          {teacher.subject}
        </Badge>

        {/* Classes */}
        <div className="flex flex-wrap gap-1">
          {teacher.classes.map(cls => (
            <span key={cls} className="bg-muted text-muted-foreground text-[10px] px-2 py-0.5 rounded-md">
              {cls}
            </span>
          ))}
        </div>

        {/* Wellness indicators */}
        {teacher.wellness && (
          <div className="flex gap-1.5">
            {teacher.wellness.isPregnant && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <span className="w-5 h-5 rounded-full bg-pink-100 flex items-center justify-center text-[10px]">🤰</span>
                  </TooltipTrigger>
                  <TooltipContent>Pregnant - Ground floor required</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {teacher.wellness.isSenior && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <span className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-[10px]">👴</span>
                  </TooltipTrigger>
                  <TooltipContent>Senior Teacher - Reduced load preferred</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {teacher.wellness.burnoutRisk && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-[10px]">⚠️</span>
                  </TooltipTrigger>
                  <TooltipContent>Burnout Risk - Monitor workload</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {teacher.wellness.needsAccessibleRoom && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[10px]">♿</span>
                  </TooltipTrigger>
                  <TooltipContent>Needs accessible room</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-2 border-t">
          <div className="flex items-center gap-1">
            <Clock size={11} />
            <span>{teacher.periodsPerWeek} periods/wk</span>
          </div>
          <div className="flex items-center gap-1">
            <Star size={11} className="text-amber-400 fill-amber-400" />
            <span className="font-medium text-foreground">{teacher.rating}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ── Detail Panel ───────────────────────────────────────────
function DetailPanel({ teacher, onClose }) {
  if (!teacher) {
    return (
      <Card className="h-full min-h-[400px] flex items-center justify-center">
        <CardContent className="text-center">
          <Users size={24} className="text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">Select a teacher</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Click any card to view details</p>
        </CardContent>
      </Card>
    )
  }

  const status = STATUS_CONFIG[teacher.status]

  return (
    <Card className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-5 rounded-t-xl">
        <div className="flex items-center justify-between mb-3">
          <span className="text-slate-400 text-[10px] uppercase tracking-widest">Teacher Profile</span>
          <Button variant="ghost" size="icon" className="text-white/60 hover:text-white h-6 w-6" onClick={onClose}>
            <X size={14} />
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border-2 border-white/20">
            <AvatarFallback className={`${teacher.avatarColor} text-white text-sm font-bold`}>
              {teacher.avatar}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-white font-bold text-sm">{teacher.name}</h3>
            <p className="text-slate-300 text-[11px]">{teacher.qualification}</p>
            <Badge variant="outline" className="mt-1 text-[10px] bg-white/10 text-white border-white/20">
              {status.label}
            </Badge>
=======
const SUBJECTS = [
  'Mathematics', 'English', 'Science', 'History',
  'Geography', 'Computer Science', 'Art & Craft',
  'Physical Education', 'Hindi', 'Bengali',
]

const CLASSES = [
  'Class 5-A', 'Class 5-B', 'Class 6-A', 'Class 6-B',
  'Class 7-A', 'Class 7-B', 'Class 8-A', 'Class 8-B',
  'Class 9-A', 'Class 9-B', 'Class 10-A', 'Class 10-B',
]

const QUALIFICATIONS = [
  'B.Ed', 'M.Ed', 'B.Sc + B.Ed', 'M.Sc', 'M.A',
  'B.Tech', 'M.Tech', 'B.P.Ed', 'B.F.A', 'Other',
]

// ── Reusable Field ─────────────────────────────────────────
function Field({ label, required, error, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-[11px] text-red-500">
          <AlertCircle size={11} /> {error}
        </p>
      )}
    </div>
  )
}

// ── Input ──────────────────────────────────────────────────
function Input({ icon: Icon, error, ...props }) {
  return (
    <div className="relative">
      {Icon && <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />}
      <input
        {...props}
        className={`w-full ${Icon ? 'pl-9' : 'pl-4'} pr-4 py-2.5 rounded-lg border text-[13px] text-gray-700 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 transition-all ${
          error ? 'border-red-300 focus:ring-red-100 focus:border-red-400' : 'border-violet-100 focus:ring-violet-100 focus:border-violet-300'
        }`}
      />
    </div>
  )
}

// ── Steps ──────────────────────────────────────────────────
function Steps({ current }) {
  const steps = [
    { n: 1, label: 'Personal Info' },
    { n: 2, label: 'Teaching Details' },
    { n: 3, label: 'Access & Confirm' },
  ]
  return (
    <div className="flex items-center">
      {steps.map((s, i) => (
        <div key={s.n} className="flex items-center">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold transition-all ${
              current > s.n ? 'bg-emerald-500 text-white' :
              current === s.n ? 'bg-violet-600 text-white' :
              'bg-violet-50 text-gray-400'
            }`}>
              {current > s.n ? <CheckCircle2 size={14} /> : s.n}
            </div>
            <span className={`text-[11px] font-medium hidden sm:block ${
              current === s.n ? 'text-violet-700' : current > s.n ? 'text-emerald-600' : 'text-gray-400'
            }`}>{s.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-8 sm:w-14 h-px mx-3 transition-all ${current > s.n ? 'bg-emerald-200' : 'bg-violet-100'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

// ── Step 1: Personal Info ──────────────────────────────────
function Step1({ form, setForm, errors }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-[15px] font-semibold text-gray-800">Personal Information</h2>
        <p className="text-gray-500 text-[12px] mt-0.5">Enter the teacher's basic details</p>
      </div>

      {/* Avatar Preview – Minimal border, no shadow */}
      <div className="flex items-center gap-4 p-4 bg-violet-50/30 rounded-lg border border-violet-100">
        <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center text-white text-[18px] font-bold">
          {form.firstName && form.lastName
            ? `${form.firstName[0]}${form.lastName[0]}`.toUpperCase()
            : <User size={22} />}
        </div>
        <div>
          <p className="text-[14px] font-medium text-gray-800">
            {form.firstName || form.lastName ? `${form.salutation} ${form.firstName} ${form.lastName}`.trim() : 'Teacher Name'}
          </p>
          <p className="text-[12px] text-gray-400">{form.email || 'email@school.in'}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">{form.phone || '+91 XXXXX XXXXX'}</p>
        </div>
      </div>

      {/* Salutation + Name */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Salutation" required error={errors.salutation}>
          <select
            value={form.salutation}
            onChange={e => setForm({ ...form, salutation: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-violet-100 text-[13px] text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-violet-100 focus:border-violet-300 transition-all appearance-none"
          >
            <option value="">Select</option>
            <option>Mr.</option>
            <option>Ms.</option>
            <option>Mrs.</option>
            <option>Dr.</option>
          </select>
        </Field>
        <Field label="First Name" required error={errors.firstName}>
          <Input icon={User} placeholder="e.g. Suresh" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} error={errors.firstName} />
        </Field>
        <Field label="Last Name" required error={errors.lastName}>
          <Input placeholder="e.g. Kumar" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} error={errors.lastName} />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Email Address" required error={errors.email}>
          <Input icon={Mail} type="email" placeholder="teacher@school.in" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} error={errors.email} />
        </Field>
        <Field label="Phone Number" required error={errors.phone}>
          <Input icon={Phone} placeholder="+91 98765 43210" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} error={errors.phone} />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Date of Birth">
          <Input type="date" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} />
        </Field>
        <Field label="Gender">
          <select
            value={form.gender}
            onChange={e => setForm({ ...form, gender: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-violet-100 text-[13px] text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-violet-100 focus:border-violet-300 transition-all appearance-none"
          >
            <option value="">Select gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </Field>
      </div>

      <Field label="Address">
        <textarea
          rows={2}
          placeholder="Street, Area, City, State"
          value={form.address}
          onChange={e => setForm({ ...form, address: e.target.value })}
          className="w-full px-4 py-2.5 rounded-lg border border-violet-100 text-[13px] text-gray-700 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-violet-100 focus:border-violet-300 transition-all resize-none"
        />
      </Field>
    </div>
  )
}

// ── Step 2: Teaching Details ───────────────────────────────
function Step2({ form, setForm, errors }) {
  const toggleClass = (cls) => {
    setForm(f => ({
      ...f,
      assignedClasses: f.assignedClasses.includes(cls)
        ? f.assignedClasses.filter(c => c !== cls)
        : [...f.assignedClasses, cls]
    }))
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-[15px] font-semibold text-gray-800">Teaching Details</h2>
        <p className="text-gray-500 text-[12px] mt-0.5">Subject expertise and class assignments</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Primary Subject" required error={errors.subject}>
          <div className="relative">
            <BookOpen size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <select
              value={form.subject}
              onChange={e => setForm({ ...form, subject: e.target.value })}
              className={`w-full pl-9 pr-4 py-2.5 rounded-lg border text-[13px] text-gray-700 bg-white focus:outline-none focus:ring-2 transition-all appearance-none ${
                errors.subject ? 'border-red-300 focus:ring-red-100' : 'border-violet-100 focus:ring-violet-100 focus:border-violet-300'
              }`}
            >
              <option value="">Select subject</option>
              {SUBJECTS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </Field>

        <Field label="Qualification" required error={errors.qualification}>
          <div className="relative">
            <GraduationCap size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <select
              value={form.qualification}
              onChange={e => setForm({ ...form, qualification: e.target.value })}
              className={`w-full pl-9 pr-4 py-2.5 rounded-lg border text-[13px] text-gray-700 bg-white focus:outline-none focus:ring-2 transition-all appearance-none ${
                errors.qualification ? 'border-red-300 focus:ring-red-100' : 'border-violet-100 focus:ring-violet-100 focus:border-violet-300'
              }`}
            >
              <option value="">Select qualification</option>
              {QUALIFICATIONS.map(q => <option key={q}>{q}</option>)}
            </select>
          </div>
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Experience (years)">
          <Input type="number" placeholder="e.g. 5" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} />
        </Field>
        <Field label="Joining Date">
          <Input type="date" value={form.joiningDate} onChange={e => setForm({ ...form, joiningDate: e.target.value })} />
        </Field>
      </div>

      {/* Assign Classes */}
      <Field label="Assign Classes" error={errors.assignedClasses}>
        <div className="mt-1">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] text-gray-400">{form.assignedClasses.length} class(es) selected</p>
            <button onClick={() => setForm(f => ({ ...f, assignedClasses: [] }))} className="text-[11px] text-gray-400 hover:text-gray-600">Clear all</button>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {CLASSES.map(cls => {
              const active = form.assignedClasses.includes(cls)
              return (
                <button
                  key={cls}
                  onClick={() => toggleClass(cls)}
                  className={`py-2 rounded-lg text-[11px] font-medium border transition-all ${
                    active
                      ? 'bg-violet-600 text-white border-violet-600'
                      : 'bg-white text-gray-600 border-violet-100 hover:border-violet-200'
                  }`}
                >
                  {cls}
                </button>
              )
            })}
          </div>
        </div>
      </Field>

      <Field label="Employee ID">
        <Input placeholder="e.g. EMP-2024-001" value={form.employeeId} onChange={e => setForm({ ...form, employeeId: e.target.value })} />
      </Field>
    </div>
  )
}

// ── Step 3: Access & Confirm ───────────────────────────────
function Step3({ form, setForm, errors }) {
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const strength = Math.min(4,
    (form.password.length >= 8 ? 1 : 0) +
    (/[A-Z]/.test(form.password) ? 1 : 0) +
    (/[0-9]/.test(form.password) ? 1 : 0) +
    (/[^A-Za-z0-9]/.test(form.password) ? 1 : 0)
  )
  const strengthColors = ['bg-red-400', 'bg-amber-400', 'bg-violet-400', 'bg-emerald-400']

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-[15px] font-semibold text-gray-800">Portal Access</h2>
        <p className="text-gray-500 text-[12px] mt-0.5">Set login credentials for the teacher portal</p>
      </div>

      {/* Summary Card – no shadow, subtle border */}
      <div className="bg-violet-50/30 rounded-lg border border-violet-100 p-4 space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-3">Review</p>
        {[
          { label: 'Name',         val: `${form.salutation} ${form.firstName} ${form.lastName}`.trim() || '—' },
          { label: 'Email',        val: form.email || '—' },
          { label: 'Subject',      val: form.subject || '—' },
          { label: 'Qualification',val: form.qualification || '—' },
          { label: 'Classes',      val: form.assignedClasses.length ? form.assignedClasses.join(', ') : '—' },
        ].map(({ label, val }) => (
          <div key={label} className="flex justify-between text-[12px]">
            <span className="text-gray-400">{label}</span>
            <span className="text-gray-700 font-medium text-right max-w-[60%] truncate">{val}</span>
          </div>
        ))}
      </div>

      {/* Password */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Password" required error={errors.password}>
          <div className="relative">
            <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className={`w-full pl-9 pr-10 py-2.5 rounded-lg border text-[13px] text-gray-700 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.password ? 'border-red-300 focus:ring-red-100' : 'border-violet-100 focus:ring-violet-100 focus:border-violet-300'
              }`}
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </Field>

        <Field label="Confirm Password" required error={errors.confirmPassword}>
          <div className="relative">
            <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Re-enter password"
              value={form.confirmPassword}
              onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
              className={`w-full pl-9 pr-10 py-2.5 rounded-lg border text-[13px] text-gray-700 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.confirmPassword ? 'border-red-300 focus:ring-red-100' : 'border-violet-100 focus:ring-violet-100 focus:border-violet-300'
              }`}
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
>>>>>>> b5086afe9f866127f3983a9dd88f7862e3543847
          </div>
        </Field>
      </div>

<<<<<<< HEAD
      <ScrollArea className="flex-1 p-4 space-y-4">
        {/* Contact */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Contact</p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 p-2.5 bg-muted rounded-lg text-xs">
              <Mail size={12} className="text-muted-foreground shrink-0" />
              <span className="truncate">{teacher.email}</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 bg-muted rounded-lg text-xs">
              <Phone size={12} className="text-muted-foreground shrink-0" />
              <span>{teacher.phone}</span>
            </div>
=======
      {form.password && (
        <div>
          <div className="flex gap-1 mb-1">
            {[1,2,3,4].map(i => (
              <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthColors[strength - 1] : 'bg-violet-50'}`} />
            ))}
>>>>>>> b5086afe9f866127f3983a9dd88f7862e3543847
          </div>
          <p className="text-[10px] text-gray-400">Use 8+ characters, uppercase, numbers & symbols</p>
        </div>
      )}

<<<<<<< HEAD
        {/* Stats */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Overview</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Subject', val: teacher.subject },
              { label: 'Experience', val: teacher.experience },
              { label: 'Periods/Week', val: teacher.periodsPerWeek },
              { label: 'Max/Day', val: teacher.maxPeriodsPerDay || '-' },
              { label: 'Max/Week', val: teacher.maxPeriodsPerWeek || '-' },
              { label: 'Part-time', val: teacher.isPartTime ? 'Yes' : 'No' },
              { label: 'Rating', val: `${teacher.rating} ⭐` },
              { label: 'Joined', val: teacher.joinedDate },
            ].map(({ label, val }) => (
              <div key={label} className="bg-muted rounded-lg p-2.5">
                <p className="text-[10px] text-muted-foreground">{label}</p>
                <p className="text-xs font-semibold">{val}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Classes */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
            Assigned Classes ({teacher.classes.length})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {teacher.classes.map(cls => (
              <Badge key={cls} variant="secondary" className="text-[11px]">{cls}</Badge>
            ))}
          </div>
        </div>

        {/* Wellness */}
        {teacher.wellness && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Wellness</p>
            <div className="space-y-1.5">
              {teacher.wellness.isPregnant && (
                <div className="flex items-center gap-2 text-xs text-pink-600 bg-pink-50 p-2 rounded-lg">
                  🤰 Pregnant - Ground floor rooms required
                </div>
              )}
              {teacher.wellness.isSenior && (
                <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded-lg">
                  👴 Senior Teacher - {teacher.wellness.preferredMaxPerDay || 4} periods/day preferred
                </div>
              )}
              {teacher.wellness.burnoutRisk && (
                <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-2 rounded-lg">
                  ⚠️ Burnout Risk - Monitor workload carefully
                </div>
              )}
              {teacher.wellness.needsAccessibleRoom && (
                <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 p-2 rounded-lg">
                  ♿ Needs accessible room
                </div>
              )}
              {teacher.wellness.avoidEarlyMorning && (
                <div className="flex items-center gap-2 text-xs text-purple-600 bg-purple-50 p-2 rounded-lg">
                  🌅 Prefers to avoid Period 1
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Quick Actions</p>
          <div className="grid grid-cols-2 gap-2">
            <Button size="sm" variant="outline" className="text-xs gap-1.5">
              <Eye size={12} /> Schedule
            </Button>
            <Button size="sm" variant="outline" className="text-xs gap-1.5">
              <Edit2 size={12} /> Edit
            </Button>
            <Button size="sm" variant="outline" className="text-xs gap-1.5">
              <Send size={12} /> Message
            </Button>
            <Button size="sm" variant="outline" className="text-xs gap-1.5 text-destructive hover:text-destructive">
              <Trash2 size={12} /> Remove
            </Button>
          </div>
        </div>
      </ScrollArea>
    </Card>
  )
}

// ── Main Page ──────────────────────────────────────────────
export default function TeachersPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selected, setSelected] = useState(null)

  const filtered = TEACHERS.filter(t => {
    const matchSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || t.status === statusFilter
    return matchSearch && matchStatus
  })

  const activeCount = TEACHERS.filter(t => t.status === 'active').length
  const onLeaveCount = TEACHERS.filter(t => t.status === 'on_leave').length
  const totalPeriods = TEACHERS.reduce((a, t) => a + t.periodsPerWeek, 0)
  const avgRating = (TEACHERS.reduce((a, t) => a + t.rating, 0) / TEACHERS.length).toFixed(1)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Teachers</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Manage teaching staff, subjects, wellness & schedules</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download size={14} /> Export
          </Button>
          <Link href="/school/teachers/add">
            <Button size="sm" className="gap-2">
              <UserPlus size={14} /> Add Teacher
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Teachers" value={TEACHERS.length} sub={`${activeCount} active`} />
        <StatCard icon={Star} label="Avg Rating" value={avgRating} sub="Across all staff" />
        <StatCard icon={BookOpen} label="Periods/Week" value={totalPeriods} sub="All classes combined" />
        <StatCard icon={Clock} label="On Leave" value={onLeaveCount} sub="Currently unavailable" />
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, subject, or email..."
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="on_leave">On Leave</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Cards */}
        <div className="xl:col-span-2">
          {filtered.length === 0 ? (
            <Card className="p-12 text-center">
              <Users size={24} className="text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground font-medium">No teachers found</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Try adjusting your search or filters</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map(t => (
                <TeacherCard
                  key={t.id}
                  teacher={t}
                  selected={selected?.id === t.id}
                  onSelect={setSelected}
                />
              ))}
            </div>
          )}
=======
      {/* Role */}
      <Field label="Portal Role">
        <div className="grid grid-cols-2 gap-3">
          {['Teacher', 'Class Teacher'].map(role => (
            <button
              key={role}
              onClick={() => setForm({ ...form, role })}
              className={`py-2.5 rounded-lg border text-[12px] font-medium transition-all ${
                form.role === role ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-gray-600 border-violet-100 hover:border-violet-200'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </Field>
    </div>
  )
}

// ── Success ────────────────────────────────────────────────
function SuccessScreen({ form }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
      <div className="w-16 h-16 rounded-lg bg-emerald-500 flex items-center justify-center">
        <CheckCircle2 size={30} className="text-white" />
      </div>
      <div>
        <h2 className="text-[20px] font-bold text-gray-800">Teacher Added!</h2>
        <p className="text-gray-500 text-[13px] mt-1">
          <span className="font-semibold text-gray-700">{form.salutation} {form.firstName} {form.lastName}</span> has been registered successfully
        </p>
      </div>
      <div className="bg-violet-50/30 border border-violet-100 rounded-lg p-5 w-full max-w-sm text-left space-y-3">
        {[
          { label: 'Email',   val: form.email },
          { label: 'Subject', val: form.subject },
          { label: 'Classes', val: `${form.assignedClasses.length} assigned` },
          { label: 'Role',    val: form.role },
        ].map(({ label, val }) => (
          <div key={label} className="flex justify-between text-[12px]">
            <span className="text-gray-400">{label}</span>
            <span className="text-gray-700 font-medium">{val}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-3 pt-2">
        <Link href="/school/teachers" className="px-5 py-2.5 rounded-lg border border-violet-100 text-gray-600 text-[13px] font-medium hover:bg-violet-50 transition-colors">
          Back to Teachers
        </Link>
        <Link href="/school/teachers/add" className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-violet-500 to-violet-700 text-white text-[13px] font-medium hover:opacity-90 transition-opacity shadow-sm shadow-violet-200">
          Add Another
        </Link>
      </div>
    </div>
  )
}

// ── Main ───────────────────────────────────────────────────
export default function AddTeacherPage() {
  const [step, setStep]           = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]     = useState(false)
  const [errors, setErrors]       = useState({})

  const [form, setForm] = useState({
    salutation: '', firstName: '', lastName: '', email: '',
    phone: '', dob: '', gender: '', address: '',
    subject: '', qualification: '', experience: '',
    joiningDate: '', assignedClasses: [], employeeId: '',
    password: '', confirmPassword: '', role: 'Teacher',
  })

  function validateStep1() {
    const e = {}
    if (!form.firstName.trim())  e.firstName = 'Required'
    if (!form.lastName.trim())   e.lastName  = 'Required'
    if (!form.email.trim())      e.email     = 'Required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email'
    if (!form.phone.trim())      e.phone     = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function validateStep2() {
    const e = {}
    if (!form.subject)                    e.subject         = 'Select a subject'
    if (!form.qualification)              e.qualification   = 'Select qualification'
    if (form.assignedClasses.length === 0) e.assignedClasses = 'Assign at least one class'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function validateStep3() {
    const e = {}
    if (!form.password)                           e.password        = 'Required'
    else if (form.password.length < 8)            e.password        = 'Min 8 characters'
    if (form.password !== form.confirmPassword)   e.confirmPassword = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleNext() {
    if (step === 1 && !validateStep1()) return
    if (step === 2 && !validateStep2()) return
    setErrors({})
    setStep(s => s + 1)
  }

  async function handleSubmit() {
    if (!validateStep3()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) return (
    <div className="p-6 max-w-2xl mx-auto">
      <SuccessScreen form={form} />
    </div>
  )

  return (
    <div className="min-h-screen bg-violet-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2">
          <Link href="/school/teachers" className="flex items-center gap-1.5 text-[12px] text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft size={13} /> Teachers
          </Link>
          <ChevronRight size={11} className="text-violet-200" />
          <span className="text-[12px] text-gray-600 font-medium">Add Teacher</span>
>>>>>>> b5086afe9f866127f3983a9dd88f7862e3543847
        </div>

        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center">
            <UserPlus size={16} className="text-white" />
          </div>
          <div>
            <h1 className="text-[22px] font-bold text-gray-800">Add New Teacher</h1>
            <p className="text-gray-500 text-[13px]">Register a new staff member to the school</p>
          </div>
        </div>

<<<<<<< HEAD
      {/* Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Staff Directory</CardTitle>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[11px]">Teacher</TableHead>
              <TableHead className="text-[11px]">Subject</TableHead>
              <TableHead className="text-[11px]">Classes</TableHead>
              <TableHead className="text-[11px]">Periods/Wk</TableHead>
              <TableHead className="text-[11px]">Rating</TableHead>
              <TableHead className="text-[11px]">Status</TableHead>
              <TableHead className="text-[11px]">Wellness</TableHead>
              <TableHead className="text-[11px] w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {TEACHERS.map(t => (
              <TableRow key={t.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelected(t)}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className={`${t.avatarColor} text-white text-[10px] font-bold`}>
                        {t.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-xs font-medium">{t.name}</p>
                      <p className="text-[10px] text-muted-foreground">{t.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-[10px]">{t.subject}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {t.classes.slice(0, 2).map(c => (
                      <Badge key={c} variant="secondary" className="text-[10px]">{c}</Badge>
                    ))}
                    {t.classes.length > 2 && (
                      <Badge variant="secondary" className="text-[10px]">+{t.classes.length - 2}</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-xs font-medium">{t.periodsPerWeek}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Star size={11} className="text-amber-400 fill-amber-400" />
                    <span className="text-xs font-semibold">{t.rating}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={STATUS_CONFIG[t.status].variant} className="text-[10px]">
                    {STATUS_CONFIG[t.status].label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {t.wellness?.isPregnant && <span className="text-xs">🤰</span>}
                    {t.wellness?.isSenior && <span className="text-xs">👴</span>}
                    {t.wellness?.burnoutRisk && <span className="text-xs">⚠️</span>}
                    {t.wellness?.needsAccessibleRoom && <span className="text-xs">♿</span>}
                  </div>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <MoreHorizontal size={12} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
=======
        {/* Steps indicator – minimal, no shadow */}
        <div className="bg-white rounded-lg border border-violet-100 p-5">
          <Steps current={step} />
        </div>

        {/* Form container – no shadow, clean border */}
        <div className="bg-white rounded-lg border border-violet-100 p-6">
          {step === 1 && <Step1 form={form} setForm={setForm} errors={errors} />}
          {step === 2 && <Step2 form={form} setForm={setForm} errors={errors} />}
          {step === 3 && <Step3 form={form} setForm={setForm} errors={errors} />}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => step > 1 && setStep(s => s - 1)}
            disabled={step === 1}
            className={`px-5 py-2.5 rounded-lg border border-violet-100 text-gray-600 text-[13px] font-medium transition-colors ${step === 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-violet-50'}`}
          >
            ← Back
          </button>

          <div className="flex items-center gap-2">
            {[1,2,3].map(n => (
              <div key={n} className={`h-1.5 rounded-full transition-all ${n === step ? 'w-6 bg-violet-600' : 'w-1.5 bg-violet-200'}`} />
            ))}
          </div>

          {step < 3 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-violet-500 to-violet-700 text-white text-[13px] font-medium hover:opacity-90 transition-opacity shadow-sm shadow-violet-200"
            >
              Continue <ChevronRight size={14} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-violet-500 to-violet-700 text-white text-[13px] font-medium hover:opacity-90 transition-opacity shadow-sm shadow-violet-200 disabled:opacity-70"
            >
              {loading ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : <><CheckCircle2 size={14} /> Add Teacher</>}
            </button>
          )}
        </div>
      </div>
>>>>>>> b5086afe9f866127f3983a9dd88f7862e3543847
    </div>
  )
}