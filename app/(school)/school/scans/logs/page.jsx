"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Download } from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import EmergencyScanFilters from "@/components/modules/scans/EmergencyScanFilters"
import EmergencyScanTable from "@/components/modules/scans/EmergencyScanTable"
import { MOCK_EMERGENCY_SCANS } from "@/lib/mock-data"

export default function ScanLogsPage() {
    const router = useRouter()
    const [search, setSearch] = useState("")
    const [typeFilter, setTypeFilter] = useState("All")
    const [alertFilter, setAlertFilter] = useState("All")
    const [currentPage, setCurrentPage] = useState(1)
    const perPage = 15

    const filtered = useMemo(() => MOCK_EMERGENCY_SCANS.filter(scan => {
        if (typeFilter !== "All" && scan.emergencyType !== typeFilter) return false
        if (alertFilter !== "All" && scan.alertStatus !== alertFilter) return false
        if (search) {
            const q = search.toLowerCase()
            return scan.studentName.toLowerCase().includes(q) || scan.location.toLowerCase().includes(q) || scan.scannedBy.toLowerCase().includes(q) || (scan.notes || "").toLowerCase().includes(q)
        }
        return true
    }), [search, typeFilter, alertFilter])

    const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage)

    return (
        <div className="max-w-[1300px] mx-auto space-y-6">
            <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "QR Scan Logs", href: "/school/scans" }, { label: "All Logs" }]} />

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"><ArrowLeft size={18} /></button>
                    <div><h1 className="text-[22px] font-bold text-slate-800">All QR Scan Logs</h1><p className="text-[13px] text-slate-500">{filtered.length} total scan records</p></div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm"><Download size={15} />Export</button>
            </div>

            <EmergencyScanFilters search={search} onSearchChange={setSearch} typeFilter={typeFilter} onTypeChange={setTypeFilter} alertFilter={alertFilter} onAlertChange={setAlertFilter} />

            <EmergencyScanTable scans={paginated} />

            {Math.ceil(filtered.length / perPage) > 1 && (
                <div className="flex items-center justify-between text-sm">
                    <p className="text-xs text-slate-400">Page {currentPage} of {Math.ceil(filtered.length / perPage)}</p>
                    <div className="flex gap-1">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs hover:bg-slate-50 disabled:opacity-50">Prev</button>
                        <button onClick={() => setCurrentPage(p => Math.min(Math.ceil(filtered.length / perPage), p + 1))} disabled={currentPage * perPage >= filtered.length} className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs hover:bg-slate-50 disabled:opacity-50">Next</button>
                    </div>
                </div>
            )}
        </div>
    )
}