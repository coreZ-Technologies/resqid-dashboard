'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  AlertTriangle, Bell, CheckCircle, Clock, Filter, Search,
  Eye, Check, X, Loader2, RefreshCw, AlertOctagon, AlertCircle,
  Info, Zap, Shield, User, Calendar, MessageCircle, Send,
  Flag, MoreVertical, ChevronLeft, ChevronRight, Download,
  RotateCcw, Trash2, ExternalLink, Activity, TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS & MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────

const SEVERITY = {
  critical: { label: 'Critical', color: 'bg-rose-100 text-rose-800 border-rose-200', icon: AlertOctagon },
  high: { label: 'High', color: 'bg-orange-100 text-orange-800 border-orange-200', icon: AlertTriangle },
  medium: { label: 'Medium', color: 'bg-amber-100 text-amber-800 border-amber-200', icon: AlertCircle },
  low: { label: 'Low', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Info },
};

const STATUS = {
  active: { label: 'Active', color: 'bg-red-100 text-red-800', icon: Bell },
  investigating: { label: 'Investigating', color: 'bg-amber-100 text-amber-800', icon: Activity },
  resolved: { label: 'Resolved', color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle },
  dismissed: { label: 'Dismissed', color: 'bg-slate-100 text-slate-600', icon: X },
};

const ALERT_TYPES = [
  { value: 'all', label: 'All Types' },
  { value: 'emergency', label: 'Emergency SOS' },
  { value: 'system', label: 'System Alert' },
  { value: 'security', label: 'Security Incident' },
  { value: 'attendance', label: 'Attendance Issue' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'billing', label: 'Billing Alert' },
];

const SCHOOLS = [
  'All Schools',
  'Springfield High School',
  'Riverside Academy',
  'Northside Elementary',
  'Westlake College',
  'Sunnydale School',
];

// Generate mock alerts
const generateMockAlerts = (count = 45) => {
  const alertTitles = {
    emergency: ['SOS Alert from Student', 'Emergency Lockdown Triggered', 'Medical Emergency Reported'],
    system: ['Database Connection Failure', 'API Rate Limit Exceeded', 'Backup Failed'],
    security: ['Suspicious Login Attempt', 'Unauthorized Access Detected', 'Multiple Failed Logins'],
    attendance: ['Low Attendance Warning', 'Bulk Absence Reported', 'Attendance Sync Error'],
    maintenance: ['Server Update Required', 'SSL Certificate Expiring', 'Storage Almost Full'],
    billing: ['Payment Failed for School', 'Subscription Expiring Soon', 'Invoice Overdue'],
  };
  
  const schools = SCHOOLS.filter(s => s !== 'All Schools');
  const users = ['Admin', 'Supervisor', 'System Bot', 'Security Team', 'Monitoring Service'];
  
  const alerts = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const type = ALERT_TYPES.filter(t => t.value !== 'all')[Math.floor(Math.random() * (ALERT_TYPES.length - 1))].value;
    const title = alertTitles[type][Math.floor(Math.random() * alertTitles[type].length)];
    const severityRand = Math.random();
    const severity = severityRand < 0.1 ? 'critical' : severityRand < 0.3 ? 'high' : severityRand < 0.6 ? 'medium' : 'low';
    const statusRand = Math.random();
    const status = statusRand < 0.4 ? 'active' : statusRand < 0.7 ? 'investigating' : statusRand < 0.85 ? 'resolved' : 'dismissed';
    const timestamp = new Date(now.getTime() - Math.random() * 14 * 24 * 60 * 60 * 1000);
    const school = schools[Math.floor(Math.random() * schools.length)];
    const assignedTo = users[Math.floor(Math.random() * users.length)];
    const resolvedAt = status === 'resolved' ? new Date(timestamp.getTime() + Math.random() * 2 * 60 * 60 * 1000) : null;
    
    alerts.push({
      id: `alt_${i + 1}`,
      title,
      type,
      severity,
      status,
      timestamp: timestamp.toISOString(),
      school,
      assignedTo,
      resolvedAt: resolvedAt?.toISOString(),
      description: `Detailed description for ${title.toLowerCase()}. This alert requires attention from the ${assignedTo} team. Additional context: ${Math.random() > 0.5 ? 'Action required immediately.' : 'Monitor situation.'}`,
      actionTaken: status === 'resolved' ? 'Issue resolved by restarting service.' : null,
      sourceIp: `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      affectedUsers: Math.floor(Math.random() * 500),
    });
  }
  
  return alerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function SeverityBadge({ severity }) {
  const config = SEVERITY[severity];
  if (!config) return null;
  const Icon = config.icon;
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border', config.color)}>
      <Icon size={12} />
      {config.label}
    </span>
  );
}

function StatusBadge({ status }) {
  const config = STATUS[status];
  if (!config) return null;
  const Icon = config.icon;
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium', config.color)}>
      <Icon size={12} />
      {config.label}
    </span>
  );
}

function AlertTypeBadge({ type }) {
  const found = ALERT_TYPES.find(t => t.value === type);
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
      <Bell size={12} />
      {found?.label || type}
    </span>
  );
}

function DetailModal({ alert, isOpen, onClose, onUpdateStatus }) {
  const [note, setNote] = useState('');
  const [updating, setUpdating] = useState(false);
  
  if (!alert) return null;
  
  const formatDate = (iso) => new Date(iso).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  
  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    await new Promise(r => setTimeout(r, 500));
    onUpdateStatus(alert.id, newStatus);
    setUpdating(false);
    if (newStatus === 'resolved' || newStatus === 'dismissed') onClose();
  };
  
  const handleAddNote = () => {
    if (note.trim()) {
      console.log('Note added:', note);
      setNote('');
    }
  };
  
  return (
    <div className={cn('fixed inset-0 z-50 flex items-center justify-center p-4 transition-all', isOpen ? 'visible' : 'invisible')}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertTriangle size={20} className="text-amber-600" />
            <h2 className="text-lg font-semibold text-slate-800">Alert Details</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>
        
        <div className="p-6 space-y-5">
          <div className="flex flex-wrap gap-2 justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-slate-800">{alert.title}</h3>
              <p className="text-sm text-slate-500 mt-1">Alert ID: {alert.id}</p>
            </div>
            <div className="flex gap-2">
              <SeverityBadge severity={alert.severity} />
              <StatusBadge status={alert.status} />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl">
            <div>
              <p className="text-xs text-slate-500 uppercase">School</p>
              <p className="text-sm font-medium text-slate-800 mt-1">{alert.school}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase">Assigned To</p>
              <p className="text-sm font-medium text-slate-800 mt-1">{alert.assignedTo}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase">Reported</p>
              <p className="text-sm text-slate-700 mt-1 flex items-center gap-1">
                <Calendar size={13} /> {formatDate(alert.timestamp)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase">Source IP</p>
              <p className="text-sm font-mono text-slate-700 mt-1">{alert.sourceIp}</p>
            </div>
            {alert.resolvedAt && (
              <div className="col-span-2">
                <p className="text-xs text-slate-500 uppercase">Resolved At</p>
                <p className="text-sm text-emerald-700 mt-1 flex items-center gap-1">
                  <CheckCircle size={13} /> {formatDate(alert.resolvedAt)}
                </p>
              </div>
            )}
          </div>
          
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">Description</p>
            <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-xl">{alert.description}</p>
          </div>
          
          {alert.actionTaken && (
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-2">Action Taken</p>
              <p className="text-sm text-slate-600 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                {alert.actionTaken}
              </p>
            </div>
          )}
          
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">Add Note</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Write a note..."
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAddNote}
                disabled={!note.trim()}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium disabled:opacity-40"
              >
                <Send size={15} />
              </button>
            </div>
          </div>
          
          {alert.status !== 'resolved' && alert.status !== 'dismissed' && (
            <div className="flex gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => handleStatusChange('resolved')}
                disabled={updating}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-medium flex items-center justify-center gap-2"
              >
                {updating ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                Resolve
              </button>
              <button
                onClick={() => handleStatusChange('dismissed')}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium flex items-center justify-center gap-2"
              >
                <X size={16} /> Dismiss
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  const getPages = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, '...', totalPages];
    if (currentPage >= totalPages - 2) return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };
  
  const pages = getPages();
  
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200">
      <p className="text-sm text-slate-500">Page {currentPage} of {totalPages}</p>
      <div className="flex gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
        >
          <ChevronLeft size={16} />
        </button>
        {pages.map((page, idx) => (
          <button
            key={idx}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium',
              page === currentPage
                ? 'bg-blue-600 text-white'
                : page === '...'
                  ? 'cursor-default text-slate-400'
                  : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
            )}
            disabled={page === '...'}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

function FilterBar({ filters, onFilterChange, onReset }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <Filter size={15} /> Filters
        </h3>
        <button onClick={onReset} className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1">
          <RotateCcw size={12} /> Reset
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Search</label>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Title, school, ID..."
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Severity</label>
          <select
            value={filters.severity}
            onChange={(e) => onFilterChange('severity', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="investigating">Investigating</option>
            <option value="resolved">Resolved</option>
            <option value="dismissed">Dismissed</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Type</label>
          <select
            value={filters.type}
            onChange={(e) => onFilterChange('type', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {ALERT_TYPES.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">School</label>
          <select
            value={filters.school}
            onChange={(e) => onFilterChange('school', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {SCHOOLS.map(school => (
              <option key={school} value={school === 'All Schools' ? 'all' : school}>{school}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    severity: 'all',
    status: 'all',
    type: 'all',
    school: 'all',
  });
  
  const alertsPerPage = 12;
  
  const loadAlerts = useCallback(async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    const mock = generateMockAlerts(52);
    setAlerts(mock);
    setLoading(false);
  }, []);
  
  useEffect(() => {
    loadAlerts();
  }, [loadAlerts]);
  
  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      setRefreshing(true);
      loadAlerts().finally(() => setRefreshing(false));
    }, 30000);
    return () => clearInterval(interval);
  }, [autoRefresh, loadAlerts]);
  
  // Apply filters
  useEffect(() => {
    let result = [...alerts];
    
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.school.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q)
      );
    }
    if (filters.severity !== 'all') {
      result = result.filter(a => a.severity === filters.severity);
    }
    if (filters.status !== 'all') {
      result = result.filter(a => a.status === filters.status);
    }
    if (filters.type !== 'all') {
      result = result.filter(a => a.type === filters.type);
    }
    if (filters.school !== 'all') {
      result = result.filter(a => a.school === filters.school);
    }
    
    setFilteredAlerts(result);
    setCurrentPage(1);
  }, [alerts, filters]);
  
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const resetFilters = () => {
    setFilters({
      search: '',
      severity: 'all',
      status: 'all',
      type: 'all',
      school: 'all',
    });
  };
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAlerts();
    setRefreshing(false);
  };
  
  const updateAlertStatus = (alertId, newStatus) => {
    setAlerts(prev =>
      prev.map(a => a.id === alertId ? { ...a, status: newStatus, resolvedAt: newStatus === 'resolved' ? new Date().toISOString() : a.resolvedAt } : a)
    );
  };
  
  // Stats
  const stats = useMemo(() => {
    const active = alerts.filter(a => a.status === 'active').length;
    const investigating = alerts.filter(a => a.status === 'investigating').length;
    const critical = alerts.filter(a => a.severity === 'critical' && a.status !== 'resolved' && a.status !== 'dismissed').length;
    const resolvedToday = alerts.filter(a => {
      if (a.status !== 'resolved' || !a.resolvedAt) return false;
      const resolvedDate = new Date(a.resolvedAt).toDateString();
      const today = new Date().toDateString();
      return resolvedDate === today;
    }).length;
    // Avg response time for resolved (mock)
    const avgResponse = '2.4m';
    return { active, investigating, critical, resolvedToday, avgResponse };
  }, [alerts]);
  
  // Pagination
  const totalPages = Math.ceil(filteredAlerts.length / alertsPerPage);
  const paginatedAlerts = filteredAlerts.slice((currentPage - 1) * alertsPerPage, currentPage * alertsPerPage);
  
  const viewDetails = (alert) => {
    setSelectedAlert(alert);
    setDetailModalOpen(true);
  };
  
  if (loading && alerts.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-slate-500">Loading alerts...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-screen-2xl mx-auto p-6 space-y-5">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Alerts & Incidents</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Monitor and manage system alerts, security incidents, and emergencies
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={cn(
                'flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium shadow-sm',
                autoRefresh ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600'
              )}
            >
              <RefreshCw size={15} className={autoRefresh ? '' : ''} />
              Live {autoRefresh ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-sm font-medium shadow-sm"
            >
              <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-sm font-medium shadow-sm">
              <Download size={15} /> Export
            </button>
          </div>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
              <AlertTriangle size={20} className="text-rose-700" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase">Active Alerts</p>
              <p className="text-2xl font-bold text-slate-800">{stats.active}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Activity size={20} className="text-amber-700" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase">Investigating</p>
              <p className="text-2xl font-bold text-slate-800">{stats.investigating}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <AlertOctagon size={20} className="text-red-700" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase">Critical Unresolved</p>
              <p className="text-2xl font-bold text-slate-800">{stats.critical}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <CheckCircle size={20} className="text-emerald-700" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase">Resolved Today</p>
              <p className="text-2xl font-bold text-slate-800">{stats.resolvedToday}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <TrendingUp size={20} className="text-blue-700" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase">Avg Response</p>
              <p className="text-2xl font-bold text-slate-800">{stats.avgResponse}</p>
            </div>
          </div>
        </div>
        
        {/* Filters */}
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={resetFilters}
        />
        
        {/* Alerts Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Severity</th>
                  <th className="text-left py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Alert</th>
                  <th className="text-left py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                  <th className="text-left py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">School</th>
                  <th className="text-left py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-left py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Time</th>
                  <th className="text-center py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedAlerts.map((alert) => (
                  <tr key={alert.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => viewDetails(alert)}>
                    <td className="py-3 px-4">
                      <SeverityBadge severity={alert.severity} />
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{alert.title}</p>
                        <p className="text-xs text-slate-400 truncate max-w-[250px]">{alert.description.slice(0, 60)}...</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <AlertTypeBadge type={alert.type} />
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">{alert.school}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={alert.status} />
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-500 whitespace-nowrap">
                      {new Date(alert.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={(e) => { e.stopPropagation(); viewDetails(alert); }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {paginatedAlerts.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <Bell size={32} strokeWidth={1.5} />
                        <p className="text-sm">No alerts match your filters.</p>
                        <button onClick={resetFilters} className="text-blue-600 text-sm">Clear filters</button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {filteredAlerts.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
        
        {/* Footer */}
        <div className="text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <Shield size={12} /> Real‑time alerts · Last updated {new Date().toLocaleTimeString()}
        </div>
      </div>
      
      {/* Detail Modal */}
      <DetailModal
        alert={selectedAlert}
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        onUpdateStatus={updateAlertStatus}
      />
    </div>
  );
}