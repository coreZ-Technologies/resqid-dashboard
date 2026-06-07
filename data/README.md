# RESQID JSON Schemas

Auto-generated from: Prisma schema files, constants (roles.js, plans.js, modules.js, status.js), and Zod validation schemas.

---

## Folder Structure

```
resqid-json-schemas/
├── core/
│   ├── super-admin.json        → SuperAdmin — super_admins table
│   ├── school-user.json        → SchoolUser (admin/teacher) — school_users table
│   ├── parent-user.json        → ParentUser — parent_users table
│   ├── student.json            → Student — students table
│   ├── school.json             → School (tenant root) — schools table
│   ├── token.json              → Token (QR/RFID card) — tokens table
│   ├── plan.json               → Plan — plans table
│   └── subscription.json       → Subscription — subscriptions table
│
├── modules/
│   ├── emergency-profile.json  → EmergencyProfile + EmergencyContact
│   ├── attendance.json         → AttendanceSession, Tap, Records, Settings
│   ├── timetable.json          → Config, Template, Timetable, Assignment, Substitution, etc.
│   ├── communication.json      → Announcement, Message, MessageTemplate
│   └── scan.json               → Scan, ScanAnomaly, ScanLog
│
├── shared/
│   ├── notification.json       → Notification + NotificationPreference
│   └── audit-log.json          → AuditLog
│
├── api-responses/
│   └── api-responses.json      → Standard envelopes: success, error, paginated, auth, dashboard, QR scan
│
└── sample-data/
    └── sample-data.json        → Realistic sample records for all core entities
```

---

## Where Each File Lives in the Project

| Schema File | Suggested project location |
|---|---|
| All schemas | `resqid-dashboard/lib/schemas/` (import for TypeScript types) |
| Sample data | `resqid-dashboard/lib/mock-data.js` (replace mocks with these shapes) |
| API responses | `resqid-dashboard/lib/api.js` (expected response shapes) |
| Validation reference | `resqid-backend/src/shared/constants/` (alongside roles.js etc.) |

---

## Key Design Decisions

### Tenant Isolation
Every record except `SuperAdmin` has a `schoolId` field. The `tenantScope.middleware.js` injects and validates this on every school-scoped request.

### Module Gating
Module access: `requireModule.middleware.js` checks `Subscription.modules[]` against `MODULES` in modules.js. Status 423 returned if module not active.

### Blood Group Mapping
Prisma stores `A_POSITIVE` but maps (via `@map`) to `"A+"` in the DB. The frontend should display `"A+"` — use a utility to convert: `A_POSITIVE → A+`, `AB_NEGATIVE → AB-` etc.

### Token Security
`scanCode` is AES-SIV encrypted. Never expose in list endpoints. Only used in QR URL generation. `scanCodeHash` used for lookup.

### Visibility Controls
Emergency profile has `showX` boolean fields. QR scan public endpoint filters response based on these. Frontend emergency page must respect same flags when showing the profile editor state.

### Plan → Modules
Source of truth for which modules a plan unlocks is `PLAN_MODULES` in `plans.js`, NOT the DB. DB `Plan.modules[]` is synced from constants at seed time.

### Password Default Flag
`isPasswordDefault: true` on SchoolUser means the user hasn't changed from the system-generated password. Frontend should show a forced password change screen when this is true.

---

## Pending (attach these files for Phase 2)
- `mock-data.js` — match frontend mock shapes
- `constants.js` — frontend constants
- `dashboard.validation.js` — dashboard query params
- `card.validation.js` — card management
- `attendance.validation.js` — attendance module
- `emergency.validation.js` — emergency module
