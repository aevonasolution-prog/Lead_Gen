# Changelog & Development History

All notable changes to the Lead Generation Platform project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to Semantic Versioning.

---

## [1.1.0] - 2026-11-05

### Added
- **Backend implemented** (`backend/`): Express + TypeScript + PostgreSQL REST API covering every endpoint in `API_CONTRACTS.md`.
- Admin authentication (`POST /api/auth/login`, `GET /api/auth/me`) with bcrypt + JWT; `create-admin` script and optional first-start bootstrap.
- Email notification of every new lead via SMTP (Nodemailer) with delivery tracking and automatic retries.
- Server-side CSV export (RFC-4180, UTF-8 BOM, formula-injection safe) and per-lead audit trail.
- Spam protection: honeypot, per-IP rate limits, duplicate suppression, optional Cloudflare Turnstile.
- Migrations, Dockerfile, 18 integration tests, `DEPLOYMENT.md` (hosting, DNS, SSL, SPF/DKIM/DMARC, go-live checklist).

### Changed
- `backend/README.md`, `backend/.env.example` and `API_CONTRACTS.md` updated to reflect the implemented backend.

### Pending (frontend)
- Admin login screen + bearer token on dashboard requests; honeypot field and consent checkbox in `LeadForm` (see `backend/README.md`).

---

## [1.0.2] - 2026-11-03

### Added
- Created comprehensive `.gitignore` files at repository root and in `frontend/` ignoring `node_modules/`, `dist/`, local `.env` secret files, build caches (`*.tsbuildinfo`, `.vite/`), diagnostic logs, and OS/IDE settings, while safely preserving `.env.example` templates.

### Changed
- Restructured workspace into dedicated `frontend/` and `backend/` directories as requested.
- Moved all React frontend application files, build toolings, dependencies (`node_modules/`, `package.json`, `vite.config.ts`, `tailwind.config.js`, `tsconfig.json`), public assets, and source code into the `frontend/` folder.
- Maintained backend architecture, contracts, and proposed folders in `backend/`.
- Updated master `README.md` setup commands (`cd frontend && npm install && npm run dev`) and directory structure tree to guide developers seamlessly through the dual-folder structure.
- Re-verified production build (`npm run build` in `frontend/`) compiling cleanly into `frontend/dist/` with zero errors.

## [1.0.1] - 2026-11-03

### Added
- Programmatic route transform test suite verifying all 8 routes (`/`, `/about`, `/services`, `/contact`, `/privacy-policy`, `/terms-and-conditions`, `/admin`, 404).
- Dynamic prop synchronization in `LeadForm.tsx` via `useEffect`, allowing service enquiry CTA buttons to dynamically update the preselected dropdown value without page reloads.

### Changed
- Replaced unverified claim "Rapid SLA Turnaround" on homepage with verifiable "Clearly Defined SLAs".
- Migrated internal action anchors in `HomePage.tsx` from standard `<a>` tags to React Router `<Link>` components to maintain SPA navigation.
- Enhanced Admin Dashboard header layout with `min-h-[4rem] py-3 flex-wrap` and mobile padding adjustments (`p-5 sm:p-8`) to prevent overflow on 360px and 390px mobile viewports.
- Updated Exit link on Admin Portal to use React Router `<Link to="/">` for seamless client-side transition.

### Fixed
- Fixed telephone regex validation in `src/utils/validation.ts` which previously failed on standard UK parenthesized area codes (such as `+44 (0) 20 7946 0990` and `+1 (555) 123-4567`). New regex `/^\+?[0-9\s\-().]{8,25}$/` with digit bounds [8, 15] successfully handles all international and national formats.
- Reduced mobile padding on `LeadForm.tsx` container from `p-6` to `p-5 sm:p-8 lg:p-10` to avoid viewport clipping on narrow 360px devices.

### Documentation
- Updated `CHANGELOG.md` with complete Frontend Quality Assurance testing findings and bug resolution notes.

### Pending
- Production backend integration (API endpoints, database persistence, and email dispatch).
- Final client domain DNS configuration and SSL installation.

## [1.0.0] - 2026-11-03

### Added
- Initialized production-ready Vite + React 18 + TypeScript + Tailwind CSS project from scratch.
- Centralized site and branding configuration in `src/config/siteConfig.ts` with placeholder brand name ("Your Business"), customizable contact details, and structured services metadata.
- Reusable Tailwind design system with accessible focus outlines (`:focus-visible`), color scales, and `prefers-reduced-motion` compliance.
- Complete public website pages:
  - **Homepage (`HomePage.tsx`)**: High-converting hero section, value highlights, business narrative, 6 core service previews, Why Choose Us grid, lead capture anchor, and corporate footer.
  - **About Us (`AboutPage.tsx`)**: Corporate profile, mission & vision placeholders, snapshot card, and 4-phase client engagement lifecycle.
  - **Services (`ServicesPage.tsx`)**: Comprehensive capability cards, sticky anchor sub-nav, feature checklists, SLA previews, and deep-linked enquiry CTAs.
  - **Contact Us (`ContactPage.tsx`)**: Direct corporate communication cards (telephone, email, address, hours), service guarantee, and lead enquiry form supporting `?service=<category>` preselection.
  - **Privacy Policy (`PrivacyPolicyPage.tsx`)**: Structured UK/EU GDPR data protection template with visually tagged client placeholders for legal sign-off.
  - **Terms & Conditions (`TermsConditionsPage.tsx`)**: Structured commercial advisory and website terms template with tagged client placeholders.
  - **Not Found (`NotFoundPage.tsx`)**: Accessible 404 recovery page.
- Complete Lead Generation Form (`LeadForm.tsx`):
  - Validation for Full Name, Email, Phone Number, Location/Postcode, Service Required, and Scope Message.
  - Inline error feedback and submission prevention for invalid inputs.
  - Clear loading indicator during connection attempts.
  - Transparent **Backend Integration Status Banner** informing users and developers when the backend API is offline, preventing fake success declarations.
  - Interactive "Validated API Payload Inspector" for developer testing.
- Admin Lead Management Dashboard (`AdminDashboard.tsx`):
  - Pipeline overview KPI stats (Total, New, In Review, Contacted, Qualified, Closed).
  - Search across all fields (name, email, phone, location, enquiry text).
  - Filter by pipeline status and service category.
  - Detailed lead inspection modal with in-memory status editing.
  - Client-side RFC-4180 compliant CSV export engine (`exportCsv.ts`) with UTF-8 BOM.
  - Clearly labeled preview sample data (`mockData.ts`).
- SEO & Meta System (`SEOHead.tsx`):
  - Dynamic page title, meta description, keywords, canonical URLs, robots directives, and Open Graph tags.
  - XML Sitemap (`public/sitemap.xml`) and robots crawler policy (`public/robots.txt`).
- Reusable API Service Layer (`apiClient.ts` & `leadService.ts`):
  - Centralized request timeout and network diagnostic error handling.
  - Configurable `VITE_API_BASE_URL`.
- Complete backend architectural blueprint in `backend/`:
  - `backend/README.md` defining folder responsibilities.
  - `backend/API_CONTRACTS.md` with full REST schemas for POST /api/leads, GET /api/leads, GET /api/leads/:id, PATCH /api/leads/:id, and GET /api/leads/export.
  - Scaffolded subdirectories (`config`, `controllers`, `routes`, `models`, `middleware`, `services`, `validators`, `utils`, `tests`).
  - `backend/.env.example` template.
- Mandatory documentation: `README.md`, `ARCHITECTURE.md`, `CHANGELOG.md`, `.env.example`.

### Changed
- Refactored `initialService` prop type in `LeadForm.tsx` to handle union types cleanly.
- Enhanced Tailwind color palette with custom brand shades and neutral slate foundations.

### Fixed
- Fixed unused TypeScript import declarations across page components.
- Added `src/vite-env.d.ts` for typed `import.meta.env` access.
- Verified production build compiles cleanly without errors or warnings.

### Documentation
- Created comprehensive `README.md` with complete installation guides, available pages, and team division.
- Created `ARCHITECTURE.md` featuring 5 Mermaid sequence and flowchart diagrams.
- Created `backend/API_CONTRACTS.md` with JSON schema payloads, HTTP status codes, and error envelopes.

### Pending
- Domain registration and DNS record assignment (to be provided by client).
- Production SSL certificate installation and hosting deployment (scheduled for Phase 2).
- Client logo, final brand color codes, and finalized commercial copy.
- Production database provisioning (PostgreSQL/MongoDB) and ORM connection.
- Backend Express/Fastify implementation of routes and controllers in `backend/src/`.
- SMTP server credentials for live lead email notification dispatch.
- Administrative authentication (JWT / Session authentication with RBAC).
