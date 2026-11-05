import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../services/authService';
import { ForbiddenError, UnauthorizedError } from '../utils/errors';

export function authGuard(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization ?? '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) return next(new UnauthorizedError('Authentication token is missing'));

  const claims = verifyToken(token);
  if (!claims) return next(new UnauthorizedError('Authentication token is invalid or has expired'));
  if (claims.role !== 'admin') return next(new ForbiddenError());

  req.admin = { id: Number(claims.sub), email: claims.email };
  next();
}
