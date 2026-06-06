"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Check, ArrowLeft, Loader2, Plus, X } from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import { MOCK_SUBJECTS } from "@/lib/mock-data"
import { SUBJECT_CATEGORIES } from "@/lib/constants"

export default function EditSubjectPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const subjectId = searchParams.get("id")

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [notFound, setNotFound] = useState(false)
    const [name, setName] = useState("")
    const [code, setCode] = useState("")
    const [category, setCategory] = useState("")
    const [description, setDescription] = useState("")
    const [periods, setPeriods] = useState("")
    const [mappings, setMappings] = useState([])

    useEffect(() => {
        setTimeout(() => {
            const found = MOCK_SUBJECTS.find(s => s.id === subjectId)
            if (found) {
                setName(found.name)
                setCode(found.code)
                setCategory(found.category)
                setDescription(found.description || "")
                setPeriods(found.periodsPerWeek?.toString() || "")
                setMappings((found.mappings || []).map(m => ({
                    grade: m.grade || "",
                    section: m.section || "",
                    teachers: (m.teachers || []).join(", ")
                })))
            } else {
                setNotFound(true)
            }
            setLoading(false)
        }, 400)
    }, [subjectId])

    const addMapping = () => setMappings(prev => [...prev, { grade: "", section: "", teachers: "" }])
    const removeMapping = (idx) => setMappings(prev => prev.filter((_, i) => i !== idx))
    const updateMapping = (idx, field, value) => setMappings(prev => prev.map((m, i) => i === idx ? { ...m, [field]: value } : m))

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!name || !code || !category) return
        setSaving(true)
        await new Promise(r => setTimeout(r, 600))
        const cleanMappings = mappings.filter(m => m.grade && m.section).map(m => ({
            grade: m.grade, section: m.section,
            teachers: m.teachers.split(",").map(t => t.trim()).filter(Boolean)
        }))
        console.log("Updated:", { id: subjectId, name, code, category, description, periodsPerWeek: parseInt(periods) || 0, mappings: cleanMappings })
        setSaving(false)
        router.push("/school/subjects")
    }

    if (!loading && notFound) {
        return (
            <div className="max-w-[600px] mx-auto space-y-6">
                <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "Subjects", href: "/school/subjects" }, { label: "Not Found" }]} />
                <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
                    <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4"><X size={24} className="text-slate-400" /></div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">Subject not found</h3>
                    <p className="text-sm text-slate-500 mb-6">This subject may have been deleted.</p>
                    <button onClick={() => router.push("/school/subjects")} className="px-5 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold">Back to Subjects</button>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="max-w-[600px] mx-auto space-y-6">
                <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "Subjects", href: "/school/subjects" }, { label: "Edit" }]} />
                <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 animate-pulse">
                    <div className="h-5 w-32 bg-slate-100 rounded" />
                    <div className="grid grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map(i => <div key={i} className="h-10 bg-slate-100 rounded-lg" />)}
                    </div>
                    <div className="flex justify-end gap-3">
                        <div className="h-10 w-24 bg-slate-100 rounded-lg" />
                        <div className="h-10 w-32 bg-slate-100 rounded-lg" />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-[900px] mx-auto space-y-6">
            <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "Subjects", href: "/school/subjects" }, { label: `Edit ${name}` }]} />

            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"><ArrowLeft size={18} /></button>
                <div>
                    <h1 className="text-[22px] font-bold text-slate-800">Edit {name}</h1>
                    <p className="text-[13px] text-slate-500">Update subject details and class assignments</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center"><span className="text-violet-600 font-bold text-sm">{code?.slice(0, 4)}</span></div>
                    <h2 className="font-semibold text-slate-800">Subject Details</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Subject Name *</label>
                        <input value={name} onChange={e => setName(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Subject Code *</label>
                        <input value={code} onChange={e => setCode(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all font-mono" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category *</label>
                        <select value={category} onChange={e => setCategory(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all bg-white">
                            {SUBJECT_CATEGORIES.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Periods / Week</label>
                        <input type="number" value={periods} onChange={e => setPeriods(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all resize-none" />
                </div>

                <div className="border-t border-slate-100 pt-4">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-slate-700">Class Assignments ({mappings.length})</h3>
                        <button type="button" onClick={addMapping} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"><Plus size={12} /> Add Class</button>
                    </div>
                    {mappings.length === 0 ? (
                        <p className="text-xs text-slate-400 py-3 text-center border border-dashed border-slate-200 rounded-lg">No classes assigned yet.</p>
                    ) : (
                        <div className="space-y-2">
                            {mappings.map((m, i) => (
                                <div key={i} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                                    <input value={m.grade} onChange={e => updateMapping(i, "grade", e.target.value)} placeholder="Grade" className="flex-1 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-violet-500 bg-white" />
                                    <input value={m.section} onChange={e => updateMapping(i, "section", e.target.value)} placeholder="Sec" className="w-16 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-violet-500 bg-white" />
                                    <input value={m.teachers} onChange={e => updateMapping(i, "teachers", e.target.value)} placeholder="Teachers (comma separated)" className="flex-[2] border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-violet-500 bg-white" />
                                    <button type="button" onClick={() => removeMapping(i)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"><X size={12} /></button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={() => router.back()} className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">Cancel</button>
                    <button type="submit" disabled={!name || !code || !category || saving} className="px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-50 transition-colors">
                        {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : <><Check size={14} /> Save Changes</>}
                    </button>
                </div>
            </form>
        </div>
    )
}