import { Router } from 'express';
import * as ctrl from '../controllers/leadController';
import { authGuard } from '../middleware/authGuard';
import { leadSubmissionLimiter } from '../middleware/rateLimiter';
import { NotFoundError } from '../utils/errors';
import { createLeadSchema, exportLeadsQuerySchema, listLeadsQuerySchema, updateLeadSchema } from '../validators/leadValidators';
import { validateBody, validateQuery } from '../validators/validate';
import { asyncHandler } from './asyncHandler';

export function leadRoutes(opts: { leadLimit?: number } = {}) {
  const r = Router();

  // Public
  r.post('/', leadSubmissionLimiter(opts.leadLimit), validateBody(createLeadSchema), asyncHandler(ctrl.createLead));

  // Admin (declare /export before /:id)
  r.get('/', authGuard, validateQuery(listLeadsQuerySchema), asyncHandler(ctrl.listLeads));
  r.get('/export', authGuard, validateQuery(exportLeadsQuerySchema), asyncHandler(ctrl.exportLeads));

  r.param('id', (_req, _res, next, id) => (/^[A-Za-z0-9_-]{1,64}$/.test(id) ? next() : next(new NotFoundError('No lead exists with the requested identifier'))));
  r.get('/:id', authGuard, asyncHandler(ctrl.getLead));
  r.patch('/:id', authGuard, validateBody(updateLeadSchema), asyncHandler(ctrl.updateLead));
  return r;
}
