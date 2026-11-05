# Deployment & Go-Live Guide

Recommended architecture (all have free or low-cost tiers):

| Piece | Where | Domain |
| :--- | :--- | :--- |
| Frontend (static build of `frontend/`) | Cloudflare Pages / Netlify / Vercel | `www.yourbusiness.com` (+ apex redirect) |
| Backend API (this folder, Docker or Node) | Render / Railway / Fly.io / a VPS | `api.yourbusiness.com` |
| PostgreSQL | Managed DB from the same host, Neon, or Supabase | private |
| Outgoing email | Brevo / Postmark / Resend / Amazon SES (SMTP) | sending domain = `yourbusiness.com` |

SSL/HTTPS is automatic on all the hosts above once the custom domain is attached.

## 1. Database
Create a PostgreSQL database and copy its connection string into `DATABASE_URL`. Set `DATABASE_SSL=true`
for managed databases. Enable the provider's automated backups (the leads are the business's asset).
Tables are created automatically on first start.

## 2. Deploy the API
**Docker (any host):** `docker build -t lead-api backend && docker run -p 5000:5000 --env-file backend/.env lead-api`

**Render/Railway (no Docker needed):** root directory `backend`, build `npm ci && npm run build`, start `npm start`,
health check path `/api/health`. Add environment variables from `.env.example`. Minimum for production:

```
NODE_ENV=production        TRUST_PROXY=1
DATABASE_URL=...           DATABASE_SSL=true
JWT_SECRET=<48+ random bytes>
ALLOWED_ORIGINS=https://www.yourbusiness.com,https://yourbusiness.com
SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS
NOTIFICATION_RECIPIENT_EMAIL=<owner email(s)>
NOTIFICATION_FROM_EMAIL=leads@yourbusiness.com
ADMIN_EMAIL + ADMIN_PASSWORD  (first start only, then delete ADMIN_PASSWORD)
```
The server refuses to start in production if the placeholder secret, SMTP host or recipient is missing.

Free-tier hosts that sleep when idle delay the first request; use an always-on plan for a lead-generation site.

## 3. Deploy the frontend
Build with `VITE_API_BASE_URL=https://api.yourbusiness.com/api VITE_SITE_URL=https://www.yourbusiness.com npm run build`
and publish `frontend/dist`. Enable SPA fallback (all routes → `index.html`) so `/admin`, `/contact`, etc. work on refresh.

## 4. DNS (at the domain registrar / DNS provider)
| Record | Name | Value |
| :--- | :--- | :--- |
| CNAME | `www` | frontend host's target |
| ALIAS/ANAME or A | `@` | frontend host (or redirect apex → www) |
| CNAME | `api` | API host's target |

Attach each custom domain in the host's dashboard; certificates are issued automatically.

## 5. Email authentication (SPF, DKIM, DMARC) — required for reliable delivery
In your email provider add and verify your sending domain; it shows the exact records. They look like:

| Type | Name | Purpose |
| :--- | :--- | :--- |
| TXT | `@` | **SPF** — e.g. `v=spf1 include:<provider-spf> ~all` (only ONE SPF record per domain; merge includes) |
| TXT/CNAME | `<selector>._domainkey` | **DKIM** — public key supplied by the provider |
| TXT | `_dmarc` | **DMARC** — start with `v=DMARC1; p=none; rua=mailto:you@yourbusiness.com`, move to `quarantine` after a few weeks of clean reports |

`NOTIFICATION_FROM_EMAIL` must be an address on that verified domain. Because notifications set
`Reply-To` to the enquirer, the owner can reply straight from their inbox.

## 6. Create the admin and test
1. Admin exists (`ADMIN_EMAIL`/`ADMIN_PASSWORD` on first boot, or `npm run create-admin:prod -- email 'password'`).
2. `curl https://api.yourbusiness.com/api/health` → `"status":"ok"`.
3. Submit a real enquiry from the live site → confirm: lead appears in the dashboard, notification email arrives
   in the owner's inbox (not spam), `notificationStatus` is `sent`.
4. Check the email headers show `spf=pass dkim=pass dmarc=pass` (Gmail → ⋮ → *Show original*).
5. Export CSV and open in Excel.
6. Test on a phone and desktop.

## 7. Go-live checklist
- [ ] HTTPS padlock on `www` and `api`; HTTP redirects to HTTPS
- [ ] `ALLOWED_ORIGINS` lists only the real site origins
- [ ] `JWT_SECRET` is random and not shared; `ADMIN_PASSWORD` removed from env
- [ ] DB backups enabled
- [ ] SPF/DKIM/DMARC pass
- [ ] Test lead received by email **and** visible in admin
- [ ] Rate limit/honeypot confirmed (11th submission within an hour returns 429)
- [ ] Privacy Policy & cookie wording match what is actually collected (only the form fields; no analytics cookies unless added)
- [ ] Credentials (host, DB, email provider, domain registrar, admin login) handed to the client

## 8. Operating notes for the client
- **View leads:** log in at `/admin`; filter, search, change status, add notes, export CSV.
- **Add another notification recipient:** comma-separate addresses in `NOTIFICATION_RECIPIENT_EMAIL`.
- **Reset admin password:** `npm run create-admin:prod -- email 'new-password'` (same email resets it).
- **Data retention (GDPR):** delete leads you no longer need (SQL: `DELETE FROM leads WHERE created_at < NOW() - INTERVAL '24 months';`) and honour erasure requests by deleting that lead's row.
