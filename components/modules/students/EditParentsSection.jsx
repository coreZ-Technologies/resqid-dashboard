import { Users, Plus, Trash2 } from "lucide-react"

const RELATIONSHIPS = ['Father', 'Mother', 'Guardian', 'Other']

export default function EditParentsSection({ parents, onChange }) {
    const add = () => onChange([...parents, { id: `new-${Date.now()}`, name: '', relationship: 'Guardian', phone: '', email: '', occupation: '', isPrimary: false }])
    const remove = (i) => onChange(parents.filter((_, idx) => idx !== i))
    const update = (i, f, v) => onChange(parents.map((p, idx) => idx === i ? { ...p, [f]: v } : p))

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-slate-800 flex items-center gap-2"><Users size={18} className="text-violet-600" />Parents & Guardians</h2>
                <button onClick={add} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 transition-colors"><Plus size={12} />Add Parent</button>
            </div>
            <div className="space-y-4">
                {parents.map((p, i) => (
                    <div key={p.id || i} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-medium text-slate-700">Parent #{i + 1}</h3>
                            <button onClick={() => remove(i)} className="p-1 text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Name</label>
                                <input value={p.name} onChange={e => update(i, 'name', e.target.value)} className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-violet-500 bg-white" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Relationship</label>
                                <select value={p.relationship} onChange={e => update(i, 'relationship', e.target.value)} className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-violet-500 bg-white">
                                    {RELATIONSHIPS.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Phone</label>
                                <input value={p.phone} onChange={e => update(i, 'phone', e.target.value)} className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-violet-500 bg-white" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Email</label>
                                <input value={p.email} onChange={e => update(i, 'email', e.target.value)} className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-violet-500 bg-white" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}