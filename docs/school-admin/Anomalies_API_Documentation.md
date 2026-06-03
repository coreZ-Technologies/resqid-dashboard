Anomalies – Frontend Documentation

## Page Overview

Displays security alerts and suspicious scan activity. Includes KPI cards, filtering (status, severity, search), a table of anomalies, and a detail panel with actions.

## 1. API Endpoints Required

### 1.1 Fetch Anomalies List

**GET **/api/anomalies
Fetches anomalies with optional filters.

#### Query Parameters (all optional)

| **Parameter** | **Type** | **Description** |
| --- | --- | --- |
| status | string | open, investigating, resolved |
| severity | string | high, medium, low |
| search | string | Search by student name, anomaly ID, or description |
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 10, but frontend currently loads all for filtering) |

#### Example Request

GET /api/anomalies?status=open&severity=high&search=duplicate

#### Response (200 OK)

{
  "data": [
    {
      "id": "ANO-001",
      "type": "duplicate_scan",
      "severity": "high",
      "status": "open",
      "student": {
        "name": "Priya Sharma",
        "studentId": "STU-2341",
        "class": "Class 8-A",
        "avatar": "PS",
        "avatarColor": "bg-blue-500"
      },
      "description": "QR card scanned twice within 4 minutes at two different gates",
      "location": "Gate A → Gate C",
      "time": "2026-05-30T08:02:00.000Z",
      "date": "Today",
      "detectedBy": "Auto-detection"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 24,
    "totalPages": 3
  },
  "stats": {
    "totalAnomalies": 24,
    "openUnresolved": 7,
    "resolvedToday": 5,
    "highSeverity": 3
  }
}

### Response Fields – Anomaly Object

| **Field** | **Type** | **Description** |
| --- | --- | --- |
| id | string | Unique anomaly ID (e.g., ANO-001) |
| type | string | duplicate_scan, unknown_card, outside_hours, multiple_exits, suspicious_timing |
| severity | string | high, medium, low |
| status | string | open, investigating, resolved |
| student | object | Student information (or null for unknown) |
| student.name | string | Student full name |
| student.studentId | string | Unique student ID (may be null) |
| student.class | string | Class name (may be "—" if unknown) |
| student.avatar | string | Initials (2–3 chars) |
| student.avatarColor | string | Tailwind CSS class for avatar background (e.g., bg-blue-500) |
| description | string | Human-readable description of anomaly |
| location | string | Gate or location where anomaly occurred |
| time | string | ISO timestamp of anomaly |
| date | string | Human-readable date (e.g., Today, Yesterday, 2 days ago) |
| detectedBy | string | Scanner or system that detected the anomaly |

### 1.2 Update Anomaly Status

**PATCH **/api/anomalies/{id}
Updates the status of a specific anomaly.

#### Request Body

{  "status": "resolved"}

Allowed status values: open, investigating, resolved.

#### Response (200 OK)

{  "success": true,  "data": { ...updated anomaly object... }}

### 1.3 Export Anomalies as CSV

**GET **/api/anomalies/export
Same query parameters as fetch endpoint, returns CSV file.

#### Response

Content-Type: text/csv
Content-Disposition: attachment; filename="anomalies.csv"

### 1.4 Refresh / Re-run Detection (optional)

**POST **/api/anomalies/refresh
Triggers a re-scan of recent scan logs to detect any missed anomalies.

#### Response

{
  "success": true,
  "newAnomaliesCount": 2
}

## 2. Data Requirements (Input from User)

### Filters (sent as query params)

Status filter – All, Open, Investigating, Resolved → maps to status param (or omit for all)

Severity filter – All Severities, High, Medium, Low → maps to severity param

Search term – free text (search)

### Actions in Detail Panel

Mark as Resolved → PATCH /api/anomalies/{id} with { "status": "resolved" }

Mark as Investigating → PATCH with { "status": "investigating" }

View Student Profile → client-side navigation to /school/students/{studentId} (no API call needed for this page)

## 3. Data Fetched from Backend

List of anomalies (full objects as above)

Pagination metadata (though UI currently loads all and filters client-side; recommend pagination for large datasets)

Statistics for KPI cards:
  - totalAnomalies → Total anomalies count
  - openUnresolved → Count of anomalies with status open or investigating
  - resolvedToday → Count of anomalies resolved today (status resolved and time within current day)
  - highSeverity → Count of anomalies with severity high

## 4. Data Displayed on UI

### KPI Cards

| **Card Label** | **Source Field** |
| --- | --- |
| Total Anomalies | stats.totalAnomalies |
| Open / Unresolved | stats.openUnresolved |
| Resolved Today | stats.resolvedToday |
| High Severity | stats.highSeverity |

### Anomalies Table

| **Column** | **Display Logic** |
| --- | --- |
| ID | id (monospace) |
| Student | Avatar initials + name + class |
| Type | Badge with icon and label based on type |
| Severity | Badge with dot and text (High, Medium, Low) |
| Location & Time | location with MapPin icon; date and time (relative or absolute) |
| Status | Badge with dot and text (Open, Investigating, Resolved) |
| Action (Eye icon) | Click to select/deselect row for detail panel |

### Detail Panel (when row selected)

Shows:

Student avatar, name, class, student ID (if known)

Type, severity, status badges

Description

Details: Location, Time (full datetime), Date, Detected By

Action buttons (if status not resolved): Mark as Resolved, Mark as Investigating, View Student Profile (link)

## 5. Summary of Data Flow

User selects filters / search
↓ Frontend → GET /api/anomalies (with query params)
↓ Backend returns { data, stats, pagination }
↓ Frontend renders:
  - KPI cards (from stats)
  - Table rows (with badges for type, severity, status)
  - Filtering applied client-side (or server-side if paginated)
↓ User clicks on a row → show detail panel
↓ User clicks "Mark as Resolved" → PATCH /api/anomalies/{id}
↓ Frontend updates local state or refetches list
↓ User clicks "Export CSV" → GET /api/anomalies/export

## 6. Notes for Backend

Anomaly types mapping to human-readable labels: duplicate_scan → "Duplicate Scan", unknown_card → "Unknown Card", outside_hours → "Outside Hours", multiple_exits → "Multiple Exits", suspicious_timing → "Suspicious Timing".

Severity levels should be determined by business rules (e.g., duplicate scan → high, suspicious timing → low).

Status transitions should be logged (audit trail).

detectedBy field can be a string (scanner ID or "Auto-detection").

Time fields: Send ISO timestamp in time. Frontend generates date (Today/Yesterday) and formatted time.

Avatar color can be generated deterministically from student name (e.g., hash-based), but frontend expects a Tailwind class string. Alternatively, backend sends only initials and frontend picks colors.

Pagination: Although the current frontend loads all data and filters client-side, it's recommended to support server-side pagination with page and limit for scalability.

Student object: For unknown cards, student can be null or an object with name: "Unknown", studentId: null, etc.

## 7. Example Webhook / Real-time Updates (optional)

If anomalies are detected in real-time, consider a WebSocket or SSE endpoint:

WS /ws/anomalies – pushes new anomaly objects as they occur.