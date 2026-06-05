"use client"

import { useState, useEffect } from "react"
import { X, Check, Loader2, ChevronDown, LayoutGrid } from "lucide-react"
import { GRADES } from "@/lib/constants"

const SECTIONS = ["A", "B", "C", "D", "E"]

export default function ClassModal({ cls, onClose, onSave }) {
    const [grade, setGrade] = useState("")
    const [section, setSection] = useState("")
    const [teacher, setTeacher] = useState("")
    const [room, setRoom] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (cls) {
            setGrade(cls.grade || "")
            setSection(cls.section || "")
            setTeacher(cls.classTeacher || "")
            setRoom(cls.room || "")
        }
    }, [cls])

    const handleSave = async () => {
        if (!grade || !section) return
        setLoading(true)
        await new Promise(r => setTimeout(r, 700))
        onSave({ grade, section, classTeacher: teacher, room })
        setLoading(false)
        onClose()
    }

    return (
        <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl w-full max-w-md shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
                            <LayoutGrid size={17} className="text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-lg leading-tight">
                                {cls ? "Edit Class" : "Add Class"}
                            </h3>
                            <p className="text-xs text-slate-500">
                                {cls ? "Update class details" : "Fill in the class details"}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    {/* Grade */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            Grade *
                        </label>
                        <div className="relative">
                            <select
                                value={grade}
                                onChange={e => setGrade(e.target.value)}
                                className="w-full appearance-none border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white cursor-pointer transition-all"
                            >
                                <option value="">Select grade</option>
                                {GRADES.map(g => (
                                    <option key={g} value={g}>{g}</option>
                                ))}
                            </select>
                            <ChevronDown
                                size={14}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                            />
                        </div>
                    </div>

                    {/* Section */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            Section *
                        </label>
                        <div className="flex gap-2">
                            {SECTIONS.map(s => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => setSection(s)}
                                    className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${section === s
                                            ? "border-blue-500 bg-blue-600 text-white shadow-sm"
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
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            Class Teacher
                        </label>
                        <input
                            value={teacher}
                            onChange={e => setTeacher(e.target.value)}
                            placeholder="e.g. Mr. Rajesh Kumar"
                            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                        />
                    </div>

                    {/* Room Number */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            Room Number
                        </label>
                        <input
                            value={room}
                            onChange={e => setRoom(e.target.value)}
                            placeholder="e.g. R-01"
                            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!grade || !section || loading}
                        className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? (
                            <Loader2 size={14} className="animate-spin" />
                        ) : (
                            <Check size={14} />
                        )}
                        {cls ? "Save Changes" : "Add Class"}
                    </button>
                </div>
            </div>
        </div>
    )
}