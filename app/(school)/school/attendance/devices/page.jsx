'use client'

import { useState } from 'react'
import {
  Radio, Wifi, WifiOff, CheckCircle2, AlertCircle,
  XCircle, Clock, Search, Plus, Download, RefreshCw,
  MapPin, Activity, Zap, Settings, MoreHorizontal,
  TrendingUp, TrendingDown, ChevronDown, Battery,
  BatteryLow, BatteryMedium, Signal, SignalLow,
  SignalMedium, AlertTriangle, Edit2, Trash2,
  Eye, RotateCcw, ChevronRight, Filter, Cpu,
  ShieldCheck, Timer, BarChart2
} from 'lucide-react'
import Link from 'next/link'

// ── Mock Data ──────────────────────────────────────────────────────────────────

const STATS = [
  { label: 'Total Devices',    value: 8,  icon: Radio,        color: 'bg-indigo-500', change: null },
  { label: 'Online',           value: 6,  icon: Wifi,         color: 'bg-emerald-500', change: +1 },
  { label: 'Offline / Faulty', value: 2,  icon: WifiOff,      color: 'bg-rose-500',    change: -1 },
  { label: "Today's Scans",    value: 847, icon: Activity,    color: 'bg-sky-500',     change: +34 },
]

const DEVICES = [
  {
    id: 'RFID-001',
    name: 'Main Entrance Scanner',
    location: 'Main Gate',
    zone: 'Entry',
    status: 'online',
    ipAddress: '192.168.1.101',
    macAddress: 'A4:CF:12:88:01:FF',
    firmware: 'v3.2.1',
    battery: null,         // null = wired/no battery
    signal: 98,
    todayScans: 312,
    lastSeen: 'Just now',
    lastPing: '2s ago',
    installedOn: '12 Jan 2025',
    type: 'Gate Scanner',
    model: 'RESQID GS-200',
    totalScans: 42810,
  },
  {
    id: 'RFID-002',
    name: 'Gate B Scanner',
    location: 'Side Gate B',
    zone: 'Entry',
    status: 'online',
    ipAddress: '192.168.1.102',
    macAddress: 'A4:CF:12:88:02:FA',
    firmware: 'v3.2.1',
    battery: null,
    signal: 91,
    todayScans: 198,
    lastSeen: 'Just now',
    lastPing: '4s ago',
    installedOn: '12 Jan 2025',
    type: 'Gate Scanner',
    model: 'RESQID GS-200',
    totalScans: 28430,
  },
  {
    id: 'RFID-003',
    name: 'Classroom Block A',
    location: 'Block A — Floor 1',
    zone: 'Classroom',
    status: 'online',
    ipAddress: '192.168.1.103',
    macAddress: 'A4:CF:12:88:03:FB',
    firmware: 'v3.1.8',
    battery: 82,
    signal: 76,
    todayScans: 145,
    lastSeen: '1 min ago',
    lastPing: '58s ago',
    installedOn: '5 Mar 2025',
    type: 'Classroom Reader',
    model: 'RESQID CR-100',
    totalScans: 18920,
  },
  {
    id: 'RFID-004',
    name: 'Classroom Block B',
    location: 'Block B — Floor 2',
    zone: 'Classroom',
    status: 'online',
    ipAddress: '192.168.1.104',
    macAddress: 'A4:CF:12:88:04:FC',
    firmware: 'v3.1.8',
    battery: 45,
    signal: 68,
    todayScans: 112,
    lastSeen: '2 min ago',
    lastPing: '2m ago',
    installedOn: '5 Mar 2025',
    type: 'Classroom Reader',
    model: 'RESQID CR-100',
    totalScans: 14670,
  },
  {
    id: 'RFID-005',
    name: 'Library Scanner',
    location: 'Library — Ground Floor',
    zone: 'Library',
    status: 'online',
    ipAddress: '192.168.1.105',
    macAddress: 'A4:CF:12:88:05:FD',
    firmware: 'v3.2.0',
    battery: 91,
    signal: 88,
    todayScans: 67,
    lastSeen: '3 min ago',
    lastPing: '3m ago',
    installedOn: '20 Apr 2025',
    type: 'Classroom Reader',
    model: 'RESQID CR-100',
    totalScans: 9340,
  },
  {
    id: 'RFID-006',
    name: 'Back Gate Scanner',
    location: 'Back Gate',
    zone: 'Entry',
    status: 'online',
    ipAddress: '192.168.1.106',
    macAddress: 'A4:CF:12:88:06:FE',
    firmware: 'v3.2.1',
    battery: null,
    signal: 84,
    todayScans: 13,
    lastSeen: '5 min ago',
    lastPing: '5m ago',
    installedOn: '12 Jan 2025',
    type: 'Gate Scanner',
    model: 'RESQID GS-200',
    totalScans: 6120,
  },
  {
    id: 'RFID-007',
    name: 'Sports Ground Reader',
    location: 'Sports Ground',
    zone: 'Outdoor',
    status: 'offline',
    ipAddress: '192.168.1.107',
    macAddress: 'A4:CF:12:88:07:FF',
    firmware: 'v3.1.5',
    battery: 12,
    signal: 0,
    todayScans: 0,
    lastSeen: '3h ago',
    lastPing: '3h ago',
    installedOn: '1 Jun 2025',
    type: 'Outdoor Reader',
    model: 'RESQID OR-50',
    totalScans: 2210,
    issue: 'Low battery — device went offline',
  },
  {
    id: 'RFID-008',
    name: 'Canteen Scanner',
    location: 'Canteen',
    zone: 'Indoor',
    status: 'faulty',
    ipAddress: '192.168.1.108',
    macAddress: 'A4:CF:12:88:08:F0',
    firmware: 'v3.0.9',
    battery: null,
    signal: 22,
    todayScans: 0,
    lastSeen: '1d ago',
    lastPing: '1d ago',
    installedOn: '15 Feb 2025',
    type: 'Classroom Reader',
    model: 'RESQID CR-100',
    totalScans: 11450,
    issue: 'Firmware out of date — scan errors reported',
  },
]

const RECENT_ACTIVITY = [
  { deviceId: 'RFID-001', device: 'Main Entrance Scanner', event: 'Scan',           student: 'Priya Sharma',    time: '8:02 AM', status: 'success' },
  { deviceId: 'RFID-002', device: 'Gate B Scanner',        event: 'Scan',           student: 'Rohit Dey',       time: '8:05 AM', status: 'success' },
  { deviceId: 'RFID-007', device: 'Sports Ground Reader',  event: 'Went Offline',   student: null,              time: '8:10 AM', status: 'error'   },
  { deviceId: 'RFID-001', device: 'Main Entrance Scanner', event: 'Anomaly Scan',   student: 'Dev Chatterjee',  time: '8:17 AM', status: 'warning' },
  { deviceId: 'RFID-003', device: 'Classroom Block A',     event: 'Scan',           student: 'Sneha Bose',      time: '8:45 AM', status: 'success' },
  { deviceId: 'RFID-008', device: 'Canteen Scanner',       event: 'Firmware Error', student: null,              time: '9:00 AM', status: 'error'   },
]

const STATUS_META = {
  online:  { label: 'Online',  color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', dot: 'bg-emerald-500', icon: Wifi    },
  offline: { label: 'Offline', color: 'text-rose-700',    bg: 'bg-rose-50',    border: 'border-rose-200',    dot: 'bg-rose-500',    icon: WifiOff },
  faulty:  { label: 'Faulty',  color: 'text-amber-700',   bg: 'bg-amber-50',   border: 'border-amber-200',   dot: 'bg-amber-500',   icon: AlertTriangle },
}

const ZONE_META = {
  Entry:    { color: 'text-sky-700',     bg: 'bg-sky-50',     border: 'border-sky-200'     },
  Classroom:{ color: 'text-violet-700',  bg: 'bg-violet-50',  border: 'border-violet-200'  },
  Library:  { color: 'text-amber-700',   bg: 'bg-amber-50',   border: 'border-amber-200'   },
  Outdoor:  { color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  Indoor:   { color: 'text-indigo-700',  bg: 'bg-indigo-50',  border: 'border-indigo-200'  },
}

const ACTIVITY_META = {
  success: { color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle2 },
  warning: { color: 'text-amber-600',   bg: 'bg-amber-50',   icon: AlertCircle  },
  error:   { color: 'text-rose-600',    bg: 'bg-rose-50',    icon: XCircle      },
}

const STATUS_FILTERS = ['All', 'Online', 'Offline', 'Faulty']
const ZONE_FILTERS   = ['All Zones', 'Entry', 'Classroom', 'Library', 'Outdoor', 'Indoor']

// ── Sub-components ─────────────────────────────────────────────────────────────

function StatCard({ label, value, icon: Icon, color, change }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={18} className="text-white" />
        </div>
        {change !== null && change !== undefined && (
          <span className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg ${
            change >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
          }`}>
            {change >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {change >= 0 ? '+' : ''}{change} today
          </span>
        )}
      </div>
      <p className="text-[26px] font-bold text-slate-800 leading-tight">{value}</p>
      <p className="text-[12px] text-slate-500 mt-0.5">{label}</p>
    </div>
  )
}

function StatusBadge({ status }) {
  const m = STATUS_META[status] || STATUS_META.offline
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${m.bg} ${m.color} ${m.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${m.dot} ${status === 'online' ? 'animate-pulse' : ''}`} />
      {m.label}
    </span>
  )
}

function ZoneBadge({ zone }) {
  const m = ZONE_META[zone] || { color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200' }
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${m.bg} ${m.color} ${m.border}`}>
      <MapPin size={9} /> {zone}
    </span>
  )
}

function BatteryIcon({ level }) {
  if (level === null) return <span className="text-[10px] text-slate-400 flex items-center gap-1"><Zap size={10} /> Wired</span>
  const color = level > 60 ? 'text-emerald-500' : level > 25 ? 'text-amber-500' : 'text-rose-500'
  const Icon = level > 60 ? Battery : level > 25 ? BatteryMedium : BatteryLow
  return (
    <span className={`flex items-center gap-1 text-[11px] font-medium ${color}`}>
      <Icon size={13} /> {level}%
    </span>
  )
}

function SignalBar({ level }) {
  if (!level) return <span className="text-[11px] text-slate-300 flex items-center gap-1"><SignalLow size={13} /> No signal</span>
  const color = level > 70 ? 'text-emerald-500' : level > 40 ? 'text-amber-500' : 'text-rose-500'
  const Icon = level > 70 ? Signal : level > 40 ? SignalMedium : SignalLow
  return (
    <span className={`flex items-center gap-1 text-[11px] font-medium ${color}`}>
      <Icon size={13} /> {level}%
    </span>
  )
}

function DeviceRow({ device, selected, onSelect }) {
  const isSelected = selected === device.id
  const m = STATUS_META[device.status]

  return (
    <tr
      onClick={() => onSelect(isSelected ? null : device.id)}
      className={`border-b border-slate-50 cursor-pointer transition-colors ${
        isSelected ? 'bg-indigo-50/50' : 'hover:bg-slate-50/40'
      }`}
    >
      {/* Device */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
            device.status === 'online' ? 'bg-emerald-50 border-emerald-200' :
            device.status === 'faulty' ? 'bg-amber-50 border-amber-200' :
            'bg-slate-100 border-slate-200'
          }`}>
            <Radio size={16} className={
              device.status === 'online' ? 'text-emerald-600' :
              device.status === 'faulty' ? 'text-amber-500' :
              'text-slate-400'
            } />
          </div>
          <div>
            <p className="text-[12.5px] font-semibold text-slate-800">{device.name}</p>
            <p className="text-[10px] font-mono text-slate-400">{device.id}</p>
          </div>
        </div>
      </td>

      {/* Location */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-1.5 text-[12px] text-slate-600 whitespace-nowrap">
          <MapPin size={11} className="text-slate-400 shrink-0" /> {device.location}
        </div>
        <div className="mt-1"><ZoneBadge zone={device.zone} /></div>
      </td>

      {/* Status */}
      <td className="px-4 py-3.5">
        <StatusBadge status={device.status} />
        <p className="text-[10px] text-slate-400 mt-1">Ping: {device.lastPing}</p>
      </td>

      {/* Signal */}
      <td className="px-4 py-3.5">
        <SignalBar level={device.signal} />
        <BatteryIcon level={device.battery} />
      </td>

      {/* Today's scans */}
      <td className="px-4 py-3.5">
        <p className="text-[13px] font-bold text-slate-700">{device.todayScans.toLocaleString()}</p>
        <p className="text-[10px] text-slate-400">{device.totalScans.toLocaleString()} total</p>
      </td>

      {/* Firmware */}
      <td className="px-4 py-3.5">
        <span className={`text-[11px] font-mono px-2 py-0.5 rounded-lg ${
          device.firmware === 'v3.2.1'
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : 'bg-amber-50 text-amber-700 border border-amber-200'
        }`}>{device.firmware}</span>
        {device.firmware !== 'v3.2.1' && (
          <p className="text-[10px] text-amber-500 mt-0.5">Update available</p>
        )}
      </td>

      {/* Action */}
      <td className="px-4 py-3.5">
        <button className={`p-1.5 rounded-lg transition-colors ${isSelected ? 'bg-indigo-100 text-indigo-600' : 'text-slate-300 hover:bg-slate-100 hover:text-slate-600'}`}>
          <Eye size={14} />
        </button>
      </td>
    </tr>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function RFIDDevicesPage() {
  const [statusFilter, setStatusFilter] = useState('All')
  const [zoneFilter, setZoneFilter]     = useState('All Zones')
  const [search, setSearch]             = useState('')
  const [selected, setSelected]         = useState(null)

  const filtered = DEVICES.filter(d => {
    const matchStatus = statusFilter === 'All' || d.status === statusFilter.toLowerCase()
    const matchZone   = zoneFilter === 'All Zones' || d.zone === zoneFilter
    const matchSearch = !search ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.id.toLowerCase().includes(search.toLowerCase()) ||
      d.location.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchZone && matchSearch
  })

  const selectedDevice = DEVICES.find(d => d.id === selected)
  const faultyCount = DEVICES.filter(d => d.status !== 'online').length

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Radio size={20} className="text-indigo-500" />
            <h1 className="text-[22px] font-bold text-slate-800">RFID Devices</h1>
            {faultyCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[11px] font-bold">{faultyCount} issue{faultyCount > 1 ? 's' : ''}</span>
            )}
          </div>
          <p className="text-[13px] text-slate-500">Monitor and manage all attendance hardware across your campus</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 text-[12px] text-slate-600 hover:bg-slate-50 transition-colors">
            <RefreshCw size={13} /> Refresh
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 text-[12px] text-slate-600 hover:bg-slate-50 transition-colors">
            <Download size={13} /> Export
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-[12px] font-semibold transition-colors">
            <Plus size={13} /> Add Device
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* ── Issue Banner ── */}
      {faultyCount > 0 && (
        <div className="flex items-start gap-3 px-5 py-4 rounded-2xl bg-amber-50 border border-amber-200">
          <AlertTriangle size={16} className="text-amber-500 mt-0.5 shrink-0" />
          <div className="flex-1 space-y-1">
            {DEVICES.filter(d => d.status !== 'online' && d.issue).map(d => (
              <div key={d.id} className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-amber-700">{d.name}:</span>
                <span className="text-[11px] text-amber-600">{d.issue}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => setStatusFilter('Offline')}
            className="shrink-0 px-3 py-1.5 rounded-xl bg-amber-500 text-white text-[11px] font-semibold hover:bg-amber-600 transition-colors whitespace-nowrap"
          >
            View Issues
          </button>
        </div>
      )}

      {/* ── Main layout ── */}
      <div className={`grid gap-5 ${selectedDevice ? 'lg:grid-cols-[1fr_360px]' : 'grid-cols-1'}`}>

        {/* ── Table ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 border-b border-slate-50">
            <div className="relative flex-1 max-w-xs">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search device or location…"
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
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                    statusFilter === f ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Zone filter */}
            <div className="relative">
              <select
                value={zoneFilter}
                onChange={e => setZoneFilter(e.target.value)}
                className="appearance-none pl-3 pr-7 py-2 rounded-xl border border-slate-200 text-[12px] text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white cursor-pointer"
              >
                {ZONE_FILTERS.map(f => <option key={f}>{f}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-50">
                  {['Device', 'Location', 'Status', 'Signal / Battery', "Today's Scans", 'Firmware', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-16 text-center">
                      <Radio size={32} className="mx-auto text-slate-200 mb-3" />
                      <p className="text-[13px] text-slate-400 font-medium">No devices found</p>
                      <p className="text-[11px] text-slate-300 mt-1">Try adjusting your filters</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map(device => (
                    <DeviceRow
                      key={device.id}
                      device={device}
                      selected={selected}
                      onSelect={setSelected}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-slate-50 flex items-center justify-between">
            <p className="text-[11px] text-slate-400">Showing {filtered.length} of {DEVICES.length} devices</p>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live monitoring active
              </span>
            </div>
          </div>
        </div>

        {/* ── Detail Panel ── */}
        {selectedDevice && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden h-fit">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
              <div>
                <p className="text-[14px] font-bold text-slate-800">Device Detail</p>
                <p className="text-[11px] font-mono text-slate-400 mt-0.5">{selectedDevice.id}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                <XCircle size={16} />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Device header */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                  selectedDevice.status === 'online' ? 'bg-emerald-50 border-emerald-200' :
                  selectedDevice.status === 'faulty' ? 'bg-amber-50 border-amber-200' :
                  'bg-rose-50 border-rose-200'
                }`}>
                  <Radio size={20} className={
                    selectedDevice.status === 'online' ? 'text-emerald-600' :
                    selectedDevice.status === 'faulty' ? 'text-amber-500' :
                    'text-rose-500'
                  } />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-slate-800 truncate">{selectedDevice.name}</p>
                  <p className="text-[11px] text-slate-500">{selectedDevice.model} · {selectedDevice.type}</p>
                </div>
              </div>

              {/* Status + Zone */}
              <div className="flex items-center gap-2 flex-wrap">
                <StatusBadge status={selectedDevice.status} />
                <ZoneBadge zone={selectedDevice.zone} />
              </div>

              {/* Issue */}
              {selectedDevice.issue && (
                <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-amber-50 border border-amber-200">
                  <AlertTriangle size={13} className="text-amber-500 mt-0.5 shrink-0" />
                  <p className="text-[11px] text-amber-700 font-medium leading-snug">{selectedDevice.issue}</p>
                </div>
              )}

              {/* Live metrics */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Today's Scans", value: selectedDevice.todayScans.toLocaleString(), icon: Activity,  color: 'bg-sky-50 text-sky-600' },
                  { label: 'Total Scans',   value: selectedDevice.totalScans.toLocaleString(), icon: BarChart2, color: 'bg-indigo-50 text-indigo-600' },
                ].map(m => (
                  <div key={m.label} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <m.icon size={14} className={m.color.split(' ')[1]} />
                    <p className="text-[18px] font-bold text-slate-800 mt-1">{m.value}</p>
                    <p className="text-[10px] text-slate-400">{m.label}</p>
                  </div>
                ))}
              </div>

              {/* Tech details */}
              <div className="space-y-2.5">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Device Info</p>
                {[
                  { icon: MapPin,      label: 'Location',    value: selectedDevice.location },
                  { icon: Signal,      label: 'Signal',      value: `${selectedDevice.signal}%` },
                  { icon: Battery,     label: 'Battery',     value: selectedDevice.battery !== null ? `${selectedDevice.battery}%` : 'Wired (AC)' },
                  { icon: Cpu,         label: 'IP Address',  value: selectedDevice.ipAddress },
                  { icon: ShieldCheck, label: 'Firmware',    value: selectedDevice.firmware },
                  { icon: Timer,       label: 'Last Seen',   value: selectedDevice.lastSeen },
                  { icon: Clock,       label: 'Installed',   value: selectedDevice.installedOn },
                ].map(row => (
                  <div key={row.label} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                      <row.icon size={11} className="text-slate-500" />
                    </div>
                    <div className="flex-1 flex items-center justify-between min-w-0">
                      <p className="text-[11px] text-slate-400">{row.label}</p>
                      <p className="text-[11px] font-medium text-slate-700 font-mono">{row.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-1">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Actions</p>
                <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-[12px] font-semibold hover:bg-slate-50 transition-colors">
                  <RotateCcw size={13} /> Restart Device
                </button>
                {selectedDevice.firmware !== 'v3.2.1' && (
                  <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-[12px] font-semibold transition-colors">
                    <Zap size={13} /> Update Firmware
                  </button>
                )}
                <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-[12px] font-semibold hover:bg-slate-50 transition-colors">
                  <Settings size={13} /> Configure Device
                </button>
                {selectedDevice.status === 'offline' && (
                  <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 text-[12px] font-semibold transition-colors">
                    <Trash2 size={13} /> Remove Device
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Recent Activity ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
          <div>
            <p className="text-[14px] font-bold text-slate-800">Recent Device Activity</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Latest events from all RFID devices</p>
          </div>
          <Link href="/school/scans" className="text-[11px] text-sky-500 hover:text-sky-600 font-medium flex items-center gap-1">
            Full scan log <ChevronRight size={11} />
          </Link>
        </div>
        <div className="divide-y divide-slate-50">
          {RECENT_ACTIVITY.map((a, i) => {
            const m = ACTIVITY_META[a.status]
            return (
              <div key={i} className="flex items-center gap-4 px-5 py-3">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${m.bg}`}>
                  <m.icon size={13} className={m.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium text-slate-700">
                    <span className="text-slate-500">{a.device}</span>
                    {' — '}
                    {a.event}
                    {a.student && <span className="text-slate-800 font-semibold"> · {a.student}</span>}
                  </p>
                </div>
                <span className="text-[11px] text-slate-400 shrink-0">{a.time}</span>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}