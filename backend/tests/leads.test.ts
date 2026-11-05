import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createApp } from '../src/app';
import { query } from '../src/config/database';
import { ADMIN, freshDb, validLead } from './helpers';

vi.mock('../src/services/emailService', () => ({
  sendMail: vi.fn().mockResolvedValue(undefined),
  fromAddress: () => ({ name: 'x', address: 'x@example.com' }),
  verifySmtp: vi.fn(),
}));
import { sendMail } from '../src/services/emailService';

const app = createApp({ leadLimit: 1000, loginLimit: 1000 });
const mail = vi.mocked(sendMail);

async function token() {
  const r = await request(app).post('/api/auth/login').send(ADMIN);
  return r.body.data.token as string;
}
const waitFor = async (fn: () => boolean) => {
  for (let i = 0; i < 50 && !fn(); i++) await new Promise((r) => setTimeout(r, 10));
};

beforeEach(async () => {
  await freshDb();
  mail.mockReset();
  mail.mockResolvedValue(undefined);
});

describe('POST /api/leads', () => {
  it('stores a valid lead, returns contract shape and sends the notification email', async () => {
    const res = await request(app).post('/api/leads').send(validLead());
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ success: true, statusCode: 201 });
    expect(res.body.data).toMatchObject({
      id: expect.stringMatching(/^LEAD-\d{4}-001$/),
      email: 'e.vance@apexlogistics.example.co.uk',
      serviceName: 'Enterprise Infrastructure Solutions',
      status: 'new',
    });
    expect(res.body.data.notes).toBeUndefined();

    await waitFor(() => mail.mock.calls.length > 0);
    expect(mail).toHaveBeenCalledTimes(1);
    const sent = mail.mock.calls[0][0];
    expect(sent.to).toEqual(['owner@example.com']);
    expect(sent.replyTo).toBe('e.vance@apexlogistics.example.co.uk');
    expect(sent.subject).toContain('Eleanor Vance');
    await new Promise((r) => setTimeout(r, 50));
    const row = await query('SELECT notification_status FROM leads');
    expect(row.rows[0].notification_status).toBe('sent');
  });

  it('rejects invalid input with field-level errors (400)', async () => {
    const res = await request(app).post('/api/leads').send({ fullName: 'A', email: 'nope', phone: '123', serviceRequired: 'x' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(Object.keys(res.body.errors)).toEqual(expect.arrayContaining(['fullName', 'email', 'phone', 'location', 'serviceRequired']));
    expect(res.body.timestamp).toBeTruthy();
  });

  it('strips HTML tags from the message before storing it', async () => {
    await request(app).post('/api/leads').send(validLead({ message: 'Hello <script>alert(1)</script> world' }));
    const r = await query('SELECT message FROM leads');
    expect(r.rows[0].message).toBe('Hello alert(1) world');
  });

  it('silently discards honeypot submissions (fake 201, nothing stored or emailed)', async () => {
    const res = await request(app).post('/api/leads').send(validLead({ website: 'http://spam.example' }));
    expect(res.status).toBe(201);
    expect((await query('SELECT * FROM leads')).rows).toHaveLength(0);
    expect(mail).not.toHaveBeenCalled();
  });

  it('suppresses duplicate submissions within 10 minutes', async () => {
    const a = await request(app).post('/api/leads').send(validLead());
    const b = await request(app).post('/api/leads').send(validLead());
    expect(b.body.data.id).toBe(a.body.data.id);
    expect((await query('SELECT * FROM leads')).rows).toHaveLength(1);
    await waitFor(() => mail.mock.calls.length > 0);
    expect(mail).toHaveBeenCalledTimes(1);
  });

  it('still saves the lead when the email fails, and marks it failed for retry', async () => {
    mail.mockRejectedValue(new Error('SMTP down'));
    const res = await request(app).post('/api/leads').send(validLead());
    expect(res.status).toBe(201);
    await waitFor(() => mail.mock.calls.length > 0);
    await new Promise((r) => setTimeout(r, 50));
    const row = await query('SELECT notification_status, notification_attempts FROM leads');
    expect(row.rows[0]).toMatchObject({ notification_status: 'failed', notification_attempts: 1 });
  });

  it('retry sweep re-sends failed notifications once SMTP recovers', async () => {
    mail.mockRejectedValueOnce(new Error('SMTP down'));
    await request(app).post('/api/leads').send(validLead());
    await new Promise((r) => setTimeout(r, 80));
    expect((await query('SELECT notification_status FROM leads')).rows[0].notification_status).toBe('failed');

    await query("UPDATE leads SET last_notification_attempt_at = NOW() - INTERVAL '1 hour'");
    const { retryDueNotifications } = await import('../src/services/notificationService');
    expect(await retryDueNotifications()).toBe(1);
    const row = (await query('SELECT notification_status, notification_attempts FROM leads')).rows[0];
    expect(row).toMatchObject({ notification_status: 'sent', notification_attempts: 2 });
  });

  it('enforces the per-IP rate limit (429)', async () => {
    const limited = createApp({ leadLimit: 2, loginLimit: 1000 });
    const post = (i: number) => request(limited).post('/api/leads').send(validLead({ email: `u${i}@example.com` }));
    expect((await post(1)).status).toBe(201);
    expect((await post(2)).status).toBe(201);
    const third = await post(3);
    expect(third.status).toBe(429);
    expect(third.body.success).toBe(false);
  });

  it('returns 400 for malformed JSON', async () => {
    const res = await request(app).post('/api/leads').set('Content-Type', 'application/json').send('{bad');
    expect(res.status).toBe(400);
  });
});

describe('auth', () => {
  it('rejects admin routes without / with bad token (401)', async () => {
    expect((await request(app).get('/api/leads')).status).toBe(401);
    expect((await request(app).get('/api/leads').set('Authorization', 'Bearer garbage')).status).toBe(401);
    expect((await request(app).get('/api/leads/export')).status).toBe(401);
    expect((await request(app).patch('/api/leads/LEAD-1').send({ status: 'closed' })).status).toBe(401);
  });

  it('logs in with correct credentials, rejects wrong ones identically', async () => {
    const ok = await request(app).post('/api/auth/login').send(ADMIN);
    expect(ok.status).toBe(200);
    expect(ok.body.data.token).toBeTruthy();
    const badPw = await request(app).post('/api/auth/login').send({ email: ADMIN.email, password: 'wrong-password' });
    const badUser = await request(app).post('/api/auth/login').send({ email: 'x@example.com', password: 'wrong-password' });
    expect(badPw.status).toBe(401);
    expect(badUser.status).toBe(401);
    expect(badPw.body.message).toBe(badUser.body.message);
    const me = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${ok.body.data.token}`);
    expect(me.body.data.email).toBe(ADMIN.email);
  });

  it('rate-limits failed logins', async () => {
    const limited = createApp({ leadLimit: 1000, loginLimit: 3 });
    for (let i = 0; i < 3; i++) await request(limited).post('/api/auth/login').send({ email: ADMIN.email, password: 'wrong-password' });
    const res = await request(limited).post('/api/auth/login').send({ email: ADMIN.email, password: 'wrong-password' });
    expect(res.status).toBe(429);
  });
});

describe('admin lead management', () => {
  beforeEach(async () => {
    const people = [
      ['Alice Smith', 'alice@example.com', 'consulting'],
      ['Bob Jones', 'bob@example.com', 'managed_services'],
      ['Carol White', 'carol@example.com', 'consulting'],
    ];
    for (const [fullName, email, serviceRequired] of people) {
      await request(app).post('/api/leads').send(validLead({ fullName, email, serviceRequired }));
    }
  });

  it('lists with pagination meta, filters, search and sorting', async () => {
    const t = await token();
    const auth = { Authorization: `Bearer ${t}` };
    const all = await request(app).get('/api/leads').set(auth);
    expect(all.status).toBe(200);
    expect(all.body.meta).toEqual({ total: 3, page: 1, limit: 20, totalPages: 1 });
    expect(all.body.data[0].notes).toBeDefined();

    const page = await request(app).get('/api/leads?limit=2&page=2').set(auth);
    expect(page.body.data).toHaveLength(1);
    expect(page.body.meta.totalPages).toBe(2);

    const svc = await request(app).get('/api/leads?service=consulting&status=all').set(auth);
    expect(svc.body.meta.total).toBe(2);

    const search = await request(app).get('/api/leads?search=bob').set(auth);
    expect(search.body.data.map((l: { fullName: string }) => l.fullName)).toEqual(['Bob Jones']);

    const wildcard = await request(app).get('/api/leads?search=%25').set(auth);
    expect(wildcard.body.meta.total).toBe(0);

    const sorted = await request(app).get('/api/leads?sortBy=fullName&order=asc').set(auth);
    expect(sorted.body.data[0].fullName).toBe('Alice Smith');

    expect((await request(app).get('/api/leads?limit=500').set(auth)).status).toBe(400);
    expect((await request(app).get('/api/leads?status=bogus').set(auth)).status).toBe(400);
  });

  it('gets one lead with audit history; 404 for unknown', async () => {
    const auth = { Authorization: `Bearer ${await token()}` };
    const list = await request(app).get('/api/leads').set(auth);
    const id = list.body.data[0].id;
    const one = await request(app).get(`/api/leads/${id}`).set(auth);
    expect(one.status).toBe(200);
    expect(one.body.data.history[0].action).toBe('created');
    expect((await request(app).get('/api/leads/LEAD-9999-999').set(auth)).status).toBe(404);
  });

  it('updates status/notes, records audit trail, validates input', async () => {
    const auth = { Authorization: `Bearer ${await token()}` };
    const id = (await request(app).get('/api/leads').set(auth)).body.data[0].id;
    const res = await request(app).patch(`/api/leads/${id}`).set(auth).send({ status: 'in_review', notes: 'Call Thursday' });
    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject({ id, status: 'in_review', notes: 'Call Thursday' });
    const hist = (await request(app).get(`/api/leads/${id}`).set(auth)).body.data.history;
    expect(hist.map((h: { action: string }) => h.action)).toEqual(['created', 'status_changed', 'notes_updated']);
    expect(hist[1].actor).toBe(ADMIN.email);

    expect((await request(app).patch(`/api/leads/${id}`).set(auth).send({ status: 'nonsense' })).status).toBe(400);
    expect((await request(app).patch(`/api/leads/${id}`).set(auth).send({})).status).toBe(400);
    expect((await request(app).patch('/api/leads/LEAD-9999-999').set(auth).send({ status: 'closed' })).status).toBe(404);
  });

  it('exports RFC-4180 CSV with BOM, honours filters, neutralises formulas, audits the export', async () => {
    const auth = { Authorization: `Bearer ${await token()}` };
    await request(app).post('/api/leads').send(validLead({ email: 'evil@example.com', message: '=HYPERLINK("http://x")\nsecond, line' }));

    const res = await request(app).get('/api/leads/export?service=consulting').set(auth);
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/csv');
    expect(res.headers['content-disposition']).toMatch(/attachment; filename="leads_export_\d{4}-\d{2}-\d{2}\.csv"/);
    const body = res.text;
    expect(body.charCodeAt(0)).toBe(0xfeff);
    expect(body.split('\r\n').filter(Boolean)).toHaveLength(3); // header + 2 consulting leads
    expect(body).toContain('"Lead ID","Submitted (UTC)"');

    const all = (await request(app).get('/api/leads/export').set(auth)).text;
    expect(all).toContain(`"'=HYPERLINK(""http://x"")\nsecond, line"`);
    expect(all).toContain('"+44 20 7946 0192"');

    const audit = await query("SELECT * FROM lead_audit_log WHERE action = 'exported'");
    expect(audit.rows).toHaveLength(2);
  });
});

describe('misc', () => {
  it('health check and 404 envelope', async () => {
    expect((await request(app).get('/api/health')).body.data.status).toBe('ok');
    const nf = await request(app).get('/api/nope');
    expect(nf.status).toBe(404);
    expect(nf.body.success).toBe(false);
  });

  it('CORS allows only configured origins', async () => {
    const ok = await request(app).options('/api/leads').set('Origin', 'http://localhost:3000').set('Access-Control-Request-Method', 'POST');
    expect(ok.headers['access-control-allow-origin']).toBe('http://localhost:3000');
    const bad = await request(app).options('/api/leads').set('Origin', 'http://evil.example').set('Access-Control-Request-Method', 'POST');
    expect(bad.headers['access-control-allow-origin']).toBeUndefined();
  });
});
