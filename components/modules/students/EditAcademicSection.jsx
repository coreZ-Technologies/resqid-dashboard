import { GraduationCap, BookOpen, Plus, Trash2 } from "lucide-react"

const CLASSES = ['Nursery', 'LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
const SECTIONS = ['A', 'B', 'C', 'D']

export default function EditAcademicSection({ formData, setFormData, errors }) {
    const addSubject = () => setFormData(prev => ({ ...prev, academicInfo: { ...prev.academicInfo, subjects: [...prev.academicInfo.subjects, { name: '', code: '', teacher: '' }] } }))
    const removeSubject = (i) => setFormData(prev => ({ ...prev, academicInfo: { ...prev.academicInfo, subjects: prev.academicInfo.subjects.filter((_, idx) => idx !== i) } }))
    const updateSubject = (i, f, v) => setFormData(prev => ({ ...prev, academicInfo: { ...prev.academicInfo, subjects: prev.academicInfo.subjects.map((s, idx) => idx === i ? { ...s, [f]: v } : s) } }))
    const addAchievement = () => setFormData(prev => ({ ...prev, academicInfo: { ...prev.academicInfo, achievements: [...prev.academicInfo.achievements, ''] } }))
    const removeAchievement = (i) => setFormData(prev => ({ ...prev, academicInfo: { ...prev.academicInfo, achievements: prev.academicInfo.achievements.filter((_, idx) => idx !== i) } }))

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2"><GraduationCap size={18} className="text-violet-600" />Academic Information</h2>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Class *</label>
                    <select value={formData.class} onChange={e => setFormData({ ...formData, class: e.target.value })}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 bg-white">
                        <option value="">Select Class</option>
                        {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Section *</label>
                    <select value={formData.section} onChange={e => setFormData({ ...formData, section: e.target.value })}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 bg-white">
                        <option value="">Select Section</option>
                        {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Roll Number</label>
                    <input value={formData.rollNumber} onChange={e => setFormData({ ...formData, rollNumber: e.target.value })}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 transition-all" />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Admission Year</label>
                    <input value={formData.admissionYear} onChange={e => setFormData({ ...formData, admissionYear: e.target.value })}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 transition-all" />
                </div>
            </div>

            {/* Subjects */}
            <div className="border-t border-slate-100 pt-5">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-slate-700 flex items-center gap-2"><BookOpen size={16} />Subjects</h3>
                    <button onClick={addSubject} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 transition-colors"><Plus size={12} />Add</button>
                </div>
                <div className="space-y-2">
                    {formData.academicInfo.subjects.map((s, i) => (
                        <div key={i} className="flex gap-2 items-center p-2 bg-slate-50 rounded-lg">
                            <input value={s.name} onChange={e => updateSubject(i, 'name', e.target.value)} placeholder="Subject" className="flex-1 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-violet-500 bg-white" />
                            <input value={s.code} onChange={e => updateSubject(i, 'code', e.target.value)} placeholder="Code" className="w-20 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-violet-500 bg-white" />
                            <input value={s.teacher} onChange={e => updateSubject(i, 'teacher', e.target.value)} placeholder="Teacher" className="flex-1 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-violet-500 bg-white" />
                            <button onClick={() => removeSubject(i)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={12} /></button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Achievements */}
            <div className="border-t border-slate-100 pt-5">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-slate-700">Achievements</h3>
                    <button onClick={addAchievement} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 transition-colors"><Plus size={12} />Add</button>
                </div>
                <div className="space-y-2">
                    {formData.academicInfo.achievements.map((a, i) => (
                        <div key={i} className="flex gap-2 items-center">
                            <input value={a} onChange={e => setFormData(prev => ({ ...prev, academicInfo: { ...prev.academicInfo, achievements: prev.academicInfo.achievements.map((ach, idx) => idx === i ? e.target.value : ach) } }))}
                                className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500" />
                            <button onClick={() => removeAchievement(i)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={12} /></button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Remarks */}
            <div className="border-t border-slate-100 pt-5">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Remarks</label>
                <textarea value={formData.academicInfo.remarks} onChange={e => setFormData(prev => ({ ...prev, academicInfo: { ...prev.academicInfo, remarks: e.target.value } }))}
                    rows={3} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-500 resize-none" />
            </div>
        </div>
    )
}