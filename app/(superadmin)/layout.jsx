// app/(superadmin)/layout.jsx
'use client';

import SuperadminSidebar from '@/components/layout/SuperadminSidebar';

export default function SuperadminLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <SuperadminSidebar />
      <main className="lg:ml-64 transition-all duration-300">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}