"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cn } from "@/lib/utils"

const Avatar = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      "ring-2 ring-transparent transition-all duration-200",
      "hover:ring-primary/30 hover:scale-105",
      className
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn(
      "aspect-square h-full w-full object-cover",
      "animate-in fade-in-0 duration-300",
      className
    )}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full",
      "bg-muted text-muted-foreground text-sm font-medium",
      "animate-in fade-in-0 zoom-in-95 duration-300",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

// ── Sized variants for convenience ──────────────────────────────────────────

const avatarSizes = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
  "2xl": "h-20 w-20 text-xl",
}

/**
 * AvatarWithStatus
 * Wraps Avatar with an optional online/offline/away/busy status dot.
 *
 * Props:
 *   src        — image URL
 *   alt        — alt text / used to generate initials fallback
 *   size       — "xs" | "sm" | "md" | "lg" | "xl" | "2xl"  (default: "md")
 *   status     — "online" | "offline" | "away" | "busy"     (optional)
 *   className  — forwarded to outer wrapper
 */
const statusColors = {
  online:  "bg-green-500",
  offline: "bg-zinc-400",
  away:    "bg-yellow-400",
  busy:    "bg-red-500",
}

function getInitials(alt = "") {
  return alt
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("")
}

const AvatarWithStatus = React.forwardRef(
  ({ src, alt = "", size = "md", status, className, ...props }, ref) => {
    const sizeClass = avatarSizes[size] ?? avatarSizes.md

    return (
      <span className={cn("relative inline-flex", className)} ref={ref}>
        <Avatar className={sizeClass} {...props}>
          <AvatarImage src={src} alt={alt} />
          <AvatarFallback className={sizeClass}>
            {getInitials(alt) || "?"}
          </AvatarFallback>
        </Avatar>

        {status && (
          <span
            aria-label={status}
            className={cn(
              "absolute bottom-0 right-0 block rounded-full ring-2 ring-background",
              "animate-in zoom-in-50 duration-200",
              statusColors[status],
              size === "xs" || size === "sm" ? "h-2 w-2" : "h-3 w-3"
            )}
          />
        )}
      </span>
    )
  }
)
AvatarWithStatus.displayName = "AvatarWithStatus"

// ── Avatar Group (stacked) ───────────────────────────────────────────────────

/**
 * AvatarGroup
 * Renders a stacked list of avatars with a "+N more" overflow pill.
 *
 * Props:
 *   users   — array of { src, alt }
 *   max     — max avatars to show before overflow pill  (default: 4)
 *   size    — same size tokens as AvatarWithStatus      (default: "sm")
 */
const AvatarGroup = React.forwardRef(
  ({ users = [], max = 4, size = "sm", className }, ref) => {
    const visible = users.slice(0, max)
    const overflow = users.length - max
    const sizeClass = avatarSizes[size] ?? avatarSizes.sm

    return (
      <div
        ref={ref}
        className={cn("flex items-center -space-x-2", className)}
        aria-label={`${users.length} members`}
      >
        {visible.map((user, i) => (
          <Avatar
            key={i}
            className={cn(
              sizeClass,
              "ring-2 ring-background transition-transform duration-150",
              "hover:z-10 hover:scale-110 hover:-translate-y-0.5"
            )}
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <AvatarImage src={user.src} alt={user.alt} />
            <AvatarFallback className={sizeClass}>
              {getInitials(user.alt)}
            </AvatarFallback>
          </Avatar>
        ))}

        {overflow > 0 && (
          <span
            className={cn(
              sizeClass,
              "flex items-center justify-center rounded-full",
              "bg-muted text-muted-foreground text-xs font-medium",
              "ring-2 ring-background",
              "animate-in fade-in-0 zoom-in-95 duration-300"
            )}
          >
            +{overflow}
          </span>
        )}
      </div>
    )
  }
)
AvatarGroup.displayName = "AvatarGroup"

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarWithStatus,
  AvatarGroup,
  getInitials,
}