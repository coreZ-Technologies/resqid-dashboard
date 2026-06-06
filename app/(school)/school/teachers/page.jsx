"use client"

import { useState, useMemo } from "react"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import PageHeader from "@/components/shared/PageHeader"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import TeacherFilters from "@/components/modules/teachers/TeacherFilters"
import TeacherCard from "@/components/modules/teachers/TeacherCard"
import { EmptyState } from "@/components/shared/EmptyState"
import { useConfirmDialog } from "@/components/shared/ConfirmDialog"
import { MOCK_TEACHERS } from "@/lib/mock-data"
import ToolbarActions from "@/components/shared/ToolbarActions"

export default function TeachersPage() {
  const router = useRouter()
  const [teachers, setTeachers] = useState(MOCK_TEACHERS)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [subjectFilter, setSubjectFilter] = useState("All")
  const { confirmDialog, confirm } = useConfirmDialog()

  const allSubjects = useMemo(() => [...new Set(teachers.flatMap(t => t.subjects))].sort(), [teachers])

  const filtered = useMemo(() => teachers.filter(t => {
    const matchStatus = statusFilter === "All" ||
      (statusFilter === "On Leave" && ["medical", "maternity", "sabbatical", "personal"].includes(t.status)) ||
      t.status === statusFilter.toLowerCase().replace(" ", "_")
    const matchSubject = subjectFilter === "All" || t.subjects.includes(subjectFilter)
    const matchSearch = !search ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.employeeId.toLowerCase().includes(search.toLowerCase()) ||
      t.subjects.some(s => s.toLowerCase().includes(search.toLowerCase()))
    return matchStatus && matchSubject && matchSearch
  }), [teachers, search, statusFilter, subjectFilter])

  const handleDelete = async (id) => {
    const ok = await confirm({
      variant: "delete",
      title: "Delete teacher?",
      description: "This will permanently remove this teacher and all associated records.",
      confirmLabel: "Delete",
    })
    if (ok) setTeachers(prev => prev.filter(t => t.id !== id))
  }

  const needsReplacementCount = teachers.filter(t => t.wellness?.requiresReplacement && !t.replacement).length

  return (
    <div className="max-w-[1300px] space-y-6">
      {confirmDialog}

      <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "Teachers" }]} />

      <PageHeader title="Teachers" description="Manage teachers, wellness, substitutions, and schedules"
        badge={needsReplacementCount > 0 ? `${needsReplacementCount} need replacement` : null}>
        <div className="flex items-center gap-2">
          <ToolbarActions onRefresh={() => console.log("Refreshing...")} onExport={() => console.log("Exporting...")} />
          <button onClick={() => router.push("/school/teachers/add")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-violet-700 text-white text-sm font-semibold shadow-sm shadow-violet-200 hover:from-violet-600 hover:to-violet-800 transition-all">
            <Plus size={16} /> Add Teacher
          </button>
        </div>
      </PageHeader>

      <TeacherFilters search={search} onSearchChange={setSearch} statusFilter={statusFilter} onStatusChange={setStatusFilter}
        subjectFilter={subjectFilter} onSubjectChange={setSubjectFilter} allSubjects={allSubjects} />

      <p className="text-sm text-slate-500">Showing <span className="font-semibold text-slate-700">{filtered.length}</span> teacher{filtered.length !== 1 ? "s" : ""}</p>

      {filtered.length === 0 ? (
        <EmptyState preset="search" title="No teachers found" description="Try a different filter or add a new teacher"
          action={{ label: "Add Teacher", onClick: () => router.push("/school/teachers/add") }} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(teacher => (
            <TeacherCard key={teacher.id} teacher={teacher}
              onClick={() => router.push(`/school/teachers/${teacher.id}`)}
              onEdit={(t) => router.push(`/school/teachers/edit?id=${t.id}`)}
              onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}