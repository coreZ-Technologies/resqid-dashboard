import { Shield, Eye, EyeOff, Lock, QrCode } from "lucide-react"
import { cn } from "@/lib/utils"

const visibilityConfig = {
    PUBLIC: { label: 'Full Visibility', icon: Eye, color: 'emerald' },
    MINIMAL: { label: 'Minimal Profile', icon: EyeOff, color: 'amber' },
    HIDDEN: { label: 'Hidden Profile', icon: Lock, color: 'rose' },
}

export default function EmergencyProfileCard({ student, onToggleVisibility }) {
    const config = visibilityConfig[student.emergencyVisibility]
    const Icon = config.icon

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-rose-50 to-amber-50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><Shield size={18} className="text-rose-600" /><h3 className="font-semibold text-slate-800">Emergency QR Profile</h3></div>
                    <button onClick={onToggleVisibility} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-white transition-colors"><Icon size={14} />{config.label}</button>
                </div>
            </div>
            <div className="p-4 space-y-3">
                <div className="bg-slate-50 rounded-lg p-3 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 flex items-center justify-center"><QrCode size={24} className="text-slate-600" /></div>
                    <div>
                        <p className="text-xs text-slate-400">QR Code ID</p>
                        <p className="font-mono text-sm text-slate-700">{student.qrCodeId}</p>
                    </div>
                </div>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-1.5 border-b border-slate-50"><span className="text-slate-500">Blood Group</span><span className="font-bold text-rose-600">{student.medicalInfo.bloodGroup}</span></div>
                    <div className="flex justify-between py-1.5 border-b border-slate-50"><span className="text-slate-500">Allergies</span><span>{student.medicalInfo.allergies?.length || 0} recorded</span></div>
                    <div className="flex justify-between py-1.5"><span className="text-slate-500">Emergency Contacts</span><span>{student.emergencyContacts.length} contacts</span></div>
                </div>
                <button className="w-full py-2 rounded-lg bg-gradient-to-r from-violet-500 to-violet-700 text-white text-sm font-medium hover:opacity-90 transition-all">Preview Emergency Profile</button>
            </div>
        </div>
    )
}