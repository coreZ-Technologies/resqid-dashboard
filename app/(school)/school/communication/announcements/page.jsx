"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
    Megaphone, Plus, Search, Edit2, Trash2, Users, Clock, X,
    Check, Loader2, Pin, Bell, Eye, Calendar, Send, Globe, ArrowUpRight
} from "lucide-react"
import PageHeader from "@/components/shared/PageHeader"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { useConfirmDialog } from "@/components/shared/ConfirmDialog"
import ToolbarActions from "@/components/shared/ToolbarActions"
import { cn } from "@/lib/utils"

const CATEGORIES = ["All", "General", "Academic", "Event", "Holiday", "Urgent"]
const STATUS_OPTS = ["All", "Published", "Draft", "Scheduled"]

const CATEGORY_COLORS = {
    General: "border-l-slate-400", Academic: "border-l-blue-500",
    Event: "border-l-violet-500", Holiday: "border-l-emerald-500",
    Urgent: "border-l-red-500",
}

const MOCK_ANNOUNCEMENTS = [
    { id: "a1", title: "Annual Sports Day – 10th June 2026", category: "Event", audience: "All Students", status: "Published", pinned: true, views: 1840, sent: 450, delivered: 438, read: 312, publishedAt: "2026-05-28", body: "The Annual Sports Day will be held on 10th June 2026 at the school ground. All students must report by 8:00 AM in their house colours." },
    { id: "a2", title: "Half-Yearly Exam Schedule Released", category: "Academic", audience: "All Students", status: "Published", pinned: true, views: 2103, sent: 450, delivered: 445, read: 398, publishedAt: "2026-05-27", body: "The Half-Yearly Examination schedule has been released. Please check the notice board or download the timetable." },
    { id: "a3", title: "Parent-Teacher Meeting – 15th June", category: "Event", audience: "All Parents", status: "Published", pinned: false, views: 963, sent: 289, delivered: 280, read: 201, publishedAt: "2026-05-26", body: "A Parent-Teacher Meeting is scheduled for 15th June 2026 from 10 AM to 1 PM." },
    { id: "a4", title: "Eid Al-Adha Holiday – 7th June", category: "Holiday", audience: "All Students", status: "Published", pinned: false, views: 1560, sent: 450, delivered: 448, read: 402, publishedAt: "2026-05-25", body: "The school will remain closed on 7th June 2026 on account of Eid Al-Adha." },
    { id: "a5", title: "Fee Payment Reminder – Due 5th June", category: "Urgent", audience: "All Parents", status: "Published", pinned: false, views: 1230, sent: 289, delivered: 275, read: 198, publishedAt: "2026-05-23", body: "Last date for fee payment is 5th June 2026. Please clear dues to avoid late charges." },
    { id: "a6", title: "Science Exhibition – Entries Open", category: "Event", audience: "All Students", status: "Scheduled", pinned: false, views: 0, sent: 0, delivered: 0, read: 0, publishedAt: "2026-06-10", body: "The inter-school Science Exhibition will be held on 20th June. Submit entries by 10th June." },
    { id: "a7", title: "Welcome Address – New Session", category: "General", audience: "All Students", status: "Draft", pinned: false, views: 0, sent: 0, delivered: 0, read: 0, publishedAt: null, body: "Draft content for the welcome address for the new academic session." },
]

function ComposeModal({ announcement, onClose, onSave }) {
    const [title, setTitle] = useState(announcement?.title || "")
    const [body, setBody] = useState(announcement?.body || "")
    const [category, setCategory] = useState(announcement?.category || "General")
    const [audience, setAudience] = useState(announcement?.audience || "All Students")
    const [pinned, setPinned] = useState(announcement?.pinned || false)
    const [status, setStatus] = useState(announcement?.status || "Published")
    const [loading, setLoading] = useState(false)

    const handleSave = async () => {
        if (!title.trim() || !body.trim()) return
        setLoading(true)
        await new Promise(r => setTimeout(r, 700))
        onSave({ title, body, category, audience, pinned, status })
        setLoading(false)
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center"><Megaphone size={17} className="text-white" /></div>
                        <div><h3 className="font-bold text-slate-900 text-lg">{announcement ? "Edit Announcement" : "New Announcement"}</h3><p className="text-xs text-slate-500">Broadcast to students, parents or teachers</p></div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Title *</label>
                        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Announcement title..."
                            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 transition-all" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Message *</label>
                        <textarea value={body} onChange={e => setBody(e.target.value)} rows={4} placeholder="Write your announcement here..."
                            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 resize-none transition-all" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category</label>
                            <select value={category} onChange={e => setCategory(e.target.value)}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 bg-white">
                                {["General", "Academic", "Event", "Holiday", "Urgent"].map(c => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Audience</label>
                            <select value={audience} onChange={e => setAudience(e.target.value)}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 bg-white">
                                {["All Students", "All Parents", "All Teachers", "Specific Class"].map(a => <option key={a}>{a}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={pinned} onChange={e => setPinned(e.target.checked)} className="w-4 h-4 rounded accent-violet-600" />
                            <span className="text-sm font-medium text-slate-700">Pin to top</span>
                        </label>
                        <div className="flex gap-2 ml-auto">
                            {["Draft", "Published"].map(s => (
                                <button key={s} onClick={() => setStatus(s)}
                                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${status === s ? "bg-violet-600 border-violet-600 text-white" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>{s}</button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50">Cancel</button>
                    <button onClick={handleSave} disabled={!title || !body || loading}
                        className="px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-50 transition-colors">
                        {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                        {status === "Draft" ? "Save Draft" : "Publish"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default function AnnouncementsPage() {
    const router = useRouter()
    const [items, setItems] = useState(MOCK_ANNOUNCEMENTS)
    const [search, setSearch] = useState("")
    const [categoryFilter, setCategory] = useState("All")
    const [statusFilter, setStatus] = useState("All")
    const [showModal, setShowModal] = useState(false)
    const [editItem, setEditItem] = useState(null)
    const { confirmDialog, confirm } = useConfirmDialog()

    const filtered = useMemo(() => items.filter(a => {
        const matchCat = categoryFilter === "All" || a.category === categoryFilter
        const matchStatus = statusFilter === "All" || a.status === statusFilter
        const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase())
        return matchCat && matchStatus && matchSearch
    }), [items, search, categoryFilter, statusFilter])

    const sorted = [...filtered].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))

    const handleSave = (data) => {
        if (editItem) setItems(prev => prev.map(a => a.id === editItem.id ? { ...a, ...data } : a))
        else setItems(prev => [{ id: `a${Date.now()}`, ...data, views: 0, sent: 0, delivered: 0, read: 0, publishedAt: data.status === "Published" ? new Date().toISOString().slice(0, 10) : null }, ...prev])
        setEditItem(null)
    }

    const handleDelete = async (id) => {
        const ok = await confirm({ variant: "delete", title: "Delete announcement?", description: "This will permanently remove this announcement.", confirmLabel: "Delete" })
        if (ok) setItems(prev => prev.filter(a => a.id !== id))
    }

    const stats = { total: items.length, published: items.filter(a => a.status === "Published").length, pinned: items.filter(a => a.pinned).length, totalViews: items.reduce((a, i) => a + i.views, 0) }

    return (
        <div className="max-w-[1300px] space-y-6">
            {confirmDialog}
            {(showModal || editItem) && <ComposeModal announcement={editItem} onClose={() => { setShowModal(false); setEditItem(null) }} onSave={handleSave} />}

            <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "Communication", href: "/school/communication" }, { label: "Announcements" }]} />

            <PageHeader title="Announcements" description="School-wide broadcasts to students, parents, and teachers">
                <div className="flex items-center gap-2">
                    <ToolbarActions onRefresh={() => console.log("Refreshing...")} onExport={() => console.log("Exporting...")} />
                    <button onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-violet-700 text-white text-sm font-semibold shadow-sm shadow-violet-200 hover:from-violet-600 hover:to-violet-800 transition-all">
                        <Plus size={16} /> New Announcement
                    </button>
                </div>
            </PageHeader>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total", value: stats.total, icon: Megaphone, color: "bg-blue-500" },
                    { label: "Published", value: stats.published, icon: Globe, color: "bg-emerald-500" },
                    { label: "Pinned", value: stats.pinned, icon: Pin, color: "bg-violet-500" },
                    { label: "Total Views", value: stats.totalViews.toLocaleString("en-IN"), icon: Eye, color: "bg-amber-500" },
                ].map(s => (
                    <div key={s.label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center`}><s.icon size={18} className="text-white" /></div>
                        <div><p className="text-xl font-bold text-slate-800">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3 flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px]">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search announcements..."
                        className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-violet-500 transition-all" />
                </div>
                <div className="flex gap-1.5">
                    {CATEGORIES.map(c => (
                        <button key={c} onClick={() => setCategory(c)}
                            className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${categoryFilter === c ? "bg-violet-600 border-violet-600 text-white shadow-sm" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>{c}</button>
                    ))}
                </div>
                <div className="flex gap-1.5">
                    {STATUS_OPTS.map(s => (
                        <button key={s} onClick={() => setStatus(s)}
                            className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${statusFilter === s ? "bg-slate-800 border-slate-800 text-white" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>{s}</button>
                    ))}
                </div>
            </div>

            <p className="text-sm text-slate-500">Showing <span className="font-semibold text-slate-700">{sorted.length}</span> announcement{sorted.length !== 1 ? "s" : ""}</p>

            {sorted.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-16 text-center">
                    <Megaphone size={36} className="mx-auto mb-3 text-slate-300" />
                    <p className="font-semibold text-slate-600">No announcements found</p>
                    <button onClick={() => setShowModal(true)} className="mt-4 px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-semibold">New Announcement</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {sorted.map(item => {
                        const catColor = CATEGORY_COLORS[item.category] || "border-l-slate-400"
                        return (
                            <div key={item.id} className={cn("bg-white rounded-xl border shadow-sm hover:shadow-md transition-all overflow-hidden border-l-4", catColor, item.pinned && "border-t-2 border-t-amber-400")}>
                                <div className="p-5">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <div className="flex items-start gap-2 flex-1 min-w-0">
                                            {item.pinned && <Pin size={14} className="text-amber-500 shrink-0 mt-0.5" />}
                                            <h3 className="font-bold text-slate-800 text-sm leading-snug">{item.title}</h3>
                                        </div>
                                        <StatusBadge status={item.status === "Published" ? "present" : item.status === "Scheduled" ? "pending" : "inactive"} size="sm" label={item.status} />
                                    </div>
                                    <p className="text-xs text-slate-500 mb-3 line-clamp-2">{item.body}</p>
                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-50 text-violet-700 border border-violet-200">{item.category}</span>
                                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600"><Users size={10} />{item.audience}</span>
                                    </div>

                                    {/* Delivery Stats */}
                                    {item.status === "Published" && (
                                        <div className="grid grid-cols-3 gap-2 mb-3 p-2 bg-slate-50 rounded-lg">
                                            <div className="text-center"><p className="text-xs font-bold text-slate-700">{item.sent}</p><p className="text-[9px] text-slate-400">Sent</p></div>
                                            <div className="text-center"><p className="text-xs font-bold text-emerald-600">{item.delivered}</p><p className="text-[9px] text-slate-400">Delivered</p></div>
                                            <div className="text-center"><p className="text-xs font-bold text-violet-600">{item.read}</p><p className="text-[9px] text-slate-400">Read</p></div>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                        <div className="flex items-center gap-3 text-[10px] text-slate-400">
                                            {item.publishedAt && <span className="flex items-center gap-1"><Calendar size={10} />{new Date(item.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>}
                                            {item.status === "Published" && <span className="flex items-center gap-1"><Eye size={10} />{item.views}</span>}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => { setEditItem(item); setShowModal(true) }} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"><Edit2 size={13} /></button>
                                            <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 size={13} /></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}