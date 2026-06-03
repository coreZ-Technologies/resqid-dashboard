Emergency Module – Frontend Documentation

# Page Overview

Emergency management for students – displays medical profiles, emergency contacts, high-risk indicators, and incident logging. Allows staff to quickly find a student, view health records, contact parents/doctors, broadcast alerts, and log incidents.

---

# 1. API Endpoints Required

## 1.1 Fetch All Students (Emergency Data)

**GET **/api/emergency/students

Returns a list of all students with emergency-relevant fields (medical, contacts, risk flags). Supports filtering.

### Query Parameters (optional)

| **Parameter** | **Type** | **Description** |
| --- | --- | --- |
| search | string | Name, student ID, class, or scan code |
| class | string | Filter by class (e.g., 9A) |
| risk | string | high or low |
| page | number | Page number (if paginated) |

### Response (200 OK)

{
  "data": [
    {
      "id": "RQ-0001-00000001",
      "studentId": "STU0001",
      "name": "Arjun Sharma",
      "class": "9A",
      "rollNo": "12",
      "dob": "2010-05-15",
      "bloodGroup": "O+",
      "photo": null,
      "medicalConditions": ["Asthma"],
      "allergies": ["Penicillin"],
      "medications": ["Prescribed medication on file"],
      "doctorName": "Dr. Ramesh Iyer",
      "doctorPhone": "+91 9876543210",
      "parents": [
        { "relation": "Father", "name": "Sharma Sr.", "phone": "+91 9876543211", "isReachable": true },
        { "relation": "Mother", "name": "Sunita Sharma", "phone": "+91 9876543212", "isReachable": false }
      ],
      "emergencyContacts": [
        { "relation": "Uncle", "name": "Suresh Sharma", "phone": "+91 9876543213" }
      ],
      "address": "Flat 42, Block A, Green Park, City - 400001",
      "insuranceNo": "INS000001",
      "notes": "Student has Asthma. Keep inhaler accessible.",
      "hasHighRisk": true,
      "lastScanned": "2026-05-30T08:15:00Z"
    }
  ],
  "stats": {
    "totalStudents": 48,
    "highRiskCount": 12,
    "incidentsToday": 0,
    "resolvedIncidents": 3
  }
}

### Response Fields – Student Emergency Record

| **Field** | **Type** | **Description** |
| --- | --- | --- |
| id | string | Unique QR/token ID |
| studentId | string | Internal student ID |
| name | string | Full name |
| class | string | e.g., 9A, 7B |
| bloodGroup | string | One of A+, A-, B+, B-, O+, O-, AB+, AB- |
| medicalConditions | array[string] | List of conditions (e.g., Asthma, Diabetes) |
| allergies | array[string] | List of allergens (e.g., Penicillin, Peanuts) |
| parents | array[object] | Parent/guardian contacts |
| emergencyContacts | array[object] | Additional emergency contacts |
| hasHighRisk | boolean | If true, student has conditions or allergies |

## 1.2 Fetch Recent Incidents

**GET **/api/emergency/incidents

Returns incident history (can also be filtered by studentId).

## 1.3 Log an Incident

**POST **/api/emergency/incidents

## 1.4 Send Emergency Broadcast

**POST **/api/emergency/broadcast

Send SMS/alert to all contacts of a student (or bulk).

## 1.5 Call / SMS Actions (Client-side)

The frontend uses tel: links and SMS simulation; no direct backend call needed for those UI actions (but you can optionally log call attempts).

## 1.6 Get High-Risk Summary (Stats)

**GET **/api/emergency/stats

# 2. Data Requirements (Input from User)

Search panel: Search query, Class filter, Risk filter

Emergency profile: Click student from left list

Actions: Alert All, Call Parents, Call Ambulance, Log Incident, Send SMS, Copy ID

Log Incident modal: Incident type, Severity, Description, Action taken

# 3. Data Fetched from Backend

Full student list (with emergency fields, medical conditions, contacts, risk flag)

Incident history (for the selected student or recent incidents)

Stats (total students, high-risk count, incidents today, resolved)

# 4. Data Displayed on UI

Stats Bar: Total Students, High Risk, Incidents Today, Resolved

Left Panel: Student Search input and student list

Centre Panel: Emergency Profile (Overview Tab, Contacts Tab, Medical Tab, Incidents Tab)

Right Panel: Recent Incidents & Emergency Numbers

Log Incident Modal: Form with type, severity, description, action taken

# 5. Summary of Data Flow

Page loads:
  Frontend → GET /api/emergency/stats and /api/emergency/students
  → Display stats bar, student list

User searches/filters:
  → frontend filters locally (or via API search param)

User clicks a student:
  → frontend shows profile (data already in memory)
  → optionally fetch incidents for that student

User clicks “Alert All”:
  → POST /api/emergency/broadcast
  → backend sends SMS/WhatsApp to all contacts

User logs an incident:
  → opens modal → POST /api/emergency/incidents
  → backend stores incident, returns success

# 6. Notes for Backend

hasHighRisk should be derived from medicalConditions.length > 0 or allergies.length > 0.

bloodGroup – must be one of the 8 valid values.

lastScanned – should be updated whenever student scans a QR code.

Incident time – ISO timestamp; frontend displays relative.

Broadcast – implement actual SMS/WhatsApp integration (e.g., Twilio).

Phone numbers – store with country code (e.g., +91 9876543210).

# 7. Additional Endpoints (Optional)

| **Endpoint** | **Method** | **Description** |
| --- | --- | --- |
| /api/emergency/students/{studentId}/qr | GET | Return QR code image for student ID |
| /api/emergency/scan | POST | Receive QR scan payload → return student emergency profile |
| /api/emergency/incidents/{id}/resolve | PATCH | Mark an incident as resolved |