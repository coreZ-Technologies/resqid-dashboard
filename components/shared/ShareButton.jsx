"use client"

import { useState } from "react"
import { Share2, Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"

export default function ShareButton({ data, label = "Share", className }) {
    const [copied, setCopied] = useState(false)

    const handleShare = async () => {
        const shareData = {
            title: `${data.name} - Student Profile`,
            text: `${data.name} | Class ${data.class}-${data.section} | RESQID`,
            url: window.location.href,
        }

        // Try native share API (mobile)
        if (navigator.share && navigator.canShare?.(shareData)) {
            try {
                await navigator.share(shareData)
                return
            } catch (err) {
                // User cancelled — fall through to copy
            }
        }

        // Fallback: copy link to clipboard
        try {
            await navigator.clipboard.writeText(window.location.href)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            // Last resort: select the URL
            const input = document.createElement('input')
            input.value = window.location.href
            document.body.appendChild(input)
            input.select()
            document.execCommand('copy')
            document.body.removeChild(input)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    return (
        <button
            onClick={handleShare}
            className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm",
                className
            )}
        >
            {copied ? <Check size={15} className="text-emerald-500" /> : <Share2 size={15} />}
            {copied ? "Copied!" : label}
        </button>
    )
}