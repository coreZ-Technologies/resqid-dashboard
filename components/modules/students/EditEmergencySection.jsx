import { AlertCircle, Shield, Plus, Trash2 } from "lucide-react"

export default function EditEmergencySection({ contacts, onChange, visibility, onVisibilityChange }) {
    const add = () => onChange([...contacts, { id: `new-${Date.now()}`, name: '', relationship: '', phone: '', priority: contacts.length + 1 }])
    const remove = (i) => onChange(contacts.filter((_, idx) => idx !== i))
    const update = (i, f, v) => onChange(contacts.map((c, idx) => idx === i ? { ...c, [f]: v } : c))

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-slate-800 flex items-center gap-2"><AlertCircle size={18} className="text-rose-600" />Emergency Contacts</h2>
                    <button onClick={add} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 transition-colors"><Plus size={12} />Add Contact</button>
                </div>
                <div className="space-y-3">
                    {contacts.map((c, i) => (
                        <div key={c.id || i} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-medium text-slate-700">Contact #{i + 1}</h3>
                                <button onClick={() => remove(i)} className="p-1 text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1">Name</label>
                                    <input value={c.name} onChange={e => update(i, 'name', e.target.value)} className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-violet-500 bg-white" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1">Relationship</label>
                                    <input value={c.relationship} onChange={e => update(i, 'relationship', e.target.value)} className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-violet-500 bg-white" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1">Phone</label>
                                    <input value={c.phone} onChange={e => update(i, 'phone', e.target.value)} className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-violet-500 bg-white" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1">Priority</label>
                                    <input type="number" value={c.priority} onChange={e => update(i, 'priority', parseInt(e.target.value))} className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-violet-500 bg-white" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2"><Shield size={16} className="text-rose-600" />QR Profile Visibility</h3>
                <select value={visibility} onChange={e => onVisibilityChange(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 bg-white">
                    <option value="PUBLIC">Full Visibility</option>
                    <option value="MINIMAL">Minimal Profile</option>
                    <option value="HIDDEN">Hidden</option>
                </select>
            </div>
        </div>
    )
}