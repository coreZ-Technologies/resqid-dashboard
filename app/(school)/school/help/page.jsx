"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
    BookOpen, FileText, Download, MessageCircle,
    ChevronRight, Zap, Users, CalendarCheck, Shield,
    QrCode, Radio, HelpCircle, Mail, CreditCard
} from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import PageHeader from "@/components/shared/PageHeader"
import { cn } from "@/lib/utils"

const GUIDES = [
    { icon: Users, title: "Getting Started", desc: "Set up your school, add students, and configure modules", href: "/school/help/docs/getting-started", color: "bg-blue-500" },
    { icon: QrCode, title: "QR Cards & ID Setup", desc: "Generate and print QR-based emergency ID cards", href: "/school/help/docs/cards", color: "bg-rose-500" },
    { icon: Radio, title: "RFID Attendance", desc: "Install devices, pair cards, and start tracking attendance", href: "/school/help/docs/attendance", color: "bg-emerald-500" },
    { icon: CalendarCheck, title: "Timetable Guide", desc: "Generate conflict-free timetables for your school", href: "/school/help/docs/timetable", color: "bg-violet-500" },
    { icon: Shield, title: "Emergency Management", desc: "Configure emergency alerts and parent notifications", href: "/school/help/docs/emergency", color: "bg-amber-500" },
    { icon: BookOpen, title: "Full Documentation", desc: "Browse all guides, API reference, and FAQs", href: "/school/help/docs", color: "bg-indigo-500" },
]

const QUICK_LINKS = [
    { icon: FileText, label: "CSV Templates", desc: "Download demo CSV files for bulk import", href: "/school/help/csv" },
    { icon: Download, label: "Demo Downloads", desc: "Sample CSV & Excel templates for all modules", href: "/school/help/csv" },
    { icon: HelpCircle, label: "FAQs", desc: "Frequently asked questions", href: "/school/help/docs/faq" },
    { icon: MessageCircle, label: "Contact Support", desc: "Get help from our team", href: "mailto:support@resqid.com" },
]

export default function HelpPage() {
    const router = useRouter()

    return (
        <div className="max-w-[1100px] mx-auto space-y-6">
            <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "Help & Support" }]} />

            <PageHeader title="Help & Support" description="Guides, documentation, and resources to help you get the most out of ResQID" />

            {/* Getting Started Guides */}
            <div>
                <h2 className="font-semibold text-slate-800 mb-4">Module Guides</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {GUIDES.map(guide => (
                        <button key={guide.title} onClick={() => router.push(guide.href)}
                            className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-left hover:shadow-md hover:border-violet-200 transition-all group">
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", guide.color)}>
                                <guide.icon size={18} className="text-white" />
                            </div>
                            <h3 className="font-semibold text-slate-800 group-hover:text-violet-600 transition-colors">{guide.title}</h3>
                            <p className="text-xs text-slate-500 mt-1">{guide.desc}</p>
                            <div className="flex items-center gap-1 mt-3 text-xs text-violet-500 font-medium">
                                Learn more <ChevronRight size={12} />
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {QUICK_LINKS.map(link => (
                    <button key={link.label}
                        onClick={() => link.href.startsWith("mailto") ? window.location.href = link.href : router.push(link.href)}
                        className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-4 hover:shadow-md hover:border-violet-200 transition-all">
                        <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                            <link.icon size={18} className="text-violet-600" />
                        </div>
                        <div className="text-left">
                            <h3 className="font-semibold text-slate-800 text-sm">{link.label}</h3>
                            <p className="text-xs text-slate-500">{link.desc}</p>
                        </div>
                        <ChevronRight size={16} className="text-slate-300 ml-auto" />
                    </button>
                ))}
            </div>

            {/* Contact Card */}
            <div className="bg-gradient-to-r from-violet-500 to-violet-700 rounded-2xl p-6 text-white">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                        <HelpCircle size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Need more help?</h3>
                        <p className="text-white/80 text-sm mt-1">Our support team is available Monday to Saturday, 9 AM to 7 PM.</p>
                        <div className="flex gap-3 mt-4">
                            <a href="mailto:support@resqid.com" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-violet-700 text-sm font-semibold hover:bg-white/90 transition-colors">
                                <Mail size={14} /> Email Support
                            </a>
                            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition-colors">
                                <MessageCircle size={14} /> Live Chat
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}