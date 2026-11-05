import { query } from '../config/database';

export interface AuditRow {
  id: number;
  lead_id: string | null;
  action: string;
  actor: string;
  details: string;
  created_at: Date;
}

export const auditModel = {
  async record(leadId: string | null, action: string, actor: string, details: Record<string, unknown> = {}) {
    await query('INSERT INTO lead_audit_log (lead_id, action, actor, details) VALUES ($1,$2,$3,$4)', [
      leadId,
      action,
      actor,
      JSON.stringify(details),
    ]);
  },

  async forLead(leadId: string) {
    const r = await query<AuditRow>('SELECT * FROM lead_audit_log WHERE lead_id = $1 ORDER BY id ASC', [leadId]);
    return r.rows.map((row) => ({
      action: row.action,
      actor: row.actor,
      details: JSON.parse(row.details) as Record<string, unknown>,
      at: new Date(row.created_at).toISOString(),
    }));
  },
};
