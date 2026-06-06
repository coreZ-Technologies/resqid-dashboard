"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Printer, Check, X } from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import { MOCK_CARDS } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const CLASSES = ['Nursery', 'LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']

export default function PrintCardsPage() {
    const router = useRouter()
    const [selectedClass, setSelectedClass] = useState("")
    const [selected, setSelected] = useState([])
    const [cards] = useState(MOCK_CARDS.filter(c => c.status === "active"))

    const filtered = useMemo(() => selectedClass ? cards.filter(c => c.class === selectedClass) : cards, [cards, selectedClass])

    const toggleCard = (id) => setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
    const selectAll = () => setSelected(filtered.map(c => c.id))
    const clearAll = () => setSelected([])

    const handlePrint = () => {
        const selectedCards = cards.filter(c => selected.includes(c.id))
        const w = window.open('', '_blank')
        const cardsHTML = selectedCards.map(c => `
            <div style="width:45%;border:2px solid #000;border-radius:12px;padding:16px;margin:8px;text-align:center;font-family:sans-serif;display:inline-block;">
                <p style="font-weight:bold;font-size:14px;margin:0 0 8px;">Springdale Public School</p>
                <div style="width:100px;height:100px;background:#f1f5f9;margin:0 auto 8px;display:flex;align-items:center;justify-content:center;border:1px solid #e2e8f0;border-radius:8px;">QR</div>
                <p style="font-weight:bold;font-size:16px;margin:4px 0;">${c.studentName}</p>
                <p style="font-size:12px;color:#64748b;margin:0;">Class ${c.class}-${c.section} | Roll ${c.rollNo}</p>
                <p style="font-size:11px;color:#ef4444;font-weight:bold;margin:4px 0;">Blood: ${c.bloodGroup}</p>
                <p style="font-size:9px;color:#94a3b8;margin:4px 0 0;">${c.qrCodeId}</p>
            </div>
        `).join('')

        w.document.write(`<html><head><title>Print ID Cards</title><style>body{max-width:800px;margin:auto;padding:20px}@media print{body{padding:0}}</style></head><body>${cardsHTML}<script>window.onload=function(){window.print()}</script></body></html>`)
        w.document.close()
    }

    return (
        <div className="max-w-[900px] mx-auto space-y-6">
            <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "ID Cards", href: "/school/cards" }, { label: "Print" }]} />

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"><ArrowLeft size={18} /></button>
                    <div><h1 className="text-[22px] font-bold text-slate-800">Print ID Cards</h1><p className="text-[13px] text-slate-500">Select cards to print (8 per A4 sheet)</p></div>
                </div>
                <button onClick={handlePrint} disabled={selected.length === 0}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 disabled:opacity-50 transition-all"><Printer size={15} />Print {selected.length} Cards</button>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-slate-600">Class:</span>
                <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)}
                    className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-violet-500 bg-white">
                    <option value="">All Classes</option>
                    {CLASSES.map(c => <option key={c} value={c}>Class {c}</option>)}
                </select>
                <span className="ml-auto text-xs text-slate-400">{selected.length} selected</span>
                <button onClick={selectAll} className="text-xs text-violet-500 font-medium">Select All</button>
                <span className="text-slate-300">|</span>
                <button onClick={clearAll} className="text-xs text-slate-400 font-medium">Clear</button>
            </div>

            {/* Card Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {filtered.map(card => (
                    <div key={card.id} onClick={() => toggleCard(card.id)}
                        className={cn("bg-white rounded-xl border-2 p-3 text-center cursor-pointer transition-all hover:shadow-md",
                            selected.includes(card.id) ? "border-violet-500 bg-violet-50" : "border-slate-200")}>
                        <div className="w-full aspect-[3/4] bg-slate-100 rounded-lg mb-2 flex items-center justify-center border border-slate-200">
                            <span className="text-xs text-slate-400">QR</span>
                        </div>
                        <p className="text-xs font-semibold text-slate-700 truncate">{card.studentName}</p>
                        <p className="text-[10px] text-slate-400">{card.class}-{card.section}</p>
                        {selected.includes(card.id) && <Check size={14} className="mx-auto mt-1 text-violet-600" />}
                    </div>
                ))}
            </div>
        </div>
    )
}