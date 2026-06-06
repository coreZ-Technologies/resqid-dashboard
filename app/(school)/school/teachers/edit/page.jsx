"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Check, ArrowLeft, Loader2, X } from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import { MOCK_TEACHERS } from "@/lib/mock-data"

export default function EditTeacherPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const teacherId = searchParams.get("id")

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [notFound, setNotFound] = useState(false)

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [subjects, setSubjects] = useState("")
    const [qualification, setQualification] = useState("")
    const [experience, setExperience] = useState("")
    const [joiningDate, setJoiningDate] = useState("")
    const [employeeId, setEmployeeId] = useState("")

    useEffect(() => {
        setTimeout(() => {
            const found = MOCK_TEACHERS.find(t => t.id === teacherId)
            if (found) {
                setName(found.name)
                setEmail(found.email)
                setPhone(found.phone || "")
                setSubjects((found.subjects || []).join(", "))
                setQualification(found.qualification || "")
                setExperience(found.experience || "")
                setJoiningDate(found.joiningDate || "")
                setEmployeeId(found.employeeId || "")
            } else {
                setNotFound(true)
            }
            setLoading(false)
        }, 400)
    }, [teacherId])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!name || !email) return
        setSaving(true)
        await new Promise(r => setTimeout(r, 600))
        console.log("Updated:", { id: teacherId, name, email, phone, subjects: subjects.split(",").map(s => s.trim()), qualification, experience, joiningDate, employeeId })
        setSaving(false)
        router.push("/school/teachers")
    }

    if (!loading && notFound) {
        return (
            <div className="max-w-[600px] mx-auto space-y-6">
                <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "Teachers", href: "/school/teachers" }, { label: "Not Found" }]} />
                <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
                    <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4"><X size={24} className="text-slate-400" /></div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">Teacher not found</h3>
                    <p className="text-sm text-slate-500 mb-6">This teacher may have been deleted.</p>
                    <button onClick={() => router.push("/school/teachers")} className="px-5 py-2.5 rounded-lg bg-violet-600 text-white text-sm font-semibold">Back to Teachers</button>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="max-w-[600px] mx-auto space-y-6">
                <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "Teachers", href: "/school/teachers" }, { label: "Edit" }]} />
                <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 animate-pulse">
                    <div className="h-5 w-32 bg-slate-100 rounded" />
                    <div className="grid grid-cols-2 gap-4">{[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-10 bg-slate-100 rounded-lg" />)}</div>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-[900px] mx-auto space-y-6">
            <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "Teachers", href: "/school/teachers" }, { label: `Edit ${name}` }]} />

            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"><ArrowLeft size={18} /></button>
                <div><h1 className="text-[22px] font-bold text-slate-800">Edit {name}</h1><p className="text-[13px] text-slate-500">Update teacher details and professional information</p></div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center"><span className="text-violet-600 font-bold text-sm">{employeeId?.slice(-4)}</span></div>
                    <h2 className="font-semibold text-slate-800">Teacher Details</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name *</label><input value={name} onChange={e => setName(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all" /></div>
                    <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Email *</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all" /></div>
                    <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone</label><input value={phone} onChange={e => setPhone(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all" /></div>
                    <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Employee ID</label><input value={employeeId} onChange={e => setEmployeeId(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all font-mono" /></div>
                    <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Subjects (comma separated)</label><input value={subjects} onChange={e => setSubjects(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all" /></div>
                    <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Qualification</label><input value={qualification} onChange={e => setQualification(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all" /></div>
                    <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Experience</label><input value={experience} onChange={e => setExperience(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all" /></div>
                    <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Joining Date</label><input type="date" value={joiningDate} onChange={e => setJoiningDate(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all" /></div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={() => router.back()} className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">Cancel</button>
                    <button type="submit" disabled={!name || !email || saving} className="px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-50 transition-colors">
                        {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : <><Check size={14} /> Save Changes</>}
                    </button>
                </div>
            </form>
        </div>
    )
}