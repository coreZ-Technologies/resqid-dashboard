# Classes – Frontend Documentation

## Page Overview

Manages school classes (grades and sections). Displays class cards with grade group, class teacher, subjects, student count, and room number. Supports adding, editing, deleting classes, filtering by grade group (Primary/Middle/Secondary/Senior) and status (Active/Inactive).

## 1. API Endpoints Required

### 1.1 Fetch All Classes

GET /api/classes

#### Query Parameters (all optional)

| **Parameter** | **Type** | **Description** |
| --- | --- | --- |
| gradeGroup | string | Primary, Middle, Secondary, Senior |
| status | string | Active, Inactive |
| search | string | Search by grade, section, class teacher |
| schoolId | string | (if multi‑school) Filter by school |

#### Response (200 OK)

{
  "data": [
    {
      "id": "c1",
      "grade": "Cls 1",
      "section": "A",
      "classTeacher": "Mrs. Kavita Reddy",
      "students": 35,
      "subjects": ["English", "Hindi", "Maths", "EVS", "Arts"],
      "room": "R-10",
      "status": "Active",
      "gradeGroup": "Primary"
    }
  ],
  "stats": {
    "totalClasses": 19,
    "totalStudents": 620,
    "activeClasses": 18,
    "gradeGroupsCount": 4
  }
}

#### Response Fields – Class Object

| **Field** | **Type** | **Description** |
| --- | --- | --- |
| id | string | Unique class identifier |
| grade | string | Grade name: Nursery, LKG, UKG, Cls 1...Cls 12 |
| section | string | Section letter: A, B, C, D, E |
| classTeacher | string | Full name of assigned class teacher |
| students | number | Number of enrolled students |
| subjects | array[string] | List of subjects taught in this class |
| room | string | Room number/location (e.g., R-10) |
| status | string | Active or Inactive |
| gradeGroup | string | Derived: Primary, Middle, Secondary, Senior |

### 1.2 Create a New Class

POST /api/classes

#### Request Body

{
  "grade": "Cls 3",
  "section": "B",
  "classTeacher": "Ms. Anjali Mehta",
  "room": "R-15"
}

grade and section are required.
classTeacher and room are optional but recommended.
New class defaults to status: "Active", students: 0, subjects: [].

#### Response (201)

{
  "success": true,
  "class": { /* full class object with generated id */ }
}

### 1.3 Update a Class

PUT /api/classes/{id}

#### Request Body (partial update allowed)

{
  "classTeacher": "Mrs. Neha Singh",
  "room": "R-16",
  "status": "Inactive"
}

#### Response

{
  "success": true,
  "class": { /* updated class */ }
}

### 1.4 Delete a Class

DELETE /api/classes/{id}

#### Response

{
  "success": true,
  "message": "Class deleted"
}

### 1.5 Export Classes List

GET /api/classes/export?format=csv

Returns CSV file with all classes (respecting filters).

## 2. Data Requirements (Input from User)

Add/Edit Class (Modal):
- Grade (dropdown) – required
- Section (button group A–E) – required
- Class Teacher (text input) – optional
- Room Number (text input) – optional
Filters:
- Search text (grade, section, teacher)
- Grade group tabs (All, Primary, Middle, Secondary, Senior)
- Status pills (All, Active, Inactive)
Actions:
- Edit (pencil icon) – opens modal with current values
- Delete (trash icon) – removes class

## 3. Data Fetched from Backend

List of classes (full objects as above)

Statistics for the four stat cards:
- totalClasses – total number of class sections
- totalStudents – sum of students across all classes
- activeClasses – count of classes with status = "Active"
- gradeGroupsCount – number of distinct grade groups (usually 4)

## 4. Data Displayed on UI

### Stats Cards

| **Card Label** | **Source Field** |
| --- | --- |
| Total Classes | stats.totalClasses |
| Total Students | stats.totalStudents |
| Active Classes | stats.activeClasses |
| Grade Groups | stats.gradeGroupsCount (fixed at 4) |

### Class Cards (grid)

Each card shows:
- Grade abbreviation + section inside coloured circle (e.g., 1A)
- Grade group badge (Primary/Middle/Secondary/Senior)
- Status pill (Active/Inactive) with dot
- Class teacher name
- Subjects (first 4, with "+X more" if >4)
- Number of students
- Room number (if exists)
- Edit & Delete buttons

### Empty State

Message prompting to adjust filters or add a new class.

## 5. Summary of Data Flow

Page loads:
  Frontend → GET /api/classes
  Backend → returns { data, stats }
  Frontend → renders stat cards and class cards
User searches or applies filters:
  → Frontend filters client‑side
User clicks "Add Class":
  → Opens modal → collects grade, section, teacher, room
  → POST /api/classes
  → Backend creates class, returns new object
  → Frontend adds to local list
User clicks "Edit" on a card:
  → Opens modal pre‑filled with current values
  → PUT /api/classes/{id}
  → Backend updates, returns updated object
  → Frontend updates local list
User clicks "Delete":
  → DELETE /api/classes/{id}
  → Backend deletes (or soft‑deletes)
  → Frontend removes from list

## 6. Notes for Backend

grade values must match the predefined list: Nursery, LKG, UKG, Cls 1, Cls 2, … Cls 12. The frontend uses this exact string set.

gradeGroup is derived from grade using the mapping in the frontend. Backend can either store it or compute it on‑the‑fly. Frontend uses GRADE_GROUP_MAP to display group badge – you can send gradeGroup in the response to avoid client‑side mapping.

students count should be updated automatically when student enrollment changes (or computed via a separate enrollment table). For MVP, it can be a static field that gets recalculated periodically.

subjects list – the UI currently shows mock subjects; actual data should come from the class‑subject mapping in the backend. Provide a subjects array in the response.

Deletion should be either hard delete (remove class) or soft delete (set status to Inactive). The frontend allows deleting any class – consider implications for timetable, attendance, etc.

When adding a new class, students defaults to 0; subjects defaults to empty array.

For multi‑school setups, all endpoints must filter by school_id from the authenticated user.

## 7. Additional Endpoints (Optional)

| **Endpoint** | **Method** | **Description** |
| --- | --- | --- |
| /api/classes/{id}/subjects | PUT | Update the list of subjects for a class |
| /api/classes/{id}/teachers | GET | Fetch all teachers assigned to this class (for drop down) |
| /api/classes/bulk | POST | Create multiple classes at once (grade + section list) |
| /api/classes/grade-groups | GET | Return possible grade groups and their grade lists (for frontend config) |