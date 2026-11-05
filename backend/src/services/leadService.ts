import { auditModel } from '../models/auditModel';
import { LeadFilters, LeadRow, leadModel } from '../models/leadModel';
import { LeadStatus, MAX_EXPORT_ROWS, SERVICE_NAMES, SortKey } from '../utils/constants';
import { NotFoundError } from '../utils/errors';
import { toCsv } from '../utils/csv';
import { CreateLeadInput } from '../validators/leadValidators';

const DUPLICATE_WINDOW_MS = 10 * 60 * 1000;

export async function createLead(input: CreateLeadInput): Promise<{ lead: LeadRow; duplicate: boolean }> {
  const existing = await leadModel.findRecentDuplicate(
    input.email,
    input.serviceRequired,
    new Date(Date.now() - DUPLICATE_WINDOW_MS)
  );
  // Same person + same service within 10 minutes = double-click / retry: don't create or notify twice.
  if (existing) return { lead: existing, duplicate: true };

  const id = await leadModel.nextId();
  const lead = await leadModel.insert(id, {
    fullName: input.fullName,
    email: input.email,
    phone: input.phone,
    location: input.location,
    serviceRequired: input.serviceRequired,
    message: input.message ?? '',
    consentGiven: input.consent,
  });
  await auditModel.record(id, 'created', 'public');
  return { lead, duplicate: false };
}

export async function listLeads(
  filters: LeadFilters,
  opts: { page: number; limit: number; sortBy: SortKey; order: 'asc' | 'desc' }
) {
  const { rows, total } = await leadModel.list(filters, opts);
  return { rows, meta: { total, page: opts.page, limit: opts.limit, totalPages: Math.max(1, Math.ceil(total / opts.limit)) } };
}

export async function getLeadWithHistory(id: string) {
  const lead = await leadModel.findById(id);
  if (!lead) throw new NotFoundError('No lead exists with the requested identifier');
  return { lead, history: await auditModel.forLead(id) };
}

export async function updateLead(id: string, patch: { status?: LeadStatus; notes?: string }, actor: string) {
  const before = await leadModel.findById(id);
  if (!before) throw new NotFoundError('Lead record does not exist');

  const after = (await leadModel.update(id, patch)) as LeadRow;
  if (patch.status !== undefined && patch.status !== before.status) {
    await auditModel.record(id, 'status_changed', actor, { from: before.status, to: patch.status });
  }
  if (patch.notes !== undefined && patch.notes !== before.notes) {
    await auditModel.record(id, 'notes_updated', actor);
  }
  return after;
}

export async function exportLeadsCsv(filters: LeadFilters, actor: string): Promise<{ csv: string; count: number }> {
  const rows = await leadModel.listAll(filters, MAX_EXPORT_ROWS);
  const headers = ['Lead ID', 'Submitted (UTC)', 'Full Name', 'Email', 'Phone', 'Location', 'Service', 'Message', 'Status', 'Notes', 'Last Updated (UTC)'];
  const csv = toCsv(
    headers,
    rows.map((r) => [
      r.id,
      new Date(r.created_at).toISOString(),
      r.full_name,
      r.email,
      r.phone,
      r.location,
      SERVICE_NAMES[r.service_required] ?? r.service_required,
      r.message,
      r.status,
      r.notes,
      new Date(r.updated_at).toISOString(),
    ])
  );
  await auditModel.record(null, 'exported', actor, {
    count: rows.length,
    filters: { status: filters.status, service: filters.service, hasSearch: Boolean(filters.search) },
  });
  return { csv, count: rows.length };
}
