'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Users, Search, Filter, Eye, Edit2, MoreVertical, Download,
  RefreshCw, UserCheck, UserX, Calendar, BookOpen, MapPin,
  Mail, Phone, Shield, AlertCircle, Loader2, ChevronLeft,
  ChevronRight, GraduationCap, Activity, TrendingUp, CheckCircle,
  XCircle, Clock, School, Star, Flag, Ban, RotateCcw, Briefcase,
  Award, BookMarked, Video, MessageSquare, X  // Added X here
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ... (rest of the constants and mock data remain exactly the same) ...

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────

const SCHOOLS = [
  'Springfield High School',
  'Riverside Academy',
  'Northside Elementary',
  'Westlake College',
  'Sunnydale School',
];

const DEPARTMENTS = [
  'Mathematics',
  'Science',
  'English',
  'Social Studies',
  'Computer Science',
  'Physical Education',
  'Arts',
  'Music',
  'Economics',
  'Languages'
];

const SUBJECTS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi',
  'Sanskrit', 'History', 'Geography', 'Computer Science', 'Physical Education',
  'Arts', 'Music', 'Economics', 'Business Studies'
];

const STATUSES = {
  active: { label: 'Active', color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle },
  inactive: { label: 'Inactive', color: 'bg-slate-100 text-slate-600', icon: XCircle },
  on_leave: { label: 'On Leave', color: 'bg-amber-100 text-amber-800', icon: Clock },
  suspended: { label: 'Suspended', color: 'bg-red-100 text-red-800', icon: Ban },
};

const generateMockTeachers = (count = 120) => {
  const firstNames = ['Aarav', 'Vihaan', 'Vivaan', 'Ananya', 'Diya', 'Sai', 'Ishaan', 'Myra', 'Kabir', 'Aadhya', 'James', 'Emma', 'Liam', 'Sophia', 'Noah', 'Olivia', 'Ethan', 'Ava', 'Mason', 'Isabella'];
  const lastNames = ['Sharma', 'Verma', 'Patel', 'Kumar', 'Singh', 'Reddy', 'Gupta', 'Joshi', 'Nair', 'Malhotra', 'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  
  const teachers = [];
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    const school = SCHOOLS[Math.floor(Math.random() * SCHOOLS.length)];
    const department = DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)];
    const subjects = [SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)]];
    if (Math.random() > 0.6) subjects.push(SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)]);
    if (Math.random() > 0.8) subjects.push(SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)]);
    
    const statusKey = Object.keys(STATUSES)[Math.floor(Math.random() * 4)];
    const status = STATUSES[statusKey];
    const joinDate = new Date(2020 + Math.random() * 5, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
    const lastActive = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    
    teachers.push({
      id: `TCH${String(i + 1).padStart(5, '0')}`,
      name,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@school.edu`,
      phone: `+1 555-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      school,
      department,
      subjects,
      qualification: ['B.Ed', 'M.Sc', 'Ph.D'][Math.floor(Math.random() * 3)],
      experience: Math.floor(Math.random() * 20) + 1,
      status: statusKey,
      joinDate: joinDate.toISOString(),
      lastActive: lastActive.toISOString(),
      classesAssigned: Math.floor(Math.random() * 5) + 2,
      studentsCount: Math.floor(Math.random() * 150) + 30,
      rating: (Math.random() * 2 + 3).toFixed(1),
      avatar: name.split(' ').map(n => n[0]).join(''),
    });
  }
  return teachers.sort((a, b) => a.name.localeCompare(b.name));
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const config = STATUSES[status];
  const Icon = config?.icon || CheckCircle;
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium', config?.color || 'bg-slate-100')}>
      <Icon size={12} />
      {config?.label || status}
    </span>
  );
}

function TeacherDetailModal({ teacher, isOpen, onClose }) {
  if (!teacher) return null;
  
  const formatDate = (iso) => new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
  
  return (
    <div className={cn('fixed inset-0 z-50 flex items-center justify-center p-4 transition-all', isOpen ? 'visible' : 'invisible')}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <GraduationCap size={20} className="text-blue-600" />
            <h2 className="text-lg font-semibold text-slate-800">Teacher Details</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>
        <div className="p-6 space-y-5">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-xl font-bold text-blue-700">
              {teacher.avatar}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-800">{teacher.name}</h3>
              <p className="text-sm text-slate-500 mt-0.5">Teacher ID: {teacher.id}</p>
              <div className="mt-2"><StatusBadge status={teacher.status} /></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl">
            <div><p className="text-xs text-slate-500 uppercase">School</p><p className="text-sm font-medium text-slate-800 mt-1">{teacher.school}</p></div>
            <div><p className="text-xs text-slate-500 uppercase">Department</p><p className="text-sm font-medium text-slate-800 mt-1">{teacher.department}</p></div>
            <div><p className="text-xs text-slate-500 uppercase">Qualification</p><p className="text-sm text-slate-700 mt-1">{teacher.qualification}</p></div>
            <div><p className="text-xs text-slate-500 uppercase">Experience</p><p className="text-sm text-slate-700 mt-1">{teacher.experience} years</p></div>
            <div><p className="text-xs text-slate-500 uppercase">Join Date</p><p className="text-sm text-slate-700 mt-1">{formatDate(teacher.joinDate)}</p></div>
            <div><p className="text-xs text-slate-500 uppercase">Last Active</p><p className="text-sm text-slate-700 mt-1">{formatDate(teacher.lastActive)}</p></div>
            <div><p className="text-xs text-slate-500 uppercase">Classes Assigned</p><p className="text-sm text-slate-700 mt-1">{teacher.classesAssigned}</p></div>
            <div><p className="text-xs text-slate-500 uppercase">Students</p><p className="text-sm text-slate-700 mt-1">{teacher.studentsCount}</p></div>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-2">Subjects</h4>
            <div className="flex flex-wrap gap-1.5">
              {teacher.subjects.map((subj, idx) => (
                <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">{subj}</span>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-2">Contact Information</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm"><Mail size={14} className="text-slate-400" />{teacher.email}</div>
              <div className="flex items-center gap-2 text-sm"><Phone size={14} className="text-slate-400" />{teacher.phone}</div>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-2">Performance</h4>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1"><Star size={16} className="text-amber-500 fill-amber-500" /><span className="text-sm font-medium">{teacher.rating}</span><span className="text-xs text-slate-400">/5</span></div>
              <div className="flex items-center gap-1"><Users size={16} className="text-slate-500" /><span className="text-sm">{teacher.studentsCount} students</span></div>
            </div>
          </div>
          
          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button className="flex-1 py-2 rounded-xl bg-blue-600 text-white font-medium">Edit Teacher</button>
            <button className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 font-medium">View Schedule</button>
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

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function TeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [schoolFilter, setSchoolFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  
  const itemsPerPage = 10;
  
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(r => setTimeout(r, 600));
      setTeachers(generateMockTeachers(135));
      setLoading(false);
    };
    loadData();
  }, []);
  
  // Apply filters
  useEffect(() => {
    let result = [...teachers];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(t => t.name.toLowerCase().includes(q) || t.email.toLowerCase().includes(q) || t.id.toLowerCase().includes(q));
    }
    if (schoolFilter !== 'all') result = result.filter(t => t.school === schoolFilter);
    if (departmentFilter !== 'all') result = result.filter(t => t.department === departmentFilter);
    if (statusFilter !== 'all') result = result.filter(t => t.status === statusFilter);
    setFiltered(result);
    setCurrentPage(1);
  }, [teachers, search, schoolFilter, departmentFilter, statusFilter]);
  
  // Stats
  const stats = useMemo(() => {
    const total = teachers.length;
    const active = teachers.filter(t => t.status === 'active').length;
    const avgExperience = Math.round(teachers.reduce((sum, t) => sum + t.experience, 0) / total);
    const schoolsCount = new Set(teachers.map(t => t.school)).size;
    const avgRating = (teachers.reduce((sum, t) => sum + parseFloat(t.rating), 0) / total).toFixed(1);
    return { total, active, avgExperience, schoolsCount, avgRating };
  }, [teachers]);
  
  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  
  const handleExport = () => {
    console.log('Export teachers data');
  };
  
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setTeachers(generateMockTeachers(135));
      setLoading(false);
    }, 500);
  };
  
  if (loading && teachers.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-slate-500">Loading teachers...</p>
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
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Teacher Management</h1>
            <p className="text-slate-500 text-sm mt-0.5">View and manage all teachers across all schools</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handleExport} className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-sm font-medium shadow-sm">
              <Download size={15} /> Export
            </button>
            <button onClick={handleRefresh} className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-sm font-medium shadow-sm">
              <RefreshCw size={15} /> Refresh
            </button>
          </div>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center"><Users size={20} className="text-blue-700" /></div>
            <div><p className="text-xs text-slate-500 uppercase">Total Teachers</p><p className="text-2xl font-bold text-slate-800">{stats.total.toLocaleString()}</p></div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center"><UserCheck size={20} className="text-emerald-700" /></div>
            <div><p className="text-xs text-slate-500 uppercase">Active Teachers</p><p className="text-2xl font-bold text-slate-800">{stats.active.toLocaleString()}</p></div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center"><Briefcase size={20} className="text-purple-700" /></div>
            <div><p className="text-xs text-slate-500 uppercase">Avg Experience</p><p className="text-2xl font-bold text-slate-800">{stats.avgExperience} yrs</p></div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center"><School size={20} className="text-amber-700" /></div>
            <div><p className="text-xs text-slate-500 uppercase">Schools</p><p className="text-2xl font-bold text-slate-800">{stats.schoolsCount}</p></div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center"><Star size={20} className="text-rose-700" /></div>
            <div><p className="text-xs text-slate-500 uppercase">Avg Rating</p><p className="text-2xl font-bold text-slate-800">{stats.avgRating}</p></div>
          </div>
        </div>
        
        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[180px]">
              <label className="block text-xs font-medium text-slate-500 mb-1">Search</label>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Name, ID, email..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">School</label>
              <select value={schoolFilter} onChange={(e) => setSchoolFilter(e.target.value)} className="px-3 py-2 rounded-xl border border-slate-200 text-sm min-w-[160px]">
                <option value="all">All Schools</option>
                {SCHOOLS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Department</label>
              <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)} className="px-3 py-2 rounded-xl border border-slate-200 text-sm min-w-[140px]">
                <option value="all">All Departments</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-xl border border-slate-200 text-sm min-w-[120px]">
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on_leave">On Leave</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <button onClick={() => { setSearch(''); setSchoolFilter('all'); setDepartmentFilter('all'); setStatusFilter('all'); }} className="px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm flex items-center gap-1">
              <RotateCcw size={14} /> Reset
            </button>
          </div>
        </div>
        
        {/* Teachers Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Teacher</th>
                  <th className="text-left py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">ID / Dept</th>
                  <th className="text-left py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">School</th>
                  <th className="text-left py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Subjects</th>
                  <th className="text-left py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Experience</th>
                  <th className="text-left py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-left py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Rating</th>
                  <th className="text-center py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginated.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold text-blue-700">
                          {teacher.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800">{teacher.name}</p>
                          <p className="text-xs text-slate-400">{teacher.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-slate-600">{teacher.id}</p>
                      <p className="text-xs text-slate-400">{teacher.department}</p>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">{teacher.school}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {teacher.subjects.slice(0, 2).map((subj, idx) => (
                          <span key={idx} className="text-xs px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">{subj}</span>
                        ))}
                        {teacher.subjects.length > 2 && <span className="text-xs text-slate-400">+{teacher.subjects.length - 2}</span>}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">{teacher.experience} yrs</td>
                    <td className="py-3 px-4"><StatusBadge status={teacher.status} /></td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-amber-500 fill-amber-500" />
                        <span className="text-sm font-medium text-slate-700">{teacher.rating}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button onClick={() => { setSelectedTeacher(teacher); setDetailModalOpen(true); }} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="View Details">
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {paginated.length === 0 && (
                  <tr><td colSpan={8} className="py-12 text-center text-slate-400">No teachers match your filters</td></tr>
                )}
              </tbody>
            </table>
          </div>
          {filtered.length > 0 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
        </div>
        
        {/* Footer */}
        <div className="text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <Users size={12} /> Showing {filtered.length} teachers across {stats.schoolsCount} schools
        </div>
      </div>
      
      <TeacherDetailModal teacher={selectedTeacher} isOpen={detailModalOpen} onClose={() => setDetailModalOpen(false)} />
    </div>
  );
}