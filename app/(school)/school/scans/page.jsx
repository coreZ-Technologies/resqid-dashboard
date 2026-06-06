"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye } from "lucide-react"
import PageHeader from "@/components/shared/PageHeader"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import EmergencyScanStats from "@/components/modules/scans/EmergencyScanStats"
import EmergencyScanTable from "@/components/modules/scans/EmergencyScanTable"
import ToolbarActions from "@/components/shared/ToolbarActions"
import { MOCK_EMERGENCY_SCANS_TODAY, MOCK_EMERGENCY_SCANS } from "@/lib/mock-data"

export default function ScansPage() {
  const router = useRouter()
  const todayScans = MOCK_EMERGENCY_SCANS.filter(s => s.date === "Today")

  return (
    <div className="max-w-[1300px] space-y-6">
      <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "QR Scan Logs" }]} />

      <PageHeader title="QR Scan Logs" description="Emergency QR code scan activity and alert delivery status"
        badge={MOCK_EMERGENCY_SCANS_TODAY.alertsFailed > 0 ? `${MOCK_EMERGENCY_SCANS_TODAY.alertsFailed} failed` : null}>
        <div className="flex items-center gap-2">
          <ToolbarActions onRefresh={() => console.log("Refreshing...")} onExport={() => console.log("Exporting...")} />
          <button onClick={() => router.push("/school/scans/logs")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-violet-700 text-white text-sm font-semibold shadow-sm shadow-violet-200 hover:from-violet-600 hover:to-violet-800 transition-all">
            <Eye size={15} /> View All Logs
          </button>
        </div>
      </PageHeader>

      <EmergencyScanStats stats={MOCK_EMERGENCY_SCANS_TODAY} />

      <EmergencyScanTable scans={todayScans} />

      <div className="text-center">
        <button onClick={() => router.push("/school/scans/logs")}
          className="text-sm text-violet-500 hover:text-violet-700 font-medium">
          View all {MOCK_EMERGENCY_SCANS.length} scans →
        </button>
      </div>
    </div>
  )
}