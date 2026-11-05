import { Request, Response } from 'express';
import { logger } from '../config/logger';
import { toLeadDto, toPublicLeadDto } from '../models/leadModel';
import { dispatchNotification } from '../services/notificationService';
import * as leadService from '../services/leadService';
import { isHoneypotTripped, verifyTurnstile } from '../services/spamService';
import { ValidationError } from '../utils/errors';
import { successResponse } from '../utils/response';

const SUCCESS_MESSAGE = 'Enquiry submitted successfully. A specialist will review your request shortly.';

export async function createLead(req: Request, res: Response) {
  const input = req.body as import('../validators/leadValidators').CreateLeadInput;

  // Honeypot: pretend success so bots don't learn they were detected. Nothing is stored or emailed.
  if (isHoneypotTripped(input.website)) {
    logger.warn('Honeypot triggered; submission discarded');
    const now = new Date().toISOString();
    return successResponse(res, 201, SUCCESS_MESSAGE, {
      id: 'LEAD-PENDING',
      fullName: input.fullName,
      email: input.email,
      phone: input.phone,
      location: input.location,
      serviceRequired: input.serviceRequired,
      message: input.message,
      status: 'new',
      createdAt: now,
      updatedAt: now,
    });
  }

  if (!(await verifyTurnstile(input.turnstileToken, req.ip))) {
    throw new ValidationError({ turnstileToken: ['Spam check failed. Please refresh the page and try again.'] });
  }

  const { lead, duplicate } = await leadService.createLead(input);
  if (!duplicate) void dispatchNotification(lead);

  return successResponse(res, 201, SUCCESS_MESSAGE, toPublicLeadDto(lead));
}

export async function listLeads(_req: Request, res: Response) {
  const { page, limit, sortBy, order, ...filters } = res.locals.query;
  const { rows, meta } = await leadService.listLeads(filters, { page, limit, sortBy, order });
  return successResponse(res, 200, 'Leads retrieved successfully', rows.map(toLeadDto), meta);
}

export async function getLead(req: Request, res: Response) {
  const { lead, history } = await leadService.getLeadWithHistory(req.params.id);
  return successResponse(res, 200, 'Lead details retrieved', { ...toLeadDto(lead), history });
}

export async function updateLead(req: Request, res: Response) {
  const lead = await leadService.updateLead(req.params.id, req.body, req.admin!.email);
  // Superset of the contract (id, status, notes, updatedAt): the dashboard gets the full record back.
  return successResponse(res, 200, 'Lead updated successfully', toLeadDto(lead));
}

export async function exportLeads(req: Request, res: Response) {
  const { csv } = await leadService.exportLeadsCsv(res.locals.query, req.admin!.email);
  const date = new Date().toISOString().slice(0, 10);
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="leads_export_${date}.csv"`);
  res.status(200).send(csv);
}
