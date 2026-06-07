"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, GraduationCap, Heart, Shield, Users } from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import { StatusBadge } from "@/components/shared/StatusBadge"

const getStudent = (id) => ({
    id, name: "Aarav Sharma", class: "10-A", rollNo: 24, gender: "Male", dob: "2010-05-15", bloodGroup: "O+",
    email: "aarav@school.edu.in", phone: "+91 98765 43210", address: "42, Park Street, Kolkata - 700016",
    parents: [
        { name: "Rajesh Sharma", relation: "Father", phone: "+91 98765 43210", email: "rajesh@email.com" },
        { name: "Neha Sharma", relation: "Mother", phone: "+91 98765 43211", email: "neha@email.com" },
    ],
    emergencyContacts: [{ name: "Rajesh Sharma", relation: "Father", phone: "+91 98765 43210", priority: 1 }],
    medical: { allergies: ["Peanuts", "Dust"], conditions: ["Asthma"], medications: ["Inhaler"], doctor: "Dr. Mehta", doctorPhone: "+91 98765 43213" },
    attendance: { present: 85, total: 90, percentage: 94.4 },
    status: "Active",
})

export default function StudentDetailPage() {
    const router = useRouter()
    const params = useParams()
    const schoolId = params.schoolId
    const studentId = params.studentId

    const [student, setStudent] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setTimeout(() => { setStudent(getStudent(studentId)); setLoading(false) }, 400)
    }, [studentId])

    if (loading) return <div className="max-w-[900px] mx-auto space-y-6"><div className="h-64 bg-slate-100 rounded-xl animate-pulse" /></div>
    if (!student) return <div className="text-center py-16 text-slate-500">Student not found</div>

    return (
        <div className="max-w-[900px] mx-auto space-y-6">
            <PageBreadcrumb items={[
                { label: "Super Admin", href: "/superadmin" }, { label: "Schools", href: "/superadmin/schools" },
                { label: "School", href: `/superadmin/schools/${schoolId}` }, { label: "Students", href: `/superadmin/schools/${schoolId}/students` }, { label: student.name }
            ]} />

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"><ArrowLeft size={18} /></button>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                            {student.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                            <h1 className="text-[22px] font-bold text-slate-800">{student.name}</h1>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs text-slate-500">{student.class} · Roll {student.rollNo}</span>
                                <StatusBadge status="active" size="sm" label={student.status} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Attendance", value: `${student.attendance.percentage}%`, icon: Calendar, color: "bg-emerald-500" },
                    { label: "Blood Group", value: student.bloodGroup, icon: Heart, color: "bg-red-500" },
                    { label: "Parents", value: student.parents.length, icon: Users, color: "bg-violet-500" },
                    { label: "Emergency Contacts", value: student.emergencyContacts.length, icon: Shield, color: "bg-amber-500" },
                ].map(s => (
                    <div key={s.label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center`}><s.icon size={18} className="text-white" /></div>
                        <div><p className="text-xl font-bold text-slate-800">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                        <h2 className="font-semibold text-slate-800 mb-4">Personal Information</h2>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            {[
                                { icon: User, label: "Name", value: student.name },
                                { icon: GraduationCap, label: "Class", value: student.class },
                                { icon: Calendar, label: "DOB", value: new Date(student.dob).toLocaleDateString() },
                                { icon: Heart, label: "Blood Group", value: student.bloodGroup },
                                { icon: Mail, label: "Email", value: student.email },
                                { icon: Phone, label: "Phone", value: student.phone },
                                { icon: MapPin, label: "Address", value: student.address },
                            ].map(r => (
                                <div key={r.label} className="flex items-center gap-2"><r.icon size={14} className="text-slate-400" /><div><p className="text-xs text-slate-400">{r.label}</p><p className="font-medium text-slate-700">{r.value}</p></div></div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                        <h2 className="font-semibold text-slate-800 mb-3">Medical Information</h2>
                        <div className="space-y-3 text-sm">
                            <div><p className="text-xs text-slate-400">Allergies</p><div className="flex gap-1 mt-1">{student.medical.allergies.map(a => <span key={a} className="px-2 py-0.5 rounded bg-red-50 text-red-700 text-xs">{a}</span>)}</div></div>
                            <div><p className="text-xs text-slate-400">Conditions</p><p className="font-medium">{student.medical.conditions.join(", ")}</p></div>
                            <div><p className="text-xs text-slate-400">Doctor</p><p className="font-medium">{student.medical.doctor} · {student.medical.doctorPhone}</p></div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                        <h2 className="font-semibold text-slate-800 mb-3">Parents & Contacts</h2>
                        {student.parents.map((p, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg mb-2">
                                <div>
                                    <p className="text-sm font-semibold text-slate-700">{p.name}</p>
                                    <p className="text-xs text-slate-400">{p.relation} · {p.phone}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                        <h2 className="font-semibold text-slate-800 mb-3 flex items-center gap-2"><Shield size={16} className="text-red-500" />Emergency Contacts</h2>
                        {student.emergencyContacts.map((c, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-red-50 rounded-lg mb-2">
                                <div>
                                    <p className="text-sm font-semibold text-slate-700">{c.name}</p>
                                    <p className="text-xs text-slate-400">{c.relation} · Priority {c.priority}</p>
                                </div>
                                <span className="text-sm font-semibold text-slate-700">{c.phone}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}