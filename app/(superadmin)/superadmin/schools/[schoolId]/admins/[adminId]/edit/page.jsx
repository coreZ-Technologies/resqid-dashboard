"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Shield, Check, Loader2 } from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import { MOCK_SCHOOLS } from "@/lib/mock-data"

export default function EditAdminPage() {
    const router = useRouter()
    const params = useParams()
    const schoolId = params.schoolId
    const adminId = params.adminId

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [role, setRole] = useState("School Admin")
    const [status, setStatus] = useState("Active")
    const [saving, setSaving] = useState(false)
    const [loading, setLoading] = useState(true)

    const school = MOCK_SCHOOLS.find(s => s.id === schoolId)

    useEffect(() => {
        setTimeout(() => {
            setName("Animesh Karan"); setEmail("animesh@springdale.in"); setPhone("+91 98765 43210")
            setRole("School Admin"); setStatus("Active"); setLoading(false)
        }, 400)
    }, [adminId])

    const handleSave = async () => {
        setSaving(true)
        await new Promise(r => setTimeout(r, 800))
        setSaving(false)
        router.push(`/superadmin/schools/${schoolId}/admins`)
    }

    if (loading) return <div className="max-w-[600px] mx-auto space-y-6"><div className="h-64 bg-slate-100 rounded-xl animate-pulse" /></div>

    return (
        <div className="max-w-[600px] mx-auto space-y-6">
            <PageBreadcrumb items={[{ label: "Super Admin", href: "/superadmin" }, { label: "Schools", href: "/superadmin/schools" }, { label: school?.name || "School", href: `/superadmin/schools/${schoolId}` }, { label: "Admins", href: `/superadmin/schools/${schoolId}/admins` }, { label: "Edit Admin" }]} />

            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"><ArrowLeft size={18} /></button>
                <div><h1 className="text-[22px] font-bold text-slate-800">Edit Admin</h1><p className="text-[13px] text-slate-500">{name}</p></div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name *</label><input value={name} onChange={e => setName(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500" /></div>
                <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Email *</label><input value={email} onChange={e => setEmail(e.target.value)} type="email" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500" /></div>
                <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone</label><input value={phone} onChange={e => setPhone(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500" /></div>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Role</label><select value={role} onChange={e => setRole(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 bg-white">{["School Admin", "Teacher", "Staff"].map(r => <option key={r}>{r}</option>)}</select></div>
                    <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Status</label><select value={status} onChange={e => setStatus(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 bg-white">{["Active", "Inactive", "Suspended"].map(s => <option key={s}>{s}</option>)}</select></div>
                </div>
            </div>

            <div className="flex justify-end gap-3">
                <button onClick={() => router.back()} className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="px-5 py-2 rounded-lg bg-violet-600 text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-50">
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Save Changes
                </button>
            </div>
        </div>
    )
}