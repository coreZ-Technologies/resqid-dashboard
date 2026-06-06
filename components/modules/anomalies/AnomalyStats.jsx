import { ShieldAlert, AlertCircle, ShieldCheck, Zap } from "lucide-react"
import { KpiCard } from "@/components/shared/KpiCard"

export default function AnomalyStats({ stats }) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard title="Total Anomalies" value={stats.total} icon={ShieldAlert} iconColor="red" />
            <KpiCard title="Open / Unresolved" value={stats.open} icon={AlertCircle} iconColor="amber" />
            <KpiCard title="Resolved Today" value={stats.resolvedToday} icon={ShieldCheck} iconColor="green" />
            <KpiCard title="High Severity" value={stats.highSeverity} icon={Zap} iconColor="violet" />
        </div>
    )
}