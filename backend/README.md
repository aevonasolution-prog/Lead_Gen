# Lead Generation Backend (REST API)

Node.js 18+ · Express · TypeScript · PostgreSQL · Nodemailer · JWT

Implements every endpoint in [`API_CONTRACTS.md`](./API_CONTRACTS.md): public lead capture, secure
admin login, lead management, CSV export, and email notification of every new lead.

## What it does (client requirement → implementation)

| Requirement | Implementation |
| :--- | :--- |
| Leads stored securely | PostgreSQL (TLS supported), parameterised SQL only, input sanitised, no PII in logs |
| Email notification on every lead | `notificationService` → SMTP; stored first, emailed after; failures retried up to 5× (every 5 min) and tracked per lead (`notificationStatus`) |
| Owner can access & manage leads | JWT-protected `GET/PATCH /api/leads`, status pipeline, internal notes, audit trail |
| Export to Excel/CSV | `GET /api/leads/export` — RFC-4180, UTF-8 BOM (opens correctly in Excel), formula-injection safe, honours filters |
| Spam protection | Honeypot field, per-IP rate limit (10/hour), duplicate suppression, strict validation, optional Cloudflare Turnstile |
| GDPR / minimal data | Only the 6 requested fields (+ optional consent flag) stored; no IPs or tracking stored; `no-store` cache headers |
| Security | Helmet headers, strict CORS allow-list, bcrypt (cost 12), login brute-force limiter, 20 KB body limit |

## Quick start (local)

```bash
cd backend
npm install
cp .env.example .env          # edit DATABASE_URL and JWT_SECRET at minimum
npm run create-admin -- admin@yourbusiness.com 'a-long-passphrase'   # runs migrations too
npm run dev                   # http://localhost:5000/api/health
```

You need a PostgreSQL database (local install, Docker `postgres:16`, or a free Neon/Supabase/Render DB).
With `SMTP_HOST` empty, emails are logged instead of sent, so you can develop without email credentials.

| Script | Purpose |
| :--- | :--- |
| `npm run dev` | Dev server with reload |
| `npm run build && npm start` | Production build / run |
| `npm run migrate` | Apply DB migrations (also automatic on start) |
| `npm run create-admin -- <email> '<password>'` | Create admin, or reset its password |
| `npm test` | 18 integration tests (in-memory Postgres, no setup needed) |
| `npm run lint` | Type-check |

## Folder structure

```text
backend/
├── src/
│   ├── server.ts            # Entry point: migrate → bootstrap admin → listen → retry loop
│   ├── app.ts               # Express app (helmet, CORS, rate limits, routes, error handling)
│   ├── config/              # env.ts (validated env), database.ts, cors.ts, logger.ts
│   ├── routes/              # index, leadRoutes, authRoutes, asyncHandler
│   ├── controllers/         # leadController, authController, healthController
│   ├── services/            # leadService, notificationService, emailService, authService, spamService
│   ├── models/              # leadModel, auditModel, adminUserModel, migrations.ts, migrate.ts
│   ├── validators/          # Zod schemas + validate middleware
│   ├── middleware/          # authGuard, rateLimiter, errorHandler, requestLogger
│   ├── utils/               # constants, errors, response envelope, csv, sanitize
│   ├── scripts/             # migrate.ts, createAdmin.ts
│   └── types/express.d.ts
├── tests/                   # Vitest + Supertest integration tests
├── Dockerfile
├── API_CONTRACTS.md
├── DEPLOYMENT.md            # Domain, hosting, SSL, SPF/DKIM/DMARC, go-live checklist
└── .env.example
```

## Frontend integration checklist

The public enquiry form works with the existing frontend unchanged (`POST /api/leads`).
To finish the admin side, the frontend still needs:

1. **Admin login screen** → `POST /api/auth/login`, keep the token in memory/sessionStorage and send
   `Authorization: Bearer <token>` on `GET/PATCH /api/leads*`. Without it the dashboard receives `401`.
2. **Honeypot input** in `LeadForm`: a visually hidden text input named `website`
   (`tabIndex={-1}`, `autoComplete="off"`, `aria-hidden`), sent in the POST body. Real users never fill it.
3. **Consent checkbox** → send `consent: true` (stored as `consent_given`).
4. *(Optional)* Turnstile widget → send `turnstileToken`, then set `TURNSTILE_SECRET_KEY`.
5. *(Optional)* Point the dashboard's "Export" button at `GET /api/leads/export` (server-side, full dataset) instead of client-side CSV.
6. Set `VITE_API_BASE_URL=https://api.yourbusiness.com/api` for production builds.

## Notes on behaviour

- **Email never blocks the visitor.** The lead is saved first; if SMTP is down the visitor still sees success and
  the email is retried automatically. Check `notificationStatus` in the dashboard/CSV-API (`pending|sent|failed`).
- **Duplicates:** the same email + service within 10 minutes returns the original lead (no second record/email).
- **Honeypot hits** return a normal-looking `201` but store/send nothing.
- `PATCH` returns the full lead (a superset of the contract's `id,status,notes,updatedAt`).
- `GET /api/leads/:id` additionally returns a `history` array (created / status changes / notes / exports are audited).
