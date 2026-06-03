Emergency Contacts – Frontend Documentation

# Page Overview

Manage and verify student emergency contacts. Displays a list of students with contact completeness, medical alerts, blood group, and contact details (parents, doctor, etc.). Supports filtering by class, status (All/Complete/Missing/Medical Alert), and search. Allows expanding each card to view/add/edit contacts.

---

# 1. API Endpoints Required

## 1.1 Fetch All Students with Emergency Contacts

**GET **/api/emergency-contacts/students

Returns a paginated list of students enriched with contact information, medical alerts, and verification status.

### Query Parameters (optional)

| **Parameter** | **Type** | **Description** |
| --- | --- | --- |
| search | string | Search by student name, roll number, or contact name |
| class | string | Filter by class (e.g., Class 8, Class 10) |
| status | string | All, Complete, Missing, Medical Alert |
| page | number | Page number |
| limit | number | Items per page |

### Response (200 OK)

{
  "data": [
    {
      "id": "STU-001",
      "studentName": "Priya Sharma",
      "studentClass": "Class 8-A",
      "rollNo": "08A-12",
      "avatar": "PS",
      "avatarColor": "bg-blue-500",
      "bloodGroup": "B+",
      "medicalAlert": "Asthma — carries inhaler",
      "contacts": [
        {
          "name": "Rajan Sharma",
          "relation": "Father",
          "phone": "+91 98301 11234",
          "email": "rajan.s@gmail.com",
          "primary": true,
          "verified": true
        }
      ],
      "address": "14B, Salt Lake, Kolkata - 700091"
    }
  ],
  "stats": {
    "studentsWithContacts": 318,
    "totalStudents": 342,
    "missingContacts": 24,
    "medicalAlerts": 11,
    "verifiedNumbers": 601
  }
}

### Response Fields – Student Emergency Contact Record

| **Field** | **Type** | **Description** |
| --- | --- | --- |
| id | string | Student ID |
| studentName | string | Full name |
| studentClass | string | e.g., Class 8-A |
| rollNo | string | Roll number (e.g., 08A-12) |
| avatar | string | Initials (2–3 chars) for avatar |
| avatarColor | string | Tailwind CSS background class |
| bloodGroup | string | One of A+, A-, B+, B-, O+, O-, AB+, AB- |
| medicalAlert | string/null | Medical condition / alert |
| contacts | array[object] | List of emergency contacts |
| address | string/null | Home address |

### Contact Object Structure

| **Field** | **Type** | **Description** |
| --- | --- | --- |
| name | string | Full name of contact |
| relation | string | Father, Mother, Guardian, Doctor |
| phone | string | Phone number with country code |
| email | string | Email address (optional) |
| primary | boolean | If true, primary contact (highlighted) |
| verified | boolean | Whether contact details are verified |

## 1.2 Add / Edit Contact for a Student

**POST **/api/emergency-contacts/students/{studentId}/contacts

## 1.3 Update Contact

**PUT **/api/emergency-contacts/contacts/{contactId}

## 1.4 Delete Contact

**DELETE **/api/emergency-contacts/contacts/{contactId}

## 1.5 Mark Contact as Verified

**PATCH **/api/emergency-contacts/contacts/{contactId}/verify

## 1.6 Bulk Export

**GET **/api/emergency-contacts/export?format=csv

Returns CSV with all students and their contacts (respects filters).

# 2. Data Requirements (Input from User)

Search – free text (student name, roll number, contact name)

Class filter – dropdown (All Classes, Class 5–12)

Status filter – tabs: All, Complete, Missing, Medical Alert

Expand/collapse card – click on student card to see full contact list

Add Contact – button on cards with missing contacts (opens modal)

Edit Contacts – button on expanded card (opens modal)

View Profile – link to student profile page

Call – click phone icon or phone number to open dialer (tel:)

# 3. Data Fetched from Backend

List of students (with contacts and medical alerts)

Statistics for the four stat cards: studentsWithContacts, totalStudents, missingContacts, medicalAlerts, verifiedNumbers

# 4. Data Displayed on UI

Stat Cards

Student Cards (collapsed): Avatar, name, class, roll number, Blood group badge, Status indicator, Medical alert banner

Expanded Card: Full list of contacts, Call button, Address, Action buttons, Alert Banner for missing contacts

# 5. Summary of Data Flow

Page loads: Frontend → GET /api/emergency-contacts/students → Backend returns { data, stats, pagination }
User searches / filters: frontend filters client-side.
User clicks a student card: toggles expanded view.
User clicks “Add Contact” / “Edit Contacts”: opens modal → POST/PUT to backend.
User clicks phone number: client side tel: link.

# 6. Notes for Backend

avatarColor can be generated from student name.

verified flag: initially false; school staff can mark as verified.

bloodGroup must be one of the predefined 8 values.

The “Complete” status means contacts.length > 0.

The “Missing” status means contacts.length === 0.

# 7. Additional Endpoints (Optional)

| **Endpoint** | **Method** | **Description** |
| --- | --- | --- |
| /api/emergency-contacts/students/{studentId} | GET | Fetch single student with full contacts |
| /api/emergency-contacts/import | POST | Import contacts from CSV/Excel |
| /api/emergency-contacts/verify-bulk | POST | Verify multiple contacts at once |

API Documentation Page – Frontend Documentation

# Page Overview

Displays static API reference documentation for developers. Lists available endpoints with their methods, paths, descriptions, authentication requirements, request/response examples, and rate limits. This page does not fetch data from a backend; it is a static help/documentation page.