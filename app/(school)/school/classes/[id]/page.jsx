"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import {
    ArrowLeft, Users, UserCheck, LayoutGrid, BookOpen,
    Edit2, MessageCircle, Download, Phone, Mail,
    ChevronRight, Clock, CalendarDays, Check, X,
    GraduationCap, DoorOpen, MoreHorizontal
} from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { KpiCard } from "@/components/shared/KpiCard"
import { AvatarWithStatus } from "@/components/shared/Avatar"
import { EmptyState } from "@/components/shared/EmptyState"
import { Skeleton } from "@/components/ui/skeleton"
import { MOCK_CLASSES } from "@/lib/mock-data"
import { GRADE_GROUP_MAP, GROUP_COLORS } from "@/lib/constants"

// ─── Mock Students for a class ────────────────────────────────────────────────
const MOCK_STUDENTS = [
    { id: "s1", name: "Aarav Sharma", rollNo: 1, gender: "Male", attendance: 92, avatar: "AS", avatarColor: "bg-blue-500", status: "present" },
    { id: "s2", name: "Ananya Patel", rollNo: 2, gender: "Female", attendance: 88, avatar: "AP", avatarColor: "bg-pink-500", status: "present" },
    { id: "s3", name: "Arjun Nair", rollNo: 3, gender: "Male", attendance: 76, avatar: "AN", avatarColor: "bg-indigo-500", status: "late" },
    { id: "s4", name: "Diya Reddy", rollNo: 4, gender: "Female", attendance: 95, avatar: "DR", avatarColor: "bg-rose-500", status: "present" },
    { id: "s5", name: "Ishaan Gupta", rollNo: 5, gender: "Male", attendance: 64, avatar: "IG", avatarColor: "bg-amber-500", status: "absent" },
    { id: "s6", name: "Kavya Joshi", rollNo: 6, gender: "Female", attendance: 90, avatar: "KJ", avatarColor: "bg-violet-500", status: "present" },
    { id: "s7", name: "Reyansh Kumar", rollNo: 7, gender: "Male", attendance: 82, avatar: "RK", avatarColor: "bg-emerald-500", status: "present" },
    { id: "s8", name: "Shanaya Das", rollNo: 8, gender: "Female", attendance: 71, avatar: "SD", avatarColor: "bg-orange-500", status: "absent" },
    { id: "s9", name: "Vihaan Mehta", rollNo: 9, gender: "Male", attendance: 98, avatar: "VM", avatarColor: "bg-cyan-500", status: "present" },
    { id: "s10", name: "Zara Khan", rollNo: 10, gender: "Female", attendance: 85, avatar: "ZK", avatarColor: "bg-purple-500", status: "present" },
]

// ─── Recent Activity ──────────────────────────────────────────────────────────
const MOCK_ACTIVITY = [
    { id: 1, type: "attendance", text: "Morning attendance marked — 8 present, 2 absent", time: "8:30 AM", date: "Today" },
    { id: 2, type: "message", text: "Parent notification sent to absentees", time: "8:35 AM", date: "Today" },
    { id: 3, type: "edit", text: "Room changed from R-31 to R-32", time: "Yesterday", date: "Yesterday" },
    { id: 4, type: "student", text: "Reyansh Kumar transferred to this class", time: "2 days ago", date: "2 days ago" },
    { id: 5, type: "message", text: "Monthly progress report shared with parents", time: "1 week ago", date: "1 week ago" },
]

const activityIcons = {
    attendance: Clock,
    message: MessageCircle,
    edit: Edit2,
    student: Users,
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ClassDetailPage() {
    const router = useRouter()
    const params = useParams()
    const classId = params.id

    const [loading, setLoading] = useState(true)
    const [cls, setCls] = useState(null)
    const [notFound, setNotFound] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            const found = MOCK_CLASSES.find(c => c.id === classId)
            if (found) {
                setCls(found)
            } else {
                setNotFound(true)
            }
            setLoading(false)
        }, 400)
    }, [classId])

    // ─── Not Found ──────────────────────────────────────────────────────────
    if (!loading && notFound) {
        return (
            <div className="max-w-[600px] mx-auto space-y-6">
                <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "Classes", href: "/school/classes" }, { label: "Not Found" }]} />
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-16 text-center">
                    <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                        <X size={24} className="text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">Class not found</h3>
                    <p className="text-sm text-slate-500 mb-6">This class may have been deleted or the link is invalid.</p>
                    <button onClick={() => router.push("/school/classes")} className="px-5 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-colors">
                        Back to Classes
                    </button>
                </div>
            </div>
        )
    }

    // ─── Loading ────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="max-w-[1300px] mx-auto space-y-6">
                <Skeleton className="h-5 w-48 rounded" />
                <Skeleton className="h-8 w-64 rounded" />
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28 rounded-xl" />)}
                </div>
                <Skeleton className="h-64 rounded-xl" />
            </div>
        )
    }

    const group = GRADE_GROUP_MAP[cls.grade] || "Primary"
    const color = GROUP_COLORS[group]
    const presentCount = MOCK_STUDENTS.filter(s => s.status === "present").length
    const absentCount = MOCK_STUDENTS.filter(s => s.status === "absent").length
    const lateCount = MOCK_STUDENTS.filter(s => s.status === "late").length

    return (
        <div className="max-w-[1300px] mx-auto space-y-6">
            {/* Breadcrumb */}
            <PageBreadcrumb
                items={[
                    { label: "Dashboard", href: "/school" },
                    { label: "Classes", href: "/school/classes" },
                    { label: `${cls.grade}–${cls.section}` },
                ]}
            />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl ${color.bg} flex items-center justify-center shrink-0`}>
                            <span className="text-white font-bold text-base">
                                {cls.grade.replace("Cls ", "")}{cls.section}
                            </span>
                        </div>
                        <div>
                            <h1 className="text-[22px] font-bold text-slate-800">
                                {cls.grade}–{cls.section}
                            </h1>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${color.light} ${color.text}`}>
                                    {group}
                                </span>
                                <StatusBadge status={cls.status === "Active" ? "active" : "inactive"} size="sm" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => router.push(`/school/classes/edit?id=${cls.id}`)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        <Edit2 size={15} /> Edit Class
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-violet-700 text-white text-sm font-semibold shadow-sm shadow-violet-200 hover:from-violet-600 hover:to-violet-800 transition-all">
                        <MessageCircle size={15} /> Message Teacher
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard
                    title="Total Students"
                    value={MOCK_STUDENTS.length}
                    icon={Users}
                    iconColor="blue"
                />
                <KpiCard
                    title="Present Today"
                    value={presentCount}
                    icon={Check}
                    iconColor="green"
                    description={`${Math.round((presentCount / MOCK_STUDENTS.length) * 100)}% attendance`}
                />
                <KpiCard
                    title="Absent"
                    value={absentCount}
                    icon={X}
                    iconColor="red"
                    change={absentCount > 0 ? absentCount : undefined}
                    changeLabel="need attention"
                    invert
                />
                <KpiCard
                    title="Subjects"
                    value={cls.subjects.length}
                    icon={BookOpen}
                    iconColor="purple"
                />
            </div>

            {/* Two Column Layout */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Left — Student List + Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Class Info Card */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                        <h2 className="font-semibold text-slate-800 mb-4">Class Information</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                                    <UserCheck size={16} className="text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Class Teacher</p>
                                    <p className="text-sm font-medium text-slate-700">{cls.classTeacher}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
                                    <DoorOpen size={16} className="text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Room</p>
                                    <p className="text-sm font-medium text-slate-700">{cls.room || "—"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center">
                                    <GraduationCap size={16} className="text-violet-600" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Grade Group</p>
                                    <p className="text-sm font-medium text-slate-700">{group}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
                                    <BookOpen size={16} className="text-amber-600" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Subjects</p>
                                    <p className="text-sm font-medium text-slate-700">{cls.subjects.length}</p>
                                </div>
                            </div>
                        </div>

                        {/* Subjects Tags */}
                        <div className="mt-4 pt-4 border-t border-slate-100">
                            <p className="text-[11px] font-semibold text-slate-400 uppercase mb-2">Subjects Taught</p>
                            <div className="flex flex-wrap gap-1.5">
                                {cls.subjects.map(sub => (
                                    <span key={sub} className={`px-2.5 py-1 rounded-md text-xs font-medium border ${color.light} ${color.text} ${color.border}`}>
                                        {sub}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Student List */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h2 className="font-semibold text-slate-800">Students</h2>
                                <p className="text-xs text-slate-500 mt-0.5">{MOCK_STUDENTS.length} enrolled</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-500 hover:bg-slate-50 transition-colors">
                                    <Download size={12} /> Export
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-50 bg-slate-50/50">
                                        <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Roll</th>
                                        <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Student</th>
                                        <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Gender</th>
                                        <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Attendance</th>
                                        <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Today</th>
                                        <th className="px-4 py-3 text-right text-[11px] font-semibold text-slate-400 uppercase tracking-wide"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {MOCK_STUDENTS.map(student => (
                                        <tr key={student.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                            <td className="px-4 py-3">
                                                <span className="text-xs font-mono text-slate-500">#{student.rollNo}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2.5">
                                                    <div className={`w-8 h-8 rounded-full ${student.avatarColor} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                                                        {student.avatar}
                                                    </div>
                                                    <span className="text-sm font-medium text-slate-700">{student.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-slate-500">{student.gender}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-20 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${student.attendance >= 90 ? "bg-emerald-500" : student.attendance >= 75 ? "bg-amber-500" : "bg-red-500"}`}
                                                            style={{ width: `${student.attendance}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs font-medium text-slate-600">{student.attendance}%</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <StatusBadge status={student.status} size="sm" />
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <button
                                                    onClick={() => router.push(`/school/students/${student.id}`)}
                                                    className="text-xs text-violet-500 hover:text-violet-700 font-medium flex items-center gap-1 ml-auto"
                                                >
                                                    View <ChevronRight size={12} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
                            <p className="text-xs text-slate-400">Showing {MOCK_STUDENTS.length} students</p>
                            <button
                                onClick={() => router.push(`/school/students/add?class=${cls.id}`)}
                                className="text-xs text-violet-500 hover:text-violet-700 font-medium"
                            >
                                + Add Student
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right — Activity + Quick Info */}
                <div className="space-y-6">
                    {/* Teacher Contact Card */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                        <h3 className="font-semibold text-slate-800 mb-4">Class Teacher</h3>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-violet-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                                {cls.classTeacher?.split(" ").map(w => w[0]).join("").slice(0, 2) || "?"}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-800">{cls.classTeacher}</p>
                                <p className="text-xs text-slate-500">Class Teacher</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 transition-colors">
                                <Phone size={12} /> Call Teacher
                            </button>
                            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 transition-colors">
                                <Mail size={12} /> Send Email
                            </button>
                            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-violet-50 text-violet-700 text-xs font-medium hover:bg-violet-100 transition-colors">
                                <MessageCircle size={12} /> Message
                            </button>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                        <h3 className="font-semibold text-slate-800 mb-4">Recent Activity</h3>
                        <div className="space-y-3">
                            {MOCK_ACTIVITY.map(activity => {
                                const ActivityIcon = activityIcons[activity.type] || Clock
                                return (
                                    <div key={activity.id} className="flex gap-3">
                                        <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                                            <ActivityIcon size={12} className="text-slate-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-700 leading-relaxed">{activity.text}</p>
                                            <p className="text-[10px] text-slate-400 mt-0.5">{activity.time}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                        <h3 className="font-semibold text-slate-800 mb-4">Attendance Breakdown</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                    <span className="text-xs text-slate-600">Present</span>
                                </div>
                                <span className="text-xs font-semibold text-slate-700">{presentCount}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                                    <span className="text-xs text-slate-600">Late</span>
                                </div>
                                <span className="text-xs font-semibold text-slate-700">{lateCount}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                                    <span className="text-xs text-slate-600">Absent</span>
                                </div>
                                <span className="text-xs font-semibold text-slate-700">{absentCount}</span>
                            </div>
                            <div className="h-px bg-slate-100" />
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-slate-600">Attendance Rate</span>
                                <span className="text-xs font-bold text-emerald-600">
                                    {Math.round((presentCount / MOCK_STUDENTS.length) * 100)}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}