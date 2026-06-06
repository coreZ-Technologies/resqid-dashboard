import { AlertTriangle, Bell, CheckCircle2, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

const notifStyle = {
    alert: { icon: AlertTriangle, color: "text-rose-500", bg: "bg-rose-50" },
    warning: { icon: AlertCircle, color: "text-amber-500", bg: "bg-amber-50" },
    success: { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
    info: { icon: Bell, color: "text-sky-500", bg: "bg-sky-50" },
}

export default function NotificationsPanel({ notifications = [] }) {
    const router = useRouter()
    const unread = notifications.filter(n => !n.read).length

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <p className="font-bold text-slate-800">Notifications</p>
                    {unread > 0 && <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">{unread}</span>}
                </div>
                <button onClick={() => router.push("/school/notifications")} className="text-xs text-violet-500 font-medium">See all</button>
            </div>
            <div className="divide-y divide-slate-50">
                {notifications.slice(0, 4).map(n => {
                    const st = notifStyle[n.type]
                    return (
                        <div key={n.id} className={cn("flex items-start gap-3 px-5 py-3", !n.read && "bg-blue-50/20")}>
                            <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0", st.bg)}><st.icon size={12} className={st.color} /></div>
                            <div className="flex-1 min-w-0">
                                <p className={cn("text-xs", !n.read ? "text-slate-700 font-medium" : "text-slate-500")}>{n.msg}</p>
                                <p className="text-[10px] text-slate-400 mt-0.5">{n.time}</p>
                            </div>
                            {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5" />}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}