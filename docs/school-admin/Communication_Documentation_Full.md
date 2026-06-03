Here is the API & Data Documentation for the three communication pages:
Announcements (communication/announcements/page.jsx)
Delivery Log (communication/log/page.jsx)
Messages (communication/messages/page.jsx)
Each documentation is in its own markdown block below.

# Announcements – Frontend Documentation

## Page Overview

Create, edit, pin, and manage school‑wide announcements for students, parents, and teachers. Supports categories (General, Academic, Event, Holiday, Urgent) and statuses (Published, Draft, Scheduled).

## 1. API Endpoints Required

### 1.1 Fetch Announcements

**GET **/api/announcements

#### Query Parameters (optional)

| **Parameter** | **Type** | **Description** |
| --- | --- | --- |
| category | string | General, Academic, Event, Holiday, Urgent |
| status | string | Published, Draft, Scheduled |
| search | string | Search in title or body |
| schoolId | string | Filter by school (multi‑school) |

#### Response (200 OK)

{
  "data": [
    {
      "id": "a1",
      "title": "Annual Sports Day – 10th June 2026",
      "body": "The Annual Sports Day will be held on 10th June…",
      "category": "Event",
      "audience": "All Students",
      "status": "Published",
      "pinned": true,
      "views": 1840,
      "publishedAt": "2026-05-28T00:00:00Z",
      "createdAt": "2026-05-27T10:00:00Z"
    }
  ],
  "stats": {
    "total": 12,
    "published": 7,
    "pinned": 2,
    "totalViews": 8450
  }
}

#### Response Fields – Announcement

| **Field** | **Type** | **Description** |
| --- | --- | --- |
| id | string | Unique ID |
| title | string | Announcement title |
| body | string | Full message text |
| category | string | General, Academic, Event, Holiday, Urgent |
| audience | string | All Students, All Parents, All Teachers, Specific Class |
| status | string | Published, Draft, Scheduled |
| pinned | boolean | If true, appears at top of list |
| views | number | Number of times viewed (only for published) |
| publishedAt | string | ISO timestamp when published (or scheduled) |
| createdAt | string | Creation timestamp |

### 1.2 Create Announcement

POST /api/announcements

Request Body

{
  "title": "New Announcement",
  "body": "Content...",
  "category": "General",
  "audience": "All Students",
  "status": "Published",
  "pinned": false
}

Response (201)

{
  "success": true,
  "announcement": { /* full object */ }
}

### 1.3 Update Announcement

PUT /api/announcements/{id}

Request body: same fields as creation (partial updates allowed).

### 1.4 Delete Announcement

DELETE /api/announcements/{id}

### 1.5 Increment View Count

POST /api/announcements/{id}/view

Called when a user opens an announcement (optional).

## 2. Data Requirements (Input from User)

Add/Edit Modal:
- Title (required)
- Message body (required)
- Category (dropdown)
- Audience (dropdown)
- Pin checkbox
- Status toggle (Draft / Published)

Filters: search text, category pills, status pills
Actions: Edit, Delete

## 3. Data Displayed on UI

### Stat Cards

| **Card Label** | **Source Field** |
| --- | --- |
| Total | stats.total |
| Published | stats.published |
| Pinned | stats.pinned |
| Total Views | stats.totalViews |

### Announcement Cards

Each card shows:
- Pinned indicator (blue line and pin icon)
- Title, status badge
- Body (truncated to 2 lines)
- Category badge, audience badge
- Published date, view count
- Edit & Delete buttons

## 4. Notes for Backend

- status="Scheduled" requires a scheduledFor field (the frontend mock doesn't implement scheduling but can be extended).
- publishedAt should be set automatically when status changes to Published.
- Pinned announcements should be returned first in the list (frontend sorts client‑side, but backend can also sort).
- For Specific Class audience, additional fields like classId and section may be needed.

# Delivery Log – Frontend Documentation

## Page Overview

Tracks delivery status of notifications sent via SMS, Email, Push, and WhatsApp. Shows statistics, filters by channel/status/type, and allows retrying failed deliveries.

## 1. API Endpoints Required

### 1.1 Fetch Delivery Logs

**GET **/api/notifications/delivery-logs

#### Query Parameters (optional)

| **Parameter** | **Type** | **Description** |
| --- | --- | --- |
| channel | string | SMS, Email, Push, WhatsApp |
| status | string | Delivered, Failed, Pending, Bounced |
| type | string | Announcement, Attendance, Fee Reminder, Emergency, General |
| search | string | Search in recipient name, phone, or message |
| page | number | Page number |
| limit | number | Items per page |

#### Response (200 OK)

{
  "data": [
    {
      "id": "log-1",
      "recipient": "Mrs. Priya Sharma",
      "phone": "+91 9876543210",
      "channel": "SMS",
      "type": "Announcement",
      "message": "Annual Sports Day – 10th June 2026",
      "status": "Delivered",
      "sentAt": "2026-05-30T08:00:00Z",
      "deliveredAt": "2026-05-30T08:00:15Z",
      "retries": 0
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 15,
    "total": 40,
    "totalPages": 3
  },
  "stats": {
    "totalSent": 40,
    "delivered": 32,
    "failed": 5,
    "pending": 3,
    "deliveryRate": 80
  }
}

#### Response Fields – Log Entry

| **Field** | **Type** | **Description** |
| --- | --- | --- |
| id | string | Unique log ID |
| recipient | string | Recipient name |
| phone | string | Phone number or email (for Email channel) |
| channel | string | SMS, Email, Push, WhatsApp |
| type | string | Announcement, Attendance, etc. |
| message | string | Message preview |
| status | string | Delivered, Failed, Pending, Bounced |
| sentAt | string | ISO timestamp when sent |
| deliveredAt | string | ISO timestamp when delivered (null if not) |
| retries | number | Number of retry attempts (if failed) |

### 1.2 Retry Failed Delivery

POST /api/notifications/delivery-logs/{id}/retry

Response

{
  "success": true,
  "newStatus": "Delivered",
  "deliveredAt": "2026-05-30T08:05:00Z"
}

### 1.3 Refresh (Optional)

GET /api/notifications/delivery-logs/refresh – returns latest logs.

## 2. Data Requirements (Input from User)

Filters: Channel (All/SMS/Email/Push/WhatsApp), Status (All/Delivered/Failed/Pending/Bounced), Type (All/Announcement/Attendance/etc.)
Search – recipient name, phone, or message
Actions: Retry button for failed deliveries

## 3. Data Displayed on UI

### Stat Cards

| **Card Label** | **Source Field** |
| --- | --- |
| Total Sent | stats.totalSent |
| Delivered | stats.delivered |
| Failed | stats.failed |
| Delivery Rate | stats.deliveryRate |

### Table Columns

| **Column** | **Display** |
| --- | --- |
| Sent | Relative time (e.g., "10m ago") |
| Recipient | Name + phone/email |
| Message | Truncated text |
| Channel | Badge with icon (SMS, Email, Push, WhatsApp) |
| Type | Plain text badge |
| Status | Badge with dot + status text; retries count shown |
| Delivery Time | Time taken (e.g., "2.3s") or "—" |
| Actions | Retry button (only for Failed) |

### Pagination

Client‑side pagination with page size 15.

## 4. Notes for Backend

- sentAt and deliveredAt are ISO timestamps. Frontend uses relative formatting (e.g., "10m ago").
- deliveryTime is computed client‑side as deliveredAt - sentAt.
- retries – show as "1 retry" or "2 retries" in UI.
- Channel icons: SMS → Smartphone, Email → Mail, Push → Bell, WhatsApp → MessageSquare.
- For email deliveries, phone field may store email address – frontend still displays it.

# Messages – Frontend Documentation

## Page Overview

Direct messaging between school staff and parents. Displays conversation threads, real‑time (mock) unread counts, and allows sending/receiving messages.

## 1. API Endpoints Required

### 1.1 Fetch Conversation Threads

**GET **/api/messages/threads

#### Response (200 OK)

{
  "data": [
    {
      "id": "t1",
      "name": "Mrs. Priya Sharma",
      "role": "Parent",
      "student": "Aarav Sharma (Cls 9-A)",
      "avatar": "PS",
      "color": "bg-blue-500",
      "unread": 2,
      "lastMessage": "Thank you for the update on his attendance.",
      "lastAt": "2026-05-30T10:32:00Z",
      "online": true
    }
  ],
  "totalUnread": 6
}

#### Response Fields – Thread

| **Field** | **Type** | **Description** |
| --- | --- | --- |
| id | string | Unique thread ID |
| name | string | Parent/recipient full name |
| role | string | Parent, Teacher, Staff |
| student | string | Student name and class (for parents) |
| avatar | string | Initials (2–3 chars) for avatar display |
| color | string | Tailwind bg color class (e.g., bg-blue-500) |
| unread | number | Number of unread messages from recipient |
| lastMessage | string | Preview of last message |
| lastAt | string | ISO timestamp of last message |
| online | boolean | Whether recipient is currently online |

### 1.2 Fetch Messages for a Thread

GET /api/messages/threads/{threadId}/messages

#### Query Parameters (optional)

| **Parameter** | **Type** | **Description** |
| --- | --- | --- |
| before | string | Timestamp for pagination (older) |
| limit | number | Max messages (default 50) |

Response

{
  "data": [
    {
      "id": "m1",
      "from": "them",
      "text": "Good morning. I wanted to ask about attendance.",
      "time": "2026-05-30T10:20:00Z",
      "read": true
    }
  ]
}

### 1.3 Send a Message

POST /api/messages/threads/{threadId}/messages

Request Body

{
  "text": "Your message here"
}

Response (201)

{
  "success": true,
  "message": { /* full message object */ }
}

### 1.4 Mark Messages as Read

POST /api/messages/threads/{threadId}/read

Marks all messages in thread as read (when user opens a thread).

## 2. Data Requirements (Input from User)

Search – filters thread list by name or student name
Send message – text input, send button, Enter key
Attachment – button exists but not implemented in mock; can be extended

## 3. Data Fetched from Backend

- List of conversation threads (including unread counts)
- Messages for the active thread (including timestamps, read status)
- Total unread count (shown in header)

## 4. Data Displayed on UI

Header
Title, description, and total unread badge

Thread List (left panel)
Each thread shows:
- Avatar (initials + background color)
- Name, role, student (if parent)
- Last message preview
- Timestamp (relative)
- Unread count badge
- Online indicator dot

Chat Area (right panel)
Header: recipient avatar, name, role, student, online status
Message bubbles:
- Sent by me → right aligned, blue background, with double‑check mark if read
- Sent by them → left aligned, white background
Timestamp shown below each message
Input area: text field, attachment button, send button

Auto‑scroll
New messages scroll into view.

## 5. Notes for Backend

- color field can be omitted – frontend can generate deterministic colors from name. The mock uses static colors.
- online status could be provided via WebSocket for real‑time updates.
- Unread count should decrement when POST /read is called.
- Messages from "me" (the current user) should have read: true automatically.
- Timestamps (time) should be ISO format for proper sorting and relative formatting.
- For pagination, the frontend currently loads all messages for a thread; consider adding limit/before for large threads.
- Attachments (Paperclip icon) are not implemented; if needed, add POST /messages/threads/{id}/attachments endpoint.

You can now copy each markdown block into separate .md files. Let me know when you’re ready for the next set of files (e.g., students, teachers, parents, etc.).