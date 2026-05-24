'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, ChevronRight, User, Mail, Phone,
  BookOpen, Lock, Eye, EyeOff, CheckCircle2,
  AlertCircle, Loader2, UserPlus, Plus, X, GraduationCap
} from 'lucide-react'

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
      <label className="text-[12px] font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1">
        {label} {required && <span className="text-rose-400">*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-[11px] text-rose-500">
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
      {Icon && <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />}
      <input
        {...props}
        className={`w-full ${Icon ? 'pl-9' : 'pl-4'} pr-4 py-2.5 rounded-xl border text-[13px] text-slate-700 placeholder:text-slate-400 bg-white focus:outline-none focus:ring-2 transition-all ${
          error ? 'border-rose-300 focus:ring-rose-100 focus:border-rose-400' : 'border-slate-200 focus:ring-sky-100 focus:border-sky-400'
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
              current === s.n ? 'bg-sky-500 text-white shadow-md shadow-sky-200' :
              'bg-slate-100 text-slate-400'
            }`}>
              {current > s.n ? <CheckCircle2 size={14} /> : s.n}
            </div>
            <span className={`text-[12px] font-medium hidden sm:block ${
              current === s.n ? 'text-sky-600' : current > s.n ? 'text-emerald-600' : 'text-slate-400'
            }`}>{s.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-8 sm:w-14 h-px mx-3 transition-all ${current > s.n ? 'bg-emerald-300' : 'bg-slate-200'}`} />
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
        <h2 className="text-[16px] font-bold text-slate-800">Personal Information</h2>
        <p className="text-slate-500 text-[13px] mt-0.5">Enter the teacher's basic details</p>
      </div>

      {/* Avatar Preview */}
      <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
        <div className="w-14 h-14 rounded-2xl bg-sky-500 flex items-center justify-center text-white text-[18px] font-bold shadow-md shadow-sky-200">
          {form.firstName && form.lastName
            ? `${form.firstName[0]}${form.lastName[0]}`.toUpperCase()
            : <User size={22} />}
        </div>
        <div>
          <p className="text-[14px] font-semibold text-slate-700">
            {form.firstName || form.lastName ? `${form.salutation} ${form.firstName} ${form.lastName}`.trim() : 'Teacher Name'}
          </p>
          <p className="text-[12px] text-slate-400">{form.email || 'email@school.in'}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">{form.phone || '+91 XXXXX XXXXX'}</p>
        </div>
      </div>

      {/* Salutation + Name */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Salutation" required error={errors.salutation}>
          <div className="relative">
            <select
              value={form.salutation}
              onChange={e => setForm({ ...form, salutation: e.target.value })}
              className="w-full pl-4 pr-4 py-2.5 rounded-xl border border-slate-200 text-[13px] text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-400 transition-all appearance-none"
            >
              <option value="">Select</option>
              <option>Mr.</option>
              <option>Ms.</option>
              <option>Mrs.</option>
              <option>Dr.</option>
            </select>
          </div>
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
          <div className="relative">
            <select
              value={form.gender}
              onChange={e => setForm({ ...form, gender: e.target.value })}
              className="w-full pl-4 pr-4 py-2.5 rounded-xl border border-slate-200 text-[13px] text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-400 transition-all appearance-none"
            >
              <option value="">Select gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
        </Field>
      </div>

      <Field label="Address">
        <div className="relative">
          <textarea rows={2} placeholder="Street, Area, City, State" value={form.address}
            onChange={e => setForm({ ...form, address: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-400 transition-all resize-none"
          />
        </div>
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
        <h2 className="text-[16px] font-bold text-slate-800">Teaching Details</h2>
        <p className="text-slate-500 text-[13px] mt-0.5">Subject expertise and class assignments</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Primary Subject" required error={errors.subject}>
          <div className="relative">
            <BookOpen size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              value={form.subject}
              onChange={e => setForm({ ...form, subject: e.target.value })}
              className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-[13px] text-slate-700 bg-white focus:outline-none focus:ring-2 transition-all appearance-none ${
                errors.subject ? 'border-rose-300 focus:ring-rose-100' : 'border-slate-200 focus:ring-sky-100 focus:border-sky-400'
              }`}
            >
              <option value="">Select subject</option>
              {SUBJECTS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          {errors.subject && <p className="flex items-center gap-1 text-[11px] text-rose-500"><AlertCircle size={11} />{errors.subject}</p>}
        </Field>

        <Field label="Qualification" required error={errors.qualification}>
          <div className="relative">
            <GraduationCap size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              value={form.qualification}
              onChange={e => setForm({ ...form, qualification: e.target.value })}
              className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-[13px] text-slate-700 bg-white focus:outline-none focus:ring-2 transition-all appearance-none ${
                errors.qualification ? 'border-rose-300 focus:ring-rose-100' : 'border-slate-200 focus:ring-sky-100 focus:border-sky-400'
              }`}
            >
              <option value="">Select qualification</option>
              {QUALIFICATIONS.map(q => <option key={q}>{q}</option>)}
            </select>
          </div>
          {errors.qualification && <p className="flex items-center gap-1 text-[11px] text-rose-500"><AlertCircle size={11} />{errors.qualification}</p>}
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
            <p className="text-[11px] text-slate-400">{form.assignedClasses.length} class(es) selected</p>
            <button onClick={() => setForm(f => ({ ...f, assignedClasses: [] }))} className="text-[11px] text-slate-400 hover:text-slate-600">Clear all</button>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {CLASSES.map(cls => {
              const active = form.assignedClasses.includes(cls)
              return (
                <button
                  key={cls}
                  onClick={() => toggleClass(cls)}
                  className={`py-2 rounded-xl text-[11px] font-semibold border transition-all ${
                    active
                      ? 'bg-sky-500 text-white border-sky-500 shadow-sm shadow-sky-200'
                      : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-slate-200'
                  }`}
                >
                  {cls}
                </button>
              )
            })}
          </div>
        </div>
        {errors.assignedClasses && <p className="flex items-center gap-1 text-[11px] text-rose-500 mt-1"><AlertCircle size={11} />{errors.assignedClasses}</p>}
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
  const strengthColors = ['bg-rose-400', 'bg-amber-400', 'bg-sky-400', 'bg-emerald-400']

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-[16px] font-bold text-slate-800">Portal Access</h2>
        <p className="text-slate-500 text-[13px] mt-0.5">Set login credentials for the teacher portal</p>
      </div>

      {/* Summary Card */}
      <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4 space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-3">Review</p>
        {[
          { label: 'Name',         val: `${form.salutation} ${form.firstName} ${form.lastName}`.trim() || '—' },
          { label: 'Email',        val: form.email || '—' },
          { label: 'Subject',      val: form.subject || '—' },
          { label: 'Qualification',val: form.qualification || '—' },
          { label: 'Classes',      val: form.assignedClasses.length ? form.assignedClasses.join(', ') : '—' },
        ].map(({ label, val }) => (
          <div key={label} className="flex justify-between text-[12px]">
            <span className="text-slate-400">{label}</span>
            <span className="text-slate-700 font-medium text-right max-w-[60%] truncate">{val}</span>
          </div>
        ))}
      </div>

      {/* Password */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Password" required error={errors.password}>
          <div className="relative">
            <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className={`w-full pl-9 pr-10 py-2.5 rounded-xl border text-[13px] text-slate-700 placeholder:text-slate-400 bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.password ? 'border-rose-300 focus:ring-rose-100' : 'border-slate-200 focus:ring-sky-100 focus:border-sky-400'
              }`}
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          {errors.password && <p className="flex items-center gap-1 text-[11px] text-rose-500"><AlertCircle size={11} />{errors.password}</p>}
        </Field>

        <Field label="Confirm Password" required error={errors.confirmPassword}>
          <div className="relative">
            <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Re-enter password"
              value={form.confirmPassword}
              onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
              className={`w-full pl-9 pr-10 py-2.5 rounded-xl border text-[13px] text-slate-700 placeholder:text-slate-400 bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.confirmPassword ? 'border-rose-300 focus:ring-rose-100' : 'border-slate-200 focus:ring-sky-100 focus:border-sky-400'
              }`}
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          {errors.confirmPassword && <p className="flex items-center gap-1 text-[11px] text-rose-500"><AlertCircle size={11} />{errors.confirmPassword}</p>}
        </Field>
      </div>

      {form.password && (
        <div>
          <div className="flex gap-1 mb-1">
            {[1,2,3,4].map(i => (
              <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthColors[strength - 1] : 'bg-slate-100'}`} />
            ))}
          </div>
          <p className="text-[10px] text-slate-400">Use 8+ characters, uppercase, numbers & symbols</p>
        </div>
      )}

      {/* Role */}
      <Field label="Portal Role">
        <div className="grid grid-cols-2 gap-3">
          {['Teacher', 'Class Teacher'].map(role => (
            <button
              key={role}
              onClick={() => setForm({ ...form, role })}
              className={`py-2.5 rounded-xl border text-[12px] font-medium transition-all ${
                form.role === role ? 'bg-sky-500 text-white border-sky-500 shadow-sm shadow-sky-200' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
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
      <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-200">
        <CheckCircle2 size={30} className="text-white" />
      </div>
      <div>
        <h2 className="text-[20px] font-bold text-slate-800">Teacher Added!</h2>
        <p className="text-slate-500 text-[13px] mt-1">
          <span className="font-semibold text-slate-700">{form.salutation} {form.firstName} {form.lastName}</span> has been registered successfully
        </p>
      </div>
      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 w-full max-w-sm text-left space-y-3">
        {[
          { label: 'Email',   val: form.email },
          { label: 'Subject', val: form.subject },
          { label: 'Classes', val: `${form.assignedClasses.length} assigned` },
          { label: 'Role',    val: form.role },
        ].map(({ label, val }) => (
          <div key={label} className="flex justify-between text-[12px]">
            <span className="text-slate-400">{label}</span>
            <span className="text-slate-700 font-medium">{val}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-3 pt-2">
        <Link href="/school/teachers" className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-[13px] font-medium hover:bg-slate-50 transition-colors">
          Back to Teachers
        </Link>
        <Link href="/school/teachers/add" className="px-5 py-2.5 rounded-xl bg-sky-500 text-white text-[13px] font-medium hover:bg-sky-600 transition-colors shadow-sm shadow-sky-200">
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
    <div className="p-6 max-w-2xl mx-auto space-y-6">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <Link href="/school/teachers" className="flex items-center gap-1.5 text-[12px] text-slate-400 hover:text-slate-600 transition-colors">
          <ArrowLeft size={13} /> Teachers
        </Link>
        <ChevronRight size={11} className="text-slate-300" />
        <span className="text-[12px] text-slate-600 font-medium">Add Teacher</span>
      </div>

      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-sky-500 flex items-center justify-center shadow-md shadow-sky-200">
          <UserPlus size={16} className="text-white" />
        </div>
        <div>
          <h1 className="text-[22px] font-bold text-slate-800">Add New Teacher</h1>
          <p className="text-slate-500 text-[13px]">Register a new staff member to the school</p>
        </div>
      </div>

      {/* Steps indicator */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <Steps current={step} />
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        {step === 1 && <Step1 form={form} setForm={setForm} errors={errors} />}
        {step === 2 && <Step2 form={form} setForm={setForm} errors={errors} />}
        {step === 3 && <Step3 form={form} setForm={setForm} errors={errors} />}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => step > 1 && setStep(s => s - 1)}
          disabled={step === 1}
          className={`px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-[13px] font-medium transition-colors ${step === 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-50'}`}
        >
          ← Back
        </button>

        <div className="flex items-center gap-2">
          {[1,2,3].map(n => (
            <div key={n} className={`h-1.5 rounded-full transition-all ${n === step ? 'w-6 bg-sky-500' : 'w-1.5 bg-slate-200'}`} />
          ))}
        </div>

        {step < 3 ? (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 text-white text-[13px] font-medium hover:bg-sky-600 transition-colors shadow-sm shadow-sky-200"
          >
            Continue <ChevronRight size={14} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 text-white text-[13px] font-medium hover:bg-emerald-600 transition-colors shadow-sm shadow-emerald-200 disabled:opacity-70"
          >
            {loading ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : <><CheckCircle2 size={14} /> Add Teacher</>}
          </button>
        )}
      </div>
    </div>
  )
}