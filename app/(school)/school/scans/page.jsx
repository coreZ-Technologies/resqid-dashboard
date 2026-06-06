'use client';

/**
 * SCHOOL ADMIN — SCAN LOGS
 * Full-featured: Export, Refresh, Advanced Filters (date range, purpose)
 * Uses only Tailwind CSS – no shadcn/ui dependencies
 */

import { useState, useCallback, useMemo } from 'react';
import {
  Search,
  ScanLine,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Monitor,
  RefreshCw,
  Download,
  Filter,
  CalendarDays,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Helper Functions ──────────────────────────────────────────────────────
const formatRelativeTime = (iso) => {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const humanizeEnum = (str) =>
  str?.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) || '';

const maskTokenHash = (hash) => (hash ? `${hash.slice(0, 4)}••••${hash.slice(-4)}` : '');

const randomToken = () => `B${Math.random().toString(36).slice(2, 16).toUpperCase()}`;

const getRandomStudent = (index) => {
  const names = [
    'Aarav Sharma', 'Priya Patel', 'Rohit Singh', 'Sneha Gupta', 'Karan Kumar',
    'Divya Joshi', 'Arjun Verma', 'Meera Shah', 'Vikram Mehta', 'Ananya Reddy',
  ];
  return index % 8 !== 0 ? names[index % names.length] : null;
};

const generateMockScans = (count = 40) => {
  const results = ['SUCCESS', 'INVALID', 'REVOKED', 'EXPIRED', 'RATE_LIMITED', 'ERROR'];
  const devices = ['Chrome/Android', 'Safari/iOS', 'Chrome/Windows', 'Firefox/Linux'];
  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Chennai', 'Hyderabad'];
  const purposes = ['EMERGENCY', 'REGISTRATION', 'UNKNOWN'];

  return Array.from({ length: count }, (_, i) => ({
    id: `scan-${Date.now()}-${i}`,
    token_hash: randomToken(),
    result: results[i % results.length],
    student_name: getRandomStudent(i),
    ip_address: `103.${21 + (i % 5)}.${58 + (i % 3)}.${i + 1}`,
    ip_city: cities[i % cities.length],
    device: devices[i % devices.length],
    scan_purpose: purposes[i % purposes.length],
    response_time_ms: 80 + (i * 13) % 400,
    created_at: new Date(Date.now() - (i % 30) * 3600000 - (i % 60) * 60000).toISOString(),
  }));
};

const calculateTodayStats = (scans) => {
  const today = new Date().toDateString();
  const todayScans = scans.filter((s) => new Date(s.created_at).toDateString() === today);
  const total = todayScans.length;
  const success = todayScans.filter((s) => s.result === 'SUCCESS').length;
  const failed = total - success;
  const avgResponse = total > 0 ? `${Math.round(todayScans.reduce((sum, s) => sum + s.response_time_ms, 0) / total)}ms` : '0ms';
  return { total, success, failed, avgResponse };
};

const exportToCSV = (data, filename = 'scan-logs.csv') => {
  if (!data.length) return;
  const headers = ['Date & Time', 'Result', 'Student Name', 'Token', 'Location (City)', 'IP Address', 'Device', 'Scan Purpose', 'Response Time (ms)'];
  const rows = data.map((scan) => [
    new Date(scan.created_at).toLocaleString(),
    scan.result,
    scan.student_name || 'Unknown',
    maskTokenHash(scan.token_hash),
    scan.ip_city,
    scan.ip_address,
    scan.device,
    scan.scan_purpose,
    scan.response_time_ms,
  ]);
  const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// ─── Constants ──────────────────────────────────────────────────────────────
const RESULTS = ['ALL', 'SUCCESS', 'INVALID', 'REVOKED', 'EXPIRED', 'RATE_LIMITED', 'ERROR'];
const PURPOSES = ['ALL', 'EMERGENCY', 'REGISTRATION', 'UNKNOWN'];

const RESULT_STYLE = {
  SUCCESS: { bg: 'bg-emerald-50', color: 'text-emerald-700', Icon: CheckCircle },
  INVALID: { bg: 'bg-rose-50', color: 'text-rose-700', Icon: XCircle },
  REVOKED: { bg: 'bg-rose-50', color: 'text-rose-700', Icon: XCircle },
  EXPIRED: { bg: 'bg-amber-50', color: 'text-amber-700', Icon: Clock },
  RATE_LIMITED: { bg: 'bg-amber-50', color: 'text-amber-700', Icon: Clock },
  ERROR: { bg: 'bg-rose-50', color: 'text-rose-700', Icon: XCircle },
};

const PAGE_SIZE = 15;

// ─── Main Component ────────────────────────────────────────────────────────
export default function ScanLogsPage() {
  const [scans, setScans] = useState(() => generateMockScans(40));
  const [stats, setStats] = useState(() => calculateTodayStats(scans));
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters
  const [resultFilter, setResultFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [purposeFilter, setPurposeFilter] = useState('ALL');

  // UI
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Apply filters
  const filteredScans = useMemo(() => {
    let filtered = [...scans];
    if (resultFilter !== 'ALL') filtered = filtered.filter((s) => s.result === resultFilter);
    if (search) {
      const lower = search.toLowerCase();
      filtered = filtered.filter((s) =>
        (s.student_name || '').toLowerCase().includes(lower) ||
        s.ip_city.toLowerCase().includes(lower) ||
        s.token_hash.toLowerCase().includes(lower)
      );
    }
    if (dateFrom) {
      const from = new Date(dateFrom);
      from.setHours(0, 0, 0, 0);
      filtered = filtered.filter((s) => new Date(s.created_at) >= from);
    }
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      filtered = filtered.filter((s) => new Date(s.created_at) <= to);
    }
    if (purposeFilter !== 'ALL') filtered = filtered.filter((s) => s.scan_purpose === purposeFilter);
    return filtered;
  }, [scans, resultFilter, search, dateFrom, dateTo, purposeFilter]);

  const totalPages = Math.ceil(filteredScans.length / PAGE_SIZE);
  const paginatedScans = filteredScans.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (resultFilter !== 'ALL') count++;
    if (search) count++;
    if (dateFrom || dateTo) count++;
    if (purposeFilter !== 'ALL') count++;
    return count;
  }, [resultFilter, search, dateFrom, dateTo, purposeFilter]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    const newScans = generateMockScans(40);
    setScans(newScans);
    setStats(calculateTodayStats(newScans));
    setPage(1);
    setIsRefreshing(false);
  };

  const handleExport = () => {
    if (filteredScans.length === 0) {
      alert('No data to export');
      return;
    }
    exportToCSV(filteredScans, `scan-logs-${new Date().toISOString().slice(0, 19)}.csv`);
  };

  const clearFilters = () => {
    setResultFilter('ALL');
    setSearch('');
    setDateFrom('');
    setDateTo('');
    setPurposeFilter('ALL');
    setPage(1);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-800 mb-1">Scan Logs</h1>
        <p className="text-xs text-gray-500">Real-time log of all QR code scan events</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          ["Today's Scans", stats.total, 'text-violet-600'],
          ['Successful', stats.success, 'text-emerald-600'],
          ['Failed', stats.failed, 'text-rose-500'],
          ['Avg Response', stats.avgResponse, 'text-amber-600'],
        ].map(([label, val, colorClass]) => (
          <div key={label} className="bg-white rounded-md border border-violet-100 p-4 shadow-sm">
            <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{label}</div>
            <div className={`text-2xl font-semibold ${colorClass}`}>
              {typeof val === 'number' ? val.toLocaleString('en-IN') : val}
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 h-8 px-3 rounded-xl text-xs font-medium text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 h-8 px-3 rounded-xl text-xs font-medium text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
          >
            <Download size={13} />
            Export CSV
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 h-8 px-3 rounded-xl text-xs font-medium transition-colors ${
              activeFiltersCount > 0
                ? 'bg-violet-600 text-white border-transparent hover:bg-violet-700'
                : 'text-slate-600 border border-slate-200 bg-white hover:bg-slate-50'
            }`}
          >
            <Filter size={13} />
            Filters
            {activeFiltersCount > 0 && (
              <span className="ml-1 bg-white/20 rounded-full px-1.5 py-0.5 text-[10px]">{activeFiltersCount}</span>
            )}
          </button>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search student, city, token..."
            className="py-1.5 pl-8 pr-3 border border-gray-200 rounded-md text-sm outline-none focus:border-violet-300 focus:ring-1 focus:ring-violet-100 w-[220px]"
          />
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-700">Advanced Filters</h3>
            <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-gray-600 block mb-1">Date From</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">Date To</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">Scan Purpose</label>
              <select
                value={purposeFilter}
                onChange={(e) => setPurposeFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-white"
              >
                {PURPOSES.map((p) => (
                  <option key={p} value={p}>{p === 'ALL' ? 'All Purposes' : humanizeEnum(p)}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <button onClick={clearFilters} className="text-xs text-violet-600 hover:underline flex items-center gap-1">
              <X size={12} /> Clear all filters
            </button>
          </div>
        </div>
      )}

      {/* Result Filter Chips */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {RESULTS.map((r) => (
          <button
            key={r}
            onClick={() => { setResultFilter(r); setPage(1); }}
            className={cn(
              'px-3 py-1.5 rounded-md border text-xs font-medium transition-all',
              resultFilter === r
                ? 'bg-gradient-to-r from-violet-500 to-violet-700 text-white border-transparent'
                : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
            )}
          >
            {r === 'ALL' ? 'All Results' : humanizeEnum(r)}
          </button>
        ))}
      </div>

      {/* Active filters badges */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-[10px] text-gray-500">Active filters:</span>
          {resultFilter !== 'ALL' && (
            <span className="inline-flex items-center gap-1 bg-gray-100 rounded-full px-2 py-0.5 text-[10px]">
              Result: {humanizeEnum(resultFilter)}
              <button onClick={() => setResultFilter('ALL')} className="hover:text-gray-700"><X size={10} /></button>
            </span>
          )}
          {purposeFilter !== 'ALL' && (
            <span className="inline-flex items-center gap-1 bg-gray-100 rounded-full px-2 py-0.5 text-[10px]">
              Purpose: {humanizeEnum(purposeFilter)}
              <button onClick={() => setPurposeFilter('ALL')} className="hover:text-gray-700"><X size={10} /></button>
            </span>
          )}
          {(dateFrom || dateTo) && (
            <span className="inline-flex items-center gap-1 bg-gray-100 rounded-full px-2 py-0.5 text-[10px]">
              Date: {dateFrom && new Date(dateFrom).toLocaleDateString()}{dateFrom && dateTo && ' - '}{dateTo && new Date(dateTo).toLocaleDateString()}
              <button onClick={() => { setDateFrom(''); setDateTo(''); }} className="hover:text-gray-700"><X size={10} /></button>
            </span>
          )}
          {search && (
            <span className="inline-flex items-center gap-1 bg-gray-100 rounded-full px-2 py-0.5 text-[10px]">
              Search: {search}
              <button onClick={() => setSearch('')} className="hover:text-gray-700"><X size={10} /></button>
            </span>
          )}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-md border border-violet-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                {['Time', 'Result', 'Student', 'Token', 'Location', 'Device', 'Response'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedScans.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-gray-400">
                    <ScanLine size={32} className="mx-auto mb-3 text-gray-300" />
                    <div className="text-sm font-medium">No scan logs found</div>
                    {activeFiltersCount > 0 && (
                      <button onClick={clearFilters} className="mt-2 text-xs text-violet-600 hover:underline">
                        Clear all filters
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                paginatedScans.map((scan, idx) => {
                  const s = RESULT_STYLE[scan.result] || RESULT_STYLE.ERROR;
                  const isLast = idx === paginatedScans.length - 1;
                  return (
                    <tr key={scan.id} className={cn('hover:bg-gray-50 transition-colors', !isLast && 'border-b border-gray-100')}>
                      <td className="px-4 py-3">
                        <div className="text-xs font-medium text-gray-800 whitespace-nowrap">{formatRelativeTime(scan.created_at)}</div>
                        <div className="text-[10px] text-gray-500">
                          {new Date(scan.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium border', s.bg, s.color,
                          scan.result === 'SUCCESS' ? 'border-emerald-200' : (scan.result === 'EXPIRED' || scan.result === 'RATE_LIMITED') ? 'border-amber-200' : 'border-rose-200'
                        )}>
                          <s.Icon size={11} />
                          {humanizeEnum(scan.result)}
                        </span>
                      </td>
                      <td className={cn('px-4 py-3 text-xs', scan.student_name ? 'font-medium text-gray-800' : 'text-gray-400')}>
                        {scan.student_name || 'Unknown'}
                      </td>
                      <td className="px-4 py-3">
                        <code className="font-mono text-[10px] bg-gray-100 px-1.5 py-0.5 rounded">{maskTokenHash(scan.token_hash)}</code>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-xs text-gray-600"><MapPin size={11} className="text-gray-400" />{scan.ip_city}</div>
                        <div className="text-[10px] text-gray-500 font-mono">{scan.ip_address}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-[10px] text-gray-500"><Monitor size={11} />{scan.device.split('/')[0]}</div>
                        <div className="text-[10px] text-gray-400">{scan.device.split('/')[1]}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn('font-mono text-xs font-semibold', scan.response_time_ms > 300 ? 'text-amber-600' : 'text-emerald-600')}>
                          {scan.response_time_ms}ms
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
            <span className="text-[10px] text-gray-500">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filteredScans.length)} of {filteredScans.length}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronLeft size={14} className="mx-auto" />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={cn(
                    'w-8 h-8 rounded-md border text-xs transition-all',
                    p === page
                      ? 'bg-gradient-to-r from-violet-500 to-violet-700 text-white border-transparent'
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  )}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-8 h-8 rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronRight size={14} className="mx-auto" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}