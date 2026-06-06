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

// Grade constants
export const GRADES = [
  "Nursery",
  "LKG",
  "UKG",
  "Cls 1",
  "Cls 2",
  "Cls 3",
  "Cls 4",
  "Cls 5",
  "Cls 6",
  "Cls 7",
  "Cls 8",
  "Cls 9",
  "Cls 10",
  "Cls 11",
  "Cls 12",
];

export const GRADE_GROUPS = ["All", "Primary", "Middle", "Secondary", "Senior"];

export const STATUS_OPTIONS = ["All", "Active", "Inactive"];

export const GRADE_GROUP_MAP = {
  Nursery: "Primary",
  LKG: "Primary",
  UKG: "Primary",
  "Cls 1": "Primary",
  "Cls 2": "Primary",
  "Cls 3": "Primary",
  "Cls 4": "Primary",
  "Cls 5": "Primary",
  "Cls 6": "Middle",
  "Cls 7": "Middle",
  "Cls 8": "Middle",
  "Cls 9": "Secondary",
  "Cls 10": "Secondary",
  "Cls 11": "Senior",
  "Cls 12": "Senior",
};

export const GROUP_COLORS = {
  Primary: {
    bg: "bg-blue-500",
    light: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  Middle: {
    bg: "bg-violet-500",
    light: "bg-violet-50",
    text: "text-violet-700",
    border: "border-violet-200",
  },
  Secondary: {
    bg: "bg-emerald-500",
    light: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  Senior: {
    bg: "bg-amber-500",
    light: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
};

export const SUBJECT_CATEGORIES = [
  "All",
  "Core",
  "Elective",
  "Language",
  "Lab",
  "Activity",
];

export const SUBJECT_CATEGORY_COLORS = {
  Core: {
    bg: "bg-blue-500",
    light: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  Elective: {
    bg: "bg-violet-500",
    light: "bg-violet-50",
    text: "text-violet-700",
    border: "border-violet-200",
  },
  Language: {
    bg: "bg-emerald-500",
    light: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  Lab: {
    bg: "bg-amber-500",
    light: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  Activity: {
    bg: "bg-rose-500",
    light: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
  },
};

export const TEACHER_STATUS_OPTIONS = [
  "All",
  "Active",
  "On Leave",
  "Medical",
  "Maternity",
  "Resigned",
];

export const WELLNESS_TYPES = [
  {
    value: "maternity",
    label: "Maternity Leave",
    icon: "🤰",
    duration: "6 months typical",
  },
  {
    value: "medical",
    label: "Medical Leave",
    icon: "🏥",
    duration: "2 weeks – 3 months",
  },
  {
    value: "sabbatical",
    label: "Sabbatical",
    icon: "🌴",
    duration: "3–12 months",
  },
  {
    value: "personal",
    label: "Personal Leave",
    icon: "🏠",
    duration: "1–5 days",
  },
];

export const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const PERIOD_TIMES = [
  "8:00–8:45 AM",
  "8:45–9:30 AM",
  "9:30–10:15 AM",
  "10:15–11:00 AM",
  "11:00–11:45 AM",
  "11:45–12:30 PM",
  "12:30–1:15 PM",
  "1:15–2:00 PM",
];

export const TERM_OPTIONS = ["Term 1", "Term 2", "Term 3"];
export const ACADEMIC_YEARS = ["2025-2026", "2026-2027", "2027-2028"];

export const TIMETABLE_PERIODS = [
  { num: 1, time: "8:00–8:45 AM" },
  { num: 2, time: "8:45–9:30 AM" },
  { num: 3, time: "9:30–10:15 AM" },
  { num: 4, time: "10:15–11:00 AM" },
  { num: 5, time: "11:00–11:45 AM" },
  { num: 6, time: "11:45–12:30 PM" },
  { num: 7, time: "12:30–1:15 PM" },
  { num: 8, time: "1:15–2:00 PM" },
];

export const DAYS_OF_WEEK_FULL = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
