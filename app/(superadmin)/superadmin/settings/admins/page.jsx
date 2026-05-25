'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Users, Shield, Plus, Edit2, Trash2, MoreVertical, Search,
  Filter, Mail, Phone, Calendar, Lock, CheckCircle, XCircle,
  Loader2, RefreshCw, Eye, UserPlus, Key, Send,
  ChevronLeft, ChevronRight, Download, RotateCcw
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────

const MOCK_ADMINS = [
  { id: 'adm_001', name: 'Alex Johnson', email: 'alex@resqid.com', phone: '+1 555-0101', role: 'superadmin', status: 'active', lastLogin: '2025-05-25T10:30:00', createdAt: '2024-01-15', mfaEnabled: true, avatar: 'AJ' },
  { id: 'adm_002', name: 'Raj Patel', email: 'raj@resqid.com', phone: '+1 555-0102', role: 'superadmin', status: 'active', lastLogin: '2025-05-24T15:45:00', createdAt: '2024-02-20', mfaEnabled: true, avatar: 'RP' },
  { id: 'adm_003', name: 'Priya Sharma', email: 'priya@resqid.com', phone: '+1 555-0103', role: 'superadmin', status: 'active', lastLogin: '2025-05-25T09:15:00', createdAt: '2024-03-10', mfaEnabled: false, avatar: 'PS' },
  { id: 'adm_004', name: 'Michael Chen', email: 'michael@resqid.com', phone: '+1 555-0104', role: 'viewer', status: 'inactive', lastLogin: '2025-05-01T11:20:00', createdAt: '2024-04-05', mfaEnabled: true, avatar: 'MC' },
  { id: 'adm_005', name: 'Sarah Williams', email: 'sarah@resqid.com', phone: '+1 555-0105', role: 'admin', status: 'active', lastLogin: '2025-05-23T14:10:00', createdAt: '2024-05-12', mfaEnabled: true, avatar: 'SW' },
];

const ROLES = [
  { value: 'superadmin', label: 'Super Admin', description: 'Full system access' },
  { value: 'admin', label: 'Admin', description: 'Manage settings and users' },
  { value: 'viewer', label: 'Viewer', description: 'Read-only access' },
];

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium', {
      'bg-emerald-100 text-emerald-800': status === 'active',
      'bg-red-100 text-red-800': status === 'inactive',
      'bg-amber-100 text-amber-800': status === 'suspended',
    })}>
      {status === 'active' ? <CheckCircle size={12} /> : <XCircle size={12} />}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function RoleBadge({ role }) {
  const found = ROLES.find(r => r.value === role);
  const colorMap = {
    superadmin: 'bg-purple-100 text-purple-800',
    admin: 'bg-blue-100 text-blue-800',
    viewer: 'bg-slate-100 text-slate-700',
  };
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium', colorMap[role])}>
      <Shield size={12} />
      {found?.label || role}
    </span>
  );
}

function AdminModal({ isOpen, onClose, onSave, admin }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'admin',
    status: 'active',
  });
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (admin) {
      setFormData({
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
        status: admin.status,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'admin',
        status: 'active',
      });
    }
  }, [admin, isOpen]);
  
  const handleSubmit = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    onSave(formData);
    setLoading(false);
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <UserPlus size={20} className="text-blue-600" />
            <h2 className="text-lg font-semibold text-slate-800">{admin ? 'Edit Admin' : 'Add New Admin'}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+1 555-0000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {ROLES.map(role => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          {!admin && (
            <div className="p-3 bg-blue-50 rounded-xl text-sm text-blue-800">
              <p className="font-medium">Invitation will be sent</p>
              <p className="text-xs mt-1">New admin will receive an email to set up their password.</p>
            </div>
          )}
        </div>
        <div className="flex gap-3 p-6 pt-0">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !formData.name || !formData.email}
            className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {admin ? 'Save Changes' : 'Send Invite'}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirmModal({ isOpen, onClose, onConfirm, adminName }) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="p-6 text-center">
          <div className="w-12 h-12 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Trash2 size={24} className="text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">Delete Admin</h3>
          <p className="text-sm text-slate-500 mt-2">
            Are you sure you want to delete <span className="font-semibold">{adminName}</span>? This action cannot be undone.
          </p>
          <div className="flex gap-3 mt-6">
            <button onClick={onClose} className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-slate-600">
              Cancel
            </button>
            <button onClick={onConfirm} className="flex-1 px-4 py-2 rounded-xl bg-red-600 text-white">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
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

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function AdminsPage() {
  const [admins, setAdmins] = useState(MOCK_ADMINS);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const itemsPerPage = 5;
  
  useEffect(() => {
    let result = [...admins];
    if (search) {
      result = result.filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase()));
    }
    if (roleFilter !== 'all') result = result.filter(a => a.role === roleFilter);
    if (statusFilter !== 'all') result = result.filter(a => a.status === statusFilter);
    setFiltered(result);
    setCurrentPage(1);
  }, [search, roleFilter, statusFilter, admins]);
  
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  
  const handleSaveAdmin = (data) => {
    if (editingAdmin) {
      setAdmins(prev => prev.map(a => a.id === editingAdmin.id ? { ...a, ...data } : a));
    } else {
      const newAdmin = {
        id: `adm_${Date.now()}`,
        ...data,
        lastLogin: null,
        createdAt: new Date().toISOString(),
        mfaEnabled: false,
        avatar: data.name.split(' ').map(n => n[0]).join(''),
      };
      setAdmins(prev => [newAdmin, ...prev]);
    }
    setModalOpen(false);
    setEditingAdmin(null);
  };
  
  const handleDelete = () => {
    setAdmins(prev => prev.filter(a => a.id !== deleteTarget.id));
    setDeleteTarget(null);
  };
  
  const handleResendInvite = (admin) => {
    console.log('Resend invite to', admin.email);
  };
  
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto p-6 space-y-5">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Administrators</h1>
            <p className="text-slate-500 text-sm mt-0.5">Manage superadmin and admin users</p>
          </div>
          <button
            onClick={() => { setEditingAdmin(null); setModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-sm font-medium shadow-sm"
          >
            <Plus size={16} /> Add Admin
          </button>
        </div>
        
        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[200px] relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm" />
            </div>
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="px-3 py-2 rounded-xl border border-slate-200 text-sm">
              <option value="all">All Roles</option>
              {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-xl border border-slate-200 text-sm">
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
            <button className="px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50">
              <RefreshCw size={16} />
            </button>
          </div>
        </div>
        
        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-3.5 px-4 text-xs font-semibold text-slate-500">Admin</th>
                  <th className="text-left py-3.5 px-4 text-xs font-semibold text-slate-500">Contact</th>
                  <th className="text-left py-3.5 px-4 text-xs font-semibold text-slate-500">Role</th>
                  <th className="text-left py-3.5 px-4 text-xs font-semibold text-slate-500">Status</th>
                  <th className="text-left py-3.5 px-4 text-xs font-semibold text-slate-500">Last Login</th>
                  <th className="text-center py-3.5 px-4 text-xs font-semibold text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginated.map(admin => (
                  <tr key={admin.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold text-blue-700">
                          {admin.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800">{admin.name}</p>
                          <p className="text-xs text-slate-400">ID: {admin.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-slate-600">{admin.email}</p>
                      <p className="text-xs text-slate-400">{admin.phone}</p>
                    </td>
                    <td className="py-3 px-4"><RoleBadge role={admin.role} /></td>
                    <td className="py-3 px-4"><StatusBadge status={admin.status} /></td>
                    <td className="py-3 px-4 text-sm text-slate-600">
                      {admin.lastLogin ? new Date(admin.lastLogin).toLocaleString() : 'Never'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => { setEditingAdmin(admin); setModalOpen(true); }} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600" title="Edit">
                          <Edit2 size={15} />
                        </button>
                        <button onClick={() => handleResendInvite(admin)} className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600" title="Resend Invite">
                          <Send size={15} />
                        </button>
                        <button onClick={() => setDeleteTarget(admin)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600" title="Delete">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginated.length === 0 && (
                  <tr><td colSpan={6} className="py-12 text-center text-slate-400">No admins found</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>
      
      <AdminModal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditingAdmin(null); }} onSave={handleSaveAdmin} admin={editingAdmin} />
      <DeleteConfirmModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} adminName={deleteTarget?.name} />
    </div>
  );
}

import { X, Save } from 'lucide-react';