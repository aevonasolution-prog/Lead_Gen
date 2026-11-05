import { rateLimit } from 'express-rate-limit';
import { env } from '../config/env';
import { errorResponse } from '../utils/response';

const make = (windowMs: number, limit: number, message: string, skipSuccessfulRequests = false) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    skipSuccessfulRequests,
    handler: (_req, res) => errorResponse(res, 429, message),
  });

export const globalLimiter = () =>
  make(env.RATE_LIMIT_WINDOW_MS, env.RATE_LIMIT_MAX_REQUESTS_PER_IP, 'Too many requests. Please slow down and try again shortly.');

/** Public form: default 10 submissions per IP per hour. */
export const leadSubmissionLimiter = (max = env.LEAD_SUBMISSION_MAX_PER_HOUR) =>
  make(60 * 60 * 1000, max, 'Too many enquiries submitted from this connection. Please try again later or call us directly.');

/** Brute-force protection: only failed attempts count. */
export const loginLimiter = (max = env.LOGIN_MAX_ATTEMPTS_PER_15_MIN) =>
  make(15 * 60 * 1000, max, 'Too many failed login attempts. Please try again in 15 minutes.', true);
