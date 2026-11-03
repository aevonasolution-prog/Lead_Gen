# Lead Generation REST API Specifications & Contracts

This document establishes the official API contracts agreed upon between the Frontend and Backend teams. All implementations in Phase 2 must adhere strictly to these schemas.

---

## Global Response Architecture

Every JSON response returned by the backend API must follow this envelope format:

### Standard Success Envelope
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Human readable confirmation message",
  "data": { ... },
  "meta": {
    "total": 120,
    "page": 1,
    "limit": 20,
    "totalPages": 6
  }
}
```

### Standard Error Envelope
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Primary error message explanation",
  "errors": {
    "email": ["Please provide a valid corporate email address"],
    "phone": ["Telephone number must contain between 8 and 15 digits"]
  },
  "timestamp": "2026-11-03T20:00:00.000Z"
}
```

---

## 1. POST /api/leads

Creates a new lead enquiry from the public website form.

- **Access Level:** Public
- **Rate Limit:** 10 submissions per IP per hour
- **Headers:** `Content-Type: application/json`

### Request Body Schema
| Field | Type | Required | Constraints / Description |
| :--- | :--- | :--- | :--- |
| `fullName` | `string` | **Yes** | Min 2, max 100 characters. Letters, spaces, hyphens, apostrophes. |
| `email` | `string` | **Yes** | Valid RFC-compliant email address. Min 5, max 150 chars. |
| `phone` | `string` | **Yes** | Phone number string. Min 8 digits, max 15 digits. |
| `location` | `string` | **Yes** | City, region, or postcode. Min 2, max 100 characters. |
| `serviceRequired` | `string` | **Yes** | One of: `consulting`, `managed_services`, `enterprise_solutions`, `digital_transformation`, `custom_development`, `other`. |
| `message` | `string` | No | Optional scope details. Max 2000 characters. |

#### Example Request Body
```json
{
  "fullName": "Eleanor Vance",
  "email": "e.vance@apexlogistics.example.co.uk",
  "phone": "+44 20 7946 0192",
  "location": "Manchester, M1 4ET",
  "serviceRequired": "enterprise_solutions",
  "message": "We require technical infrastructure scoping for regional warehouse consolidation."
}
```

### Success Response (`201 Created`)
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Enquiry submitted successfully. A specialist will review your request shortly.",
  "data": {
    "id": "LEAD-2026-001",
    "fullName": "Eleanor Vance",
    "email": "e.vance@apexlogistics.example.co.uk",
    "phone": "+44 20 7946 0192",
    "location": "Manchester, M1 4ET",
    "serviceRequired": "enterprise_solutions",
    "serviceName": "Enterprise Infrastructure Solutions",
    "message": "We require technical infrastructure scoping for regional warehouse consolidation.",
    "status": "new",
    "createdAt": "2026-11-03T20:00:00.000Z",
    "updatedAt": "2026-11-03T20:00:00.000Z"
  }
}
```

### Error Responses
- **`400 Bad Request`**: Validation failed (e.g. invalid email format or missing required fields).
- **`429 Too Many Requests`**: Rate limit exceeded for submitting IP address.
- **`500 Internal Server Error`**: Unexpected database failure or notification queue failure.

---

## 2. GET /api/leads

Retrieves a paginated list of submitted leads for the administrative dashboard.

- **Access Level:** Protected (Admin Session / Bearer Token)
- **Headers:** `Authorization: Bearer <token>`, `Accept: application/json`

### Query Parameters
| Parameter | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `page` | `integer` | No | `1` | Page number |
| `limit` | `integer` | No | `20` | Items per page (max 100) |
| `status` | `string` | No | `all` | Filter by: `new`, `in_review`, `contacted`, `qualified`, `closed` |
| `service` | `string` | No | `all` | Filter by `serviceRequired` key |
| `search` | `string` | No | - | Substring search matching name, email, phone, location |
| `sortBy` | `string` | No | `createdAt` | Sort column: `createdAt`, `fullName`, `status` |
| `order` | `string` | No | `desc` | Sort direction: `asc` or `desc` |

### Success Response (`200 OK`)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Leads retrieved successfully",
  "data": [
    {
      "id": "LEAD-2026-001",
      "fullName": "Eleanor Vance",
      "email": "e.vance@apexlogistics.example.co.uk",
      "phone": "+44 20 7946 0192",
      "location": "Manchester, M1 4ET",
      "serviceRequired": "enterprise_solutions",
      "serviceName": "Enterprise Infrastructure Solutions",
      "message": "We require technical infrastructure scoping...",
      "status": "new",
      "createdAt": "2026-11-03T20:00:00.000Z",
      "updatedAt": "2026-11-03T20:00:00.000Z",
      "notes": "Initial enquiry received via website form."
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

### Error Responses
- **`401 Unauthorized`**: Bearer token missing, expired, or invalid.
- **`403 Forbidden`**: Insufficient administrative permissions.

---

## 3. GET /api/leads/:id

Fetches complete record and timeline audit history for an individual lead.

- **Access Level:** Protected (Admin Session / Bearer Token)
- **Path Parameter:** `id` (e.g. `LEAD-2026-001` or UUID)

### Success Response (`200 OK`)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Lead details retrieved",
  "data": {
    "id": "LEAD-2026-001",
    "fullName": "Eleanor Vance",
    "email": "e.vance@apexlogistics.example.co.uk",
    "phone": "+44 20 7946 0192",
    "location": "Manchester, M1 4ET",
    "serviceRequired": "enterprise_solutions",
    "serviceName": "Enterprise Infrastructure Solutions",
    "message": "We require technical infrastructure scoping...",
    "status": "new",
    "createdAt": "2026-11-03T20:00:00.000Z",
    "updatedAt": "2026-11-03T20:00:00.000Z",
    "notes": "Initial enquiry received via website form."
  }
}
```

### Error Responses
- **`404 Not Found`**: No lead exists with the requested identifier.

---

## 4. PATCH /api/leads/:id

Updates the pipeline status or internal staff notes on a lead.

- **Access Level:** Protected (Admin Session / Bearer Token)
- **Path Parameter:** `id`
- **Headers:** `Content-Type: application/json`

### Request Body Schema
| Field | Type | Required | Constraints |
| :--- | :--- | :--- | :--- |
| `status` | `string` | Optional | Must be one of: `new`, `in_review`, `contacted`, `qualified`, `closed`. |
| `notes` | `string` | Optional | Internal notes added by staff. Max 3000 chars. |

#### Example Request Body
```json
{
  "status": "in_review",
  "notes": "Reviewed requirements; scheduled introductory call for Thursday."
}
```

### Success Response (`200 OK`)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Lead updated successfully",
  "data": {
    "id": "LEAD-2026-001",
    "status": "in_review",
    "notes": "Reviewed requirements; scheduled introductory call for Thursday.",
    "updatedAt": "2026-11-03T20:15:00.000Z"
  }
}
```

### Error Responses
- **`400 Bad Request`**: Unrecognized status value.
- **`404 Not Found`**: Lead record does not exist.

---

## 5. GET /api/leads/export

Generates and streams an RFC-4180 compliant CSV export of lead records based on active filter criteria.

- **Access Level:** Protected (Admin Session / Bearer Token)
- **Response Content-Type:** `text/csv; charset=utf-8`
- **Response Headers:** `Content-Disposition: attachment; filename="leads_export_YYYY-MM-DD.csv"`

### Query Parameters
Accepts the same filtering parameters as `GET /api/leads` (`status`, `service`, `search`, `startDate`, `endDate`).

### Success Response (`200 OK`)
A binary stream or raw text conforming to RFC-4180 with UTF-8 Byte Order Mark (BOM) to ensure clean compatibility with Microsoft Excel, Apple Numbers, and Google Sheets.
