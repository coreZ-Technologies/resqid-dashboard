Notifications – Frontend Documentation

# Page Overview

Manage and send notifications to parents/guardians. Supports multiple channels (Email, SMS, Push, WhatsApp), recipient types (all parents, specific class/section, individuals), scheduling, priority levels, and tracking delivery/read statistics.

---

# 1. API Endpoints Required

## 1.1 Fetch Notifications (List)

**GET **/api/notifications

Returns paginated list of sent/scheduled notifications with delivery metrics.

### Query Parameters (optional)

| **Parameter** | **Type** | **Description** |
| --- | --- | --- |
| search | string | Search by title or message content |
| type | string | ANNOUNCEMENT, EMERGENCY, REMINDER, EVENT, ATTENDANCE, GENERAL |
| status | string | sent, delivered, read, failed |
| startDate | string | ISO date (YYYY-MM-DD) |
| endDate | string | ISO date (YYYY-MM-DD) |
| page | number | Page number |
| limit | number | Items per page (default 10) |

### Response (200 OK)

{
  "data": [
    {
      "id": "notif_1",
      "title": "School Closed Tomorrow Due to Heavy Rain",
      "message": "This is a detailed message for notification...",
      "type": "ANNOUNCEMENT",
      "channel": "email",
      "recipients": { "total": 847, "sent": 847, "delivered": 812, "read": 598, "failed": 35 },
      "status": "delivered",
      "sentBy": "Admin User",
      "sentAt": "2026-05-30T08:00:00Z",
      "scheduledFor": null,
      "priority": "normal",
      "attachments": []
    }
  ],
  "pagination": { "page": 1, "limit": 10, "total": 50, "totalPages": 5 },
  "stats": { "totalSent": 42350, "totalDelivered": 39800, "totalRead": 28750, "avgOpenRate": 72.2 }
}

### Notification Fields

| **Field** | **Type** | **Description** |
| --- | --- | --- |
| id | string | Unique notification ID |
| title | string | Notification title |
| message | string | Full message body |
| type | string | One of ANNOUNCEMENT, EMERGENCY, REMINDER, EVENT, ATTENDANCE, GENERAL |
| channel | string | Primary channel: email, sms, push, whatsapp |
| recipients | object | Delivery metrics (total, sent, delivered, read, failed) |
| status | string | sent, delivered, read, failed |
| sentBy | string | Name of user who sent/scheduled |
| sentAt | string | ISO timestamp when sent (or scheduled for future) |
| scheduledFor | string/null | If scheduled, future ISO timestamp |
| priority | string | normal or high |
| attachments | array[string] | List of attachment file names/URLs |

## 1.2 Send a New Notification

**POST **/api/notifications/send

## 1.3 Resend a Failed Notification

**POST **/api/notifications/{id}/resend

## 1.4 Delete a Notification

**DELETE **/api/notifications/{id}

## 1.5 Get Recipient Count (Preview)

**GET **/api/notifications/recipient-count

## 1.6 Get Delivery Details for a Specific Notification (Optional)

**GET **/api/notifications/{id}/delivery

# 2. Data Requirements (Input from User)

Send Notification Modal – Step 1 (Content): Type, Title, Message, Priority

Step 2 (Recipients & Channels): Recipient type, Class/Section dropdowns, Channels, Schedule later toggle

Step 3 (Review & Send): Preview, Summary, Send button

Filters: Search, Type dropdown, Status dropdown, Date range

Actions on Card: View Details, Resend, Delete

# 3. Data Fetched from Backend

List of notifications (with pagination)

Statistics for stat cards: totalSent, totalDelivered, totalRead, avgOpenRate

Recipient count preview (when building a new notification)

# 4. Data Displayed on UI

Stat Cards: Total Sent, Delivered, Read, Open Rate %

Notification Cards: Type icon, Title, Status badge, Channel badge, Priority, Message preview, Recipient counts, Delivery rate bar, Footer, Action buttons

Notification Details Modal: Title, timestamp, sender, Full message, Delivery statistics

Filters Bar: Search input, Type dropdown, Status dropdown, Date range, Clear filters button

Pagination and Empty/Loading States

# 5. Summary of Data Flow

Page loads: Frontend → GET /api/notifications → renders UI.
User applies filters: updates URL params / refetches.
User clicks "Send": Opens modal → POST /api/notifications/send.
User clicks "Resend": POST /api/notifications/{id}/resend.
User clicks "Delete": DELETE /api/notifications/{id}.

# 6. Notes for Backend

Channels: Support multiple channels, API should accept channels array.

Recipient counts: Compute distinct matching parents.

Scheduling: Store status='scheduled', use a background job.

Delivery tracking: Update recipients metrics via webhooks/receipts.

Priority: Handle high priority correctly.

Rate limits: Enforce per-school limits.

# 7. Additional Endpoints (Optional)

| **Endpoint** | **Method** | **Description** |
| --- | --- | --- |
| /api/notifications/types | GET | Return available notification types |
| /api/notifications/channels | GET | Return enabled channels |
| /api/notifications/bulk-delete | POST | Delete multiple notifications |
| /api/notifications/{id}/attachments | POST | Upload attachment |
| /api/notifications/stats | GET | Get summary stats |