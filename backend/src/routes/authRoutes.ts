import { Router } from 'express';
import * as ctrl from '../controllers/authController';
import { authGuard } from '../middleware/authGuard';
import { loginLimiter } from '../middleware/rateLimiter';
import { loginSchema } from '../validators/authValidators';
import { validateBody } from '../validators/validate';
import { asyncHandler } from './asyncHandler';

export function authRoutes(opts: { loginLimit?: number } = {}) {
  const r = Router();
  r.post('/login', loginLimiter(opts.loginLimit), validateBody(loginSchema), asyncHandler(ctrl.login));
  r.get('/me', authGuard, asyncHandler(ctrl.me));
  return r;
}
