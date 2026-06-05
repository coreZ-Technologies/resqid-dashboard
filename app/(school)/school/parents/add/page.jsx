'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, User, Mail, Phone, MapPin, Lock,
  Eye, EyeOff, UserPlus, CheckCircle2, AlertCircle,
  ChevronRight, Plus, Trash2, Search, CreditCard,
  Shield, Bell, Users, Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Dummy students to link ─────────────────────────────────
const ALL_STUDENTS = [
  { id: 'S001', name: 'Priya Sharma',    class: 'Class 8-A', rfid: 'RFID-2341', avatar: 'PS', color: 'bg-blue-500' },
  { id: 'S002', name: 'Arjun Sharma',   class: 'Class 5-B', rfid: 'RFID-2342', avatar: 'AS', color: 'bg-violet-500' },
  { id: 'S003', name: 'Rohit Dey',      class: 'Class 10-A', rfid: 'RFID-1891', avatar: 'RD', color: 'bg-emerald-500' },
  { id: 'S004', name: 'Sneha Bose',     class: 'Class 7-C', rfid: 'RFID-3012', avatar: 'SB', color: 'bg-rose-500' },
  { id: 'S005', name: 'Dev Chatterjee', class: 'Class 9-B', rfid: 'RFID-4201', avatar: 'DC', color: 'bg-amber-500' },
  { id: 'S006', name: 'Dia Chatterjee', class: 'Class 3-A', rfid: 'RFID-4202', avatar: 'DC', color: 'bg-cyan-500' },
  { id: 'S007', name: 'Kavya Nair',     class: 'Class 6-A', rfid: 'RFID-5101', avatar: 'KN', color: 'bg-pink-500' },
  { id: 'S008', name: 'Rahul Gupta',    class: 'Class 11-B', rfid: 'RFID-6301', avatar: 'RG', color: 'bg-indigo-500' },
]

// ── Reusable field wrapper (Notion style) ─────────────────
function Field({ label, required, error, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
        {label}
        {required && <span className="text-rose-400">*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-[10px] text-rose-500">
          <AlertCircle size={10} /> {error}
        </p>
      )}
    </div>
  )
}

// ── Input (Notion style) ──────────────────────────────────
function Input({ icon: Icon, error, ...props }) {
  return (
    <div className="relative">
      {Icon && <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />}
      <input
        {...props}
        className={cn(
          'w-full',
          Icon ? 'pl-9' : 'pl-4',
          'pr-4 py-2 rounded-md border text-sm text-gray-700 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-1 transition-all',
          error
            ? 'border-rose-300 focus:ring-rose-100 focus:border-rose-400'
            : 'border-gray-200 focus:ring-violet-100 focus:border-violet-300'
        )}
      />
    </div>
  )
}

// ── Step indicator (Notion style) ─────────────────────────
function Steps({ current }) {
  const steps = [
    { n: 1, label: 'Basic Info' },
    { n: 2, label: 'Link Children' },
    { n: 3, label: 'Preferences' },
  ]
  return (
    <div className="flex items-center gap-0">
      {steps.map((s, i) => (
        <div key={s.n} className="flex items-center">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
              current > s.n
                ? 'bg-emerald-500 text-white'
                : current === s.n
                  ? 'bg-gradient-to-r from-violet-500 to-violet-700 text-white'
                  : 'bg-gray-100 text-gray-400'
            }`}>
              {current > s.n ? <CheckCircle2 size={14} /> : s.n}
            </div>
            <span className={`text-[11px] font-medium hidden sm:block ${current === s.n ? 'text-violet-700' : current > s.n ? 'text-emerald-600' : 'text-gray-400'}`}>
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-8 sm:w-16 h-px mx-3 transition-all ${current > s.n ? 'bg-emerald-200' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

// ── Step 1: Basic Info (Notion style) ─────────────────────
function Step1({ form, setForm, errors }) {
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const strength = Math.min(4,
    (form.password.length >= 8 ? 1 : 0) +
    (/[A-Z]/.test(form.password) ? 1 : 0) +
    (/[0-9]/.test(form.password) ? 1 : 0) +
    (/[^A-Za-z0-9]/.test(form.password) ? 1 : 0)
  )
  const strengthColors = ['bg-rose-400', 'bg-amber-400', 'bg-violet-400', 'bg-emerald-400']

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-[15px] font-semibold text-gray-800">Parent Information</h2>
        <p className="text-gray-500 text-xs mt-0.5">Enter the parent's personal and contact details</p>
      </div>

      {/* Avatar preview – minimal */}
      <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-md border border-gray-200">
        <div className="w-12 h-12 rounded-md bg-gradient-to-r from-violet-500 to-violet-700 flex items-center justify-center text-white text-lg font-bold">
          {form.firstName && form.lastName
            ? `${form.firstName[0]}${form.lastName[0]}`.toUpperCase()
            : <User size={20} />}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">
            {form.firstName || form.lastName ? `${form.firstName} ${form.lastName}`.trim() : 'Parent Name'}
          </p>
          <p className="text-[11px] text-gray-500">{form.email || 'email@example.com'}</p>
          <p className="text-[10px] text-gray-500 mt-0.5">{form.phone || '+91 XXXXX XXXXX'}</p>
        </div>
      </div>

      {/* Name row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="First Name" required error={errors.firstName}>
          <Input
            icon={User}
            placeholder="e.g. Rajesh"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            error={errors.firstName}
          />
        </Field>
        <Field label="Last Name" required error={errors.lastName}>
          <Input
            placeholder="e.g. Sharma"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            error={errors.lastName}
          />
        </Field>
      </div>

      <Field label="Email Address" required error={errors.email}>
        <Input
          icon={Mail}
          type="email"
          placeholder="parent@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          error={errors.email}
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Phone Number" required error={errors.phone}>
          <Input
            icon={Phone}
            placeholder="+91 98765 43210"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            error={errors.phone}
          />
        </Field>
        <Field label="Relation to Child" required error={errors.relation}>
          <div className="relative">
            <Users size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <select
              value={form.relation}
              onChange={(e) => setForm({ ...form, relation: e.target.value })}
              className={cn(
                'w-full pl-9 pr-4 py-2 rounded-md border text-sm text-gray-700 bg-white focus:outline-none focus:ring-1 transition-all appearance-none',
                errors.relation
                  ? 'border-rose-300 focus:ring-rose-100 focus:border-rose-400'
                  : 'border-gray-200 focus:ring-violet-100 focus:border-violet-300'
              )}
            >
              <option value="">Select relation</option>
              <option value="father">Father</option>
              <option value="mother">Mother</option>
              <option value="guardian">Guardian</option>
              <option value="grandparent">Grandparent</option>
              <option value="other">Other</option>
            </select>
          </div>
          {errors.relation && <p className="flex items-center gap-1 text-[10px] text-rose-500"><AlertCircle size={10} /> {errors.relation}</p>}
        </Field>
      </div>

      <Field label="Address">
        <div className="relative">
          <MapPin size={14} className="absolute left-3.5 top-3 text-gray-400 pointer-events-none" />
          <textarea
            rows={2}
            placeholder="Street, Area, City, State"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full pl-9 pr-4 py-2 rounded-md border border-gray-200 text-sm text-gray-700 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-1 focus:ring-violet-100 focus:border-violet-300 transition-all resize-none"
          />
        </div>
      </Field>

      <div className="pt-2 border-t border-gray-200">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-3">Portal Access</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Password" required error={errors.password}>
            <div className="relative">
              <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={cn(
                  'w-full pl-9 pr-10 py-2 rounded-md border text-sm text-gray-700 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-1 transition-all',
                  errors.password
                    ? 'border-rose-300 focus:ring-rose-100 focus:border-rose-400'
                    : 'border-gray-200 focus:ring-violet-100 focus:border-violet-300'
                )}
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {errors.password && <p className="flex items-center gap-1 text-[10px] text-rose-500"><AlertCircle size={10} /> {errors.password}</p>}
          </Field>
          <Field label="Confirm Password" required error={errors.confirmPassword}>
            <div className="relative">
              <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showConfirm ? 'text' : 'password'}
                placeholder="Re-enter password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                className={cn(
                  'w-full pl-9 pr-10 py-2 rounded-md border text-sm text-gray-700 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-1 transition-all',
                  errors.confirmPassword
                    ? 'border-rose-300 focus:ring-rose-100 focus:border-rose-400'
                    : 'border-gray-200 focus:ring-violet-100 focus:border-violet-300'
                )}
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {errors.confirmPassword && <p className="flex items-center gap-1 text-[10px] text-rose-500"><AlertCircle size={10} /> {errors.confirmPassword}</p>}
          </Field>
        </div>

        {form.password && (
          <div className="mt-3">
            <div className="flex gap-1 mb-1">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={cn('h-1 flex-1 rounded-full transition-all', i <= strength ? strengthColors[strength - 1] : 'bg-gray-200')} />
              ))}
            </div>
            <p className="text-[9px] text-gray-500">
              Use 8+ characters, uppercase, numbers & symbols for a strong password
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Step 2: Link Children (Notion style) ──────────────────
function Step2({ linked, setLinked }) {
  const [search, setSearch] = useState('')

  const available = ALL_STUDENTS.filter(
    (s) =>
      !linked.find((l) => l.id === s.id) &&
      (s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.class.toLowerCase().includes(search.toLowerCase()) ||
        s.rfid.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-[15px] font-semibold text-gray-800">Link Children</h2>
        <p className="text-gray-500 text-xs mt-0.5">Search and add the students this parent is responsible for</p>
      </div>

      {linked.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Linked ({linked.length})</p>
          {linked.map((s) => (
            <div key={s.id} className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-md">
              <div className={`w-8 h-8 rounded-md ${s.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                {s.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-800">{s.name}</p>
                <p className="text-[10px] text-gray-500">{s.class} · {s.rfid}</p>
              </div>
              <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
              <button
                onClick={() => setLinked(linked.filter((l) => l.id !== s.id))}
                className="p-1 rounded-md hover:bg-rose-50 text-gray-500 hover:text-rose-600 transition-colors"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, class, or RFID..."
          className="w-full pl-9 pr-3 py-2 rounded-md border border-gray-200 text-sm text-gray-700 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-1 focus:ring-violet-100 focus:border-violet-300 transition-all"
        />
      </div>

      <div className="space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
          Available Students ({available.length})
        </p>
        {available.length === 0 ? (
          <div className="py-8 text-center bg-gray-50 rounded-md border border-gray-200">
            <p className="text-xs text-gray-500">No students found</p>
          </div>
        ) : (
          available.map((s) => (
            <div key={s.id} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-md hover:border-violet-200 hover:bg-violet-50/30 transition-all group">
              <div className={`w-8 h-8 rounded-md ${s.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                {s.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-800">{s.name}</p>
                <p className="text-[10px] text-gray-500">{s.class} · <span className="font-mono">{s.rfid}</span></p>
              </div>
              <button
                onClick={() => setLinked([...linked, s])}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gradient-to-r from-violet-500 to-violet-700 text-white text-[10px] font-medium hover:opacity-90 transition-all opacity-0 group-hover:opacity-100"
              >
                <Plus size={10} /> Link
              </button>
            </div>
          ))
        )}
      </div>

      {linked.length === 0 && (
        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
          <AlertCircle size={13} className="text-amber-600 shrink-0 mt-0.5" />
          <p className="text-[11px] text-amber-700">
            Linking at least one child is recommended so the parent can receive attendance notifications and access their child's profile.
          </p>
        </div>
      )}
    </div>
  )
}

// ── Step 3: Preferences (Notion style) ────────────────────
function Step3({ form, setForm }) {
  const togglePref = (key) => setForm({ ...form, [key]: !form[key] })

  const prefs = [
    {
      key: 'notifyAttendance',
      icon: CreditCard,
      color: 'bg-violet-500',
      label: 'Attendance Alerts',
      desc: 'Instant notification when child checks in or out via RFID',
    },
    {
      key: 'notifyLate',
      icon: AlertCircle,
      color: 'bg-amber-500',
      label: 'Late Arrival Alerts',
      desc: 'Get notified if child arrives after school start time',
    },
    {
      key: 'notifyAbsent',
      icon: Bell,
      color: 'bg-rose-500',
      label: 'Absence Notifications',
      desc: 'Alert sent immediately if child is marked absent',
    },
    {
      key: 'notifyEmergency',
      icon: Shield,
      color: 'bg-violet-600',
      label: 'Emergency Alerts',
      desc: 'Critical alerts for school emergencies (always recommended)',
    },
    {
      key: 'weeklyReport',
      icon: Users,
      color: 'bg-emerald-500',
      label: 'Weekly Reports',
      desc: 'Receive a weekly attendance and performance summary',
    },
  ]

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-[15px] font-semibold text-gray-800">Notification Preferences</h2>
        <p className="text-gray-500 text-xs mt-0.5">Choose what notifications this parent will receive</p>
      </div>

      <div className="space-y-2">
        {prefs.map(({ key, icon: Icon, color, label, desc }) => (
          <div
            key={key}
            onClick={() => togglePref(key)}
            className={cn(
              'flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-all',
              form[key] ? 'bg-violet-50 border-violet-200' : 'bg-white border-gray-200 hover:border-gray-300'
            )}
          >
            <div className={`w-8 h-8 rounded-md ${color} flex items-center justify-center shrink-0`}>
              <Icon size={14} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-800">{label}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">{desc}</p>
            </div>
            <div
              className={`relative shrink-0 rounded-full transition-all`}
              style={{ height: '20px', width: '36px', background: form[key] ? '#8b5cf6' : '#e5e7eb' }}
            >
              <div className={cn('absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-all', form[key] ? 'left-4.5' : 'left-0.5')} />
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-gray-200">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-2">Notification Channel</p>
        <div className="grid grid-cols-3 gap-2">
          {['App', 'SMS', 'Email'].map((ch) => (
            <button
              key={ch}
              type="button"
              onClick={() => setForm({ ...form, notifChannel: ch })}
              className={cn(
                'py-1.5 rounded-md border text-[11px] font-medium transition-all',
                form.notifChannel === ch
                  ? 'bg-gradient-to-r from-violet-500 to-violet-700 text-white border-transparent'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
              )}
            >
              {ch}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Success screen (Notion style) ─────────────────────────
function SuccessScreen({ form, linked }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
      <div className="w-16 h-16 rounded-md bg-emerald-500 flex items-center justify-center">
        <CheckCircle2 size={30} className="text-white" />
      </div>
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Parent Added!</h2>
        <p className="text-gray-500 text-xs mt-1">
          <span className="font-semibold text-gray-700">{form.firstName} {form.lastName}</span> has been registered successfully
        </p>
      </div>
      <div className="bg-gray-50 border border-gray-200 rounded-md p-5 w-full max-w-sm text-left space-y-2">
        <div className="flex justify-between text-[11px]">
          <span className="text-gray-500">Email</span>
          <span className="text-gray-700 font-medium">{form.email}</span>
        </div>
        <div className="flex justify-between text-[11px]">
          <span className="text-gray-500">Phone</span>
          <span className="text-gray-700 font-medium">{form.phone}</span>
        </div>
        <div className="flex justify-between text-[11px]">
          <span className="text-gray-500">Children linked</span>
          <span className="text-gray-700 font-medium">{linked.length}</span>
        </div>
        <div className="flex justify-between text-[11px]">
          <span className="text-gray-500">Relation</span>
          <span className="text-gray-700 font-medium capitalize">{form.relation}</span>
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <Link
          href="/school/parents"
          className="px-4 py-2 rounded-md border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 transition-colors"
        >
          Back to Parents
        </Link>
        <Link
          href="/school/parents/add"
          className="px-4 py-2 rounded-md bg-gradient-to-r from-violet-500 to-violet-700 text-white text-xs font-medium hover:opacity-90 transition-all"
        >
          Add Another
        </Link>
      </div>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────
export default function AddParentPage() {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    relation: '', address: '', password: '', confirmPassword: '',
    notifyAttendance: true, notifyAbsent: true, notifyLate: false,
    notifyEmergency: true, weeklyReport: false,
    notifChannel: 'App',
  })

  const [linked, setLinked] = useState([])

  function validateStep1() {
    const e = {}
    if (!form.firstName.trim()) e.firstName = 'First name is required'
    if (!form.lastName.trim()) e.lastName = 'Last name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.phone.trim()) e.phone = 'Phone number is required'
    if (!form.relation) e.relation = 'Relation is required'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 8) e.password = 'Minimum 8 characters'
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleNext() {
    if (step === 1 && !validateStep1()) return
    setStep(step + 1)
  }

  async function handleSubmit() {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1500))
    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <SuccessScreen form={form} linked={linked} />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/school/parents"
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-violet-600 transition-colors"
        >
          <ArrowLeft size={13} /> Parents
        </Link>
        <ChevronRight size={11} className="text-gray-300" />
        <span className="text-xs text-gray-600 font-medium">Add Parent</span>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-800 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-gradient-to-r from-violet-500 to-violet-700 flex items-center justify-center">
              <UserPlus size={15} className="text-white" />
            </div>
            Add New Parent
          </h1>
          <p className="text-gray-500 text-xs mt-1 ml-10">Register a parent and link them to their children</p>
        </div>
      </div>

      {/* Steps */}
      <div className="bg-white rounded-md border border-violet-100 p-4">
        <Steps current={step} />
      </div>

      {/* Form card */}
      <div className="bg-white rounded-md border border-violet-100 p-5">
        {step === 1 && <Step1 form={form} setForm={setForm} errors={errors} />}
        {step === 2 && <Step2 linked={linked} setLinked={setLinked} />}
        {step === 3 && <Step3 form={form} setForm={setForm} />}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => step > 1 && setStep(step - 1)}
          disabled={step === 1}
          className={cn(
            'px-4 py-1.5 rounded-md border text-xs font-medium transition-colors',
            step === 1
              ? 'border-gray-200 text-gray-400 cursor-not-allowed opacity-50'
              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
          )}
        >
          ← Back
        </button>

        <div className="flex items-center gap-2">
          {[1, 2, 3].map((n) => (
            <div key={n} className={cn('h-1.5 rounded-full transition-all', n === step ? 'w-6 bg-violet-600' : 'w-1.5 bg-gray-200')} />
          ))}
        </div>

        {step < 3 ? (
          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-gradient-to-r from-violet-500 to-violet-700 text-white text-xs font-medium hover:opacity-90 transition-all"
          >
            Continue <ChevronRight size={13} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-medium hover:opacity-90 transition-all disabled:opacity-70"
          >
            {loading ? (
              <><Loader2 size={13} className="animate-spin" /> Saving...</>
            ) : (
              <><CheckCircle2 size={13} /> Add Parent</>
            )}
          </button>
        )}
      </div>
    </div>
  )
}