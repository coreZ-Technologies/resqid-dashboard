"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, BookOpen, ChevronRight, FileText, Video, MessageCircle } from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"

const DOCS_SECTIONS = [
    {
        title: "Getting Started",
        icon: BookOpen,
        articles: [
            { title: "Setting up your school profile", href: "#" },
            { title: "Adding students and staff", href: "#" },
            { title: "Understanding plans and modules", href: "#" },
            { title: "Inviting other admins", href: "#" },
        ]
    },
    {
        title: "QR & Emergency",
        icon: FileText,
        articles: [
            { title: "Generating QR codes for students", href: "#" },
            { title: "Printing ID cards", href: "#" },
            { title: "How emergency scans work", href: "#" },
            { title: "Managing lost cards", href: "#" },
        ]
    },
    {
        title: "RFID Attendance",
        icon: FileText,
        articles: [
            { title: "Installing RFID devices", href: "#" },
            { title: "Pairing cards with students", href: "#" },
            { title: "Reading attendance reports", href: "#" },
            { title: "Troubleshooting device issues", href: "#" },
        ]
    },
    {
        title: "Timetable",
        icon: FileText,
        articles: [
            { title: "Generating a new timetable", href: "#" },
            { title: "Validating existing timetable", href: "#" },
            { title: "Managing teacher substitutions", href: "#" },
            { title: "Yearly timetable management", href: "#" },
        ]
    },
]

export default function DocsPage() {
    const router = useRouter()

    return (
        <div className="max-w-[900px] mx-auto space-y-6">
            <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "Help", href: "/school/help" }, { label: "Documentation" }]} />

            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"><ArrowLeft size={18} /></button>
                <div>
                    <h1 className="text-[22px] font-bold text-slate-800">Documentation</h1>
                    <p className="text-[13px] text-slate-500">Comprehensive guides for every ResQID module</p>
                </div>
            </div>

            <div className="space-y-4">
                {DOCS_SECTIONS.map(section => (
                    <div key={section.title} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                                <section.icon size={16} className="text-violet-600" />
                            </div>
                            <h2 className="font-semibold text-slate-800">{section.title}</h2>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {section.articles.map(article => (
                                <button key={article.title} className="w-full px-5 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors text-left">
                                    <span className="text-sm text-slate-700">{article.title}</span>
                                    <ChevronRight size={14} className="text-slate-300" />
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-slate-800">Still have questions?</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Our support team is ready to help</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors">
                    <MessageCircle size={14} /> Contact Support
                </button>
            </div>
        </div>
    )
}