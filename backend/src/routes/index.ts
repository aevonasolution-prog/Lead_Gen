import { Router } from 'express';
import { health } from '../controllers/healthController';
import { asyncHandler } from './asyncHandler';
import { authRoutes } from './authRoutes';
import { leadRoutes } from './leadRoutes';

export interface RouteOptions {
  leadLimit?: number;
  loginLimit?: number;
}

export function apiRouter(opts: RouteOptions = {}) {
  const r = Router();
  r.get('/health', asyncHandler(health));
  r.use('/auth', authRoutes(opts));
  r.use('/leads', leadRoutes(opts));
  return r;
}
