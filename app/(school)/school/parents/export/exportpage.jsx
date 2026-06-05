'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, ChevronRight, Download, FileText, FileSpreadsheet,
  FileCsv, CheckCircle2, Users, CalendarCheck, Bell,
  TrendingUp, Clock, Filter, ChevronDown, Loader2,
  FileJson, Printer, Mail, AlertCircle, X
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Dummy preview data ─────────────────────────────────────
const PREVIEW_ROWS = [
  { name: 'Rajesh Sharma',    email: 'rajesh.sharma@gmail.com',    phone: '+91 98765 43210', children: 2, avgAttendance: '91%', engagement: 'High',   joined: 'Jan 2024' },
  { name: 'Sunita Dey',      email: 'sunita.dey@outlook.com',     phone: '+91 87654 32109', children: 1, avgAttendance: '97%', engagement: 'High',   joined: 'Mar 2024' },
  { name: 'Amit Bose',       email: 'amit.bose@yahoo.com',        phone: '+91 76543 21098', children: 1, avgAttendance: '76%', engagement: 'Low',    joined: 'Feb 2024' },
  { name: 'Priya Chatterjee',email: 'priya.c@gmail.com',          phone: '+91 65432 10987', children: 2, avgAttendance: '88%', engagement: 'Medium', joined: 'Jan 2024' },
  { name: 'Suresh Nair',     email: 'suresh.nair@gmail.com',      phone: '+91 54321 09876', children: 1, avgAttendance: '99%', engagement: 'High',   joined: 'Apr 2024' },
  { name: 'Meena Gupta',     email: 'meena.gupta@rediffmail.com', phone: '+91 43210 98765', children: 1, avgAttendance: '82%', engagement: 'Medium', joined: 'Jun 2024' },
]

const FORMAT_OPTIONS = [
  {
    id: 'csv',
    label: 'CSV',
    desc: 'Spreadsheet-compatible, lightweight',
    icon: FileSpreadsheet,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    ring: 'ring-emerald-100',
  },
  {
    id: 'xlsx',
    label: 'Excel (.xlsx)',
    desc: 'Formatted workbook with styles',
    icon: FileSpreadsheet,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    ring: 'ring-blue-100',
  },
  {
    id: 'pdf',
    label: 'PDF Report',
    desc: 'Printable, shareable document',
    icon: FileText,
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    ring: 'ring-rose-100',
  },
  {
    id: 'json',
    label: 'JSON',
    desc: 'Raw data for developers / APIs',
    icon: FileJson,
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    ring: 'ring-violet-100',
  },
]

const FIELD_OPTIONS = [
  { id: 'name',        label: 'Parent Name' },
  { id: 'email',       label: 'Email Address' },
  { id: 'phone',       label: 'Phone Number' },
  { id: 'location',    label: 'Location' },
  { id: 'children',    label: 'Linked Children' },
  { id: 'attendance',  label: 'Avg. Attendance' },
  { id: 'engagement',  label: 'Engagement Level' },
  { id: 'joined',      label: 'Joined Date' },
  { id: 'notifs',      label: 'Pending Notifications' },
  { id: 'rfid',        label: 'Child RFID Tags' },
]

const ENGAGEMENT_COLOR = {
  High:   'bg-emerald-100 text-emerald-700',
  Medium: 'bg-amber-100 text-amber-700',
  Low:    'bg-rose-100 text-rose-700',
}

// ── Toast (Notion style) ──────────────────────────────────
function Toast({ show, onClose }) {
  if (!show) return null
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-gray-800 text-white px-4 py-3 rounded-md shadow-md">
      <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
      <div>
        <p className="text-xs font-medium">Export started!</p>
        <p className="text-[10px] text-white/50">Your file will download shortly</p>
      </div>
      <button onClick={onClose} className="ml-2 text-white/40 hover:text-white/80 transition-colors">
        <X size={13} />
      </button>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────
export default function ExportPage() {
  const [format, setFormat] = useState('csv')
  const [dateRange, setDateRange] = useState('all')
  const [engFilter, setEngFilter] = useState('all')
  const [fields, setFields] = useState(['name', 'email', 'phone', 'children', 'attendance', 'engagement'])
  const [loading, setLoading] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [emailDelivery, setEmailDelivery] = useState(false)

  const toggleField = (id) =>
    setFields((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    )

  const handleExport = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1800))
    setLoading(false)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 4000)
  }

  const filteredRows = PREVIEW_ROWS.filter((r) => {
    if (engFilter === 'all') return true
    return r.engagement.toLowerCase() === engFilter
  })

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <Link href="/school/parents" className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-violet-600 transition-colors">
          <ArrowLeft size={13} /> Parents
        </Link>
        <ChevronRight size={11} className="text-gray-300" />
        <span className="text-xs text-gray-600 font-medium">Export</span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-md bg-gradient-to-r from-violet-500 to-violet-700 flex items-center justify-center">
          <Download size={16} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Export Parents Data</h1>
          <p className="text-xs text-gray-500">Configure and download parent records from Springdale Public School</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ── Left: Config Panel ── */}
        <div className="lg:col-span-1 space-y-5">

          {/* Format */}
          <div className="bg-white rounded-md border border-violet-100 p-5 space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Export Format</p>
            <div className="space-y-2">
              {FORMAT_OPTIONS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFormat(f.id)}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 rounded-md border transition-all text-left',
                    format === f.id
                      ? `${f.bg} ${f.border} ring-1 ${f.ring}`
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  )}
                >
                  <div className={cn('w-8 h-8 rounded-md flex items-center justify-center shrink-0 border', format === f.id ? f.bg : 'bg-gray-50', format === f.id ? f.border : 'border-gray-200')}>
                    <f.icon size={14} className={format === f.id ? f.color : 'text-gray-400'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn('text-xs font-medium', format === f.id ? 'text-gray-800' : 'text-gray-600')}>{f.label}</p>
                    <p className="text-[10px] text-gray-500 truncate">{f.desc}</p>
                  </div>
                  {format === f.id && <CheckCircle2 size={14} className={f.color} />}
                </button>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-md border border-violet-100 p-5 space-y-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Filters</p>

            <div className="space-y-1.5">
              <label className="text-[10px] font-medium text-gray-600">Date Range</label>
              <div className="relative">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 rounded-md border border-gray-200 text-xs text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-violet-100 focus:border-violet-300 transition-all appearance-none"
                >
                  <option value="all">All Time</option>
                  <option value="this_month">This Month</option>
                  <option value="last_month">Last Month</option>
                  <option value="this_year">This Year (2025)</option>
                  <option value="last_quarter">Last Quarter</option>
                </select>
                <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-medium text-gray-600">Engagement Level</label>
              <div className="grid grid-cols-2 gap-1.5">
                {['all', 'high', 'medium', 'low'].map((e) => (
                  <button
                    key={e}
                    onClick={() => setEngFilter(e)}
                    className={cn(
                      'py-1.5 rounded-md text-[10px] font-medium capitalize transition-all border',
                      engFilter === e
                        ? 'bg-gradient-to-r from-violet-500 to-violet-700 text-white border-transparent'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                    )}
                  >
                    {e === 'all' ? 'All' : e}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Delivery */}
          <div className="bg-white rounded-md border border-violet-100 p-5 space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Delivery</p>
            <div
              onClick={() => setEmailDelivery(!emailDelivery)}
              className={cn(
                'flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-all',
                emailDelivery ? 'bg-violet-50 border-violet-200' : 'bg-white border-gray-200 hover:border-gray-300'
              )}
            >
              <Mail size={14} className={emailDelivery ? 'text-violet-600' : 'text-gray-400'} />
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-700">Send to my email</p>
                <p className="text-[10px] text-gray-500">admin@springdaleschool.in</p>
              </div>
              <div className="relative shrink-0" style={{ width: 36, height: 20 }}>
                <div className={cn('absolute inset-0 rounded-full transition-all', emailDelivery ? 'bg-violet-600' : 'bg-gray-200')} />
                <div className={cn('absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all', emailDelivery ? 'left-[18px]' : 'left-0.5')} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: Fields + Preview ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Fields selector */}
          <div className="bg-white rounded-md border border-violet-100 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Select Fields</p>
              <div className="flex gap-2">
                <button onClick={() => setFields(FIELD_OPTIONS.map(f => f.id))} className="text-[10px] text-violet-600 hover:text-violet-700 font-medium">All</button>
                <span className="text-gray-200">|</span>
                <button onClick={() => setFields([])} className="text-[10px] text-gray-500 hover:text-gray-600 font-medium">None</button>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {FIELD_OPTIONS.map((f) => {
                const active = fields.includes(f.id)
                return (
                  <button
                    key={f.id}
                    onClick={() => toggleField(f.id)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-md border text-left transition-all',
                      active
                        ? 'bg-violet-50 border-violet-200 text-violet-700'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                    )}
                  >
                    <div className={cn('w-4 h-4 rounded-sm border-2 flex items-center justify-center shrink-0 transition-all',
                      active ? 'bg-violet-600 border-violet-600' : 'border-gray-300'
                    )}>
                      {active && <CheckCircle2 size={10} className="text-white" strokeWidth={3} />}
                    </div>
                    <span className="text-[10px] font-medium truncate">{f.label}</span>
                  </button>
                )
              })}
            </div>
            {fields.length === 0 && (
              <div className="flex items-center gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-md">
                <AlertCircle size={12} className="text-amber-600 shrink-0" />
                <p className="text-[10px] text-amber-700">Select at least one field to export</p>
              </div>
            )}
          </div>

          {/* Live Preview */}
          <div className="bg-white rounded-md border border-violet-100 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <div>
                <p className="text-xs font-medium text-gray-800">Data Preview</p>
                <p className="text-[10px] text-gray-500 mt-0.5">{filteredRows.length} records · {fields.length} fields selected</p>
              </div>
              <span className="text-[9px] font-medium uppercase tracking-wider text-gray-500 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-md">
                {FORMAT_OPTIONS.find(f => f.id === format)?.label}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[10px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-left">
                    {fields.includes('name')       && <th className="px-3 py-2 text-[9px] font-semibold uppercase tracking-wider text-gray-500 whitespace-nowrap">Parent Name</th>}
                    {fields.includes('email')      && <th className="px-3 py-2 text-[9px] font-semibold uppercase tracking-wider text-gray-500 whitespace-nowrap">Email</th>}
                    {fields.includes('phone')      && <th className="px-3 py-2 text-[9px] font-semibold uppercase tracking-wider text-gray-500 whitespace-nowrap">Phone</th>}
                    {fields.includes('children')   && <th className="px-3 py-2 text-[9px] font-semibold uppercase tracking-wider text-gray-500 whitespace-nowrap">Children</th>}
                    {fields.includes('attendance') && <th className="px-3 py-2 text-[9px] font-semibold uppercase tracking-wider text-gray-500 whitespace-nowrap">Avg. Attend.</th>}
                    {fields.includes('engagement') && <th className="px-3 py-2 text-[9px] font-semibold uppercase tracking-wider text-gray-500 whitespace-nowrap">Engagement</th>}
                    {fields.includes('joined')     && <th className="px-3 py-2 text-[9px] font-semibold uppercase tracking-wider text-gray-500 whitespace-nowrap">Joined</th>}
                  </table>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRows.map((row) => (
                    <tr key={row.name} className="hover:bg-gray-50 transition-colors">
                      {fields.includes('name')       && <td className="px-3 py-2 font-medium text-gray-800 whitespace-nowrap">{row.name}</td>}
                      {fields.includes('email')      && <td className="px-3 py-2 text-gray-600 whitespace-nowrap">{row.email}</td>}
                      {fields.includes('phone')      && <td className="px-3 py-2 text-gray-600 whitespace-nowrap">{row.phone}</td>}
                      {fields.includes('children')   && <td className="px-3 py-2 text-gray-700 text-center">{row.children}</td>}
                      {fields.includes('attendance') && <td className="px-3 py-2 font-semibold text-gray-800">{row.avgAttendance}</td>}
                      {fields.includes('engagement') && (
                        <td className="px-3 py-2">
                          <span className={cn('px-1.5 py-0.5 rounded-md text-[9px] font-semibold', ENGAGEMENT_COLOR[row.engagement])}>
                            {row.engagement}
                          </span>
                        </td>
                      )}
                      {fields.includes('joined')     && <td className="px-3 py-2 text-gray-500 whitespace-nowrap">{row.joined}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredRows.length === 0 && (
                <div className="py-8 text-center">
                  <p className="text-xs text-gray-500">No records match the selected filters</p>
                </div>
              )}
            </div>
            {filteredRows.length > 0 && (
              <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
                <p className="text-[9px] text-gray-500">Showing {filteredRows.length} of {PREVIEW_ROWS.length} total records</p>
              </div>
            )}
          </div>

          {/* Export CTA */}
          <div className="bg-white rounded-md border border-violet-100 p-5">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-xs font-medium text-gray-800">Ready to export</p>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  {filteredRows.length} parents · {fields.length} fields · {FORMAT_OPTIONS.find(f => f.id === format)?.label}
                  {emailDelivery ? ' · Email delivery' : ' · Direct download'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/school/parents"
                  className="px-3 py-1.5 rounded-md border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </Link>
                <button
                  onClick={handleExport}
                  disabled={loading || fields.length === 0}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-gradient-to-r from-violet-500 to-violet-700 text-white text-xs font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <><Loader2 size={13} className="animate-spin" /> Exporting...</>
                  ) : (
                    <><Download size={13} /> Export {filteredRows.length} Records</>
                  )}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      <Toast show={showToast} onClose={() => setShowToast(false)} />
    </div>
  )
}