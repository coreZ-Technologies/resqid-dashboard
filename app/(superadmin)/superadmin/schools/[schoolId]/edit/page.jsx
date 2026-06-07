"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Building2, Check, Loader2 } from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import { MOCK_SCHOOLS } from "@/lib/mock-data"

export default function EditSchoolPage() {
    const router = useRouter()
    const params = useParams()
    const schoolId = params.schoolId

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [name, setName] = useState("")
    const [board, setBoard] = useState("CBSE")
    const [city, setCity] = useState("")
    const [state, setState] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [principal, setPrincipal] = useState("")
    const [status, setStatus] = useState("active")

    useEffect(() => {
        setTimeout(() => {
            const found = MOCK_SCHOOLS.find(s => s.id === schoolId)
            if (found) {
                setName(found.name); setBoard(found.board); setCity(found.city)
                setState(found.state); setEmail(found.email); setPhone(found.phone)
                setPrincipal(found.principal); setStatus(found.status)
            }
            setLoading(false)
        }, 400)
    }, [schoolId])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        await new Promise(r => setTimeout(r, 800))
        setSaving(false)
        router.push(`/superadmin/schools/${schoolId}`)
    }

    if (loading) return <div className="max-w-[600px] mx-auto space-y-6"><div className="h-64 bg-slate-100 rounded-xl animate-pulse" /></div>

    return (
        <div className="max-w-[600px] mx-auto space-y-6">
            <PageBreadcrumb items={[{ label: "Super Admin", href: "/superadmin" }, { label: "Schools", href: "/superadmin/schools" }, { label: name, href: `/superadmin/schools/${schoolId}` }, { label: "Edit" }]} />
            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"><ArrowLeft size={18} /></button>
                <div><h1 className="text-[22px] font-bold text-slate-800">Edit {name}</h1><p className="text-[13px] text-slate-500">Update school details</p></div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">School Name *</label><input value={name} onChange={e => setName(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500" /></div>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Board</label><select value={board} onChange={e => setBoard(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 bg-white">{["CBSE", "ICSE", "State Board", "IB"].map(b => <option key={b}>{b}</option>)}</select></div>
                    <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Status</label><select value={status} onChange={e => setStatus(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 bg-white">{["active", "suspended", "inactive"].map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                    <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">City</label><input value={city} onChange={e => setCity(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500" /></div>
                    <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">State</label><input value={state} onChange={e => setState(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500" /></div>
                    <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Email *</label><input value={email} onChange={e => setEmail(e.target.value)} type="email" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500" /></div>
                    <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone</label><input value={phone} onChange={e => setPhone(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500" /></div>
                    <div className="col-span-2"><label className="block text-sm font-semibold text-slate-700 mb-1.5">Principal</label><input value={principal} onChange={e => setPrincipal(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500" /></div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={() => router.back()} className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium">Cancel</button>
                    <button type="submit" disabled={saving} className="px-5 py-2 rounded-lg bg-violet-600 text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-50">
                        {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Save Changes
                    </button>
                </div>
            </form>
        </div>
    )
}