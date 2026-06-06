"use client"

import { useRouter } from "next/navigation"
import {
    Megaphone, Mail, Activity, Plus, Send, Users, TrendingUp,
    Clock, CheckCircle2, AlertCircle, ArrowRight, Bell, MessageCircle
} from "lucide-react"
import PageHeader from "@/components/shared/PageHeader"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import { KpiCard } from "@/components/shared/KpiCard"
import { cn } from "@/lib/utils"

const STATS = {
    announcementsSent: 7,
    messagesSent: 42,
    deliveryRate: "96.8%",
    totalReach: 289,
}

const RECENT_ACTIVITY = [
    { type: "announcement", title: "Annual Sports Day published", audience: "All Students", time: "2 hours ago", status: "delivered" },
    { type: "message", title: "Fee reminder sent to Class 10 parents", audience: "32 recipients", time: "3 hours ago", status: "read" },
    { type: "announcement", title: "PTM scheduled for 15th June", audience: "All Parents", time: "Yesterday", status: "delivered" },
    { type: "message", title: "Holiday notice to all teachers", audience: "28 recipients", time: "Yesterday", status: "failed" },
    { type: "announcement", title: "Exam schedule released", audience: "All Students", time: "2 days ago", status: "delivered" },
]

const UPCOMING = [
    { title: "Science Exhibition entries", scheduledFor: "10th June 2026", audience: "Classes 8-12" },
    { title: "Welcome Address – New Session", scheduledFor: "Draft", audience: "All Students" },
]

export default function CommunicationPage() {
    const router = useRouter()

    const activityIcons = {
        announcement: Megaphone,
        message: Mail,
    }

    const activityColors = {
        announcement: "bg-blue-100 text-blue-600",
        message: "bg-violet-100 text-violet-600",
    }

    const statusConfig = {
        delivered: { icon: CheckCircle2, color: "text-emerald-500", label: "Delivered" },
        read: { icon: CheckCircle2, color: "text-violet-500", label: "Read" },
        failed: { icon: AlertCircle, color: "text-red-500", label: "Failed" },
    }

    return (
        <div className="max-w-[1300px] space-y-6">
            <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "Communication" }]} />

            <PageHeader title="Communication" description="Send announcements, messages, and track delivery across all channels" />

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard title="Announcements" value={STATS.announcementsSent} icon={Megaphone} iconColor="blue" />
                <KpiCard title="Messages Sent" value={STATS.messagesSent} icon={Mail} iconColor="violet" />
                <KpiCard title="Delivery Rate" value={STATS.deliveryRate} icon={TrendingUp} iconColor="green" />
                <KpiCard title="Total Reach" value={STATS.totalReach} icon={Users} iconColor="amber" />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { icon: Megaphone, title: "Announcements", desc: "School-wide broadcasts to all parents & students", href: "/school/communication/announcements", action: "View All", actionHref: "/school/communication/announcements", color: "bg-blue-500" },
                    { icon: Mail, title: "Messages", desc: "Direct messages to specific parents or groups", href: "/school/communication/messages/add", action: "Send Message", actionHref: "/school/communication/messages/add", color: "bg-violet-500" },
                    { icon: Activity, title: "Delivery Log", desc: "Track notification delivery status in real-time", href: "/school/communication/log", action: "View Log", actionHref: "/school/communication/log", color: "bg-emerald-500" },
                ].map(card => (
                    <div key={card.title} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-all flex flex-col">
                        <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center mb-4`}>
                            <card.icon size={22} className="text-white" />
                        </div>
                        <h3 className="font-bold text-slate-800 mb-1">{card.title}</h3>
                        <p className="text-xs text-slate-500 mb-4 flex-1">{card.desc}</p>
                        <div className="flex gap-2">
                            <button onClick={() => router.push(card.href)}
                                className="flex-1 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">Browse</button>
                            <button onClick={() => router.push(card.actionHref)}
                                className="flex-1 py-2 rounded-lg bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 transition-colors">{card.action}</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Two Column */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h2 className="font-semibold text-slate-800 flex items-center gap-2"><Activity size={16} className="text-violet-600" />Recent Activity</h2>
                            <p className="text-xs text-slate-500 mt-0.5">Latest announcements and messages</p>
                        </div>
                        <button onClick={() => router.push("/school/communication/log")}
                            className="text-xs text-violet-500 hover:text-violet-700 font-medium">View full log →</button>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {RECENT_ACTIVITY.map((item, i) => {
                            const Icon = activityIcons[item.type]
                            const iconColor = activityColors[item.type]
                            const status = statusConfig[item.status]
                            const StatusIcon = status.icon
                            return (
                                <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50/50 transition-colors">
                                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", iconColor)}>
                                        <Icon size={14} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-700 truncate">{item.title}</p>
                                        <p className="text-xs text-slate-400 mt-0.5">{item.audience} · {item.time}</p>
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0">
                                        <StatusIcon size={12} className={status.color} />
                                        <span className={cn("text-xs font-medium", status.color)}>{status.label}</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    {/* Upcoming / Drafts */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100">
                            <h2 className="font-semibold text-slate-800 flex items-center gap-2"><Clock size={16} className="text-amber-600" />Upcoming & Drafts</h2>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {UPCOMING.map((item, i) => (
                                <div key={i} className="px-5 py-3">
                                    <p className="text-sm font-medium text-slate-700">{item.title}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={cn("text-xs", item.scheduledFor === "Draft" ? "text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded" : "text-amber-600")}>
                                            {item.scheduledFor === "Draft" ? "📝 Draft" : `📅 ${item.scheduledFor}`}
                                        </span>
                                        <span className="text-xs text-slate-400">· {item.audience}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => router.push("/school/communication/announcements")}
                            className="w-full px-5 py-3 border-t border-slate-100 text-xs text-violet-500 hover:text-violet-700 font-medium text-left">
                            Manage announcements →
                        </button>
                    </div>

                    {/* Channel Status */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                        <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><Bell size={16} className="text-violet-600" />Notification Channels</h2>
                        <div className="space-y-3">
                            {[
                                { channel: "App Push", status: "active", pct: 98 },
                                { channel: "SMS", status: "active", pct: 94 },
                                { channel: "Email", status: "active", pct: 89 },
                            ].map(ch => (
                                <div key={ch.channel}>
                                    <div className="flex items-center justify-between text-xs mb-1">
                                        <span className="text-slate-600">{ch.channel}</span>
                                        <span className="font-semibold text-slate-700">{ch.pct}%</span>
                                    </div>
                                    <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                        <div className={cn("h-full rounded-full", ch.pct >= 95 ? "bg-emerald-500" : ch.pct >= 85 ? "bg-amber-500" : "bg-red-500")}
                                            style={{ width: `${ch.pct}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Compose */}
            <div className="bg-gradient-to-r from-violet-500 to-violet-700 rounded-2xl p-6 flex items-center justify-between">
                <div className="text-white">
                    <h3 className="font-bold text-lg">Ready to send?</h3>
                    <p className="text-white/80 text-sm mt-1">Broadcast an announcement or send a direct message</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => router.push("/school/communication/announcements/add")}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-violet-700 text-sm font-semibold hover:bg-white/90 transition-colors shadow-sm">
                        <Megaphone size={15} /> Announcement
                    </button>
                    <button onClick={() => router.push("/school/communication/messages/add")}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition-colors">
                        <Send size={15} /> Message
                    </button>
                </div>
            </div>
        </div>
    )
}