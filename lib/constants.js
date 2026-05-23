// Plan definitions
export const PLANS = {
  basic:        { id: 'basic',        name: 'Basic',        modules: ['attendance'] },
  standard:     { id: 'standard',     name: 'Standard',     modules: ['attendance', 'timetable'] },
  professional: { id: 'professional', name: 'Professional', modules: ['attendance', 'timetable', 'emergency'] },
  enterprise:   { id: 'enterprise',   name: 'Enterprise',   modules: ['attendance', 'timetable', 'emergency', 'communication'] },
}

// School Admin sidebar
export const SCHOOL_SIDEBAR = [
  {
    section: 'Main',
    items: [
      { id: 'dashboard',      label: 'Dashboard',           icon: 'LayoutDashboard', href: '/school' },
    ]
  },
  {
    section: 'People',
    items: [
      { id: 'students',       label: 'Students',            icon: 'Users',           href: '/school/students' },
      { id: 'teachers',       label: 'Teachers',            icon: 'UserCheck',       href: '/school/teachers' },
      { id: 'parents',        label: 'Parents',             icon: 'UsersRound',      href: '/school/parents' },
    ]
  },
  {
    section: 'Modules',
    items: [
      { id: 'attendance',     label: 'Attendance',          icon: 'CalendarCheck',   href: '/school/attendance',    module: 'attendance',    plan: 'Basic' },
      { id: 'timetable',      label: 'Timetable',           icon: 'Clock',           href: '/school/timetable',     module: 'timetable',     plan: 'Standard' },
      { id: 'emergency',      label: 'Emergency',           icon: 'AlertTriangle',   href: '/school/emergency',     module: 'emergency',     plan: 'Professional' },
      { id: 'communication',  label: 'Parent Comm.',        icon: 'MessageCircle',   href: '/school/communication', module: 'communication', plan: 'Enterprise' },
    ]
  },
  {
    section: 'Reports',
    items: [
      { id: 'reports',        label: 'Reports & Analytics', icon: 'BarChart2',       href: '/school/reports' },
    ]
  },
  {
    section: 'System',
    items: [
      { id: 'notifications',  label: 'Notifications',       icon: 'Bell',            href: '/school/notifications' },
      { id: 'activity-log',   label: 'Activity Log',        icon: 'Activity',        href: '/school/activity-log' },
    ]
  },
  {
    section: 'Settings',
    items: [
      { id: 'school-profile', label: 'School Profile',      icon: 'Building2',       href: '/school/settings/school-profile' },
      { id: 'staff',          label: 'Staff Management',    icon: 'Users2',          href: '/school/settings/staff' },
      { id: 'billing',        label: 'Billing & Plan',      icon: 'CreditCard',      href: '/school/settings/billing' },
    ]
  },
  {
    section: 'Support',
    items: [
      { id: 'help',           label: 'Help & Docs',         icon: 'HelpCircle',      href: '/school/help' },
    ]
  },
]

// Super Admin sidebar
export const SUPERADMIN_SIDEBAR = [
  {
    section: 'Main',
    items: [
      { id: 'dashboard',        label: 'Dashboard',           icon: 'LayoutDashboard', href: '/superadmin' },
    ]
  },
  {
    section: 'Schools',
    items: [
      { id: 'schools',          label: 'All Schools',         icon: 'Building2',       href: '/superadmin/schools' },
      { id: 'add-school',       label: 'Add New School',      icon: 'PlusCircle',      href: '/superadmin/schools/add' },
      { id: 'billing',          label: 'Plan & Billing',      icon: 'CreditCard',      href: '/superadmin/billing' },
    ]
  },
  {
    section: 'Platform',
    items: [
      { id: 'all-students',     label: 'All Students',        icon: 'Users',           href: '/superadmin/students' },
      { id: 'all-teachers',     label: 'All Teachers',        icon: 'UserCheck',       href: '/superadmin/teachers' },
      { id: 'alerts',           label: 'Emergency Alerts',    icon: 'AlertTriangle',   href: '/superadmin/alerts' },
    ]
  },
  {
    section: 'System',
    items: [
      { id: 'notification-logs',label: 'Notification Logs',   icon: 'Bell',            href: '/superadmin/notification-logs' },
      { id: 'activity-logs',    label: 'Activity Logs',       icon: 'Activity',        href: '/superadmin/activity-logs' },
      { id: 'system-health',    label: 'System Health',       icon: 'HeartPulse',      href: '/superadmin/system-health' },
    ]
  },
  {
    section: 'Settings',
    items: [
      { id: 'platform-settings',label: 'Platform Settings',   icon: 'Settings',        href: '/superadmin/settings' },
      { id: 'admins',           label: 'Admin Accounts',      icon: 'UserCog',         href: '/superadmin/settings/admins' },
      { id: 'roles',            label: 'Roles & Permissions', icon: 'ShieldCheck',     href: '/superadmin/settings/roles' },
    ]
  },
]

// Module → plan requirement map (for middleware)
export const MODULE_PLAN_MAP = {
  '/school/attendance':    ['basic', 'standard', 'professional', 'enterprise'],
  '/school/timetable':     ['standard', 'professional', 'enterprise'],
  '/school/emergency':     ['professional', 'enterprise'],
  '/school/communication': ['enterprise'],
}
