import { Request, Response } from 'express';
import * as authService from '../services/authService';
import { successResponse } from '../utils/response';

export async function login(req: Request, res: Response) {
  const result = await authService.login(req.body.email, req.body.password);
  return successResponse(res, 200, 'Login successful', result);
}

export async function me(req: Request, res: Response) {
  return successResponse(res, 200, 'Authenticated', { id: req.admin!.id, email: req.admin!.email, role: 'admin' });
}
