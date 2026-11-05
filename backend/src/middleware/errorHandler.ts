import { NextFunction, Request, Response } from 'express';
import { logger } from '../config/logger';
import { AppError } from '../utils/errors';
import { errorResponse } from '../utils/response';

export function notFound(_req: Request, res: Response) {
  return errorResponse(res, 404, 'The requested endpoint does not exist');
}

// Express identifies error handlers by their 4-argument signature.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return errorResponse(res, err.statusCode, err.message, err.errors);
  }
  const e = err as { type?: string; status?: number };
  if (e?.type === 'entity.parse.failed') return errorResponse(res, 400, 'Request body contains invalid JSON');
  if (e?.type === 'entity.too.large') return errorResponse(res, 413, 'Request body is too large');

  logger.error('Unhandled error', { error: err instanceof Error ? err.message : String(err) });
  return errorResponse(res, 500, 'An unexpected error occurred. Please try again later.');
}
