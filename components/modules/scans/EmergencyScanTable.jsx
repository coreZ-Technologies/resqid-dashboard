import { MapPin, Smartphone, Eye, Bell, BellOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { cn } from "@/lib/utils"

const typeConfig = {
    emergency: { label: "Emergency", color: "bg-red-100 text-red-700 border-red-200" },
    test: { label: "Test", color: "bg-blue-100 text-blue-700 border-blue-200" },
    unknown: { label: "Unknown", color: "bg-slate-100 text-slate-500 border-slate-200" },
}

export default function EmergencyScanTable({ scans = [] }) {
    const router = useRouter()

    if (scans.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-16 text-center">
                <p className="text-sm text-slate-400">No scan logs found.</p>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50">
                            {["Time", "Student", "Scanned By", "Location", "Type", "Alert", ""].map(h => (
                                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {scans.map(scan => {
                            const type = typeConfig[scan.emergencyType] || typeConfig.unknown
                            return (
                                <tr key={scan.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                    <td className="px-4 py-3">
                                        <p className="text-xs font-medium text-slate-700">{scan.time}</p>
                                        <p className="text-[10px] text-slate-400">{scan.date}</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="text-sm font-medium text-slate-700">{scan.studentName}</p>
                                        <p className="text-xs text-slate-400">{scan.class}</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1 text-xs text-slate-500">
                                            <Smartphone size={11} className="text-slate-400" />
                                            {scan.scannedBy}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1 text-xs text-slate-500">
                                            <MapPin size={11} className="text-slate-400" />
                                            {scan.location}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold border", type.color)}>{type.label}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1">
                                            {scan.alertStatus === "delivered" ? <Bell size={12} className="text-emerald-500" /> : <BellOff size={12} className="text-red-400" />}
                                            <span className={cn("text-xs", scan.alertStatus === "delivered" ? "text-emerald-600" : "text-red-500")}>
                                                {scan.alertStatus === "delivered" ? "Sent" : "Failed"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button onClick={() => router.push(`/school/scans/${scan.id}`)}
                                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-violet-600 transition-colors"><Eye size={14} /></button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}