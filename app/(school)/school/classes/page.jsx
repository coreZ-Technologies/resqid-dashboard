"use client"

import { useState, useMemo } from "react"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import PageHeader from "@/components/shared/PageHeader"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"
import ClassFilters from "@/components/modules/classes/ClassFilters"
import ClassCard from "@/components/modules/classes/ClassCard"
import EmptyState from "@/components/shared/EmptyState"
import { ConfirmDialog, useConfirmDialog } from "@/components/shared/ConfirmDialog"
import { MOCK_CLASSES } from "@/lib/mock-data"
import { GRADE_GROUP_MAP } from "@/lib/constants"
import ToolbarActions from "@/components/shared/ToolbarActions"

export default function ClassesPage() {
    const router = useRouter()
    const [classes, setClasses] = useState(MOCK_CLASSES)
    const [search, setSearch] = useState("")
    const [gradeGroup, setGradeGroup] = useState("All")
    const [statusFilter, setStatus] = useState("All")
    const [deleteTarget, setDeleteTarget] = useState(null)

    const { confirmDialog, confirm } = useConfirmDialog()

    const filtered = useMemo(() => classes.filter(c => {
        const group = GRADE_GROUP_MAP[c.grade] || "Primary"
        const matchGroup = gradeGroup === "All" || group === gradeGroup
        const matchStatus = statusFilter === "All" || c.status === statusFilter
        const matchSearch = !search ||
            c.grade.toLowerCase().includes(search.toLowerCase()) ||
            c.section.toLowerCase().includes(search.toLowerCase()) ||
            (c.classTeacher || "").toLowerCase().includes(search.toLowerCase())
        return matchGroup && matchStatus && matchSearch
    }), [classes, search, gradeGroup, statusFilter])

    const handleDeleteRequest = async (id) => {
        const ok = await confirm({
            variant: "delete",
            title: "Delete class?",
            description: "This will permanently remove the class and all associated data. This action cannot be undone.",
            confirmLabel: "Delete",
        })
        if (ok) {
            setClasses(prev => prev.filter(c => c.id !== id))
        }
    }

    return (
        <div className="max-w-[1300px] space-y-6">
            {confirmDialog}

            <PageBreadcrumb
                items={[
                    { label: "Dashboard", href: "/school" },
                    { label: "Classes" },
                ]}
            />

            <PageHeader
                title="Classes"
                description="Manage class groups, teachers and assignments"
            >
                <div className="flex items-center gap-2">
                    <ToolbarActions
                        onRefresh={() => console.log("Refreshing...")}
                        onExport={() => console.log("Exporting...")}
                    />
                    <button
                        onClick={() => router.push("/school/classes/add")}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-violet-700 text-white text-sm font-semibold shadow-sm shadow-violet-200 hover:shadow-md hover:shadow-violet-300 hover:from-violet-600 hover:to-violet-800 transition-all"
                    >
                        <Plus size={16} /> Add Class
                    </button>
                </div>
            </PageHeader>

            <ClassFilters
                search={search}
                onSearchChange={setSearch}
                gradeGroup={gradeGroup}
                onGradeGroupChange={setGradeGroup}
                statusFilter={statusFilter}
                onStatusChange={setStatus}
            />

            <p className="text-sm text-slate-500">
                Showing <span className="font-semibold text-slate-700">{filtered.length}</span> class{filtered.length !== 1 ? "es" : ""}
            </p>

            {filtered.length === 0 ? (
                <EmptyState
                    preset="search"
                    title="No classes found"
                    description="Try a different filter or add a new class"
                    action={{ label: "Add Class", onClick: () => router.push("/school/classes/add") }}
                />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filtered.map(cls => (
                        <ClassCard
                            key={cls.id}
                            cls={cls}
                            onClick={() => router.push(`/school/classes/${cls.id}`)}
                            onEdit={(c) => router.push(`/school/classes/edit?id=${c.id}`)}
                            onDelete={(id) => handleDeleteRequest(id)}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}