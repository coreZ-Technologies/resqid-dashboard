"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Key, Check, Loader2, Copy, Mail } from "lucide-react"
import { PageBreadcrumb } from "@/components/shared/Breadcrumb"

function generatePassword() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789"
    return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
}

export default function ResetAdminPasswordPage() {
    const router = useRouter()
    const params = useParams()
    const schoolId = params.schoolId
    const adminId = params.adminId

    const [step, setStep] = useState(1)
    const [newPassword, setNewPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [sendEmail, setSendEmail] = useState(true)

    const handleGenerate = () => {
        setNewPassword(generatePassword())
        setStep(2)
    }

    const handleConfirm = async () => {
        setLoading(true)
        await new Promise(r => setTimeout(r, 800))
        console.log("Password reset for:", adminId, "New:", newPassword, "Send email:", sendEmail)
        setLoading(false)
        setStep(3)
    }

    const admin = { name: "Animesh Karan", email: "animesh@springdale.in", avatar: "AK" }

    return (
        <div className="max-w-[500px] mx-auto space-y-6">
            <PageBreadcrumb items={[{ label: "Super Admin", href: "/superadmin" }, { label: "Schools", href: "/superadmin/schools" }, { label: "Admins", href: `/superadmin/schools/${schoolId}/admins` }, { label: "Reset Password" }]} />

            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"><ArrowLeft size={18} /></button>
                <div><h1 className="text-[22px] font-bold text-slate-800">Reset Password</h1><p className="text-[13px] text-slate-500">{admin.name} · {admin.email}</p></div>
            </div>

            {step === 1 && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                    <p className="text-sm text-slate-600">Generate a new password for this admin. A reset email will optionally be sent.</p>
                    <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={sendEmail} onChange={e => setSendEmail(e.target.checked)} className="accent-violet-600" />
                        Send email notification to admin
                    </label>
                    <button onClick={handleGenerate} className="w-full py-2.5 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700">Generate New Password</button>
                </div>
            )}

            {step === 2 && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                        <Key size={18} className="text-amber-600 mt-0.5" />
                        <div><p className="font-semibold text-amber-800">New Password Generated</p><p className="text-xs text-amber-700 mt-0.5">Share this securely with the admin.</p></div>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-3 border border-slate-200">
                        <span className="font-mono text-lg font-bold text-slate-800 flex-1">{newPassword}</span>
                        <button onClick={() => { navigator.clipboard.writeText(newPassword); setCopied(true); setTimeout(() => setCopied(false), 2000) }} className="p-1.5 rounded hover:bg-slate-100">{copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}</button>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => router.back()} className="flex-1 py-2 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50">Cancel</button>
                        <button onClick={handleConfirm} disabled={loading} className="flex-1 py-2 rounded-lg bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700 flex items-center justify-center gap-2">
                            {loading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}Confirm Reset
                        </button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
                    <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto"><Check size={24} className="text-emerald-600" /></div>
                    <h3 className="font-bold text-slate-800">Password Reset!</h3>
                    <p className="text-sm text-slate-500">{sendEmail ? `Reset email sent to ${admin.email}` : "Password has been updated"}</p>
                    <button onClick={() => router.push(`/superadmin/schools/${schoolId}/admins`)} className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-semibold">Back to Admins</button>
                </div>
            )}
        </div>
    )
}