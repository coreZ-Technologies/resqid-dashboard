"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter, useParams } from "next/navigation"
import {
    ArrowLeft, Edit2, Download, RotateCcw, Save, GripVertical,
    Check, X, AlertTriangle
} from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import { StatusBadge } from "@/components/shared/StatusBadge"
import TimetableGrid from "@/components/modules/timetable/TimetableGrid"
import IssuesList from "@/components/modules/timetable/IssuesList"
import { MOCK_TIMETABLE, MOCK_CLASSES } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export default function ClassTimetablePage() {
    const router = useRouter()
    const params = useParams()
    const classId = params.classId

    const [loading, setLoading] = useState(true)
    const [cls, setCls] = useState(null)
    const [slots, setSlots] = useState([])
    const [editMode, setEditMode] = useState(false)
    const [draggedSlot, setDraggedSlot] = useState(null)
    const [swapTarget, setSwapTarget] = useState(null)
    const [toast, setToast] = useState(null)
    const [notFound, setNotFound] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            const found = MOCK_CLASSES.find(c => c.id === classId)
            if (found) {
                setCls(found)
                setSlots(MOCK_TIMETABLE.slots.filter(s => s.classId === classId))
            } else {
                setNotFound(true)
            }
            setLoading(false)
        }, 400)
    }, [classId])

    const classIssues = useMemo(() =>
        MOCK_TIMETABLE.issues.filter(i => i.class === `${cls?.grade}–${cls?.section}` || i.class === "—"),
        [cls]
    )

    const showToast = (message, type = "success") => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 2500)
    }

    const handleSlotClick = (slot) => {
        if (!editMode) return
        if (!draggedSlot) {
            setDraggedSlot(slot)
            showToast(`Selected ${slot.subject} (${slot.day} P${slot.period}). Click another slot to swap.`, "info")
        } else {
            if (draggedSlot.day === slot.day && draggedSlot.period === slot.period) {
                setDraggedSlot(null)
                return
            }
            setSwapTarget(slot)
            setTimeout(() => {
                setSlots(prev => prev.map(s => {
                    if (s.day === draggedSlot.day && s.period === draggedSlot.period) return { ...slot, day: draggedSlot.day, period: draggedSlot.period }
                    if (s.day === slot.day && s.period === slot.period) return { ...draggedSlot, day: slot.day, period: slot.period }
                    return s
                }))
                setDraggedSlot(null)
                setSwapTarget(null)
                showToast(`Swapped ${draggedSlot.subject} with ${slot.subject}`, "success")
            }, 300)
        }
    }

    const handleSave = () => {
        console.log("Saving timetable for", classId, slots)
        setEditMode(false)
        setDraggedSlot(null)
        showToast("Timetable saved successfully!", "success")
    }

    const handleCancel = () => {
        setSlots(MOCK_TIMETABLE.slots.filter(s => s.classId === classId))
        setEditMode(false)
        setDraggedSlot(null)
        setSwapTarget(null)
        showToast("Changes discarded", "warning")
    }

    if (!loading && notFound) {
        return (
            <div className="max-w-[600px] mx-auto space-y-6">
                <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "Time Table", href: "/school/timetable" }, { label: "Not Found" }]} />
                <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
                    <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4"><X size={24} className="text-slate-400" /></div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">Class not found</h3>
                    <button onClick={() => router.push("/school/timetable")} className="px-5 py-2.5 rounded-lg bg-violet-600 text-white text-sm font-semibold">Back to Timetable</button>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="max-w-[1300px] mx-auto space-y-6">
                <div className="h-5 w-48 bg-slate-200 rounded animate-pulse" />
                <div className="h-[500px] bg-slate-100 rounded-xl animate-pulse" />
            </div>
        )
    }

    return (
        <div className="max-w-[1300px] mx-auto space-y-6">
            {/* Toast */}
            {toast && (
                <div className={cn(
                    "fixed top-20 right-6 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-in slide-in-from-right-2 duration-300",
                    toast.type === "success" ? "bg-emerald-600 text-white" :
                        toast.type === "warning" ? "bg-amber-600 text-white" :
                            "bg-blue-600 text-white"
                )}>
                    {toast.type === "success" ? <Check size={14} className="inline mr-1.5" /> :
                        toast.type === "warning" ? <AlertTriangle size={14} className="inline mr-1.5" /> :
                            <GripVertical size={14} className="inline mr-1.5" />}
                    {toast.message}
                </div>
            )}

            <PageBreadcrumb items={[
                { label: "Dashboard", href: "/school" },
                { label: "Time Table", href: "/school/timetable" },
                { label: `${cls.grade}–${cls.section}` },
            ]} />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"><ArrowLeft size={18} /></button>
                    <div>
                        <h1 className="text-[22px] font-bold text-slate-800">{cls.grade}–{cls.section} Timetable</h1>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-slate-500">{cls.classTeacher}</span>
                            <StatusBadge status="active" size="sm" />
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {editMode ? (
                        <>
                            <button onClick={handleCancel} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"><X size={15} /> Cancel</button>
                            <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"><Save size={15} /> Save Changes</button>
                        </>
                    ) : (
                        <>
                            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm"><Download size={15} /> Export</button>
                            <button onClick={() => setEditMode(true)}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors shadow-sm"><Edit2 size={15} /> Edit Timetable</button>
                        </>
                    )}
                </div>
            </div>

            {/* Edit Mode Banner */}
            {editMode && (
                <div className="bg-violet-50 border border-violet-200 rounded-xl p-3 flex items-center gap-2">
                    <GripVertical size={16} className="text-violet-600" />
                    <p className="text-sm text-violet-700 font-medium">Edit mode active — click a slot then click another to swap. {draggedSlot && <span className="text-violet-900">Selected: {draggedSlot.subject} ({draggedSlot.day} P{draggedSlot.period})</span>}</p>
                </div>
            )}

            {/* Two Column */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Grid */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                    <h2 className="font-semibold text-slate-800 mb-3">Weekly Schedule</h2>
                    <TimetableGrid
                        slots={slots}
                        onSlotClick={editMode ? handleSlotClick : null}
                        selectedClass={classId}
                    />
                </div>

                {/* Right Panel */}
                <div className="space-y-6">
                    {/* Class Info */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                        <h3 className="font-semibold text-slate-800 mb-3">Class Info</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-slate-500">Grade</span><span className="font-medium">{cls.grade}</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">Section</span><span className="font-medium">{cls.section}</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">Teacher</span><span className="font-medium">{cls.classTeacher}</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">Room</span><span className="font-medium">{cls.room || "—"}</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">Subjects</span><span className="font-medium">{cls.subjects.length}</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">Periods/Week</span><span className="font-medium">{slots.length}</span></div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                            {cls.subjects.map(s => (
                                <span key={s} className="px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600">{s}</span>
                            ))}
                        </div>
                    </div>

                    {/* Issues */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                        <h3 className="font-semibold text-slate-800 mb-3">Issues</h3>
                        <IssuesList issues={classIssues} />
                    </div>
                </div>
            </div>
        </div>
    )
}