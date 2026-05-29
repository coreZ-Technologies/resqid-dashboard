// =============================================================================
// lib/constants.js — RESQID
// Sidebar configs + plan definitions. Matches backend exactly.
// =============================================================================

// ═══════════════════════════════════════════════════════════════════════════════
// PLAN DEFINITIONS — Must match backend PLAN_IDS + PLAN_MODULES
// ═══════════════════════════════════════════════════════════════════════════════

export const PLANS = {
  module_emergency: {
    id: "module_emergency",
    name: "Emergency ID",
    modules: ["emergency"],
  },
  module_attendance: {
    id: "module_attendance",
    name: "Smart Attendance",
    modules: ["attendance"],
  },
  module_timetable: {
    id: "module_timetable",
    name: "Timetable",
    modules: ["timetable"],
  },
  module_parent_communication: {
    id: "module_parent_communication",
    name: "Parent Communication",
    modules: ["parent_communication"],
  },
  bundle_safety: {
    id: "bundle_safety",
    name: "Safety Bundle",
    modules: ["emergency", "attendance"],
  },
  bundle_ops: {
    id: "bundle_ops",
    name: "Operations Bundle",
    modules: ["attendance", "timetable"],
  },
  bundle_connect: {
    id: "bundle_connect",
    name: "Connect Bundle",
    modules: ["attendance", "parent_communication"],
  },
  resqid_complete: {
    id: "resqid_complete",
    name: "RESQID Complete",
    modules: ["emergency", "attendance", "timetable", "parent_communication"],
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// SCHOOL ADMIN SIDEBAR — Module-gated sections
// ═══════════════════════════════════════════════════════════════════════════════

export const SCHOOL_SIDEBAR = [
  {
    section: "Home",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: "LayoutDashboard",
        href: "/school",
      },
    ],
  },
  {
    section: "Emergency ID",
    module: "emergency",
    items: [
      {
        id: "students",
        label: "Students",
        icon: "Users",
        href: "/school/students",
      },
      {
        id: "qr-cards",
        label: "QR Cards",
        icon: "QrCode",
        href: "/school/cards",
      },
      {
        id: "scan-logs",
        label: "Scan Logs",
        icon: "ScanLine",
        href: "/school/scans",
      },
      {
        id: "anomalies",
        label: "Anomalies",
        icon: "Shield",
        href: "/school/anomalies",
      },
    ],
  },
  {
    section: "Smart Attendance",
    module: "attendance",
    items: [
      {
        id: "attendance",
        label: "Attendance",
        icon: "CalendarCheck",
        href: "/school/attendance",
      },
      {
        id: "sessions",
        label: "Sessions",
        icon: "Clock",
        href: "/school/attendance/sessions",
      },
      {
        id: "reports",
        label: "Reports",
        icon: "BarChart2",
        href: "/school/attendance/reports",
      },
      {
        id: "rfid-devices",
        label: "RFID Devices",
        icon: "Radio",
        href: "/school/attendance/devices",
      },
    ],
  },
  {
    section: "Timetable",
    module: "timetable",
    items: [
      {
        id: "timetable",
        label: "Timetable",
        icon: "BookMarked",
        href: "/school/timetable",
      },
      {
        id: "substitutions",
        label: "Substitutions",
        icon: "UsersRound",
        href: "/school/timetable/substitutions",
      },
      {
        id: "teachers",
        label: "Teachers",
        icon: "UserCheck",
        href: "/school/teachers",
      },
      {
        id: "subjects",
        label: "Subjects",
        icon: "BookOpen",
        href: "/school/subjects",
      },
      {
        id: "classes",
        label: "Classes",
        icon: "Users",
        href: "/school/classes",
      },
    ],
  },
  {
    section: "Parent Communication",
    module: "parent_communication",
    items: [
      {
        id: "announcements",
        label: "Announcements",
        icon: "Megaphone",
        href: "/school/communication/announcements",
      },
      {
        id: "messages",
        label: "Messages",
        icon: "Mail",
        href: "/school/communication/messages",
      },
    ],
  },
  {
    section: "Settings",
    items: [
      {
        id: "school-profile",
        label: "School Profile",
        icon: "Building2",
        href: "/school/settings",
      },
      {
        id: "manage-users",
        label: "Manage Users",
        icon: "Users2",
        href: "/school/users",
      },
      {
        id: "subscription",
        label: "Subscription",
        icon: "CreditCard",
        href: "/school/subscription",
      },
      {
        id: "help",
        label: "Help & Support",
        icon: "HelpCircle",
        href: "/school/help",
      },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// SUPER ADMIN SIDEBAR — All modules visible
// ═══════════════════════════════════════════════════════════════════════════════

export const SUPERADMIN_SIDEBAR = [
  {
    section: "Main",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: "LayoutDashboard",
        href: "/superadmin",
      },
    ],
  },
  {
    section: "Schools",
    items: [
      {
        id: "schools",
        label: "All Schools",
        icon: "Building2",
        href: "/superadmin/schools",
      },
      {
        id: "subscriptions",
        label: "Subscriptions",
        icon: "CreditCard",
        href: "/superadmin/subscriptions",
      },
    ],
  },
  {
    section: "Platform",
    items: [
      {
        id: "students",
        label: "All Students",
        icon: "Users",
        href: "/superadmin/students",
      },
      {
        id: "scan-logs",
        label: "Scan Logs",
        icon: "ScanLine",
        href: "/superadmin/scans",
      },
      {
        id: "anomalies",
        label: "Anomalies",
        icon: "Shield",
        href: "/superadmin/anomalies",
      },
    ],
  },
  {
    section: "System",
    items: [
      {
        id: "audit-logs",
        label: "Audit Logs",
        icon: "Activity",
        href: "/superadmin/audit-logs",
      },
      {
        id: "health",
        label: "System Health",
        icon: "HeartPulse",
        href: "/superadmin/health",
      },
      {
        id: "queues",
        label: "Queue Monitor",
        icon: "BarChart2",
        href: "/superadmin/queues",
      },
    ],
  },
  {
    section: "Settings",
    items: [
      {
        id: "admins",
        label: "Admin Accounts",
        icon: "UserCog",
        href: "/superadmin/admins",
      },
      {
        id: "settings",
        label: "Platform Settings",
        icon: "Settings",
        href: "/superadmin/settings",
      },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE → PLAN REQUIREMENT MAP (for middleware/route guards)
// ═══════════════════════════════════════════════════════════════════════════════

export const MODULE_PLAN_MAP = {
  "/school/students": ["emergency"],
  "/school/cards": ["emergency"],
  "/school/scans": ["emergency"],
  "/school/anomalies": ["emergency"],
  "/school/attendance": ["attendance"],
  "/school/attendance/sessions": ["attendance"],
  "/school/attendance/reports": ["attendance"],
  "/school/attendance/devices": ["attendance"],
  "/school/timetable": ["timetable"],
  "/school/timetable/substitutions": ["timetable"],
  "/school/teachers": ["timetable"],
  "/school/subjects": ["timetable"],
  "/school/classes": ["timetable"],
  "/school/communication/announcements": ["parent_communication"],
  "/school/communication/messages": ["parent_communication"],
};
