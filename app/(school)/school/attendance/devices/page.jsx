"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft, Wifi, WifiOff, Battery, RefreshCw, MapPin,
  Activity, Cpu, RotateCcw, Power, Eye
} from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { MOCK_DEVICES } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export default function DevicesPage() {
  const router = useRouter()
  const [devices, setDevices] = useState(MOCK_DEVICES)
  const [restarting, setRestarting] = useState(null)

  const onlineCount = devices.filter(d => d.status === "online").length
  const offlineCount = devices.filter(d => d.status === "offline").length
  const totalScans = devices.reduce((sum, d) => sum + d.totalScans, 0)

  const handleRestart = async (e, deviceId) => {
    e.stopPropagation()
    setRestarting(deviceId)
    await new Promise(r => setTimeout(r, 2000))
    setDevices(prev => prev.map(d => d.id === deviceId ? { ...d, status: "online", lastSync: "Just now" } : d))
    setRestarting(null)
  }

  return (
    <div className="max-w-[1300px] mx-auto space-y-6">
      <PageBreadcrumb items={[
        { label: "Dashboard", href: "/school" },
        { label: "Attendance", href: "/school/attendance" },
        { label: "Devices" },
      ]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"><ArrowLeft size={18} /></button>
          <div>
            <h1 className="text-[22px] font-bold text-slate-800">RFID Devices</h1>
            <p className="text-[13px] text-slate-500">Manage and monitor gate scanners and attendance machines</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
          <RotateCcw size={15} /> Sync All
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Devices", value: devices.length, icon: Cpu, color: "bg-blue-500" },
          { label: "Online", value: onlineCount, icon: Wifi, color: "bg-emerald-500" },
          { label: "Offline", value: offlineCount, icon: WifiOff, color: offlineCount > 0 ? "bg-red-500" : "bg-slate-400" },
          { label: "Total Scans Today", value: totalScans.toLocaleString("en-IN"), icon: Activity, color: "bg-violet-500" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center`}><s.icon size={18} className="text-white" /></div>
            <div><p className="text-xl font-bold text-slate-800">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div>
          </div>
        ))}
      </div>

      {/* Device Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {devices.map(device => (
          <div
            key={device.id}
            onClick={() => router.push(`/school/attendance/devices/${device.id}`)}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center",
                  device.status === "online" ? "bg-emerald-500" : "bg-red-500")}>
                  {device.status === "online" ? <Wifi size={22} className="text-white" /> : <WifiOff size={22} className="text-white" />}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{device.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <StatusBadge status={device.status === "online" ? "active" : "inactive"} size="sm" label={device.status} />
                    <span className="text-xs text-slate-400">{device.type}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Device Info */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { icon: MapPin, label: "Location", value: device.location },
                { icon: Battery, label: "Battery", value: `${device.battery}%` },
                { icon: Cpu, label: "Firmware", value: device.firmware },
                { icon: RefreshCw, label: "Last Sync", value: device.lastSync },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2">
                  <item.icon size={13} className="text-slate-400 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-400">{item.label}</p>
                    <p className="text-xs font-medium text-slate-700">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Battery Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-500">Battery</span>
                <span className={cn("font-semibold", device.battery < 25 ? "text-red-600" : "text-slate-700")}>{device.battery}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className={cn("h-full rounded-full transition-all",
                  device.battery > 50 ? "bg-emerald-500" : device.battery > 25 ? "bg-amber-500" : "bg-red-500")}
                  style={{ width: `${device.battery}%` }} />
              </div>
            </div>

            {/* Scans count */}
            <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
              <span>Scans today</span>
              <span className="font-semibold text-slate-700">{device.totalScans.toLocaleString("en-IN")}</span>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={(e) => handleRestart(e, device.id)}
                disabled={restarting === device.id}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                {restarting === device.id ? (
                  <><RefreshCw size={11} className="animate-spin" /> Restarting...</>
                ) : (
                  <><Power size={11} /> Restart</>
                )}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); router.push(`/school/attendance/devices/${device.id}/logs`) }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 transition-colors"
              >
                <Eye size={11} /> View Logs
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}