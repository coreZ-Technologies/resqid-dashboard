"use client"

import * as React from "react"
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatValue(value, format) {
  if (value == null) return "—"
  switch (format) {
    case "currency":
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(value)
    case "percent":
      return `${Number(value).toFixed(1)}%`
    case "compact":
      return new Intl.NumberFormat("en-IN", {
        notation: "compact",
        maximumFractionDigits: 1,
      }).format(value)
    default:
      return new Intl.NumberFormat("en-IN").format(value)
  }
}

// ── Trend badge ───────────────────────────────────────────────────────────────

const TrendBadge = ({ change, changeLabel, invert = false }) => {
  if (change == null) return null

  const isPositive = invert ? change < 0 : change > 0
  const isNeutral = change === 0

  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium",
        "animate-in fade-in-0 zoom-in-95 duration-300 delay-200",
        isNeutral
          ? "bg-muted text-muted-foreground"
          : isPositive
          ? "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400"
          : "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400"
      )}
    >
      {isNeutral ? (
        <Minus className="h-3 w-3" aria-hidden />
      ) : isPositive ? (
        <ArrowUpRight className="h-3 w-3" aria-hidden />
      ) : (
        <ArrowDownRight className="h-3 w-3" aria-hidden />
      )}
      {Math.abs(change)}%
      {changeLabel && (
        <span className="font-normal opacity-70 ml-0.5">{changeLabel}</span>
      )}
    </span>
  )
}

// ── Sparkline (mini svg bar chart) ───────────────────────────────────────────

const Sparkline = ({ data = [], color = "currentColor", className }) => {
  if (!data.length) return null

  const max = Math.max(...data, 1)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 80
  const h = 32
  const gap = 3
  const barW = Math.max(2, (w - gap * (data.length - 1)) / data.length)

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      aria-hidden
      className={cn("opacity-60", className)}
    >
      {data.map((val, i) => {
        const barH = Math.max(2, ((val - min) / range) * (h - 4) + 2)
        const x = i * (barW + gap)
        const y = h - barH
        const isLast = i === data.length - 1
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={barW}
            height={barH}
            rx={1.5}
            fill={color}
            opacity={isLast ? 1 : 0.45}
          />
        )
      })}
    </svg>
  )
}

// ── KpiCard ───────────────────────────────────────────────────────────────────

/**
 * KpiCard
 *
 * Props:
 *   title           — metric label
 *   value           — number or string
 *   format          — "number" | "currency" | "percent" | "compact"  (default: "number")
 *   change          — percentage change number  e.g. 12.5 means +12.5%
 *   changeLabel     — label after change e.g. "vs last week"
 *   invert          — flip good/bad color logic (e.g. for "Absent" where lower is better)
 *   icon            — Lucide icon component
 *   iconColor       — tailwind color token for icon bg  e.g. "blue" | "green" | "red" | "yellow" | "purple" | "orange"
 *   sparkline       — array of numbers for mini bar chart
 *   description     — small helper text below value
 *   loading         — show skeleton
 *   onClick         — make card clickable
 *   href            — make card a link (use with Next Link or router.push)
 *   className       — wrapper className
 *   size            — "sm" | "md"  (default: "md")
 *   footer          — ReactNode rendered at the bottom of the card
 */

const iconColors = {
  blue:   { bg: "bg-blue-50 dark:bg-blue-950/40",   icon: "text-blue-600 dark:text-blue-400" },
  green:  { bg: "bg-green-50 dark:bg-green-950/40", icon: "text-green-600 dark:text-green-400" },
  red:    { bg: "bg-red-50 dark:bg-red-950/40",     icon: "text-red-600 dark:text-red-400" },
  yellow: { bg: "bg-yellow-50 dark:bg-yellow-950/40", icon: "text-yellow-600 dark:text-yellow-400" },
  purple: { bg: "bg-purple-50 dark:bg-purple-950/40", icon: "text-purple-600 dark:text-purple-400" },
  orange: { bg: "bg-orange-50 dark:bg-orange-950/40", icon: "text-orange-600 dark:text-orange-400" },
  teal:   { bg: "bg-teal-50 dark:bg-teal-950/40",   icon: "text-teal-600 dark:text-teal-400" },
  pink:   { bg: "bg-pink-50 dark:bg-pink-950/40",   icon: "text-pink-600 dark:text-pink-400" },
}

const KpiCard = ({
  title,
  value,
  format = "number",
  change,
  changeLabel = "vs last month",
  invert = false,
  icon: Icon,
  iconColor = "blue",
  sparkline,
  description,
  loading = false,
  onClick,
  className,
  size = "md",
  footer,
}) => {
  const colors = iconColors[iconColor] ?? iconColors.blue
  const isSmall = size === "sm"
  const isClickable = !!onClick

  const content = loading ? (
    <CardContent className={cn("p-4", isSmall && "p-3")}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-2 flex-1">
          <Skeleton className="h-3.5 w-24 rounded" />
          <Skeleton className="h-7 w-32 rounded" />
          <Skeleton className="h-3 w-20 rounded" />
        </div>
        <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
      </div>
    </CardContent>
  ) : (
    <CardContent className={cn("p-4", isSmall && "p-3")}>
      <div className="flex items-start justify-between gap-3">
        {/* Left: text content */}
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          {/* Title */}
          <p
            className={cn(
              "text-muted-foreground font-medium tracking-wide truncate",
              "animate-in fade-in-0 duration-200",
              isSmall ? "text-xs" : "text-xs uppercase"
            )}
          >
            {title}
          </p>

          {/* Value */}
          <p
            className={cn(
              "font-bold tabular-nums text-foreground leading-none",
              "animate-in fade-in-0 slide-in-from-bottom-1 duration-300 delay-75",
              isSmall ? "text-xl" : "text-2xl"
            )}
          >
            {formatValue(value, format)}
          </p>

          {/* Trend + description */}
          <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
            <TrendBadge
              change={change}
              changeLabel={changeLabel}
              invert={invert}
            />
            {description && !change && (
              <span className="text-xs text-muted-foreground">{description}</span>
            )}
          </div>

          {description && change != null && (
            <span className="text-xs text-muted-foreground mt-0.5">
              {description}
            </span>
          )}
        </div>

        {/* Right: icon + sparkline */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          {Icon && (
            <div
              className={cn(
                "flex items-center justify-center rounded-lg",
                "animate-in zoom-in-50 duration-300 delay-100",
                colors.bg,
                isSmall ? "h-8 w-8" : "h-10 w-10"
              )}
              aria-hidden
            >
              <Icon
                className={cn(colors.icon, isSmall ? "h-4 w-4" : "h-5 w-5")}
                strokeWidth={1.75}
              />
            </div>
          )}
          {sparkline && sparkline.length > 0 && (
            <Sparkline
              data={sparkline}
              color={
                change == null
                  ? "var(--color-primary, #3b82f6)"
                  : invert
                  ? change < 0 ? "#22c55e" : "#ef4444"
                  : change >= 0 ? "#22c55e" : "#ef4444"
              }
            />
          )}
        </div>
      </div>

      {/* Footer slot */}
      {footer && (
        <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
          {footer}
        </div>
      )}
    </CardContent>
  )

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-200",
        "animate-in fade-in-0 slide-in-from-bottom-2 duration-300",
        isClickable && [
          "cursor-pointer",
          "hover:shadow-md hover:-translate-y-0.5",
          "active:translate-y-0 active:shadow-sm",
        ],
        className
      )}
      onClick={isClickable ? onClick : undefined}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={
        isClickable
          ? (e) => (e.key === "Enter" || e.key === " ") && onClick()
          : undefined
      }
    >
      {content}
    </Card>
  )
}

// ── KpiGrid ───────────────────────────────────────────────────────────────────

/**
 * KpiGrid
 *
 * Responsive grid wrapper for KpiCards.
 * Staggered entrance animations per card.
 *
 * Props:
 *   cols      — number of columns at md+  (default: 4)
 *   children  — <KpiCard /> elements
 *   className
 */

const KpiGrid = ({ cols = 4, children, className }) => {
  const colMap = {
    1: "md:grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
    5: "md:grid-cols-5",
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 gap-4",
        colMap[cols] ?? "md:grid-cols-4",
        className
      )}
    >
      {React.Children.map(children, (child, i) =>
        React.isValidElement(child)
          ? React.cloneElement(child, {
              style: {
                ...child.props.style,
                animationDelay: `${i * 60}ms`,
              },
            })
          : child
      )}
    </div>
  )
}

export { KpiCard, KpiGrid, TrendBadge, Sparkline, formatValue }