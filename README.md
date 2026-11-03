# Commercial Lead Generation Platform (Frontend Prototype & Architecture)

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.11-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4.16-38B2AC.svg)](https://tailwindcss.com/)
[![Status](https://img.shields.io/badge/Phase-1%20Frontend%20Readiness-success.svg)](#current-project-status)

---

## 1. Project Overview & Objectives

This project is a modern, responsive, high-converting **Lead Generation Website and Pipeline Administration Portal** engineered from scratch. It is designed to establish an enterprise-grade digital presence for commercial lead capture and provide client operations teams with an intuitive pipeline dashboard.

### Core Objectives:
1. **Commercial Conversion:** Deliver clear value propositions, transparent service capabilities, and frictionless enquiry capture flows across all device viewport sizes.
2. **Frontend Robustness:** Provide instantaneous client-side validation, accessible semantic HTML, keyboard navigability, and clear UI state management (loading, error, and backend connectivity diagnostics).
3. **Backend Integration Readiness:** Establish clean, decoupled API services, TypeScript schemas, and REST contracts so that backend developers can connect database persistence and authentication without modifying frontend business logic.
4. **Architectural Discipline:** Strictly respect phase boundaries—delivering complete frontend excellence while providing detailed blueprints for backend infrastructure.

---

## 2. Technology Stack & Key Dependencies

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | [React 18.3.1](https://reactjs.org/) | Component-driven user interface architecture |
| **Language** | [TypeScript 5.6.3](https://www.typescriptlang.org/) | End-to-end type safety and compile-time contract enforcement |
| **Bundler / Tooling** | [Vite 5.4.11](https://vitejs.dev/) | High-speed ESM development server and optimized rollup production bundling |
| **Routing** | [React Router DOM 6.28.0](https://reactrouter.com/) | Client-side routing, nested layouts, anchor scrolling, and query param state |
| **Styling** | [Tailwind CSS 3.4.16](https://tailwindcss.com/) | Mobile-first utility design system with customizable brand themes |
| **Icons** | [Lucide React 0.468.0](https://lucide.dev/) | Lightweight, accessible SVG icon library |
| **CSV Utilities** | Custom RFC-4180 Serializer | RFC-compliant UTF-8 CSV generation and browser download |

---

## 3. Installation & Local Development

### Prerequisites
- [Node.js](https://nodejs.org/) v18.0.0 or later (v20+ or v26 LTS recommended)
- `npm` v9.0.0 or later

### Step 1: Clone or Open Workspace
```bash
cd Lead_Gen
```

### Step 2: Install Frontend Dependencies
```bash
cd frontend
npm install
```

### Step 3: Configure Environment Variables
Copy the frontend template file to `.env`:
```bash
cp .env.example .env
```
*(On Windows PowerShell: `Copy-Item .env.example .env`)*

### Step 4: Run Development Server
```bash
npm run dev
```
The website will launch at `http://localhost:3000`.

### Step 5: Production Build & Type Checking
```bash
# Type check and generate production bundle in frontend/dist
npm run build

# Preview production build locally
npm run preview
```

---

## 4. Project Directory Structure

```text
Lead_Gen/
├── README.md                    # Master project documentation & developer guide
├── ARCHITECTURE.md              # System architecture, workflows, & Mermaid diagrams
├── CHANGELOG.md                 # Chronological version & development history
│
├── frontend/                    # Complete Production-Quality Frontend Application
│   ├── .env.example             # Frontend environment configuration template
│   ├── index.html               # HTML entry point with preconnected fonts & SEO base
│   ├── package.json             # Frontend dependency manifest and scripts
│   ├── postcss.config.js        # PostCSS configuration
│   ├── tailwind.config.js       # Centralized Tailwind design system configuration
│   ├── tsconfig.json            # TypeScript compiler configuration
│   ├── tsconfig.node.json       # Node/bundler TypeScript settings
│   ├── vite.config.ts           # Vite configuration and path aliases (@/*)
│   ├── public/
│   │   ├── favicon.svg          # Vector brand favicon
│   │   ├── robots.txt           # Crawler directives (allows public pages, protects /admin)
│   │   └── sitemap.xml          # XML Sitemap template
│   └── src/
│       ├── assets/              # Graphic resources and icons
│       ├── components/
│       │   ├── common/          # IconResolver and shared atomic elements
│       │   ├── forms/           # LeadForm component with validation & status banners
│       │   ├── layout/          # Navbar, Footer, and responsive Layout wrapper
│       │   └── seo/             # Dynamic SEOHead meta manager
│       ├── config/              # Centralized siteConfig (branding, contacts, services, APIs)
│       ├── pages/
│       │   ├── Home/            # Hero, intro, services overview, Why Choose Us, lead form
│       │   ├── About/           # Corporate narrative, mission/vision, engagement lifecycle
│       │   ├── Services/        # Service capability cards with anchor navigation and CTAs
│       │   ├── Contact/         # Direct contact channels, FAQ, and lead form
│       │   ├── PrivacyPolicy/   # Structured GDPR policy template with client placeholders
│       │   ├── TermsConditions/ # Structured commercial terms template with client placeholders
│       │   ├── Admin/           # Admin lead management portal, KPI cards, and CSV export
│       │   └── NotFound/        # 404 handler with navigation recovery
│       ├── services/
│       │   ├── apiClient.ts     # Reusable HTTP client with timeout & network diagnostics
│       │   ├── leadService.ts   # Typed service bridging UI to future REST endpoints
│       │   └── mockData.ts      # Clearly labeled preview sample data for Admin portal
│       ├── styles/
│       │   └── index.css        # Tailwind directives, focus outlines, and reduced motion
│       ├── types/
│       │   └── index.ts         # TypeScript interfaces for forms, leads, API envelopes
│       ├── utils/
│       │   ├── exportCsv.ts     # RFC-4180 CSV serializer and browser downloader
│       │   └── validation.ts    # Pure form validation routines (email, phone, name)
│       ├── App.tsx              # Main route configuration
│       ├── main.tsx             # React DOM mount point
│       └── vite-env.d.ts        # Vite client type definitions
│
└── backend/                     # Proposed Backend Architecture (Phase 2 Planning Only)
    ├── .env.example             # Backend environment variables template
    ├── API_CONTRACTS.md         # Full REST API contracts and schema specifications
    ├── README.md                # Backend architecture and directory responsibilities
    └── src/                     # Scaffolded folders for Phase 2 team (controllers, routes, etc.)
```

---

## 5. Available Pages and Routes

| Route | Page | Purpose & Key Features |
| :--- | :--- | :--- |
| `/` | **Home** | Hero section, value propositions, business intro, services overview, Why Choose Us grid, lead conversion section with embedded quote form, and footer. |
| `/about` | **About Us** | Company background, mission and vision statements, structured 4-phase client engagement lifecycle, and company snapshot. |
| `/services` | **Our Services** | Detailed cards for 6 service capabilities, sticky anchor navigation, feature checklists, SLA previews, and deep-linked enquiry CTAs. |
| `/contact` | **Contact Us** | Direct corporate telephone, email, and address cards, service guarantee steps, and full lead enquiry form supporting `?service=<category>` preselection. |
| `/privacy-policy` | **Privacy Policy** | Comprehensive data protection policy template formatted for UK/EU GDPR compliance with clearly marked `[CLIENT PLACEHOLDERS]` for legal sign-off. |
| `/terms-and-conditions` | **Terms & Conditions** | Structured website and advisory engagement terms template with clearly marked `[CLIENT PLACEHOLDERS]` for commercial counsel. |
| `/admin` | **Admin Portal** | Lead pipeline management table, real-time search, status and service filtering, in-memory status editor, lead inspection drawer, and RFC-4180 CSV export. |
| `*` | **404 Not Found** | User-friendly error recovery page with direct navigation back to the homepage. |

---

## 6. Frontend Functionality

### A. Lead Generation Form
- **Fields Captured:** Full Name, Work Email, Phone Number, Location/Postcode, Service Category, and Scope Notes.
- **Client-Side Validation:** Validates required fields, RFC email structure, telephone digit counts (8–15 digits), and text length constraints in real time and on blur.
- **Submission Prevention:** Invalid submissions are blocked, preventing malformed network traffic and focusing the user on the first erroneous field.
- **Clear Backend Diagnostics:** When the backend server is offline (during Phase 1), the form displays a helpful **Backend Integration Status Banner** explaining that the lead was not saved, avoiding fake success claims. It also includes an expandable **Payload Inspector** allowing developers to review the exact JSON payload.

### B. Admin Dashboard
- **Pipeline Statistics:** Real-time KPI counters for Total Leads, New, In Review, Contacted, Qualified, and Closed.
- **Multi-parameter Search:** Instantaneous filtering across customer name, email, phone, location, and enquiry notes.
- **Status & Category Filters:** Isolate prospects based on pipeline state or specific commercial service lines.
- **Lead Detail Drawer:** Inspect complete customer enquiry messages and test status updates.
- **CSV Data Export:** One-click download of filtered records into an RFC-4180 compliant CSV file compatible with Microsoft Excel, Apple Numbers, and Google Sheets.
- **Sample Data Transparency:** Prominent badges and headers clarify that records are for layout and UX verification until Phase 2 database integration.

---

## 7. SEO & Accessibility Implementation

- **Dynamic Head Metadata:** Every public page mounts `<SEOHead>` which updates `<title>`, `<meta name="description">`, `<meta name="keywords">`, `<meta name="robots">`, `<link rel="canonical">`, and Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`, `og:site_name`).
- **Semantic Hierarchy:** Single `<h1>` per page, hierarchical `<h2>`–`<h4>` structures, `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, and `<footer>`.
- **Keyboard & Screen Reader Accessibility:** Explicit `<label htmlFor="...">`, `aria-required`, `aria-invalid`, `aria-describedby`, visible focus rings (`:focus-visible`), and ARIA modal dialog attributes.
- **Crawler Directives:** `public/robots.txt` disallows `/admin` and `/api/` while directing search engines to `public/sitemap.xml`.
- **Reduced Motion:** Global CSS media query automatically disables transition and animation durations when users have `prefers-reduced-motion` enabled in their operating system.

---

## 8. Backend Integration Expectations (Phase 2)

The frontend is fully wired to communicate with the REST API endpoints specified in `backend/API_CONTRACTS.md`:

| Endpoint | Method | Expected Frontend Usage |
| :--- | :--- | :--- |
| `/api/leads` | `POST` | Called by `leadService.submitLead(formData)` on valid form submission. |
| `/api/leads` | `GET` | Called by `leadService.fetchLeads()` to populate the admin dashboard. |
| `/api/leads/:id` | `GET` | Called by `leadService.fetchLeadById(id)` when opening lead detail drawer. |
| `/api/leads/:id` | `PATCH` | Called by `leadService.updateLeadStatus(id, status)` when updating pipeline status. |
| `/api/leads/export` | `GET` | Backend alternative to client-side CSV export for server-side historical archives. |

Configure the base URL in `.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 9. Current Project Status & Known Phase Boundaries

### ✅ Completed in Phase 1:
- [x] Complete, responsive React + TypeScript + Tailwind frontend.
- [x] Neutral, sophisticated corporate design system with centralized branding in `src/config/siteConfig.ts`.
- [x] Full lead generation form with live validation and error messaging.
- [x] Administrative pipeline dashboard with search, filtering, and RFC-4180 CSV export.
- [x] Reusable API client layer (`apiClient.ts` and `leadService.ts`) with typed interfaces.
- [x] Full SEO implementation (metadata manager, semantic HTML, sitemap.xml, robots.txt).
- [x] Proposed backend architecture (`backend/` folder layout and `.env.example`).
- [x] Complete REST API contracts specification (`backend/API_CONTRACTS.md`).
- [x] Production build verification (`npm run build` succeeds cleanly).

### ⏳ Scheduled for Phase 2 (Pending Client Assets & Infrastructure):
- [ ] Final client logo and brand color palette replacement in `siteConfig.ts` and `tailwind.config.js`.
- [ ] Final business copy, team biographies, and registered company numbers.
- [ ] Domain registration, DNS mapping, and SSL certificate installation.
- [ ] Database provisioning (PostgreSQL/MongoDB) and ORM migrations.
- [ ] Backend Express/Fastify server implementation (`backend/src/`).
- [ ] SMTP server credentials configuration and email notification dispatch.
- [ ] Admin authentication (JWT / Session authentication with role-based access).
- [ ] Production cloud deployment (e.g. AWS, Vercel, Netlify, or Railway).

---

## 10. Team Responsibility Division

| Area | Frontend Team (Current Deliverable) | Backend / DevOps Team (Next Phase) | Client Stakeholders |
| :--- | :--- | :--- | :--- |
| **Branding & Assets** | Implemented neutral theme and configurable placeholders | None | Provide logo, brand guidelines, and high-res imagery |
| **User Interface** | Complete, production-grade frontend UI/UX | None | Review layouts and copy tone |
| **Form Validation** | Client-side input validation and error feedback | Server-side validation schema (`validators/`) | Confirm mandatory enquiry fields |
| **Admin Portal** | Complete dashboard layout and sample data preview | Connect DB queries and session authentication | Define staff roles and access levels |
| **API Layer** | Reusable API client and typed request envelopes | Implement REST controllers and route handlers | None |
| **Hosting & DNS** | Deployment-ready static asset bundling (`/dist`) | Provision cloud servers, configure DNS and SSL | Provide domain registrar credentials and hosting account |
| **Email Services** | None | Configure SMTP transporter and notification templates | Provide corporate SMTP credentials |
