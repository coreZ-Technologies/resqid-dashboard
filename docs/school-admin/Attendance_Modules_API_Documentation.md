# 1. RFID Devices – Frontend Documentation

## Page Overview

Monitors and manages all attendance hardware across the campus. Shows device status (online/offline/faulty), signal strength, battery levels, scans count, firmware versions, and recent activity.

## 1. API Endpoints Required

### 1.1 Fetch All Devices

GET /api/devices

#### Query Parameters (all optional)

| **Parameter** | **Type** | **Description** |
| --- | --- | --- |
| status | string | online, offline, faulty |
| zone | string | Entry, Classroom, Library, Outdoor, Indoor |
| search | string | Search by device name, location, ID |
| page | number | Page number |
| limit | number | Items per page |

#### Response (200 OK)

{
  "data": [
    {
      "id": "RFID-001",
      "name": "Main Entrance Scanner",
      "location": "Main Gate",
      "zone": "Entry",
      "status": "online",
      "ipAddress": "192.168.1.101",
      "macAddress": "A4:CF:12:88:01:FF",
      "firmware": "v3.2.1",
      "battery": null,
      "signal": 98,
      "todayScans": 312,
      "lastSeen": "2026-05-30T08:02:00Z",
      "lastPing": "2s ago",
      "installedOn": "2025-01-12",
      "type": "Gate Scanner",
      "model": "RESQID GS-200",
      "totalScans": 42810,
      "issue": null
    }
  ],
  "stats": {
    "totalDevices": 8,
    "online": 6,
    "offlineFaulty": 2,
    "todayScans": 847
  },
  "recentActivity": [
    {
      "deviceId": "RFID-001",
      "device": "Main Entrance Scanner",
      "event": "Scan",
      "student": "Priya Sharma",
      "time": "2026-05-30T08:02:00Z",
      "status": "success"
    }
  ]
}

#### Device Fields

| **Field** | **Type** | **Description** |
| --- | --- | --- |
| id | string | Unique device ID |
| name | string | Device name |
| location | string | Physical location |
| zone | string | Entry, Classroom, Library, Outdoor, Indoor |
| status | string | online, offline, faulty |
| ipAddress | string | IP address |
| macAddress | string | MAC address |
| firmware | string | Firmware version |
| battery | number | Battery percentage (null if wired) |
| signal | number | Signal strength percentage (0–100) |
| todayScans | number | Scans recorded today |
| lastSeen | string | ISO timestamp of last communication |
| lastPing | string | Human-readable last ping (e.g., "2s ago") |
| installedOn | string | Installation date (YYYY-MM-DD) |
| type | string | Gate Scanner, Classroom Reader, etc. |
| model | string | Hardware model |
| totalScans | number | Lifetime scans |
| issue | string | Optional issue description (if status not online) |

### 1.2 Update Device (Restart, Firmware Update, Configure)

PATCH /api/devices/{id}

{
  "action": "restart",  // or "update_firmware", "configure"
  "config": {}          // optional config object
}

Response:

{
  "success": true,
  "message": "Restart command sent"
}

### 1.3 Export Devices List

GET /api/devices/export (same query params → CSV)

### 1.4 Add New Device

POST /api/devices

{
  "name": "New Scanner",
  "location": "Gate D",
  "zone": "Entry",
  "type": "Gate Scanner",
  "model": "RESQID GS-200",
  "ipAddress": "192.168.1.110",
  "macAddress": "AA:BB:CC:DD:EE:FF"
}

## 2. Data Requirements (Input from User)

Filters: status (All/Online/Offline/Faulty), zone (All Zones / Entry / Classroom / Library / Outdoor / Indoor), search text

Actions (from detail panel):
 - Restart Device
 - Update Firmware
 - Configure Device
 - Remove Device (offline only)

## 3. Data Fetched from Backend

List of devices (full objects)

Statistics: total devices, online count, offline/faulty count, today's scans

Recent activity feed (last few events)

## 4. Data Displayed on UI

| **Card Label** | **Source Field** |
| --- | --- |
| Total Devices | stats.totalDevices |
| Online | stats.online |
| Offline / Faulty | stats.offlineFaulty |
| Today's Scans | stats.todayScans |

## 5. Notes for Backend

Send lastPing as a human-readable string.

Firmware latest version: v3.2.1 – backend should indicate if update available.

For battery: send null for wired devices.

For offline/faulty devices, include an issue field with explanation.

WebSocket recommended for real-time status updates.

# 2. Attendance Reports – Frontend Documentation

## Page Overview

Generates attendance, scan logs, students, and sessions reports with date range and class filtering. Supports CSV/PDF export and print.

## 1. API Endpoints Required

### 1.1 Fetch Attendance Report

GET /api/reports/attendance

| **Parameter** | **Type** | **Description** |
| --- | --- | --- |
| dateRange | string | today, this_week, this_month, last_month, custom |
| from | string | YYYY-MM-DD |
| to | string | YYYY-MM-DD |
| class | string | Class name (e.g., Cls 5) or all |
| section | string | Optional section (A, B, etc.) |

{
  "data": [
    {
      "date": "30/5/2026",
      "class": "Cls 1",
      "section": "A",
      "totalStudents": 35,
      "present": 35,
      "absent": 0,
      "late": 0,
      "attendanceRate": 100
    }
  ],
  "summary": {
    "totalStudents": 2100,
    "presentToday": 1786,
    "absentToday": 118,
    "attendanceRate": 85,
    "rateChange": 3
  }
}

### 1.2 Fetch Scan Logs Report

GET /api/reports/scan-logs

{
  "data": [
    {
      "date": "2026-05-30",
      "time": "08:02 AM",
      "student": "Aarav Sharma",
      "class": "Cls 10",
      "result": "SUCCESS",
      "device": "Chrome/Android",
      "responseTime": "97ms"
    }
  ]
}

### 1.3 Fetch Students Report

GET /api/reports/students

### 1.4 Fetch Sessions Report

GET /api/reports/sessions

### 1.5 Export Reports

GET /api/reports/export/{reportType}

Same query parameters as fetch. Returns CSV or PDF (based on format query param: csv, pdf, or print).

## 2. Notes for Backend

dateRange parameter can be expanded to send actual start/end dates.

Attendance rate change is week-over-week or month-over-month.

For scan logs, result should be SUCCESS, INVALID, REVOKED, EXPIRED.

# 3. Attendance Sessions – Frontend Documentation

## Page Overview

Allows teachers/staff to open, pause, resume, and close attendance sessions per class. Displays live session status, scans count, and attendance rate.

## 1. API Endpoints Required

### 1.1 Fetch All Sessions

GET /api/sessions

| **Parameter** | **Type** | **Description** |
| --- | --- | --- |
| status | string | OPEN, PAUSED, CLOSED, ALL |
| class | string | Class name (e.g., Cls 10) |
| search | string | Search class, subject, teacher |

{
  "data": [
    {
      "id": "s1",
      "class": "Cls 10",
      "section": "A",
      "subject": "Mathematics",
      "teacher": "Mr. Rajesh Kumar",
      "status": "OPEN",
      "opened_at": "2026-05-30T08:00:00Z",
      "closed_at": null,
      "scans": 32,
      "total_students": 35,
      "attendance_rate": 91
    }
  ]
}

### 1.2 Open a New Session

POST /api/sessions

### 1.3 Update Session Status

PATCH /api/sessions/{id}

### 1.4 Delete/Close Session

DELETE /api/sessions/{id}

## 2. Notes for Backend

status must be one of: OPEN, PAUSED, CLOSED.

attendance_rate = round((scans / total_students) * 100).

WebSocket recommended for real-time scan count updates.

# 4. Attendance (Main) – Frontend Documentation

## Page Overview

Track and manage student attendance across all classes. Shows summary stats, class cards, monthly trend chart, and a modal for marking individual student attendance.

## 1. API Endpoints Required

### 1.1 Fetch Attendance Data for a Date

GET /api/attendance

{
  "data": [
    {
      "class": "Cls 1",
      "section": "A",
      "totalStudents": 35,
      "present": 35,
      "absent": 0,
      "late": 0,
      "leave": 0,
      "attendanceRate": 100
    }
  ],
  "summary": {
    "totalStudents": 2100,
    "present": 1786,
    "overallRate": 85
  }
}

### 1.2 Update Attendance for a Class–Section

PUT /api/attendance

### 1.3 Send Reminders

POST /api/attendance/reminders

### 1.4 Export Attendance Report

GET /api/attendance/export

## 2. Notes for Backend

status allowed values: present, absent, late, leave.

Attendance update should be atomic for the whole class–section.

Consider optimistic locking (e.g., version/timestamp) to prevent concurrent overwrites.