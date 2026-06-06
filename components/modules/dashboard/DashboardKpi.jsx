import { Users, UserCheck, CalendarCheck, AlertTriangle } from "lucide-react"
import { KpiCard } from "@/components/shared/KpiCard"
import { useRouter } from "next/navigation"

export default function DashboardKpi({ stats }) {
    const router = useRouter()
    const kpis = [
        { label: "Total Students", value: stats.students, icon: Users, iconColor: "blue", href: "/school/students" },
        { label: "Total Teachers", value: stats.teachers, icon: UserCheck, iconColor: "violet", href: "/school/teachers" },
        { label: "Today's Attendance", value: `${stats.attendancePct}%`, icon: CalendarCheck, iconColor: stats.attendancePct >= 90 ? "green" : "amber", href: "/school/attendance" },
        { label: "Open Anomalies", value: stats.anomalies, icon: AlertTriangle, iconColor: stats.anomalies > 0 ? "red" : "green", href: "/school/anomalies" },
    ]

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map(kpi => (
                <div key={kpi.label} onClick={() => router.push(kpi.href)} className="cursor-pointer">
                    <KpiCard {...kpi} />
                </div>
            ))}
        </div>
    )
}