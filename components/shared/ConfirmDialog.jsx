"use client"

import * as React from "react"
import { AlertTriangle, Trash2, LogOut, ShieldAlert, Info } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// ── Variant config ────────────────────────────────────────────────────────────

const variants = {
  danger: {
    icon: AlertTriangle,
    iconClass: "text-destructive",
    iconBg: "bg-destructive/10",
    confirmClass: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  },
  delete: {
    icon: Trash2,
    iconClass: "text-destructive",
    iconBg: "bg-destructive/10",
    confirmClass: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  },
  warning: {
    icon: AlertTriangle,
    iconClass: "text-yellow-600",
    iconBg: "bg-yellow-50 dark:bg-yellow-950/30",
    confirmClass: "bg-yellow-600 text-white hover:bg-yellow-700",
  },
  logout: {
    icon: LogOut,
    iconClass: "text-muted-foreground",
    iconBg: "bg-muted",
    confirmClass: "",
  },
  security: {
    icon: ShieldAlert,
    iconClass: "text-orange-600",
    iconBg: "bg-orange-50 dark:bg-orange-950/30",
    confirmClass: "bg-orange-600 text-white hover:bg-orange-700",
  },
  info: {
    icon: Info,
    iconClass: "text-blue-600",
    iconBg: "bg-blue-50 dark:bg-blue-950/30",
    confirmClass: "",
  },
}

// ── ConfirmDialog ─────────────────────────────────────────────────────────────

/**
 * ConfirmDialog
 *
 * A reusable confirmation dialog built on shadcn/ui Dialog.
 *
 * Props:
 *   open            — controlled open state
 *   onOpenChange    — setter for open state
 *   variant         — "danger" | "delete" | "warning" | "logout" | "security" | "info"  (default: "danger")
 *   title           — dialog heading
 *   description     — supporting text (string or ReactNode)
 *   confirmLabel    — confirm button text  (default: "Confirm")
 *   cancelLabel     — cancel button text   (default: "Cancel")
 *   onConfirm       — async or sync callback on confirm
 *   onCancel        — optional callback on cancel / close
 *   loading         — show loading spinner on confirm button
 *   destructive     — force red confirm button regardless of variant
 *   children        — optional extra content rendered between description and footer
 *
 * Usage:
 *   const [open, setOpen] = React.useState(false)
 *
 *   <ConfirmDialog
 *     open={open}
 *     onOpenChange={setOpen}
 *     variant="delete"
 *     title="Delete student?"
 *     description="This will permanently remove Riya Sen and all associated records."
 *     confirmLabel="Delete"
 *     onConfirm={handleDelete}
 *   />
 */

const ConfirmDialog = ({
  open,
  onOpenChange,
  variant = "danger",
  title = "Are you sure?",
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
  destructive,
  children,
}) => {
  const [busy, setBusy] = React.useState(false)
  const config = variants[variant] ?? variants.danger
  const Icon = config.icon

  const handleConfirm = async () => {
    if (!onConfirm) return
    setBusy(true)
    try {
      await onConfirm()
    } finally {
      setBusy(false)
    }
  }

  const handleCancel = () => {
    onCancel?.()
    onOpenChange?.(false)
  }

  const isLoading = loading || busy

  const confirmBtnClass =
    destructive
      ? variants.danger.confirmClass
      : !config.confirmClass
      ? ""
      : config.confirmClass

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "max-w-md gap-0 p-0 overflow-hidden",
          "animate-in fade-in-0 zoom-in-95 duration-200"
        )}
      >
        {/* Header area */}
        <div className="flex flex-col items-center gap-3 px-6 pt-6 pb-4 text-center">
          {/* Icon badge */}
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full",
              "animate-in zoom-in-50 duration-300 delay-75",
              config.iconBg
            )}
          >
            <Icon className={cn("h-6 w-6", config.iconClass)} aria-hidden />
          </div>

          <DialogHeader className="space-y-1.5">
            <DialogTitle className="text-base font-semibold leading-tight">
              {title}
            </DialogTitle>
            {description && (
              <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
        </div>

        {/* Optional extra content */}
        {children && (
          <div className="px-6 pb-4 text-sm text-muted-foreground">
            {children}
          </div>
        )}

        {/* Divider */}
        <div className="h-px bg-border" />

        {/* Footer */}
        <DialogFooter className="flex flex-row justify-end gap-2 px-6 py-4">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
            className="min-w-[80px]"
          >
            {cancelLabel}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className={cn("min-w-[80px] gap-2", confirmBtnClass)}
          >
            {isLoading && (
              <svg
                className="h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <circle
                  className="opacity-25"
                  cx="12" cy="12" r="10"
                  stroke="currentColor" strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            )}
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ── useConfirmDialog hook ─────────────────────────────────────────────────────

/**
 * useConfirmDialog
 *
 * Imperative hook — call confirm() and await the user's decision
 * without manually managing open state.
 *
 * Usage:
 *   const { confirmDialog, confirm } = useConfirmDialog()
 *
 *   const handleDelete = async () => {
 *     const ok = await confirm({
 *       variant: "delete",
 *       title: "Delete student?",
 *       description: "This cannot be undone.",
 *       confirmLabel: "Delete",
 *     })
 *     if (ok) await deleteStudent(id)
 *   }
 *
 *   return (
 *     <>
 *       <button onClick={handleDelete}>Delete</button>
 *       {confirmDialog}
 *     </>
 *   )
 */

const useConfirmDialog = () => {
  const [open, setOpen] = React.useState(false)
  const [options, setOptions] = React.useState({})
  const resolveRef = React.useRef(null)

  const confirm = React.useCallback((opts = {}) => {
    setOptions(opts)
    setOpen(true)
    return new Promise((resolve) => {
      resolveRef.current = resolve
    })
  }, [])

  const handleConfirm = React.useCallback(() => {
    resolveRef.current?.(true)
    setOpen(false)
  }, [])

  const handleCancel = React.useCallback(() => {
    resolveRef.current?.(false)
    setOpen(false)
  }, [])

  const confirmDialog = (
    <ConfirmDialog
      open={open}
      onOpenChange={(v) => {
        if (!v) handleCancel()
      }}
      {...options}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  )

  return { confirm, confirmDialog }
}

export { ConfirmDialog, useConfirmDialog }