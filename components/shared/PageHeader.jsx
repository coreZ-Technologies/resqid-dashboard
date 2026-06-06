import { cn } from "@/lib/utils"

export default function PageHeader({
    title,
    description,
    children,
    icon: Icon,
    iconColor = "text-blue-500",
    badge,
    className
}) {
    return (
        <div className={cn(
            "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6",
            className
        )}>
            <div>
                <div className="flex items-center gap-2 mb-1">
                    {Icon && <Icon size={20} className={iconColor} />}
                    <h1 className="text-[22px] font-bold text-slate-800">{title}</h1>
                    {badge && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[11px] font-bold">
                            {badge}
                        </span>
                    )}
                </div>
                {description && (
                    <p className="text-[13px] text-slate-500">{description}</p>
                )}
            </div>
            {children && (
                <div className="flex-shrink-0">{children}</div>
            )}
        </div>
    )
}