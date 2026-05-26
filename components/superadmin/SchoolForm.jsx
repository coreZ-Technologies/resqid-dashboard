'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const PLANS = ['Basic', 'Standard', 'Professional', 'Enterprise']

export default function SchoolForm({ initialData = {}, onSubmit, isLoading }) {
  const router = useRouter()
  const [form, setForm] = useState({
    name: initialData.name || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    location: initialData.location || '',
    address: initialData.address || '',
    plan: initialData.plan || 'Basic',
    adminName: initialData.adminName || '',
    adminEmail: initialData.adminEmail || '',
    status: initialData.status || 'active',
  })
  const [errors, setErrors] = useState({})

  const set = (field) => (e) =>
    setForm(f => ({ ...f, [field]: e.target.value }))

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'School name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    if (!form.adminName.trim()) errs.adminName = 'Admin name is required'
    if (!form.adminEmail.trim()) errs.adminEmail = 'Admin email is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit?.(form)
  }

  const inputClass = (field) =>
    `w-full px-3.5 py-2.5 rounded-xl border text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 ${errors[field] ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'}`

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* School Info */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">School Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">School Name *</label>
            <input className={inputClass('name')} placeholder="e.g. Springfield High School" value={form.name} onChange={set('name')} />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">School Email *</label>
            <input className={inputClass('email')} type="email" placeholder="school@example.com" value={form.email} onChange={set('email')} />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Phone Number</label>
            <input className={inputClass('phone')} placeholder="+1 (555) 000-0000" value={form.phone} onChange={set('phone')} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">City / Location</label>
            <input className={inputClass('location')} placeholder="e.g. New York, NY" value={form.location} onChange={set('location')} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Full Address</label>
            <input className={inputClass('address')} placeholder="123 Main St, Suite 100" value={form.address} onChange={set('address')} />
          </div>
        </div>
      </div>

      {/* Plan & Status */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Plan & Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Subscription Plan</label>
            <select className={inputClass('plan')} value={form.plan} onChange={set('plan')}>
              {PLANS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Status</label>
            <select className={inputClass('status')} value={form.status} onChange={set('status')}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Admin Info */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">School Admin Account</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Admin Full Name *</label>
            <input className={inputClass('adminName')} placeholder="John Doe" value={form.adminName} onChange={set('adminName')} />
            {errors.adminName && <p className="text-xs text-red-500 mt-1">{errors.adminName}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Admin Email *</label>
            <input className={inputClass('adminEmail')} type="email" placeholder="admin@school.com" value={form.adminEmail} onChange={set('adminEmail')} />
            {errors.adminEmail && <p className="text-xs text-red-500 mt-1">{errors.adminEmail}</p>}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Saving...' : initialData.id ? 'Save Changes' : 'Create School'}
        </button>
      </div>
    </form>
  )
}