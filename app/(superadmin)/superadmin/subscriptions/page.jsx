'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  DollarSign, CreditCard, Receipt, TrendingUp, Users, Calendar,
  Download, Eye, Filter, Search, Plus, Edit2, Trash2,
  CheckCircle, XCircle, Clock, AlertCircle, Loader2,
  RefreshCw, ChevronLeft, ChevronRight, RotateCcw,
  FileText, Building, Zap, Shield, Crown, Star,
  MoreVertical, BarChart3, PieChart, Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS & MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────

const PLANS = [
  { id: 'free', name: 'Free', price: 0, priceYearly: 0, features: ['Up to 100 students', 'Basic attendance', 'Email support'], color: 'slate', icon: Shield },
  { id: 'basic', name: 'Basic', price: 49, priceYearly: 499, features: ['Up to 500 students', 'Attendance & timetable', 'Email & chat support'], color: 'blue', icon: Star },
  { id: 'pro', name: 'Professional', price: 99, priceYearly: 999, features: ['Up to 2,000 students', 'All modules + emergency', 'Priority support', 'API access'], color: 'purple', icon: Zap },
  { id: 'enterprise', name: 'Enterprise', price: 299, priceYearly: 2999, features: ['Unlimited students', 'Custom features', '24/7 dedicated support', 'SLA'], color: 'amber', icon: Crown },
];

const PAYMENT_STATUS = {
  paid: { label: 'Paid', color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle },
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-800', icon: Clock },
  failed: { label: 'Failed', color: 'bg-red-100 text-red-800', icon: XCircle },
  refunded: { label: 'Refunded', color: 'bg-slate-100 text-slate-600', icon: RefreshCw },
};

const SCHOOLS_BILLING = [
  { id: 'SCH001', name: 'Springfield High School', plan: 'pro', status: 'active', amount: 99, billingCycle: 'monthly', nextBilling: '2025-06-15', students: 1245, joinDate: '2024-01-10' },
  { id: 'SCH002', name: 'Riverside Academy', plan: 'enterprise', status: 'active', amount: 299, billingCycle: 'monthly', nextBilling: '2025-06-20', students: 3450, joinDate: '2023-09-15' },
  { id: 'SCH003', name: 'Northside Elementary', plan: 'basic', status: 'active', amount: 49, billingCycle: 'yearly', nextBilling: '2025-12-01', students: 380, joinDate: '2024-03-01' },
  { id: 'SCH004', name: 'Westlake College', plan: 'free', status: 'trial', amount: 0, billingCycle: 'monthly', nextBilling: '2025-05-30', students: 95, joinDate: '2025-04-01' },
  { id: 'SCH005', name: 'Sunnydale School', plan: 'pro', status: 'past_due', amount: 99, billingCycle: 'monthly', nextBilling: '2025-05-10', students: 876, joinDate: '2024-06-20' },
  { id: 'SCH006', name: 'Oakridge Academy', plan: 'basic', status: 'active', amount: 49, billingCycle: 'monthly', nextBilling: '2025-06-05', students: 420, joinDate: '2024-11-15' },
  { id: 'SCH007', name: 'Pine Valley School', plan: 'enterprise', status: 'active', amount: 299, billingCycle: 'yearly', nextBilling: '2026-01-15', students: 2800, joinDate: '2023-12-10' },
  { id: 'SCH008', name: 'Lakewood High', plan: 'pro', status: 'cancelled', amount: 0, billingCycle: 'monthly', nextBilling: null, students: 0, joinDate: '2024-02-20' },
];

const INVOICES = [
  { id: 'INV-2024-001', school: 'Springfield High School', amount: 99, status: 'paid', date: '2025-05-15', dueDate: '2025-05-15', items: 'Pro Plan - Monthly Subscription' },
  { id: 'INV-2024-002', school: 'Riverside Academy', amount: 299, status: 'paid', date: '2025-05-20', dueDate: '2025-05-20', items: 'Enterprise Plan - Monthly Subscription' },
  { id: 'INV-2024-003', school: 'Northside Elementary', amount: 499, status: 'paid', date: '2025-04-01', dueDate: '2025-04-01', items: 'Basic Plan - Yearly Subscription' },
  { id: 'INV-2024-004', school: 'Sunnydale School', amount: 99, status: 'pending', date: '2025-05-10', dueDate: '2025-05-24', items: 'Pro Plan - Monthly Subscription' },
  { id: 'INV-2024-005', school: 'Oakridge Academy', amount: 49, status: 'paid', date: '2025-05-05', dueDate: '2025-05-05', items: 'Basic Plan - Monthly Subscription' },
  { id: 'INV-2024-006', school: 'Pine Valley School', amount: 2999, status: 'paid', date: '2025-01-15', dueDate: '2025-01-15', items: 'Enterprise Plan - Yearly Subscription' },
  { id: 'INV-2024-007', school: 'Springfield High School', amount: 99, status: 'failed', date: '2025-04-15', dueDate: '2025-04-29', items: 'Pro Plan - Monthly Subscription' },
];

// Revenue data for chart
const MONTHLY_REVENUE = [
  { month: 'Jan', revenue: 2450 },
  { month: 'Feb', revenue: 2680 },
  { month: 'Mar', revenue: 3120 },
  { month: 'Apr', revenue: 2980 },
  { month: 'May', revenue: 3450 },
  { month: 'Jun', revenue: 3820 },
];

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function PlanBadge({ planId }) {
  const plan = PLANS.find(p => p.id === planId);
  if (!plan) return <span className="text-xs text-slate-500">Unknown</span>;
  
  const colorMap = {
    free: 'bg-slate-100 text-slate-700',
    basic: 'bg-blue-100 text-blue-700',
    pro: 'bg-purple-100 text-purple-700',
    enterprise: 'bg-amber-100 text-amber-700',
  };
  
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium', colorMap[planId])}>
      {plan.name}
    </span>
  );
}

function PaymentStatusBadge({ status }) {
  const config = PAYMENT_STATUS[status];
  if (!config) return null;
  const Icon = config.icon;
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium', config.color)}>
      <Icon size={12} />
      {config.label}
    </span>
  );
}

function PlanEditorModal({ isOpen, onClose, onSave, plan }) {
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    priceYearly: 0,
    features: [],
    maxStudents: 0,
  });
  const [featureInput, setFeatureInput] = useState('');
  
  useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name,
        price: plan.price,
        priceYearly: plan.priceYearly,
        features: plan.features || [],
        maxStudents: plan.maxStudents || 0,
      });
    } else {
      setFormData({
        name: '',
        price: 0,
        priceYearly: 0,
        features: [],
        maxStudents: 0,
      });
    }
  }, [plan]);
  
  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData(prev => ({ ...prev, features: [...prev.features, featureInput.trim()] }));
      setFeatureInput('');
    }
  };
  
  const removeFeature = (index) => {
    setFormData(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }));
  };
  
  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Settings size={20} className="text-blue-600" />
            <h2 className="text-lg font-semibold text-slate-800">{plan ? 'Edit Plan' : 'Create New Plan'}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Plan Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Premium"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Monthly Price ($)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Yearly Price ($)</label>
              <input
                type="number"
                value={formData.priceYearly}
                onChange={(e) => setFormData(prev => ({ ...prev, priceYearly: Number(e.target.value) }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Max Students</label>
            <input
              type="number"
              value={formData.maxStudents}
              onChange={(e) => setFormData(prev => ({ ...prev, maxStudents: Number(e.target.value) }))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Unlimited = 0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Features</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addFeature()}
                placeholder="Add a feature..."
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button onClick={addFeature} className="px-3 py-2 rounded-xl bg-blue-600 text-white text-sm">
                Add
              </button>
            </div>
            <div className="space-y-1.5">
              {formData.features.map((feat, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-700">{feat}</span>
                  <button onClick={() => removeFeature(idx)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium">
              Cancel
            </button>
            <button onClick={handleSubmit} className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium">
              {plan ? 'Save Changes' : 'Create Plan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RevenueChart() {
  const maxRevenue = Math.max(...MONTHLY_REVENUE.map(d => d.revenue));
  
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
      <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
        <BarChart3 size={15} className="text-blue-600" />
        Monthly Revenue Trend
      </h3>
      <div className="flex items-end gap-3 h-40">
        {MONTHLY_REVENUE.map((data, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center gap-2">
            <div className="relative w-full flex justify-center">
              <div
                className="w-full max-w-[40px] bg-blue-500 rounded-t-lg transition-all hover:bg-blue-600"
                style={{ height: `${(data.revenue / maxRevenue) * 120}px` }}
              />
            </div>
            <span className="text-xs text-slate-500">{data.month}</span>
            <span className="text-[10px] font-semibold text-slate-700">${data.revenue}</span>
          </div>
        ))}
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

// Missing imports
import { X } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function BillingPage() {
  const [schoolsData, setSchoolsData] = useState(SCHOOLS_BILLING);
  const [invoices, setInvoices] = useState(INVOICES);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [planFilter, setPlanFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [invoicePage, setInvoicePage] = useState(1);
  const [showPlanEditor, setShowPlanEditor] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  
  const itemsPerPage = 6;
  const invoicesPerPage = 5;
  
  // Stats
  const stats = useMemo(() => {
    const totalRevenue = schoolsData.reduce((sum, s) => {
      if (s.status === 'active') return sum + (s.billingCycle === 'yearly' ? s.amount / 12 : s.amount);
      return sum;
    }, 0);
    const activeSubscriptions = schoolsData.filter(s => s.status === 'active').length;
    const pendingInvoices = invoices.filter(i => i.status === 'pending').length;
    const mrr = totalRevenue;
    return { totalRevenue: Math.round(totalRevenue), activeSubscriptions, pendingInvoices, mrr };
  }, [schoolsData, invoices]);
  
  // Filter schools
  useEffect(() => {
    let result = [...schoolsData];
    if (searchTerm) {
      result = result.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (planFilter !== 'all') {
      result = result.filter(s => s.plan === planFilter);
    }
    if (statusFilter !== 'all') {
      result = result.filter(s => s.status === statusFilter);
    }
    setFilteredSchools(result);
    setCurrentPage(1);
  }, [searchTerm, planFilter, statusFilter, schoolsData]);
  
  // Filter invoices
  useEffect(() => {
    let result = [...invoices];
    if (searchTerm) {
      result = result.filter(i => i.school.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    setFilteredInvoices(result);
    setInvoicePage(1);
  }, [searchTerm, invoices]);
  
  const paginatedSchools = filteredSchools.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const paginatedInvoices = filteredInvoices.slice((invoicePage - 1) * invoicesPerPage, invoicePage * invoicesPerPage);
  const totalSchoolPages = Math.ceil(filteredSchools.length / itemsPerPage);
  const totalInvoicePages = Math.ceil(filteredInvoices.length / invoicesPerPage);
  
  const handleExport = () => {
    console.log('Export billing data');
  };
  
  const handleEditPlan = (plan) => {
    setEditingPlan(plan);
    setShowPlanEditor(true);
  };
  
  const handleSavePlan = (planData) => {
    console.log('Save plan:', planData);
    // In real app, API call here
    setShowPlanEditor(false);
    setEditingPlan(null);
  };
  
  const handleDownloadInvoice = (invoiceId) => {
    console.log('Download invoice:', invoiceId);
  };
  
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-screen-2xl mx-auto p-6 space-y-5">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Billing & Subscriptions</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Manage school subscriptions, invoices, and payment plans
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleEditPlan(null)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-sm font-medium shadow-sm"
            >
              <Plus size={15} />
              Create Plan
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-sm font-medium shadow-sm"
            >
              <Download size={15} />
              Export Report
            </button>
            <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-sm font-medium shadow-sm">
              <RefreshCw size={15} />
              Refresh
            </button>
          </div>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <DollarSign size={20} className="text-emerald-700" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase">Monthly Revenue</p>
              <p className="text-2xl font-bold text-slate-800">${stats.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Users size={20} className="text-blue-700" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase">Active Subscriptions</p>
              <p className="text-2xl font-bold text-slate-800">{stats.activeSubscriptions}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Receipt size={20} className="text-amber-700" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase">Pending Invoices</p>
              <p className="text-2xl font-bold text-slate-800">{stats.pendingInvoices}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <TrendingUp size={20} className="text-purple-700" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase">MRR</p>
              <p className="text-2xl font-bold text-slate-800">${stats.mrr.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        {/* Revenue Chart & Plans Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <RevenueChart />
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <PieChart size={15} className="text-blue-600" />
              Plans Distribution
            </h3>
            <div className="space-y-2.5">
              {PLANS.map(plan => {
                const count = schoolsData.filter(s => s.plan === plan.id && s.status === 'active').length;
                const percentage = stats.activeSubscriptions ? (count / stats.activeSubscriptions * 100).toFixed(0) : 0;
                return (
                  <div key={plan.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600">{plan.name}</span>
                      <span className="text-slate-800 font-semibold">{count} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className={cn('h-2 rounded-full', {
                          'bg-slate-500': plan.id === 'free',
                          'bg-blue-500': plan.id === 'basic',
                          'bg-purple-500': plan.id === 'pro',
                          'bg-amber-500': plan.id === 'enterprise',
                        })}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Schools Billing Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Building size={18} className="text-slate-500" />
              <h2 className="font-semibold text-slate-800">School Subscriptions</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search school..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-3 py-1.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                className="px-3 py-1.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Plans</option>
                {PLANS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="past_due">Past Due</option>
                <option value="trial">Trial</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase">School</th>
                  <th className="text-left py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase">Plan</th>
                  <th className="text-left py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                  <th className="text-left py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase">Amount</th>
                  <th className="text-left py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase">Next Billing</th>
                  <th className="text-left py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase">Students</th>
                  <th className="text-center py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedSchools.map((school) => (
                  <tr key={school.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4">
                      <p className="text-sm font-medium text-slate-800">{school.name}</p>
                      <p className="text-xs text-slate-400">{school.id}</p>
                    </td>
                    <td className="py-3 px-4"><PlanBadge planId={school.plan} /></td>
                    <td className="py-3 px-4">
                      <span className={cn('inline-flex px-2 py-0.5 rounded-full text-xs font-medium', {
                        'bg-emerald-100 text-emerald-800': school.status === 'active',
                        'bg-amber-100 text-amber-800': school.status === 'past_due',
                        'bg-blue-100 text-blue-800': school.status === 'trial',
                        'bg-slate-100 text-slate-600': school.status === 'cancelled',
                      })}>
                        {school.status === 'past_due' ? 'Past Due' : school.status.charAt(0).toUpperCase() + school.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm font-semibold text-slate-700">${school.amount}</p>
                      <p className="text-[10px] text-slate-400">{school.billingCycle}</p>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">
                      {school.nextBilling ? new Date(school.nextBilling).toLocaleDateString() : '—'}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">{school.students}</td>
                    <td className="py-3 px-4 text-center">
                      <button className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50">
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {paginatedSchools.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No schools match the filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {filteredSchools.length > 0 && (
            <Pagination currentPage={currentPage} totalPages={totalSchoolPages} onPageChange={setCurrentPage} />
          )}
        </div>
        
        {/* Invoices Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
              <FileText size={18} className="text-slate-500" />
              Recent Invoices
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase">Invoice ID</th>
                  <th className="text-left py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase">School</th>
                  <th className="text-left py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase">Amount</th>
                  <th className="text-left py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                  <th className="text-left py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase">Date</th>
                  <th className="text-left py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase">Due Date</th>
                  <th className="text-center py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 text-sm font-mono text-slate-600">{invoice.id}</td>
                    <td className="py-3 px-4 text-sm text-slate-800">{invoice.school}</td>
                    <td className="py-3 px-4 text-sm font-semibold text-slate-700">${invoice.amount}</td>
                    <td className="py-3 px-4"><PaymentStatusBadge status={invoice.status} /></td>
                    <td className="py-3 px-4 text-sm text-slate-600">{new Date(invoice.date).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-sm text-slate-600">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => handleDownloadInvoice(invoice.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600" title="Download">
                          <Download size={15} />
                        </button>
                        <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700" title="View">
                          <Eye size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginatedInvoices.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">No invoices found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {filteredInvoices.length > 0 && (
            <Pagination currentPage={invoicePage} totalPages={totalInvoicePages} onPageChange={setInvoicePage} />
          )}
        </div>
        
        {/* Plans Overview Footer */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <CreditCard size={16} className="text-slate-400" />
              <span className="text-sm text-slate-500">Payment gateway: Stripe</span>
            </div>
            <div className="flex gap-2">
              {PLANS.map(plan => (
                <button
                  key={plan.id}
                  onClick={() => handleEditPlan(plan)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  <Edit2 size={12} />
                  Edit {plan.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Plan Editor Modal */}
      <PlanEditorModal
        isOpen={showPlanEditor}
        onClose={() => { setShowPlanEditor(false); setEditingPlan(null); }}
        onSave={handleSavePlan}
        plan={editingPlan}
      />
    </div>
  );
}