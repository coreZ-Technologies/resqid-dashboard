"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Download, FileText, FileSpreadsheet, Check, Copy } from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"

const CSV_TEMPLATES = [
    {
        title: "Student Import Template",
        description: "Use this template to bulk import students with parent and emergency contact details.",
        headers: ["firstName", "lastName", "gender", "dateOfBirth", "class", "section", "rollNumber", "parent1Name", "parent1Phone", "parent1Email"],
        sample: "Aarav,Sharma,MALE,2010-05-15,10,A,24,Rajesh Sharma,9876543210,rajesh@email.com",
        filename: "student_import_template.csv",
    },
    {
        title: "Teacher Import Template",
        description: "Bulk import teachers with subjects, qualifications, and contact details.",
        headers: ["name", "email", "phone", "subjects", "qualification", "experience", "joiningDate", "employeeId"],
        sample: '"Mrs. Meena Pillai",meena.p@school.in,9876543210,"Mathematics,Physics","M.Sc, B.Ed",8 years,2016-06-15,EMP-2016-042',
        filename: "teacher_import_template.csv",
    },
    {
        title: "Subject Import Template",
        description: "Import subjects and assign them to classes with teachers.",
        headers: ["subjectName", "code", "category", "grade", "section", "teachers", "periodsPerWeek"],
        sample: 'Mathematics,MATH101,Core,Cls 6,A,"Mr. Suresh, Ms. Priya",5',
        filename: "subject_import_template.csv",
    },
    {
        title: "Timetable Import Template",
        description: "Upload an existing timetable for validation. System checks for conflicts.",
        headers: ["day", "period", "grade", "section", "subject", "teacher", "room"],
        sample: "Mon,1,Cls 6,A,Mathematics,Mrs. Meena Pillai,R-30",
        filename: "timetable_import_template.csv",
    },
]

function CodeBlock({ code }) {
    const [copied, setCopied] = useState(false)
    const handleCopy = () => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000) }

    return (
        <div className="relative">
            <pre className="bg-slate-800 text-slate-100 p-4 rounded-lg overflow-x-auto text-xs font-mono"><code>{code}</code></pre>
            <button onClick={handleCopy} className="absolute top-2 right-2 p-1.5 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors">
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} className="text-slate-400" />}
            </button>
        </div>
    )
}

export default function CSVGuidePage() {
    const router = useRouter()

    const handleDownload = (filename, headers, sample) => {
        const content = `${headers.join(",")}\n${sample}`
        const blob = new Blob([content], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a"); a.href = url; a.download = filename; a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <div className="max-w-[900px] mx-auto space-y-6">
            <PageBreadcrumb items={[{ label: "Dashboard", href: "/school" }, { label: "Help", href: "/school/help" }, { label: "CSV Templates" }]} />

            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"><ArrowLeft size={18} /></button>
                <div>
                    <h1 className="text-[22px] font-bold text-slate-800">CSV Templates & Format Guide</h1>
                    <p className="text-[13px] text-slate-500">Download demo files and learn the correct format for bulk imports</p>
                </div>
            </div>

            {/* Format Rules */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <h2 className="font-semibold text-slate-800 mb-3 flex items-center gap-2"><FileText size={18} className="text-violet-600" />CSV Format Rules</h2>
                <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-start gap-2"><Check size={14} className="text-emerald-500 mt-0.5 shrink-0" />First row must contain column headers exactly as shown</li>
                    <li className="flex items-start gap-2"><Check size={14} className="text-emerald-500 mt-0.5 shrink-0" />Values containing commas must be wrapped in double quotes: <code className="bg-slate-100 px-1 rounded text-xs">"Math, Physics"</code></li>
                    <li className="flex items-start gap-2"><Check size={14} className="text-emerald-500 mt-0.5 shrink-0" />Dates must be in YYYY-MM-DD format</li>
                    <li className="flex items-start gap-2"><Check size={14} className="text-emerald-500 mt-0.5 shrink-0" />Gender must be: MALE, FEMALE, or OTHER</li>
                    <li className="flex items-start gap-2"><Check size={14} className="text-emerald-500 mt-0.5 shrink-0" />Maximum 5,000 rows per file</li>
                </ul>
            </div>

            {/* Templates */}
            <div className="space-y-4">
                {CSV_TEMPLATES.map(tmpl => (
                    <div key={tmpl.title} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <h3 className="font-semibold text-slate-800">{tmpl.title}</h3>
                                <p className="text-xs text-slate-500 mt-0.5">{tmpl.description}</p>
                            </div>
                            <button onClick={() => handleDownload(tmpl.filename, tmpl.headers, tmpl.sample)}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors">
                                <Download size={14} /> Download Demo
                            </button>
                        </div>
                        <div className="text-xs text-slate-400 mb-2">Column headers:</div>
                        <CodeBlock code={tmpl.headers.join(", ")} />
                        <div className="text-xs text-slate-400 mt-3 mb-2">Sample row:</div>
                        <CodeBlock code={tmpl.sample} />
                    </div>
                ))}
            </div>
        </div>
    )
}