import { query } from '../config/database';
import { LeadStatus, ServiceCategory, SERVICE_NAMES, SORT_COLUMNS, SortKey } from '../utils/constants';
import { escapeLike } from '../utils/sanitize';

export interface LeadRow {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  location: string;
  service_required: ServiceCategory;
  message: string;
  status: LeadStatus;
  notes: string;
  consent_given: boolean;
  notification_status: 'pending' | 'sent' | 'failed';
  notification_attempts: number;
  last_notification_attempt_at: Date | null;
  notified_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

/** Shape returned to the admin dashboard (matches API_CONTRACTS.md). */
export interface LeadDto {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  serviceRequired: ServiceCategory;
  serviceName: string;
  message: string;
  status: LeadStatus;
  notes: string;
  notificationStatus: 'pending' | 'sent' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export const toLeadDto = (r: LeadRow): LeadDto => ({
  id: r.id,
  fullName: r.full_name,
  email: r.email,
  phone: r.phone,
  location: r.location,
  serviceRequired: r.service_required,
  serviceName: SERVICE_NAMES[r.service_required] ?? r.service_required,
  message: r.message,
  status: r.status,
  notes: r.notes,
  notificationStatus: r.notification_status,
  createdAt: new Date(r.created_at).toISOString(),
  updatedAt: new Date(r.updated_at).toISOString(),
});

/** Minimal shape returned to the public after submitting the form (no internal fields). */
export const toPublicLeadDto = (r: LeadRow) => ({
  id: r.id,
  fullName: r.full_name,
  email: r.email,
  phone: r.phone,
  location: r.location,
  serviceRequired: r.service_required,
  serviceName: SERVICE_NAMES[r.service_required] ?? r.service_required,
  message: r.message,
  status: r.status,
  createdAt: new Date(r.created_at).toISOString(),
  updatedAt: new Date(r.updated_at).toISOString(),
});

export interface LeadFilters {
  status?: LeadStatus;
  service?: ServiceCategory;
  search?: string;
  startDate?: Date;
  endDate?: Date;
}

function buildWhere(f: LeadFilters) {
  const clauses: string[] = [];
  const params: unknown[] = [];
  const add = (sql: string, value: unknown) => {
    params.push(value);
    clauses.push(sql.replace('$$', `$${params.length}`));
  };

  if (f.status) add('status = $$', f.status);
  if (f.service) add('service_required = $$', f.service);
  if (f.startDate) add('created_at >= $$', f.startDate);
  if (f.endDate) add('created_at <= $$', f.endDate);
  if (f.search) {
    params.push(`%${escapeLike(f.search)}%`);
    const p = `$${params.length}`;
    clauses.push(
      `(full_name ILIKE ${p} OR email ILIKE ${p} OR phone ILIKE ${p} OR location ILIKE ${p} OR id ILIKE ${p})`
    );
  }
  return { where: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '', params };
}

export interface NewLead {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  serviceRequired: ServiceCategory;
  message: string;
  consentGiven: boolean;
}

export const leadModel = {
  async nextId(): Promise<string> {
    const year = new Date().getUTCFullYear();
    const r = await query<{ last_value: number }>(
      `INSERT INTO lead_counters (year, last_value) VALUES ($1, 1)
       ON CONFLICT (year) DO UPDATE SET last_value = lead_counters.last_value + 1
       RETURNING last_value`,
      [year]
    );
    return `LEAD-${year}-${String(r.rows[0].last_value).padStart(3, '0')}`;
  },

  async insert(id: string, l: NewLead): Promise<LeadRow> {
    const r = await query<LeadRow>(
      `INSERT INTO leads (id, full_name, email, phone, location, service_required, message, consent_given)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [id, l.fullName, l.email, l.phone, l.location, l.serviceRequired, l.message, l.consentGiven]
    );
    return r.rows[0];
  },

  async findById(id: string): Promise<LeadRow | null> {
    const r = await query<LeadRow>('SELECT * FROM leads WHERE id = $1', [id]);
    return r.rows[0] ?? null;
  },

  /** Used for duplicate-submission suppression (double clicks, retries). */
  async findRecentDuplicate(email: string, service: ServiceCategory, since: Date): Promise<LeadRow | null> {
    const r = await query<LeadRow>(
      `SELECT * FROM leads WHERE email = $1 AND service_required = $2 AND created_at >= $3
       ORDER BY created_at DESC LIMIT 1`,
      [email, service, since]
    );
    return r.rows[0] ?? null;
  },

  async list(
    f: LeadFilters,
    opts: { page: number; limit: number; sortBy: SortKey; order: 'asc' | 'desc' }
  ): Promise<{ rows: LeadRow[]; total: number }> {
    const { where, params } = buildWhere(f);
    const total = await query<{ count: string }>(`SELECT COUNT(*) AS count FROM leads ${where}`, params);
    const col = SORT_COLUMNS[opts.sortBy];
    const dir = opts.order === 'asc' ? 'ASC' : 'DESC';
    const rows = await query<LeadRow>(
      `SELECT * FROM leads ${where} ORDER BY ${col} ${dir}, id DESC LIMIT ${opts.limit} OFFSET ${
        (opts.page - 1) * opts.limit
      }`,
      params
    );
    return { rows: rows.rows, total: Number(total.rows[0].count) };
  },

  async listAll(f: LeadFilters, max: number): Promise<LeadRow[]> {
    const { where, params } = buildWhere(f);
    const r = await query<LeadRow>(
      `SELECT * FROM leads ${where} ORDER BY created_at DESC, id DESC LIMIT ${max}`,
      params
    );
    return r.rows;
  },

  async update(id: string, patch: { status?: LeadStatus; notes?: string }): Promise<LeadRow | null> {
    const sets: string[] = [];
    const params: unknown[] = [];
    if (patch.status !== undefined) {
      params.push(patch.status);
      sets.push(`status = $${params.length}`);
    }
    if (patch.notes !== undefined) {
      params.push(patch.notes);
      sets.push(`notes = $${params.length}`);
    }
    params.push(new Date());
    sets.push(`updated_at = $${params.length}`);
    params.push(id);
    const r = await query<LeadRow>(
      `UPDATE leads SET ${sets.join(', ')} WHERE id = $${params.length} RETURNING *`,
      params
    );
    return r.rows[0] ?? null;
  },

  async markNotification(id: string, status: 'sent' | 'failed'): Promise<void> {
    await query(
      `UPDATE leads SET notification_status = $1,
         notification_attempts = notification_attempts + 1,
         last_notification_attempt_at = $2,
         notified_at = $3
       WHERE id = $4`,
      [status, new Date(), status === 'sent' ? new Date() : null, id]
    );
  },

  /** Leads whose notification never succeeded and are due for another attempt. */
  async findNotificationsDue(maxAttempts: number, olderThan: Date, limit = 20): Promise<LeadRow[]> {
    const r = await query<LeadRow>(
      `SELECT * FROM leads
       WHERE notification_status <> 'sent' AND notification_attempts < $1
         AND COALESCE(last_notification_attempt_at, created_at) <= $2
       ORDER BY created_at ASC LIMIT ${limit}`,
      [maxAttempts, olderThan]
    );
    return r.rows;
  },
};
