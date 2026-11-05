import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodTypeAny } from 'zod';
import { ValidationError } from '../utils/errors';

export function zodToErrors(err: ZodError): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const issue of err.issues) {
    const key = issue.path.length ? String(issue.path[0]) : 'body';
    const list = (out[key] ??= []);
    if (!list.includes(issue.message)) list.push(issue.message);
  }
  return out;
}

export const validateBody = (schema: ZodTypeAny) => (req: Request, _res: Response, next: NextFunction) => {
  const r = schema.safeParse(req.body ?? {});
  if (!r.success) return next(new ValidationError(zodToErrors(r.error)));
  req.body = r.data;
  next();
};

/** Parsed query is exposed on res.locals.query (req.query stays untouched). */
export const validateQuery = (schema: ZodTypeAny) => (req: Request, res: Response, next: NextFunction) => {
  const r = schema.safeParse(req.query);
  if (!r.success) return next(new ValidationError(zodToErrors(r.error), 'Invalid query parameters'));
  res.locals.query = r.data;
  next();
};
