// =============================================================================
// lib/constants.js — RESQID
// Sidebar configs + plan definitions. Matches backend exactly.
// =============================================================================

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
        description: "Platform overview",
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
        description: "Manage onboarded schools",
      },
      {
        id: "subscriptions",
        label: "Subscriptions",
        icon: "CreditCard",
        href: "/superadmin/subscriptions",
        description: "Plans & billing",
      },
    ],
  },
  {
    section: "Users",
    items: [
      {
        id: "students",
        label: "All Students",
        icon: "Users",
        href: "/superadmin/students",
        description: "Global student registry",
      },
      {
        id: "teachers",
        label: "All Teachers", // ← was missing
        icon: "GraduationCap",
        href: "/superadmin/teachers",
        description: "Global teacher registry",
      },
    ],
  },
  {
    section: "Operations",
    items: [
      {
        id: "scan-logs",
        label: "Scan Logs",
        icon: "ScanLine",
        href: "/superadmin/scans",
        description: "QR scan activity",
      },
      {
        id: "anomalies",
        label: "Anomalies",
        icon: "ShieldAlert",
        href: "/superadmin/anomalies",
        description: "QR scan anomalies",
      },
      {
        id: "alerts",
        label: "Alerts", // ← was removed, brought back
        icon: "AlertTriangle",
        href: "/superadmin/alerts",
        description: "System-level alerts",
      },
    ],
  },
  {
    section: "Monitoring",
    items: [
      {
        id: "notification-logs",
        label: "Notification Logs", // ← was missing from sidebar
        icon: "Bell",
        href: "/superadmin/notification-logs",
        description: "SMS & push delivery logs",
      },
      {
        id: "activity-logs",
        label: "Activity Logs", // ← was missing from sidebar
        icon: "ClipboardList",
        href: "/superadmin/activity-logs",
        description: "School user actions",
      },
      {
        id: "audit-logs",
        label: "Audit Logs",
        icon: "Activity",
        href: "/superadmin/audit-logs",
        description: "Superadmin action history",
      },
    ],
  },
  {
    section: "System",
    items: [
      {
        id: "health",
        label: "System Health",
        icon: "HeartPulse",
        href: "/superadmin/health",
        description: "Services & uptime",
      },
      {
        id: "queues",
        label: "Queue Monitor",
        icon: "BarChart2",
        href: "/superadmin/queues",
        description: "BullMQ job status",
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
        description: "Manage super admins",
      },
      {
        id: "settings",
        label: "Platform Settings",
        icon: "Settings",
        href: "/superadmin/settings",
        description: "Global configuration",
      },
    ],
  },
];
