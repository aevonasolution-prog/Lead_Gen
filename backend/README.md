# Backend Architecture & Service Specification

## 1. Overview & Project Status

> **IMPORTANT ARCHITECTURAL CONTEXT:**
> During Phase 1 (Frontend Foundation & Readiness), the primary objective is establishing a production-quality frontend, robust API contract definitions, and complete architectural planning for the backend.
> 
> **Server-side controllers, database connections, authentication providers, and SMTP email services are deliberately NOT implemented in this repository at this stage.** They are scheduled for implementation by backend specialists once the client provides production hosting credentials, domain DNS access, database infrastructure, and email delivery credentials.

---

## 2. Proposed Directory Structure

```text
backend/
├── src/
│   ├── config/          # Centralized configuration (env parsing, database pool, logger, CORS)
│   ├── controllers/     # Express/Fastify request handlers mapping HTTP to service calls
│   ├── routes/          # API route definitions and endpoint mounting (/api/leads, etc.)
│   ├── models/          # Database schemas / ORM entities (Prisma, TypeORM, or Mongoose)
│   ├── middleware/      # Authentication guards, CORS, rate-limiting, error handling, logging
│   ├── services/        # Business logic, email notification dispatch, CSV streaming
│   ├── validators/      # Schema validation middlewares (Zod, Joi, or express-validator)
│   └── utils/           # Shared helpers (date formatters, response builders, error classes)
├── tests/               # Unit, integration, and E2E test suites (Jest/Vitest/Supertest)
├── .env.example         # Template for environment configuration
├── API_CONTRACTS.md     # Complete REST API specification and payload schemas
└── README.md            # This documentation file
```

---

## 3. Responsibilities of Each Directory

| Directory | Responsibility |
| :--- | :--- |
| `src/config/` | Validates process environment variables (`dotenv` + schema verification). Initializes database connection clients and third-party SDK clients (e.g. SMTP transporters, AWS SES, or SendGrid). |
| `src/controllers/` | Accepts HTTP requests, unpacks validated parameters/body, delegates to domain services, and formats responses using standard API response envelopes. Handles error forwarding to next middleware. |
| `src/routes/` | Defines RESTful endpoints, attaches path-specific rate limits, validation middlewares, authentication guards, and links controller actions. |
| `src/models/` | Houses data persistence models and migration definitions. Defines columns/fields, indexes (`email`, `status`, `createdAt`), and type definitions for the `leads` table. |
| `src/middleware/` | Global and route-level middlewares: `errorHandler` (centralized error catch), `rateLimiter` (IP-based brute-force and spam prevention), `authGuard` (JWT verification), and `requestLogger` (Morgan / Pino). |
| `src/services/` | Contains core commercial business logic: lead persistence transaction, internal email notification dispatch, duplicate suppression, and audit logging. Completely decouples business logic from HTTP transport. |
| `src/validators/` | Strict schema validation ensuring every inbound request matches expected types, string lengths, phone digit counts, and allowed status enums before reaching controllers. |
| `src/utils/` | Shared utilities: standard API response wrappers (`successResponse`, `errorResponse`), RFC-4180 CSV serializer, and custom error classes (`NotFoundError`, `ValidationError`, `UnauthorizedError`). |
| `tests/` | Automated test suites: unit tests for validators and services, mock HTTP integration tests with `supertest`. |

---

## 4. Summary of API Contracts

Complete request/response specifications and error codes are detailed in [`API_CONTRACTS.md`](./API_CONTRACTS.md):

1. **`POST /api/leads`**: Accepts enquiry submissions from the public website, validates input, persists the lead with status `new`, and queues internal notifications.
2. **`GET /api/leads`**: Administrative listing endpoint with filtering by status, search, and pagination.
3. **`GET /api/leads/:id`**: Fetches single lead record by unique identifier.
4. **`PATCH /api/leads/:id`**: Updates lead pipeline status (`new` → `in_review` → `contacted` → `qualified` → `closed`) and internal administrative notes.
5. **`GET /api/leads/export`**: Streams an RFC-4180 CSV file containing filtered lead records for reporting and CRM importing.

---

## 5. Security & Production Checklist for Backend Team

Before deploying the backend service in Phase 2:

- [ ] **Database Encryption:** Ensure database connections utilize TLS/SSL with encrypted columns for personal data (PII).
- [ ] **Rate Limiting:** Enforce a strict rate limit on `POST /api/leads` (e.g. maximum 10 submissions per IP per hour) to mitigate form spam and abuse.
- [ ] **Input Sanitization:** Sanitize HTML tags and control characters to prevent XSS and SQL injection.
- [ ] **Authentication:** Protect `/api/leads*` admin endpoints behind JWT tokens or secure session cookies with `HttpOnly` and `SameSite=Strict`.
- [ ] **Audit Trail:** Maintain an audit log of all status transitions and export operations.
