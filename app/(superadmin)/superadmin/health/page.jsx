"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Activity, Server, Database, Wifi, Zap, HardDrive, Cpu,
  CheckCircle, XCircle, AlertCircle, RefreshCw, Clock,
  TrendingUp, TrendingDown, Minus, Eye, Gauge, Users, Shield
} from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import PageHeader from "@/components/shared/PageHeader"
import { StatusBadge } from "@/components/shared/StatusBadge"
import ToolbarActions from "@/components/shared/ToolbarActions"
import { cn } from "@/lib/utils"

const SERVICES = [
  { name: "API Gateway", status: "operational", latency: 42, uptime: 99.99 },
  { name: "Database (Primary)", status: "operational", latency: 15, uptime: 99.99 },
  { name: "Redis Cache", status: "operational", latency: 5, uptime: 99.99 },
  { name: "Storage Service", status: "operational", latency: 35, uptime: 99.95 },
  { name: "Notification Service", status: "degraded", latency: 120, uptime: 99.2 },
  { name: "Email Service", status: "operational", latency: 85, uptime: 99.8 },
  { name: "SMS Gateway", status: "operational", latency: 95, uptime: 99.7 },
  { name: "Real-time SSE", status: "operational", latency: 22, uptime: 99.9 },
]

const SYSTEM_METRICS = {
  cpu: { usage: 42, history: [38, 42, 45, 43, 41, 42, 40] },
  memory: { percentage: 51, history: [48, 50, 52, 51, 49, 51, 50] },
  disk: { percentage: 48, history: [45, 46, 47, 48, 48, 47, 48] },
  network: { value: 24.5, history: [22, 24, 25, 23, 24, 24.5, 24] },
}

const INCIDENTS = [
  { id: "INC-001", title: "Notification Service Latency Spike", severity: "medium", status: "resolved", time: "2025-05-24T10:30:00" },
  { id: "INC-002", title: "Database Replication Lag", severity: "low", status: "resolved", time: "2025-05-23T15:20:00" },
  { id: "INC-003", title: "SMS Gateway Timeout", severity: "high", status: "monitoring", time: "2025-05-25T08:15:00" },
]

function MetricCard({ title, value, unit, icon: Icon, history, color }) {
  const max = Math.max(...(history || [0]))
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", color)}><Icon size={16} className="text-white" /></div>
          <span className="text-sm font-medium text-slate-600">{title}</span>
        </div>
      </div>
      <p className="text-2xl font-bold text-slate-800">{value}<span className="text-sm font-normal text-slate-400 ml-1">{unit}</span></p>
      {history && (
        <div className="mt-3 flex items-end gap-1 h-8">
          {history.map((h, i) => (
            <div key={i} className="flex-1 bg-slate-100 rounded-t-sm" style={{ height: `${(h / max) * 28}px` }} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function SystemHealthPage() {
  const [services, setServices] = useState(SERVICES)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  const overallStatus = useMemo(() => {
    const hasOutage = services.some(s => s.status === "outage")
    const hasDegraded = services.some(s => s.status === "degraded")
    if (hasOutage) return { label: "Partial Outage", color: "bg-red-500" }
    if (hasDegraded) return { label: "Degraded", color: "bg-amber-500" }
    return { label: "All Operational", color: "bg-emerald-500" }
  }, [services])

  const handleRefresh = async () => {
    setRefreshing(true)
    await new Promise(r => setTimeout(r, 800))
    setLastUpdated(new Date())
    setRefreshing(false)
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      <PageBreadcrumb items={[{ label: "Super Admin", href: "/superadmin" }, { label: "System Health" }]} />

      <PageHeader title="System Health" description="Monitor platform performance and service status">
        <ToolbarActions onRefresh={handleRefresh} onExport={() => { }} />
      </PageHeader>

      {/* Overall Status */}
      <div className={cn("rounded-2xl p-4 flex items-center justify-between text-white", overallStatus.color)}>
        <div className="flex items-center gap-3">
          {overallStatus.label === "All Operational" ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
          <div>
            <p className="font-semibold">{overallStatus.label}</p>
            <p className="text-sm opacity-80">Updated: {lastUpdated.toLocaleTimeString()}</p>
          </div>
        </div>
        <div className="flex gap-4 text-sm">
          <span>{services.filter(s => s.status === "operational").length} Operational</span>
          {services.filter(s => s.status === "degraded").length > 0 && <span>{services.filter(s => s.status === "degraded").length} Degraded</span>}
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="CPU Usage" value={SYSTEM_METRICS.cpu.usage} unit="%" icon={Cpu} history={SYSTEM_METRICS.cpu.history} color="bg-blue-500" />
        <MetricCard title="Memory" value={SYSTEM_METRICS.memory.percentage} unit="%" icon={Server} history={SYSTEM_METRICS.memory.history} color="bg-violet-500" />
        <MetricCard title="Disk" value={SYSTEM_METRICS.disk.percentage} unit="%" icon={HardDrive} history={SYSTEM_METRICS.disk.history} color="bg-amber-500" />
        <MetricCard title="Network" value={SYSTEM_METRICS.network.value} unit="Mbps" icon={Wifi} history={SYSTEM_METRICS.network.history} color="bg-emerald-500" />
      </div>

      {/* Services + Incidents */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Services */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h2 className="font-semibold text-slate-800 mb-4">Service Status</h2>
          <div className="space-y-2">
            {services.map(s => (
              <div key={s.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-slate-700">{s.name}</p>
                  <p className="text-xs text-slate-400">{s.latency}ms avg · {s.uptime}% uptime</p>
                </div>
                <StatusBadge status={s.status === "operational" ? "present" : s.status === "degraded" ? "pending" : "absent"} size="sm" label={s.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Incidents */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h2 className="font-semibold text-slate-800 mb-4">Recent Incidents</h2>
          <div className="space-y-2">
            {INCIDENTS.map(inc => (
              <div key={inc.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-slate-700">{inc.title}</p>
                  <p className="text-xs text-slate-400">{new Date(inc.time).toLocaleString()}</p>
                </div>
                <StatusBadge status={inc.status === "resolved" ? "present" : "pending"} size="sm" label={inc.status} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "API Response", value: "124ms", icon: Gauge, color: "bg-blue-500" },
          { label: "Query Perf", value: "45ms", icon: Database, color: "bg-violet-500" },
          { label: "Active Sessions", value: "2,847", icon: Users, color: "bg-emerald-500" },
          { label: "Cache Hit Rate", value: "92%", icon: Zap, color: "bg-amber-500" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center`}><s.icon size={18} className="text-white" /></div>
            <div><p className="text-xl font-bold text-slate-800">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div>
          </div>
        ))}
      </div>
    </div>
  )
}