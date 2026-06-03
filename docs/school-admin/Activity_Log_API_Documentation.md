Activity Log – Frontend Documentation

## Page Overview

Displays a full audit trail of user and system actions. Includes filtering, searching, pagination, and an export option.

## 1. API Endpoints Required

### 1.1 Fetch Activity Logs

**GET **/api/activity-logs
Fetches paginated logs with optional filters.

#### Query Parameters (all optional)

| **Parameter** | **Type** | **Description** |
| --- | --- | --- |
| search | string | Search by actor name, action, or module |
| type | string | create, update, delete, export, login, logout, view, system |
| status | string | success, failed |
| role | string | School Admin, Teacher, System |
| dateFrom | string | ISO date (YYYY-MM-DD) |
| dateTo | string | ISO date (YYYY-MM-DD) |
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 10, fixed in UI) |

#### Example Request

GET /api/activity-logs?type=login&status=failed&page=2&limit=10

#### Response (200 OK)

{
  "data": [
    {
      "id": 4,
      "actor": "Rajan Mehta",
      "role": "Teacher",
      "avatar": "RM",
      "action": "Failed login attempt (wrong password)",
      "module": "Auth",
      "type": "login",
      "severity": "warning",
      "ip": "203.0.113.45",
      "device": "desktop",
      "time": "2026-05-24T05:58:22.000Z",
      "status": "failed"
    }
  ],
  "pagination": {
    "page": 2,
    "limit": 10,
    "total": 45,
    "totalPages": 5
  },
  "stats": {
    "totalEvents": 182,
    "todayCount": 12,
    "criticalCount": 3,
    "failedCount": 2,
    "uniqueUsers": 14
  }
}

### Response Fields – Log Entry

| **Field** | **Type** | **Description** |
| --- | --- | --- |
| id | number | Unique log ID |
| actor | string | Name of the person / system |
| role | string | School Admin, Teacher, System |
| avatar | string | Initials for avatar (2–3 chars) |
| action | string | Human-readable action description |
| module | string | Module name (e.g., Auth, Attendance, etc.) |
| type | string | create, update, delete, export, login, logout, view, system |
| severity | string | info, warning, critical |
| ip | string | IP address or internal |
| device | string | desktop, mobile, server |
| time | string | ISO timestamp (server time) |
| status | string | success or failed |

## 1.2 Export Logs as CSV

**GET **/api/activity-logs/export
Same query parameters as above but returns CSV file.

#### Response

Content-Type: text/csv
Content-Disposition: attachment; filename="activity-logs.csv"

## 2. Data Requirements (Input from User)

### Filters (sent as query params to API)

Search term – free text (search)

Action type – dropdown (type)

Status – success/failed (status)

Role – School Admin / Teacher / System (role)

Date range – from and to (dateFrom, dateTo)

### Pagination

Current page number (page)

## 3. Data Fetched from Backend

List of log entries (full objects as above)

Pagination metadata (current page, total pages, total items)

Statistics for the four stat cards:
  - totalEvents → Total events (all time)
  - todayCount → Events from current day
  - criticalCount → Events with severity = critical
  - failedCount → Events with status = failed
  - uniqueUsers → Count of distinct actor names

## 4. Data Displayed on UI

### Stat Cards

| **Card Label** | **Source Field** |
| --- | --- |
| Total Events | stats.totalEvents |
| Today's Activity | stats.todayCount |
| Active Users | stats.uniqueUsers |
| Critical Actions | stats.criticalCount + stats.failedCount (shown as badge) |

### Activity Log Table (Desktop)

| **Column** | **Display Logic** |
| --- | --- |
| Type icon | Based on type (create → Plus, delete → Trash, etc.) |
| Action & Actor | action + actor name + role + avatar initials |
| Module | Pill with background color based on module name |
| Status | Dot color by severity + success/failed icon & text |
| Timestamp | Relative time + full datetime on hover/second line |
| IP / Device | Device icon + IP address |

### Mobile View

Compact row: shows type icon, action, actor, role, and module pill.

### Expanded Detail (on row click)

Shows additional fields:

Event ID

Actor (with role)

Module

Action Type

Severity

Status

IP Address

Full Time

## 5. Summary of Data Flow

User input (filters, pagination)
↓ Frontend → API request to GET /api/activity-logs
↓ Backend returns { data, pagination, stats }
↓ Frontend renders:
  - Stats cards
  - Table rows (with type icons, status badges, relative times)
  - Pagination controls
↓ User clicks "Export CSV" → GET /api/activity-logs/export

## 6. Notes for Backend

Ensure time field is in ISO format with timezone (prefer UTC).

Device detection: device can be inferred from User-Agent or sent by frontend.

avatar can be generated from actor name (first letters) if not stored.

Sorting: logs should be returned in descending order by time (most recent first).

The frontend uses page size = 10 (hardcoded). Backend should support limit parameter.

Export CSV should respect the same filters as the table view.