import { ScanLine, AlertTriangle, Check, X, Bell } from "lucide-react"
import { KpiCard } from "@/components/shared/KpiCard"

export default function EmergencyScanStats({ stats }) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard title="Total Scans Today" value={stats.totalScans} icon={ScanLine} iconColor="blue" />
            <KpiCard title="Emergency Scans" value={stats.emergencyScans} icon={AlertTriangle} iconColor={stats.emergencyScans > 0 ? "red" : "green"} />
            <KpiCard title="Alerts Delivered" value={stats.alertsDelivered} icon={Bell} iconColor="green" />
            <KpiCard title="Alerts Failed" value={stats.alertsFailed} icon={X} iconColor={stats.alertsFailed > 0 ? "red" : "green"} />
        </div>
    )
}