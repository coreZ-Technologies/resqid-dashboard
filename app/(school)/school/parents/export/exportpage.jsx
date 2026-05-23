'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, ChevronRight, Download, FileText, FileSpreadsheet,
  FileCsv, CheckCircle2, Users, CalendarCheck, Bell,
  TrendingUp, Clock, Filter, ChevronDown, Loader2,
  FileJson, Printer, Mail, AlertCircle, X
} from 'lucide-react'

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
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    ring: 'ring-emerald-100',
  },
  {
    id: 'xlsx',
    label: 'Excel (.xlsx)',
    desc: 'Formatted workbook with styles',
    icon: FileSpreadsheet,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    ring: 'ring-blue-100',
  },
  {
    id: 'pdf',
    label: 'PDF Report',
    desc: 'Printable, shareable document',
    icon: FileText,
    color: 'text-rose-500',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    ring: 'ring-rose-100',
  },
  {
    id: 'json',
    label: 'JSON',
    desc: 'Raw data for developers / APIs',
    icon: FileJson,
    color: 'text-violet-500',
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

// ── Toast ──────────────────────────────────────────────────
function Toast({ show, onClose }) {
  if (!show) return null
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl shadow-black/20 animate-in slide-in-from-bottom-4">
      <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
      <div>
        <p className="text-[13px] font-semibold">Export started!</p>
        <p className="text-[11px] text-white/50">Your file will download shortly</p>
      </div>
      <button onClick={onClose} className="ml-2 text-white/40 hover:text-white/80 transition-colors">
        <X size={14} />
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
    <div className="p-6 max-w-5xl mx-auto space-y-6">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <Link href="/school/parents" className="flex items-center gap-1.5 text-[12px] text-slate-400 hover:text-slate-600 transition-colors">
          <ArrowLeft size={13} /> Parents
        </Link>
        <ChevronRight size={11} className="text-slate-300" />
        <span className="text-[12px] text-slate-600 font-medium">Export</span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-sky-500 flex items-center justify-center shadow-md shadow-sky-200">
          <Download size={16} className="text-white" />
        </div>
        <div>
          <h1 className="text-[22px] font-bold text-slate-800">Export Parents Data</h1>
          <p className="text-slate-500 text-[13px]">Configure and download parent records from Springdale Public School</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left: Config Panel ── */}
        <div className="lg:col-span-1 space-y-5">

          {/* Format */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Export Format</p>
            <div className="space-y-2">
              {FORMAT_OPTIONS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFormat(f.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                    format === f.id
                      ? `${f.bg} ${f.border} ring-2 ${f.ring}`
                      : 'bg-slate-50 border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${format === f.id ? f.bg : 'bg-white'} border ${format === f.id ? f.border : 'border-slate-200'}`}>
                    <f.icon size={14} className={format === f.id ? f.color : 'text-slate-400'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[13px] font-semibold ${format === f.id ? 'text-slate-800' : 'text-slate-600'}`}>{f.label}</p>
                    <p className="text-[10px] text-slate-400 truncate">{f.desc}</p>
                  </div>
                  {format === f.id && <CheckCircle2 size={14} className={f.color} />}
                </button>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Filters</p>

            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-slate-500">Date Range</label>
              <div className="relative">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 text-[12px] text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-400 transition-all appearance-none"
                >
                  <option value="all">All Time</option>
                  <option value="this_month">This Month</option>
                  <option value="last_month">Last Month</option>
                  <option value="this_year">This Year (2025)</option>
                  <option value="last_quarter">Last Quarter</option>
                </select>
                <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-slate-500">Engagement Level</label>
              <div className="grid grid-cols-2 gap-1.5">
                {['all', 'high', 'medium', 'low'].map((e) => (
                  <button
                    key={e}
                    onClick={() => setEngFilter(e)}
                    className={`py-2 rounded-lg text-[11px] font-medium capitalize transition-all border ${
                      engFilter === e
                        ? 'bg-sky-500 text-white border-sky-500'
                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {e === 'all' ? 'All' : e}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Delivery */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Delivery</p>
            <div
              onClick={() => setEmailDelivery(!emailDelivery)}
              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                emailDelivery ? 'bg-sky-50 border-sky-200' : 'bg-slate-50 border-slate-100 hover:border-slate-200'
              }`}
            >
              <Mail size={14} className={emailDelivery ? 'text-sky-500' : 'text-slate-400'} />
              <div className="flex-1">
                <p className="text-[12px] font-semibold text-slate-700">Send to my email</p>
                <p className="text-[10px] text-slate-400">admin@springdaleschool.in</p>
              </div>
              <div className="relative shrink-0" style={{ width: 36, height: 20 }}>
                <div className={`absolute inset-0 rounded-full transition-all ${emailDelivery ? 'bg-sky-500' : 'bg-slate-200'}`} />
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${emailDelivery ? 'left-[18px]' : 'left-0.5'}`} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: Fields + Preview ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Fields selector */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Select Fields</p>
              <div className="flex gap-2">
                <button onClick={() => setFields(FIELD_OPTIONS.map(f => f.id))} className="text-[11px] text-sky-500 hover:text-sky-600 font-medium">All</button>
                <span className="text-slate-200">|</span>
                <button onClick={() => setFields([])} className="text-[11px] text-slate-400 hover:text-slate-600 font-medium">None</button>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {FIELD_OPTIONS.map((f) => {
                const active = fields.includes(f.id)
                return (
                  <button
                    key={f.id}
                    onClick={() => toggleField(f.id)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left transition-all ${
                      active
                        ? 'bg-sky-50 border-sky-200 text-sky-700'
                        : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-200'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                      active ? 'bg-sky-500 border-sky-500' : 'border-slate-300'
                    }`}>
                      {active && <CheckCircle2 size={10} className="text-white" strokeWidth={3} />}
                    </div>
                    <span className="text-[11px] font-medium truncate">{f.label}</span>
                  </button>
                )
              })}
            </div>
            {fields.length === 0 && (
              <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                <AlertCircle size={13} className="text-amber-500 shrink-0" />
                <p className="text-[11px] text-amber-700">Select at least one field to export</p>
              </div>
            )}
          </div>

          {/* Live Preview */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
              <div>
                <p className="text-[13px] font-semibold text-slate-700">Data Preview</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{filteredRows.length} records · {fields.length} fields selected</p>
              </div>
              <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
                {FORMAT_OPTIONS.find(f => f.id === format)?.label}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="bg-slate-50/80 text-left">
                    {fields.includes('name')       && <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap">Parent Name</th>}
                    {fields.includes('email')      && <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap">Email</th>}
                    {fields.includes('phone')      && <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap">Phone</th>}
                    {fields.includes('children')   && <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap">Children</th>}
                    {fields.includes('attendance') && <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap">Avg. Attend.</th>}
                    {fields.includes('engagement') && <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap">Engagement</th>}
                    {fields.includes('joined')     && <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap">Joined</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredRows.map((row) => (
                    <tr key={row.name} className="hover:bg-slate-50/50 transition-colors">
                      {fields.includes('name')       && <td className="px-4 py-3 font-medium text-slate-700 whitespace-nowrap">{row.name}</td>}
                      {fields.includes('email')      && <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{row.email}</td>}
                      {fields.includes('phone')      && <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{row.phone}</td>}
                      {fields.includes('children')   && <td className="px-4 py-3 text-slate-600 text-center">{row.children}</td>}
                      {fields.includes('attendance') && <td className="px-4 py-3 font-semibold text-slate-700">{row.avgAttendance}</td>}
                      {fields.includes('engagement') && (
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${ENGAGEMENT_COLOR[row.engagement]}`}>
                            {row.engagement}
                          </span>
                        </td>
                      )}
                      {fields.includes('joined')     && <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{row.joined}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredRows.length === 0 && (
                <div className="py-10 text-center">
                  <p className="text-[13px] text-slate-400">No records match the selected filters</p>
                </div>
              )}
            </div>
            {filteredRows.length > 0 && (
              <div className="px-5 py-3 border-t border-slate-50 bg-slate-50/50">
                <p className="text-[10px] text-slate-400">Showing {filteredRows.length} of {PREVIEW_ROWS.length} total records</p>
              </div>
            )}
          </div>

          {/* Export CTA */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-[13px] font-semibold text-slate-700">Ready to export</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {filteredRows.length} parents · {fields.length} fields · {FORMAT_OPTIONS.find(f => f.id === format)?.label}
                  {emailDelivery ? ' · Email delivery' : ' · Direct download'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/school/parents"
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-[13px] font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </Link>
                <button
                  onClick={handleExport}
                  disabled={loading || fields.length === 0}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-500 text-white text-[13px] font-medium hover:bg-sky-600 transition-colors shadow-sm shadow-sky-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <><Loader2 size={14} className="animate-spin" /> Exporting...</>
                  ) : (
                    <><Download size={14} /> Export {filteredRows.length} Records</>
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