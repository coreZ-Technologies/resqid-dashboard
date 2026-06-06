import { Zap, Lock } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

const planMeta = {
    basic: { label: "Basic", color: "from-slate-700 to-slate-800", accent: "bg-amber-400", accentText: "text-amber-400" },
    standard: { label: "Standard", color: "from-violet-700 to-violet-900", accent: "bg-amber-400", accentText: "text-amber-400" },
    safety_bundle: { label: "Safety Bundle", color: "from-emerald-700 to-emerald-900", accent: "bg-emerald-400", accentText: "text-emerald-400" },
    complete: { label: "Complete", color: "from-indigo-700 to-indigo-900", accent: "bg-indigo-400", accentText: "text-indigo-400" },
}

export default function PlanBanner({ plan = "standard", lockedModules = [] }) {
    const router = useRouter()
    const meta = planMeta[plan] || planMeta.standard

    if (lockedModules.length === 0) return null

    return (
        <div className={cn("rounded-2xl p-5 relative overflow-hidden bg-gradient-to-br", meta.color)}>
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/5 -translate-y-6 translate-x-6" />
            <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                    <Zap size={14} className={meta.accentText} />
                    <span className={cn("text-[11px] font-bold uppercase tracking-wider", meta.accentText)}>Upgrade Available</span>
                </div>
                <p className="text-white font-bold text-sm mb-1">Unlock {lockedModules.length} module{lockedModules.length > 1 ? "s" : ""}</p>
                <p className="text-white/60 text-xs mb-4">
                    {lockedModules.map(m => (
                        <span key={m} className="inline-flex items-center gap-1 mr-2"><Lock size={10} />{m}</span>
                    ))}
                </p>
                <button onClick={() => router.push("/school/settings/billing")}
                    className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-xl text-slate-900 text-xs font-bold hover:opacity-90 transition-opacity", meta.accent)}>
                    <Zap size={12} /> Upgrade Now
                </button>
            </div>
        </div>
    )
}