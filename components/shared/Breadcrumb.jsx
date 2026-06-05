"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronRight, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

// ── Primitives ───────────────────────────────────────────────────────────────

const Breadcrumb = React.forwardRef(({ className, ...props }, ref) => (
  <nav
    ref={ref}
    aria-label="breadcrumb"
    className={cn("flex items-center", className)}
    {...props}
  />
))
Breadcrumb.displayName = "Breadcrumb"

const BreadcrumbList = React.forwardRef(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn(
      "flex flex-wrap items-center gap-1 text-sm text-muted-foreground",
      className
    )}
    {...props}
  />
))
BreadcrumbList.displayName = "BreadcrumbList"

const BreadcrumbItem = React.forwardRef(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("inline-flex items-center gap-1", className)}
    {...props}
  />
))
BreadcrumbItem.displayName = "BreadcrumbItem"

const BreadcrumbLink = React.forwardRef(
  ({ className, href, asChild, children, ...props }, ref) => {
    return (
      <Link
        ref={ref}
        href={href ?? "#"}
        className={cn(
          "inline-flex items-center gap-1 transition-colors duration-150",
          "hover:text-foreground hover:underline underline-offset-4",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm",
          className
        )}
        {...props}
      >
        {children}
      </Link>
    )
  }
)
BreadcrumbLink.displayName = "BreadcrumbLink"

const BreadcrumbPage = React.forwardRef(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn("font-medium text-foreground", className)}
    {...props}
  />
))
BreadcrumbPage.displayName = "BreadcrumbPage"

const BreadcrumbSeparator = ({ className, children, ...props }) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn("flex items-center text-muted-foreground/60", className)}
    {...props}
  >
    {children ?? <ChevronRight className="h-3.5 w-3.5" />}
  </li>
)
BreadcrumbSeparator.displayName = "BreadcrumbSeparator"

const BreadcrumbEllipsis = ({ className, ...props }) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
)
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis"

// ── Smart compound component ─────────────────────────────────────────────────

/**
 * PageBreadcrumb
 *
 * Drop-in breadcrumb for every page in the dashboard.
 * Automatically collapses middle segments on small screens when
 * there are more than `collapseAfter` items.
 *
 * Props:
 *   items         — array of { label, href?, icon? }
 *                   Last item is always rendered as the current page (no link).
 *   collapseAfter — collapse middle items beyond this count (default: 3)
 *   className     — forwarded to <Breadcrumb>
 *
 * Usage:
 *   <PageBreadcrumb
 *     items={[
 *       { label: "Dashboard", href: "/school" },
 *       { label: "Students",  href: "/school/students" },
 *       { label: "Add Student" },
 *     ]}
 *   />
 */
const PageBreadcrumb = React.forwardRef(
  ({ items = [], collapseAfter = 3, className }, ref) => {
    const [expanded, setExpanded] = React.useState(false)

    if (!items.length) return null

    const shouldCollapse = !expanded && items.length > collapseAfter + 1
    const first = items[0]
    const last = items[items.length - 1]
    const middle = items.slice(1, -1)
    const visibleMiddle = shouldCollapse ? [] : middle

    return (
      <Breadcrumb ref={ref} className={className}>
        <BreadcrumbList>
          {/* First item */}
          <BreadcrumbItem>
            {first.href ? (
              <BreadcrumbLink href={first.href}>
                {first.icon && (
                  <first.icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
                )}
                <span>{first.label}</span>
              </BreadcrumbLink>
            ) : (
              <BreadcrumbPage>{first.label}</BreadcrumbPage>
            )}
          </BreadcrumbItem>

          {/* Ellipsis when collapsed */}
          {shouldCollapse && middle.length > 0 && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <button
                  onClick={() => setExpanded(true)}
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded",
                    "text-muted-foreground hover:text-foreground hover:bg-muted",
                    "transition-colors duration-150",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  )}
                  aria-label="Show full path"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </BreadcrumbItem>
            </>
          )}

          {/* Middle items (visible when expanded or not collapsed) */}
          {visibleMiddle.map((item, i) => (
            <React.Fragment key={i}>
              <BreadcrumbSeparator />
              <BreadcrumbItem
                className="animate-in fade-in-0 slide-in-from-left-1 duration-200"
              >
                {item.href ? (
                  <BreadcrumbLink href={item.href}>
                    {item.icon && (
                      <item.icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    )}
                    <span>{item.label}</span>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}

          {/* Last item — always current page */}
          {items.length > 1 && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {last.icon && (
                    <last.icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  )}
                  {last.label}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    )
  }
)
PageBreadcrumb.displayName = "PageBreadcrumb"

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
  PageBreadcrumb,
}