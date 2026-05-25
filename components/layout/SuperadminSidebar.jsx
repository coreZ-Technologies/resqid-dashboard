'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Activity, AlertTriangle, CreditCard, Bell,
  School, Settings, Users, Heart, LogOut, ChevronLeft, ChevronRight,
  Shield, Menu, X, GraduationCap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { name: 'Dashboard',          href: '/superadmin',                         icon: LayoutDashboard },
  { name: 'Activity Logs',      href: '/superadmin/activity-logs',           icon: Activity        },
  { name: 'Alerts',             href: '/superadmin/alerts',                  icon: AlertTriangle   },
  { name: 'Billing',            href: '/superadmin/billing',                 icon: CreditCard      },
  { name: 'Notification Logs',  href: '/superadmin/notification-logs',       icon: Bell            },
  { name: 'Schools',            href: '/superadmin/schools',                 icon: School          },
  { name: 'Students',           href: '/superadmin/students',                icon: Users           },
  { name: 'Teachers',           href: '/superadmin/teachers',                icon: GraduationCap   },
  { name: 'System Health',      href: '/superadmin/system-health',           icon: Heart           },
  {
    name: 'Settings',
    href: '/superadmin/settings',
    icon: Settings,
    subItems: [
      { name: 'Admins', href: '/superadmin/settings/admins' },
      { name: 'Roles',  href: '/superadmin/settings/roles'  },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Extracted to module level — defining a component inside another component
// causes React to see a new type on every render, unmounting + remounting the
// entire subtree and losing state on each collapsed/mobileOpen toggle.
// ─────────────────────────────────────────────────────────────────────────────
function SidebarContent({ collapsed, setCollapsed, pathname, expandedMenus, toggleMenu }) {
  const isActive = (href) => {
    if (href === '/superadmin') return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Logo + Collapse toggle */}
      <div className={cn(
        'h-16 flex items-center px-4 border-b border-slate-200 shrink-0',
        collapsed ? 'justify-center' : 'justify-between',
      )}>
        {collapsed ? (
          <Shield className="w-6 h-6 text-blue-600" />
        ) : (
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-600" />
            <span className="font-bold text-slate-800 text-lg">ResQID</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="hidden lg:flex items-center justify-center w-6 h-6 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const Icon     = item.icon;
          const active   = isActive(item.href);
          const hasSub   = !!item.subItems?.length;
          const isExpanded = expandedMenus[item.name];

          if (hasSub) {
            return (
              <div key={item.name}>
                <button
                  // When collapsed: don't toggle the hidden sub-menu — just show a tooltip.
                  // When expanded: toggle as normal.
                  onClick={collapsed ? undefined : () => toggleMenu(item.name)}
                  title={collapsed ? item.name : undefined}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                    active ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100',
                    collapsed && 'justify-center cursor-default',
                  )}
                >
                  <Icon size={20} className="shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">{item.name}</span>
                      <ChevronRight
                        size={16}
                        className={cn('transition-transform duration-200', isExpanded && 'rotate-90')}
                      />
                    </>
                  )}
                </button>
                {/* Sub-items only visible when sidebar is expanded AND menu is toggled open */}
                {!collapsed && isExpanded && (
                  <div className="ml-9 mt-0.5 space-y-0.5">
                    {item.subItems.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className={cn(
                          'block px-3 py-2 rounded-lg text-sm transition-colors',
                          pathname === sub.href
                            ? 'bg-blue-50 text-blue-700 font-medium'
                            : 'text-slate-500 hover:bg-slate-100',
                        )}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.name : undefined}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                active ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100',
                collapsed && 'justify-center',
              )}
            >
              <Icon size={20} className="shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-slate-200 shrink-0">
        <button
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors',
            collapsed && 'justify-center',
          )}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export default function SuperadminSidebar() {
  const pathname = usePathname();
  const [collapsed,      setCollapsed]      = useState(false);
  const [mobileOpen,     setMobileOpen]     = useState(false);
  const [expandedMenus,  setExpandedMenus]  = useState({});

  const toggleMenu = (name) =>
    setExpandedMenus(prev => ({ ...prev, [name]: !prev[name] }));

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile FAB — open */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed bottom-4 right-4 z-50 lg:hidden bg-blue-600 text-white p-3 rounded-full shadow-lg"
        aria-label="Open navigation"
      >
        <Menu size={24} />
      </button>

      {/* Mobile close button — sits OUTSIDE the aside so it's reachable
          when the aside is off-screen, and always in the DOM when open */}
      {mobileOpen && (
        <button
          onClick={() => setMobileOpen(false)}
          className="fixed top-4 right-4 z-[60] p-2 rounded-lg bg-white text-slate-500 hover:bg-slate-100 shadow lg:hidden"
          aria-label="Close navigation"
        >
          <X size={20} />
        </button>
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-screen bg-white border-r border-slate-200 transition-all duration-300 shadow-sm',
          collapsed ? 'w-20' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        <SidebarContent
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          pathname={pathname}
          expandedMenus={expandedMenus}
          toggleMenu={toggleMenu}
        />
      </aside>
    </>
  );
}