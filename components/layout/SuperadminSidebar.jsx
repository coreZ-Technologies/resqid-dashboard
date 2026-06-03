'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Activity, AlertTriangle, CreditCard, Bell,
  Building2, Settings, Users, HeartPulse, LogOut, ChevronsLeft,
  Shield, GraduationCap, ScanLine, BarChart2, UserCog, ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

// ═══════════════════════════════════════════════════════════════════════════════
// ICON MAP
// ═══════════════════════════════════════════════════════════════════════════════

const ICON_MAP = {
  LayoutDashboard, Activity, AlertTriangle, CreditCard, Bell,
  Building2, Settings, Users, HeartPulse, LogOut, Shield,
  GraduationCap, ScanLine, BarChart2, UserCog, ChevronRight,
};

// ═══════════════════════════════════════════════════════════════════════════════
// SUPERADMIN SIDEBAR CONFIG — Matches constants.js SUPERADMIN_SIDEBAR
// ═══════════════════════════════════════════════════════════════════════════════

const SUPERADMIN_SIDEBAR = [
  {
    section: 'Main',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        href: '/superadmin',
        icon: 'LayoutDashboard',
        description: 'Platform overview',
      },
    ],
  },
  {
    section: 'Schools',
    items: [
      {
        id: 'schools',
        label: 'All Schools',
        href: '/superadmin/schools',
        icon: 'Building2',
        description: 'Manage onboarded schools',
      },
      {
        id: 'subscriptions',
        label: 'Subscriptions',
        href: '/superadmin/subscriptions',
        icon: 'CreditCard',
        description: 'Plans & billing',
      },
    ],
  },
  {
    section: 'Platform',
    items: [
      {
        id: 'students',
        label: 'All Students',
        href: '/superadmin/students',
        icon: 'Users',
        description: 'Global student registry',
      },
      {
        id: 'scan-logs',
        label: 'Scan Logs',
        href: '/superadmin/scans',
        icon: 'ScanLine',
        description: 'QR scan activity',
      },
      {
        id: 'anomalies',
        label: 'Anomalies',
        href: '/superadmin/anomalies',
        icon: 'AlertTriangle',
        description: 'Security alerts',
      },
    ],
  },
  {
    section: 'System',
    items: [
      {
        id: 'audit-logs',
        label: 'Audit Logs',
        href: '/superadmin/audit-logs',
        icon: 'Activity',
        description: 'Admin action history',
      },
      {
        id: 'health',
        label: 'System Health',
        href: '/superadmin/health',
        icon: 'HeartPulse',
        description: 'Services & uptime',
      },
      {
        id: 'queues',
        label: 'Queue Monitor',
        href: '/superadmin/queues',
        icon: 'BarChart2',
        description: 'BullMQ job status',
      },
    ],
  },
  {
    section: 'Settings',
    items: [
      {
        id: 'admins',
        label: 'Admin Accounts',
        href: '/superadmin/admins',
        icon: 'UserCog',
        description: 'Manage super admins',
      },
      {
        id: 'settings',
        label: 'Platform Settings',
        href: '/superadmin/settings',
        icon: 'Settings',
        description: 'Global configuration',
      },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// TOOLTIP — shown on collapsed icon hover (identical to school sidebar)
// ═══════════════════════════════════════════════════════════════════════════════

function Tooltip({ label, collapsed }) {
  if (!collapsed) return null;
  return (
    <div className={cn(
      'absolute left-[calc(100%+8px)] top-1/2 -translate-y-1/2 z-50',
      'bg-slate-900 text-white text-[11px] font-medium px-2.5 py-1.5 rounded-md',
      'whitespace-nowrap pointer-events-none',
      'opacity-0 group-hover:opacity-100 transition-opacity duration-150',
      'shadow-lg',
    )}>
      {label}
      <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SUPERADMIN SIDEBAR COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function SuperadminSidebar({ user }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  function isActive(href) {
    if (href === '/superadmin') return pathname === '/superadmin';
    return pathname.startsWith(href);
  }

  const initials = (user?.name ?? 'SA').slice(0, 2).toUpperCase();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex flex-col h-screen bg-white border-r border-slate-200 shrink-0',
        'transition-[width] duration-200 ease-in-out overflow-hidden',
        collapsed ? 'w-[60px]' : 'w-[260px]',
      )}
    >

      {/* ── Logo + Collapse ── */}
      <div className="flex items-center border-b border-slate-100 min-h-[56px] px-3 gap-2">
        {!collapsed && (
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
            <Image src="/images/logo.png" alt="RESQID" width={20} height={20} />
          </div>
        )}
        {!collapsed && (
          <div className="flex-1 min-w-0 overflow-hidden">
            <p className="text-slate-900 font-semibold text-[14px] leading-tight whitespace-nowrap">RESQID</p>
            <p className="text-slate-400 text-[9px] tracking-widest uppercase whitespace-nowrap">Super Admin</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(c => !c)}
          className={cn(
            'w-7 h-7 rounded-md border border-slate-200 bg-slate-50',
            'flex items-center justify-center shrink-0',
            'hover:bg-slate-100 transition-colors duration-150',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
            collapsed ? 'mx-auto' : 'ml-auto',
          )}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronsLeft
            size={13}
            className={cn(
              'text-slate-500 transition-transform duration-200',
              collapsed && 'rotate-180',
            )}
          />
        </button>
      </div>

      {/* ── Admin Badge Card ── */}
      <div className={cn(
        'mx-2.5 mt-2.5 mb-1.5 rounded-xl border border-slate-100 bg-slate-50',
        'transition-all duration-200',
        collapsed ? 'p-1.5 flex justify-center' : 'px-3 py-2.5',
      )}>
        {collapsed && (
          <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center">
            <Shield size={14} className="text-red-500" />
          </div>
        )}
        {!collapsed && (
          <>
            <p className="text-[9px] uppercase tracking-widest text-slate-400 mb-0.5 font-medium">Access Level</p>
            <p className="text-slate-800 text-[12.5px] font-semibold truncate leading-tight">coreZ Technologies</p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border bg-red-50 text-red-600 border-red-200">
                <Shield size={8} />
                Super Admin
              </span>
            </div>
          </>
        )}
      </div>

      {/* ── Navigation ── */}
      <nav
        className="flex-1 overflow-y-auto overflow-x-hidden py-1 scrollbar-none"
        style={{ scrollbarWidth: 'none' }}
      >
        {SUPERADMIN_SIDEBAR.map((group, groupIdx) => (
          <div key={group.section}>
            {groupIdx > 0 && (
              <div className="h-px bg-slate-100 mx-2.5 my-1.5" />
            )}

            {!collapsed && (
              <div className="px-3.5 pt-2.5 pb-1">
                <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400">
                  {group.section}
                </p>
              </div>
            )}

            {group.items.map((item) => {
              const Icon = ICON_MAP[item.icon];
              const active = isActive(item.href);

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={cn(
                    'group relative flex items-center gap-2.5 mx-2 rounded-lg',
                    'transition-colors duration-100',
                    collapsed ? 'p-2 justify-center' : 'px-3 py-[7px]',
                    active
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800',
                  )}
                >
                  {Icon && (
                    <Icon
                      size={15}
                      className={cn(
                        'shrink-0 transition-colors duration-100',
                        active
                          ? 'text-indigo-600'
                          : 'text-slate-400 group-hover:text-slate-600',
                      )}
                    />
                  )}

                  {!collapsed && (
                    <>
                      <div className="flex-1 min-w-0">
                        <span className={cn(
                          'text-[12.5px] truncate block leading-tight',
                          active ? 'font-medium text-indigo-700' : 'font-normal text-slate-700',
                        )}>
                          {item.label}
                        </span>
                        <span className="text-[10px] text-slate-400 truncate block group-hover:text-slate-500">
                          {item.description}
                        </span>
                      </div>
                      {active && (
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                      )}
                    </>
                  )}

                  <Tooltip label={item.label} collapsed={collapsed} />
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* ── User + Logout ── */}
      <div className="shrink-0 border-t border-slate-100 p-2">
        <div className={cn(
          'flex items-center gap-2 px-2 py-1.5 rounded-lg',
          'hover:bg-slate-50 transition-colors duration-100 cursor-pointer group',
          collapsed && 'justify-center px-1.5',
        )}>
          <div className="w-7 h-7 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center shrink-0">
            <span className="text-indigo-700 text-[10px] font-bold">{initials}</span>
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-slate-700 text-[12px] font-medium truncate leading-tight">
                  {user?.name ?? 'Super Admin'}
                </p>
                <p className="text-slate-400 text-[10px] truncate">
                  {user?.email ?? ''}
                </p>
              </div>
              <LogOut
                size={13}
                className="text-slate-300 group-hover:text-red-400 transition-colors duration-150 shrink-0"
              />
            </>
          )}
        </div>
      </div>

    </aside>
  );
}