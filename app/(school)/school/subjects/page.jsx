"use client"

import { useState, useMemo } from "react"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import PageHeader from "@/components/shared/PageHeader"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import SubjectFilters from "@/components/modules/subjects/SubjectFilters"
import SubjectCard from "@/components/modules/subjects/SubjectCard"
import { EmptyState } from "@/components/shared/EmptyState"
import { useConfirmDialog } from "@/components/shared/ConfirmDialog"
import { MOCK_SUBJECTS } from "@/lib/mock-data"
import { SUBJECT_CATEGORIES } from "@/lib/constants"
import ToolbarActions from "@/components/shared/ToolbarActions"

export default function SubjectsPage() {
    const router = useRouter()
    const [subjects, setSubjects] = useState(MOCK_SUBJECTS)
    const [search, setSearch] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("All")
    const [statusFilter, setStatusFilter] = useState("All")
    const { confirmDialog, confirm } = useConfirmDialog()

    const filtered = useMemo(() => subjects.filter(s => {
        const matchCategory = categoryFilter === "All" || s.category === categoryFilter
        const matchStatus = statusFilter === "All" || s.status === statusFilter
        const matchSearch = !search ||
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.code.toLowerCase().includes(search.toLowerCase()) ||
            (s.mappings || []).some(m => m.teachers.some(t => t.toLowerCase().includes(search.toLowerCase())))
        return matchCategory && matchStatus && matchSearch
    }), [subjects, search, categoryFilter, statusFilter])

    const handleDelete = async (id) => {
        const ok = await confirm({
            variant: "delete",
            title: "Delete subject?",
            description: "This will remove the subject and all class assignments.",
            confirmLabel: "Delete",
        })
        if (ok) setSubjects(prev => prev.filter(s => s.id !== id))
    }

    return (
        <div className="max-w-[1300px] space-y-6">
            {confirmDialog}

            <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "Subjects" }]} />

            <PageHeader title="Subjects" description="Manage subjects, class assignments, and teacher allocations">
                <div className="flex items-center gap-2">
                    <ToolbarActions
                        onRefresh={() => console.log("Refreshing...")}
                        onExport={() => console.log("Exporting...")}
                    />
                    <button
                        onClick={() => router.push("/school/subjects/add")}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-violet-700 text-white text-sm font-semibold shadow-sm shadow-violet-200 hover:from-violet-600 hover:to-violet-800 transition-all"
                    >
                        <Plus size={16} /> Add Subject
                    </button>
                </div>
            </PageHeader>

            <SubjectFilters
                search={search}
                onSearchChange={setSearch}
                categoryFilter={categoryFilter}
                onCategoryChange={setCategoryFilter}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
            />

            <p className="text-sm text-slate-500">
                Showing <span className="font-semibold text-slate-700">{filtered.length}</span> subject{filtered.length !== 1 ? "s" : ""}
            </p>

            {filtered.length === 0 ? (
                <EmptyState
                    preset="search"
                    title="No subjects found"
                    description="Try a different filter or add a new subject"
                    action={{ label: "Add Subject", onClick: () => router.push("/school/subjects/add") }}
                />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filtered.map(subject => (
                        <SubjectCard
                            key={subject.id}
                            subject={subject}
                            onClick={() => router.push(`/school/subjects/${subject.id}`)}
                            onEdit={(s) => router.push(`/school/subjects/edit?id=${s.id}`)}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}