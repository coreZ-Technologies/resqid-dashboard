'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Activity, Search, Filter, ChevronLeft, ChevronRight,
  Download, RefreshCw, Eye, User, Calendar, Clock,
  Shield, BookOpen, Users, Settings, AlertTriangle,
  CheckCircle, XCircle, Info, Loader2, FileJson,
  FileSpreadsheet, RotateCcw, LayoutGrid, List,
  Zap, Target, Globe, Server, Smartphone, Monitor,
  // ↓ were declared at the bottom — moved here so all components can reference them
  X, Upload, CreditCard,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS & MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────

const ACTION_TYPES = [
  { value: 'all',      label: 'All Actions' },
  { value: 'create',   label: 'Create',          icon: CheckCircle,  color: 'text-emerald-600' },
  { value: 'update',   label: 'Update',           icon: RefreshCw,    color: 'text-blue-600'    },
  { value: 'delete',   label: 'Delete',           icon: XCircle,      color: 'text-rose-600'    },
  { value: 'login',    label: 'Login',            icon: User,         color: 'text-slate-600'   },
  { value: 'logout',   label: 'Logout',           icon: User,         color: 'text-slate-600'   },
  { value: 'export',   label: 'Export',           icon: Download,     color: 'text-amber-600'   },
  { value: 'import',   label: 'Import',           icon: Upload,       color: 'text-teal-600'    }, // ← Upload now available
  { value: 'settings', label: 'Settings Change',  icon: Settings,     color: 'text-purple-600'  },
  { value: 'approve',  label: 'Approve',          icon: CheckCircle,  color: 'text-emerald-600' },
  { value: 'block',    label: 'Block',            icon: AlertTriangle,color: 'text-red-600'     },
];

const USER_ROLES = [
  { value: 'all',          label: 'All Roles'    },
  { value: 'superadmin',   label: 'Super Admin'  },
  { value: 'school_admin', label: 'School Admin' },
  { value: 'teacher',      label: 'Teacher'      },
  { value: 'parent',       label: 'Parent'       },
];

const MODULES = [
  { value: 'all',           label: 'All Modules'    },
  { value: 'schools',       label: 'Schools'        },
  { value: 'students',      label: 'Students'       },
  { value: 'teachers',      label: 'Teachers'       },
  { value: 'attendance',    label: 'Attendance'     },
  { value: 'timetable',     label: 'Timetable'      },
  { value: 'emergency',     label: 'Emergency'      },
  { value: 'communication', label: 'Communication'  },
  { value: 'billing',       label: 'Billing'        },
  { value: 'settings',      label: 'Settings'       },
  { value: 'auth',          label: 'Authentication' },
];

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA GENERATION
// ─────────────────────────────────────────────────────────────────────────────

const generateMockLogs = (count = 150) => {
  const users = [
    { name: 'Alex Johnson',   role: 'superadmin',   email: 'alex@resqid.com',             avatar: 'AJ' },
    { name: 'Maria Garcia',   role: 'school_admin', email: 'maria@springfield.edu',        avatar: 'MG' },
    { name: 'David Kim',      role: 'teacher',      email: 'david.kim@riverview.edu',      avatar: 'DK' },
    { name: 'Sarah Chen',     role: 'parent',       email: 'sarah.chen@gmail.com',         avatar: 'SC' },
    { name: 'Raj Patel',      role: 'superadmin',   email: 'raj@resqid.com',               avatar: 'RP' },
    { name: 'Lisa Wong',      role: 'school_admin', email: 'lisa@northside.edu',            avatar: 'LW' },
    { name: 'James Smith',    role: 'teacher',      email: 'james.smith@westlake.edu',     avatar: 'JS' },
    { name: 'Emily Davis',    role: 'parent',       email: 'emily.davis@outlook.com',      avatar: 'ED' },
    { name: 'Carlos Mendez',  role: 'school_admin', email: 'carlos@sunnydale.edu',         avatar: 'CM' },
    { name: 'Priya Sharma',   role: 'superadmin',   email: 'priya@resqid.com',             avatar: 'PS' },
  ];

  const actions  = ACTION_TYPES.filter(a => a.value !== 'all');
  const modules  = MODULES.filter(m => m.value !== 'all');
  const statuses = ['success', 'failure', 'pending'];

  const logs = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  for (let i = 0; i < count; i++) {
    const user      = users[Math.floor(Math.random() * users.length)];
    const action    = actions[Math.floor(Math.random() * actions.length)];
    const module    = modules[Math.floor(Math.random() * modules.length)];
    const status    = statuses[Math.floor(Math.random() * statuses.length)];
    const timestamp = new Date(startDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000);

    logs.push({
      id:          `log_${i + 1}`,
      timestamp:   timestamp.toISOString(),
      user:        user.name,
      userEmail:   user.email,
      userRole:    user.role,
      userAvatar:  user.avatar,
      action:      action.value,
      actionLabel: action.label,
      module:      module.value,
      moduleLabel: module.label,
      status,
      details:     generateDetails(action.value, module.value),
      ipAddress:   `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      userAgent:   Math.random() > 0.7 ? 'Chrome/120.0.0.0' : 'Firefox/121.0',
    });
  }

  return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

// Fixed: action and module are strings — removed broken `action.label` reference in fallback
function generateDetails(action, module) {
  const templates = {
    create: {
      schools:       'Created new school "Riverside Academy" with ID SCH-1024',
      students:      'Added 25 students via CSV import',
      teachers:      'Registered teacher "Dr. Emily Watson"',
      timetable:     'Generated weekly timetable for Grade 10',
      attendance:    'Bulk attendance marked for 120 students',
    },
    update: {
      schools:       'Updated school profile (address, contact number)',
      students:      'Modified student record #STU-4582',
      teachers:      'Changed teacher department from Science to Mathematics',
      settings:      'Updated system-wide notification preferences',
      billing:       'Adjusted subscription plan from Basic to Pro',
    },
    delete: {
      schools:       'Archived school "Old Town Academy" (inactive)',
      students:      'Removed student #STU-1234 (graduated)',
      teachers:      'Deleted teacher account "Mr. Robert Brown"',
      communication: 'Deleted announcement #ANN-987',
    },
    login:    { auth: 'Successful login from new device' },
    logout:   { auth: 'User initiated logout' },
    export: {
      schools:   'Exported school list (CSV)',
      students:  'Exported attendance report for March',
      billing:   'Exported invoice summary',
    },
    settings: {
      settings: 'Changed global security policy (MFA enforced)',
      schools:  'Updated school theme and branding',
    },
    approve: {
      schools:  'Approved school registration "Green Valley School"',
      teachers: 'Verified teacher credentials for "John Doe"',
    },
  };

  // Fallback now uses the string values directly — no undefined .label
  return templates[action]?.[module] ?? `${action} operation on ${module} module`;
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const config = {
    success: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: CheckCircle,   label: 'Success' },
    failure: { bg: 'bg-red-50',     text: 'text-red-700',     icon: XCircle,       label: 'Failed'  },
    pending: { bg: 'bg-amber-50',   text: 'text-amber-700',   icon: AlertTriangle, label: 'Pending' },
  };
  const { bg, text, icon: Icon, label } = config[status] ?? config.success;

  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium', bg, text)}>
      <Icon size={12} />
      {label}
    </span>
  );
}

function ActionBadge({ action }) {
  const found  = ACTION_TYPES.find(a => a.value === action);
  const Icon   = found?.icon  ?? Info;
  const color  = found?.color ?? 'text-slate-600';
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
      <Icon size={12} className={color} />
      {found?.label ?? action}
    </span>
  );
}

function ModuleBadge({ module }) {
  const icons = {
    schools:       Globe,
    students:      Users,
    teachers:      Users,
    attendance:    Calendar,
    timetable:     Clock,
    emergency:     AlertTriangle,
    communication: Activity,
    billing:       CreditCard,   // ← CreditCard now imported at top
    settings:      Settings,
    auth:          Shield,
  };
  const Icon = icons[module] ?? Activity;
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
      <Icon size={12} />
      {MODULES.find(m => m.value === module)?.label ?? module}
    </span>
  );
}

function DetailModal({ log, isOpen, onClose }) {
  if (!log) return null;

  const formatDate = (iso) => new Date(iso).toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  return (
    <div className={cn('fixed inset-0 z-50 flex items-center justify-center p-4 transition-all', isOpen ? 'visible' : 'invisible')}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Eye size={20} className="text-blue-600" />
            <h2 className="text-lg font-semibold text-slate-800">Activity Details</h2>
          </div>
          {/* X now available from top-level import */}
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="p-6 space-y-5">
          <div className="flex flex-wrap gap-4 pb-4 border-b border-slate-100">
            <div className="flex-1 min-w-[180px]">
              <p className="text-xs text-slate-400 uppercase tracking-wide">Event ID</p>
              <p className="text-sm font-mono text-slate-700 mt-1">{log.id}</p>
            </div>
            <div className="flex-1 min-w-[180px]">
              <p className="text-xs text-slate-400 uppercase tracking-wide">Timestamp</p>
              <p className="text-sm text-slate-700 mt-1 flex items-center gap-1.5">
                <Calendar size={14} /> {formatDate(log.timestamp)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide">User</p>
              <div className="flex items-center gap-2.5 mt-1">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold text-blue-700">
                  {log.userAvatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{log.user}</p>
                  <p className="text-xs text-slate-500">{log.userEmail}</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide">Role</p>
              <p className="text-sm font-semibold text-slate-700 mt-1 capitalize">{log.userRole.replace('_', ' ')}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide">Action</p>
              <div className="mt-1"><ActionBadge action={log.action} /></div>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide">Module</p>
              <div className="mt-1"><ModuleBadge module={log.module} /></div>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide">Status</p>
              <div className="mt-1"><StatusBadge status={log.status} /></div>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide">IP Address</p>
              <p className="text-sm font-mono text-slate-700 mt-1">{log.ipAddress}</p>
            </div>
          </div>

          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide">Details</p>
            <div className="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-700">
              {log.details}
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-sm font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Fixed: builds a flat page-number array directly — no more Array.from × 5 duplication
function getPageNumbers(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, '...', totalPages];
  }
  if (currentPage >= totalPages - 3) {
    return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }
  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200">
      <p className="text-sm text-slate-500">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        {pages.map((page, idx) => (
          <button
            key={idx}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...'}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
              page === currentPage
                ? 'bg-blue-600 text-white'
                : page === '...'
                  ? 'cursor-default text-slate-400'
                  : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
            )}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
        <button onClick={onReset} className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors">
          <RotateCcw size={12} /> Reset all
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Search</label>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="User, email, action..."
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Action</label>
          <select
            value={filters.action}
            onChange={(e) => onFilterChange('action', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 bg-white"
          >
            {ACTION_TYPES.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Role</label>
          <select
            value={filters.role}
            onChange={(e) => onFilterChange('role', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 bg-white"
          >
            {USER_ROLES.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Module</label>
          <select
            value={filters.module}
            onChange={(e) => onFilterChange('module', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 bg-white"
          >
            {MODULES.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2 lg:col-span-4">
          <label className="block text-xs font-medium text-slate-500 mb-1">Date Range</label>
          <div className="flex gap-2 items-center">
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => onFilterChange('dateFrom', e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
            <span className="text-slate-400 text-sm">→</span>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => onFilterChange('dateTo', e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function ActivityLogsPage() {
  const [allLogs,         setAllLogs]         = useState([]);
  const [filteredLogs,    setFilteredLogs]    = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [refreshing,      setRefreshing]      = useState(false);
  const [currentPage,     setCurrentPage]     = useState(1);
  const [selectedLog,     setSelectedLog]     = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '', action: 'all', role: 'all', module: 'all', dateFrom: '', dateTo: '',
  });

  const logsPerPage = 15;

  const loadLogs = useCallback(async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setAllLogs(generateMockLogs(248));
    setLoading(false);
  }, []);

  useEffect(() => { loadLogs(); }, [loadLogs]);

  // Apply filters
  useEffect(() => {
    let result = [...allLogs];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(log =>
        log.user.toLowerCase().includes(q)        ||
        log.userEmail.toLowerCase().includes(q)   ||
        log.details.toLowerCase().includes(q)     ||
        log.actionLabel.toLowerCase().includes(q)
      );
    }
    if (filters.action !== 'all')  result = result.filter(log => log.action   === filters.action);
    if (filters.role   !== 'all')  result = result.filter(log => log.userRole === filters.role);
    if (filters.module !== 'all')  result = result.filter(log => log.module   === filters.module);
    if (filters.dateFrom) {
      const from = new Date(filters.dateFrom);
      result = result.filter(log => new Date(log.timestamp) >= from);
    }
    if (filters.dateTo) {
      const to = new Date(filters.dateTo);
      to.setHours(23, 59, 59);
      result = result.filter(log => new Date(log.timestamp) <= to);
    }

    setFilteredLogs(result);
    setCurrentPage(1);
  }, [allLogs, filters]);

  const handleFilterChange = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));

  const resetFilters = () => setFilters({
    search: '', action: 'all', role: 'all', module: 'all', dateFrom: '', dateTo: '',
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadLogs();
    setRefreshing(false);
  };

  const exportData = (format) => {
    const rows = filteredLogs.map(log => ({
      ID:        log.id,
      Timestamp: log.timestamp,
      User:      log.user,
      Email:     log.userEmail,
      Role:      log.userRole,
      Action:    log.actionLabel,
      Module:    log.moduleLabel,
      Status:    log.status,
      Details:   log.details,
      IP:        log.ipAddress,
    }));

    let blob, filename;
    if (format === 'csv') {
      const headers = Object.keys(rows[0]);
      const csv = [headers.join(','), ...rows.map(r => headers.map(h => `"${r[h]}"`).join(','))].join('\n');
      blob     = new Blob([csv], { type: 'text/csv' });
      filename = `activity_logs_${new Date().toISOString().slice(0, 19)}.csv`;
    } else {
      blob     = new Blob([JSON.stringify(rows, null, 2)], { type: 'application/json' });
      filename = `activity_logs_${new Date().toISOString().slice(0, 19)}.json`;
    }
    const url = URL.createObjectURL(blob);
    const a   = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  const stats = useMemo(() => ({
    total:       allLogs.length,
    uniqueUsers: new Set(allLogs.map(l => l.userEmail)).size,
    modules:     new Set(allLogs.map(l => l.module)).size,
    exports:     allLogs.filter(l => l.action === 'export').length,
  }), [allLogs]);

  const totalPages    = Math.ceil(filteredLogs.length / logsPerPage);
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * logsPerPage, currentPage * logsPerPage);

  const viewDetails = (log) => { setSelectedLog(log); setDetailModalOpen(true); };

  if (loading && allLogs.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Loading activity logs…</p>
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
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Activity Logs</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Complete audit trail of all system actions and user activities
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => exportData('csv')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-sm font-medium shadow-sm transition-colors"
            >
              <FileSpreadsheet size={15} /> Export CSV
            </button>
            <button
              onClick={() => exportData('json')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-sm font-medium shadow-sm transition-colors"
            >
              <FileJson size={15} /> Export JSON
            </button>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-sm font-medium shadow-sm disabled:opacity-50 transition-colors"
            >
              <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Events',   value: stats.total,       bg: 'bg-blue-100',   icon: Activity,  iconColor: 'text-blue-600'   },
            { label: 'Unique Users',   value: stats.uniqueUsers, bg: 'bg-emerald-100', icon: Users,     iconColor: 'text-emerald-600' },
            { label: 'Active Modules', value: stats.modules,     bg: 'bg-purple-100',  icon: Target,    iconColor: 'text-purple-600'  },
            { label: 'Exports',        value: stats.exports,     bg: 'bg-amber-100',   icon: Download,  iconColor: 'text-amber-600'   },
          ].map(({ label, value, bg, icon: Icon, iconColor }) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', bg)}>
                <Icon size={20} className={iconColor} />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">{label}</p>
                <p className="text-2xl font-bold text-slate-800 tabular-nums">{value.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <FilterBar filters={filters} onFilterChange={handleFilterChange} onReset={resetFilters} />

        {/* Logs Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {['Timestamp', 'User', 'Action', 'Module', 'Status', 'Details', 'Actions'].map((h, i) => (
                    <th key={h} className={cn(
                      'py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider',
                      i === 6 ? 'text-center' : 'text-left'
                    )}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 text-sm text-slate-600 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock size={13} className="text-slate-400" />
                        {new Date(log.timestamp).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-700 shrink-0">
                          {log.userAvatar}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">{log.user}</p>
                          <p className="text-xs text-slate-400 capitalize">{log.userRole.replace('_', ' ')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4"><ActionBadge action={log.action} /></td>
                    <td className="py-3 px-4"><ModuleBadge module={log.module} /></td>
                    <td className="py-3 px-4"><StatusBadge status={log.status} /></td>
                    <td className="py-3 px-4 text-sm text-slate-600 max-w-xs truncate">{log.details}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => viewDetails(log)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {paginatedLogs.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-16 text-center">
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <Search size={32} strokeWidth={1.5} />
                        <p className="text-sm">No activity logs match your filters.</p>
                        <button onClick={resetFilters} className="text-blue-600 text-sm hover:underline">Clear filters</button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredLogs.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>

        <div className="text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <Server size={12} /> Logs retained for 90 days · Real‑time updates via SSE
        </div>
      </div>

      <DetailModal
        log={selectedLog}
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
      />
    </div>
  );
}