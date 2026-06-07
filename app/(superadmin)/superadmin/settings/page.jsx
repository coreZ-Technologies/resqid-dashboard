"use client"

import { useState } from "react"
import {
  Settings, Globe, Bell, Shield, Database, Mail, Clock,
  Save, Check
} from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import PageHeader from "@/components/shared/PageHeader"
import { cn } from "@/lib/utils"

function Toggle({ checked, onChange }) {
  return (
    <button role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
      className={cn("relative w-9 h-5 rounded-full transition-colors shrink-0", checked ? "bg-violet-600" : "bg-slate-200")}>
      <span className={cn("absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform", checked && "translate-x-4")} />
    </button>
  )
}

export default function SuperadminSettingsPage() {
  const [saved, setSaved] = useState(false)

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  return (
    <div className="max-w-[900px] mx-auto space-y-6">
      <PageBreadcrumb items={[{ label: "Super Admin", href: "/superadmin" }, { label: "Platform Settings" }]} />
      <PageHeader title="Platform Settings" description="Global configuration for the RESQID platform" />

      {/* General Settings */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-slate-800 flex items-center gap-2"><Globe size={18} className="text-violet-600" />General</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Platform Name</label>
            <input defaultValue="RESQID" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Support Email</label>
            <input defaultValue="support@resqid.com" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Default Language</label>
            <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500 bg-white">
              {["English", "Hindi", "Bengali", "Tamil", "Telugu"].map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Timezone</label>
            <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500 bg-white">
              {["Asia/Kolkata (IST)", "Asia/Dubai", "UTC"].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Notification Defaults */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-slate-800 flex items-center gap-2"><Bell size={18} className="text-violet-600" />Notification Defaults</h2>
        <div className="space-y-3">
          {[
            { label: "Enable SMS notifications", desc: "Schools can send SMS to parents", checked: true },
            { label: "Enable Email notifications", desc: "Schools can send emails to parents", checked: true },
            { label: "Enable Push notifications", desc: "App push notifications for parents", checked: true },
            { label: "Require OTP verification", desc: "Parents must verify phone before receiving alerts", checked: false },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-slate-700">{item.label}</p>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
              <Toggle checked={item.checked} onChange={() => { }} />
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-slate-800 flex items-center gap-2"><Shield size={18} className="text-violet-600" />Security</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Session Timeout (minutes)</label>
            <input type="number" defaultValue="60" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Max Login Attempts</label>
            <input type="number" defaultValue="5" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Password Min Length</label>
            <input type="number" defaultValue="8" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">2FA Required for Admins</label>
            <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500 bg-white">
              {["Yes", "No", "Optional"].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Rate Limits */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-slate-800 flex items-center gap-2"><Database size={18} className="text-violet-600" />API Rate Limits</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Per Minute", value: "100" },
            { label: "Per Hour", value: "1000" },
            { label: "Per Day", value: "10000" },
          ].map(r => (
            <div key={r.label}>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">{r.label}</label>
              <input type="number" defaultValue={r.value} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500" />
            </div>
          ))}
        </div>
      </div>

      {/* Email Templates */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-slate-800 flex items-center gap-2"><Mail size={18} className="text-violet-600" />Email Templates</h2>
        <div className="space-y-3">
          {["Welcome Email", "Password Reset", "Emergency Alert", "Attendance Report"].map(template => (
            <div key={template} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="text-sm font-medium text-slate-700">{template}</span>
              <button className="text-xs text-violet-500 hover:text-violet-700 font-medium">Edit</button>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors">
          {saved ? <><Check size={14} />Saved!</> : <><Save size={14} />Save Settings</>}
        </button>
      </div>
    </div>
  )
}