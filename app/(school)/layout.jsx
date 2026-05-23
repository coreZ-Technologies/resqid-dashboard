import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'

const MOCK_USER = {
    name: 'Animesh Karan',
    email: 'admin@springdaleschool.in',
    plan: 'standard',
    schoolName: 'Springdale Public School',
}

export default function SchoolLayout({ children }) {
    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">
            <Sidebar user={MOCK_USER} />
            <div className="flex flex-col flex-1 overflow-hidden">
                <Topbar user={MOCK_USER} />
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}