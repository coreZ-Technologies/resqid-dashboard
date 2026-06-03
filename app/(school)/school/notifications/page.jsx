// app/(school)/school/notifications/page.jsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Bell, Send, Mail, Smartphone, Users, Filter, Search,
  CheckCircle, XCircle, Clock, Eye, Trash2, RefreshCw,
  MessageSquare, TrendingUp, Download, Calendar, Plus,
  ChevronLeft, ChevronRight, MoreVertical, Copy, Share2,
  BarChart3, PieChart, AlertCircle, Globe, Zap, Settings,
  UserCheck, UserX, Loader2, FilterX, Check, X, Edit2, User,
  Megaphone, GraduationCap, BookOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationRead,
  markAllNotificationsRead,
  getNotificationPreferences,
  updateNotificationPreferences
} from '@/lib/api';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const NOTIFICATION_TYPES = {
  ANNOUNCEMENT: { label: 'Announcement', color: 'blue', icon: Megaphone },
  EMERGENCY: { label: 'Emergency', color: 'red', icon: AlertCircle },
  REMINDER: { label: 'Reminder', color: 'amber', icon: Clock },
  EVENT: { label: 'Event', color: 'purple', icon: Calendar },
  ATTENDANCE: { label: 'Attendance', color: 'green', icon: CheckCircle },
  GENERAL: { label: 'General', color: 'slate', icon: MessageSquare }
};

const CHANNELS = [
  { id: 'email', label: 'Email', icon: Mail, color: 'blue' },
  { id: 'sms', label: 'SMS', icon: Smartphone, color: 'green' },
  { id: 'push', label: 'Push Notification', icon: Bell, color: 'purple' },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare, color: 'emerald' }
];

const RECIPIENT_TYPES = [
  { id: 'all', label: 'All Parents', icon: Users, count: 847 },
  { id: 'class', label: 'Specific Class', icon: GraduationCap, count: 0 },
  { id: 'section', label: 'Specific Section', icon: BookOpen, count: 0 },
  { id: 'individual', label: 'Individual Parents', icon: User, count: 0 }
];

const CLASSES = [
  'Nursery', 'LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'
];

const SECTIONS = ['A', 'B', 'C', 'D'];

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function StatCard({ title, value, icon: Icon, color, trend }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", color)}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
            <TrendingUp size={12} />
            <span>{trend}%</span>
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
      <p className="text-sm text-slate-500 mt-1">{title}</p>
    </div>
  );
}

function NotificationCard({ notification, onView, onDelete, onResend }) {
  const typeConfig = NOTIFICATION_TYPES[notification.type];
  const TypeIcon = typeConfig?.icon || MessageSquare;
  const channelConfig = CHANNELS.find(c => c.id === notification.channel);
  const ChannelIcon = channelConfig?.icon || Bell;

  const statusConfig = {
    sent: { label: 'Sent', color: 'bg-blue-100 text-blue-700', icon: Send },
    delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700', icon: CheckCircle },
    read: { label: 'Read', color: 'bg-emerald-100 text-emerald-700', icon: Eye },
    failed: { label: 'Failed', color: 'bg-red-100 text-red-700', icon: XCircle }
  };

  const StatusIcon = statusConfig[notification.status]?.icon || Send;

  const deliveryRate = ((notification.recipients?.delivered || 0) / (notification.recipients?.total || 1) * 100).toFixed(1);
  const readRate = ((notification.recipients?.read || 0) / (notification.recipients?.total || 1) * 100).toFixed(1);

  return (
    <div className="bg-white border border-slate-200 rounded-xl hover:shadow-md transition-all">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center",
              typeConfig?.color === 'blue' && "bg-blue-100",
              typeConfig?.color === 'red' && "bg-red-100",
              typeConfig?.color === 'amber' && "bg-amber-100",
              typeConfig?.color === 'purple' && "bg-purple-100",
              typeConfig?.color === 'green' && "bg-green-100")}>
              <TypeIcon className={cn("w-4 h-4",
                typeConfig?.color === 'blue' && "text-blue-600",
                typeConfig?.color === 'red' && "text-red-600",
                typeConfig?.color === 'amber' && "text-amber-600",
                typeConfig?.color === 'purple' && "text-purple-600",
                typeConfig?.color === 'green' && "text-green-600")} />
            </div>
            <div>
              <p className="font-semibold text-slate-800">{notification.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium", statusConfig[notification.status]?.color)}>
                  <StatusIcon size={10} />
                  {statusConfig[notification.status]?.label}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs">
                  <ChannelIcon size={10} />
                  {channelConfig?.label}
                </span>
                {notification.priority === 'high' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs">
                    <AlertCircle size={10} />
                    High Priority
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button onClick={() => onView(notification)} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors" title="View Details">
              <Eye size={16} className="text-slate-500" />
            </button>
            <button onClick={() => onResend(notification)} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors" title="Resend">
              <RefreshCw size={16} className="text-slate-500" />
            </button>
            <button onClick={() => onDelete(notification)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors" title="Delete">
              <Trash2 size={16} className="text-slate-500 hover:text-red-600" />
            </button>
          </div>
        </div>

        {/* Message Preview */}
        <p className="text-sm text-slate-600 mb-3 line-clamp-2">{notification.message || notification.body}</p>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 mb-3 p-3 bg-slate-50 rounded-lg">
          <div className="text-center">
            <p className="text-lg font-bold text-slate-800">{notification.recipients?.total || 0}</p>
            <p className="text-xs text-slate-500">Recipients</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-green-600">{notification.recipients?.delivered || 0}</p>
            <p className="text-xs text-slate-500">Delivered</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-blue-600">{notification.recipients?.read || 0}</p>
            <p className="text-xs text-slate-500">Read</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-red-600">{notification.recipients?.failed || 0}</p>
            <p className="text-xs text-slate-500">Failed</p>
          </div>
        </div>

        {/* Delivery Rate Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>Delivery Rate: {deliveryRate}%</span>
            <span>Read Rate: {readRate}%</span>
          </div>
          <div className="flex gap-1">
            <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${deliveryRate}%` }} />
            </div>
            <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${readRate}%` }} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Clock size={12} />
            <span>Sent by {notification.sentBy || 'System'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={12} />
            <span>{new Date(notification.sentAt || notification.createdAt).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SendNotificationModal({ isOpen, onClose, onSend }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'GENERAL',
    channel: ['email', 'push'],
    recipientType: 'all',
    selectedClass: '',
    selectedSection: '',
    selectedParents: [],
    scheduleLater: false,
    scheduledTime: '',
    priority: 'normal',
    attachments: []
  });
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    setSending(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    onSend(formData);
    setSending(false);
    handleClose();
  };

  const handleClose = () => {
    setStep(1);
    setFormData({
      title: '',
      message: '',
      type: 'GENERAL',
      channel: ['email', 'push'],
      recipientType: 'all',
      selectedClass: '',
      selectedSection: '',
      selectedParents: [],
      scheduleLater: false,
      scheduledTime: '',
      priority: 'normal',
      attachments: []
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-slate-800">Send Notification</h2>
          </div>
          <button onClick={handleClose} className="p-1 rounded-lg hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                  step >= s ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500"
                )}>
                  {s}
                </div>
                {s < 3 && (
                  <div className={cn(
                    "flex-1 h-0.5 mx-2",
                    step > s ? "bg-blue-600" : "bg-slate-200"
                  )} />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Message Content */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Notification Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(NOTIFICATION_TYPES).map(([key, config]) => {
                    const Icon = config.icon;
                    return (
                      <button
                        key={key}
                        onClick={() => setFormData({ ...formData, type: key })}
                        className={cn(
                          "flex items-center gap-2 p-2 rounded-lg border transition-all",
                          formData.type === key
                            ? "border-blue-400 bg-blue-50 text-blue-700"
                            : "border-slate-200 hover:bg-slate-50"
                        )}
                      >
                        <Icon size={14} />
                        <span className="text-sm">{config.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  placeholder="Enter notification title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none"
                  placeholder="Type your message here..."
                />
                <p className="text-xs text-slate-400 mt-1">{formData.message.length} characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFormData({ ...formData, priority: 'normal' })}
                    className={cn(
                      "flex-1 py-2 rounded-lg border text-sm font-medium transition-all",
                      formData.priority === 'normal'
                        ? "border-blue-400 bg-blue-50 text-blue-700"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    Normal
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, priority: 'high' })}
                    className={cn(
                      "flex-1 py-2 rounded-lg border text-sm font-medium transition-all",
                      formData.priority === 'high'
                        ? "border-red-400 bg-red-50 text-red-700"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    High Priority
                  </button>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!formData.title || !formData.message}
                className="w-full py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Continue to Recipients →
              </button>
            </div>
          )}

          {/* Step 2: Select Recipients */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Send to</label>
                <div className="space-y-2">
                  {RECIPIENT_TYPES.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setFormData({ ...formData, recipientType: type.id })}
                        className={cn(
                          "w-full flex items-center justify-between p-3 rounded-lg border transition-all",
                          formData.recipientType === type.id
                            ? "border-blue-400 bg-blue-50"
                            : "border-slate-200 hover:bg-slate-50"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                            <Icon size={16} className="text-slate-600" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium text-slate-800">{type.label}</p>
                            <p className="text-xs text-slate-400">{type.count} recipients</p>
                          </div>
                        </div>
                        {formData.recipientType === type.id && (
                          <Check size={16} className="text-blue-600" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {formData.recipientType === 'class' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Select Class</label>
                    <select
                      value={formData.selectedClass}
                      onChange={(e) => setFormData({ ...formData, selectedClass: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200"
                    >
                      <option value="">Select Class</option>
                      {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Select Section</label>
                    <select
                      value={formData.selectedSection}
                      onChange={(e) => setFormData({ ...formData, selectedSection: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200"
                    >
                      <option value="">All Sections</option>
                      {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Send via</label>
                <div className="grid grid-cols-2 gap-2">
                  {CHANNELS.map((channel) => {
                    const Icon = channel.icon;
                    const isSelected = formData.channel.includes(channel.id);
                    return (
                      <button
                        key={channel.id}
                        onClick={() => {
                          if (isSelected) {
                            setFormData({ ...formData, channel: formData.channel.filter(c => c !== channel.id) });
                          } else {
                            setFormData({ ...formData, channel: [...formData.channel, channel.id] });
                          }
                        }}
                        className={cn(
                          "flex items-center gap-2 p-2 rounded-lg border transition-all",
                          isSelected
                            ? "border-blue-400 bg-blue-50 text-blue-700"
                            : "border-slate-200 hover:bg-slate-50"
                        )}
                      >
                        <Icon size={14} />
                        <span className="text-sm">{channel.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-slate-700">Schedule for later</p>
                  <p className="text-xs text-slate-400">Send notification at a specific time</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.scheduleLater}
                    onChange={(e) => setFormData({ ...formData, scheduleLater: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                </label>
              </div>

              {formData.scheduleLater && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Schedule Date & Time</label>
                  <input
                    type="datetime-local"
                    value={formData.scheduledTime}
                    onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200"
                  />
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-2 rounded-lg border border-slate-200 text-slate-600 font-medium hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={formData.channel.length === 0}
                  className="flex-1 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Review & Send →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review & Send */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm font-medium text-slate-700 mb-2">Notification Preview</p>
                <div className="bg-white rounded-lg p-3 border border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={cn("w-6 h-6 rounded flex items-center justify-center", formData.type === 'EMERGENCY' ? "bg-red-100" : "bg-blue-100")}>
                      {formData.type === 'EMERGENCY' ? <AlertCircle size={12} className="text-red-600" /> : <Bell size={12} className="text-blue-600" />}
                    </div>
                    <p className="font-semibold text-slate-800">{formData.title}</p>
                  </div>
                  <p className="text-sm text-slate-600">{formData.message}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-500">Recipients</span>
                  <span className="text-sm font-medium text-slate-700">
                    {RECIPIENT_TYPES.find(t => t.id === formData.recipientType)?.label}
                    {formData.selectedClass && ` - Class ${formData.selectedClass}`}
                    {formData.selectedSection && `-${formData.selectedSection}`}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-500">Channels</span>
                  <span className="text-sm font-medium text-slate-700">
                    {formData.channel.map(c => CHANNELS.find(ch => ch.id === c)?.label).join(', ')}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-500">Priority</span>
                  <span className={cn("text-sm font-medium", formData.priority === 'high' ? "text-red-600" : "text-slate-700")}>
                    {formData.priority.toUpperCase()}
                  </span>
                </div>
                {formData.scheduleLater && (
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-slate-500">Scheduled For</span>
                    <span className="text-sm font-medium text-slate-700">
                      {new Date(formData.scheduledTime).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-2 rounded-lg border border-slate-200 text-slate-600 font-medium hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={sending}
                  className="flex-1 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  {sending ? 'Sending...' : formData.scheduleLater ? 'Schedule Notification' : 'Send Now'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NotificationDetailsModal({ isOpen, onClose, notification }) {
  if (!isOpen || !notification) return null;

  const typeConfig = NOTIFICATION_TYPES[notification.type];
  const TypeIcon = typeConfig?.icon || MessageSquare;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-slate-800">Notification Details</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="flex items-start gap-3">
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", typeConfig?.color === 'blue' && "bg-blue-100", typeConfig?.color === 'red' && "bg-red-100")}>
              <TypeIcon className={cn("w-6 h-6", typeConfig?.color === 'blue' && "text-blue-600", typeConfig?.color === 'red' && "text-red-600")} />
            </div>
            <div className="flex-1">
              <p className="text-xl font-bold text-slate-800">{notification.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-slate-500">{new Date(notification.sentAt || notification.createdAt).toLocaleString()}</span>
                <span className="text-sm text-slate-400">•</span>
                <span className="text-sm text-slate-500">Sent by {notification.sentBy || 'System'}</span>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-sm font-medium text-slate-700 mb-2">Message</p>
            <p className="text-slate-600">{notification.message || notification.body}</p>
          </div>

          {/* Delivery Stats */}
          <div>
            <p className="text-sm font-medium text-slate-700 mb-3">Delivery Statistics</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-green-50 rounded-lg text-center">
                <p className="text-2xl font-bold text-green-600">{notification.recipients?.delivered || 0}</p>
                <p className="text-xs text-slate-500">Delivered</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-600">{notification.recipients?.read || 0}</p>
                <p className="text-xs text-slate-500">Read</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg text-center">
                <p className="text-2xl font-bold text-red-600">{notification.recipients?.failed || 0}</p>
                <p className="text-xs text-slate-500">Failed</p>
              </div>
              <div className="p-3 bg-slate-100 rounded-lg text-center">
                <p className="text-2xl font-bold text-slate-600">{notification.recipients?.total || 0}</p>
                <p className="text-xs text-slate-500">Total Recipients</p>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="space-y-2 p-4 bg-slate-50 rounded-lg">
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Channel</span>
              <span className="text-sm font-medium text-slate-700">{CHANNELS.find(c => c.id === notification.channel)?.label}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Status</span>
              <span className="text-sm font-medium text-slate-700 capitalize">{notification.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Priority</span>
              <span className="text-sm font-medium text-slate-700 capitalize">{notification.priority}</span>
            </div>
            {notification.scheduledFor && (
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Scheduled For</span>
                <span className="text-sm font-medium text-slate-700">{new Date(notification.scheduledFor).toLocaleString()}</span>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-full py-2 rounded-lg bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE COMPONENT (using real API)
// ─────────────────────────────────────────────────────────────────────────────

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // Stats
  const [stats, setStats] = useState({
    totalSent: 0,
    totalDelivered: 0,
    totalRead: 0,
    avgOpenRate: 0
  });

  // Fetch notifications from backend
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getNotifications({ page: currentPage, limit: itemsPerPage });
      // Backend returns: { data: [...], meta: { total, page, limit, totalPages } }
      const data = response.data || response.notifications || [];
      setNotifications(data);
      setFilteredNotifications(data);
      setTotalPages(response.meta?.totalPages || 1);

      // Calculate stats from real data
      const totalSent = data.reduce((sum, n) => sum + (n.recipients?.total || 0), 0);
      const totalDelivered = data.reduce((sum, n) => sum + (n.recipients?.delivered || 0), 0);
      const totalRead = data.reduce((sum, n) => sum + (n.recipients?.read || 0), 0);
      const avgOpenRate = totalDelivered > 0 ? ((totalRead / totalDelivered) * 100).toFixed(1) : 0;
      setStats({ totalSent, totalDelivered, totalRead, avgOpenRate });
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Apply filters (client-side)
  useEffect(() => {
    let filtered = [...notifications];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(n => n.title?.toLowerCase().includes(q) || (n.message || n.body)?.toLowerCase().includes(q));
    }
    if (selectedType) filtered = filtered.filter(n => n.type === selectedType);
    if (selectedStatus) filtered = filtered.filter(n => n.status === selectedStatus);
    if (dateRange.start) filtered = filtered.filter(n => new Date(n.sentAt || n.createdAt) >= new Date(dateRange.start));
    if (dateRange.end) filtered = filtered.filter(n => new Date(n.sentAt || n.createdAt) <= new Date(dateRange.end));
    setFilteredNotifications(filtered);
    setCurrentPage(1);
  }, [searchQuery, selectedType, selectedStatus, dateRange, notifications]);

  // Pagination (client-side after filter)
  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const clientTotalPages = Math.ceil(filteredNotifications.length / itemsPerPage);

  // Actions
  const handleSendNotification = (data) => {
    // TODO: Replace with actual API call to send notification
    console.log('Send notification:', data);
    alert('Send notification API not yet implemented. Check console.');
  };

  const handleViewDetails = (notification) => {
    setSelectedNotification(notification);
    setIsDetailsModalOpen(true);
  };

  const handleResend = async (notification) => {
    // TODO: Implement resend API endpoint
    console.log('Resend:', notification);
  };

  const handleDelete = async (notification) => {
    if (confirm(`Delete notification "${notification.title}"?`)) {
      // TODO: Implement delete API endpoint
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedType('');
    setSelectedStatus('');
    setDateRange({ start: '', end: '' });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-1">Notifications</h1>
            <p className="text-slate-500">Manage and send notifications to parents</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => markAllNotificationsRead().then(fetchNotifications)}
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              Mark all as read
            </button>
            <button
              onClick={() => setIsSendModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              <Plus size={18} />
              Send Notification
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard title="Total Sent" value={stats.totalSent.toLocaleString()} icon={Send} color="bg-blue-600" trend="+12" />
          <StatCard title="Delivered" value={stats.totalDelivered.toLocaleString()} icon={CheckCircle} color="bg-green-600" trend="+8" />
          <StatCard title="Read" value={stats.totalRead.toLocaleString()} icon={Eye} color="bg-purple-600" trend="+15" />
          <StatCard title="Open Rate" value={`${stats.avgOpenRate}%`} icon={TrendingUp} color="bg-amber-600" />
        </div>

        {/* Filters Bar */}
        <div className="bg-white rounded-xl border border-slate-200 mb-6">
          <div className="p-4 border-b border-slate-200">
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search notifications..."
                    className="w-full pl-9 pr-4 h-10 rounded-lg border border-slate-200 text-sm"
                  />
                </div>
              </div>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 h-10 rounded-lg border border-slate-200 text-sm"
              >
                <option value="">All Types</option>
                {Object.entries(NOTIFICATION_TYPES).map(([key, config]) => (
                  <option key={key} value={key}>{config.label}</option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 h-10 rounded-lg border border-slate-200 text-sm"
              >
                <option value="">All Status</option>
                <option value="sent">Sent</option>
                <option value="delivered">Delivered</option>
                <option value="read">Read</option>
                <option value="failed">Failed</option>
              </select>

              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="px-3 h-10 rounded-lg border border-slate-200 text-sm w-36"
                placeholder="From"
              />

              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="px-3 h-10 rounded-lg border border-slate-200 text-sm w-36"
                placeholder="To"
              />

              {(selectedType || selectedStatus || dateRange.start || dateRange.end || searchQuery) && (
                <button
                  onClick={handleClearFilters}
                  className="flex items-center gap-2 px-3 h-10 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50"
                >
                  <FilterX size={14} />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Results Count */}
          <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 text-sm text-slate-500">
            Found {filteredNotifications.length} notifications
          </div>

          {/* Notifications List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : paginatedNotifications.length === 0 ? (
            <div className="py-12 text-center text-slate-500">No notifications found.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {paginatedNotifications.map((notification) => (
                <div key={notification.id} className="p-4">
                  <NotificationCard
                    notification={notification}
                    onView={handleViewDetails}
                    onDelete={handleDelete}
                    onResend={handleResend}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {clientTotalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200">
              <div className="text-sm text-slate-500">
                Page {currentPage} of {clientTotalPages}
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentPage(p => p - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setCurrentPage(p => p + 1)}
                  disabled={currentPage === clientTotalPages}
                  className="p-2 rounded-lg border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <SendNotificationModal
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
        onSend={handleSendNotification}
      />

      <NotificationDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedNotification(null);
        }}
        notification={selectedNotification}
      />
    </div>
  );
}