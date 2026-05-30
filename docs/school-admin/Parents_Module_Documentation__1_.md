Parents List – Frontend Documentation

# Page Overview

Displays a list of parents with engagement metrics, linked children, and quick actions. Includes a detail panel for selected parent, summary stats, and a summary table.

---

# 1. API Endpoints Required

## 1.1 Fetch All Parents

**GET **/api/parents

Returns paginated list of parents with their children and engagement metrics.

### Query Parameters (optional)

| **Parameter** | **Type** | **Description** |
| --- | --- | --- |
| search | string | Search by parent name, email, or child name |
| engagement | string | high, medium, low |
| page | number | Page number |
| limit | number | Items per page |

### Response (200 OK)

{
  "data": [
    {
      "id": 1,
      "name": "Rajesh Sharma",
      "email": "rajesh.sharma@gmail.com",
      "phone": "+91 98765 43210",
      "location": "Salt Lake, Kolkata",
      "avatar": "RS",
      "avatarColor": "bg-blue-500",
      "children": [
        { "name": "Priya Sharma", "class": "Class 8-A", "rfid": "RFID-2341", "attendance": 94, "status": "present" }
      ],
      "lastSeen": "2026-05-30T08:42:00Z",
      "engagement": "high",
      "notifications": 12,
      "joinedDate": "2024-01-15T00:00:00Z"
    }
  ],
  "stats": { "totalParents": 6, "totalChildren": 9, "highEngagement": 4, "pendingNotifications": 69, "avgAttendance": 89 }
}

### Response Fields – Parent Object

| **Field** | **Type** | **Description** |
| --- | --- | --- |
| id | number | Unique parent ID |
| name | string | Full name |
| email | string | Email address |
| phone | string | Phone number with country code |
| location | string | Home address / area |
| avatar | string | Initials (2–3 chars) |
| avatarColor | string | Tailwind CSS class for avatar background |
| children | array[object] | List of linked children (see below) |
| lastSeen | string | ISO timestamp of last activity (login, etc.) |
| engagement | string | high, medium, low |
| notifications | number | Count of pending/unread notifications |
| joinedDate | string | ISO date when parent was registered |

### Child Object Structure

| **Field** | **Type** | **Description** |
| --- | --- | --- |
| name | string | Child's full name |
| class | string | e.g., Class 8-A |
| rfid | string | RFID card ID |
| attendance | number | Attendance percentage (0–100) |
| status | string | present, absent, late (today) |

## 1.2 Get Parent Statistics (Optional)

**GET **/api/parents/stats

{ "totalParents": 6, "totalChildren": 9, "highEngagement": 4, "pendingNotifications": 69, "avgAttendance": 89 }

## 1.3 Send Message to a Parent

**POST **/api/parents/{parentId}/message

{ "subject": "Meeting Reminder", "message": "The parent-teacher meeting is scheduled for 15th June." }

### Response

{ "success": true, "messageId": "msg_123" }

## 1.4 Send Push Notification

**POST **/api/parents/{parentId}/push

Similar to message, but for mobile push.

## 1.5 Initiate Call

No API – client side tel: link

## 1.6 View Report

Links to analytics; may not need separate endpoint

# 2. Data Requirements (Input from User)

Search – free text (parent name, email, child name)

Engagement filter – tabs (All / High / Medium / Low)

Actions on parent card – click to select (opens detail panel)

Detail panel actions: Send Message, Push Notify, Call Parent, View Report

# 3. Data Displayed on UI

Stat Cards: Total Parents, High Engagement, Pending Notifications, Avg. Attendance

Parent Cards (grid): Avatar, name, last seen, Engagement badge, Children tags, Phone number, notification count

Detail Panel (right side): Contact info, List of children with attendance, Quick actions

Engagement Summary Table: Parent name, children names, avg attendance, engagement badge, pending notifications, action icons

# 4. Notes for Backend

attendance per child should be computed for the current term or rolling period.

status (present/absent/late) is for the current day.

lastSeen updates when parent logs into the parent portal or interacts with notifications.

engagement can be derived from login frequency, notification opens, etc.

Add Parent – Frontend Documentation

# Page Overview

Multi-step form to register a new parent and link them to their children. Collects basic info, linked students, and notification preferences.

---

# 1. API Endpoints Required

## 1.1 Get Available Students for Linking

**GET **/api/students?unlinked=true

{
  "students": [
    { "id": "S001", "name": "Priya Sharma", "class": "Class 8-A", "rfid": "RFID-2341", "avatar": "PS", "color": "bg-blue-500" }
  ]
}

## 1.2 Create a New Parent

**POST **/api/parents

{
  "firstName": "Rajesh", "lastName": "Sharma", "email": "rajesh.sharma@gmail.com", "phone": "+91 98765 43210",
  "relation": "father", "address": "14B, Salt Lake, Kolkata", "password": "securePass123",
  "notifyAttendance": true, "notifyAbsent": true, "notifyLate": false, "notifyEmergency": true,
  "weeklyReport": false, "notifChannel": "App", "linkedStudentIds": ["S001", "S002"]
}

### Field Descriptions

| **Field** | **Type** | **Description** |
| --- | --- | --- |
| firstName | string | Required |
| lastName | string | Required |
| email | string | Required, unique |
| phone | string | Required |
| relation | string | father, mother, guardian, grandparent, other |
| address | string | Optional |
| password | string | Required, min 8 chars, will be hashed |
| notifyAttendance | boolean | Send alerts for check-in/out |
| notifyAbsent | boolean | Alert when child is marked absent |
| notifyLate | boolean | Alert on late arrival |
| notifyEmergency | boolean | Critical alerts (always recommended) |
| weeklyReport | boolean | Weekly summary email |
| notifChannel | string | App, SMS, Email – primary channel |
| linkedStudentIds | array | List of student IDs to link to this parent |

{ "success": true, "parentId": 7, "message": "Parent created successfully" }

## 1.3 Validate Email Uniqueness (Optional)

**GET **/api/parents/check-email?email=...

Returns { "exists": false } to prevent duplicate.

# 2. Data Requirements (Input from User)

Step 1 – Basic Info: First/Last name, Email, Phone, Relation, Address, Password

Step 2 – Link Children: Search available students, Click Link, Linked list shows each child with remove button

Step 3 – Preferences: Toggle notification types, Select primary channel

# 3. Data Fetched & 4. Displayed on UI

Available students list (for linking)

(On submit) – POST to create parent

Avatar preview (initials from first/last name)

Password strength meter

Linked children chips with remove buttons

Summary on success screen

# 5. Notes for Backend

Hash the password before storing (bcrypt).

notifyEmergency is highly recommended; frontend defaults to true.

Linked students: store many-to-many relationship (parent_students table).

Export Parents – Frontend Documentation

# Page Overview

Export parent data in multiple formats (CSV, Excel, PDF, JSON) with filters, selectable fields, and email delivery option. Shows live preview of selected fields.

---

# 1. API Endpoints Required

## 1.1 Export Parents Data

**GET **/api/parents/export

### Query Parameters

| **Parameter** | **Type** | **Description** |
| --- | --- | --- |
| format | string | csv, xlsx, pdf, json |
| dateRange | string | all, this_month, last_month, this_year, last_quarter |
| engagement | string | all, high, medium, low |
| fields | string | Comma-separated list of field IDs |
| emailDelivery | bool | If true, send file to email |

### Field IDs

| **ID** | **Label** |
| --- | --- |
| name | Parent Name |
| email | Email Address |
| phone | Phone Number |
| location | Location |
| children | Linked Children |
| attendance | Avg. Attendance |
| engagement | Engagement Level |
| joined | Joined Date |
| notifs | Pending Notifications |
| rfid | Child RFID Tags |

### Response

{ "success": true, "message": "Export file sent to admin@springdaleschool.in" }

## 1.2 Get Preview Data

**GET **/api/parents/export/preview

{
  "data": [
    { "name": "Rajesh Sharma", "email": "rajesh.sharma@gmail.com", "phone": "+91 98765 43210", "children": 2, "attendance": "91%", "engagement": "High", "joined": "Jan 2024" }
  ],
  "totalCount": 42
}

# 2. Data Requirements & 3. Displayed

Format selection – CSV, Excel, PDF, JSON

Filters – Date Range, Engagement Level

Field selection – checklist (toggle individual fields)

Email delivery toggle

Live preview table (shows selected fields only)

# 5. Notes for Backend

Support all four export formats (CSV, XLSX, PDF, JSON).

Date range mapping: this_month, last_month, this_year, last_quarter

Email delivery: send to the authenticated user's email

Preview endpoint should return at most 20–50 rows for performance.