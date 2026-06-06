import { User, Camera, Upload } from "lucide-react"
import { cn } from "@/lib/utils"

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']
const GENDERS = ['MALE', 'FEMALE', 'OTHER']
const STUDENT_STATUSES = ['Active', 'Inactive', 'Graduated', 'Transferred']

export default function EditPersonalSection({ formData, setFormData, errors }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="font-semibold text-slate-800 mb-6 flex items-center gap-2"><User size={18} className="text-violet-600" />Personal Information</h2>

            <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Student Photo</label>
                <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center">
                        <Camera size={24} className="text-slate-400" />
                    </div>
                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 cursor-pointer">
                        <Upload size={14} />Change Photo
                    </label>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Field label="First Name *" value={formData.firstName} onChange={v => setFormData({ ...formData, firstName: v })} error={errors.firstName} />
                <Field label="Last Name *" value={formData.lastName} onChange={v => setFormData({ ...formData, lastName: v })} error={errors.lastName} />
                <Field label="Gender" type="select" value={formData.gender} onChange={v => setFormData({ ...formData, gender: v })} options={GENDERS.map(g => ({ v: g, l: g }))} />
                <Field label="Date of Birth" type="date" value={formData.dateOfBirth} onChange={v => setFormData({ ...formData, dateOfBirth: v })} />
                <Field label="Blood Group" type="select" value={formData.bloodGroup} onChange={v => setFormData({ ...formData, bloodGroup: v })} options={[{ v: '', l: 'Select' }, ...BLOOD_GROUPS.map(b => ({ v: b, l: b }))]} />
                <Field label="Status" type="select" value={formData.status} onChange={v => setFormData({ ...formData, status: v })} options={STUDENT_STATUSES.map(s => ({ v: s, l: s }))} />
            </div>
        </div>
    )
}

function Field({ label, type = 'text', value, onChange, placeholder, error, options }) {
    return (
        <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
            {type === 'select' ? (
                <select value={value} onChange={e => onChange(e.target.value)}
                    className={cn("w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all bg-white", error ? "border-red-400" : "border-slate-200")}>
                    {options.map(o => <option key={o.v ?? o} value={o.v ?? o}>{o.l ?? o}</option>)}
                </select>
            ) : (
                <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
                    className={cn("w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all", error ? "border-red-400" : "border-slate-200")} />
            )}
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    )
}