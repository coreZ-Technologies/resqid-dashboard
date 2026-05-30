# QR Management – Frontend Documentation

## Page Overview

Allows school administrators to generate, download, print, and regenerate QR codes for student ID cards. Displays a list of tokens (assigned to students) with statuses (Active, Unassigned, Issued, Inactive, Revoked, Expired) and a preview panel for the selected token.

## 1. API Endpoints Required

### 1.1 Fetch Tokens (Students with QR Tokens)

GET /api/tokens

Returns all tokens belonging to the current school, with optional search.

#### Query Parameters (all optional)

| **Parameter** | **Type** | **Description** |
| --- | --- | --- |
| search | string | Search by student name, class, or token hash |
| status | string | Filter by token status (ACTIVE, UNASSIGNED, etc.) |
| page | number | Page number |
| limit | number | Items per page |

#### Response (200 OK)

{
  "data": [
    {
      "id": "tok_1",
      "token_hash": "QRABCD1234EFGH5678",
      "status": "ACTIVE",
      "student_id": "stu_1",
      "student_name": "Aarav Sharma",
      "student_class": "10A",
      "student_section": "A",
      "school_id": "sch_001",
      "expires_at": "2026-12-31T23:59:59Z",
      "created_at": "2026-01-15T10:00:00Z",
      "qr_asset": {
        "id": "qr_1",
        "format": "PNG",
        "width_px": 512,
        "height_px": 512,
        "file_size_kb": 45,
        "public_url": "https://storage.example.com/qr/abc123.png",
        "generated_at": "2026-05-20T08:30:00Z"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 20,
    "totalPages": 1
  },
  "stats": {
    "totalStudentsWithTokens": 20,
    "qrGenerated": 18,
    "activeTokens": 15
  }
}

#### Token Status Values

ACTIVE – QR is usable and not expired
UNASSIGNED – Token exists but not linked to a student
ISSUED – Token assigned but QR not yet generated
INACTIVE – Disabled by admin
REVOKED – Cancelled (e.g., student left)
EXPIRED – Past expiration date

#### QR Asset Fields (if generated)

| **Field** | **Type** | **Description** |
| --- | --- | --- |
| id | string | Unique QR asset ID |
| format | string | PNG, SVG, PDF |
| width_px | number | Width in pixels |
| height_px | number | Height in pixels |
| file_size_kb | number | File size in kilobytes |
| public_url | string | Publicly accessible URL of the QR image |
| generated_at | string | ISO timestamp when QR was generated |

### 1.2 Generate QR Code for a Token

POST /api/tokens/{tokenId}/generate-qr

#### Request Body

{
  "format": "PNG",      // "PNG", "SVG", "PDF"
  "width": 512,
  "height": 512
}

#### Response (200 OK)

{
  "success": true,
  "qr_asset": {
    "id": "qr_123",
    "format": "PNG",
    "width_px": 512,
    "height_px": 512,
    "file_size_kb": 48,
    "public_url": "https://storage.example.com/qr/new123.png",
    "generated_at": "2026-05-30T12:00:00Z"
  }
}

### 1.3 Regenerate QR Code (overwrites existing)

POST /api/tokens/{tokenId}/regenerate-qr

Same request/response as generate. Usually called when QR needs renewal or new design.

### 1.4 Assign Token to Student (optional)

PATCH /api/tokens/{tokenId}/assign

{
  "student_id": "stu_123"
}

Response:

{
  "success": true,
  "token": { ...updated token... }
}

### 1.5 Download QR Code (client-side)

The frontend downloads the file using the public_url returned from the API. No separate endpoint needed.

### 1.6 Bulk Export of QR Codes (optional)

GET /api/tokens/export-qrs?format=zip

Returns a ZIP file containing all generated QR codes for the school.

## 2. Data Requirements (Input from User)

Search query – filters token list by student name, class, or token hash

Generate QR – via modal: user selects format (PNG/SVG/PDF) and size (256–2048px)

Regenerate QR – via button on preview panel

Download – downloads the current QR image in selected format

Print – opens print dialog for the QR image

Assign token – (button present but not implemented in this file) would require student selection

## 3. Data Fetched from Backend

Token list (for the logged-in school) – each token includes student info, status, and optional QR asset

Statistics – total students with tokens, count of QR-generated, count of active tokens

QR asset (on generate/regenerate) – returns new asset object

## 4. Data Displayed on UI

### Stats Cards (top row)

| **Label** | **Source Field** |
| --- | --- |
| Students with Tokens | stats.totalStudentsWithTokens |
| QR Generated | stats.qrGenerated |
| Active Tokens | stats.activeTokens |

### Left Panel – Token List

Each item shows:
- Student avatar (initials) or "?" if unassigned
- Student name (or "Unassigned Token")
- Class + section (if assigned)
- Masked token hash (e.g., QRAB••••5678)
- Status badge (color-coded)
- "QR Ready" badge if qr_asset exists

### Right Panel – QR Preview

- If no token selected → placeholder message
- If token is unassigned → "Token Not Assigned" + button to assign (not functional in mock)
- If token status not ACTIVE → warning message
- If token is ACTIVE but no QR → "Generate QR Code" button
- If QR exists:
  - QR image preview (from qr_asset.public_url)
  - Status badge (Active/Inactive etc.)
  - Token hash (masked)
  - Generation metadata (relative time, file size)
  - Format selector (PNG/SVG/PDF)
  - Size selector (Small/Medium/Large/Extra Large)
  - Buttons: Download (in selected format), Print, Regenerate

## 5. Summary of Data Flow

Page loads:
  Frontend → GET /api/tokens
  Backend → returns { data, stats }
  Frontend → displays stats, token list, selects first token (or none)
User searches:
  → filters token list client-side (or via API with search param)
User clicks a token:
  → set selected token, show QR preview
User clicks "Generate QR":
  → open modal, user picks format/size
  → POST /api/tokens/{id}/generate-qr
  → backend generates QR, stores asset, returns URL
  → frontend updates token's qr_asset and displays preview
User clicks "Regenerate":
  → POST /api/tokens/{id}/regenerate-qr
  → backend updates QR (new URL/timestamp)
  → frontend refreshes preview
User clicks "Download":
  → frontend uses public_url to download file (client-side)
User clicks "Print":
  → frontend opens print dialog with QR image

## 6. Notes for Backend

token_hash should be a unique, non-guessable string (e.g., random alphanumeric). The frontend masks it for display.

QR generation should produce high-quality images with embedded student/token metadata (if required).

The public_url must be accessible without authentication (or with signed URLs) for download/print.

Storage: save generated QR files in cloud storage (S3, etc.) and store the URL.

Consider rate-limiting for generate/regenerate to avoid abuse.

expires_at field – frontend doesn't currently enforce, but backend should reject scans of expired tokens.

If a token is revoked or expired, the frontend disables QR actions (but still shows the existing QR? In this page, it shows "Token inactive" message and no QR display – implement accordingly).

For multi-school setups, ensure school_id filtering is applied server-side.

## 7. Additional Endpoints (Optional but Suggested)

| **Endpoint** | **Method** | **Description** |
| --- | --- | --- |
| /api/tokens/bulk-generate | POST | Generate QR codes for multiple students at once (body: array of token IDs) |
| /api/tokens/{id}/revoke | POST | Revoke a token (set status to REVOKED) |
| /api/tokens/{id}/activate | POST | Reactivate a revoked/expired token |
| /api/tokens/sync | GET | Sync token list with student enrollment (auto-create tokens for new students) |