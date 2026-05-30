// app/(superadmin)/layout.jsx
'use client';

import { useState } from 'react';
import SuperadminSidebar from '@/components/layout/SuperadminSidebar';
import { cn } from '@/lib/utils';

export default function SuperadminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <SuperadminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main
        className={cn(
          'min-h-screen transition-[margin] duration-200 ease-in-out',
          collapsed ? 'ml-[60px]' : 'ml-[260px]',
        )}
      >
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}