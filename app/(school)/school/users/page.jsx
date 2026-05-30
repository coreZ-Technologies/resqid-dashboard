'use client';

/**
 * SCHOOL ADMIN — MANAGE USERS
 * Place at: app/(school)/school/settings/staff/page.jsx
 */

import { useState, useMemo } from 'react';
import {
    Users, Plus, Search, Download, Edit2, Trash2,
    X, Check, Loader2, ChevronDown, Shield,
    UserCheck, UserX, Key, Mail, Phone,
    MoreVertical, RefreshCw, Eye, EyeOff
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────
const ROLES = ['All', 'Admin', 'Teacher', 'Staff', 'Accountant'];
const STATUS_OPTS = ['All', 'Active', 'Inactive', 'Suspended'];

const ROLE_STYLE = {
    Admin:      { bg: 'bg-violet-50',  text: 'text-violet-700', border: 'border-violet-200' },
    Teacher:    { bg: 'bg-blue-50',    text: 'text-blue-700',   border: 'border-blue-200'   },
    Staff:      { bg: 'bg-slate-100',  text: 'text-slate-600',  border: 'border-slate-200'  },
    Accountant: { bg: 'bg-amber-50',   text: 'text-amber-700',  border: 'border-amber-200'  },
};

const STATUS_STYLE = {
    Active:    { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    Inactive:  { bg: 'bg-slate-100',  text: 'text-slate-500',   dot: 'bg-slate-400'   },
    Suspended: { bg: 'bg-red-50',     text: 'text-red-700',     dot: 'bg-red-500'     },
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_USERS = [
    { id: 'u1',  name: 'Animesh Karan',    email: 'animesh@springdaleschool.in',   phone: '+91 98765 43210', role: 'Admin',      status: 'Active',    avatar: 'AK', color: 'bg-blue-600',    lastLogin: '2026-05-30T10:22:00Z', joined: '2024-01-15' },
    { id: 'u2',  name: 'Mr. Suresh Kumar', email: 'suresh.kumar@springdale.in',    phone: '+91 97654 32109', role: 'Teacher',    status: 'Active',    avatar: 'SK', color: 'bg-violet-500',  lastLogin: '2026-05-30T08:10:00Z', joined: '2024-03-01' },
    { id: 'u3',  name: 'Ms. Priya Nair',   email: 'priya.nair@springdale.in',      phone: '+91 96543 21098', role: 'Teacher',    status: 'Active',    avatar: 'PN', color: 'bg-emerald-500', lastLogin: '2026-05-29T15:45:00Z', joined: '2024-03-01' },
    { id: 'u4',  name: 'Mr. Amit Das',     email: 'amit.das@springdale.in',        phone: '+91 95432 10987', role: 'Teacher',    status: 'Active',    avatar: 'AD', color: 'bg-amber-500',   lastLogin: '2026-05-30T09:30:00Z', joined: '2024-06-01' },
    { id: 'u5',  name: 'Ms. Sunita Roy',   email: 'sunita.roy@springdale.in',      phone: '+91 94321 09876', role: 'Teacher',    status: 'Inactive',  avatar: 'SR', color: 'bg-rose-500',    lastLogin: '2026-04-10T11:20:00Z', joined: '2024-06-01' },
    { id: 'u6',  name: 'Ramesh Verma',     email: 'ramesh.v@springdale.in',        phone: '+91 93210 98765', role: 'Staff',      status: 'Active',    avatar: 'RV', color: 'bg-cyan-500',    lastLogin: '2026-05-30T07:55:00Z', joined: '2023-09-01' },
    { id: 'u7',  name: 'Kavitha Reddy',    email: 'kavitha.r@springdale.in',       phone: '+91 92109 87654', role: 'Accountant', status: 'Active',    avatar: 'KR', color: 'bg-teal-500',    lastLogin: '2026-05-29T16:00:00Z', joined: '2023-07-15' },
    { id: 'u8',  name: 'Deepak Sharma',    email: 'deepak.s@springdale.in',        phone: '+91 91098 76543', role: 'Staff',      status: 'Suspended', avatar: 'DS', color: 'bg-orange-500',  lastLogin: '2026-03-01T09:00:00Z', joined: '2022-11-01' },
];

// ─── Add/Edit Modal ───────────────────────────────────────────────────────────
const UserModal = ({ user, onClose, onSave }) => {
    const [name, setName]       = useState(user?.name || '');
    const [email, setEmail]     = useState(user?.email || '');
    const [phone, setPhone]     = useState(user?.phone || '');
    const [role, setRole]       = useState(user?.role || 'Teacher');
    const [status, setStatus]   = useState(user?.status || 'Active');
    const [showPass, setShowPass] = useState(false);
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!name.trim() || !email.trim()) return;
        setLoading(true);
        await new Promise(r => setTimeout(r, 700));
        onSave({ name, email, phone, role, status });
        setLoading(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
                            <Users size={17} className="text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-lg leading-tight">{user ? 'Edit User' : 'Add User'}</h3>
                            <p className="text-xs text-slate-500">Staff and admin accounts</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name *</label>
                        <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Mr. Rajesh Kumar"
                            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email *</label>
                        <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="email@school.in"
                            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone</label>
                        <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210"
                            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Role</label>
                            <div className="relative">
                                <select value={role} onChange={e => setRole(e.target.value)}
                                    className="w-full appearance-none border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500 bg-white cursor-pointer">
                                    {['Admin','Teacher','Staff','Accountant'].map(r => <option key={r}>{r}</option>)}
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Status</label>
                            <div className="relative">
                                <select value={status} onChange={e => setStatus(e.target.value)}
                                    className="w-full appearance-none border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500 bg-white cursor-pointer">
                                    {['Active','Inactive','Suspended'].map(s => <option key={s}>{s}</option>)}
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                    {!user && (
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                            <div className="relative">
                                <input value={password} onChange={e => setPassword(e.target.value)}
                                    type={showPass ? 'text' : 'password'} placeholder="Set initial password"
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 pr-10 text-sm outline-none focus:border-blue-500" />
                                <button onClick={() => setShowPass(p => !p)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50">Cancel</button>
                    <button onClick={handleSave} disabled={!name || !email || loading}
                        className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-50 transition-colors">
                        {loading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                        {user ? 'Save Changes' : 'Add User'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── User Row ────────────────────────────────────────────────────────────────
const UserRow = ({ user, onEdit, onDelete, isLast }) => {
    const role   = ROLE_STYLE[user.role]     || ROLE_STYLE.Staff;
    const status = STATUS_STYLE[user.status] || STATUS_STYLE.Inactive;

    const formatLastLogin = (iso) => {
        if (!iso) return 'Never';
        const diff = Date.now() - new Date(iso).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60)  return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24)   return `${hrs}h ago`;
        return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    };

    return (
        <tr className={`hover:bg-slate-50 transition-colors ${!isLast ? 'border-b border-slate-100' : ''}`}>
            {/* User */}
            <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full ${user.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                        {user.avatar}
                    </div>
                    <div>
                        <div className="font-semibold text-slate-900 text-sm">{user.name}</div>
                        <div className="text-xs text-slate-400">{user.email}</div>
                    </div>
                </div>
            </td>
            {/* Phone */}
            <td className="px-5 py-3.5 text-sm text-slate-500">{user.phone}</td>
            {/* Role */}
            <td className="px-5 py-3.5">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${role.bg} ${role.text} ${role.border}`}>
                    {user.role}
                </span>
            </td>
            {/* Status */}
            <td className="px-5 py-3.5">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />{user.status}
                </span>
            </td>
            {/* Last login */}
            <td className="px-5 py-3.5 text-sm text-slate-400">{formatLastLogin(user.lastLogin)}</td>
            {/* Joined */}
            <td className="px-5 py-3.5 text-sm text-slate-400">
                {new Date(user.joined).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </td>
            {/* Actions */}
            <td className="px-5 py-3.5">
                <div className="flex items-center gap-1">
                    <button onClick={() => onEdit(user)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                        <Edit2 size={14} />
                    </button>
                    <button onClick={() => onDelete(user.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                        <Trash2 size={14} />
                    </button>
                </div>
            </td>
        </tr>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ManageUsersPage() {
    const [users, setUsers]         = useState(MOCK_USERS);
    const [search, setSearch]       = useState('');
    const [roleFilter, setRole]     = useState('All');
    const [statusFilter, setStatus] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [editUser, setEditUser]   = useState(null);

    const filtered = useMemo(() => users.filter(u => {
        const matchRole   = roleFilter   === 'All' || u.role   === roleFilter;
        const matchStatus = statusFilter === 'All' || u.status === statusFilter;
        const matchSearch = !search ||
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase()) ||
            u.role.toLowerCase().includes(search.toLowerCase());
        return matchRole && matchStatus && matchSearch;
    }), [users, search, roleFilter, statusFilter]);

    const handleSave = (data) => {
        if (editUser) {
            setUsers(prev => prev.map(u => u.id === editUser.id ? { ...u, ...data } : u));
        } else {
            const initials = data.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
            const colors = ['bg-blue-500','bg-violet-500','bg-emerald-500','bg-amber-500','bg-rose-500'];
            setUsers(prev => [...prev, {
                id: `u${Date.now()}`, ...data,
                avatar: initials,
                color: colors[Math.floor(Math.random() * colors.length)],
                lastLogin: null,
                joined: new Date().toISOString().slice(0, 10),
            }]);
        }
        setEditUser(null);
    };

    const stats = {
        total:     users.length,
        active:    users.filter(u => u.status === 'Active').length,
        admins:    users.filter(u => u.role === 'Admin').length,
        suspended: users.filter(u => u.status === 'Suspended').length,
    };

    return (
        <div className="max-w-[1300px]">
            {(showModal || editUser) && (
                <UserModal
                    user={editUser}
                    onClose={() => { setShowModal(false); setEditUser(null); }}
                    onSave={handleSave}
                />
            )}

            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h1 className="text-[1.375rem] font-bold text-slate-900 m-0">Manage Users</h1>
                    <p className="text-sm text-slate-500 mt-1">Add / remove staff and admin accounts</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 shadow-sm transition-colors">
                        <Download size={15} /> Export
                    </button>
                    <button onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm transition-colors">
                        <Plus size={16} /> Add User
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                    { label: 'Total Users',  value: stats.total,     icon: <Users size={20} className="text-white" />,     bg: 'bg-blue-500'    },
                    { label: 'Active',       value: stats.active,    icon: <UserCheck size={20} className="text-white" />, bg: 'bg-emerald-500' },
                    { label: 'Admins',       value: stats.admins,    icon: <Shield size={20} className="text-white" />,    bg: 'bg-violet-500'  },
                    { label: 'Suspended',    value: stats.suspended, icon: <UserX size={20} className="text-white" />,     bg: 'bg-red-500'     },
                ].map(({ label, value, icon, bg }) => (
                    <div key={label} className="bg-white rounded-xl border border-slate-200 shadow-sm px-5 py-4 flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center shrink-0`}>{icon}</div>
                        <div>
                            <div className="text-2xl font-bold text-slate-900">{value}</div>
                            <div className="text-xs text-slate-500">{label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3 mb-5 flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px]">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search by name, email or role..."
                        className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500" />
                </div>
                <div className="flex gap-1.5 flex-wrap">
                    {ROLES.map(r => (
                        <button key={r} onClick={() => setRole(r)}
                            className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${roleFilter === r ? 'bg-blue-600 border-blue-600 text-white font-semibold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                            {r}
                        </button>
                    ))}
                </div>
                <div className="flex gap-1.5">
                    {STATUS_OPTS.map(s => (
                        <button key={s} onClick={() => setStatus(s)}
                            className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${statusFilter === s ? 'bg-slate-800 border-slate-800 text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50">
                                {['User','Phone','Role','Status','Last Login','Joined','Actions'].map(h => (
                                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-16 text-center text-slate-400">
                                        <Users size={36} className="mx-auto mb-3 opacity-20" />
                                        <p className="font-medium">No users found</p>
                                    </td>
                                </tr>
                            ) : filtered.map((user, i) => (
                                <UserRow key={user.id} user={user} isLast={i === filtered.length - 1}
                                    onEdit={(u) => { setEditUser(u); setShowModal(true); }}
                                    onDelete={(id) => setUsers(prev => prev.filter(u => u.id !== id))} />
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                    <span className="text-xs text-slate-400">{filtered.length} user{filtered.length !== 1 ? 's' : ''}</span>
                </div>
            </div>
        </div>
    );
}