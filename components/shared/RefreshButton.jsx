"use client"

import { useState, useCallback } from "react"
import { RefreshCw, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
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
            <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
                className="h-8 px-3 rounded-xl text-xs text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-700"
            >
                <RefreshCw
                    size={13}
                    className={cn("mr-1.5", isLoading && "animate-rotate")}
                />
                {refreshLabel}
            </Button>

            <Button
                variant="outline"
                size="sm"
                onClick={onExport}
                className="h-8 px-3 rounded-xl text-xs text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-700"
            >
                <Download size={13} className="mr-1.5" />
                {exportLabel}
            </Button>
        </div>
    )
}