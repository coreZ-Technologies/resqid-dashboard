"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Upload } from "lucide-react"
import { cn } from "@/lib/utils"

const moduleRoutes = {
    attendance: "/school/attendance/import",
    emergency: "/school/emergency/import",
    timetable: "/school/timetable/import",
    communication: "/school/communication/import",
    students: "/school/students/import",
    default: "/school/import",
}

export default function BulkImportButton({
    module = "default",
    label = "Bulk Import",
    variant = "outline",
    className
}) {
    const router = useRouter()
    const [animating, setAnimating] = useState(false)

    const route = moduleRoutes[module] || moduleRoutes.default

    const handleClick = () => {
        setAnimating(true)
        setTimeout(() => {
            router.push(route)
            setAnimating(false)
        }, 400)
    }

    return (
        <button
            onClick={handleClick}
            disabled={animating}
            className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-70",
                variant === "outline" && "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                variant === "primary" && "bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-200",
                className
            )}
        >
            <span className="relative inline-flex overflow-hidden" style={{ width: 16, height: 16 }}>
                {/* First icon - moves up and fades out */}
                <Upload
                    size={16}
                    className={cn(
                        "absolute transition-all duration-300 ease-in-out",
                        animating ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
                    )}
                />
                {/* Second icon - moves up from below to replace */}
                <Upload
                    size={16}
                    className={cn(
                        "absolute transition-all duration-300 ease-in-out",
                        animating ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                    )}
                />
            </span>
            {label}
        </button>
    )
}