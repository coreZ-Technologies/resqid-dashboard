// app/(superadmin)/superadmin/page.jsx
'use client';

import { useState, useEffect } from 'react';
import {
  Activity, Users, School, TrendingUp, DollarSign, AlertTriangle,
  Bell, CheckCircle, XCircle, Clock, Eye, ArrowUp, ArrowDown,
  MoreVertical, Calendar, Download, RefreshCw, Loader2, FileDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA (replace with real API calls later)
// ─────────────────────────────────────────────────────────────────────────────

const STATS = {
  totalSchools: 124,
  activeSchools: 118,
  totalStudents: 28473,
  totalTeachers: 2156,
  monthlyRevenue: 28450,
  activeAlerts: 8,
};

const RECENT_SCHOOLS = [
  { id: 1, name: 'Springfield High School', students: 1245, teachers: 78, status: 'active', plan: 'Pro', joinDate: '2025-01-15' },
  { id: 2, name: 'Riverside Academy', students: 3420, teachers: 145, status: 'active', plan: 'Enterprise', joinDate: '2024-11-20' },
  { id: 3, name: 'Northside Elementary', students: 580, teachers: 42, status: 'active', plan: 'Basic', joinDate: '2025-02-10' },
  { id: 4, name: 'Westlake College', students: 890, teachers: 67, status: 'suspended', plan: 'Free', joinDate: '2025-01-05' },
  { id: 5, name: 'Sunnydale School', students: 2150, teachers: 98, status: 'active', plan: 'Pro', joinDate: '2024-12-01' },
];

const RECENT_ACTIVITY = [
  { id: 1, user: 'Alex Johnson', action: 'Created new school', target: 'Green Valley School', timestamp: '2025-05-25T10:30:00', type: 'create' },
  { id: 2, user: 'Maria Garcia', action: 'Updated subscription', target: 'Riverside Academy', timestamp: '2025-05-25T09:15:00', type: 'update' },
  { id: 3, user: 'System', action: 'Alert resolved', target: 'High latency detected', timestamp: '2025-05-25T08:45:00', type: 'resolve' },
  { id: 4, user: 'Raj Patel', action: 'Exported reports', target: 'Monthly attendance', timestamp: '2025-05-24T16:20:00', type: 'export' },
  { id: 5, user: 'Priya Sharma', action: 'Added new admin', target: 'Sarah Williams', timestamp: '2025-05-24T14:10:00', type: 'create' },
];

const CHART_DATA = [
  { month: 'Jan', schools: 98, students: 18500 },
  { month: 'Feb', schools: 105, students: 20120 },
  { month: 'Mar', schools: 112, students: 22850 },
  { month: 'Apr', schools: 118, students: 25430 },
  { month: 'May', schools: 124, students: 28473 },
  { month: 'Jun', schools: 132, students: 31200 },
];

// ─────────────────────────────────────────────────────────────────────────────
// STAT CARD CONFIG — explicit icon colors per card, avoids broken replace() hack
// ─────────────────────────────────────────────────────────────────────────────

const STAT_CONFIGS = [
  { title: 'Total Schools',    key: 'totalSchools',    icon: School,        bg: 'bg-blue-100',    iconColor: 'text-blue-600',    trend: +1, trendValue: 6.9  },
  { title: 'Active Schools',   key: 'activeSchools',   icon: CheckCircle,   bg: 'bg-emerald-100', iconColor: 'text-emerald-600', trend: +1, trendValue: 4.4  },
  { title: 'Total Students',   key: 'totalStudents',   icon: Users,         bg: 'bg-purple-100',  iconColor: 'text-purple-600',  trend: +1, trendValue: 8.2  },
  { title: 'Total Teachers',   key: 'totalTeachers',   icon: Users,         bg: 'bg-amber-100',   iconColor: 'text-amber-600',   trend: +1, trendValue: 5.1  },
  { title: 'Monthly Revenue',  key: 'monthlyRevenue',  icon: DollarSign,    bg: 'bg-green-100',   iconColor: 'text-green-600',   trend: +1, trendValue: 11.3 },
  { title: 'Active Alerts',    key: 'activeAlerts',    icon: AlertTriangle, bg: 'bg-red-100',     iconColor: 'text-red-600',     trend: -1, trendValue: 20   },
];

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function StatCard({ title, value, icon: Icon, trend, trendValue, bg, iconColor }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', bg)}>
          <Icon size={20} className={iconColor} />
        </div>
        <span className={cn(
          'text-xs flex items-center gap-0.5 font-medium',
          trend > 0 ? 'text-emerald-600' : 'text-red-600'
        )}>
          {trend > 0 ? <ArrowUp size={11} /> : <ArrowDown size={11} />}
          {trendValue}%
        </span>
      </div>
      <p className="text-2xl font-bold text-slate-800 tabular-nums">{value.toLocaleString()}</p>
      <p className="text-xs text-slate-500 mt-0.5">{title}</p>
    </div>
  );
}

function ActivityItem({ activity }) {
  const config = {
    create:  { icon: <CheckCircle size={14} className="text-emerald-600" />, bg: 'bg-emerald-50' },
    update:  { icon: <RefreshCw    size={14} className="text-blue-600"    />, bg: 'bg-blue-50'    },
    resolve: { icon: <CheckCircle  size={14} className="text-purple-600"  />, bg: 'bg-purple-50'  },
    export:  { icon: <FileDown     size={14} className="text-amber-600"   />, bg: 'bg-amber-50'   },
  };
  const { icon, bg } = config[activity.type] ?? { icon: <Eye size={14} className="text-slate-400" />, bg: 'bg-slate-100' };

  const time = new Date(activity.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
      <div className={cn('w-8 h-8 rounded-full flex items-center justify-center shrink-0', bg)}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-800">{activity.user}</p>
        <p className="text-xs text-slate-500 truncate">
          {activity.action} · <span className="font-medium text-slate-700">{activity.target}</span>
        </p>
      </div>
      <div className="text-xs text-slate-400 shrink-0 pt-0.5">{time}</div>
    </div>
  );
}

// Grouped bar chart — students and schools on independent normalized scales
function GrowthChart() {
  const maxStudents = Math.max(...CHART_DATA.map(d => d.students));
  const maxSchools  = Math.max(...CHART_DATA.map(d => d.schools));
  const BAR_H = 160; // px — max bar height

  return (
    <div className="flex items-end gap-3 h-44">
      {CHART_DATA.map((item, idx) => {
        const studentH = Math.round((item.students / maxStudents) * BAR_H);
        const schoolH  = Math.round((item.schools  / maxSchools)  * BAR_H);
        return (
          <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
            {/* Bars side-by-side */}
            <div className="flex items-end gap-[3px] w-full justify-center" style={{ height: `${BAR_H}px` }}>
              <div
                title={`${item.students.toLocaleString()} students`}
                className="w-[45%] bg-blue-500 rounded-t-[4px] transition-all group-hover:bg-blue-600 cursor-default"
                style={{ height: `${studentH}px` }}
              />
              <div
                title={`${item.schools} schools`}
                className="w-[45%] bg-emerald-500 rounded-t-[4px] transition-all group-hover:bg-emerald-600 cursor-default"
                style={{ height: `${schoolH}px` }}
              />
            </div>
            <span className="text-[11px] text-slate-500">{item.month}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function SuperadminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats] = useState(STATS);
  const [recentSchools] = useState(RECENT_SCHOOLS);
  const [recentActivity] = useState(RECENT_ACTIVITY);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-screen-2xl mx-auto p-6 space-y-5">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Dashboard</h1>
            <p className="text-slate-500 text-sm mt-0.5">Welcome back, Super Admin</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-sm shadow-sm transition-colors">
              <Download size={15} /> Export Report
            </button>
            <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-sm shadow-sm transition-colors">
              <RefreshCw size={15} /> Refresh
            </button>
          </div>
        </div>

        {/* Stats Grid — 2 cols → 3 cols → 6 cols, but capped width prevents squishing */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
          {STAT_CONFIGS.map(cfg => (
            <StatCard
              key={cfg.key}
              title={cfg.title}
              value={stats[cfg.key]}
              icon={cfg.icon}
              bg={cfg.bg}
              iconColor={cfg.iconColor}
              trend={cfg.trend}
              trendValue={cfg.trendValue}
            />
          ))}
        </div>

        {/* Growth Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
              <TrendingUp size={18} className="text-slate-500" />
              Growth Overview
            </h2>
            <select className="text-sm border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30">
              <option>Last 6 months</option>
              <option>Last 12 months</option>
            </select>
          </div>

          <GrowthChart />

          <div className="flex items-center gap-5 mt-4 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-blue-500 rounded-sm" />
              <span>Students</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-emerald-500 rounded-sm" />
              <span>Schools</span>
            </div>
          </div>
        </div>

        {/* Recent Schools & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Schools Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                <School size={17} className="text-slate-500" />
                Recently Added Schools
              </h2>
              <button className="text-sm text-blue-600 hover:text-blue-800 transition-colors">View all →</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left py-2.5 px-4 text-xs font-medium text-slate-500">School</th>
                    <th className="text-left py-2.5 px-4 text-xs font-medium text-slate-500">Students</th>
                    <th className="text-left py-2.5 px-4 text-xs font-medium text-slate-500">Teachers</th>
                    <th className="text-left py-2.5 px-4 text-xs font-medium text-slate-500">Plan</th>
                    <th className="text-left py-2.5 px-4 text-xs font-medium text-slate-500">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentSchools.map(school => (
                    <tr key={school.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 text-sm font-medium text-slate-800">{school.name}</td>
                      <td className="py-3 px-4 text-sm text-slate-600 tabular-nums">{school.students.toLocaleString()}</td>
                      <td className="py-3 px-4 text-sm text-slate-600 tabular-nums">{school.teachers}</td>
                      <td className="py-3 px-4">
                        <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', {
                          'bg-purple-100 text-purple-700': school.plan === 'Enterprise',
                          'bg-blue-100   text-blue-700':   school.plan === 'Pro',
                          'bg-slate-100  text-slate-600':  school.plan === 'Basic',
                          'bg-slate-100  text-slate-400':  school.plan === 'Free',
                        })}>
                          {school.plan}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 w-fit', {
                          'bg-emerald-100 text-emerald-700': school.status === 'active',
                          'bg-red-100     text-red-700':     school.status === 'suspended',
                        })}>
                          <span className={cn('w-1.5 h-1.5 rounded-full', {
                            'bg-emerald-500': school.status === 'active',
                            'bg-red-500':     school.status === 'suspended',
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

          {/* Activity Feed */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                <Activity size={17} className="text-slate-500" />
                Recent Activity
              </h2>
              <button className="text-sm text-blue-600 hover:text-blue-800 transition-colors">View all →</button>
            </div>
            <div className="px-4 py-1">
              {recentActivity.map(activity => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={16} className="text-slate-500" />
            <h2 className="font-semibold text-slate-800">System Health</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: 'API Gateway',           status: 'Operational', color: 'emerald' },
              { label: 'Database',              status: 'Operational', color: 'emerald' },
              { label: 'Notification Service',  status: 'Degraded',    color: 'amber'   },
              { label: 'Storage',               status: 'Operational', color: 'emerald' },
            ].map(({ label, status, color }) => (
              <div key={label} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className={cn('w-2 h-2 rounded-full', {
                    'bg-emerald-500': color === 'emerald',
                    'bg-amber-500':   color === 'amber',
                    'bg-red-500':     color === 'red',
                  })} />
                  <span className="text-sm text-slate-600">{label}</span>
                </div>
                <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', {
                  'bg-emerald-50 text-emerald-600': color === 'emerald',
                  'bg-amber-50   text-amber-600':   color === 'amber',
                  'bg-red-50     text-red-600':     color === 'red',
                })}>
                  {status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}