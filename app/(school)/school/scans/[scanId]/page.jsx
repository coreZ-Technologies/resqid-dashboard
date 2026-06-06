"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, User, MapPin, Clock, Smartphone, AlertTriangle, Bell, BellOff, X } from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { MOCK_EMERGENCY_SCANS } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export default function ScanDetailPage() {
    const router = useRouter()
    const params = useParams()
    const scanId = params.scanId

    const [loading, setLoading] = useState(true)
    const [scan, setScan] = useState(null)
    const [notFound, setNotFound] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            const found = MOCK_EMERGENCY_SCANS.find(s => s.id === scanId)
            if (found) setScan(found)
            else setNotFound(true)
            setLoading(false)
        }, 400)
    }, [scanId])

    if (!loading && notFound) {
        return (
            <div className="max-w-[600px] mx-auto space-y-6">
                <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "QR Scan Logs", href: "/school/scans" }, { label: "Not Found" }]} />
                <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
                    <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4"><X size={24} className="text-slate-400" /></div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">Scan not found</h3>
                    <button onClick={() => router.push("/school/scans")} className="px-5 py-2.5 rounded-lg bg-violet-600 text-white text-sm font-semibold">Back to Scans</button>
                </div>
            </div>
        )
    }

    if (loading) return <div className="max-w-[700px] mx-auto space-y-6"><div className="h-64 bg-slate-100 rounded-xl animate-pulse" /></div>

    const typeConfig = { emergency: { label: "Emergency", color: "bg-red-100 text-red-700" }, test: { label: "Test", color: "bg-blue-100 text-blue-700" }, unknown: { label: "Unknown", color: "bg-slate-100 text-slate-500" } }
    const type = typeConfig[scan.emergencyType] || typeConfig.unknown

    return (
        <div className="max-w-[700px] mx-auto space-y-6">
            <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "QR Scan Logs", href: "/school/scans" }, { label: "Scan Detail" }]} />

            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"><ArrowLeft size={18} /></button>
                <div><h1 className="text-[22px] font-bold text-slate-800">Scan Detail</h1><p className="text-[13px] text-slate-500">{scan.date} · {scan.time}</p></div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
                <div className="flex items-center justify-between">
                    <span className={cn("px-3 py-1 rounded-full text-xs font-semibold border", type.color)}>{type.label}</span>
                    <div className="flex items-center gap-1.5">
                        {scan.alertStatus === "delivered" ? <Bell size={14} className="text-emerald-500" /> : <BellOff size={14} className="text-red-400" />}
                        <span className={cn("text-xs font-medium", scan.alertStatus === "delivered" ? "text-emerald-600" : "text-red-500")}>
                            {scan.alertStatus === "delivered" ? "Alert Delivered" : "Alert Failed"}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                    {[
                        { icon: User, label: "Student", value: scan.studentName },
                        { icon: User, label: "Class", value: scan.class },
                        { icon: Clock, label: "Time", value: `${scan.date} · ${scan.time}` },
                        { icon: MapPin, label: "Location", value: scan.location },
                        { icon: Smartphone, label: "Scanned By", value: scan.scannedBy },
                        { icon: Smartphone, label: "Device", value: scan.device },
                    ].map(r => (
                        <div key={r.label} className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center"><r.icon size={16} className="text-slate-500" /></div>
                            <div><p className="text-xs text-slate-400 uppercase">{r.label}</p><p className="font-medium text-slate-700">{r.value}</p></div>
                        </div>
                    ))}
                </div>

                {scan.notes && (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                        <p className="text-xs text-slate-400 uppercase mb-1">Notes</p>
                        <p className="text-sm text-slate-700">{scan.notes}</p>
                    </div>
                )}

                {scan.emergencyType === "emergency" && (
                    <div className={cn("p-4 rounded-lg flex items-start gap-3", scan.alertStatus === "delivered" ? "bg-emerald-50 border border-emerald-200" : "bg-red-50 border border-red-200")}>
                        {scan.alertStatus === "delivered" ? <Bell size={16} className="text-emerald-600 mt-0.5" /> : <AlertTriangle size={16} className="text-red-600 mt-0.5" />}
                        <div>
                            <p className="text-sm font-semibold">{scan.alertStatus === "delivered" ? "Parents Notified" : "Alert Delivery Failed"}</p>
                            <p className="text-xs mt-0.5">{scan.alertStatus === "delivered" ? (scan.parentResponded ? "Parent has responded to the alert." : "Parent has not yet responded.") : "System failed to deliver notification. Check parent contact details."}</p>
                        </div>
                    </div>
                )}

                <div className="flex gap-2 pt-3 border-t border-slate-100">
                    {scan.studentId && (
                        <button onClick={() => router.push(`/school/students/${scan.studentId}`)}
                            className="flex-1 py-2 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors">View Student Emergency Profile</button>
                    )}
                    <button className="py-2 px-4 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50 transition-colors">Resend Alert</button>
                </div>
            </div>
        </div>
    )
}