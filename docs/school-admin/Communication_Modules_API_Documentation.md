Communication Modules – API Documentation

# 1. Announcements – Frontend Documentation

## Page Overview

Create, edit, pin, and manage school‑wide announcements for students, parents, and teachers. Supports categories (General, Academic, Event, Holiday, Urgent) and statuses (Published, Draft, Scheduled).

## 1. API Endpoints Required

### 1.1 Fetch Announcements

GET /api/announcements

| **Parameter** | **Type** | **Description** |
| --- | --- | --- |
| category | string | General, Academic, Event, Holiday, Urgent |
| status | string | Published, Draft, Scheduled |
| search | string | Search in title or body |
| schoolId | string | Filter by school (multi‑school) |

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
      "publishedAt": "2026-05-28T00:00:00Z"
    }
  ],
  "stats": {
    "total": 12,
    "published": 7,
    "pinned": 2,
    "totalViews": 8450
  }
}

### 1.2 Create Announcement

POST /api/announcements

### 1.3 Update Announcement

PUT /api/announcements/{id}

### 1.4 Delete Announcement

DELETE /api/announcements/{id}

### 1.5 Increment View Count

POST /api/announcements/{id}/view

## 2. Data Displayed on UI

| **Card Label** | **Source Field** |
| --- | --- |
| Total | stats.total |
| Published | stats.published |
| Pinned | stats.pinned |
| Total Views | stats.totalViews |

Announcement Cards show: Pinned indicator, Title, status badge, Body (truncated), Category, audience, Published date, view count, Edit/Delete actions.

# 2. Delivery Log – Frontend Documentation

## Page Overview

Tracks delivery status of notifications sent via SMS, Email, Push, and WhatsApp. Shows statistics, filters by channel/status/type, and allows retrying failed deliveries.

## 1. API Endpoints Required

### 1.1 Fetch Delivery Logs

GET /api/notifications/delivery-logs

| **Parameter** | **Type** | **Description** |
| --- | --- | --- |
| channel | string | SMS, Email, Push, WhatsApp |
| status | string | Delivered, Failed, Pending, Bounced |
| type | string | Announcement, Attendance, Fee Reminder, Emergency, General |
| search | string | Search in recipient name, phone, or message |

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
  "stats": {
    "totalSent": 40,
    "delivered": 32,
    "failed": 5,
    "pending": 3,
    "deliveryRate": 80
  }
}

### 1.2 Retry Failed Delivery

POST /api/notifications/delivery-logs/{id}/retry

### 1.3 Refresh

GET /api/notifications/delivery-logs/refresh

## 2. Data Displayed on UI

| **Card Label** | **Source Field** |
| --- | --- |
| Total Sent | stats.totalSent |
| Delivered | stats.delivered |
| Failed | stats.failed |
| Delivery Rate | stats.deliveryRate |

# 3. Messages – Frontend Documentation

## Page Overview

Direct messaging between school staff and parents. Displays conversation threads, real‑time (mock) unread counts, and allows sending/receiving messages.

## 1. API Endpoints Required

### 1.1 Fetch Conversation Threads

GET /api/messages/threads

{
  "data": [
    {
      "id": "t1",
      "name": "Mrs. Priya Sharma",
      "role": "Parent",
      "student": "Aarav Sharma (Cls 9-A)",
      "unread": 2,
      "lastMessage": "Thank you for the update on his attendance.",
      "lastAt": "2026-05-30T10:32:00Z",
      "online": true
    }
  ],
  "totalUnread": 6
}

### 1.2 Fetch Messages for a Thread

GET /api/messages/threads/{threadId}/messages

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

### 1.4 Mark Messages as Read

POST /api/messages/threads/{threadId}/read