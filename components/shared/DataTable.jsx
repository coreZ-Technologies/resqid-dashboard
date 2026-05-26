'use client'

import { useState } from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'

export default function DataTable({ columns = [], data = [], onRowClick }) {
  const [sortKey, setSortKey] = useState(null)
  const [sortDir, setSortDir] = useState('asc')

  const handleSort = (key) => {
    if (!key) return
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const sorted = [...data].sort((a, b) => {
    if (!sortKey) return 0
    const av = a[sortKey] ?? ''
    const bv = b[sortKey] ?? ''
    return sortDir === 'asc'
      ? String(av).localeCompare(String(bv))
      : String(bv).localeCompare(String(av))
  })

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => col.sortable && handleSort(col.key)}
                className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide select-none ${col.sortable ? 'cursor-pointer hover:text-gray-700' : ''}`}
              >
                <span className="flex items-center gap-1">
                  {col.label}
                  {col.sortable && (
                    sortKey === col.key
                      ? sortDir === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />
                      : <ChevronsUpDown size={13} className="text-gray-300" />
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center text-gray-400 text-sm">
                No data found
              </td>
            </tr>
          ) : (
            sorted.map((row, i) => (
              <tr
                key={row.id ?? i}
                onClick={() => onRowClick?.(row)}
                className={`border-b border-gray-50 transition-colors ${onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}`}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3.5 text-gray-700">
                    {col.render ? col.render(row[col.key], row) : row[col.key] ?? '—'}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}