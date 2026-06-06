"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Check, Loader2, AlertCircle, UserCheck, Calendar, X } from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { MOCK_TEACHERS } from "@/lib/mock-data"
import { WELLNESS_TYPES } from "@/lib/constants"
import { cn } from "@/lib/utils"

export default function WellnessPage() {
    const router = useRouter()
    const params = useParams()
    const teacherId = params.id

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [notFound, setNotFound] = useState(false)
    const [teacher, setTeacher] = useState(null)

    const [wellnessType, setWellnessType] = useState("")
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [notes, setNotes] = useState("")
    const [requiresReplacement, setRequiresReplacement] = useState(true)
    const [selectedReplacement, setSelectedReplacement] = useState("")
    const [notifyAdmin, setNotifyAdmin] = useState(true)

    const availableReplacements = MOCK_TEACHERS.filter(t =>
        t.id !== teacherId &&
        t.status === "active" &&
        !t.wellness &&
        teacher?.subjects?.some(s => t.subjects.includes(s))
    )

    useEffect(() => {
        setTimeout(() => {
            const found = MOCK_TEACHERS.find(t => t.id === teacherId)
            if (found) {
                setTeacher(found)
                if (found.wellness) {
                    setWellnessType(found.wellness.type || "")
                    setStartDate(found.wellness.startDate || "")
                    setEndDate(found.wellness.expectedEndDate || "")
                    setNotes(found.wellness.notes || "")
                    setRequiresReplacement(found.wellness.requiresReplacement ?? true)
                    setSelectedReplacement(found.replacement || "")
                }
            } else {
                setNotFound(true)
            }
            setLoading(false)
        }, 400)
    }, [teacherId])

    const handleSave = async (e) => {
        e.preventDefault()
        setSaving(true)
        await new Promise(r => setTimeout(r, 700))
        console.log("Wellness updated:", {
            teacherId, type: wellnessType, startDate, expectedEndDate: endDate,
            notes, requiresReplacement, replacement: selectedReplacement || null, notifyAdmin
        })
        setSaving(false)
        router.push(`/school/teachers/${teacherId}`)
    }

    const handleClearWellness = async () => {
        setSaving(true)
        await new Promise(r => setTimeout(r, 500))
        console.log("Wellness cleared for:", teacherId)
        setSaving(false)
        router.push(`/school/teachers/${teacherId}`)
    }

    if (!loading && notFound) {
        return (
            <div className="max-w-[600px] mx-auto space-y-6">
                <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "Teachers", href: "/school/teachers" }, { label: "Not Found" }]} />
                <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
                    <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4"><X size={24} className="text-slate-400" /></div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">Teacher not found</h3>
                    <button onClick={() => router.push("/school/teachers")} className="px-5 py-2.5 rounded-lg bg-violet-600 text-white text-sm font-semibold">Back to Teachers</button>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="max-w-[700px] mx-auto space-y-6">
                <div className="h-5 w-48 bg-slate-200 rounded animate-pulse" />
                <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 animate-pulse">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-12 bg-slate-100 rounded-lg" />)}
                </div>
            </div>
        )
    }

    const hasExistingWellness = !!teacher.wellness

    return (
        <div className="max-w-[700px] mx-auto space-y-6">
            <PageBreadcrumb items={[
                { label: "Dashboard", href: "/school" },
                { label: "Teachers", href: "/school/teachers" },
                { label: teacher.name, href: `/school/teachers/${teacherId}` },
                { label: "Wellness" },
            ]} />

            {/* Header */}
            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"><ArrowLeft size={18} /></button>
                <div>
                    <h1 className="text-[22px] font-bold text-slate-800">Manage Wellness</h1>
                    <p className="text-[13px] text-slate-500">{teacher.name} — {teacher.employeeId}</p>
                </div>
            </div>

            {/* Current Status */}
            {hasExistingWellness && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle size={18} className="text-amber-600 mt-0.5" />
                    <div className="flex-1">
                        <p className="font-semibold text-amber-800 text-sm">Currently on {teacher.wellness.type} leave</p>
                        <p className="text-xs text-amber-700 mt-0.5">{teacher.wellness.startDate} – {teacher.wellness.expectedEndDate}</p>
                        {teacher.replacement && <p className="text-xs text-amber-700 mt-1">Replacement: {MOCK_TEACHERS.find(t => t.id === teacher.replacement)?.name || "Unknown"}</p>}
                    </div>
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
                <h2 className="font-semibold text-slate-800">{hasExistingWellness ? "Update Wellness" : "Set Wellness State"}</h2>

                {/* Wellness Type */}
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Wellness Type</label>
                    <div className="grid grid-cols-2 gap-2">
                        {WELLNESS_TYPES.map(wt => (
                            <button key={wt.value} type="button" onClick={() => setWellnessType(wt.value)}
                                className={cn("flex items-center gap-2 p-3 rounded-lg border text-sm font-medium transition-all text-left",
                                    wellnessType === wt.value ? "border-violet-500 bg-violet-50 text-violet-700" : "border-slate-200 text-slate-600 hover:bg-slate-50")}>
                                <span className="text-lg">{wt.icon}</span>
                                <div><p className="text-xs font-semibold">{wt.label}</p><p className="text-[10px] opacity-70">{wt.duration}</p></div>
                            </button>
                        ))}
                    </div>
                    {wellnessType && (
                        <button type="button" onClick={() => setWellnessType("")} className="text-xs text-slate-400 hover:text-red-500 mt-2">Clear selection</button>
                    )}
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Start Date</label><input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 transition-all" /></div>
                    <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Expected End Date</label><input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 transition-all" /></div>
                </div>

                {/* Notes */}
                <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Notes</label><textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Additional details..." className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 transition-all resize-none" /></div>

                {/* Requires Replacement */}
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div><p className="text-sm font-semibold text-slate-700">Requires Replacement</p><p className="text-xs text-slate-500">Auto-assign or manually select a substitute teacher</p></div>
                    <button type="button" onClick={() => setRequiresReplacement(!requiresReplacement)}
                        className={cn("relative w-10 h-5 rounded-full transition-colors", requiresReplacement ? "bg-violet-600" : "bg-slate-300")}>
                        <span className={cn("absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform", requiresReplacement ? "left-5" : "left-0.5")} />
                    </button>
                </div>

                {/* Replacement Selector */}
                {requiresReplacement && (
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Assign Replacement Teacher</label>
                        {availableReplacements.length === 0 ? (
                            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
                                <AlertCircle size={14} className="text-amber-600" />
                                <p className="text-xs text-amber-700">No available teachers match the required subjects.</p>
                            </div>
                        ) : (
                            <select value={selectedReplacement} onChange={e => setSelectedReplacement(e.target.value)}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 bg-white">
                                <option value="">Select a teacher...</option>
                                {availableReplacements.map(t => (
                                    <option key={t.id} value={t.id}>{t.name} — {t.subjects.join(", ")} ({t.currentLoad}/{t.maxLoad} load)</option>
                                ))}
                            </select>
                        )}
                        {selectedReplacement && (
                            <button type="button" onClick={() => setSelectedReplacement("")} className="text-xs text-slate-400 hover:text-red-500 mt-1">Clear selection</button>
                        )}
                    </div>
                )}

                {/* Notify Admin */}
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <input type="checkbox" checked={notifyAdmin} onChange={e => setNotifyAdmin(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500" />
                    <div><p className="text-sm font-medium text-blue-800">Notify Admin</p><p className="text-xs text-blue-600">Send notification before applying changes</p></div>
                </div>

                {/* Actions */}
                <div className="flex justify-between pt-2 border-t border-slate-100">
                    {hasExistingWellness ? (
                        <button type="button" onClick={handleClearWellness} disabled={saving}
                            className="px-4 py-2 rounded-lg border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-50">
                            Clear Wellness
                        </button>
                    ) : <div />}
                    <div className="flex gap-3">
                        <button type="button" onClick={() => router.back()} className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">Cancel</button>
                        <button type="submit" disabled={saving}
                            className="px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-50 transition-colors">
                            {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : <><Check size={14} /> Save Wellness</>}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}