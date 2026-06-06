import { Phone, MessageCircle } from "lucide-react"

export default function ContactCard({ contact, onCall, onWhatsApp }) {
    return (
        <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-100 to-violet-200 flex items-center justify-center text-violet-700 font-semibold text-sm">
                {contact.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-700 text-sm">{contact.name}</p>
                <p className="text-xs text-slate-400">{contact.relationship}</p>
                <p className="text-sm text-slate-600 mt-0.5">{contact.phone}</p>
            </div>
            <div className="flex gap-2">
                {contact.canCall !== false && (
                    <button onClick={() => onCall(contact.phone)} className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"><Phone size={14} /></button>
                )}
                {contact.canWhatsapp !== false && (
                    <button onClick={() => onWhatsApp(contact.phone)} className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"><MessageCircle size={14} /></button>
                )}
            </div>
        </div>
    )
}