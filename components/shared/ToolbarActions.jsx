"use client"

import { useState, useCallback } from "react"
import { RefreshCw, Download } from "lucide-react"
import { cn } from "@/lib/utils"

export default function ToolbarActions({
    onRefresh,
    onExport,
    isRefreshing = false,
    refreshLabel = "Refresh",
    exportLabel = "Export",
    className
}) {
    const [spinning, setSpinning] = useState(false)

    const handleRefresh = useCallback(async () => {
        setSpinning(true)
        try {
            await onRefresh?.()
        } finally {
            setTimeout(() => setSpinning(false), 600)
        }
    }, [onRefresh])

    const isLoading = spinning || isRefreshing

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 text-[12px] text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <RefreshCw
                    size={13}
                    className={cn(isLoading && "animate-rotate")}
                />
                {refreshLabel}
            </button>

            <button
                onClick={onExport}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 text-[12px] text-slate-600 hover:bg-slate-50 transition-colors"
            >
                <Download size={13} />
                {exportLabel}
            </button>
        </div>
    )
}