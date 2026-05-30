API Documentation Page – Frontend Documentation

# Page Overview

Displays static API reference documentation for developers. Lists available endpoints with their methods, paths, descriptions, authentication requirements, request/response examples, and rate limits. This page does not fetch data from a backend; it is a static help/documentation page.

---

# 1. Data Structure (Static Content)

The page uses a hardcoded array API_ENDPOINTS to render the documentation.

## Endpoint Object Structure

| **Field** | **Type** | **Description** |
| --- | --- | --- |
| method | string | HTTP method: GET, POST, PUT, DELETE |
| path | string | API endpoint path (e.g., /api/auth/login) |
| description | string | Human-readable description of the endpoint |
| auth | string | Authentication type (e.g., Bearer token, None) |
| params | string | Optional query parameters example |
| body | string | Example request body (as JSON string) |
| response | string | Example response body (as JSON string) |

## Example Endpoint Definition

{
  method: "GET",
  path: "/api/students",
  description: "Get all students for the school",
  auth: "Bearer token",
  params: "?class=string&section=string",
  response: `{
    "students": [
      { "id": "string", "name": "string", "class": "string", "rollNumber": "number" }
    ]
  }`
}

# 2. Data Displayed on UI

The page renders:

Header: Title "API Reference" with description.

Authentication notice: Amber box explaining Bearer token requirement.

Endpoints list: Each endpoint as a card showing:
 - Method badge (color-coded: GET green, POST blue, PUT amber, DELETE red)
 - Path (monospace)
 - Description
 - Authentication (with Key icon)
 - Query parameters (if any)
 - Request body (with copyable code block)
 - Response body (with copyable code block)

Rate limits section: Shows 100 requests per minute, 1000 requests per hour.

Code Block Component:
 - Syntax highlighting (via plain pre/code)
 - Copy button: copies content to clipboard, shows checkmark for 2 seconds.

# 3. Data Requirements from Backend

None. This is a static documentation page. No API calls are made from this frontend.

# 4. Notes for Backend / Developers

This page serves as a reference for API consumers.

Update API_ENDPOINTS array whenever backend endpoints change.

Ensure the examples match actual request/response schemas.

Rate limits shown (100/min, 1000/hour) should reflect actual backend limits.

# 5. Extending the Page

To add a new endpoint to the documentation, add an object to API_ENDPOINTS array with the required fields. The component will automatically render it.

Example addition:

{
  method: "DELETE",
  path: "/api/students/{id}",
  description: "Delete a student by ID",
  auth: "Bearer token",
  response: `{ "message": "Student deleted successfully" }`
}

# 6. Localization / Internationalization (Optional)

The page is currently English-only. For multi-language support, extract strings to a locale file.