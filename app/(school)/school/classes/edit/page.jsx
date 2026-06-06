"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Check, ArrowLeft, Loader2 } from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import { MOCK_CLASSES } from "@/lib/mock-data"
import { GRADES } from "@/lib/constants"

const SECTIONS = ["A", "B", "C", "D", "E"]

export default function EditClassPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const classId = searchParams.get("id")

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [grade, setGrade] = useState("")
    const [section, setSection] = useState("")
    const [teacher, setTeacher] = useState("")
    const [room, setRoom] = useState("")
    const [status, setStatus] = useState("Active")
    const [notFound, setNotFound] = useState(false)

    useEffect(() => {
        // Simulate fetching class data
        setTimeout(() => {
            const found = MOCK_CLASSES.find(c => c.id === classId)
            if (found) {
                setGrade(found.grade)
                setSection(found.section)
                setTeacher(found.classTeacher || "")
                setRoom(found.room || "")
                setStatus(found.status || "Active")
            } else {
                setNotFound(true)
            }
            setLoading(false)
        }, 400)
    }, [classId])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!grade || !section) return

        setSaving(true)
        await new Promise(r => setTimeout(r, 600))

        // TODO: Call your API to update the class
        console.log("Updated class:", { id: classId, grade, section, classTeacher: teacher, room, status })

        setSaving(false)
        router.push("/school/classes")
    }

    // ─── Not Found State ──────────────────────────────────────────────────
    if (!loading && notFound) {
        return (
            <div className="max-w-[600px] mx-auto space-y-6">
                <PageBreadcrumb
                    items={[
                        { label: "Dashboard", href: "/school" },
                        { label: "Classes", href: "/school/classes" },
                        { label: "Edit Class" },
                    ]}
                />
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-16 text-center">
                    <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                        <ArrowLeft size={24} className="text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">Class not found</h3>
                    <p className="text-sm text-slate-500 mb-6">
                        This class may have been deleted or the link is invalid.
                    </p>
                    <button
                        onClick={() => router.push("/school/classes")}
                        className="px-5 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-colors"
                    >
                        Back to Classes
                    </button>
                </div>
            </div>
        )
    }

    // ─── Loading State ────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="max-w-[600px] mx-auto space-y-6">
                <PageBreadcrumb
                    items={[
                        { label: "Dashboard", href: "/school" },
                        { label: "Classes", href: "/school/classes" },
                        { label: "Edit Class" },
                    ]}
                />
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5 animate-pulse">
                    <div className="h-5 w-32 bg-slate-100 rounded" />
                    <div className="grid grid-cols-2 gap-4">
                        <div className="h-10 bg-slate-100 rounded-lg" />
                        <div className="h-10 bg-slate-100 rounded-lg" />
                        <div className="h-10 bg-slate-100 rounded-lg" />
                        <div className="h-10 bg-slate-100 rounded-lg" />
                    </div>
                    <div className="flex justify-end gap-3">
                        <div className="h-10 w-24 bg-slate-100 rounded-lg" />
                        <div className="h-10 w-32 bg-slate-100 rounded-lg" />
                    </div>
                </div>
            </div>
        )
    }

    // ─── Edit Form ────────────────────────────────────────────────────────
    return (
        <div className="max-w-[600px] mx-auto space-y-6">
            <PageBreadcrumb
                items={[
                    { label: "Dashboard", href: "/school" },
                    { label: "Classes", href: "/school/classes" },
                    { label: `Edit ${grade}–${section}` },
                ]}
            />

            {/* Back button + title */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
                >
                    <ArrowLeft size={18} />
                </button>
                <div>
                    <h1 className="text-[22px] font-bold text-slate-800">
                        Edit {grade}–{section}
                    </h1>
                    <p className="text-[13px] text-slate-500">
                        Update class details and settings
                    </p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                        <span className="text-violet-600 font-bold text-sm">
                            {grade.replace("Cls ", "")}{section}
                        </span>
                    </div>
                    <h2 className="font-semibold text-slate-800">Class Details</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Grade */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Grade *</label>
                        <select
                            value={grade}
                            onChange={e => setGrade(e.target.value)}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all bg-white"
                        >
                            <option value="">Select grade</option>
                            {GRADES.map(g => (
                                <option key={g} value={g}>{g}</option>
                            ))}
                        </select>
                    </div>

                    {/* Section */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Section *</label>
                        <div className="flex gap-2">
                            {SECTIONS.map(s => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => setSection(s)}
                                    className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${section === s
                                        ? "border-violet-500 bg-violet-600 text-white"
                                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                        }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Class Teacher */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Class Teacher</label>
                        <input
                            value={teacher}
                            onChange={e => setTeacher(e.target.value)}
                            placeholder="e.g. Mr. Rajesh Kumar"
                            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all"
                        />
                    </div>

                    {/* Room Number */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Room Number</label>
                        <input
                            value={room}
                            onChange={e => setRoom(e.target.value)}
                            placeholder="e.g. R-01"
                            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all"
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Status</label>
                        <div className="flex gap-2">
                            {["Active", "Inactive"].map(s => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => setStatus(s)}
                                    className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${status === s
                                        ? s === "Active"
                                            ? "border-emerald-500 bg-emerald-600 text-white"
                                            : "border-slate-500 bg-slate-600 text-white"
                                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                        }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={!grade || !section || saving}
                        className="px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-50 transition-colors"
                    >
                        {saving ? (
                            <><Loader2 size={14} className="animate-spin" /> Saving...</>
                        ) : (
                            <><Check size={14} /> Save Changes</>
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}