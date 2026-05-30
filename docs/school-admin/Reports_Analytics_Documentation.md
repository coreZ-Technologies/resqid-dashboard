Reports & Analytics – Frontend Documentation

# Page Overview

Dashboard for school analytics showing attendance trends, student demographics, class-wise performance, enrollment trends, and high absenteeism alerts. Supports date range filtering, tab switching (Overview / Attendance / Students / Teachers), and quick report exports.

---

# 1. API Endpoints Required

## 1.1 Fetch Report Data (Overview)

**GET **/api/reports/overview

Returns all data needed for the Overview tab, including KPIs, charts, and the absenteeism table.

### Query Parameters (optional)

| **Parameter** | **Type** | **Description** |
| --- | --- | --- |
| dateRange | string | this_week, this_month, this_term, this_year |
| academicYear | string | e.g., 2024-2025 (default current) |

### Response (200 OK)

{
  "kpis": { "totalStudents": 614, "studentChange": "+5.2%", "totalTeachers": 42, "teacherChange": "+2", "avgAttendance": 91.4, "attendanceChange": "+1.2%", "atRiskStudents": 23, "riskChange": "+3" },
  "attendanceMonthly": [ { "month": "Aug", "present": 92, "absent": 8 }, { "month": "Sep", "present": 88, "absent": 12 } ],
  "genderDistribution": [ { "name": "Male", "value": 312 }, { "name": "Female", "value": 288 }, { "name": "Other", "value": 14 } ],
  "classAttendance": [ { "class": "Class 1", "rate": 94 }, { "class": "Class 2", "rate": 88 } ],
  "enrollmentTrend": [ { "year": "2020", "students": 480 }, { "year": "2021", "students": 512 } ],
  "topAbsentStudents": [ { "name": "Riya Sharma", "class": "Class 5A", "absences": 18, "trend": "up" } ]
}

### Response Fields – Overview

| **Field** | **Type** | **Description** |
| --- | --- | --- |
| kpis.totalStudents | number | Total enrolled students |
| kpis.studentChange | string | Percentage or absolute change |
| kpis.totalTeachers | number | Total active teachers |
| kpis.teacherChange | string | Change (e.g., +2 new) |
| kpis.avgAttendance | number | Average attendance rate (%) |
| kpis.attendanceChange | string | Change compared to previous period |
| kpis.atRiskStudents | number | Students with attendance < 85% or other risk |
| kpis.riskChange | string | Change in at-risk count |
| attendanceMonthly | array[object] | Last 8 months of attendance |
| genderDistribution | array[object] | Count of students by gender |
| classAttendance | array[object] | Attendance rate per class |
| enrollmentTrend | array[object] | Year-over-year total student count |
| topAbsentStudents | array[object] | Students with highest absences |

## 1.2 Fetch Attendance Tab Data

**GET **/api/reports/attendance

(Similar to overview but focused on attendance-specific metrics and charts)

## 1.3 Fetch Students Tab Data

**GET **/api/reports/students

## 1.4 Fetch Teachers Tab Data

**GET **/api/reports/teachers

## 1.5 Export Reports

**GET **/api/reports/export

Exports the current report view in PDF format.

### Query Parameters

| **Parameter** | **Type** | **Description** |
| --- | --- | --- |
| type | string | attendance, students, teachers, academic |
| dateRange | string | Same as above |
| format | string | pdf |

## 1.6 Quick Exports

GET /api/reports/export/attendance → downloads attendance report

GET /api/reports/export/students → downloads student list

GET /api/reports/export/teachers → downloads teacher summary

GET /api/reports/export/academic → downloads academic report

# 2. Data Requirements (Input from User)

Date range – dropdown (This Week / This Month / This Term / This Year)

Tabs – Overview (active), Attendance, Students, Teachers

Export PDF – top-right button

Quick export buttons – below the table

# 3. Data Fetched from Backend

For Overview tab: KPIs, monthly attendance, gender pie chart, class-wise attendance, enrollment trend, top absent students.

# 4. Data Displayed on UI

## KPI Cards

| **Card Label** | **Source Field** | **Display** |
| --- | --- | --- |
| Total Students | kpis.totalStudents | Value + change badge |
| Total Teachers | kpis.totalTeachers | Value + change badge |
| Avg. Attendance | kpis.avgAttendance | Percentage + change badge |
| At-Risk Students | kpis.atRiskStudents | Count + change badge (red if up) |

Monthly Attendance Trend (Bar Chart): X-axis month, Y-axis percentage

Student Demographics (Pie Chart): Gender distribution

Class-wise Attendance (Horizontal Bar Chart): colored bars based on thresholds

Enrollment Trend (Line Chart): Year-over-year

High Absenteeism Table: Student, Class, Total Absences, Trend

Quick Exports Row: 4 buttons for specific reports

# 5. Summary of Data Flow

Page loads: Frontend → GET /api/reports/overview?dateRange=this_month → renders charts
User changes date range: Refetch with new dateRange
User switches tab: GET /api/reports/{tab}?dateRange=...
User clicks Export PDF: GET /api/reports/export
User clicks Quick Export: GET /api/reports/export/{type}?format=pdf

# 6. Notes for Backend

Date range handling: this_week, this_month, this_term, this_year

KPIs changes should be relative to previous period

Attendance monthly expects 8 months of data

Tabs: prepare endpoints for Attendance, Students, Teachers

Caching: implement caching with short TTL for performance