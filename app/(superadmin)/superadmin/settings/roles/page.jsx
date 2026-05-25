'use client';

import { useState, useEffect } from 'react';
import {
  Shield, Plus, Edit2, Trash2, Save, X, Copy, Lock,
  CheckCircle, XCircle, AlertCircle, Eye, EyeOff, Users,
  Settings, Bell, Database, Activity, FileText, CreditCard,
  Globe, MessageCircle, Calendar, BookOpen, AlertTriangle,
  ChevronRight, ChevronDown, Loader2, Search
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const PERMISSION_CATEGORIES = [
  { id: 'schools', label: 'Schools Management', icon: Globe, permissions: ['view_schools', 'create_school', 'edit_school', 'delete_school', 'manage_school_settings'] },
  { id: 'users', label: 'User Management', icon: Users, permissions: ['view_users', 'create_user', 'edit_user', 'delete_user', 'assign_roles'] },
  { id: 'attendance', label: 'Attendance', icon: Calendar, permissions: ['view_attendance', 'mark_attendance', 'edit_attendance', 'export_attendance'] },
  { id: 'timetable', label: 'Timetable', icon: BookOpen, permissions: ['view_timetable', 'create_timetable', 'edit_timetable', 'delete_timetable'] },
  { id: 'emergency', label: 'Emergency', icon: AlertTriangle, permissions: ['view_alerts', 'create_alert', 'resolve_alert', 'manage_sos'] },
  { id: 'communication', label: 'Communication', icon: MessageCircle, permissions: ['view_announcements', 'send_announcements', 'manage_broadcast'] },
  { id: 'billing', label: 'Billing', icon: CreditCard, permissions: ['view_invoices', 'manage_subscriptions', 'process_payments', 'view_revenue'] },
  { id: 'settings', label: 'System Settings', icon: Settings, permissions: ['view_settings', 'edit_settings', 'manage_integrations', 'view_logs'] },
  { id: 'reports', label: 'Reports', icon: FileText, permissions: ['view_reports', 'export_reports', 'schedule_reports'] },
  { id: 'activity', label: 'Activity Logs', icon: Activity, permissions: ['view_activity_logs', 'export_activity_logs', 'delete_activity_logs'] },
];

const PERMISSION_LABELS = {
  view_schools: 'View schools', create_school: 'Create schools', edit_school: 'Edit schools', delete_school: 'Delete schools', manage_school_settings: 'Manage school settings',
  view_users: 'View users', create_user: 'Create users', edit_user: 'Edit users', delete_user: 'Delete users', assign_roles: 'Assign roles',
  view_attendance: 'View attendance', mark_attendance: 'Mark attendance', edit_attendance: 'Edit attendance', export_attendance: 'Export attendance',
  view_timetable: 'View timetable', create_timetable: 'Create timetable', edit_timetable: 'Edit timetable', delete_timetable: 'Delete timetable',
  view_alerts: 'View alerts', create_alert: 'Create alerts', resolve_alert: 'Resolve alerts', manage_sos: 'Manage SOS',
  view_announcements: 'View announcements', send_announcements: 'Send announcements', manage_broadcast: 'Manage broadcast',
  view_invoices: 'View invoices', manage_subscriptions: 'Manage subscriptions', process_payments: 'Process payments', view_revenue: 'View revenue',
  view_settings: 'View settings', edit_settings: 'Edit settings', manage_integrations: 'Manage integrations', view_logs: 'View logs',
  view_reports: 'View reports', export_reports: 'Export reports', schedule_reports: 'Schedule reports',
  view_activity_logs: 'View activity logs', export_activity_logs: 'Export activity logs', delete_activity_logs: 'Delete activity logs',
};

const MOCK_ROLES = [
  { id: 'role_1', name: 'Super Admin', description: 'Full system access with all permissions', permissions: Object.keys(PERMISSION_LABELS), isDefault: true, createdAt: '2024-01-01' },
  { id: 'role_2', name: 'School Admin', description: 'Manage schools, users, and attendance', permissions: ['view_schools', 'create_school', 'edit_school', 'view_users', 'create_user', 'edit_user', 'view_attendance', 'mark_attendance', 'view_timetable', 'create_timetable', 'edit_timetable', 'view_alerts', 'create_alert', 'view_announcements', 'send_announcements', 'view_reports'], isDefault: true, createdAt: '2024-01-01' },
  { id: 'role_3', name: 'Teacher', description: 'Manage classes, attendance, and communication', permissions: ['view_attendance', 'mark_attendance', 'view_timetable', 'view_alerts', 'create_alert', 'view_announcements', 'send_announcements'], isDefault: true, createdAt: '2024-01-01' },
  { id: 'role_4', name: 'Billing Manager', description: 'Handle invoices and payments', permissions: ['view_invoices', 'manage_subscriptions', 'process_payments', 'view_revenue', 'view_reports', 'export_reports'], isDefault: false, createdAt: '2024-02-15' },
];

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function PermissionToggle({ permission, enabled, onChange }) {
  return (
    <label className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-50 cursor-pointer">
      <span className="text-sm text-slate-700">{PERMISSION_LABELS[permission] || permission}</span>
      <button
        onClick={(e) => { e.preventDefault(); onChange(!enabled); }}
        className={cn(
          'relative w-9 h-5 rounded-full transition-colors',
          enabled ? 'bg-blue-600' : 'bg-slate-300'
        )}
      >
        <span className={cn('absolute top-0.5 w-3.5 h-3.5 bg-white rounded-full transition-transform shadow-sm', enabled ? 'translate-x-4.5' : 'translate-x-0.5')} />
      </button>
    </label>
  );
}

function CategorySection({ category, permissionsState, onTogglePermission }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = category.icon;
  const allEnabled = category.permissions.every(p => permissionsState[p]);
  const someEnabled = category.permissions.some(p => permissionsState[p]);
  
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <Icon size={16} className="text-slate-500" />
          <span className="font-medium text-slate-700">{category.label}</span>
          {someEnabled && !allEnabled && <span className="text-xs text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">Partial</span>}
          {allEnabled && <CheckCircle size={14} className="text-emerald-600" />}
        </div>
        {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>
      {expanded && (
        <div className="p-2 divide-y divide-slate-100">
          {category.permissions.map(perm => (
            <PermissionToggle key={perm} permission={perm} enabled={permissionsState[perm]} onChange={(val) => onTogglePermission(perm, val)} />
          ))}
        </div>
      )}
    </div>
  );
}

function RoleModal({ isOpen, onClose, onSave, role }) {
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (role) {
      setFormData({ name: role.name, description: role.description });
      const permObj = {};
      PERMISSION_CATEGORIES.forEach(cat => {
        cat.permissions.forEach(p => { permObj[p] = role.permissions.includes(p); });
      });
      setPermissions(permObj);
    } else {
      setFormData({ name: '', description: '' });
      const permObj = {};
      PERMISSION_CATEGORIES.forEach(cat => {
        cat.permissions.forEach(p => { permObj[p] = false; });
      });
      setPermissions(permObj);
    }
  }, [role, isOpen]);
  
  const togglePermission = (perm, value) => {
    setPermissions(prev => ({ ...prev, [perm]: value }));
  };
  
  const handleSubmit = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const selectedPerms = Object.entries(permissions).filter(([, v]) => v).map(([k]) => k);
    onSave({ ...formData, permissions: selectedPerms });
    setLoading(false);
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Shield size={20} className="text-blue-600" />
            <h2 className="text-lg font-semibold text-slate-800">{role ? 'Edit Role' : 'Create Role'}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Role Name</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-slate-200" placeholder="e.g., School Admin" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
              <input type="text" value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-slate-200" placeholder="Brief description" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Permissions</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {PERMISSION_CATEGORIES.map(cat => (
                <CategorySection key={cat.id} category={cat} permissionsState={permissions} onTogglePermission={togglePermission} />
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3 p-6 pt-0">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600">Cancel</button>
          <button onClick={handleSubmit} disabled={loading || !formData.name} className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {role ? 'Save Changes' : 'Create Role'}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirmModal({ isOpen, onClose, onConfirm, roleName, isDefault }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="w-12 h-12 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4"><Trash2 size={24} className="text-red-600" /></div>
        <h3 className="text-lg font-semibold text-slate-800">Delete Role</h3>
        <p className="text-sm text-slate-500 mt-2">Are you sure you want to delete <span className="font-semibold">{roleName}</span>? {isDefault && <span className="text-red-600 block mt-1">⚠️ This is a default role and cannot be deleted.</span>}</p>
        {!isDefault && (
          <div className="flex gap-3 mt-6">
            <button onClick={onClose} className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-slate-600">Cancel</button>
            <button onClick={onConfirm} className="flex-1 px-4 py-2 rounded-xl bg-red-600 text-white">Delete</button>
          </div>
        )}
        {isDefault && <button onClick={onClose} className="mt-4 px-4 py-2 rounded-xl bg-slate-100 text-slate-600">Close</button>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function RolesPage() {
  const [roles, setRoles] = useState(MOCK_ROLES);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  
  const filteredRoles = roles.filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase()));
  
  const handleSaveRole = (data) => {
    if (editingRole) {
      setRoles(prev => prev.map(r => r.id === editingRole.id ? { ...r, ...data } : r));
    } else {
      const newRole = { id: `role_${Date.now()}`, ...data, isDefault: false, createdAt: new Date().toISOString() };
      setRoles(prev => [...prev, newRole]);
    }
    setModalOpen(false);
    setEditingRole(null);
  };
  
  const handleDelete = () => {
    if (deleteTarget.isDefault) return;
    setRoles(prev => prev.filter(r => r.id !== deleteTarget.id));
    setDeleteTarget(null);
  };
  
  const handleDuplicate = (role) => {
    const newRole = { ...role, id: `role_${Date.now()}`, name: `${role.name} (Copy)`, isDefault: false, createdAt: new Date().toISOString() };
    setRoles(prev => [...prev, newRole]);
  };
  
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto p-6 space-y-5">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Roles & Permissions</h1>
            <p className="text-slate-500 text-sm mt-0.5">Manage user roles and access control</p>
          </div>
          <button onClick={() => { setEditingRole(null); setModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium">
            <Plus size={16} /> Create Role
          </button>
        </div>
        
        {/* Search */}
        <div className="relative max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search roles..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm" />
        </div>
        
        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRoles.map(role => (
            <div key={role.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Shield size={18} className="text-blue-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">{role.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{role.description}</p>
                  </div>
                </div>
                {role.isDefault && <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">Default</span>}
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs text-slate-400">{role.permissions.length} permissions</div>
                <div className="flex gap-1">
                  <button onClick={() => handleDuplicate(role)} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600" title="Duplicate"><Copy size={14} /></button>
                  <button onClick={() => { setEditingRole(role); setModalOpen(true); }} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600" title="Edit"><Edit2 size={14} /></button>
                  <button onClick={() => setDeleteTarget(role)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600" title="Delete"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <RoleModal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditingRole(null); }} onSave={handleSaveRole} role={editingRole} />
      <DeleteConfirmModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} roleName={deleteTarget?.name} isDefault={deleteTarget?.isDefault} />
    </div>
  );
}