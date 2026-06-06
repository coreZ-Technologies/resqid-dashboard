"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import {
    ArrowLeft, QrCode, Printer, Download, AlertTriangle,
    RotateCcw, Lock, Shield, Clock, Check, X, CreditCard
} from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { MOCK_CARDS } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export default function CardDetailPage() {
    const router = useRouter()
    const params = useParams()
    const cardId = params.cardId

    const [loading, setLoading] = useState(true)
    const [card, setCard] = useState(null)
    const [notFound, setNotFound] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            const found = MOCK_CARDS.find(c => c.id === cardId)
            if (found) setCard(found)
            else setNotFound(true)
            setLoading(false)
        }, 400)
    }, [cardId])

    if (!loading && notFound) {
        return (
            <div className="max-w-[600px] mx-auto space-y-6">
                <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "ID Cards", href: "/school/cards" }, { label: "Not Found" }]} />
                <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
                    <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4"><X size={24} className="text-slate-400" /></div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">Card not found</h3>
                    <button onClick={() => router.push("/school/cards")} className="px-5 py-2.5 rounded-lg bg-violet-600 text-white text-sm font-semibold">Back to Cards</button>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="max-w-[900px] mx-auto space-y-6">
                <div className="h-5 w-48 bg-slate-200 rounded animate-pulse" />
                <div className="h-64 bg-slate-100 rounded-xl animate-pulse" />
            </div>
        )
    }

    const historyIcons = {
        issued: Check,
        lost: AlertTriangle,
        replaced: RotateCcw,
        deactivated: Lock,
    }

    const historyColors = {
        issued: "text-emerald-600 bg-emerald-50",
        lost: "text-amber-600 bg-amber-50",
        replaced: "text-blue-600 bg-blue-50",
        deactivated: "text-red-600 bg-red-50",
    }

    return (
        <div className="max-w-[900px] mx-auto space-y-6">
            <PageBreadcrumb items={[
                { label: "Dashboard", href: "/school" },
                { label: "ID Cards", href: "/school/cards" },
                { label: card.cardNumber },
            ]} />

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"><ArrowLeft size={18} /></button>
                    <div>
                        <h1 className="text-[22px] font-bold text-slate-800">{card.cardNumber}</h1>
                        <p className="text-[13px] text-slate-500">{card.studentName} · Class {card.class}-{card.section}</p>
                    </div>
                </div>
                <StatusBadge status={card.status === "active" ? "present" : card.status === "lost" ? "absent" : card.status === "replaced" ? "pending" : "inactive"} label={card.status} />
            </div>

            {/* Two Column */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Left — QR Preview + Actions */}
                <div className="space-y-6">
                    {/* QR Code Preview */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center">
                        <div className="w-48 h-48 bg-slate-100 rounded-xl mx-auto mb-4 flex items-center justify-center border-2 border-slate-200">
                            <QrCode size={100} className="text-slate-400" />
                        </div>
                        <p className="text-xs font-mono text-slate-400 mb-4">{card.qrCodeId}</p>
                        <div className="flex gap-2">
                            <button className="flex-1 py-2 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors flex items-center justify-center gap-1.5"><Download size={14} />Download</button>
                            <button className="flex-1 py-2 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"><Printer size={14} />Print</button>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                        <h3 className="font-semibold text-slate-800 mb-3">Actions</h3>
                        <div className="space-y-2">
                            {card.status === "active" && (
                                <>
                                    <button className="w-full flex items-center gap-2 p-2.5 rounded-lg hover:bg-amber-50 text-amber-700 text-sm transition-colors"><AlertTriangle size={14} />Report Lost</button>
                                    <button className="w-full flex items-center gap-2 p-2.5 rounded-lg hover:bg-red-50 text-red-600 text-sm transition-colors"><Lock size={14} />Deactivate Card</button>
                                </>
                            )}
                            {card.status === "lost" && (
                                <button className="w-full flex items-center gap-2 p-2.5 rounded-lg hover:bg-emerald-50 text-emerald-700 text-sm transition-colors"><RotateCcw size={14} />Issue Replacement</button>
                            )}
                            <button className="w-full flex items-center gap-2 p-2.5 rounded-lg hover:bg-slate-50 text-slate-600 text-sm transition-colors"><Printer size={14} />Print Card</button>
                            <button className="w-full flex items-center gap-2 p-2.5 rounded-lg hover:bg-slate-50 text-slate-600 text-sm transition-colors"><Download size={14} />Download QR</button>
                        </div>
                    </div>
                </div>

                {/* Right — Card Info + History */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Card Info */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                        <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><CreditCard size={18} className="text-violet-600" />Card Information</h2>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            {[
                                { label: "Card Number", value: card.cardNumber },
                                { label: "QR Code ID", value: card.qrCodeId },
                                { label: "Student Name", value: card.studentName },
                                { label: "Class & Section", value: `${card.class}-${card.section}` },
                                { label: "Roll Number", value: card.rollNo },
                                { label: "Blood Group", value: card.bloodGroup },
                                { label: "Status", value: <span className="capitalize">{card.status}</span> },
                                { label: "Issued Date", value: card.issuedDate },
                                { label: "Last Printed", value: card.lastPrinted },
                                { label: "Print Count", value: `${card.printCount} time${card.printCount !== 1 ? 's' : ''}` },
                            ].map(r => (
                                <div key={r.label}><p className="text-xs text-slate-400 uppercase">{r.label}</p><p className="font-medium text-slate-700">{r.value}</p></div>
                            ))}
                        </div>
                    </div>

                    {/* History Timeline */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                        <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><Clock size={18} className="text-violet-600" />Card History</h2>
                        <div className="space-y-0">
                            {card.history.map((event, i) => {
                                const Icon = historyIcons[event.action] || Check
                                const isLast = i === card.history.length - 1
                                return (
                                    <div key={i} className="flex gap-3">
                                        <div className="flex flex-col items-center">
                                            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", historyColors[event.action] || "bg-slate-100 text-slate-500")}>
                                                <Icon size={14} />
                                            </div>
                                            {!isLast && <div className="w-0.5 flex-1 bg-slate-200" />}
                                        </div>
                                        <div className={cn("pb-4", isLast && "pb-0")}>
                                            <p className="text-sm font-medium text-slate-700 capitalize">{event.action}</p>
                                            <p className="text-xs text-slate-500">{event.note}</p>
                                            <p className="text-xs text-slate-400 mt-0.5">{event.date}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}