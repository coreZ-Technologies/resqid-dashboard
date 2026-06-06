"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import {
    ArrowLeft, Printer, Edit2, User, GraduationCap,
    Calendar, AlertCircle, Heart, FileText, MessageCircle,
    Bell, FilePlus, Activity
} from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import StudentHeader from "@/components/modules/students/StudentHeader"
import ContactCard from "@/components/modules/students/ContactCard"
import EmergencyProfileCard from "@/components/modules/students/EmergencyProfileCard"
import AttendanceCard from "@/components/modules/students/AttendanceCard"
import MedicalInfoCard from "@/components/modules/students/MedicalInfoCard"
import DocumentsCard from "@/components/modules/students/DocumentsCard"
import ShareButton from "@/components/shared/ShareButton"
import { printStudentProfile } from "@/components/shared/PrintStudentProfile"
import { cn } from "@/lib/utils"

const TABS = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'emergency', label: 'Emergency', icon: AlertCircle },
    { id: 'medical', label: 'Medical', icon: Heart },
    { id: 'documents', label: 'Documents', icon: FileText },
]

const getStudentData = (id) => ({
    id, name: 'Aarav Sharma', firstName: 'Aarav', lastName: 'Sharma',
    gender: 'MALE', dateOfBirth: '2010-05-15', bloodGroup: 'O+',
    rollNumber: '24', class: '10', section: 'A', enrollmentDate: '2024-01-15',
    status: 'Active', qrCodeId: 'RESQID-STU-2024-001234',
    email: 'aarav.sharma@springdale.edu.in', phone: '+91 98765 43210',
    address: '42, Park Street, Kolkata - 700016',
    parents: [
        { id: 'p1', name: 'Rajesh Sharma', relationship: 'Father', phone: '+91 98765 43210', email: 'rajesh@example.com', occupation: 'Businessman', canCall: true, canWhatsapp: true },
        { id: 'p2', name: 'Neha Sharma', relationship: 'Mother', phone: '+91 98765 43211', email: 'neha@example.com', occupation: 'Teacher', canCall: true, canWhatsapp: true },
    ],
    emergencyContacts: [
        { id: 'e1', name: 'Rajesh Sharma', relationship: 'Father', phone: '+91 98765 43210', priority: 1 },
        { id: 'e2', name: 'Dr. Mehta', relationship: 'Family Physician', phone: '+91 98765 43212', priority: 2 },
    ],
    medicalInfo: {
        bloodGroup: 'O+', allergies: ['Peanuts', 'Dust Mites', 'Penicillin'],
        conditions: ['Asthma', 'Mild Dairy Allergy'], medications: ['Inhaler - As needed', 'Cetirizine 10mg'],
        doctor: { name: 'Dr. Anjali Mehta', specialization: 'Pediatrician', clinic: 'Mehta Child Care Clinic', phone: '+91 98765 43213', address: '15, Lake View Road, Kolkata' },
        lastCheckup: '2024-10-15', emergencyInstructions: 'In case of asthma attack, use inhaler immediately and contact parents.',
    },
    emergencyVisibility: 'PUBLIC',
    attendance: {
        present: 85, total: 90, percentage: 94.44,
        monthly: [
            { month: 'Jan', present: 22, total: 24, percentage: 91.67 },
            { month: 'Feb', present: 20, total: 22, percentage: 90.91 },
            { month: 'Mar', present: 18, total: 20, percentage: 90.00 },
            { month: 'Apr', present: 23, total: 23, percentage: 100.00 },
            { month: 'May', present: 2, total: 2, percentage: 100.00 },
        ],
        recentAbsences: [
            { date: '2024-12-10', reason: 'Fever', approved: true },
            { date: '2024-11-28', reason: 'Family function', approved: true },
        ],
    },
    documents: [
        { id: 'd1', name: 'Birth Certificate', type: 'PDF', size: '1.2 MB', uploadedAt: '2024-01-20' },
        { id: 'd2', name: 'Transfer Certificate', type: 'PDF', size: '0.8 MB', uploadedAt: '2024-01-20' },
        { id: 'd3', name: 'Medical Report', type: 'PDF', size: '2.1 MB', uploadedAt: '2024-02-15' },
    ],
    recentActivity: [
        { action: 'Attendance Marked', date: '2024-12-20 09:30 AM', status: 'Present' },
        { action: 'Parent Meeting Scheduled', date: '2024-12-18 02:00 PM', status: 'Pending' },
        { action: 'Report Card Generated', date: '2024-12-15 11:00 AM', status: 'Completed' },
    ],
})

export default function StudentDetailPage() {
    const params = useParams()
    const router = useRouter()
    const [student, setStudent] = useState(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('overview')

    useEffect(() => {
        setTimeout(() => { setStudent(getStudentData(params.studentId)); setLoading(false) }, 600)
    }, [params.studentId])

    const handleCall = useCallback((phone) => window.location.href = `tel:${phone}`, [])
    const handleWhatsApp = useCallback((phone) => window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}`, '_blank'), [])

    const handleToggleVisibility = useCallback(() => {
        const order = ['PUBLIC', 'MINIMAL', 'HIDDEN']
        const next = order[(order.indexOf(student.emergencyVisibility) + 1) % order.length]
        setStudent(prev => ({ ...prev, emergencyVisibility: next }))
    }, [student])

    const handlePrint = useCallback(() => {
        if (student) printStudentProfile(student)
    }, [student])

    if (loading) {
        return (
            <div className="max-w-[1300px] mx-auto space-y-6">
                <div className="h-5 w-48 bg-slate-200 rounded animate-pulse" />
                <div className="h-48 bg-slate-100 rounded-xl animate-pulse" />
            </div>
        )
    }

    if (!student) return null

    return (
        <div className="max-w-[1300px] mx-auto space-y-6">
            <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "Students", href: "/school/students" }, { label: student.name }]} />

            {/* Header Actions */}
            <div className="flex items-center justify-between">
                <button onClick={() => router.back()} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"><ArrowLeft size={18} />Back</button>
                <div className="flex gap-2">
                    <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"><Printer size={15} />Print</button>
                    <ShareButton data={student} label="Share" />
                    <button onClick={() => router.push(`/school/students/${student.id}/edit`)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-violet-700 text-white text-sm font-semibold shadow-sm shadow-violet-200 hover:from-violet-600 hover:to-violet-800 transition-all"><Edit2 size={15} />Edit</button>
                </div>
            </div>

            {/* Student Header */}
            <StudentHeader student={student} />

            {/* Tabs */}
            <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit overflow-x-auto">
                {TABS.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={cn("flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                            activeTab === tab.id ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700")}>
                        <tab.icon size={14} />{tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Sidebar */}
                <div className="space-y-6">
                    <EmergencyProfileCard student={student} onToggleVisibility={handleToggleVisibility} />

                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                        <h3 className="font-semibold text-slate-800 mb-4">Parents & Guardians</h3>
                        <div className="space-y-2">
                            {student.parents.map(p => <ContactCard key={p.id} contact={p} onCall={handleCall} onWhatsApp={handleWhatsApp} />)}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><AlertCircle size={16} className="text-rose-600" />Emergency Contacts</h3>
                        <div className="space-y-2">
                            {student.emergencyContacts.map(c => <ContactCard key={c.id} contact={c} onCall={handleCall} onWhatsApp={handleWhatsApp} />)}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                        <h3 className="font-semibold text-slate-800 mb-3">Quick Actions</h3>
                        <div className="space-y-1.5">
                            {[
                                { icon: MessageCircle, label: "Message Parents" },
                                { icon: Bell, label: "Send Notification" },
                                { icon: FilePlus, label: "Generate Report Card" },
                            ].map(a => (
                                <button key={a.label} className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 text-sm text-slate-600 transition-colors"><a.icon size={14} />{a.label}</button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Content */}
                <div className="lg:col-span-2 space-y-6">
                    {activeTab === 'overview' && (
                        <>
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                                <h3 className="font-semibold text-slate-800 mb-4">Personal Information</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    {[
                                        { label: "Full Name", value: student.name }, { label: "Class & Section", value: `${student.class}-${student.section}` },
                                        { label: "Roll Number", value: student.rollNumber }, { label: "Date of Birth", value: new Date(student.dateOfBirth).toLocaleDateString() },
                                        { label: "Blood Group", value: student.bloodGroup }, { label: "Phone", value: student.phone },
                                        { label: "Email", value: student.email }, { label: "Enrollment Date", value: new Date(student.enrollmentDate).toLocaleDateString() },
                                    ].map(r => (
                                        <div key={r.label}><p className="text-xs text-slate-400 uppercase">{r.label}</p><p className="font-medium text-slate-700">{r.value}</p></div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                                <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2"><Activity size={16} className="text-purple-600" />Recent Activity</h3>
                                <div className="space-y-2">
                                    {student.recentActivity.map((a, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                            <div><p className="text-sm font-medium text-slate-700">{a.action}</p><p className="text-xs text-slate-400">{a.date}</p></div>
                                            <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded">{a.status}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'attendance' && <AttendanceCard attendance={student.attendance} />}
                    {activeTab === 'emergency' && (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                            <h3 className="font-semibold text-slate-800 mb-3">All Emergency Contacts</h3>
                            <div className="space-y-2">
                                {[...student.parents, ...student.emergencyContacts].map((c, i) => <ContactCard key={i} contact={c} onCall={handleCall} onWhatsApp={handleWhatsApp} />)}
                            </div>
                        </div>
                    )}
                    {activeTab === 'medical' && <MedicalInfoCard medicalInfo={student.medicalInfo} />}
                    {activeTab === 'documents' && <DocumentsCard documents={student.documents} />}
                </div>
            </div>
        </div>
    )
}