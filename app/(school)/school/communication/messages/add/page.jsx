"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Send, Loader2, Check } from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"

const CLASSES = ["All Parents", "All Students", "All Teachers", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"]

export default function ComposeMessagePage() {
    const router = useRouter()
    const [recipient, setRecipient] = useState("")
    const [subject, setSubject] = useState("")
    const [body, setBody] = useState("")
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    const handleSend = async () => {
        if (!recipient || !subject || !body) return
        setLoading(true)
        await new Promise(r => setTimeout(r, 1000))
        setLoading(false)
        setSent(true)
    }

    if (sent) {
        return (
            <div className="max-w-[600px] mx-auto space-y-6">
                <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "Messages", href: "/school/communication/messages" }, { label: "Sent" }]} />
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto"><Check size={28} className="text-emerald-600" /></div>
                    <div><h3 className="text-lg font-bold text-slate-800">Message Sent!</h3><p className="text-sm text-slate-500">Your message has been sent to {recipient}</p></div>
                    <div className="flex justify-center gap-3">
                        <button onClick={() => { setRecipient(""); setSubject(""); setBody(""); setSent(false) }} className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50">Send Another</button>
                        <button onClick={() => router.push("/school/communication/messages")} className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700">View Messages</button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-[600px] mx-auto space-y-6">
            <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "Communication", href: "/school/communication" }, { label: "Messages", href: "/school/communication/messages" }, { label: "Compose" }]} />

            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"><ArrowLeft size={18} /></button>
                <div><h1 className="text-[22px] font-bold text-slate-800">New Message</h1><p className="text-[13px] text-slate-500">Send a direct message to parents or groups</p></div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Recipient *</label>
                    <select value={recipient} onChange={e => setRecipient(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 bg-white">
                        <option value="">Select recipient...</option>
                        {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Subject *</label>
                    <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Message subject..."
                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 transition-all" />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Message *</label>
                    <textarea value={body} onChange={e => setBody(e.target.value)} rows={5} placeholder="Type your message..."
                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 resize-none transition-all" />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                    <button onClick={() => router.back()} className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50">Cancel</button>
                    <button onClick={handleSend} disabled={!recipient || !subject || !body || loading}
                        className="px-5 py-2 rounded-lg bg-violet-600 text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-50 hover:bg-violet-700 transition-colors">
                        {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Send Message
                    </button>
                </div>
            </div>
        </div>
    )
}