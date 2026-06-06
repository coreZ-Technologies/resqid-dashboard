"use client"

import { useState } from "react"
import { UserPlus, UserCheck, UsersRound, CalendarCheck, BarChart2, Bell, Lock } from "lucide-react"
import { useRouter } from "next/navigation"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import DashboardKpi from "@/components/modules/dashboard/DashboardKpi"
import AttendanceOverview from "@/components/modules/dashboard/AttendanceOverview"
import WeeklyTrend from "@/components/modules/dashboard/WeeklyTrend"
import RecentActivity from "@/components/modules/dashboard/RecentActivity"
import LowAttendanceAlert from "@/components/modules/dashboard/LowAttendanceAlert"
import TodaySchedule from "@/components/modules/dashboard/TodaySchedule"
import NotificationsPanel from "@/components/modules/dashboard/NotificationsPanel"
import PlanBanner from "@/components/modules/dashboard/PlanBanner"
import { MOCK_ATTENDANCE_TODAY } from "@/lib/mock-data"

const PLAN = "standard"

const MODULES_BY_PLAN = {
  basic: ["students", "teachers"],
  standard: ["students", "teachers", "attendance", "reports"],
  safety_bundle: ["students", "teachers", "attendance", "emergency", "reports"],
  complete: ["students", "teachers", "attendance", "emergency", "timetable", "communication", "reports"],
}

const WEEKLY_TREND = [
  { day: "Mon", pct: 94 }, { day: "Tue", pct: 92 }, { day: "Wed", pct: 95 },
  { day: "Thu", pct: 89 }, { day: "Fri", pct: 92 }, { day: "Sat", pct: 91 },
]

const RECENT_ACTIVITY = [
  { id: 1, name: "Priya Sharma", cls: "8-A", rfid: "RFID-2341", type: "check_in", time: "8:02 AM", avatar: "PS", color: "bg-blue-500" },
  { id: 2, name: "Rohit Dey", cls: "10-A", rfid: "RFID-1891", type: "check_in", time: "8:05 AM", avatar: "RD", color: "bg-emerald-500" },
  { id: 3, name: "Sneha Bose", cls: "7-C", rfid: "RFID-3012", type: "absent", time: "8:45 AM", avatar: "SB", color: "bg-rose-500" },
  { id: 4, name: "Dev Chatterjee", cls: "9-B", rfid: "RFID-4201", type: "late", time: "9:12 AM", avatar: "DC", color: "bg-amber-500" },
]

const LOW_ATTENDANCE = [
  { name: "Sneha Bose", pct: 68, avatar: "SB", color: "bg-rose-500" },
  { name: "Rahul Gupta", pct: 72, avatar: "RG", color: "bg-indigo-500" },
]

const NOTIFICATIONS = [
  { id: 1, type: "alert", msg: "Emergency drill tomorrow 10 AM", time: "1h ago", read: false },
  { id: 2, type: "info", msg: "12 parents have unread notifications", time: "2h ago", read: false },
  { id: 3, type: "warning", msg: "Sneha Bose below 75% attendance", time: "3h ago", read: false },
  { id: 4, type: "success", msg: "May 2026 report is ready", time: "Yesterday", read: true },
]

const TODAY_PERIODS = [
  { period: "P1", time: "8:00–8:45", subject: "Mathematics", teacher: "Mr. S. Kumar", status: "done" },
  { period: "P2", time: "8:45–9:30", subject: "English", teacher: "Ms. P. Nair", status: "done" },
  { period: "P3", time: "9:45–10:30", subject: "Science", teacher: "Mr. A. Das", status: "ongoing" },
  { period: "P4", time: "10:30–11:15", subject: "History", teacher: "Ms. S. Roy", status: "upcoming" },
]

const QUICK_ACTIONS = [
  { icon: UserPlus, label: "Add Student", href: "/school/students/add", color: "bg-sky-500", module: "students" },
  { icon: UserCheck, label: "Add Teacher", href: "/school/teachers/add", color: "bg-violet-500", module: "teachers" },
  { icon: CalendarCheck, label: "Attendance", href: "/school/attendance", color: "bg-amber-500", module: "attendance" },
  { icon: BarChart2, label: "Reports", href: "/school/attendance/reports", color: "bg-indigo-500", module: "reports" },
]

export default function DashboardPage() {
  const router = useRouter()
  const activeModules = MODULES_BY_PLAN[PLAN] || MODULES_BY_PLAN.basic
  const lockedModules = ["emergency", "timetable", "communication"].filter(m => !activeModules.includes(m))
  const lockedLabels = lockedModules.map(m => m === "emergency" ? "Emergency Alerts" : m === "timetable" ? "Timetable" : "Parent Communication")

  const hasModule = (mod) => activeModules.includes(mod)

  const stats = {
    students: 342,
    teachers: 28,
    attendancePct: 91,
    anomalies: hasModule("emergency") ? 3 : 0,
  }

  const totalPresent = MOCK_ATTENDANCE_TODAY.present
  const totalAbsent = MOCK_ATTENDANCE_TODAY.absent

  return (
    <div className="max-w-[1300px] space-y-6">
      <PageBreadcrumb items={[{ label: "Dashboard" }]} />

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-slate-800">Good morning, Animesh 👋</h1>
          <p className="text-[13px] text-slate-500">Springdale Public School · {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-700 font-medium">RFID Live</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <DashboardKpi stats={stats} />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left + Center */}
        <div className="lg:col-span-2 space-y-5">
          {hasModule("attendance") ? (
            <>
              <AttendanceOverview classes={MOCK_ATTENDANCE_TODAY.classes} totalPresent={totalPresent} totalStudents={MOCK_ATTENDANCE_TODAY.totalStudents} totalAbsent={totalAbsent} />
              <div className="grid grid-cols-2 gap-5">
                <WeeklyTrend data={WEEKLY_TREND} />
                <RecentActivity activities={RECENT_ACTIVITY} />
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
              <Lock size={32} className="mx-auto mb-3 text-slate-300" />
              <p className="font-semibold text-slate-600">Attendance Module Locked</p>
              <p className="text-sm text-slate-400 mt-1">Upgrade your plan to unlock attendance tracking</p>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-5">
          {hasModule("timetable") ? (
            <TodaySchedule periods={TODAY_PERIODS} />
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-6 text-center">
              <Lock size={24} className="mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-medium text-slate-500">Timetable Locked</p>
            </div>
          )}

          <LowAttendanceAlert students={LOW_ATTENDANCE} />
          <NotificationsPanel notifications={NOTIFICATIONS} />

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <p className="font-bold text-slate-800 mb-3">Quick Actions</p>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_ACTIONS.filter(a => hasModule(a.module)).map(a => (
                <button key={a.label} onClick={() => router.push(a.href)}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-slate-100 hover:border-violet-200 hover:bg-violet-50/40 transition-all">
                  <div className={`w-9 h-9 rounded-lg ${a.color} flex items-center justify-center`}><a.icon size={14} className="text-white" /></div>
                  <span className="text-[10px] text-slate-600 font-medium text-center">{a.label}</span>
                </button>
              ))}
            </div>
          </div>

          <PlanBanner plan={PLAN} lockedModules={lockedLabels} />
        </div>
      </div>
    </div>
  )
}