Scan Logs – Frontend Documentation

# Page Overview

Real-time log of all QR code scan events. Shows today’s statistics, a filterable/searchable table of scans, and pagination.

---

# 1. API Endpoints Required

## 1.1 Fetch Scan Logs

**GET **/api/scans

Returns a paginated list of scan events with optional filtering.

### Query Parameters (optional)

| **Parameter** | **Type** | **Description** |
| --- | --- | --- |
| result | string | Filter by scan result: ALL, SUCCESS, INVALID, REVOKED, EXPIRED, RATE_LIMITED, ERROR |
| search | string | Search in student name, IP city, or token hash |
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 15) |

### Response (200 OK)

{
  "data": [
    {
      "id": "scan-1",
      "token_hash": "BABCD1234EFGH5678",
      "result": "SUCCESS",
      "student_name": "Aarav Sharma",
      "ip_address": "103.21.58.1",
      "ip_city": "Mumbai",
      "device": "Chrome/Android",
      "scan_purpose": "REGISTRATION",
      "response_time_ms": 142,
      "created_at": "2026-05-30T08:15:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 15,
    "total": 40,
    "totalPages": 3
  },
  "stats": {
    "total": 312,
    "success": 289,
    "failed": 23,
    "avgResponse": "142ms"
  }
}

### Response Fields – Scan Object

| **Field** | **Type** | **Description** |
| --- | --- | --- |
| id | string | Unique scan event ID |
| token_hash | string | Full QR token hash (frontend masks it) |
| result | string | One of SUCCESS, INVALID, REVOKED, EXPIRED, RATE_LIMITED, ERROR |
| student_name | string | Student full name (may be null if unknown) |
| ip_address | string | IPv4 address of the scanning device |
| ip_city | string | City derived from IP address |
| device | string | User-agent string (browser/OS) |
| scan_purpose | string | EMERGENCY, REGISTRATION, UNKNOWN |
| response_time_ms | number | Response time of the QR verification (milliseconds) |
| created_at | string | ISO timestamp of the scan |

## 1.2 Today’s Statistics (Optional)

The stats object returned in the main response already contains today’s aggregated data. If needed separately:

**GET **/api/scans/stats/today

{ "total": 312, "success": 289, "failed": 23, "avgResponse": "142ms" }

# 2. Data Requirements (Input from User)

Result filter – dropdown buttons (All Results, Success, Invalid, Revoked, Expired, Rate Limited, Error)

Search term – free text (student name, IP city, token hash)

Pagination – page number (handled by frontend)

# 3. Data Fetched from Backend

List of scan logs (for current page and filters)

Pagination metadata (current page, total pages, total items)

Today’s statistics: total, success, failed, avgResponse

# 4. Data Displayed on UI

Stats Cards (top): Shows Today's Scans, Successful, Failed, and Avg Response.

Scan Logs Table: Column logic includes relative time, badge with icon for Result, Student name, Masked token hash, Location with MapPin icon, Device OS/Browser, and color-coded Response time.

Empty State: Message “No scan logs found” with ScanLine icon.

Pagination: Page size fixed at 15. Shows current page range and total items.

# 5. Summary of Data Flow

Page loads: Frontend → GET /api/scans?page=1&limit=15 → Backend returns { data, pagination, stats } → renders UI.
User selects result filter: Frontend updates query param and refetches.
User searches: Uses debounced search term to refetch.
User changes page: Fetches new page with same filters.
User clicks pagination button: GET /api/scans?page=2&limit=15&result=SUCCESS&search=...

# 6. Notes for Backend

Result values must exactly match the frontend list: SUCCESS, INVALID, REVOKED, EXPIRED, RATE_LIMITED, ERROR.

Masking token hash – frontend masks; backend can send full hash.

Today’s stats – compute for the current calendar day (UTC+5:30 or school timezone).

Average response time – send as a string with ms unit (e.g., '142ms').

Pagination – backend should support page and limit. Frontend uses limit=15.

Search – should match student name, IP city, and token hash (partial matches allowed).

Performance – use indexes on created_at, result, token_hash.

Time zones – store timestamps in UTC.

IP city – can be derived from IP address at scan time.

Scan purpose – optional; present in mock data.