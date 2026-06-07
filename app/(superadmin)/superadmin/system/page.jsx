'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Activity, Server, Database, Cloud, Shield, Clock, CheckCircle,
  XCircle, AlertCircle, Loader2, RefreshCw, Cpu, HardDrive,
  Wifi, Zap, Thermometer, TrendingUp, TrendingDown, Minus,
  BarChart3, PieChart, Gauge, Globe, Lock, Mail, MessageCircle,
  Calendar, Users, BookOpen, Bell, Eye, Download, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS & MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────

const SERVICES = [
  { name: 'API Gateway', status: 'operational', latency: 42, uptime: 99.99, icon: Globe },
  { name: 'Authentication Service', status: 'operational', latency: 28, uptime: 99.98, icon: Lock },
  { name: 'Database (Primary)', status: 'operational', latency: 15, uptime: 99.99, icon: Database },
  { name: 'Database (Replica)', status: 'operational', latency: 18, uptime: 99.97, icon: Database },
  { name: 'Redis Cache', status: 'operational', latency: 5, uptime: 99.99, icon: Zap },
  { name: 'Storage Service', status: 'operational', latency: 35, uptime: 99.95, icon: HardDrive },
  { name: 'Notification Service', status: 'degraded', latency: 120, uptime: 99.2, icon: Bell },
  { name: 'Email Service', status: 'operational', latency: 85, uptime: 99.8, icon: Mail },
  { name: 'SMS Gateway', status: 'operational', latency: 95, uptime: 99.7, icon: MessageCircle },
  { name: 'Real-time SSE', status: 'operational', latency: 22, uptime: 99.9, icon: Activity },
];

const SYSTEM_METRICS = {
  cpu: { usage: 42, history: [38, 42, 45, 43, 41, 42, 40] },
  memory: { used: 8.2, total: 16, percentage: 51, history: [48, 50, 52, 51, 49, 51, 50] },
  disk: { used: 124, total: 256, percentage: 48, history: [45, 46, 47, 48, 48, 47, 48] },
  network: { in: 24.5, out: 12.3, history: [22, 24, 25, 23, 24, 24.5, 24] },
};

const RECENT_INCIDENTS = [
  { id: 'INC-001', title: 'Notification Service Latency Spike', severity: 'medium', status: 'resolved', time: '2025-05-24T10:30:00', duration: '45 min' },
  { id: 'INC-002', title: 'Database Replication Lag', severity: 'low', status: 'resolved', time: '2025-05-23T15:20:00', duration: '20 min' },
  { id: 'INC-003', title: 'SMS Gateway Timeout', severity: 'high', status: 'monitoring', time: '2025-05-25T08:15:00', duration: 'ongoing' },
];

const LOG_ENTRIES = [
  { timestamp: '2025-05-25T11:30:00', level: 'info', message: 'System health check completed', service: 'Monitor' },
  { timestamp: '2025-05-25T11:25:00', level: 'warning', message: 'High latency detected on Notification Service', service: 'Alert' },
  { timestamp: '2025-05-25T11:20:00', level: 'info', message: 'Backup completed successfully', service: 'Database' },
  { timestamp: '2025-05-25T11:15:00', level: 'error', message: 'Failed to send SMS to +1 555-0101', service: 'SMS' },
  { timestamp: '2025-05-25T11:10:00', level: 'info', message: 'Cache hit ratio: 92%', service: 'Redis' },
];

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const config = {
    operational: { icon: CheckCircle, color: 'bg-emerald-100 text-emerald-800', label: 'Operational' },
    degraded: { icon: AlertCircle, color: 'bg-amber-100 text-amber-800', label: 'Degraded' },
    outage: { icon: XCircle, color: 'bg-red-100 text-red-800', label: 'Outage' },
    maintenance: { icon: Clock, color: 'bg-blue-100 text-blue-800', label: 'Maintenance' },
    resolved: { icon: CheckCircle, color: 'bg-emerald-100 text-emerald-800', label: 'Resolved' },
    monitoring: { icon: Activity, color: 'bg-blue-100 text-blue-800', label: 'Monitoring' },
  };
  const c = config[status] || config.operational;
  const Icon = c.icon;
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium', c.color)}>
      <Icon size={12} />
      {c.label}
    </span>
  );
}

function ServiceCard({ service }) {
  const Icon = service.icon;
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
            <Icon size={16} className="text-slate-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-800">{service.name}</p>
            <p className="text-xs text-slate-400">{service.latency}ms avg</p>
          </div>
        </div>
        <StatusBadge status={service.status} />
      </div>
      <div className="mt-2 pt-2 border-t border-slate-100">
        <div className="flex justify-between text-xs">
          <span className="text-slate-500">Uptime</span>
          <span className="font-medium text-slate-700">{service.uptime}%</span>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, unit, icon: Icon, trend, history, color }) {
  const [showHistory, setShowHistory] = useState(false);
  const maxHistory = Math.max(...(history || [0]));

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', color || 'bg-blue-100')}>
            <Icon size={16} className={cn('text-blue-700', color?.replace('bg-', 'text-'))} />
          </div>
          <span className="text-sm font-medium text-slate-600">{title}</span>
        </div>
        {trend && (
          <span className={cn('text-xs flex items-center gap-0.5', trend > 0 ? 'text-red-600' : trend < 0 ? 'text-emerald-600' : 'text-slate-400')}>
            {trend > 0 ? <TrendingUp size={12} /> : trend < 0 ? <TrendingDown size={12} /> : <Minus size={12} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-slate-800">{value}</span>
        <span className="text-sm text-slate-400">{unit}</span>
      </div>
      {history && (
        <div className="mt-3">
          <button onClick={() => setShowHistory(!showHistory)} className="text-xs text-blue-600 flex items-center gap-1">
            <Eye size={12} /> {showHistory ? 'Hide' : 'Show'} history
          </button>
          {showHistory && (
            <div className="mt-2 flex items-end gap-1 h-12">
              {history.map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-slate-100 rounded-t-sm" style={{ height: `${(h / maxHistory) * 32}px` }} />
                  <span className="text-[9px] text-slate-400 mt-0.5">{h}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function IncidentItem({ incident }) {
  const formatTime = (iso) => new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const severityColor = {
    high: 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-amber-100 text-amber-800 border-amber-200',
    low: 'bg-blue-100 text-blue-800 border-blue-200',
  };
  return (
    <div className="flex items-start gap-3 p-3 border-b border-slate-100 last:border-0 hover:bg-slate-50">
      <div className={cn('w-2 h-2 rounded-full mt-2', incident.severity === 'high' ? 'bg-red-500' : incident.severity === 'medium' ? 'bg-amber-500' : 'bg-blue-500')} />
      <div className="flex-1">
        <p className="text-sm font-medium text-slate-800">{incident.title}</p>
        <div className="flex flex-wrap gap-2 mt-1">
          <span className="text-xs text-slate-400">{formatTime(incident.time)}</span>
          <span className="text-xs text-slate-400">•</span>
          <span className="text-xs text-slate-400">Duration: {incident.duration}</span>
        </div>
      </div>
      <StatusBadge status={incident.status} />
    </div>
  );
}

function LogEntry({ entry }) {
  const levelIcon = {
    info: <CheckCircle size={12} className="text-emerald-600" />,
    warning: <AlertCircle size={12} className="text-amber-600" />,
    error: <XCircle size={12} className="text-red-600" />,
  };
  const time = new Date(entry.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  return (
    <div className="flex items-start gap-2 p-2 text-xs font-mono hover:bg-slate-50 rounded-lg">
      <span className="text-slate-400 w-16 shrink-0">{time}</span>
      <span className="shrink-0">{levelIcon[entry.level]}</span>
      <span className="text-slate-600 flex-1">{entry.message}</span>
      <span className="text-slate-400">{entry.service}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function SystemHealthPage() {
  const [services, setServices] = useState(SERVICES);
  const [incidents, setIncidents] = useState(RECENT_INCIDENTS);
  const [logs, setLogs] = useState(LOG_ENTRIES);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Overall status
  const overallStatus = useMemo(() => {
    const hasOutage = services.some(s => s.status === 'outage');
    const hasDegraded = services.some(s => s.status === 'degraded');
    if (hasOutage) return { status: 'outage', label: 'Partial Outage', color: 'bg-red-100 text-red-800' };
    if (hasDegraded) return { status: 'degraded', label: 'Degraded Performance', color: 'bg-amber-100 text-amber-800' };
    return { status: 'operational', label: 'All Systems Operational', color: 'bg-emerald-100 text-emerald-800' };
  }, [services]);

  const operationalCount = services.filter(s => s.status === 'operational').length;
  const degradedCount = services.filter(s => s.status === 'degraded').length;
  const outageCount = services.filter(s => s.status === 'outage').length;

  // Simulate refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 800));
    // Simulate updated metrics
    setServices(prev => prev.map(s => ({
      ...s,
      latency: s.latency + (Math.random() - 0.5) * 10,
      uptime: Math.min(99.99, s.uptime + (Math.random() - 0.5) * 0.05),
    })));
    setLastUpdated(new Date());
    setRefreshing(false);
  };

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(handleRefresh, 30000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-screen-2xl mx-auto p-6 space-y-5">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">System Health</h1>
            <p className="text-slate-500 text-sm mt-0.5">Monitor platform performance, service status, and incidents</p>
          </div>
          <div className="flex gap-2 items-center">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={cn('flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium shadow-sm', autoRefresh ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600')}
            >
              <RefreshCw size={15} className={autoRefresh ? '' : ''} />
              Live {autoRefresh ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-sm font-medium shadow-sm disabled:opacity-50"
            >
              <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>

        {/* Overall Status Banner */}
        <div className={cn('rounded-2xl p-4 flex items-center justify-between', overallStatus.color, 'border')}>
          <div className="flex items-center gap-3">
            {overallStatus.status === 'operational' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
            <div>
              <p className="font-semibold">{overallStatus.label}</p>
              <p className="text-sm opacity-80">Last updated: {lastUpdated.toLocaleTimeString()}</p>
            </div>
          </div>
          <div className="flex gap-4 text-sm">
            <span>{operationalCount} Operational</span>
            {degradedCount > 0 && <span className="text-amber-800">{degradedCount} Degraded</span>}
            {outageCount > 0 && <span className="text-red-800">{outageCount} Outage</span>}
          </div>
        </div>

        {/* System Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="CPU Usage" value={SYSTEM_METRICS.cpu.usage} unit="%" icon={Cpu} trend={+2} history={SYSTEM_METRICS.cpu.history} color="bg-blue-100" />
          <MetricCard title="Memory Usage" value={SYSTEM_METRICS.memory.percentage} unit="%" icon={Server} trend={+1} history={SYSTEM_METRICS.memory.history} color="bg-purple-100" />
          <MetricCard title="Disk Usage" value={SYSTEM_METRICS.disk.percentage} unit="%" icon={HardDrive} trend={+1} history={SYSTEM_METRICS.disk.history} color="bg-amber-100" />
          <MetricCard title="Network" value={SYSTEM_METRICS.network.in} unit="Mbps" icon={Wifi} trend={+3} history={SYSTEM_METRICS.network.history} color="bg-emerald-100" />
        </div>

        {/* Services Grid */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Server size={18} /> Service Status
            </h2>
            <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
              View all <ChevronRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {services.map((service, idx) => (
              <ServiceCard key={idx} service={service} />
            ))}
          </div>
        </div>

        {/* Two column layout for Incidents and Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Recent Incidents */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                <AlertCircle size={16} /> Recent Incidents
              </h2>
              <button className="text-xs text-blue-600">View history</button>
            </div>
            <div className="divide-y divide-slate-100">
              {incidents.map(incident => (
                <IncidentItem key={incident.id} incident={incident} />
              ))}
            </div>
          </div>

          {/* System Logs */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                <Activity size={16} /> System Logs
              </h2>
              <button className="text-xs text-blue-600">Export logs</button>
            </div>
            <div className="p-2 max-h-80 overflow-y-auto">
              {logs.map((log, idx) => (
                <LogEntry key={idx} entry={log} />
              ))}
            </div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Gauge size={16} className="text-slate-500" />
              <span className="text-sm font-medium text-slate-600">API Response Time</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">124<span className="text-sm font-normal text-slate-400">ms</span></p>
            <p className="text-xs text-emerald-600 mt-1">↓ 12% from yesterday</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Database size={16} className="text-slate-500" />
              <span className="text-sm font-medium text-slate-600">Query Performance</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">45<span className="text-sm font-normal text-slate-400">ms avg</span></p>
            <p className="text-xs text-emerald-600 mt-1">95th percentile: 120ms</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Users size={16} className="text-slate-500" />
              <span className="text-sm font-medium text-slate-600">Active Sessions</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">2,847</p>
            <p className="text-xs text-slate-500 mt-1">Peak: 3,421 (2h ago)</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={16} className="text-slate-500" />
              <span className="text-sm font-medium text-slate-600">Cache Hit Rate</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">92<span className="text-sm font-normal text-slate-400">%</span></p>
            <p className="text-xs text-emerald-600 mt-1">↑ 3% from last week</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <Shield size={12} /> Real‑time monitoring · Data refreshed every 30 seconds
        </div>
      </div>
    </div>
  );
}