"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import {
  ArrowLeft, Building2, Users, UserCheck, GraduationCap, Radio,
  Shield, CreditCard, Mail, Phone, MapPin, Edit2, Eye, BookOpen
} from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { MOCK_SCHOOLS } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const QUICK_LINKS = [
  { id: "overview", label: "Overview", icon: Building2 },
  { id: "students", label: "Students", icon: Users, href: "students" },
  { id: "teachers", label: "Teachers", icon: UserCheck, href: "teachers" },
  { id: "classes", label: "Classes", icon: GraduationCap, href: "classes" },
  { id: "subjects", label: "Subjects", icon: BookOpen, href: "subjects" },
  { id: "admins", label: "Admins", icon: Shield, href: "admins" },
  { id: "subscription", label: "Subscription", icon: CreditCard, href: "subscription" },
]

export default function SchoolProfilePage() {
  const router = useRouter()
  const params = useParams()
  const schoolId = params.schoolId

  const [school, setSchool] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      const found = MOCK_SCHOOLS.find(s => s.id === schoolId)
      if (found) setSchool(found)
      setLoading(false)
    }, 400)
  }, [schoolId])

  if (loading) return <div className="max-w-[1300px] mx-auto space-y-6"><div className="h-64 bg-slate-100 rounded-xl animate-pulse" /></div>
  if (!school) return <div className="max-w-[600px] mx-auto text-center py-16"><p className="text-slate-500">School not found</p></div>

  return (
    <div className="max-w-[1300px] mx-auto space-y-6">
      <PageBreadcrumb items={[{ label: "Super Admin", href: "/superadmin" }, { label: "Schools", href: "/superadmin/schools" }, { label: school.name }]} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"><ArrowLeft size={18} /></button>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-xl">
              {school.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </div>
            <div>
              <h1 className="text-[22px] font-bold text-slate-800">{school.name}</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-slate-500">{school.code} · {school.board}</span>
                <StatusBadge status={school.status === "active" ? "active" : "inactive"} size="sm" label={school.status} />
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => router.push(`/superadmin/schools/${school.id}/edit`)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 shadow-sm"><Edit2 size={15} />Edit</button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 shadow-sm"><Eye size={15} />View as School</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Students", value: school.stats.students, icon: Users, color: "bg-blue-500", href: "students" },
          { label: "Teachers", value: school.stats.teachers, icon: UserCheck, color: "bg-violet-500", href: "teachers" },
          { label: "Classes", value: school.stats.classes, icon: GraduationCap, color: "bg-emerald-500", href: "classes" },
          { label: "Parents", value: school.stats.parents, icon: Users, color: "bg-amber-500" },
          { label: "RFID Devices", value: school.stats.devices, icon: Radio, color: "bg-rose-500" },
        ].map(s => (
          <div key={s.label} onClick={() => s.href && router.push(`/superadmin/schools/${school.id}/${s.href}`)}
            className={cn("bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-3", s.href && "cursor-pointer hover:shadow-md transition-all")}>
            <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center`}><s.icon size={18} className="text-white" /></div>
            <div><p className="text-xl font-bold text-slate-800">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* School Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="font-semibold text-slate-800 mb-4">School Information</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                { icon: Building2, label: "Board", value: school.board },
                { icon: Shield, label: "UDISE", value: school.udise },
                { icon: MapPin, label: "City", value: `${school.city}, ${school.state}` },
                { icon: MapPin, label: "Address", value: school.address },
                { icon: Phone, label: "Phone", value: school.phone },
                { icon: Mail, label: "Email", value: school.email },
                { icon: UserCheck, label: "Principal", value: school.principal },
                { icon: Phone, label: "Principal Phone", value: school.principalPhone },
              ].map(r => (
                <div key={r.label} className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center shrink-0"><r.icon size={16} className="text-slate-500" /></div>
                  <div><p className="text-xs text-slate-400 uppercase">{r.label}</p><p className="font-medium text-slate-700">{r.value}</p></div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Modules */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="font-semibold text-slate-800 mb-3">Active Modules</h2>
            <div className="flex flex-wrap gap-2">
              {["emergency", "attendance", "timetable", "communication"].map(m => (
                <span key={m} className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold border capitalize",
                  school.modules.includes(m) ? "bg-violet-50 text-violet-700 border-violet-200" : "bg-slate-50 text-slate-400 border-slate-200")}>
                  {school.modules.includes(m) ? "✓" : "✗"} {m}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* School Admin */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-slate-800">School Admin</h2>
              <button onClick={() => router.push(`/superadmin/schools/${school.id}/admins`)}
                className="text-xs text-violet-500 hover:text-violet-700 font-medium">View All →</button>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-violet-500 flex items-center justify-center text-white font-bold">
                {school.admin.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">{school.admin.name}</p>
                <p className="text-xs text-slate-400">{school.admin.email}</p>
                <p className="text-xs text-slate-400">{school.admin.phone}</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-2">Last login: {school.admin.lastLogin}</p>
          </div>

          {/* Subscription */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h2 className="font-semibold text-slate-800 mb-3 flex items-center gap-2"><CreditCard size={16} className="text-violet-600" />Subscription</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Plan</span><span className="font-semibold">{school.subscription.plan}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Price</span><span className="font-semibold">{school.subscription.price}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Students</span><span className="font-semibold">{school.subscription.studentsUsed}/{school.subscription.studentLimit}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Next Billing</span><span className="font-semibold">{school.subscription.nextBilling}</span></div>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 mt-3 overflow-hidden">
              <div className="h-full bg-violet-500 rounded-full" style={{ width: `${(school.subscription.studentsUsed / school.subscription.studentLimit) * 100}%` }} />
            </div>
            <button onClick={() => router.push(`/superadmin/schools/${school.id}/subscription`)}
              className="w-full mt-4 py-2 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50 transition-colors">Manage Subscription</button>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h2 className="font-semibold text-slate-800 mb-3">Quick Links</h2>
            <div className="space-y-1">
              {QUICK_LINKS.filter(l => l.href).map(link => (
                <button key={link.id} onClick={() => router.push(`/superadmin/schools/${school.id}/${link.href}`)}
                  className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 text-sm text-slate-600 transition-colors">
                  <link.icon size={14} className="text-slate-400" />{link.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}