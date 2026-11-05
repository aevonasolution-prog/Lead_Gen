import { NextFunction, Request, Response } from 'express';
import { logger } from '../config/logger';

/** Logs method, path (without query string / PII) and status. */
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  res.on('finish', () => {
    logger.info('request', {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      ms: Date.now() - start,
    });
  });
  next();
}
