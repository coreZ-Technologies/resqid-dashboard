"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Shield, ChevronRight } from "lucide-react"
import Link from "next/link"
import PageHeader from "@/components/shared/PageHeader"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import AnomalyStats from "@/components/modules/anomalies/AnomalyStats"
import AnomalyFilters from "@/components/modules/anomalies/AnomalyFilters"
import AnomalyTable from "@/components/modules/anomalies/AnomalyTable"
import AnomalyDetail from "@/components/modules/anomalies/AnomalyDetail"
import ToolbarActions from "@/components/shared/ToolbarActions"
import { MOCK_ANOMALY_STATS, MOCK_ANOMALIES } from "@/lib/mock-data"

export default function AnomaliesPage() {
  const router = useRouter()
  const [statusFilter, setStatusFilter] = useState('All')
  const [severityFilter, setSeverityFilter] = useState('All Severities')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  const filtered = useMemo(() => MOCK_ANOMALIES.filter(a => {
    const matchStatus = statusFilter === 'All' || a.status === statusFilter.toLowerCase()
    const matchSeverity = severityFilter === 'All Severities' || a.severity === severityFilter.toLowerCase()
    const matchSearch = !search || a.student.toLowerCase().includes(search.toLowerCase()) || a.id.toLowerCase().includes(search.toLowerCase()) || a.description.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSeverity && matchSearch
  }), [statusFilter, severityFilter, search])

  const openCount = MOCK_ANOMALIES.filter(a => a.status === 'open').length
  const selectedAnomaly = MOCK_ANOMALIES.find(a => a.id === selected)

  return (
    <div className="max-w-[1300px] space-y-6">
      <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "Anomalies" }]} />

      <PageHeader title="Anomalies" description="Security alerts and suspicious scan activity"
        badge={openCount > 0 ? `${openCount} open` : null}
        icon={Shield} iconColor="text-rose-500">
        <ToolbarActions onRefresh={() => console.log("Refreshing...")} onExport={() => console.log("Exporting...")} />
      </PageHeader>

      <AnomalyStats stats={MOCK_ANOMALY_STATS} />

      <AnomalyFilters search={search} onSearchChange={setSearch} statusFilter={statusFilter} onStatusChange={setStatusFilter} severityFilter={severityFilter} onSeverityChange={setSeverityFilter} />

      <div className={`grid gap-5 ${selected ? 'lg:grid-cols-[1fr_380px]' : 'grid-cols-1'}`}>
        <div>
          <AnomalyTable anomalies={filtered} selectedId={selected} onSelect={setSelected} />
          <div className="mt-3 flex items-center justify-between text-sm">
            <p className="text-xs text-slate-400">Showing {filtered.length} of {MOCK_ANOMALIES.length} anomalies</p>
            <Link href="/school/scans" className="text-xs text-violet-500 hover:text-violet-700 font-medium flex items-center gap-1">
              View all scan logs <ChevronRight size={11} />
            </Link>
          </div>
        </div>
        {selectedAnomaly && <AnomalyDetail anomaly={selectedAnomaly} onClose={() => setSelected(null)} />}
      </div>
    </div>
  )
}