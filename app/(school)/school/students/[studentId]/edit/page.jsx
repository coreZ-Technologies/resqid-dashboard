"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Save, Loader2, User, GraduationCap, Mail, Users, AlertCircle, Heart, FileText } from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import EditPersonalSection from "@/components/modules/students/EditPersonalSection"
import EditAcademicSection from "@/components/modules/students/EditAcademicSection"
import EditParentsSection from "@/components/modules/students/EditParentsSection"
import EditEmergencySection from "@/components/modules/students/EditEmergencySection"
import { cn } from "@/lib/utils"

const SECTIONS = [
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'academic', label: 'Academic', icon: GraduationCap },
    { id: 'contact', label: 'Contact', icon: Mail },
    { id: 'parents', label: 'Parents', icon: Users },
    { id: 'emergency', label: 'Emergency', icon: AlertCircle },
    { id: 'medical', label: 'Medical', icon: Heart },
]

const getMockStudentData = (id) => ({
    firstName: 'Aarav', lastName: 'Sharma', gender: 'MALE', dateOfBirth: '2010-05-15',
    bloodGroup: 'O+', class: '10', section: 'A', rollNumber: '24', admissionYear: '2024',
    status: 'Active', email: 'aarav.sharma@school.edu.in', phone: '+91 98765 43210',
    address: '42, Park Street, Kolkata', city: 'Kolkata', state: 'West Bengal', pincode: '700016',
    emergencyVisibility: 'PUBLIC',
    parents: [
        { id: 'p1', name: 'Rajesh Sharma', relationship: 'Father', phone: '+91 98765 43210', email: 'rajesh@example.com', occupation: 'Businessman', isPrimary: true },
        { id: 'p2', name: 'Neha Sharma', relationship: 'Mother', phone: '+91 98765 43211', email: 'neha@example.com', occupation: 'Teacher', isPrimary: false },
    ],
    emergencyContacts: [
        { id: 'e1', name: 'Rajesh Sharma', relationship: 'Father', phone: '+91 98765 43210', priority: 1 },
    ],
    medicalInfo: {
        allergies: ['Peanuts', 'Dust Mites'], conditions: ['Asthma'], medications: ['Inhaler'],
        doctorName: 'Dr. Anjali Mehta', doctorSpecialization: 'Pediatrician', doctorPhone: '+91 98765 43213', doctorClinic: 'Mehta Child Care Clinic',
        hospitalName: 'Apollo Gleneagles Hospital', hospitalPhone: '+91 33 2320 3040',
        insuranceProvider: 'Star Health', insurancePolicyNumber: 'SHI/2024/123456', insuranceValidUntil: '2026-12-31',
        notes: 'Mild asthma.', lastCheckup: '2024-10-15', emergencyInstructions: 'Use inhaler for asthma attacks.',
    },
    academicInfo: {
        subjects: [{ name: 'Mathematics', code: 'MAT101', teacher: 'Mr. Sharma' }, { name: 'Science', code: 'SCI101', teacher: 'Ms. Gupta' }],
        achievements: ['1st Prize Science Fair 2024'], remarks: 'Excellent performance.',
    },
})

export default function EditStudentPage() {
    const params = useParams()
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [activeSection, setActiveSection] = useState('personal')
    const [formData, setFormData] = useState(null)
    const [errors, setErrors] = useState({})

    useEffect(() => {
        setTimeout(() => { setFormData(getMockStudentData(params.studentId)); setLoading(false) }, 600)
    }, [params.studentId])

    const validate = () => {
        const e = {}
        if (!formData.firstName) e.firstName = 'Required'
        if (!formData.lastName) e.lastName = 'Required'
        if (!formData.class) e.class = 'Required'
        if (!formData.section) e.section = 'Required'
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const handleSave = async () => {
        if (!validate()) return
        setSaving(true)
        await new Promise(r => setTimeout(r, 1200))
        console.log("Saved:", formData)
        setSaving(false)
        router.push(`/school/students/${params.studentId}`)
    }

    if (loading || !formData) {
        return (
            <div className="max-w-[600px] mx-auto space-y-6">
                <div className="h-5 w-48 bg-slate-200 rounded animate-pulse" />
                <div className="h-96 bg-slate-100 rounded-xl animate-pulse" />
            </div>
        )
    }

    return (
        <div className="max-w-[1100px] mx-auto space-y-6">
            <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "Students", href: "/school/students" }, { label: formData.firstName, href: `/school/students/${params.studentId}` }, { label: "Edit" }]} />

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"><ArrowLeft size={18} /></button>
                    <div>
                        <h1 className="text-[22px] font-bold text-slate-800">Edit {formData.firstName} {formData.lastName}</h1>
                        <p className="text-[13px] text-slate-500">{formData.class}-{formData.section}</p>
                    </div>
                </div>
                <button onClick={handleSave} disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-violet-700 text-white text-sm font-semibold shadow-sm shadow-violet-200 hover:from-violet-600 hover:to-violet-800 disabled:opacity-50 transition-all">
                    {saving ? <><Loader2 size={14} className="animate-spin" />Saving...</> : <><Save size={14} />Save Changes</>}
                </button>
            </div>

            {/* Section Nav + Content */}
            <div className="flex gap-6">
                {/* Sidebar Nav */}
                <div className="w-56 shrink-0">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-2 sticky top-6">
                        {SECTIONS.map(s => (
                            <button key={s.id} onClick={() => setActiveSection(s.id)}
                                className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all mb-0.5",
                                    activeSection === s.id ? "bg-violet-50 text-violet-700" : "text-slate-600 hover:bg-slate-50")}>
                                <s.icon size={16} />{s.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-6">
                    {activeSection === 'personal' && <EditPersonalSection formData={formData} setFormData={setFormData} errors={errors} />}
                    {activeSection === 'academic' && <EditAcademicSection formData={formData} setFormData={setFormData} errors={errors} />}
                    {activeSection === 'contact' && (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                            <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><Mail size={18} className="text-violet-600" />Contact Information</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Email" type="email" value={formData.email} onChange={v => setFormData({ ...formData, email: v })} />
                                <Field label="Phone" value={formData.phone} onChange={v => setFormData({ ...formData, phone: v })} />
                                <div className="col-span-2">
                                    <Field label="Address" value={formData.address} onChange={v => setFormData({ ...formData, address: v })} />
                                </div>
                                <Field label="City" value={formData.city} onChange={v => setFormData({ ...formData, city: v })} />
                                <Field label="State" value={formData.state} onChange={v => setFormData({ ...formData, state: v })} />
                                <Field label="Pincode" value={formData.pincode} onChange={v => setFormData({ ...formData, pincode: v })} />
                            </div>
                        </div>
                    )}
                    {activeSection === 'parents' && <EditParentsSection parents={formData.parents} onChange={v => setFormData({ ...formData, parents: v })} />}
                    {activeSection === 'emergency' && (
                        <EditEmergencySection
                            contacts={formData.emergencyContacts}
                            onChange={v => setFormData({ ...formData, emergencyContacts: v })}
                            visibility={formData.emergencyVisibility}
                            onVisibilityChange={v => setFormData({ ...formData, emergencyVisibility: v })}
                        />
                    )}
                    {activeSection === 'medical' && (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                            <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><Heart size={18} className="text-rose-600" />Medical Information</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Doctor Name" value={formData.medicalInfo.doctorName} onChange={v => setFormData({ ...formData, medicalInfo: { ...formData.medicalInfo, doctorName: v } })} />
                                <Field label="Specialization" value={formData.medicalInfo.doctorSpecialization} onChange={v => setFormData({ ...formData, medicalInfo: { ...formData.medicalInfo, doctorSpecialization: v } })} />
                                <Field label="Doctor Phone" value={formData.medicalInfo.doctorPhone} onChange={v => setFormData({ ...formData, medicalInfo: { ...formData.medicalInfo, doctorPhone: v } })} />
                                <Field label="Clinic" value={formData.medicalInfo.doctorClinic} onChange={v => setFormData({ ...formData, medicalInfo: { ...formData.medicalInfo, doctorClinic: v } })} />
                                <Field label="Hospital" value={formData.medicalInfo.hospitalName} onChange={v => setFormData({ ...formData, medicalInfo: { ...formData.medicalInfo, hospitalName: v } })} />
                                <Field label="Hospital Phone" value={formData.medicalInfo.hospitalPhone} onChange={v => setFormData({ ...formData, medicalInfo: { ...formData.medicalInfo, hospitalPhone: v } })} />
                                <Field label="Insurance Provider" value={formData.medicalInfo.insuranceProvider} onChange={v => setFormData({ ...formData, medicalInfo: { ...formData.medicalInfo, insuranceProvider: v } })} />
                                <Field label="Policy Number" value={formData.medicalInfo.insurancePolicyNumber} onChange={v => setFormData({ ...formData, medicalInfo: { ...formData.medicalInfo, insurancePolicyNumber: v } })} />
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Emergency Instructions</label>
                                <textarea value={formData.medicalInfo.emergencyInstructions} onChange={e => setFormData({ ...formData, medicalInfo: { ...formData.medicalInfo, emergencyInstructions: e.target.value } })}
                                    rows={3} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 resize-none" />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function Field({ label, type = 'text', value, onChange, placeholder }) {
    return (
        <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
            <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all" />
        </div>
    )
}