"use client"

import * as React from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

// ── Base pulse wrapper ────────────────────────────────────────────────────────

const SkeletonPulse = ({ className, ...props }) => (
  <Skeleton className={cn("rounded-md", className)} {...props} />
)

// ── Generic layouts ───────────────────────────────────────────────────────────

/**
 * TextSkeleton — mimics a block of text lines
 * Props: lines, className, lastLineWidth ("full"|"3/4"|"1/2"|"1/3")
 */
const TextSkeleton = ({
  lines = 3,
  className,
  lastLineWidth = "3/4",
}) => {
  const widthMap = {
    full: "w-full",
    "3/4": "w-3/4",
    "1/2": "w-1/2",
    "1/3": "w-1/3",
  }
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonPulse
          key={i}
          className={cn(
            "h-4",
            i === lines - 1 ? widthMap[lastLineWidth] ?? "w-3/4" : "w-full"
          )}
        />
      ))}
    </div>
  )
}

// ── KPI Card skeleton ─────────────────────────────────────────────────────────

const KpiCardSkeleton = ({ className }) => (
  <div
    className={cn(
      "rounded-xl border border-border bg-card p-4 flex items-start justify-between gap-3",
      className
    )}
  >
    <div className="flex flex-col gap-2 flex-1">
      <SkeletonPulse className="h-3 w-20" />
      <SkeletonPulse className="h-7 w-28" />
      <SkeletonPulse className="h-4 w-16 rounded-full" />
    </div>
    <SkeletonPulse className="h-10 w-10 rounded-lg shrink-0" />
  </div>
)

/**
 * KpiGridSkeleton — row of KPI cards
 * Props: count (default 4)
 */
const KpiGridSkeleton = ({ count = 4, className }) => (
  <div
    className={cn(
      "grid grid-cols-1 sm:grid-cols-2 gap-4",
      count === 3 ? "md:grid-cols-3" : count === 2 ? "md:grid-cols-2" : "md:grid-cols-4",
      className
    )}
  >
    {Array.from({ length: count }).map((_, i) => (
      <KpiCardSkeleton key={i} />
    ))}
  </div>
)

// ── Table skeleton ────────────────────────────────────────────────────────────

/**
 * TableSkeleton
 * Props: rows (default 6), cols (default 5), hasCheckbox, hasActions
 */
const TableSkeleton = ({
  rows = 6,
  cols = 5,
  hasCheckbox = false,
  hasActions = true,
  className,
}) => {
  const totalCols = cols + (hasCheckbox ? 1 : 0) + (hasActions ? 1 : 0)

  return (
    <div
      className={cn(
        "rounded-lg border border-border overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-4 bg-muted/40 px-4 py-3 border-b border-border">
        {hasCheckbox && <SkeletonPulse className="h-4 w-4 rounded" />}
        {Array.from({ length: cols }).map((_, i) => (
          <SkeletonPulse key={i} className="h-3 flex-1" />
        ))}
        {hasActions && <SkeletonPulse className="h-3 w-14" />}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={r}
          className="flex items-center gap-4 px-4 py-3 border-b border-border last:border-0"
          style={{ animationDelay: `${r * 30}ms` }}
        >
          {hasCheckbox && <SkeletonPulse className="h-4 w-4 rounded" />}
          {Array.from({ length: cols }).map((_, c) => (
            <SkeletonPulse
              key={c}
              className={cn(
                "h-4 flex-1",
                c === 0 && "max-w-[40px]",   // narrow first col (e.g. roll no)
                c === 1 && "max-w-[140px]",  // name col
              )}
            />
          ))}
          {hasActions && (
            <div className="flex gap-1.5">
              <SkeletonPulse className="h-7 w-14 rounded-md" />
              <SkeletonPulse className="h-7 w-7 rounded-md" />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ── Form skeleton ─────────────────────────────────────────────────────────────

/**
 * FormSkeleton
 * Props: fields (default 4), hasSubmit
 */
const FormFieldSkeleton = () => (
  <div className="flex flex-col gap-1.5">
    <SkeletonPulse className="h-3.5 w-24" />
    <SkeletonPulse className="h-10 w-full rounded-md" />
  </div>
)

const FormSkeleton = ({ fields = 4, cols = 1, hasSubmit = true, className }) => (
  <div className={cn("flex flex-col gap-6", className)}>
    <div
      className={cn(
        "grid gap-4",
        cols === 2 && "sm:grid-cols-2",
        cols === 3 && "sm:grid-cols-3"
      )}
    >
      {Array.from({ length: fields }).map((_, i) => (
        <FormFieldSkeleton key={i} />
      ))}
    </div>
    {hasSubmit && (
      <div className="flex gap-2">
        <SkeletonPulse className="h-10 w-28 rounded-md" />
        <SkeletonPulse className="h-10 w-20 rounded-md" />
      </div>
    )}
  </div>
)

// ── Card skeleton ─────────────────────────────────────────────────────────────

/**
 * CardSkeleton — generic card with header + body lines
 * Props: hasHeader, hasFooter, lines, className
 */
const CardSkeleton = ({
  hasHeader = true,
  hasFooter = false,
  lines = 3,
  className,
}) => (
  <div
    className={cn(
      "rounded-xl border border-border bg-card overflow-hidden",
      className
    )}
  >
    {hasHeader && (
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <SkeletonPulse className="h-4 w-32" />
        <SkeletonPulse className="h-7 w-20 rounded-md" />
      </div>
    )}
    <div className="p-4 flex flex-col gap-3">
      <TextSkeleton lines={lines} />
    </div>
    {hasFooter && (
      <div className="px-4 py-3 border-t border-border flex justify-end gap-2">
        <SkeletonPulse className="h-8 w-20 rounded-md" />
        <SkeletonPulse className="h-8 w-24 rounded-md" />
      </div>
    )}
  </div>
)

// ── Profile / detail skeleton ─────────────────────────────────────────────────

/**
 * ProfileSkeleton — avatar + name + metadata rows
 */
const ProfileSkeleton = ({ className }) => (
  <div className={cn("flex flex-col gap-6", className)}>
    {/* Avatar + name block */}
    <div className="flex items-center gap-4">
      <SkeletonPulse className="h-16 w-16 rounded-full shrink-0" />
      <div className="flex flex-col gap-2 flex-1">
        <SkeletonPulse className="h-5 w-40" />
        <SkeletonPulse className="h-3.5 w-28" />
        <SkeletonPulse className="h-5 w-16 rounded-full" />
      </div>
    </div>
    {/* Detail rows */}
    <div className="grid sm:grid-cols-2 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-1">
          <SkeletonPulse className="h-3 w-20" />
          <SkeletonPulse className="h-4 w-36" />
        </div>
      ))}
    </div>
  </div>
)

// ── Dashboard page skeleton ───────────────────────────────────────────────────

/**
 * DashboardSkeleton — full page loading skeleton
 * KPI row + chart area + table
 */
const DashboardSkeleton = ({ className }) => (
  <div className={cn("flex flex-col gap-6", className)}>
    <KpiGridSkeleton count={4} />
    <div className="grid md:grid-cols-3 gap-4">
      <div className="md:col-span-2">
        <CardSkeleton lines={1} hasHeader>
          <div className="p-4">
            <SkeletonPulse className="h-48 w-full rounded-lg" />
          </div>
        </CardSkeleton>
      </div>
      <CardSkeleton lines={5} hasHeader />
    </div>
    <TableSkeleton rows={5} cols={4} hasCheckbox hasActions />
  </div>
)

// ── Sidebar skeleton ──────────────────────────────────────────────────────────

const SidebarSkeleton = ({ className }) => (
  <div className={cn("flex flex-col gap-1 p-3", className)}>
    {/* Logo area */}
    <div className="flex items-center gap-3 px-2 py-3 mb-2">
      <SkeletonPulse className="h-8 w-8 rounded-lg shrink-0" />
      <SkeletonPulse className="h-4 w-28" />
    </div>
    {/* Nav items */}
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg">
        <SkeletonPulse className="h-4 w-4 rounded shrink-0" />
        <SkeletonPulse className="h-3.5 flex-1" />
      </div>
    ))}
  </div>
)

// ── Notification list skeleton ────────────────────────────────────────────────

const NotificationSkeleton = ({ count = 5, className }) => (
  <div className={cn("flex flex-col divide-y divide-border", className)}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex items-start gap-3 px-4 py-3">
        <SkeletonPulse className="h-8 w-8 rounded-full shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <SkeletonPulse className="h-3.5 w-3/4" />
          <SkeletonPulse className="h-3 w-1/2" />
          <SkeletonPulse className="h-3 w-16" />
        </div>
      </div>
    ))}
  </div>
)

// ── Page header skeleton ──────────────────────────────────────────────────────

const PageHeaderSkeleton = ({ className }) => (
  <div className={cn("flex items-start justify-between gap-4", className)}>
    <div className="flex flex-col gap-2">
      <SkeletonPulse className="h-3 w-48" />   {/* breadcrumb */}
      <SkeletonPulse className="h-7 w-40" />   {/* page title */}
      <SkeletonPulse className="h-3.5 w-64" /> {/* subtitle */}
    </div>
    <div className="flex gap-2 shrink-0">
      <SkeletonPulse className="h-9 w-24 rounded-md" />
      <SkeletonPulse className="h-9 w-28 rounded-md" />
    </div>
  </div>
)

// ── Named full-page skeletons for each module ─────────────────────────────────

const StudentsPageSkeleton = () => (
  <div className="flex flex-col gap-6">
    <PageHeaderSkeleton />
    <KpiGridSkeleton count={4} />
    <TableSkeleton rows={8} cols={5} hasCheckbox hasActions />
  </div>
)

const AttendancePageSkeleton = () => (
  <div className="flex flex-col gap-6">
    <PageHeaderSkeleton />
    <KpiGridSkeleton count={3} />
    <div className="grid md:grid-cols-3 gap-4">
      <div className="md:col-span-2">
        <CardSkeleton hasHeader lines={1}>
          <SkeletonPulse className="h-56 w-full rounded-lg" />
        </CardSkeleton>
      </div>
      <CardSkeleton hasHeader lines={6} />
    </div>
    <TableSkeleton rows={6} cols={4} hasCheckbox={false} hasActions />
  </div>
)

const NotificationsPageSkeleton = () => (
  <div className="flex flex-col gap-6">
    <PageHeaderSkeleton />
    <div className="grid md:grid-cols-3 gap-4">
      <div className="md:col-span-2">
        <CardSkeleton hasHeader lines={0}>
          <NotificationSkeleton count={6} />
        </CardSkeleton>
      </div>
      <CardSkeleton hasHeader lines={4} />
    </div>
  </div>
)

const SettingsPageSkeleton = () => (
  <div className="flex flex-col gap-6">
    <PageHeaderSkeleton />
    <div className="grid md:grid-cols-4 gap-6">
      <div className="md:col-span-1 flex flex-col gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonPulse key={i} className="h-9 w-full rounded-md" />
        ))}
      </div>
      <div className="md:col-span-3">
        <CardSkeleton hasHeader hasFooter lines={0}>
          <FormSkeleton fields={6} cols={2} hasSubmit={false} />
        </CardSkeleton>
      </div>
    </div>
  </div>
)

export {
  // Primitives
  SkeletonPulse,
  TextSkeleton,

  // Components
  KpiCardSkeleton,
  KpiGridSkeleton,
  TableSkeleton,
  FormSkeleton,
  FormFieldSkeleton,
  CardSkeleton,
  ProfileSkeleton,
  SidebarSkeleton,
  NotificationSkeleton,
  PageHeaderSkeleton,

  // Full-page
  DashboardSkeleton,
  StudentsPageSkeleton,
  AttendancePageSkeleton,
  NotificationsPageSkeleton,
  SettingsPageSkeleton,
}