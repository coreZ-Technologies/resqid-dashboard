'use client';

import { useState, useEffect } from 'react';
import {
  Settings, Globe, Shield, Bell, Database, Mail, Smartphone,
  Lock, Users, Activity, Save, RefreshCw, AlertCircle,
  CheckCircle, Loader2, Eye, EyeOff, ToggleLeft, ToggleRight,
  Moon, Sun, Monitor, Building, CreditCard, FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function SettingSection({ title, description, icon: Icon, children, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center">
            <Icon size={18} className="text-blue-700" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-800">{title}</h2>
            <p className="text-sm text-slate-500 mt-0.5">{description}</p>
          </div>
        </div>
        <div className="text-slate-400">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>
      {isOpen && <div className="border-t border-slate-100 p-5">{children}</div>}
    </div>
  );
}

function Toggle({ label, description, enabled, onChange }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
      <div>
        <p className="text-sm font-medium text-slate-700">{label}</p>
        {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={cn(
          'relative w-11 h-6 rounded-full transition-colors',
          enabled ? 'bg-blue-600' : 'bg-slate-300'
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform shadow-sm',
            enabled ? 'translate-x-5' : 'translate-x-0.5'
          )}
        />
      </button>
    </div>
  );
}

function TextInput({ label, value, onChange, placeholder, type = 'text', help }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {help && <p className="text-xs text-slate-400">{help}</p>}
    </div>
  );
}

function Select({ label, value, onChange, options, help }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {help && <p className="text-xs text-slate-400">{help}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // General settings
  const [platformName, setPlatformName] = useState('ResQID');
  const [platformUrl, setPlatformUrl] = useState('https://resqid.com');
  const [supportEmail, setSupportEmail] = useState('support@resqid.com');
  const [timezone, setTimezone] = useState('America/New_York');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  
  // Security settings
  const [mfaRequired, setMfaRequired] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('60');
  const [passwordPolicy, setPasswordPolicy] = useState('strong');
  const [ipWhitelist, setIpWhitelist] = useState('');
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [alertDigest, setAlertDigest] = useState('daily');
  
  // System settings
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [logRetention, setLogRetention] = useState('90');
  const [autoBackup, setAutoBackup] = useState(true);
  
  // Appearance
  const [theme, setTheme] = useState('light');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  useEffect(() => {
    // Simulate loading settings from API
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  }, []);
  
  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setSaveSuccess(true);
    setSaving(false);
    setTimeout(() => setSaveSuccess(false), 3000);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-slate-500">Loading settings...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto p-6 space-y-5">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Settings</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Configure platform settings, security, and preferences
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-sm font-medium shadow-sm disabled:opacity-50"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
        
        {/* Save success message */}
        {saveSuccess && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm">
            <CheckCircle size={16} />
            Settings saved successfully!
          </div>
        )}
        
        {/* Settings Sections */}
        <div className="space-y-4">
          {/* General */}
          <SettingSection title="General Settings" description="Platform name, URLs, and regional settings" icon={Globe}>
            <div className="space-y-4">
              <TextInput label="Platform Name" value={platformName} onChange={setPlatformName} placeholder="ResQID" />
              <TextInput label="Platform URL" value={platformUrl} onChange={setPlatformUrl} placeholder="https://..." />
              <TextInput label="Support Email" value={supportEmail} onChange={setSupportEmail} placeholder="support@..." />
              <Select
                label="Default Timezone"
                value={timezone}
                onChange={setTimezone}
                options={[
                  { value: 'America/New_York', label: 'Eastern Time (ET)' },
                  { value: 'America/Chicago', label: 'Central Time (CT)' },
                  { value: 'America/Denver', label: 'Mountain Time (MT)' },
                  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
                  { value: 'UTC', label: 'UTC' },
                ]}
              />
              <Select
                label="Date Format"
                value={dateFormat}
                onChange={setDateFormat}
                options={[
                  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
                ]}
              />
            </div>
          </SettingSection>
          
          {/* Security */}
          <SettingSection title="Security" description="Authentication, session, and access controls" icon={Shield}>
            <div className="space-y-4">
              <Toggle
                label="Require Multi-Factor Authentication (MFA)"
                description="All admin users must set up MFA"
                enabled={mfaRequired}
                onChange={setMfaRequired}
              />
              <Select
                label="Session Timeout (minutes)"
                value={sessionTimeout}
                onChange={setSessionTimeout}
                options={[
                  { value: '15', label: '15 minutes' },
                  { value: '30', label: '30 minutes' },
                  { value: '60', label: '1 hour' },
                  { value: '120', label: '2 hours' },
                  { value: '480', label: '8 hours' },
                ]}
              />
              <Select
                label="Password Policy"
                value={passwordPolicy}
                onChange={setPasswordPolicy}
                options={[
                  { value: 'weak', label: 'Weak (minimum 6 characters)' },
                  { value: 'medium', label: 'Medium (8 chars, 1 number)' },
                  { value: 'strong', label: 'Strong (12 chars, uppercase, number, symbol)' },
                ]}
              />
              <TextInput
                label="IP Whitelist (one per line)"
                value={ipWhitelist}
                onChange={setIpWhitelist}
                placeholder="192.168.1.1&#10;10.0.0.0/24"
                type="textarea"
                help="Leave empty to allow all IPs"
              />
            </div>
          </SettingSection>
          
          {/* Notifications */}
          <SettingSection title="Notification Settings" description="Email, push, and SMS alerts" icon={Bell}>
            <div className="space-y-4">
              <Toggle
                label="Email Notifications"
                description="Send system alerts via email"
                enabled={emailNotifications}
                onChange={setEmailNotifications}
              />
              <Toggle
                label="Push Notifications"
                description="Send browser push notifications"
                enabled={pushNotifications}
                onChange={setPushNotifications}
              />
              <Toggle
                label="SMS Alerts"
                description="Send critical alerts via SMS"
                enabled={smsAlerts}
                onChange={setSmsAlerts}
              />
              <Select
                label="Alert Digest Frequency"
                value={alertDigest}
                onChange={setAlertDigest}
                options={[
                  { value: 'realtime', label: 'Real-time' },
                  { value: 'hourly', label: 'Hourly' },
                  { value: 'daily', label: 'Daily' },
                  { value: 'weekly', label: 'Weekly' },
                ]}
              />
            </div>
          </SettingSection>
          
          {/* System */}
          <SettingSection title="System Settings" description="Maintenance, logging, and backups" icon={Database}>
            <div className="space-y-4">
              <Toggle
                label="Maintenance Mode"
                description="Put platform in read-only mode for maintenance"
                enabled={maintenanceMode}
                onChange={setMaintenanceMode}
              />
              <Toggle
                label="Debug Mode"
                description="Enable verbose logging (only for troubleshooting)"
                enabled={debugMode}
                onChange={setDebugMode}
              />
              <Select
                label="Log Retention (days)"
                value={logRetention}
                onChange={setLogRetention}
                options={[
                  { value: '30', label: '30 days' },
                  { value: '60', label: '60 days' },
                  { value: '90', label: '90 days' },
                  { value: '180', label: '180 days' },
                  { value: '365', label: '1 year' },
                ]}
              />
              <Toggle
                label="Automatic Daily Backups"
                description="Backup database and files every day"
                enabled={autoBackup}
                onChange={setAutoBackup}
              />
            </div>
          </SettingSection>
          
          {/* Appearance */}
          <SettingSection title="Appearance" description="Theme and layout preferences" icon={Monitor}>
            <div className="space-y-4">
              <Select
                label="Theme"
                value={theme}
                onChange={setTheme}
                options={[
                  { value: 'light', label: 'Light' },
                  { value: 'dark', label: 'Dark' },
                  { value: 'system', label: 'System' },
                ]}
              />
              <Toggle
                label="Collapsed Sidebar by Default"
                description="Start with collapsed navigation"
                enabled={sidebarCollapsed}
                onChange={setSidebarCollapsed}
              />
            </div>
          </SettingSection>
        </div>
        
        {/* Danger Zone */}
        <div className="bg-white rounded-2xl border border-red-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-red-100 bg-red-50/30">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle size={18} />
              <h2 className="font-semibold">Danger Zone</h2>
            </div>
            <p className="text-sm text-red-600 mt-1">Irreversible actions</p>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-700">Clear All Logs</p>
                <p className="text-xs text-slate-400">Remove all activity and notification logs</p>
              </div>
              <button className="px-3 py-1.5 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 text-sm">
                Clear Logs
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-700">Reset All Settings</p>
                <p className="text-xs text-slate-400">Restore default configuration</p>
              </div>
              <button className="px-3 py-1.5 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 text-sm">
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Missing icons
import { ChevronUp, ChevronDown } from 'lucide-react';