"use client"

import { useState } from "react"
import { Download } from "lucide-react"
import { cn } from "@/lib/utils"

export default function ExportButton({
    onClick,
    label = "Export report",
    className
}) {
    const [animating, setAnimating] = useState(false)

    const handleClick = async () => {
        setAnimating(true)
        try {
            await onClick?.()
        } finally {
            setTimeout(() => setAnimating(false), 800)
        }
    }

    return (
        <button
            onClick={handleClick}
            disabled={animating}
            className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-70 disabled:cursor-not-allowed",
                className
            )}
        >
            <span className="relative inline-flex overflow-hidden" style={{ width: 14, height: 14 }}>
                <Download
                    size={14}
                    className={cn(
                        "absolute transition-transform duration-400 ease-in-out",
                        animating ? "translate-y-full opacity-0" : "translate-y-0 opacity-100"
                    )}
                />
                <Download
                    size={14}
                    className={cn(
                        "absolute transition-transform duration-400 ease-in-out",
                        animating ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
                    )}
                />
            </span>
            {label}
        </button>
    )
}