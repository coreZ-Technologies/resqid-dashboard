"use client"

import { useState, useCallback } from "react"
import { RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import ExportButton from "@/components/shared/ExportButton"

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
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <RefreshCw
                    size={15}
                    className={cn(isLoading && "animate-rotate")}
                />
                {refreshLabel}
            </button>

            <ExportButton
                onClick={onExport}
                label={exportLabel}
            />
        </div>
    )
}