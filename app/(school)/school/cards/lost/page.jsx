"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, AlertTriangle, RotateCcw, Search } from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { MOCK_CARDS } from "@/lib/mock-data"

export default function LostCardsPage() {
    const router = useRouter()
    const [search, setSearch] = useState("")
    const [cards, setCards] = useState(MOCK_CARDS)

    const lostCards = useMemo(() => cards.filter(c =>
        (c.status === "lost" || c.status === "replaced") &&
        (!search || c.studentName.toLowerCase().includes(search.toLowerCase()) || c.cardNumber.toLowerCase().includes(search.toLowerCase()))
    ), [cards, search])

    const lostCount = cards.filter(c => c.status === "lost").length
    const replacedCount = cards.filter(c => c.status === "replaced").length

    const handleReplace = (cardId) => {
        setCards(prev => prev.map(c => c.id === cardId ? {
            ...c, status: "replaced", printCount: c.printCount + 1,
            lastPrinted: new Date().toISOString().split('T')[0],
            cardNumber: `RESQID-2024-${String(Math.floor(Math.random() * 9000) + 1000)}`,
            history: [...c.history, { date: new Date().toISOString().split('T')[0], action: "replaced", note: "Replacement card issued" }]
        } : c))
    }

    return (
        <div className="max-w-[1300px] mx-auto space-y-6">
            <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "ID Cards", href: "/school/cards" }, { label: "Lost & Replaced" }]} />

            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"><ArrowLeft size={18} /></button>
                <div>
                    <h1 className="text-[22px] font-bold text-slate-800">Lost & Replaced Cards</h1>
                    <p className="text-[13px] text-slate-500">Track lost cards and issue replacements</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { label: "Lost (Pending)", value: lostCount, color: "bg-red-500" },
                    { label: "Replaced", value: replacedCount, color: "bg-emerald-500" },
                    { label: "Total Affected", value: lostCount + replacedCount, color: "bg-amber-500" },
                ].map(s => (
                    <div key={s.label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
                        <div className={`w-2 h-10 rounded-full ${s.color}`} />
                        <div><p className="text-xl font-bold text-slate-800">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div>
                    </div>
                ))}
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search student or card..."
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-violet-500" />
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                {["Card #", "Student", "Class", "Status", "Lost/Replaced Date", "Action"].map(h => (
                                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {lostCards.length === 0 ? (
                                <tr><td colSpan={6} className="px-4 py-16 text-center text-sm text-slate-400">No lost cards. 🎉</td></tr>
                            ) : (
                                lostCards.map(card => (
                                    <tr key={card.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                                        <td className="px-4 py-3 font-mono text-xs text-slate-600">{card.cardNumber}</td>
                                        <td className="px-4 py-3 font-medium text-slate-700">{card.studentName}</td>
                                        <td className="px-4 py-3 text-xs text-slate-500">{card.class}-{card.section}</td>
                                        <td className="px-4 py-3"><StatusBadge status={card.status === "lost" ? "absent" : "pending"} size="sm" label={card.status} /></td>
                                        <td className="px-4 py-3 text-xs text-slate-400">{card.history[card.history.length - 1]?.date}</td>
                                        <td className="px-4 py-3">
                                            {card.status === "lost" && (
                                                <button onClick={() => handleReplace(card.id)}
                                                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-1.5"><RotateCcw size={11} />Replace</button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}