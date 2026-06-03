// app/(superadmin)/superadmin/page.jsx
'use client';

import { useState, useEffect } from 'react';
import {
  Activity, Users, Building2, TrendingUp, AlertTriangle,
  CheckCircle, RefreshCw, FileDown, ArrowUp, ArrowDown,
  Loader2, IndianRupee, ScanLine, Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ═══════════════════════════════════════════════════════════════════════════════
// MOCK DATA — replace with real API calls
// ═══════════════════════════════════════════════════════════════════════════════

const STATS = {
  totalSchools: 124,
  activeSchools: 118,
  totalStudents: 28473,
  activeAlerts: 8,
  monthlyRevenue: 284500,   // in INR paise → display as ₹2,845
  totalScans: 142380,
};

const RECENT_SCHOOLS = [
  { id: 1, name: 'Springfield High School', students: 1245, plan: 'bundle_safety', status: 'active', joinDate: '2025-01-15' },
  { id: 2, name: 'Riverside Academy', students: 3420, plan: 'resqid_complete', status: 'active', joinDate: '2024-11-20' },
  { id: 3, name: 'Northside Elementary', students: 580, plan: 'module_emergency', status: 'active', joinDate: '2025-02-10' },
  { id: 4, name: 'Westlake College', students: 890, plan: 'module_attendance', status: 'suspended', joinDate: '2025-01-05' },
  { id: 5, name: 'Sunnydale School', students: 2150, plan: 'bundle_ops', status: 'active', joinDate: '2024-12-01' },
];

const RECENT_ACTIVITY = [
  { id: 1, user: 'Arjun Das', action: 'Created new school', target: 'Green Valley School', timestamp: '2025-05-25T10:30:00', type: 'create' },
  { id: 2, user: 'Priya Sharma', action: 'Updated subscription', target: 'Riverside Academy', timestamp: '2025-05-25T09:15:00', type: 'update' },
  { id: 3, user: 'System', action: 'Alert resolved', target: 'High latency spike', timestamp: '2025-05-25T08:45:00', type: 'resolve' },
  { id: 4, user: 'Raj Patel', action: 'Exported reports', target: 'Monthly attendance', timestamp: '2025-05-24T16:20:00', type: 'export' },
  { id: 5, user: 'Sneha Biswas', action: 'Added new admin', target: 'Sarah Williams', timestamp: '2025-05-24T14:10:00', type: 'create' },
];

const CHART_DATA = [
  { month: 'Jan', schools: 98, students: 18500 },
  { month: 'Feb', schools: 105, students: 20120 },
  { month: 'Mar', schools: 112, students: 22850 },
  { month: 'Apr', schools: 118, students: 25430 },
  { month: 'May', schools: 124, students: 28473 },
  { month: 'Jun', schools: 132, students: 31200 },
];

const SYSTEM_HEALTH = [
  { label: 'API Gateway', status: 'Operational', color: 'emerald' },
  { label: 'PostgreSQL (Railway)', status: 'Operational', color: 'emerald' },
  { label: 'Redis / BullMQ', status: 'Operational', color: 'emerald' },
  { label: 'SMS (MSG91)', status: 'Degraded', color: 'amber' },
  { label: 'Expo Push', status: 'Operational', color: 'emerald' },
  { label: 'Storage', status: 'Operational', color: 'emerald' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// PLAN BADGE — uses actual RESQID plan IDs
// ═══════════════════════════════════════════════════════════════════════════════

const PLAN_META = {
  module_emergency: { label: 'Emergency', color: 'bg-red-50 text-red-600 border-red-200' },
  module_attendance: { label: 'Attendance', color: 'bg-green-50 text-green-600 border-green-200' },
  module_timetable: { label: 'Timetable', color: 'bg-purple-50 text-purple-600 border-purple-200' },
  module_parent_communication: { label: 'Communication', color: 'bg-orange-50 text-orange-600 border-orange-200' },
  bundle_safety: { label: 'Safety Bundle', color: 'bg-blue-50 text-blue-600 border-blue-200' },
  bundle_ops: { label: 'Ops Bundle', color: 'bg-teal-50 text-teal-600 border-teal-200' },
  bundle_connect: { label: 'Connect Bundle', color: 'bg-amber-50 text-amber-600 border-amber-200' },
  resqid_complete: { label: 'Complete', color: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
};

function PlanBadge({ planId }) {
  const meta = PLAN_META[planId] ?? { label: planId, color: 'bg-slate-100 text-slate-500 border-slate-200' };
  return (
    <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-semibold border', meta.color)}>
      {meta.label}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STAT CARD
// ═══════════════════════════════════════════════════════════════════════════════

const STAT_CONFIGS = [
  {
    title: 'Total Schools',
    key: 'totalSchools',
    icon: Building2,
    iconBg: 'bg-indigo-50',
    iconColor: 'text-indigo-500',
    trend: +1, trendValue: 6.9,
    format: (v) => v.toLocaleString('en-IN'),
  },
  {
    title: 'Active Schools',
    key: 'activeSchools',
    icon: CheckCircle,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-500',
    trend: +1, trendValue: 4.4,
    format: (v) => v.toLocaleString('en-IN'),
  },
  {
    title: 'Total Students',
    key: 'totalStudents',
    icon: Users,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-500',
    trend: +1, trendValue: 8.2,
    format: (v) => v.toLocaleString('en-IN'),
  },
  {
    title: 'QR Scans (Total)',
    key: 'totalScans',
    icon: ScanLine,
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-500',
    trend: +1, trendValue: 12.1,
    format: (v) => v.toLocaleString('en-IN'),
  },
  {
    title: 'Monthly Revenue',
    key: 'monthlyRevenue',
    icon: IndianRupee,
    iconBg: 'bg-green-50',
    iconColor: 'text-green-500',
    trend: +1, trendValue: 11.3,
    format: (v) => `₹${(v / 100).toLocaleString('en-IN')}`,
  },
  {
    title: 'Active Alerts',
    key: 'activeAlerts',
    icon: AlertTriangle,
    iconBg: 'bg-red-50',
    iconColor: 'text-red-500',
    trend: -1, trendValue: 20,
    format: (v) => v.toLocaleString('en-IN'),
  },
];

function StatCard({ title, value, icon: Icon, iconBg, iconColor, trend, trendValue, format }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', iconBg)}>
          <Icon size={15} className={iconColor} />
        </div>
        <span className={cn(
          'text-[11px] flex items-center gap-0.5 font-semibold',
          trend > 0 ? 'text-emerald-500' : 'text-red-500',
        )}>
          {trend > 0 ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
          {trendValue}%
        </span>
      </div>
      <div>
        <p className="text-[22px] font-semibold text-slate-800 leading-tight tabular-nums">
          {format(value)}
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5">{title}</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACTIVITY ITEM
// ═══════════════════════════════════════════════════════════════════════════════

const ACTIVITY_CONFIG = {
  create: { icon: CheckCircle, bg: 'bg-emerald-50', color: 'text-emerald-500' },
  update: { icon: RefreshCw, bg: 'bg-blue-50', color: 'text-blue-500' },
  resolve: { icon: Shield, bg: 'bg-violet-50', color: 'text-violet-500' },
  export: { icon: FileDown, bg: 'bg-amber-50', color: 'text-amber-500' },
};

function ActivityItem({ activity }) {
  const cfg = ACTIVITY_CONFIG[activity.type] ?? { icon: Activity, bg: 'bg-slate-100', color: 'text-slate-400' };
  const Icon = cfg.icon;
  const time = new Date(activity.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const initials = activity.user.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-0">
      {/* User avatar */}
      <div className="w-7 h-7 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center shrink-0">
        <span className="text-indigo-700 text-[9px] font-bold">{initials}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-medium text-slate-700 truncate">
          {activity.user} <span className="text-slate-400 font-normal">·</span> {activity.action}
        </p>
        <p className="text-[11px] text-slate-400 truncate">{activity.target}</p>
      </div>
      {/* Action type icon */}
      <div className={cn('w-6 h-6 rounded-md flex items-center justify-center shrink-0', cfg.bg)}>
        <Icon size={11} className={cfg.color} />
      </div>
      <span className="text-[10px] text-slate-400 shrink-0 w-10 text-right">{time}</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// GROWTH CHART — pure CSS bars, no recharts dependency
// ═══════════════════════════════════════════════════════════════════════════════

function GrowthChart() {
  const maxStudents = Math.max(...CHART_DATA.map(d => d.students));
  const maxSchools = Math.max(...CHART_DATA.map(d => d.schools));
  const BAR_H = 120;

  return (
    <div className="flex items-end gap-2 h-36">
      {CHART_DATA.map((item, idx) => {
        const sH = Math.round((item.students / maxStudents) * BAR_H);
        const scH = Math.round((item.schools / maxSchools) * BAR_H);
        return (
          <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
            <div className="flex items-end gap-[2px] w-full justify-center" style={{ height: `${BAR_H}px` }}>
              <div
                title={`${item.students.toLocaleString('en-IN')} students`}
                className="w-[45%] bg-indigo-200 rounded-t-[3px] group-hover:bg-indigo-400 transition-colors duration-150 cursor-default"
                style={{ height: `${sH}px` }}
              />
              <div
                title={`${item.schools} schools`}
                className="w-[45%] bg-blue-100 rounded-t-[3px] group-hover:bg-blue-300 transition-colors duration-150 cursor-default"
                style={{ height: `${scH}px` }}
              />
            </div>
            <span className="text-[10px] text-slate-400">{item.month}</span>
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function SuperadminDashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mx-auto mb-3" />
          <p className="text-slate-400 text-[13px]">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-screen-xl mx-auto p-6 space-y-5">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-[18px] font-semibold text-slate-800">Dashboard</h1>
            <p className="text-[12px] text-slate-400 mt-0.5">coreZ Technologies · Super Admin</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 text-[12px] transition-colors">
              <FileDown size={13} /> Export
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 text-[12px] transition-colors">
              <RefreshCw size={13} /> Refresh
            </button>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
          {STAT_CONFIGS.map(cfg => (
            <StatCard key={cfg.key} {...cfg} value={STATS[cfg.key]} />
          ))}
        </div>

        {/* ── Growth Chart + Activity ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

          {/* Chart — takes 3/5 */}
          <div className="lg:col-span-3 bg-white rounded-xl border border-slate-100 p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-[13px] font-semibold text-slate-700 flex items-center gap-1.5">
                  <TrendingUp size={14} className="text-slate-400" />
                  Growth Overview
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">Students & schools over time</p>
              </div>
              <select className="text-[11px] border border-slate-200 rounded-lg px-2 py-1.5 bg-white text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
                <option>Last 6 months</option>
                <option>Last 12 months</option>
              </select>
            </div>

            <GrowthChart />

            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-indigo-200 rounded-sm" />
                <span className="text-[10px] text-slate-400">Students</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-blue-100 rounded-sm" />
                <span className="text-[10px] text-slate-400">Schools</span>
              </div>
            </div>
          </div>

          {/* Activity Feed — takes 2/5 */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[13px] font-semibold text-slate-700 flex items-center gap-1.5">
                <Activity size={14} className="text-slate-400" />
                Recent Activity
              </p>
              <button className="text-[11px] text-indigo-500 hover:text-indigo-700 transition-colors">View all →</button>
            </div>
            <div>
              {RECENT_ACTIVITY.map(a => <ActivityItem key={a.id} activity={a} />)}
            </div>
          </div>
        </div>

        {/* ── Schools Table + System Health ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

          {/* Schools — 3/5 */}
          <div className="lg:col-span-3 bg-white rounded-xl border border-slate-100 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-50 flex items-center justify-between">
              <p className="text-[13px] font-semibold text-slate-700 flex items-center gap-1.5">
                <Building2 size={14} className="text-slate-400" />
                Recently Added Schools
              </p>
              <button className="text-[11px] text-indigo-500 hover:text-indigo-700 transition-colors">View all →</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-50">
                    <th className="text-left py-2.5 px-4 text-[10px] font-semibold uppercase tracking-wider text-slate-400">School</th>
                    <th className="text-left py-2.5 px-4 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Students</th>
                    <th className="text-left py-2.5 px-4 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Plan</th>
                    <th className="text-left py-2.5 px-4 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {RECENT_SCHOOLS.map(school => (
                    <tr key={school.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 text-[12.5px] font-medium text-slate-700">{school.name}</td>
                      <td className="py-3 px-4 text-[12px] text-slate-500 tabular-nums">
                        {school.students.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4">
                        <PlanBadge planId={school.plan} />
                      </td>
                      <td className="py-3 px-4">
                        <span className={cn(
                          'inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-semibold',
                          school.status === 'active'
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-red-50 text-red-600',
                        )}>
                          <span className={cn('w-1.5 h-1.5 rounded-full', {
                            'bg-emerald-400': school.status === 'active',
                            'bg-red-400': school.status === 'suspended',
                          })} />
                          {school.status === 'active' ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* System Health — 2/5 */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 p-5">
            <p className="text-[13px] font-semibold text-slate-700 flex items-center gap-1.5 mb-4">
              <Activity size={14} className="text-slate-400" />
              System Health
            </p>
            <div className="space-y-2">
              {SYSTEM_HEALTH.map(({ label, status, color }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', {
                      'bg-emerald-400': color === 'emerald',
                      'bg-amber-400': color === 'amber',
                      'bg-red-400': color === 'red',
                    })} />
                    <span className="text-[12px] text-slate-600">{label}</span>
                  </div>
                  <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', {
                    'bg-emerald-50 text-emerald-600': color === 'emerald',
                    'bg-amber-50 text-amber-600': color === 'amber',
                    'bg-red-50 text-red-600': color === 'red',
                  })}>
                    {status}
                  </span>
                </div>
              ))}
            </div>

            {/* Quick summary */}
            <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
              <p className="text-[11px] text-slate-400">
                {SYSTEM_HEALTH.filter(s => s.color === 'emerald').length}/{SYSTEM_HEALTH.length} operational
              </p>
              <span className="text-[10px] bg-amber-50 text-amber-600 font-semibold px-2 py-0.5 rounded-full">
                1 degraded
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}