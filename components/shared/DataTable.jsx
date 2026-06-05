"use client"

import * as React from "react"
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  X,
  SlidersHorizontal,
  Download,
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

// ── Helpers ───────────────────────────────────────────────────────────────────

function getNestedValue(obj, key) {
  return key.split(".").reduce((acc, k) => acc?.[k], obj)
}

function sortData(data, sortKey, sortDir) {
  if (!sortKey || sortDir === "none") return data
  return [...data].sort((a, b) => {
    const av = getNestedValue(a, sortKey)
    const bv = getNestedValue(b, sortKey)
    if (av == null) return 1
    if (bv == null) return -1
    const cmp =
      typeof av === "number" && typeof bv === "number"
        ? av - bv
        : String(av).localeCompare(String(bv))
    return sortDir === "asc" ? cmp : -cmp
  })
}

function filterData(data, columns, query) {
  if (!query.trim()) return data
  const q = query.toLowerCase()
  return data.filter((row) =>
    columns.some((col) => {
      if (col.enableGlobalFilter === false) return false
      const val = getNestedValue(row, col.accessorKey ?? col.id ?? "")
      return String(val ?? "").toLowerCase().includes(q)
    })
  )
}

// ── Sort icon ─────────────────────────────────────────────────────────────────

const SortIcon = ({ direction }) => {
  if (direction === "asc")
    return <ChevronUp className="ml-1 h-3.5 w-3.5 shrink-0" aria-hidden />
  if (direction === "desc")
    return <ChevronDown className="ml-1 h-3.5 w-3.5 shrink-0" aria-hidden />
  return (
    <ChevronsUpDown className="ml-1 h-3.5 w-3.5 shrink-0 opacity-40" aria-hidden />
  )
}

// ── Loading skeleton ──────────────────────────────────────────────────────────

const TableSkeleton = ({ columns, rows = 6 }) => (
  <>
    {Array.from({ length: rows }).map((_, i) => (
      <TableRow key={i} className="animate-pulse">
        {columns.map((col, j) => (
          <TableCell key={j}>
            <Skeleton className="h-4 w-full rounded" />
          </TableCell>
        ))}
      </TableRow>
    ))}
  </>
)

// ── Empty state ───────────────────────────────────────────────────────────────

const TableEmpty = ({ colSpan, message = "No results found." }) => (
  <TableRow>
    <TableCell
      colSpan={colSpan}
      className="h-40 text-center text-sm text-muted-foreground"
    >
      {message}
    </TableCell>
  </TableRow>
)

// ── DataTable ─────────────────────────────────────────────────────────────────

/**
 * DataTable
 *
 * A fully featured table component built on shadcn/ui Table.
 *
 * Column definition shape:
 *   {
 *     id?:                string          — unique key (required if no accessorKey)
 *     accessorKey?:       string          — dot-path into row data  e.g. "student.name"
 *     header:             string | () => ReactNode
 *     cell?:              ({ value, row }) => ReactNode   — custom cell renderer
 *     enableSorting?:     boolean         (default: true)
 *     enableGlobalFilter?: boolean        (default: true)
 *     hidden?:            boolean         — hide column initially
 *     className?:         string          — applied to every <TableCell> in this col
 *     headerClassName?:   string          — applied to <TableHead>
 *     size?:              number          — column width hint in px
 *   }
 *
 * Props:
 *   data              — array of row objects
 *   columns           — column definitions (see above)
 *   loading?          — show skeleton rows
 *   error?            — error message string
 *   searchable?       — show global search input        (default: true)
 *   searchPlaceholder?
 *   selectable?       — show row checkboxes             (default: false)
 *   onSelectionChange?— (selectedRows) => void
 *   actions?          — ReactNode rendered in the toolbar right slot
 *   exportable?       — show export button              (default: false)
 *   onExport?         — () => void
 *   pageSizeOptions?  — (default: [10, 25, 50, 100])
 *   defaultPageSize?  — (default: 10)
 *   stickyHeader?     — (default: false)
 *   caption?          — <caption> text for a11y
 *   emptyMessage?     — custom empty state message
 *   className?        — wrapper className
 *   rowClassName?     — (row) => string  dynamic row class
 *   onRowClick?       — (row) => void
 */

const DataTable = ({
  data = [],
  columns = [],
  loading = false,
  error,
  searchable = true,
  searchPlaceholder = "Search...",
  selectable = false,
  onSelectionChange,
  actions,
  exportable = false,
  onExport,
  pageSizeOptions = [10, 25, 50, 100],
  defaultPageSize = 10,
  stickyHeader = false,
  caption,
  emptyMessage = "No results found.",
  className,
  rowClassName,
  onRowClick,
}) => {
  // ── State ──────────────────────────────────────────────────────────────────
  const [query, setQuery] = React.useState("")
  const [sortKey, setSortKey] = React.useState(null)
  const [sortDir, setSortDir] = React.useState("none") // "none" | "asc" | "desc"
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(defaultPageSize)
  const [selected, setSelected] = React.useState(new Set())
  const [hiddenCols, setHiddenCols] = React.useState(
    new Set(columns.filter((c) => c.hidden).map((c) => c.id ?? c.accessorKey))
  )

  // ── Visible columns ────────────────────────────────────────────────────────
  const visibleCols = React.useMemo(
    () =>
      columns.filter((c) => !hiddenCols.has(c.id ?? c.accessorKey)),
    [columns, hiddenCols]
  )

  // ── Pipeline: filter → sort → paginate ────────────────────────────────────
  const filtered = React.useMemo(
    () => filterData(data, columns, query),
    [data, columns, query]
  )

  const sorted = React.useMemo(
    () => sortData(filtered, sortKey, sortDir),
    [filtered, sortKey, sortDir]
  )

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))

  const paginated = React.useMemo(() => {
    const start = (page - 1) * pageSize
    return sorted.slice(start, start + pageSize)
  }, [sorted, page, pageSize])

  // Reset to page 1 on filter/sort change
  React.useEffect(() => { setPage(1) }, [query, sortKey, sortDir, pageSize])

  // ── Selection ──────────────────────────────────────────────────────────────
  const allPageSelected =
    paginated.length > 0 && paginated.every((r) => selected.has(r))
  const somePageSelected = paginated.some((r) => selected.has(r))

  const toggleAll = () => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (allPageSelected) paginated.forEach((r) => next.delete(r))
      else paginated.forEach((r) => next.add(r))
      onSelectionChange?.([...next])
      return next
    })
  }

  const toggleRow = (row) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(row) ? next.delete(row) : next.add(row)
      onSelectionChange?.([...next])
      return next
    })
  }

  // ── Sort handler ───────────────────────────────────────────────────────────
  const handleSort = (col) => {
    if (col.enableSorting === false) return
    const key = col.accessorKey ?? col.id
    if (sortKey !== key) {
      setSortKey(key)
      setSortDir("asc")
    } else {
      setSortDir((d) => (d === "asc" ? "desc" : d === "desc" ? "none" : "asc"))
      if (sortDir === "desc") setSortKey(null)
    }
  }

  // ── Column visibility toggle ───────────────────────────────────────────────
  const toggleCol = (colKey) => {
    setHiddenCols((prev) => {
      const next = new Set(prev)
      next.has(colKey) ? next.delete(colKey) : next.add(colKey)
      return next
    })
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  const colCount = visibleCols.length + (selectable ? 1 : 0)

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-1 items-center gap-2">
          {searchable && (
            <div className="relative w-full max-w-xs">
              <Search
                className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="pl-8 pr-8 h-9 text-sm"
                aria-label="Search table"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Selection count badge */}
          {selectable && selected.size > 0 && (
            <Badge variant="secondary" className="animate-in fade-in-0 duration-150">
              {selected.size} selected
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Custom actions slot */}
          {actions}

          {/* Export */}
          {exportable && (
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-1.5 text-sm"
              onClick={onExport}
            >
              <Download className="h-4 w-4" aria-hidden />
              Export
            </Button>
          )}

          {/* Column visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-1.5 text-sm">
                <SlidersHorizontal className="h-4 w-4" aria-hidden />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel className="text-xs">
                Toggle columns
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {columns.map((col) => {
                const key = col.id ?? col.accessorKey
                const label =
                  typeof col.header === "string" ? col.header : key
                return (
                  <DropdownMenuCheckboxItem
                    key={key}
                    checked={!hiddenCols.has(key)}
                    onCheckedChange={() => toggleCol(key)}
                    className="text-sm capitalize"
                  >
                    {label}
                  </DropdownMenuCheckboxItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* ── Error state ── */}
      {error && (
        <div className="rounded-md border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* ── Table ── */}
      <div
        className={cn(
          "rounded-lg border border-border overflow-hidden",
          "animate-in fade-in-0 duration-200"
        )}
      >
        <div className="overflow-x-auto">
          <Table>
            {caption && (
              <caption className="sr-only">{caption}</caption>
            )}

            <TableHeader
              className={cn(
                stickyHeader && "sticky top-0 z-10 bg-background"
              )}
            >
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                {/* Checkbox column */}
                {selectable && (
                  <TableHead className="w-10 px-3">
                    <input
                      type="checkbox"
                      checked={allPageSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = somePageSelected && !allPageSelected
                      }}
                      onChange={toggleAll}
                      className="h-4 w-4 rounded border-border accent-primary cursor-pointer"
                      aria-label="Select all rows on this page"
                    />
                  </TableHead>
                )}

                {visibleCols.map((col) => {
                  const key = col.accessorKey ?? col.id
                  const isSorted = sortKey === key
                  const canSort = col.enableSorting !== false

                  return (
                    <TableHead
                      key={key}
                      className={cn(
                        "text-xs font-medium uppercase tracking-wide text-muted-foreground whitespace-nowrap",
                        canSort && "cursor-pointer select-none hover:text-foreground transition-colors",
                        col.headerClassName
                      )}
                      style={col.size ? { width: col.size } : undefined}
                      onClick={() => canSort && handleSort(col)}
                      aria-sort={
                        !isSorted ? undefined
                        : sortDir === "asc" ? "ascending"
                        : sortDir === "desc" ? "descending"
                        : undefined
                      }
                    >
                      <span className="inline-flex items-center">
                        {typeof col.header === "function"
                          ? col.header()
                          : col.header}
                        {canSort && (
                          <SortIcon direction={isSorted ? sortDir : "none"} />
                        )}
                      </span>
                    </TableHead>
                  )
                })}
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableSkeleton columns={visibleCols} rows={pageSize > 10 ? 10 : pageSize} />
              ) : paginated.length === 0 ? (
                <TableEmpty colSpan={colCount} message={emptyMessage} />
              ) : (
                paginated.map((row, rowIdx) => (
                  <TableRow
                    key={rowIdx}
                    className={cn(
                      "transition-colors duration-100",
                      onRowClick && "cursor-pointer",
                      selected.has(row) && "bg-primary/5",
                      typeof rowClassName === "function"
                        ? rowClassName(row)
                        : rowClassName,
                      "animate-in fade-in-0 duration-150"
                    )}
                    style={{ animationDelay: `${rowIdx * 20}ms` }}
                    onClick={() => onRowClick?.(row)}
                  >
                    {/* Checkbox cell */}
                    {selectable && (
                      <TableCell
                        className="w-10 px-3"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleRow(row)
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selected.has(row)}
                          onChange={() => toggleRow(row)}
                          className="h-4 w-4 rounded border-border accent-primary cursor-pointer"
                          aria-label={`Select row ${rowIdx + 1}`}
                        />
                      </TableCell>
                    )}

                    {visibleCols.map((col) => {
                      const key = col.accessorKey ?? col.id
                      const value = getNestedValue(row, key ?? "")

                      return (
                        <TableCell
                          key={key}
                          className={cn(
                            "text-sm py-3",
                            col.className
                          )}
                        >
                          {col.cell
                            ? col.cell({ value, row })
                            : value == null
                            ? <span className="text-muted-foreground">—</span>
                            : String(value)}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* ── Pagination ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
        {/* Results summary */}
        <p className="shrink-0">
          {loading ? (
            <Skeleton className="h-4 w-32" />
          ) : (
            <>
              Showing{" "}
              <span className="font-medium text-foreground">
                {sorted.length === 0
                  ? 0
                  : (page - 1) * pageSize + 1}
              </span>
              {" – "}
              <span className="font-medium text-foreground">
                {Math.min(page * pageSize, sorted.length)}
              </span>{" "}
              of{" "}
              <span className="font-medium text-foreground">{sorted.length}</span>{" "}
              {sorted.length !== data.length && (
                <span className="text-xs">(filtered from {data.length})</span>
              )}
            </>
          )}
        </p>

        <div className="flex items-center gap-3">
          {/* Page size selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs whitespace-nowrap">Rows per page</span>
            <Select
              value={String(pageSize)}
              onValueChange={(v) => setPageSize(Number(v))}
            >
              <SelectTrigger className="h-8 w-16 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((s) => (
                  <SelectItem key={s} value={String(s)} className="text-xs">
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Page nav */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage(1)}
              disabled={page === 1 || loading}
              aria-label="First page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <span className="min-w-[5rem] text-center text-xs">
              Page {page} of {totalPages}
            </span>

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || loading}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages || loading}
              aria-label="Last page"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export { DataTable }