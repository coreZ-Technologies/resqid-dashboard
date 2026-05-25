'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Bell, Send, CheckCircle, XCircle, Clock, Filter, Search,
  Eye, Download, RefreshCw, Calendar, User, Mail, Phone,
  Globe, Smartphone, AlertCircle, Loader2, RotateCcw,
  ChevronLeft, ChevronRight, FileJson, FileSpreadsheet,
  Megaphone, MessageCircle, Target, TrendingUp, Users,
  X, DollarSign, Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ========== CONSTANTS & MOCK DATA (same as yours) ==========
const NOTIFICATION_TYPES = [
  { value: 'all', label: 'All Types' },
  { value: 'system', label: 'System', icon: Settings, color: 'text-slate-600' },
  { value: 'emergency', label: 'Emergency', icon: AlertCircle, color: 'text-red-600' },
  { value: 'announcement', label: 'Announcement', icon: Megaphone, color: 'text-purple-600' },
  { value: 'attendance', label: 'Attendance', icon: Calendar, color: 'text-blue-600' },
  { value: 'billing', label: 'Billing', icon: DollarSign, color: 'text-emerald-600' },
  { value: 'reminder', label: 'Reminder', icon: Bell, color: 'text-amber-600' },
];

const NOTIFICATION_CHANNELS = [
  { value: 'all', label: 'All Channels' },
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'push', label: 'Push', icon: Smartphone },
  { value: 'sms', label: 'SMS', icon: Phone },
  { value: 'inapp', label: 'In-App', icon: Bell },
];

const NOTIFICATION_STATUS = {
  sent: { label: 'Sent', color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle },
  failed: { label: 'Failed', color: 'bg-red-100 text-red-800', icon: XCircle },
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-800', icon: Clock },
};

const generateMockNotifications = (count = 120) => {
  const recipients = [
    { name: 'Alex Johnson', role: 'superadmin', email: 'alex@resqid.com', phone: '+1 555-0101' },
    { name: 'Maria Garcia', role: 'school_admin', email: 'maria@springfield.edu', phone: '+1 555-0102' },
    { name: 'David Kim', role: 'teacher', email: 'david.kim@riverview.edu', phone: '+1 555-0103' },
    { name: 'Sarah Chen', role: 'parent', email: 'sarah.chen@gmail.com', phone: '+1 555-0104' },
    { name: 'Raj Patel', role: 'superadmin', email: 'raj@resqid.com', phone: '+1 555-0105' },
    { name: 'Lisa Wong', role: 'school_admin', email: 'lisa@northside.edu', phone: '+1 555-0106' },
    { name: 'James Smith', role: 'teacher', email: 'james.smith@westlake.edu', phone: '+1 555-0107' },
    { name: 'Emily Davis', role: 'parent', email: 'emily.davis@outlook.com', phone: '+1 555-0108' },
  ];
  
  const titles = {
    system: ['System Update Completed', 'Backup Successful', 'New Version Deployed', 'API Key Generated'],
    emergency: ['SOS Alert', 'Lockdown Initiated', 'Weather Warning', 'Safety Drill'],
    announcement: ['School Holiday Notice', 'PTM Schedule', 'New Policy Update', 'Event Invitation'],
    attendance: ['Absence Report', 'Low Attendance Alert', 'Bulk Absence Marked', 'Attendance Summary'],
    billing: ['Invoice Ready', 'Payment Received', 'Subscription Renewal', 'Payment Failed'],
    reminder: ['Meeting Reminder', 'Homework Deadline', 'Fee Due Date', 'Parent-Teacher Conference'],
  };
  
  const channels = ['email', 'push', 'sms', 'inapp'];
  const statuses = ['sent', 'failed', 'pending'];
  
  const notifications = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const type = NOTIFICATION_TYPES.filter(t => t.value !== 'all')[Math.floor(Math.random() * (NOTIFICATION_TYPES.length - 1))].value;
    const channel = channels[Math.floor(Math.random() * channels.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const recipient = recipients[Math.floor(Math.random() * recipients.length)];
    const title = titles[type][Math.floor(Math.random() * titles[type].length)];
    const timestamp = new Date(now.getTime() - Math.random() * 14 * 24 * 60 * 60 * 1000);
    
    notifications.push({
      id: `notif_${i + 1}`,
      timestamp: timestamp.toISOString(),
      type,
      title,
      content: `This is the full content of the notification: ${title}. Please take necessary action. ${Math.random() > 0.7 ? 'Additional details: Reference ID #' + Math.floor(Math.random() * 10000) : ''}`,
      channel,
      status,
      recipient: recipient.name,
      recipientEmail: recipient.email,
      recipientPhone: recipient.phone,
      recipientRole: recipient.role,
      metadata: {
        readAt: status === 'sent' && Math.random() > 0.5 ? new Date(timestamp.getTime() + Math.random() * 60 * 60 * 1000).toISOString() : null,
        clickedAt: Math.random() > 0.8 ? new Date(timestamp.getTime() + Math.random() * 2 * 60 * 60 * 1000).toISOString() : null,
        errorMessage: status === 'failed' ? 'SMTP connection timeout' : null,
      },
    });
  }
  return notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

// ========== SUB-COMPONENTS ==========
function TypeBadge({ type }) {
  const found = NOTIFICATION_TYPES.find(t => t.value === type);
  const Icon = found?.icon || Bell;
  const colorMap = {
    system: 'bg-slate-100 text-slate-700',
    emergency: 'bg-red-100 text-red-700',
    announcement: 'bg-purple-100 text-purple-700',
    attendance: 'bg-blue-100 text-blue-700',
    billing: 'bg-emerald-100 text-emerald-700',
    reminder: 'bg-amber-100 text-amber-700',
  };
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium', colorMap[type] || 'bg-slate-100')}>
      <Icon size={12} />
      {found?.label || type}
    </span>
  );
}

function ChannelBadge({ channel }) {
  const found = NOTIFICATION_CHANNELS.find(c => c.value === channel);
  const Icon = found?.icon || Bell;
  const colorMap = {
    email: 'bg-blue-100 text-blue-700',
    push: 'bg-indigo-100 text-indigo-700',
    sms: 'bg-green-100 text-green-700',
    inapp: 'bg-orange-100 text-orange-700',
  };
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium', colorMap[channel] || 'bg-slate-100')}>
      <Icon size={12} />
      {found?.label || channel}
    </span>
  );
}

function StatusBadge({ status }) {
  const config = NOTIFICATION_STATUS[status];
  if (!config) return null;
  const Icon = config.icon;
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium', config.color)}>
      <Icon size={12} />
      {config.label}
    </span>
  );
}

function DetailModal({ notification, isOpen, onClose }) {
  if (!notification) return null;
  
  const formatDate = (iso) => new Date(iso).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  
  return (
    <div className={cn('fixed inset-0 z-50 flex items-center justify-center p-4 transition-all', isOpen ? 'visible' : 'invisible')}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Bell size={20} className="text-blue-600" />
            <h2 className="text-lg font-semibold text-slate-800">Notification Details</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>
        <div className="p-6 space-y-5">
          <div className="flex flex-wrap gap-2 justify-between">
            <h3 className="text-xl font-bold text-slate-800">{notification.title}</h3>
            <StatusBadge status={notification.status} />
          </div>
          
          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl">
            <div>
              <p className="text-xs text-slate-500 uppercase">Type</p>
              <div className="mt-1"><TypeBadge type={notification.type} /></div>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase">Channel</p>
              <div className="mt-1"><ChannelBadge channel={notification.channel} /></div>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase">Timestamp</p>
              <p className="text-sm text-slate-700 mt-1">{formatDate(notification.timestamp)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase">Notification ID</p>
              <p className="text-sm font-mono text-slate-600 mt-1">{notification.id}</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">Recipient</p>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold text-blue-700">
                {notification.recipient.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">{notification.recipient}</p>
                <p className="text-xs text-slate-500">{notification.recipientEmail} • {notification.recipientPhone}</p>
                <p className="text-xs text-slate-400 capitalize">{notification.recipientRole.replace('_', ' ')}</p>
              </div>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">Content</p>
            <div className="p-3 bg-slate-50 rounded-xl text-sm text-slate-700">
              {notification.content}
            </div>
          </div>
          
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">Delivery Status</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Sent at:</span>
                <span className="text-slate-700">{formatDate(notification.timestamp)}</span>
              </div>
              {notification.metadata.readAt && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Read at:</span>
                  <span className="text-slate-700">{formatDate(notification.metadata.readAt)}</span>
                </div>
              )}
              {notification.metadata.clickedAt && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Clicked at:</span>
                  <span className="text-slate-700">{formatDate(notification.metadata.clickedAt)}</span>
                </div>
              )}
              {notification.metadata.errorMessage && (
                <div className="flex justify-between text-red-600">
                  <span>Error:</span>
                  <span>{notification.metadata.errorMessage}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="pt-3 flex justify-end">
            <button onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-sm font-medium">
              Close
            </button>
          </div>
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
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40">
          <ChevronLeft size={16} />
        </button>
        {pages.map((page, idx) => (
          <button key={idx} onClick={() => typeof page === 'number' && onPageChange(page)} className={cn('px-3 py-1.5 rounded-lg text-sm font-medium', page === currentPage ? 'bg-blue-600 text-white' : page === '...' ? 'cursor-default text-slate-400' : 'border border-slate-200 text-slate-600 hover:bg-slate-50')} disabled={page === '...'}>
            {page}
          </button>
        ))}
        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40">
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
            <input type="text" placeholder="Title, recipient..." value={filters.search} onChange={(e) => onFilterChange('search', e.target.value)} className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Type</label>
          <select value={filters.type} onChange={(e) => onFilterChange('type', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm">
            {NOTIFICATION_TYPES.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Channel</label>
          <select value={filters.channel} onChange={(e) => onFilterChange('channel', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm">
            {NOTIFICATION_CHANNELS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
          <select value={filters.status} onChange={(e) => onFilterChange('status', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm">
            <option value="all">All Statuses</option>
            <option value="sent">Sent</option>
            <option value="failed">Failed</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Date</label>
          <input type="date" value={filters.date} onChange={(e) => onFilterChange('date', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
        </div>
      </div>
    </div>
  );
}

// ========== MAIN PAGE ==========
export default function NotificationLogsPage() {
  const [notifications, setNotifications] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    channel: 'all',
    status: 'all',
    date: '',
  });
  
  const notificationsPerPage = 12;
  
  const loadNotifications = useCallback(async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    const mock = generateMockNotifications(156);
    setNotifications(mock);
    setLoading(false);
  }, []);
  
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);
  
  useEffect(() => {
    let result = [...notifications];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(n => n.title.toLowerCase().includes(q) || n.recipient.toLowerCase().includes(q) || n.content.toLowerCase().includes(q));
    }
    if (filters.type !== 'all') result = result.filter(n => n.type === filters.type);
    if (filters.channel !== 'all') result = result.filter(n => n.channel === filters.channel);
    if (filters.status !== 'all') result = result.filter(n => n.status === filters.status);
    if (filters.date) {
      const filterDate = new Date(filters.date).toDateString();
      result = result.filter(n => new Date(n.timestamp).toDateString() === filterDate);
    }
    setFilteredLogs(result);
    setCurrentPage(1);
  }, [notifications, filters]);
  
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const resetFilters = () => {
    setFilters({ search: '', type: 'all', channel: 'all', status: 'all', date: '' });
  };
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };
  
  const exportData = (format) => {
    const dataToExport = filteredLogs.map(n => ({
      ID: n.id, Timestamp: n.timestamp, Type: n.type, Title: n.title,
      Content: n.content, Channel: n.channel, Status: n.status,
      Recipient: n.recipient, Email: n.recipientEmail, Phone: n.recipientPhone, Role: n.recipientRole,
    }));
    if (format === 'csv') {
      const headers = Object.keys(dataToExport[0]);
      const csvRows = [headers.join(','), ...dataToExport.map(row => headers.map(h => `"${row[h]}"`).join(','))];
      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `notification_logs_${new Date().toISOString().slice(0,19)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'json') {
      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `notification_logs_${new Date().toISOString().slice(0,19)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };
  
  const stats = useMemo(() => {
    const total = notifications.length;
    const sent = notifications.filter(n => n.status === 'sent').length;
    const failed = notifications.filter(n => n.status === 'failed').length;
    const uniqueRecipients = new Set(notifications.map(n => n.recipientEmail)).size;
    return { total, sent, failed, uniqueRecipients };
  }, [notifications]);
  
  const totalPages = Math.ceil(filteredLogs.length / notificationsPerPage);
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * notificationsPerPage, currentPage * notificationsPerPage);
  
  const viewDetails = (notification) => {
    setSelectedNotification(notification);
    setDetailModalOpen(true);
  };
  
  if (loading && notifications.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-slate-500">Loading notification logs...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-screen-2xl mx-auto p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Notification Logs</h1>
            <p className="text-slate-500 text-sm mt-0.5">Track all system notifications, delivery status, and user engagement</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => exportData('csv')} className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-sm font-medium shadow-sm"><FileSpreadsheet size={15} /> CSV</button>
            <button onClick={() => exportData('json')} className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-sm font-medium shadow-sm"><FileJson size={15} /> JSON</button>
            <button onClick={handleRefresh} disabled={refreshing} className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-sm font-medium shadow-sm disabled:opacity-50"><RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} /> Refresh</button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center"><Bell size={20} className="text-blue-700" /></div><div><p className="text-xs text-slate-500 uppercase">Total Notifications</p><p className="text-2xl font-bold text-slate-800">{stats.total.toLocaleString()}</p></div></div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center"><CheckCircle size={20} className="text-emerald-700" /></div><div><p className="text-xs text-slate-500 uppercase">Delivered</p><p className="text-2xl font-bold text-slate-800">{stats.sent.toLocaleString()}</p><p className="text-xs text-emerald-600">{((stats.sent / stats.total) * 100).toFixed(0)}% success</p></div></div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center"><XCircle size={20} className="text-red-700" /></div><div><p className="text-xs text-slate-500 uppercase">Failed</p><p className="text-2xl font-bold text-slate-800">{stats.failed.toLocaleString()}</p></div></div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center"><Users size={20} className="text-purple-700" /></div><div><p className="text-xs text-slate-500 uppercase">Unique Recipients</p><p className="text-2xl font-bold text-slate-800">{stats.uniqueRecipients}</p></div></div>
        </div>
        
        <FilterBar filters={filters} onFilterChange={handleFilterChange} onReset={resetFilters} />
        
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr><th className="text-left py-3.5 px-4 text-xs font-semibold text-slate-500">Timestamp</th><th className="text-left py-3.5 px-4 text-xs font-semibold text-slate-500">Title / Type</th><th className="text-left py-3.5 px-4 text-xs font-semibold text-slate-500">Recipient</th><th className="text-left py-3.5 px-4 text-xs font-semibold text-slate-500">Channel</th><th className="text-left py-3.5 px-4 text-xs font-semibold text-slate-500">Status</th><th className="text-center py-3.5 px-4 text-xs font-semibold text-slate-500">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedLogs.map((notif) => (
                  <tr key={notif.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 text-sm text-slate-600">{new Date(notif.timestamp).toLocaleString()}</td>
                    <td className="py-3 px-4"><p className="text-sm font-medium text-slate-800">{notif.title}</p><div className="mt-1"><TypeBadge type={notif.type} /></div></td>
                    <td className="py-3 px-4"><div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-700">{notif.recipient.charAt(0)}</div><div><p className="text-sm font-medium text-slate-800">{notif.recipient}</p><p className="text-xs text-slate-400">{notif.recipientRole.replace('_', ' ')}</p></div></div></td>
                    <td className="py-3 px-4"><ChannelBadge channel={notif.channel} /></td>
                    <td className="py-3 px-4"><StatusBadge status={notif.status} /></td>
                    <td className="py-3 px-4 text-center"><button onClick={() => viewDetails(notif)} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600"><Eye size={16} /></button></td>
                  </tr>
                ))}
                {paginatedLogs.length === 0 && <tr><td colSpan={6} className="py-12 text-center text-slate-400">No notifications match your filters.</td></tr>}
              </tbody>
            </table>
          </div>
          {filteredLogs.length > 0 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
        </div>
        <div className="text-center text-xs text-slate-400"><Send size={12} className="inline mr-1" /> Real‑time delivery tracking · Logs retained for 90 days</div>
      </div>
      <DetailModal notification={selectedNotification} isOpen={detailModalOpen} onClose={() => setDetailModalOpen(false)} />
    </div>
  );
}