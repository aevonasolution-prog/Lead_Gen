import { env } from '../config/env';
import { logger } from '../config/logger';
import { LeadRow, leadModel } from '../models/leadModel';
import { SERVICE_NAMES } from '../utils/constants';
import { escapeHtml } from '../utils/sanitize';
import { sendMail } from './emailService';

const MAX_ATTEMPTS = 5;
const RETRY_AFTER_MS = 4 * 60 * 1000;

function buildEmail(lead: LeadRow) {
  const service = SERVICE_NAMES[lead.service_required] ?? lead.service_required;
  const submitted = new Date(lead.created_at).toUTCString();
  const rows: Array<[string, string]> = [
    ['Reference', lead.id],
    ['Full name', lead.full_name],
    ['Email', lead.email],
    ['Phone', lead.phone],
    ['Location / postcode', lead.location],
    ['Service required', service],
    ['Message', lead.message || '(none provided)'],
    ['Submitted', submitted],
  ];

  const text = [`New website enquiry (${lead.id})`, '', ...rows.map(([k, v]) => `${k}: ${v}`), '', 'Reply to this email to respond directly to the enquirer.'].join('\n');

  const html = `<!doctype html><html><body style="font-family:Arial,Helvetica,sans-serif;color:#1f2937;line-height:1.5">
<h2 style="margin:0 0 12px">New website enquiry</h2>
<table cellpadding="8" cellspacing="0" style="border-collapse:collapse;border:1px solid #e5e7eb">
${rows
  .map(
    ([k, v]) =>
      `<tr><td style="background:#f9fafb;border:1px solid #e5e7eb;font-weight:bold;white-space:nowrap;vertical-align:top">${escapeHtml(k)}</td><td style="border:1px solid #e5e7eb;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`
  )
  .join('\n')}
</table>
<p style="color:#6b7280;font-size:13px">Reply to this email to respond directly to the enquirer.</p>
</body></html>`;

  return { subject: `New enquiry: ${lead.full_name} – ${service} (${lead.id})`, text, html };
}

/** Sends the notification and records the outcome. Never throws. */
export async function notifyLead(lead: LeadRow): Promise<boolean> {
  try {
    const { subject, text, html } = buildEmail(lead);
    await sendMail({ to: env.notificationRecipients, subject, text, html, replyTo: lead.email });
    await leadModel.markNotification(lead.id, 'sent');
    logger.info('Lead notification sent', { leadId: lead.id });
    return true;
  } catch (err) {
    logger.error('Lead notification failed', { leadId: lead.id, error: err instanceof Error ? err.message : String(err) });
    try {
      await leadModel.markNotification(lead.id, 'failed');
    } catch {
      /* DB unavailable: sweeper will pick it up later */
    }
    return false;
  }
}

/** Fire-and-forget: the visitor never waits on (or sees failures of) the email. */
export function dispatchNotification(lead: LeadRow): Promise<boolean> {
  return notifyLead(lead);
}

export async function retryDueNotifications(): Promise<number> {
  const due = await leadModel.findNotificationsDue(MAX_ATTEMPTS, new Date(Date.now() - RETRY_AFTER_MS));
  let sent = 0;
  for (const lead of due) if (await notifyLead(lead)) sent += 1;
  return sent;
}

let timer: NodeJS.Timeout | null = null;

export function startNotificationRetryLoop() {
  if (timer || env.NOTIFICATION_RETRY_INTERVAL_MS === 0) return;
  timer = setInterval(() => {
    retryDueNotifications().catch((e) => logger.error('Notification retry sweep failed', { error: String(e) }));
  }, env.NOTIFICATION_RETRY_INTERVAL_MS);
  timer.unref();
}

export function stopNotificationRetryLoop() {
  if (timer) clearInterval(timer);
  timer = null;
}
