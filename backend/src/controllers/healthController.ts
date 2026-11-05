import { Request, Response } from 'express';
import { query } from '../config/database';
import { errorResponse, successResponse } from '../utils/response';

export async function health(_req: Request, res: Response) {
  try {
    await query('SELECT 1');
    return successResponse(res, 200, 'OK', { status: 'ok', uptime: Math.round(process.uptime()) });
  } catch {
    return errorResponse(res, 503, 'Database unavailable');
  }
}
