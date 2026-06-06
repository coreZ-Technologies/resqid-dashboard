import { FileText, Plus } from "lucide-react"

export default function DocumentsCard({ documents = [] }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2"><FileText size={18} className="text-violet-600" />Documents</h3>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 transition-colors"><Plus size={12} />Upload</button>
            </div>
            <div className="space-y-2">
                {documents.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <FileText size={20} className="text-slate-400" />
                            <div>
                                <p className="text-sm font-medium text-slate-700">{doc.name}</p>
                                <p className="text-xs text-slate-400">{doc.type} • {doc.size} • {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <button className="text-xs text-violet-600 hover:text-violet-700 font-medium">Download</button>
                    </div>
                ))}
            </div>
        </div>
    )
}