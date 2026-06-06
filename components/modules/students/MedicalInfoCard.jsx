import { Stethoscope, User, Phone, Home, Droplet } from "lucide-react"
import { cn } from "@/lib/utils"

function Chip({ label, items, color }) {
    if (!items?.length) return null
    const colors = { red: "bg-rose-50 text-rose-700 border-rose-200", amber: "bg-amber-50 text-amber-700 border-amber-200", blue: "bg-sky-50 text-sky-700 border-sky-200" }
    return (
        <div>
            <p className="text-xs font-medium text-slate-500 mb-1.5">{label}</p>
            <div className="flex flex-wrap gap-1.5">{items.map((item, i) => <span key={i} className={cn("px-2.5 py-1 rounded-full text-xs font-medium border", colors[color])}>{item}</span>)}</div>
        </div>
    )
}

export default function MedicalInfoCard({ medicalInfo }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-5">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2"><Stethoscope size={18} className="text-purple-600" />Medical Information</h3>
            <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs text-slate-400">Blood Group</p><p className="text-lg font-bold text-rose-600">{medicalInfo.bloodGroup}</p></div>
                <div><p className="text-xs text-slate-400">Last Checkup</p><p className="text-sm text-slate-700">{new Date(medicalInfo.lastCheckup).toLocaleDateString()}</p></div>
            </div>
            <Chip label="Allergies" items={medicalInfo.allergies} color="red" />
            <Chip label="Conditions" items={medicalInfo.conditions} color="amber" />
            <Chip label="Medications" items={medicalInfo.medications} color="blue" />

            {medicalInfo.doctor && (
                <div className="border-t border-slate-100 pt-4 space-y-2">
                    <p className="text-sm font-medium text-slate-700">Doctor</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2"><User size={13} className="text-slate-400" /><span>{medicalInfo.doctor.name}</span></div>
                        <div className="flex items-center gap-2"><Stethoscope size={13} className="text-slate-400" /><span>{medicalInfo.doctor.specialization}</span></div>
                        <div className="flex items-center gap-2"><Phone size={13} className="text-slate-400" /><span>{medicalInfo.doctor.phone}</span></div>
                        <div className="flex items-center gap-2"><Home size={13} className="text-slate-400" /><span className="truncate">{medicalInfo.doctor.clinic}</span></div>
                    </div>
                </div>
            )}

            {medicalInfo.emergencyInstructions && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg">
                    <p className="text-xs text-rose-600 font-medium mb-1">Emergency Instructions</p>
                    <p className="text-sm text-rose-700">{medicalInfo.emergencyInstructions}</p>
                </div>
            )}
        </div>
    )
}