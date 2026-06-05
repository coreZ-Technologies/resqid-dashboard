"use client"

import * as React from "react"
import {
  Users,
  GraduationCap,
  CalendarX,
  BellOff,
  FileX,
  SearchX,
  ShieldOff,
  Wifi,
  ServerCrash,
  PackageOpen,
  ClipboardX,
  FolderOpen,
  MessageSquareOff,
  ScanLine,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// ── Preset registry ───────────────────────────────────────────────────────────

const presets = {
  students: {
    icon: GraduationCap,
    title: "No students yet",
    description: "Add your first student to get started with attendance and ID card management.",
  },
  parents: {
    icon: Users,
    title: "No parents found",
    description: "Parents will appear here once students are enrolled and linked.",
  },
  attendance: {
    icon: CalendarX,
    title: "No attendance records",
    description: "Attendance records will appear here once a session has been started.",
  },
  notifications: {
    icon: BellOff,
    title: "All caught up",
    description: "You have no notifications right now. Check back later.",
  },
  search: {
    icon: SearchX,
    title: "No results found",
    description: "Try adjusting your search or filters to find what you're looking for.",
  },
  reports: {
    icon: FileX,
    title: "No reports available",
    description: "Reports will be generated once there is enough data to analyse.",
  },
  cards: {
    icon: PackageOpen,
    title: "No card orders",
    description: "Card orders placed by parents will appear here.",
  },
  scans: {
    icon: ScanLine,
    title: "No scan logs",
    description: "QR and RFID scan events will be recorded here in real time.",
  },
  messages: {
    icon: MessageSquareOff,
    title: "No messages",
    description: "Messages sent to parents and staff will appear here.",
  },
  announcements: {
    icon: ClipboardX,
    title: "No announcements",
    description: "Broadcast announcements to parents and teachers from here.",
  },
  files: {
    icon: FolderOpen,
    title: "No files found",
    description: "Uploaded documents and exports will appear here.",
  },
  permissions: {
    icon: ShieldOff,
    title: "Access restricted",
    description: "You don't have permission to view this content. Contact your administrator.",
  },
  offline: {
    icon: Wifi,
    title: "You're offline",
    description: "Check your internet connection and try again.",
  },
  error: {
    icon: ServerCrash,
    title: "Something went wrong",
    description: "An unexpected error occurred. Please try again or contact support.",
  },
  generic: {
    icon: PackageOpen,
    title: "Nothing here yet",
    description: "This section is empty. Check back later.",
  },
}

// ── Size config ───────────────────────────────────────────────────────────────

const sizes = {
  sm: {
    wrapper: "py-8 gap-3",
    iconBox: "h-10 w-10",
    iconSize: "h-5 w-5",
    title: "text-sm font-medium",
    description: "text-xs",
  },
  md: {
    wrapper: "py-12 gap-4",
    iconBox: "h-14 w-14",
    iconSize: "h-7 w-7",
    title: "text-base font-semibold",
    description: "text-sm",
  },
  lg: {
    wrapper: "py-20 gap-5",
    iconBox: "h-20 w-20",
    iconSize: "h-10 w-10",
    title: "text-lg font-semibold",
    description: "text-sm",
  },
}

// ── EmptyState ────────────────────────────────────────────────────────────────

/**
 * EmptyState
 *
 * Props:
 *   preset        — key from presets registry (auto-fills icon, title, description)
 *                   "students" | "parents" | "attendance" | "notifications" |
 *                   "search" | "reports" | "cards" | "scans" | "messages" |
 *                   "announcements" | "files" | "permissions" | "offline" |
 *                   "error" | "generic"
 *   icon          — override icon (any Lucide component)
 *   title         — override title
 *   description   — override description
 *   size          — "sm" | "md" | "lg"    (default: "md")
 *   action        — primary CTA: { label, onClick, icon?, variant? }
 *   secondaryAction — secondary CTA: { label, onClick, icon?, variant? }
 *   className     — wrapper className
 *   bordered      — wrap in a dashed border box   (default: false)
 */

const EmptyState = ({
  preset = "generic",
  icon,
  title,
  description,
  size = "md",
  action,
  secondaryAction,
  className,
  bordered = false,
}) => {
  const cfg = presets[preset] ?? presets.generic
  const sz = sizes[size] ?? sizes.md

  const Icon = icon ?? cfg.icon
  const resolvedTitle = title ?? cfg.title
  const resolvedDesc = description ?? cfg.description

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center w-full",
        "animate-in fade-in-0 zoom-in-95 duration-300",
        sz.wrapper,
        bordered &&
          "rounded-xl border-2 border-dashed border-border bg-muted/20 px-6",
        className
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "flex items-center justify-center rounded-full",
          "bg-muted text-muted-foreground",
          "animate-in zoom-in-50 duration-500 delay-75",
          sz.iconBox
        )}
        aria-hidden
      >
        <Icon className={cn(sz.iconSize)} strokeWidth={1.5} />
      </div>

      {/* Text */}
      <div className="flex flex-col gap-1 max-w-xs">
        <p
          className={cn(
            "text-foreground animate-in fade-in-0 slide-in-from-bottom-1 duration-300 delay-100",
            sz.title
          )}
        >
          {resolvedTitle}
        </p>
        {resolvedDesc && (
          <p
            className={cn(
              "text-muted-foreground leading-relaxed animate-in fade-in-0 slide-in-from-bottom-1 duration-300 delay-150",
              sz.description
            )}
          >
            {resolvedDesc}
          </p>
        )}
      </div>

      {/* Actions */}
      {(action || secondaryAction) && (
        <div
          className={cn(
            "flex flex-wrap items-center justify-center gap-2",
            "animate-in fade-in-0 slide-in-from-bottom-2 duration-300 delay-200"
          )}
        >
          {action && (
            <Button
              size={size === "sm" ? "sm" : "default"}
              variant={action.variant ?? "default"}
              onClick={action.onClick}
              className="gap-2"
            >
              {action.icon && <action.icon className="h-4 w-4" aria-hidden />}
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              size={size === "sm" ? "sm" : "default"}
              variant={secondaryAction.variant ?? "outline"}
              onClick={secondaryAction.onClick}
              className="gap-2"
            >
              {secondaryAction.icon && (
                <secondaryAction.icon className="h-4 w-4" aria-hidden />
              )}
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

// ── Inline variant (for inside tables / cards) ────────────────────────────────

/**
 * InlineEmptyState
 *
 * Compact horizontal layout — icon + text side by side.
 * Ideal for inside table cells, sidebar panels, small cards.
 *
 * Props: same as EmptyState minus size/bordered/secondaryAction
 */

const InlineEmptyState = ({
  preset = "generic",
  icon,
  title,
  description,
  action,
  className,
}) => {
  const cfg = presets[preset] ?? presets.generic
  const Icon = icon ?? cfg.icon
  const resolvedTitle = title ?? cfg.title
  const resolvedDesc = description ?? cfg.description

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border border-dashed border-border",
        "bg-muted/20 px-4 py-3 text-left",
        "animate-in fade-in-0 duration-200",
        className
      )}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden />
      </div>
      <div className="flex flex-col gap-0.5 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{resolvedTitle}</p>
        {resolvedDesc && (
          <p className="text-xs text-muted-foreground line-clamp-2">{resolvedDesc}</p>
        )}
      </div>
      {action && (
        <Button
          size="sm"
          variant={action.variant ?? "outline"}
          onClick={action.onClick}
          className="ml-auto shrink-0 gap-1.5 text-xs"
        >
          {action.icon && <action.icon className="h-3.5 w-3.5" aria-hidden />}
          {action.label}
        </Button>
      )}
    </div>
  )
}

export { EmptyState, InlineEmptyState, presets }