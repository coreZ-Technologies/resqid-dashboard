"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { CreditCard, AlertTriangle, RefreshCw, Check, Plus, Eye, Download, Printer, Lock, RotateCcw } from "lucide-react"
import PageHeader from "@/components/shared/PageHeader"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import { KpiCard } from "@/components/shared/KpiCard"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { EmptyState } from "@/components/shared/EmptyState"
import { useConfirmDialog } from "@/components/shared/ConfirmDialog"
import CardFilters from "@/components/modules/cards/CardFilters"
import ToolbarActions from "@/components/shared/ToolbarActions"
import { MOCK_CARDS } from "@/lib/mock-data"

export default function CardsPage() {
    const router = useRouter()
    const [cards, setCards] = useState(MOCK_CARDS)
    const [search, setSearch] = useState("")
    const [classFilter, setClassFilter] = useState("")
    const [sectionFilter, setSectionFilter] = useState("")
    const [statusFilter, setStatusFilter] = useState("All")
    const { confirmDialog, confirm } = useConfirmDialog()

    const filtered = useMemo(() => cards.filter(c => {
        const matchClass = !classFilter || c.class === classFilter
        const matchSection = !sectionFilter || c.section === sectionFilter
        const matchStatus = statusFilter === "All" || c.status === statusFilter
        const matchSearch = !search || c.studentName.toLowerCase().includes(search.toLowerCase()) || c.cardNumber.toLowerCase().includes(search.toLowerCase()) || c.qrCodeId.toLowerCase().includes(search.toLowerCase())
        return matchClass && matchSection && matchStatus && matchSearch
    }), [cards, search, classFilter, sectionFilter, statusFilter])

    const activeCount = cards.filter(c => c.status === "active").length
    const lostCount = cards.filter(c => c.status === "lost").length
    const replacedCount = cards.filter(c => c.status === "replaced").length
    const needsAction = cards.filter(c => c.status === "lost" && c.printCount < 2).length

    const handleReportLost = async (cardId) => {
        const ok = await confirm({ variant: "warning", title: "Report card as lost?", description: "This will deactivate the card. A replacement can be issued.", confirmLabel: "Report Lost" })
        if (ok) setCards(prev => prev.map(c => c.id === cardId ? { ...c, status: "lost", history: [...c.history, { date: new Date().toISOString().split('T')[0], action: "lost", note: "Reported lost by admin" }] } : c))
    }

    const handleReplace = (cardId) => {
        setCards(prev => prev.map(c => c.id === cardId ? { ...c, status: "replaced", printCount: c.printCount + 1, lastPrinted: new Date().toISOString().split('T')[0], cardNumber: `RESQID-2024-${String(Math.floor(Math.random() * 9000) + 1000)}`, history: [...c.history, { date: new Date().toISOString().split('T')[0], action: "replaced", note: "Replacement card issued" }] } : c))
    }

    const handleDeactivate = async (cardId) => {
        const ok = await confirm({ variant: "danger", title: "Deactivate card?", description: "This card will no longer work for attendance or emergency scans.", confirmLabel: "Deactivate" })
        if (ok) setCards(prev => prev.map(c => c.id === cardId ? { ...c, status: "deactivated", history: [...c.history, { date: new Date().toISOString().split('T')[0], action: "deactivated", note: "Deactivated by admin" }] } : c))
    }

    return (
        <div className="max-w-[1300px] space-y-6">
            {confirmDialog}

            <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "ID Cards" }]} />

            <PageHeader title="ID Card Management" description="Manage student ID cards, QR codes, and card status"
                badge={needsAction > 0 ? `${needsAction} need action` : null}>
                <div className="flex items-center gap-2">
                    <ToolbarActions onRefresh={() => console.log("Refreshing...")} onExport={() => console.log("Exporting...")} />
                    <button onClick={() => router.push("/school/cards/generate")}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-violet-700 text-white text-sm font-semibold shadow-sm shadow-violet-200 hover:from-violet-600 hover:to-violet-800 transition-all"><Plus size={16} /> Generate QR
                    </button>

                    <button
                        onClick={() => router.push("/school/cards/lost")}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 text-sm font-medium hover:bg-amber-100 hover:border-amber-300 transition-all shadow-sm"
                    >
                        <AlertTriangle size={15} /> Lost Cards
                    </button>
                </div>
            </PageHeader>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard title="Total Cards" value={cards.length} icon={CreditCard} iconColor="blue" />
                <KpiCard title="Active" value={activeCount} icon={Check} iconColor="green" />
                <KpiCard title="Lost" value={lostCount} icon={AlertTriangle} iconColor={lostCount > 0 ? "red" : "green"} />
                <KpiCard title="Replaced" value={replacedCount} icon={RefreshCw} iconColor="amber" />
            </div>

            <CardFilters search={search} onSearchChange={setSearch} classFilter={classFilter} onClassChange={setClassFilter}
                sectionFilter={sectionFilter} onSectionChange={setSectionFilter} statusFilter={statusFilter} onStatusChange={setStatusFilter} />

            <p className="text-sm text-slate-500">Showing <span className="font-semibold text-slate-700">{filtered.length}</span> card{filtered.length !== 1 ? "s" : ""}</p>

            {filtered.length === 0 ? (
                <EmptyState preset="search" title="No cards found" description="Try adjusting your filters"
                    action={{ label: "Generate QR Codes", onClick: () => router.push("/school/cards/generate") }} />
            ) : (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50">
                                    {["Card #", "Student", "Class", "QR ID", "Status", "Printed", "Actions"].map(h => (
                                        <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(card => (
                                    <tr key={card.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                                        <td className="px-4 py-3 font-mono text-xs text-slate-600">{card.cardNumber}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-semibold text-xs">
                                                    {card.studentName.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <span className="font-medium text-slate-700">{card.studentName}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-slate-500">{card.class}-{card.section}</td>
                                        <td className="px-4 py-3 font-mono text-xs text-slate-400">{card.qrCodeId}</td>
                                        <td className="px-4 py-3">
                                            <StatusBadge status={card.status === "active" ? "present" : card.status === "lost" ? "absent" : card.status === "replaced" ? "pending" : "inactive"} size="sm" label={card.status} />
                                        </td>
                                        <td className="px-4 py-3 text-xs text-slate-400">{card.lastPrinted}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1">
                                                <button onClick={() => router.push(`/school/cards/${card.id}`)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-violet-600 transition-colors"><Eye size={14} /></button>
                                                <button onClick={() => window.print()} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"><Printer size={14} /></button>
                                                {card.status === "active" && (
                                                    <>
                                                        <button onClick={() => handleReportLost(card.id)} className="p-1.5 rounded-lg hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition-colors"><AlertTriangle size={14} /></button>
                                                        <button onClick={() => handleDeactivate(card.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"><Lock size={14} /></button>
                                                    </>
                                                )}
                                                {card.status === "lost" && (
                                                    <button onClick={() => handleReplace(card.id)} className="p-1.5 rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-colors"><RotateCcw size={14} /></button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}