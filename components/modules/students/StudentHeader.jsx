import { Mail, Phone, Calendar, GraduationCap, Fingerprint, Droplet, Camera } from "lucide-react"
import { cn } from "@/lib/utils"

export default function StudentHeader({ student }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-violet-50 to-white">
                <div className="flex items-start gap-6">
                    <div className="relative">
                        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center text-white text-3xl font-bold">
                            {student.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm hover:bg-slate-50">
                            <Camera size={14} className="text-slate-500" />
                        </button>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-2xl font-bold text-slate-800">{student.name}</h1>
                            <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold", student.status === 'Active' ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700")}>
                                {student.status}
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-violet-50 text-violet-700 text-xs font-medium"><GraduationCap size={12} />Class {student.class}-{student.section}</span>
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium"><Fingerprint size={12} />Roll No: {student.rollNumber}</span>
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-rose-50 text-rose-700 text-xs font-medium"><Droplet size={12} />Blood: {student.bloodGroup}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                            <div className="flex items-center gap-2 text-slate-600"><Mail size={14} className="text-slate-400" />{student.email}</div>
                            <div className="flex items-center gap-2 text-slate-600"><Phone size={14} className="text-slate-400" />{student.phone}</div>
                            <div className="flex items-center gap-2 text-slate-600"><Calendar size={14} className="text-slate-400" />DOB: {new Date(student.dateOfBirth).toLocaleDateString()}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4">
                {[
                    { label: "Attendance", value: `${student.attendance.percentage}%`, color: "text-violet-600" },
                    { label: "Guardians", value: student.parents.length, color: "text-purple-600" },
                    { label: "Emergency Contacts", value: student.emergencyContacts.length, color: "text-amber-600" },
                    { label: "Documents", value: student.documents.length, color: "text-emerald-600" },
                ].map(s => (
                    <div key={s.label} className="bg-white p-4 text-center border-r border-slate-100 last:border-r-0">
                        <p className={cn("text-2xl font-bold", s.color)}>{s.value}</p>
                        <p className="text-xs text-slate-500">{s.label}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}